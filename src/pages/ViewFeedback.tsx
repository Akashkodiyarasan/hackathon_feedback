import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppState } from "@/context/AppContext";
import StarRating from "@/components/StarRating";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import AdminNav from "@/components/AdminNav";

const ViewFeedback = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, getFeedbacksForProject, isAdmin } = useAppState();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
    } else if (!project) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, project, navigate]);

  if (!isAdmin || !project) {
    return null;
  }

  const feedbacks = getFeedbacksForProject(project.id);
  const avgRating = feedbacks.length ? feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length : 0;
  const avgMarks = feedbacks.length ? feedbacks.reduce((s, f) => s + f.marks, 0) / feedbacks.length : 0;

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <main className="container max-w-2xl py-6 space-y-4">
        <div className="bg-card rounded-xl shadow-card p-4">
          <h2 className="font-semibold text-foreground">{project.name}</h2>
          <p className="text-xs text-muted-foreground">{project.teamName} · {project.department}</p>
          {feedbacks.length > 0 && (
            <div className="flex gap-4 mt-3 text-sm">
              <div className="bg-primary/5 px-3 py-1.5 rounded-lg">
                <span className="text-muted-foreground text-xs">Avg Rating</span>
                <p className="font-bold text-foreground">{avgRating.toFixed(1)} / 5</p>
              </div>
              <div className="bg-primary/5 px-3 py-1.5 rounded-lg">
                <span className="text-muted-foreground text-xs">Avg Marks</span>
                <p className="font-bold text-foreground">{avgMarks.toFixed(1)} / 100</p>
              </div>
            </div>
          )}
        </div>

        {feedbacks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No feedback received yet.</p>
          </div>
        ) : (
          feedbacks.map((fb, i) => (
            <motion.div
              key={fb.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl shadow-card p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <StarRating value={fb.rating} readonly size={18} />
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                  {fb.marks}/100
                </span>
              </div>
              <p className="text-sm text-foreground">{fb.comment}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(fb.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))
        )}
      </main>
    </div>
  );
};

export default ViewFeedback;
