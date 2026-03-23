import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { Plus, MessageSquare, Users, Building2, BarChart3, Trophy, Star, Hash, Download, Pencil, Trash2, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useCallback } from "react";
import * as xlsx from "xlsx";
import StarRating from "@/components/StarRating";
import { Progress } from "@/components/ui/progress";
import AdminNav from "@/components/AdminNav";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminDashboard = () => {
  const { projects, getFeedbacksForProject, feedbacks, evaluations, evacuations, staff, isAdmin, deleteProject } = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  type ReportTab = "Visitor" | "Stage1" | "Stage2" | "Stage3" | "Final";
  const [activeTab, setActiveTab] = useState<ReportTab>("Visitor");

  const projectStats = projects.map((project) => {
    const fb = getFeedbacksForProject(project.id);
    const avgRating = fb.length ? fb.reduce((s, f) => s + f.rating, 0) / fb.length : 0;
    const avgFeedbackMarks = fb.length ? fb.reduce((s, f) => s + f.marks, 0) / fb.length : 0;

    const evacs = evacuations.filter(e => e.projectId === project.id);
    const evaluationCount = evacs.length;

    const stage1Evals = evaluations.filter(e => e.projectId === project.id && e.stage === 1);
    const stage2Evals = evaluations.filter(e => e.projectId === project.id && e.stage === 2);
    const stage3Evals = evaluations.filter(e => e.projectId === project.id && e.stage === 3);

    const avgStage1 = stage1Evals.length ? stage1Evals.reduce((s, e) => s + e.subtotal, 0) / stage1Evals.length : 0;
    const avgStage2 = stage2Evals.length ? stage2Evals.reduce((s, e) => s + e.subtotal, 0) / stage2Evals.length : 0;
    const avgStage3 = stage3Evals.length ? stage3Evals.reduce((s, e) => s + e.subtotal, 0) / stage3Evals.length : 0;
    const avgTotal = avgStage1 + avgStage2 + avgStage3 || 0;

    const passCount = evacs.filter(e => e.result === "Pass").length;
    const failCount = evacs.filter(e => e.result === "Fail").length;

    return { 
      ...project, 
      feedbackCount: fb.length, 
      avgRating, 
      avgMarks: avgFeedbackMarks,
      evacuationCount: evaluationCount,
      avgStage1,
      avgStage2,
      avgStage3,
      avgTotal,
      passCount,
      failCount,
      stage1Evals,
      stage2Evals,
      stage3Evals,
      stage1Count: stage1Evals.length,
      stage2Count: stage2Evals.length,
      stage3Count: stage3Evals.length
    };
  });

  const validProjectIds = new Set(projects.map(p => p.id));
  const totalFeedbacks = feedbacks.filter(f => validProjectIds.has(f.projectId)).length;
  const totalEvacuations = evacuations.filter(e => validProjectIds.has(e.projectId)).length;

  const highestRated = projectStats.length ? projectStats.reduce((a, b) => (b.avgRating > a.avgRating ? b : a)) : null;
  const highestMarks = projectStats.length ? projectStats.reduce((a, b) => (b.avgMarks > a.avgMarks ? b : a)) : null;

  const highestStage1 = projectStats.length ? projectStats.reduce((a, b) => (b.avgStage1 > a.avgStage1 ? b : a)) : null;
  const highestStage2 = projectStats.length ? projectStats.reduce((a, b) => (b.avgStage2 > a.avgStage2 ? b : a)) : null;
  const highestStage3 = projectStats.length ? projectStats.reduce((a, b) => (b.avgStage3 > a.avgStage3 ? b : a)) : null;
  const highestTotal = projectStats.length ? projectStats.reduce((a, b) => (b.avgTotal > a.avgTotal ? b : a)) : null;
  
  const totalPass = projectStats.reduce((s, p) => s + p.passCount, 0);

  const getMetricCards = () => {
    if (activeTab === "Visitor") {
      return [
        { label: "Highest Rated (Visitor)", value: highestRated?.avgRating ? `${highestRated.avgRating.toFixed(1)} ★` : "—", sub: highestRated?.name, icon: Trophy, color: "text-star" },
        { label: "Top Project (Visitor)", value: highestMarks?.avgMarks ? `${highestMarks.avgMarks.toFixed(0)} / 100` : "—", sub: highestMarks?.name, icon: Hash, color: "text-success" },
      ];
    } else if (activeTab === "Stage1") {
      return [
        { label: "Top S1 Score", value: highestStage1?.avgStage1 ? `${highestStage1.avgStage1.toFixed(1)} / 50` : "—", sub: highestStage1?.name, icon: Trophy, color: "text-primary" },
      ];
    } else if (activeTab === "Stage2") {
      return [
        { label: "Top S2 Score", value: highestStage2?.avgStage2 ? `${highestStage2.avgStage2.toFixed(1)} / 50` : "—", sub: highestStage2?.name, icon: Trophy, color: "text-primary" },
      ];
    } else if (activeTab === "Stage3") {
      return [
        { label: "Top S3 Score", value: highestStage3?.avgStage3 ? `${highestStage3.avgStage3.toFixed(1)} / 60` : "—", sub: highestStage3?.name, icon: Trophy, color: "text-primary" },
      ];
    } else {
      return [
        { label: "Top Total Score", value: highestTotal?.avgTotal ? `${highestTotal.avgTotal.toFixed(1)} / 160` : "—", sub: highestTotal?.name, icon: Trophy, color: "text-success" },
        { label: "Total Passes", value: totalPass, sub: "Across all projects", icon: CheckCircle2, color: "text-success" }
      ];
    }
  };

  const summaryCards = [
    { label: "Total Projects", value: projects.length, icon: BarChart3, color: "text-primary" },
    { label: activeTab === "Visitor" ? "Total Feedbacks" : "Total Evaluations", value: activeTab === "Visitor" ? totalFeedbacks : totalEvacuations, icon: activeTab === "Visitor" ? MessageSquare : ShieldCheck, color: "text-accent" },
    ...getMetricCards()
  ];

  const exportToExcel = () => {
    let dataToExport: any[] = [];
    
    if (activeTab === "Visitor") {
      dataToExport = projectStats.map(p => ({
        "Project Name": p.name,
        "Team Name": p.teamName,
        "Department": p.department,
        "Total Feedbacks": p.feedbackCount,
        "Average Rating (out of 5)": p.avgRating.toFixed(2),
        "Average Marks (out of 100)": p.avgMarks.toFixed(2),
      }));
    } else if (activeTab === "Stage1" || activeTab === "Stage2" || activeTab === "Stage3") {
      const stage = activeTab === "Stage1" ? 1 : activeTab === "Stage2" ? 2 : 3;
      const countKey = `stage${stage}Count` as keyof ProjectStat;
      const avgKey = `avgStage${stage}` as keyof ProjectStat;
      
      dataToExport = projectStats.map(p => ({
        "Project Name": p.name,
        "Team Name": p.teamName,
        "Department": p.department,
        "Evaluations Count": p[countKey],
        [`Average Stage ${stage} Score`]: Number(p[avgKey]).toFixed(2),
      }));
    } else if (activeTab === "Final") {
      dataToExport = projectStats.map(p => ({
        "Project Name": p.name,
        "Team Name": p.teamName,
        "Department": p.department,
        "Stage 1 Average": p.avgStage1.toFixed(2),
        "Stage 2 Average": p.avgStage2.toFixed(2),
        "Stage 3 Average": p.avgStage3.toFixed(2),
        "Total Average Score": p.avgTotal.toFixed(2),
        "Total Passing Evals": p.passCount,
        "Total Failing Evals": p.failCount,
      }));
    }

    if (dataToExport.length === 0) return;

    const worksheet = xlsx.utils.json_to_sheet(dataToExport);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, `${activeTab}_Report`);
    
    xlsx.writeFile(workbook, `Hackathon_${activeTab}_Report.xlsx`);
  };

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
              {'sub' in card && card.sub && <p className="text-xs text-muted-foreground truncate">{card.sub as string}</p>}
            </motion.div>
          ))}
        </div>

        {/* Report Tabs */}
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar border-b border-border">
          {(["Visitor", "Stage1", "Stage2", "Stage3", "Final"] as ReportTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab 
                  ? "border-primary text-primary bg-primary/5" 
                  : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {tab === "Visitor" ? "Visitor Report" : 
               tab === "Stage1" ? "Evacuation Stage 1 Report" : 
               tab === "Stage2" ? "Evacuation Stage 2 Report" : 
               tab === "Stage3" ? "Evacuation Stage 3 Report" : 
               "Final Result Dashboard"}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/add-project")}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-card"
          >
            <Plus size={18} />
            Add New Project
          </button>
          <button
            onClick={exportToExcel}
            className="flex-1 flex items-center justify-center gap-2 bg-success text-success-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-card"
          >
            <Download size={18} />
            Export to Excel
          </button>
        </div>

        {/* Project Cards */}
        {projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No projects yet. Add your first project!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projectStats.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} navigate={navigate} onDelete={deleteProject} tab={activeTab} />
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
  evacuationCount: number;
  avgStage1: number;
  avgStage2: number;
  avgStage3: number;
  avgTotal: number;
  passCount: number;
  failCount: number;
  stage1Evals: any[];
  stage2Evals: any[];
  stage3Evals: any[];
  stage1Count: number;
  stage2Count: number;
  stage3Count: number;
}

const ProjectCard = ({ project, index, navigate, onDelete, tab }: { project: ProjectStat; index: number; navigate: ReturnType<typeof useNavigate>; onDelete: (id: string) => void; tab: string }) => {
  const { staff } = useAppState();
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
              {tab === "Visitor" ? (
                <span className="flex items-center gap-1"><MessageSquare size={13} />{project.feedbackCount} Feedbacks</span>
              ) : (
                <span className="flex items-center gap-1"><ShieldCheck size={13} />{project.evacuationCount} Evaluations</span>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            {tab === "Visitor" && project.feedbackCount > 0 && (
              <>
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
              </>
            )}

            {tab === "Stage1" && project.stage1Count > 0 && (
              <>
                <div className="flex items-center gap-3">
                  <Hash size={14} className="text-primary shrink-0" />
                  <div className="flex-1">
                    <Progress value={(project.avgStage1 / 50) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-16 text-right">{project.avgStage1.toFixed(1)} / 50</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Stage 1 Evaluations</h4>
                  <div className="bg-muted/50 rounded p-3 text-xs space-y-2">
                    {project.stage1Evals.map((evaluation) => {
                      const staffMember = staff.find(s => s.staffId === evaluation.staffId);
                      return (
                        <div key={evaluation.id} className="flex items-center justify-between">
                          <span className="font-medium">{staffMember?.staffName || evaluation.staffId}</span>
                          <div className="flex gap-1">
                            {Object.entries(evaluation.criteriaMarks || {}).map(([key, mark]) => (
                              <span key={key} className="bg-background px-2 py-1 rounded">{String(mark)}</span>
                            ))}
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded font-semibold">{evaluation.subtotal}/50</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {tab === "Stage2" && project.stage2Count > 0 && (
              <>
                <div className="flex items-center gap-3">
                  <Hash size={14} className="text-primary shrink-0" />
                  <div className="flex-1">
                    <Progress value={(project.avgStage2 / 50) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-16 text-right">{project.avgStage2.toFixed(1)} / 50</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Stage 2 Evaluations</h4>
                  <div className="bg-muted/50 rounded p-3 text-xs space-y-2">
                    {project.stage2Evals.map((evaluation) => {
                      const staffMember = staff.find(s => s.staffId === evaluation.staffId);
                      return (
                        <div key={evaluation.id} className="flex items-center justify-between">
                          <span className="font-medium">{staffMember?.staffName || evaluation.staffId}</span>
                          <div className="flex gap-1">
                            {Object.entries(evaluation.criteriaMarks || {}).map(([key, mark]) => (
                              <span key={key} className="bg-background px-2 py-1 rounded">{String(mark)}</span>
                            ))}
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded font-semibold">{evaluation.subtotal}/50</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {tab === "Stage3" && project.stage3Count > 0 && (
              <>
                <div className="flex items-center gap-3">
                  <Hash size={14} className="text-primary shrink-0" />
                  <div className="flex-1">
                    <Progress value={(project.avgStage3 / 60) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-16 text-right">{project.avgStage3.toFixed(1)} / 60</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Stage 3 Evaluations</h4>
                  <div className="bg-muted/50 rounded p-3 text-xs space-y-2">
                    {project.stage3Evals.map((evaluation) => {
                      const staffMember = staff.find(s => s.staffId === evaluation.staffId);
                      return (
                        <div key={evaluation.id} className="flex items-center justify-between">
                          <span className="font-medium">{staffMember?.staffName || evaluation.staffId}</span>
                          <div className="flex gap-1">
                            {Object.entries(evaluation.criteriaMarks || {}).map(([key, mark]) => (
                              <span key={key} className="bg-background px-2 py-1 rounded">{String(mark)}</span>
                            ))}
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded font-semibold">{evaluation.subtotal}/60</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {tab === "Final" && project.evacuationCount > 0 && (
              <>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div className="bg-muted p-1.5 rounded text-center">S1: {project.avgStage1.toFixed(1)}</div>
                  <div className="bg-muted p-1.5 rounded text-center">S2: {project.avgStage2.toFixed(1)}</div>
                  <div className="bg-muted p-1.5 rounded text-center">S3: {project.avgStage3.toFixed(1)}</div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold uppercase text-muted-foreground w-12 border-b border-border">Total Average</span>
                  <div className="flex-1">
                    <Progress value={(project.avgTotal / 160) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-bold text-foreground w-16 text-right border-b border-border">{project.avgTotal.toFixed(1)} / 160</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1.5 bg-success/10 text-success text-xs px-2 py-1 rounded-md font-medium">
                    <CheckCircle2 size={12} />
                    {project.passCount} Pass
                  </div>
                  <div className="flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-md font-medium">
                    <XCircle size={12} />
                    {project.failCount} Fail
                  </div>
                </div>
              </>
            )}
          </div>
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
