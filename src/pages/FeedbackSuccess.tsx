import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const FeedbackSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center bg-card rounded-2xl shadow-card p-8 max-w-sm w-full"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-5">
          <CheckCircle2 className="text-success" size={36} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Thank you for your feedback!</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Your evaluation has been recorded successfully.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition"
        >
          Back to Project List
        </button>
      </motion.div>
    </div>
  );
};

export default FeedbackSuccess;
