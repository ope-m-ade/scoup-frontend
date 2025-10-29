import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SearchPage } from "./components/SearchPage";
import { Footer } from "./components/Footer";
import { FacultyLogin } from "./components/FacultyLogin";
import { AdminLogin } from "./components/AdminLogin";
import { About } from "./components/About";
import { AdminDashboard } from "./components/AdminDashboard";

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
          onSearchDemo={() => navigate("/search")}
          onSearch={(term: string) => navigate(`/search?query=${term}`)}
        />
      </main>
      <Footer onAboutClick={() => navigate("/about")} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/faculty-login" element={<FacultyLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
