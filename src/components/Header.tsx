import { Database, Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface HeaderProps {
  onAboutClick?: () => void;
  onFacultyLogin?: () => void;
  onAdminLogin?: () => void;
}

export function Header({ onFacultyLogin, onAdminLogin, onAboutClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          {/* <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl">SCOUP</span>
          </div> */}

          <a
            href="https://www.salisbury.edu/"
            className="flex items-center gap-2"
            target="_blank"
          >
            <img
              src="images/Salisbury_University_logo.svg.png"
              alt="SCOUP Logo"
              className="h-10 w-auto object-contain"
            />
          </a>

          <a href="#" onClick={onAboutClick} className="hover:text-primary">
            About SCOUP
          </a>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* <Button variant="ghost">Sign in</Button> */}
            <Button variant="ghost" onClick={onFacultyLogin}>
              Faculty
            </Button>
            <Button variant="ghost" onClick={onAdminLogin}>Administrator </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 pt-4 mt-4">
            <nav className="flex flex-col gap-4">
              {/* <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#demo"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Demo
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="#docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </a> */}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Button onClick={onFacultyLogin}>Faculty Sign In</Button>
                <Button>Administrato Sign In</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
