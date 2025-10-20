import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
// import { Features } from "./components/Features";
import { SearchDemo } from "./components/SearchDemo";
// import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { useState } from "react";
import { FacultyLogin } from "./components/FacultyLogin";
import { AdminLogin } from "./components/AdminLogin";
import { About } from "./components/About";

export default function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showFacultyLogin, setShowFacultyLogin] = useState(false);
  const [showSearchDemo, setShowSearchDemo] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleFacultyLogin = () => {
    setShowFacultyLogin(true);
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleBackToMain = () => {
    setShowFacultyLogin(false);
    setShowSearchDemo(false);
    setShowAdminLogin(false);
    setShowAbout(false);
  };

  if (showFacultyLogin) {
    return <FacultyLogin onBack={handleBackToMain} />;
  }

  if (showSearchDemo) {
    return <SearchDemo onBack={handleBackToMain} />;
  }
  if (showAdminLogin) {
    return <AdminLogin onBack={handleBackToMain} />;
  }

  if (showAbout) {
    return (
      <About
        onHome={() => {
          setShowAbout(false); // Go back to landing page
        }}
        onFacultyLogin={handleFacultyLogin}
        onAdminLogin={() => console.log("Admin login clicked")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAboutClick={() => setShowAbout(true)}
        onFacultyLogin={handleFacultyLogin}
        onAdminLogin={handleAdminLogin}
      />
      <main>
        {showSearchDemo ? (
          <SearchDemo onBack={() => setShowSearchDemo(false)} />
        ) : (
          <Hero onSearchDemo={() => setShowSearchDemo(true)} />
        )}
        {/* <Features /> */}
        {/* <SearchDemo /> */}
        {/* <CTA onFacultyLogin={handleFacultyLogin} /> */}
      </main>
      <Footer onAboutClick={() => setShowAbout(true)} />
    </div>
  );
}
