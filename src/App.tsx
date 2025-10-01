import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { SearchDemo } from "./components/SearchDemo";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { useState } from "react";
import { FacultyLogin } from "./components/FacultyLogin";

export default function App() {
  const [showFacultyLogin, setShowFacultyLogin] = useState(false);
  const [showSearchDemo, setShowSearchDemo] = useState(false);

  const handleFacultyLogin = () => {
    setShowFacultyLogin(true);
  };

  const handleBackToMain = () => {
    setShowFacultyLogin(false);
    setShowSearchDemo(false);
  };

  if (showFacultyLogin) {
    return <FacultyLogin onBack={handleBackToMain} />;
  }

  if (showSearchDemo) {
    return <SearchDemo onBack={handleBackToMain} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onFacultyLogin={handleFacultyLogin}
      />
      <main>
        {showSearchDemo ? (
          <SearchDemo onBack={() => setShowSearchDemo(false)} />
        ) : (
          <Hero onSearchDemo={() => setShowSearchDemo(true)} />
        )}
        <Features />
        {/* <SearchDemo /> */}
        <CTA onFacultyLogin={handleFacultyLogin} />
      </main>
      <Footer />
    </div>
  );
}
