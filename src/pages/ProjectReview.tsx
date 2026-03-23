import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppState } from "@/context/AppContext";
import AdminNav from "@/components/AdminNav";
import StarRating from "@/components/StarRating";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Star, Hash, Users, Building2, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const ProjectReview = () => {
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

  // Rating distribution
  const ratingDist = [1, 2, 3, 4, 5].map((r) => ({
    stars: r,
    count: feedbacks.filter((f) => f.rating === r).length,
  }));
  const maxCount = Math.max(...ratingDist.map((d) => d.count), 1);

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <main className="container max-w-3xl py-6 space-y-4">
        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-card p-5"
        >
          <h2 className="font-bold text-foreground text-xl">{project.name}</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users size={14} />{project.teamName}</span>
            <span className="flex items-center gap-1"><Building2 size={14} />{project.department}</span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Avg Rating", value: avgRating ? `${avgRating.toFixed(1)} / 5` : "—", icon: Star, color: "text-star" },
            { label: "Avg Marks", value: avgMarks ? `${avgMarks.toFixed(0)} / 100` : "—", icon: Hash, color: "text-success" },
            { label: "Feedbacks", value: feedbacks.length, icon: MessageSquare, color: "text-primary" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl shadow-card p-4 space-y-1"
            >
              <div className="flex items-center gap-2">
                <card.icon size={14} className={card.color} />
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Rating Distribution */}
        {feedbacks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-xl shadow-card p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Rating Distribution</h3>
            </div>
            <div className="space-y-2">
              {ratingDist.reverse().map((d) => (
                <div key={d.stars} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8 text-right">{d.stars} ★</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-star rounded-full transition-all"
                      style={{ width: `${(d.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-6">{d.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Feedback */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <MessageSquare size={15} className="text-muted-foreground" />
            Recent Feedback
          </h3>
          {feedbacks.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No feedback received yet.</p>
            </div>
          ) : (
            feedbacks.slice().reverse().slice(0, 10).map((fb, i) => (
              <motion.div
                key={fb.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                className="bg-card rounded-xl shadow-card p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <StarRating value={fb.rating} readonly size={16} />
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                    {fb.marks}/100
                  </span>
                </div>
                <p className="text-sm text-foreground">{fb.comment}</p>
                <p className="text-xs text-muted-foreground">{new Date(fb.createdAt).toLocaleString()}</p>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectReview;
