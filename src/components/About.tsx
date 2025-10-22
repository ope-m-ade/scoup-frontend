import { Features } from "./Features";
import { Footer } from "./Footer";
import { CTA } from "./CTA";
import { Button } from "./ui/button";

interface AboutProps {
  onBack?: () => void;
  onFacultyLogin?: () => void;
  onAdminLogin?: () => void;
  onHome?: () => void;
}

export function About({
  onBack,
  onFacultyLogin,
  onAdminLogin,
  onHome,
}: AboutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Mini top bar */}
      <div className="flex justify-between items-center px-6 py-4 max-w-6xl w-full mx-auto border-b border-border/50">
        {/* Left: SCOUP Home */}
        <button
          onClick={onHome}
          className="font-bold text-lg hover:text-primary"
        >
          SCOUP Home
        </button>

        {/* Right: Faculty/Admin buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={onFacultyLogin}>
            Faculty
          </Button>
          <Button variant="ghost" onClick={onAdminLogin}>
            Administrator
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="px-6 py-12 flex flex-col items-center max-w-4xl mt-8">
        <h2 className="text-2xl font-semibold mb-4">SCOUP</h2>
        <p className="text-center text-muted-foreground mb-8">
          SCOUP (Salisbury University-Industry Connection and Unified Platform)
          connects students, faculty, and industry to build opportunities for
          collaboration and innovation.
        </p>
        <Features />
        <CTA onFacultyLogin={onFacultyLogin} />
      </main>

      <Footer />
    </div>
  );
}
