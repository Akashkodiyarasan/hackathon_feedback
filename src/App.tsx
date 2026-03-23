import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import VisitorProjects from "./pages/VisitorProjects";
import FeedbackForm from "./pages/FeedbackForm";
import FeedbackSuccess from "./pages/FeedbackSuccess";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import ViewFeedback from "./pages/ViewFeedback";
import ProjectLanding from "./pages/ProjectLanding";
import ProjectReview from "./pages/ProjectReview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<VisitorProjects />} />
            <Route path="/project/:projectId" element={<ProjectLanding />} />
            <Route path="/feedback/:projectId" element={<FeedbackForm />} />
            <Route path="/feedback/success" element={<FeedbackSuccess />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-project" element={<AddProject />} />
            <Route path="/admin/edit-project/:projectId" element={<EditProject />} />
            <Route path="/admin/feedback/:projectId" element={<ViewFeedback />} />
            <Route path="/admin/review/:projectId" element={<ProjectReview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
