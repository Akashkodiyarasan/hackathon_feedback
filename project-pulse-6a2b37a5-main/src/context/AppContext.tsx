import React, { createContext, useContext, useState, useCallback } from "react";

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

interface AppState {
  projects: Project[];
  feedbacks: Feedback[];
  isAdmin: boolean;
  addProject: (p: Omit<Project, "id">) => void;
  updateProject: (id: string, p: Omit<Project, "id">) => void;
  deleteProject: (id: string) => void;
  addFeedback: (f: Omit<Feedback, "id" | "createdAt">) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  getFeedbacksForProject: (projectId: string) => Feedback[];
  hasSubmittedFeedback: (projectId: string) => boolean;
  markFeedbackSubmitted: (projectId: string) => void;
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
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Smart Attendance System",
      teamName: "Team Alpha",
      department: "Computer Science",
      description: "An AI-powered attendance system using facial recognition for classrooms.",
    },
    {
      id: "2",
      name: "Green Campus App",
      teamName: "Eco Warriors",
      department: "Environmental Science",
      description: "A mobile app to track and reduce carbon footprint on campus.",
    },
  ]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addProject = useCallback((p: Omit<Project, "id">) => {
    setProjects((prev) => [...prev, { ...p, id: crypto.randomUUID() }]);
  }, []);

  const updateProject = useCallback((id: string, p: Omit<Project, "id">) => {
    setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, ...p } : proj)));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
    setFeedbacks((prev) => prev.filter((f) => f.projectId !== id));
  }, []);

  const addFeedback = useCallback((f: Omit<Feedback, "id" | "createdAt">) => {
    setFeedbacks((prev) => [
      ...prev,
      { ...f, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ]);
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
        projects, feedbacks, isAdmin,
        addProject, updateProject, deleteProject,
        addFeedback, login, logout,
        getFeedbacksForProject, hasSubmittedFeedback, markFeedbackSubmitted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
