import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { ArrowLeft, KeyRound, User, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const StaffLogin = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, staff } = useAppState();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!project) {
      navigate("/");
    }
  }, [project, navigate]);

  if (!project) {
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId.trim().length === 0 || password.trim().length === 0) {
      toast.error("Please enter Staff ID and Password");
      return;
    }

    const foundStaff = staff.find(s => s.staffId === staffId.trim() && s.password === password.trim());
    if (!foundStaff) {
      toast.error("Invalid Staff ID or Password");
      return;
    }

    // Store staff session
    localStorage.setItem("evacuation_staff_session", JSON.stringify({ staffId: foundStaff.staffId, stage: foundStaff.assignedStage }));
    toast.success("Login successful");
    navigate(`/evacuation/evaluate/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container max-w-2xl flex items-center gap-3 py-3">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-foreground text-lg">Staff Login</h1>
        </div>
      </header>

      <main className="container max-w-2xl py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-card p-6 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <User className="text-primary" size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground">Evacuation System</h2>
            <p className="text-sm text-muted-foreground">Sign in to evaluate '{project.name}'</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Staff ID</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="Enter your Staff ID"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">PIN / Password</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your PIN"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition mt-2"
            >
              <LogIn size={18} />
              Login to Evaluate
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default StaffLogin;
