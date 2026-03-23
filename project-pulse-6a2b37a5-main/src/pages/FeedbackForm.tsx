import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import StarRating from "@/components/StarRating";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const FeedbackForm = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, addFeedback, hasSubmittedFeedback, markFeedbackSubmitted } = useAppState();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  const [rating, setRating] = useState(0);
  const [marks, setMarks] = useState("");
  const [comment, setComment] = useState("");

  if (!project) {
    navigate("/");
    return null;
  }

  const alreadySubmitted = hasSubmittedFeedback(project.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || alreadySubmitted) return;
    addFeedback({
      projectId: project.id,
      rating,
      marks: Number(marks),
      comment,
    });
    markFeedbackSubmitted(project.id);
    navigate("/feedback/success");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container max-w-2xl flex items-center gap-3 py-3">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-foreground text-lg">Give Feedback</h1>
        </div>
      </header>

      <main className="container max-w-2xl py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-card p-5 space-y-5"
        >
          <div className="bg-primary/5 rounded-lg p-3">
            <h2 className="font-semibold text-foreground">{project.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{project.teamName} · {project.department}</p>
          </div>

          {alreadySubmitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10">
                <CheckCircle2 className="text-success" size={28} />
              </div>
              <p className="font-semibold text-foreground">You have already submitted feedback for this project.</p>
              <button
                onClick={() => navigate("/")}
                className="text-sm text-primary font-medium hover:underline"
              >
                Back to Project List
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
                <StarRating value={rating} onChange={setRating} size={32} />
                {rating === 0 && <p className="text-xs text-muted-foreground mt-1">Tap a star to rate</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Marks (0–100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Feedback</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this project..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition"
              >
                <Send size={16} />
                Submit Feedback
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default FeedbackForm;
