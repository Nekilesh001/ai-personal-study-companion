import { createContext, useContext, useState } from "react";

/* ---------- TYPES ---------- */

type Profile = {
  subject: string;
  goal: string;
  level: string;
  timePerDay: number;
};

type StudyPlan = {
  id: number;
  profile: Profile;
  plan: string;
  createdAt: Date;
};

type ProgressAction = "TUTOR_SAVE" | "QUIZ_COMPLETE" | "FLASHCARDS_COMPLETE";

/* ---------- CONTEXT TYPE ---------- */

type StudyContextType = {
  profile: Profile | null;
  setProfile: (data: Profile | null) => void;

  studyPlan: string;
  setStudyPlan: (plan: string) => void;

  studyPlans: StudyPlan[];
  addStudyPlan: (profile: Profile, plan: string) => void;

  savedContent: string[];
  addToSavedContent: (content: string) => void;
  clearSavedContent: () => void;

  overallProgress: number;
  increaseProgress: (action: ProgressAction) => void;
};

/* ---------- CONTEXT ---------- */

const StudyContext = createContext<StudyContextType | null>(null);

/* ---------- PROVIDER ---------- */

export const StudyProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [studyPlan, setStudyPlan] = useState("");
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [savedContent, setSavedContent] = useState<string[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  /* ---------- STUDY PLAN ---------- */

  const addStudyPlan = (profile: Profile, plan: string) => {
    const newPlan: StudyPlan = {
      id: Date.now(),
      profile,
      plan,
      createdAt: new Date(),
    };
    setStudyPlans((prev) => [newPlan, ...prev]);
  };

  /* ---------- PROGRESS ENGINE ---------- */

  const increaseProgress = (action: ProgressAction) => {
    let increment = 0;

    switch (action) {
      case "TUTOR_SAVE":
        increment = 2;
        break;

      case "QUIZ_COMPLETE":
        increment = 10;
        break;

      case "FLASHCARDS_COMPLETE":
        increment = 5;
        break;
    }

    setOverallProgress((prev) => Math.min(100, prev + increment));
  };

  /* ---------- TUTOR MEMORY ---------- */

  const addToSavedContent = (content: string) => {
   setSavedContent((prev) => {
  if (prev.includes(content)) return prev;
  return [...prev, content];
});

increaseProgress("TUTOR_SAVE");

};

  const clearSavedContent = () => {
    setSavedContent([]);
  };

  /* ---------- PROVIDER ---------- */

  return (
    <StudyContext.Provider
      value={{
        profile,
        setProfile,
        studyPlan,
        setStudyPlan,
        studyPlans,
        addStudyPlan,
        savedContent,
        addToSavedContent,
        clearSavedContent,
        overallProgress,
        increaseProgress,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

/* ---------- HOOK ---------- */

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used inside StudyProvider");
  }
  return context;
};
