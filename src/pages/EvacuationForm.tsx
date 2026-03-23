import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { ArrowLeft, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const STAGE_CRITERIA = {
  1: {
    title: "Stage 1: Idea Evaluation",
    total: 50,
    criteria: [
      { key: "problemIdentification", label: "Problem Identification", marks: 10 },
      { key: "relevanceToTheme", label: "Relevance to Theme", marks: 10 },
      { key: "innovation", label: "Innovation", marks: 10 },
      { key: "feasibility", label: "Feasibility", marks: 10 },
      { key: "clarityOfApproach", label: "Clarity of Approach", marks: 10 },
    ]
  },
  2: {
    title: "Stage 2: Mid-Level Progress Evaluation",
    total: 50,
    criteria: [
      { key: "developmentProgress", label: "Development Progress", marks: 10 },
      { key: "technicalImplementation", label: "Technical Implementation", marks: 10 },
      { key: "problemSolutionFit", label: "Problem-Solution Fit", marks: 10 },
      { key: "innovationInDesign", label: "Innovation in Design", marks: 10 },
      { key: "teamCollaboration", label: "Team Collaboration", marks: 10 },
    ]
  },
  3: {
    title: "Stage 3: Final Evaluation",
    total: 60,
    criteria: [
      { key: "prototypeFunctionality", label: "Prototype Functionality", marks: 15 },
      { key: "innovationAndCreativity", label: "Innovation & Creativity", marks: 15 },
      { key: "socialImpact", label: "Social Impact", marks: 10 },
      { key: "presentationAndDemonstration", label: "Presentation & Demonstration", marks: 10 },
      { key: "scalabilityFutureScope", label: "Scalability / Future Scope", marks: 10 },
    ]
  }
};

const EvacuationForm = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, addEvaluation, evaluations, getStaffById } = useAppState();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  const [criteriaMarks, setCriteriaMarks] = useState<Record<string, string>>({});
  const [staffSession, setStaffSession] = useState<{staffId: string, stage: 1 | 2 | 3} | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("evacuation_staff_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setStaffSession(parsed);
      } catch {
        navigate("/");
      }
    } else {
      if (projectId) {
        navigate(`/evacuation/login/${projectId}`);
      } else {
        navigate("/");
      }
    }
  }, [navigate, projectId]);

  if (!project || !staffSession) {
    return null; // Will redirect or just waiting for effect
  }

  const stageData = STAGE_CRITERIA[staffSession.stage];
  const subtotal = Object.values(criteriaMarks).reduce((sum, val) => sum + (Number(val) || 0), 0);


  const staff = getStaffById(staffSession.staffId);
  if (!staff) {
    navigate("/");
    return null;
  }

  const alreadyEvaluated = evaluations.some(e => e.staffId === staffSession.staffId && e.projectId === project.id && e.stage === staffSession.stage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyEvaluated) return;

    // Validation
    const marks = Object.fromEntries(
      Object.entries(criteriaMarks).map(([key, val]) => [key, Number(val) || 0])
    );

    const totalMarks = Object.values(marks).reduce((sum, val) => sum + val, 0);
    if (totalMarks !== subtotal) {
      toast.error("Marks calculation error");
      return;
    }

    // Check if all marks are within range
    for (const criterion of stageData.criteria) {
      const mark = marks[criterion.key] || 0;
      if (mark < 0 || mark > criterion.marks) {
        toast.error(`Invalid marks for ${criterion.label}`);
        return;
      }
    }

    addEvaluation({
      staffId: staffSession.staffId,
      projectId: project.id,
      stage: staffSession.stage,
      criteriaMarks: marks,
      subtotal: totalMarks
    });

    toast.success("Evaluation Submitted!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container max-w-2xl flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-foreground text-lg">Evacuation Evaluation</h1>
          </div>
          <div className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
            Staff: {staff.staffName}
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-card p-5 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <ClipboardCheck className="text-primary" size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground">{stageData.title}</h2>
            <p className="text-sm text-muted-foreground">Evaluate '{project.name}'</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Evaluator:</span>
                <p className="font-semibold text-foreground">{staff.staffName}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Team Name:</span>
                <p className="font-semibold text-foreground">{project.teamName}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Team ID:</span>
                <p className="font-semibold text-foreground">{project.id}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Project:</span>
                <p className="font-semibold text-foreground">{project.name}</p>
              </div>
            </div>
          </div>

          {alreadyEvaluated ? (
            <div className="text-center py-8 space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10">
                <CheckCircle2 className="text-success" size={28} />
              </div>
              <p className="font-semibold text-foreground">You have already evaluated this project.</p>
              <button
                onClick={() => navigate("/")}
                className="text-sm text-primary font-medium hover:underline"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {stageData.criteria.map((criterion) => (
                  <div key={criterion.key} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border shadow-sm">
                    <div className="flex-1">
                      <label className="text-sm font-bold text-foreground block mb-1">
                        {criterion.label}
                      </label>
                      <span className="text-xs font-semibold px-2 py-1 bg-muted rounded text-muted-foreground">
                        Max: {criterion.marks}
                      </span>
                    </div>
                    <div className="ml-4">
                      <input
                        type="number"
                        min={0}
                        max={criterion.marks}
                        value={criteriaMarks[criterion.key] || ""}
                        onChange={(e) => setCriteriaMarks(prev => ({ ...prev, [criterion.key]: e.target.value }))}
                        placeholder="0"
                        className="w-20 px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition text-center font-semibold"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-muted flex items-center justify-between border border-border">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Subtotal</p>
                  <p className="text-2xl font-black text-foreground">{subtotal} <span className="text-sm text-muted-foreground font-normal">/ {stageData.total}</span></p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition shadow-md"
              >
                Submit Evaluation
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default EvacuationForm;
