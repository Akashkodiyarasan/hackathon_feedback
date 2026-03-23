import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { Save } from "lucide-react";
import { motion } from "framer-motion";
import AdminNav from "@/components/AdminNav";

const departments = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Information Technology",
  "Environmental Science",
  "Biotechnology",
];

const EditProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, updateProject, isAdmin } = useAppState();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  const [form, setForm] = useState(
    project
      ? { name: project.name, teamName: project.teamName, department: project.department, description: project.description }
      : { name: "", teamName: "", department: "", description: "" }
  );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(project.id, form);
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container max-w-2xl py-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl shadow-card p-5">
          <h2 className="font-semibold text-foreground text-lg mb-4">Edit Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Project Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 transition" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Team Name</label>
              <input value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 transition" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 transition" required>
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 transition resize-none" required />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition">
              <Save size={16} />
              Save Changes
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default EditProject;
