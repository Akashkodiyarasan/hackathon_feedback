import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { Plus, MessageSquare, Users, Building2, BarChart3, Trophy, Star, Hash, Download, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useCallback } from "react";
import StarRating from "@/components/StarRating";
import { Progress } from "@/components/ui/progress";
import AdminNav from "@/components/AdminNav";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminDashboard = () => {
  const { projects, getFeedbacksForProject, feedbacks, isAdmin, deleteProject } = useAppState();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate("/admin");
    return null;
  }

  const projectStats = projects.map((project) => {
    const fb = getFeedbacksForProject(project.id);
    const avgRating = fb.length ? fb.reduce((s, f) => s + f.rating, 0) / fb.length : 0;
    const avgMarks = fb.length ? fb.reduce((s, f) => s + f.marks, 0) / fb.length : 0;
    return { ...project, feedbackCount: fb.length, avgRating, avgMarks };
  });

  const totalFeedbacks = feedbacks.length;
  const highestRated = projectStats.length ? projectStats.reduce((a, b) => (b.avgRating > a.avgRating ? b : a)) : null;
  const highestMarks = projectStats.length ? projectStats.reduce((a, b) => (b.avgMarks > a.avgMarks ? b : a)) : null;

  const summaryCards = [
    { label: "Total Projects", value: projects.length, icon: BarChart3, color: "text-primary" },
    { label: "Total Feedbacks", value: totalFeedbacks, icon: MessageSquare, color: "text-accent" },
    { label: "Highest Rated", value: highestRated?.avgRating ? `${highestRated.avgRating.toFixed(1)} ★` : "—", sub: highestRated?.name, icon: Trophy, color: "text-star" },
    { label: "Highest Marks", value: highestMarks?.avgMarks ? `${highestMarks.avgMarks.toFixed(0)} / 100` : "—", sub: highestMarks?.name, icon: Hash, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <main className="container max-w-4xl py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl shadow-card p-4 space-y-1"
            >
              <div className="flex items-center gap-2">
                <card.icon size={16} className={card.color} />
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{card.value}</p>
              {card.sub && <p className="text-xs text-muted-foreground truncate">{card.sub}</p>}
            </motion.div>
          ))}
        </div>

        {/* Add Project Button */}
        <button
          onClick={() => navigate("/admin/add-project")}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-card"
        >
          <Plus size={18} />
          Add New Project
        </button>

        {/* Project Cards */}
        {projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No projects yet. Add your first project!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projectStats.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} navigate={navigate} onDelete={deleteProject} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

interface ProjectStat {
  id: string;
  name: string;
  teamName: string;
  department: string;
  description: string;
  feedbackCount: number;
  avgRating: number;
  avgMarks: number;
}

const ProjectCard = ({ project, index, navigate, onDelete }: { project: ProjectStat; index: number; navigate: ReturnType<typeof useNavigate>; onDelete: (id: string) => void }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrUrl = `${window.location.origin}/project/${project.id}`;

  const downloadQR = useCallback(() => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "_")}_QR.png`;
    a.click();
  }, [project.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-card rounded-xl shadow-card p-5 space-y-4 transition-all duration-300 hover:shadow-xl hover:bg-primary/5 hover:border-primary/20 border border-transparent"
    >
      <div className="flex gap-4">
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground text-base">{project.name}</h3>
            <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users size={13} />{project.teamName}</span>
              <span className="flex items-center gap-1"><Building2 size={13} />{project.department}</span>
              <span className="flex items-center gap-1"><MessageSquare size={13} />{project.feedbackCount} Feedbacks</span>
            </div>
          </div>

          {project.feedbackCount > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Star size={14} className="text-star shrink-0" />
                <StarRating value={Math.round(project.avgRating)} readonly size={16} />
                <span className="text-sm font-semibold text-foreground">{project.avgRating.toFixed(1)} / 5</span>
              </div>
              <div className="flex items-center gap-3">
                <Hash size={14} className="text-success shrink-0" />
                <div className="flex-1">
                  <Progress value={project.avgMarks} className="h-2" />
                </div>
                <span className="text-sm font-semibold text-foreground w-16 text-right">{project.avgMarks.toFixed(0)} / 100</span>
              </div>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-2 shrink-0" ref={qrRef}>
          <div className="bg-background rounded-lg p-2 border border-border">
            <QRCodeCanvas value={qrUrl} size={80} level="M" />
          </div>
          <button onClick={downloadQR} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
            <Download size={12} />
            Download
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate(`/admin/feedback/${project.id}`)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <MessageSquare size={15} />
          View Feedback
        </button>
        <button onClick={() => navigate(`/admin/review/${project.id}`)} className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
          <BarChart3 size={15} />
          Analytics
        </button>
        <button onClick={() => navigate(`/admin/edit-project/${project.id}`)} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition">
          <Pencil size={15} />
          Edit
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-1.5 text-sm font-medium text-destructive hover:underline">
              <Trash2 size={15} />
              Delete
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove "{project.name}" and all its feedback. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
