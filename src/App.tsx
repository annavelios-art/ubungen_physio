import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { StoreProvider } from "./store";
import type { Page } from "./types";
import Home from "./pages/Home";
import TherapistLayout from "./pages/therapist/TherapistLayout";
import Library from "./pages/therapist/Library";
import Programs from "./pages/therapist/Programs";
import NewExercise from "./pages/therapist/NewExercise";
import PatientAccess from "./pages/patient/PatientAccess";
import PatientView from "./pages/patient/PatientView";
import TherapistLogin from "./pages/therapist/TherapistLogin";
import { supabase } from "./supabaseClient";

function pageId(page: Page): string {
  if (typeof page === "string") return page;
  return page.type;
}

function AppContent() {
  const [page, setPage] = useState<Page>("home");
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const navigate = (p: Page) => {
    if (
      (p === "therapist/library" ||
        p === "therapist/programs" ||
        p === "therapist/new-exercise" ||
        (typeof p === "object" &&
          (p.type === "therapist/edit-exercise" || p.type === "therapist/edit-online-exercise"))) &&
      !session
    ) {
      setPage("therapist/login");
      return;
    }
    setPage(p);
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setPage("home");
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Anmeldung wird geprüft …
      </div>
    );
  }

  if (page === "home") {
    return (
      <Home
        onTherapist={() => navigate("therapist/library")}
        onPatient={() => navigate("patient/access")}
      />
    );
  }

  if (page === "therapist/login") {
    if (session) {
      return <LibraryRedirect navigate={navigate} />;
    }
    return <TherapistLogin navigate={navigate} />;
  }

  if (page === "patient/access") {
    return <PatientAccess navigate={navigate} onBack={() => navigate("home")} />;
  }

  if (typeof page === "object" && page.type === "patient/view") {
    return <PatientView code={page.code} navigate={navigate} />;
  }

  if (
    page === "therapist/library" ||
    page === "therapist/programs" ||
    page === "therapist/new-exercise" ||
    (typeof page === "object" &&
      (page.type === "therapist/edit-exercise" || page.type === "therapist/edit-online-exercise"))
  ) {
    if (!session) return <TherapistLogin navigate={navigate} />;

    const currentPageId = pageId(page);

    const content = (() => {
      if (page === "therapist/library") return <Library navigate={navigate} />;
      if (page === "therapist/programs") return <Programs />;
      if (page === "therapist/new-exercise") return <NewExercise navigate={navigate} />;
      if (typeof page === "object" && page.type === "therapist/edit-exercise") {
        return <NewExercise navigate={navigate} editExerciseId={page.exerciseId} />;
      }
      if (typeof page === "object" && page.type === "therapist/edit-online-exercise") {
        return <NewExercise navigate={navigate} onlineExercise={page.exercise} />;
      }
      return null;
    })();

    return (
      <TherapistLayout
        currentPage={currentPageId}
        navigate={navigate}
        userEmail={session.user.email}
        onSignOut={handleSignOut}
      >
        {content}
      </TherapistLayout>
    );
  }

  return null;
}

function LibraryRedirect({ navigate }: { navigate: (page: Page) => void }) {
  useEffect(() => navigate("therapist/library"), [navigate]);
  return null;
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
