import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SearchPage } from "./components/SearchPage";
import { Footer } from "./components/Footer";
import { FacultyLogin } from "./components/FacultyLogin";
import { AdminLogin } from "./components/AdminLogin";
import { About } from "./components/About";
import { AdminDashboard } from "./components/AdminDashboard";
import FacultySignup from "./components/FacultySignup";
import FacultyLoginSuccess from "./components/FacultyLoginSuccess";
import FacultyLayout from "./components/FacultyLayout";
import FacultyDashboardOverview from "./components/FacultyDashboardOverview";
import FacultyProfilePage from "./components/FacultyProfilePage";
import FacultyPapersPage from "./components/FacultyPapersPage";
import FacultyProjectsPage from "./components/FacultyProjectsPage";
import FacultyPatentsPage from "./components/FacultyPatentsPage";
import FacultyUploadsPage from "./components/FacultyUploadsPage";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAboutClick={() => navigate("/about")}
        onFacultyLogin={() => navigate("/faculty-login")}
        onAdminLogin={() => navigate("/admin-login")}
      />
      <main>
        <Hero
          onSearch={(term: string) =>
            navigate(`/search?query=${encodeURIComponent(term)}`)
          }
        />
      </main>
      <Footer onAboutClick={() => navigate("/about")} />
    </div>
  );
}

function AboutPage() {
  const navigate = useNavigate();
  return (
    <About
      onHome={() => navigate("/")}
      onFacultyLogin={() => navigate("/faculty-login")}
      onAdminLogin={() => navigate("/admin-login")}
    />
  );
}

function FacultyLoginPage() {
  const navigate = useNavigate();
  return <FacultyLogin onBack={() => navigate("/")} />;
}

function AdminLoginPage() {
  const navigate = useNavigate();
  return <AdminLogin onBack={() => navigate("/")} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/faculty-login" element={<FacultyLoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faculty/login-success" element={<FacultyLoginSuccess />} />
      <Route path="/faculty/signup" element={<FacultySignup />} />
      <Route path="/faculty" element={<FacultyLayout />}>
        <Route index element={<FacultyDashboardOverview />} />
        <Route path="dashboard" element={<FacultyDashboardOverview />} />
        <Route path="profile" element={<FacultyProfilePage />} />
        <Route path="papers" element={<FacultyPapersPage />} />
        <Route path="projects" element={<FacultyProjectsPage />} />
        <Route path="patents" element={<FacultyPatentsPage />} />
        <Route path="uploads" element={<FacultyUploadsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
