import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { LogIn, Mail, Lock, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAdmin } = useAppState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/dashboard";

  // Already logged in
  if (isAdmin) {
    navigate(redirect);
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate(redirect);
    } else {
      setError("Invalid credentials. Try admin@college.edu / admin123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <GraduationCap className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Project Feedback System</h1>
          <p className="text-muted-foreground text-sm mt-1">Admin Login</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-destructive text-xs bg-destructive/10 p-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition"
            >
              <LogIn size={18} />
              Login
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo: admin@college.edu / admin123
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
