import { useState } from "react";
import { StoreProvider } from "./store";
import type { Page } from "./types";
import Home from "./pages/Home";
import TherapistLayout from "./pages/therapist/TherapistLayout";
import Library from "./pages/therapist/Library";
import Programs from "./pages/therapist/Programs";
import NewExercise from "./pages/therapist/NewExercise";
import PatientAccess from "./pages/patient/PatientAccess";
import PatientView from "./pages/patient/PatientView";

function pageId(page: Page): string {
  if (typeof page === "string") return page;
  return page.type;
}

function AppContent() {
  const [page, setPage] = useState<Page>("home");

  const navigate = (p: Page) => setPage(p);

  if (page === "home") {
    return (
      <Home
        onTherapist={() => navigate("therapist/library")}
        onPatient={() => navigate("patient/access")}
      />
    );
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
    (typeof page === "object" && page.type === "therapist/edit-exercise")
  ) {
    const currentPageId = pageId(page);

    const content = (() => {
      if (page === "therapist/library") return <Library navigate={navigate} />;
      if (page === "therapist/programs") return <Programs />;
      if (page === "therapist/new-exercise") return <NewExercise navigate={navigate} />;
      if (typeof page === "object" && page.type === "therapist/edit-exercise") {
        return <NewExercise navigate={navigate} editExerciseId={page.exerciseId} />;
      }
      return null;
    })();

    return (
      <TherapistLayout currentPage={currentPageId} navigate={navigate}>
        {content}
      </TherapistLayout>
    );
  }

  return null;
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
