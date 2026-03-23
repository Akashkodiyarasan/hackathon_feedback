import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { GraduationCap, Users, Building2, User, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const ProjectLanding = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useAppState();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Project not found.</p>
          <button onClick={() => navigate("/")} className="mt-4 text-primary text-sm font-medium hover:underline">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <GraduationCap className="text-primary" size={28} />
          </div>
          <h1 className="text-xl font-bold text-foreground">Project Feedback System</h1>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-5 space-y-3">
          <h2 className="font-semibold text-foreground text-lg">{project.name}</h2>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users size={13} />{project.teamName}</span>
            <span className="flex items-center gap-1"><Building2 size={13} />{project.department}</span>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/feedback/${project.id}`)}
            className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-card"
          >
            <User size={18} />
            Continue as Visitor
          </button>
          <button
            onClick={() => navigate(`/admin?redirect=/admin/review/${project.id}`)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-card"
          >
            <ShieldCheck size={18} />
            Admin Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectLanding;
