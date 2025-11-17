import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface HeroProps {
  onSearch: (term: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const submitSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }
    onSearch(trimmedQuery);
  };

  return (
    <section className="relative bg-gradient-to-br from-background via-secondary/20 to-accent/30 min-h-screen py-32 px-4 flex items-center justify-center">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          {/* <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mb-6">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground"></span>
          </div> */}
          {/* <div className="flex justify-center items-center py-6">
            <a
              href="https://www.salisbury.edu/"
              className="flex items-center gap-2"
              target="_blank"
            >
              <img
                src="images/su-logo.png"
                alt="SCOUP Logo"
                className="h-10 w-auto object-contain"
              />
            </a>
          </div> */}

          <h1>
            <h1 className="relative text-4xl md:text-6xl font-extrabold mb-6">
              <span className="absolute inset-0 text-accent/20 -z-10 blur-xl">
                SCOUP
              </span>
              <span className="bg-gradient-to-br from-foreground to-accent bg-clip-text text-transparent">
                SCOUP
              </span>
            </h1>
          </h1>
          <h1 className="text-xl md:text-2xl mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Salisbury University-Industry Connection and Unified Platform
          </h1>

          <p className="text-sm text-muted-foreground max-w-1xl mx-auto mb-12">
            Salisbury University’s gateway to discovery and collaboration.
            Powered by AI, it connects faculty expertise, ongoing research, and
            emerging projects to the people who need them most. By breaking down
            information silos, SCOUP fosters meaningful partnerships within SU
            and with external partners, turning knowledge into real-world
            impact.
          </p>
        </div>

        {/* Search Demo */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search faculty expertise, research papers, patents, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitSearch();
                }
              }}
              className="pl-12 pr-48 py-4 text-lg bg-card/50 backdrop-blur-sm border-border/50"
            />


            <Button
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={submitSearch}
            >
              {/* <Zap className="w-4 h-4 mr-2" /> */}
              Search
            </Button>
          </div>

          {/* To be updated to reflect AI Suggested searches. I don't know if this may be needed or not or it could be dummy examples*/}
          {/* <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              "cybersecurity research",
              "environmental patents",
              "AI projects",
              "business analytics papers",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setSearchQuery(suggestion)}
                className="px-3 py-1 text-sm bg-secondary/50 hover:bg-secondary rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div> */}
        </div>

        {/* Key Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-2">400+</div>
            <div className="text-muted-foreground">Faculty Experts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">200+</div>
            <div className="text-muted-foreground">
              Active Research Projects
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">50+</div>
            <div className="text-muted-foreground">Industry Partnerships</div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
