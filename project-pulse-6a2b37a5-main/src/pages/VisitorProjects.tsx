import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { GraduationCap, Users, Building2, MessageCircle, Search, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const VisitorProjects = () => {
  const { projects, hasSubmittedFeedback } = useAppState();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.teamName.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container max-w-2xl flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-primary" size={22} />
            <h1 className="font-bold text-foreground text-lg">Project Exhibition</h1>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="text-xs text-muted-foreground hover:text-primary transition"
          >
            Admin
          </button>
        </div>
      </header>

      <main className="container max-w-2xl py-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project or team name..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition shadow-card"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>{search ? "No projects match your search." : "No projects available yet."}</p>
          </div>
        ) : (
          filtered.map((project, i) => {
            const submitted = hasSubmittedFeedback(project.id);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-xl shadow-card p-4 space-y-3 border ${
                  submitted
                    ? "bg-success/5 border-success/30"
                    : "bg-card border-transparent"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    {submitted && <CheckCircle2 size={16} className="text-success shrink-0" />}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users size={13} />{project.teamName}</span>
                    <span className="flex items-center gap-1"><Building2 size={13} />{project.department}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                </div>
                {submitted ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success px-3 py-1.5 rounded-lg bg-success/10 cursor-default">
                    <CheckCircle2 size={15} />
                    Feedback Submitted
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(`/feedback/${project.id}`)}
                    className="flex items-center gap-1.5 text-sm font-medium bg-accent/10 text-accent px-3 py-1.5 rounded-lg hover:bg-accent/20 transition"
                  >
                    <MessageCircle size={15} />
                    Give Feedback
                  </button>
                )}
              </motion.div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default VisitorProjects;
