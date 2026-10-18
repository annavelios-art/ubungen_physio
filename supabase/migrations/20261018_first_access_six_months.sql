-- Physiooptima – einmalige SQL-Migration.
-- ZUERST im Supabase SQL Editor ausführen, DANACH die neue PWA veröffentlichen.
-- Vorhandene Programme/Zahlungen werden nicht gelöscht.

begin;

alter table public.patient_programs
  add column if not exists first_accessed_at timestamptz;

-- Bestandsschutz: Bei bereits existierenden Programmen kennen wir den
-- historischen ersten Zugriff nicht. Ihr bisheriges Ablaufdatum und ihre
-- Verlängerungsmöglichkeit bleiben deshalb unverändert. "created_at" ist
-- hier nur ein technischer Marker, KEIN nachträglich ermittelter Login.
update public.patient_programs
   set first_accessed_at = created_at
 where first_accessed_at is null
   and expires_at is not null;

-- Neue Programme warten bis zur ersten Code-Eingabe auf ihren Gültigkeitsbeginn.
alter table public.patient_programs
  alter column expires_at drop not null;

-- Neue RPC statt bestehende get_patient_program zu überschreiben:
-- vermeidet Konflikte mit einer ggf. anders typisierten bisherigen Funktion.
create or replace function public.get_patient_program_v2(p_access_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_program public.patient_programs%rowtype;
  v_now timestamptz := now();
  v_expires_at timestamptz;
  v_exercises jsonb;
begin
  if p_access_code is null or length(trim(p_access_code)) = 0 then
    return null;
  end if;

  -- Sperre verhindert, dass gleichzeitige erste Anmeldungen verschiedene
  -- Startdaten erzeugen. Groß-/Kleinschreibung und Trennstrich sind egal.
  select * into v_program
  from public.patient_programs p
  where upper(regexp_replace(p.access_code, '[^A-Za-z0-9]', '', 'g')) =
        upper(regexp_replace(p_access_code, '[^A-Za-z0-9]', '', 'g'))
  for update;

  if not found or v_program.is_active is distinct from true then
    return null;
  end if;

  if v_program.first_accessed_at is null then
    -- Sicherheitsnetz: bereits abgelaufene, nicht markierte Altprogramme
    -- dürfen nicht versehentlich reaktiviert werden.
    if v_program.expires_at is not null and v_program.expires_at <= v_now then
      return null;
    end if;

    v_expires_at := v_now + interval '6 months';
    update public.patient_programs
       set first_accessed_at = v_now,
           expires_at = v_expires_at
     where id = v_program.id;
  else
    v_expires_at := v_program.expires_at;
  end if;

  if v_expires_at is null or v_expires_at <= v_now then
    return null;
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', e.id,
      'title', e.title,
      'category', e.category,
      'description', e.description,
      'instructions', e.instructions,
      'reps', e.reps,
      'sets', e.sets,
      'duration', e.duration,
      'holdTime', e.hold_time,
      'thumbnailUrl', e.thumbnail_url,
      'videoUrl', e.video_url,
      'isCustom', e.is_custom,
      'isPublished', e.is_published,
      'ownerId', e.owner_id,
      'createdAt', e.created_at
    ) order by pe.sort_order
  ), '[]'::jsonb) into v_exercises
  from public.program_exercises pe
  join public.exercises e on e.id = pe.exercise_id
  where pe.program_id = v_program.id
    and e.owner_id = v_program.owner_id
    and e.is_published = true;

  return jsonb_build_object(
    'programId', v_program.id,
    'expiresAt', v_expires_at,
    'exercises', v_exercises
  );
end;
$$;

revoke all on function public.get_patient_program_v2(text) from public;
grant execute on function public.get_patient_program_v2(text) to anon, authenticated;

commit;

-- Hinweis: Nach Ablauf verweigert die RPC den Zugriff automatisch.
-- Vorhandene Programm-/Zahlungsdaten und Codes werden NICHT automatisch gelöscht,
-- damit man die bisherige Verlängerungsfunktion nutzen kann. Ein Programm kann
-- weiterhin im Therapeutenbereich gezielt gelöscht werden.
