import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Project {
  id: string;
  name: string;
  teamName: string;
  department: string;
  description: string;
}

export interface Feedback {
  id: string;
  projectId: string;
  rating: number;
  marks: number;
  comment: string;
  createdAt: string;
}

export interface Staff {
  staffId: string;
  password: string;
  assignedStage: 1 | 2 | 3;
  staffName: string;
}

export interface Evaluation {
  id: string;
  staffId: string;
  projectId: string;
  stage: 1 | 2 | 3;
  criteriaMarks: Record<string, number>;
  subtotal: number;
  timestamp: string;
}

export interface Evacuation {
  id: string;
  staffId: string;
  projectId: string;
  stage1: number;
  stage2: number;
  stage3: number;
  total: number;
  result: "Pass" | "Fail";
  timestamp: string;
}

interface AppState {
  projects: Project[];
  feedbacks: Feedback[];
  staff: Staff[];
  evaluations: Evaluation[];
  isAdmin: boolean;
  addProject: (p: Omit<Project, "id">) => void;
  updateProject: (id: string, p: Omit<Project, "id">) => void;
  deleteProject: (id: string) => void;
  addFeedback: (f: Omit<Feedback, "id" | "createdAt">) => void;
  addEvaluation: (e: Omit<Evaluation, "id" | "timestamp">) => void;
  addEvacuation: (e: Omit<Evacuation, "id" | "timestamp">) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  getFeedbacksForProject: (projectId: string) => Feedback[];
  hasSubmittedFeedback: (projectId: string) => boolean;
  markFeedbackSubmitted: (projectId: string) => void;
  getEvaluationsForProject: (projectId: string) => Evaluation[];
  getStaffById: (staffId: string) => Staff | undefined;
  evacuations: Evacuation[];
}

const AppContext = createContext<AppState | null>(null);

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
};

const FEEDBACK_STORAGE_KEY = "pfs_submitted_feedbacks";

const getSubmittedProjects = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [evacuations, setEvacuations] = useState<Evacuation[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project));
      setProjects(projData);
    });

    const unsubFeedbacks = onSnapshot(collection(db, "feedbacks"), (snapshot) => {
      const fbData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Feedback));
      setFeedbacks(fbData);
    });

    const unsubStaff = onSnapshot(collection(db, "staff"), (snapshot) => {
      const staffData = snapshot.docs.map(d => ({ ...d.data() } as Staff));
      setStaff(staffData);
    });

    const unsubEvaluations = onSnapshot(collection(db, "evaluations"), (snapshot) => {
      const evalData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Evaluation));
      setEvaluations(evalData);
    });

    const unsubEvacuations = onSnapshot(collection(db, "evacuations"), (snapshot) => {
      const evData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Evacuation));
      setEvacuations(evData);
    });

    return () => {
      unsubProjects();
      unsubFeedbacks();
      unsubStaff();
      unsubEvaluations();
      unsubEvacuations();
    };
  }, []);

  const addProject = useCallback(async (p: Omit<Project, "id">) => {
    try {
      await addDoc(collection(db, "projects"), p);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  }, []);

  const updateProject = useCallback(async (id: string, p: Omit<Project, "id">) => {
    try {
      await updateDoc(doc(db, "projects", id), p as any);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      
      const q = query(collection(db, "feedbacks"), where("projectId", "==", id));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error deleting project and its feedbacks:", error);
    }
  }, []);

  const addFeedback = useCallback(async (f: Omit<Feedback, "id" | "createdAt">) => {
    try {
      await addDoc(collection(db, "feedbacks"), {
        ...f,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding feedback:", error);
    }
  }, []);

  const addEvaluation = useCallback(async (e: Omit<Evaluation, "id" | "timestamp">) => {
    try {
      // Use setDoc with a specific custom ID so we don't duplicate evaluations per staff&project&stage
      const { setDoc } = await import("firebase/firestore");
      await setDoc(doc(db, "evaluations", `${e.stage}_${e.staffId}_${e.projectId}`), {
        ...e,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding evaluation:", error);
    }
  }, []);

  const addEvacuation = useCallback(async (e: Omit<Evacuation, "id" | "timestamp">) => {
    try {
      await addDoc(collection(db, "evacuations"), {
        ...e,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding evacuation:", error);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (email === "admin@college.edu" && password === "admin123") {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setIsAdmin(false), []);

  const getFeedbacksForProject = useCallback(
    (projectId: string) => feedbacks.filter((f) => f.projectId === projectId),
    [feedbacks]
  );

  const getEvaluationsForProject = useCallback(
    (projectId: string) => evaluations.filter((e) => e.projectId === projectId),
    [evaluations]
  );

  const getStaffById = useCallback(
    (staffId: string) => staff.find((s) => s.staffId === staffId),
    [staff]
  );

  const hasSubmittedFeedback = useCallback((projectId: string) => {
    return getSubmittedProjects().includes(projectId);
  }, []);

  const markFeedbackSubmitted = useCallback((projectId: string) => {
    const submitted = getSubmittedProjects();
    if (!submitted.includes(projectId)) {
      submitted.push(projectId);
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(submitted));
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        projects, feedbacks, staff, evaluations, evacuations, isAdmin,
        addProject, updateProject, deleteProject,
        addFeedback, addEvaluation, addEvacuation, login, logout,
        getFeedbacksForProject, hasSubmittedFeedback, markFeedbackSubmitted,
        getEvaluationsForProject, getStaffById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
