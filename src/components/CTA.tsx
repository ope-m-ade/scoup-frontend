import { ArrowRight, Zap, Shield, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
// import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FacultyLogin } from "./FacultyLogin";

interface CTAProps {
  onFacultyLogin?: () => void;
}

export function CTA({onFacultyLogin}: CTAProps) {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-6">
            Empower Your Research & Collaboration
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join the growing network of SU faculty and research staff using
            SCOUP to discover colleagues, find projects, and foster
            interdisciplinary collaboration. Break down information silos and
            connect with the right expertise across the University.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="group">
              Learn How It Works
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" className="group">
              Request Access
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" className="group" onClick={onFacultyLogin}>
              Already Have Access? Login Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">Immediate Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Start finding faculty expertise and collaboration opportunities
                across all SU departments immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">University Integrated</h3>
              <p className="text-sm text-muted-foreground">
                Built specifically for Salisbury University with deep
                integration into existing systems and workflows.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Expert support team ready to help you optimize your search
                experience.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
}