import { useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { GraduationCap, LayoutDashboard, Plus, Home, LogOut } from "lucide-react";

const AdminNav = () => {
  const { logout } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Add Project", icon: Plus, path: "/admin/add-project" },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-20">
      <div className="container max-w-4xl flex items-center justify-between py-2.5">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-primary" size={22} />
          <span className="font-bold text-foreground text-base hidden sm:inline">Feedback System</span>
        </div>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <link.icon size={16} />
                <span className="hidden sm:inline">{link.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => { logout(); navigate("/admin"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition ml-1"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminNav;
