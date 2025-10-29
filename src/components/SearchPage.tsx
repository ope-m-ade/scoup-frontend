import { useEffect, useState } from "react";
import {
  Search,
  User,
  Lightbulb,
  FileText,
  Award,
  Database,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { facultyData } from "../data/faculty";
import papersData from "../data/papersData.json";
// Uncomment when you have data ready:
// import { projectsData } from "../data/projects";
// import { patentsData } from "../data/patents";

interface FacultyResult {
  id: string | number;
  category: "faculty";
  name: string;
  title?: string;
  department?: string;
  email?: string;
  office?: string;
  phone?: string;
  description?: string;
  aiKeywords?: string[];
  facultyKeywords?: string[];
  photo?: string;
}

interface PaperResult {
  id: string | number;
  category: "papers";
  title: string;
  abstract?: string;
  authors?: string[];
  journal?: string;
  datePublished?: string;
  aiKeywords?: string[];
  facultyKeywords?: string[];
  downloadUrl?: string;
}

interface ProjectResult {
  id: string | number;
  category: "projects";
  title: string;
  description?: string;
  leadFaculty?: string;
  collaborators?: string[];
  aiKeywords?: string[];
  facultyKeywords?: string[];
}

interface PatentResult {
  id: string | number;
  category: "patents";
  title: string;
  description?: string;
  inventors?: string[];
  patentNumber?: string;
  year?: string;
  aiKeywords?: string[];
  facultyKeywords?: string[];
}

type SearchResult = FacultyResult | PaperResult | ProjectResult | PatentResult;

interface SearchPageProps {
  initialQuery?: string;
  onBack?: () => void;
}

const highlightMatch = (text: string | undefined, query: string): string => {
  if (!text) return "";
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  try {
    const regex = new RegExp(
      `(${trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(
      regex,
      '<mark class="bg-yellow-200 font-medium rounded-sm px-1">$1</mark>'
    );
  } catch {
    return text;
  }
};

export function SearchPage({ initialQuery, onBack }: SearchPageProps) {
  const [activeQuery, setActiveQuery] = useState(initialQuery || "");
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery || "");
  const [activeTab, setActiveTab] = useState("all");

  const currentQuery = (submittedQuery || activeQuery).trim().toLowerCase();

  const allResults: SearchResult[] = [
    ...facultyData.map((f) => ({ ...f, category: "faculty" as const })),
    ...papersData.map((p) => ({ ...p, category: "papers" as const })),
    // ...projectsData.map((p) => ({ ...p, category: "projects" as const })),
    // ...patentsData.map((p) => ({ ...p, category: "patents" as const })),
  ];

  const getFilteredResults = (category: string): SearchResult[] => {
    if (!currentQuery) return [];

    let filtered = allResults;

    if (category !== "all") {
      const tabCategory =
        category === "experts"
          ? "faculty"
          : (category as SearchResult["category"]);
      filtered = filtered.filter((r) => r.category === tabCategory);
    }

    return filtered.filter((r) => {
      const searchableFields = [
        r.category === "faculty" ? r.name : (r as any).title,
        r.category === "faculty" ? (r as any).department : (r as any).journal,
        ...(r.aiKeywords || []),
        ...(r.facultyKeywords || []),
        r.category === "faculty"
          ? (r as any).description
          : (r as any).abstract || (r as any).description,
        ...(r.category === "faculty"
          ? []
          : (r as any).authors || (r as any).collaborators || []),
      ];

      return searchableFields.some(
        (field) => field && field.toLowerCase().includes(currentQuery)
      );
    });
  };

  useEffect(() => {
    const normalizedQuery = initialQuery?.trim() ?? "";
    setActiveQuery(normalizedQuery);
    setSubmittedQuery(normalizedQuery);
  }, [initialQuery]);

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-12 items-center">
          {/* Header */}
          <div>
            <p className="text-3xl md:text-4xl mb-6 text-center">
              Search through SU's expertise with intelligent keyword matching.
            </p>

            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                value={activeQuery}
                onChange={(e) => setActiveQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSubmittedQuery(activeQuery);
                }}
                placeholder="Search faculty, papers, projects, or patents..."
                className="pl-12 pr-36 py-3 bg-card border-border"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="experts" className="text-xs">
                Experts
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs">
                Projects
              </TabsTrigger>
              <TabsTrigger value="papers" className="text-xs">
                Papers
              </TabsTrigger>
              <TabsTrigger value="patents" className="text-xs">
                Patents
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-3">
                {(() => {
                  const filteredResults = getFilteredResults(activeTab);

                  if (filteredResults.length === 0) {
                    return currentQuery ? (
                      <p className="text-center text-muted-foreground">
                        No results found for "{currentQuery}".
                      </p>
                    ) : (
                      <p className="text-center text-muted-foreground">
                        Type a keyword to begin searching.
                      </p>
                    );
                  }

                  return filteredResults.map((result) => {
                    // 🧑‍🏫 Faculty results
                    // 🧑‍🏫 Faculty results
if (result.category === "faculty") {
  // Filter keywords to only those matching the query
  const matchedAIKeywords =
    result.aiKeywords?.filter((kw) =>
      kw.toLowerCase().includes(currentQuery)
    ) || [];

  const matchedFacultyKeywords =
    result.facultyKeywords?.filter((kw) =>
      kw.toLowerCase().includes(currentQuery)
    ) || [];

  return (
    <Card key={`faculty-${result.id}`} className="border border-border/50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Filtered Keywords */}
        <div className="space-y-4">
          {matchedAIKeywords.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-1">
                AI-matched keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedAIKeywords.map((kw) => (
                  <Badge key={kw} variant="secondary">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(kw, currentQuery),
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {matchedFacultyKeywords.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-1">
                Faculty-generated keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedFacultyKeywords.map((kw) => (
                  <Badge key={kw} variant="outline">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(kw, currentQuery),
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Photo */}
        <div className="flex justify-center items-start">
          <img
            src={result.photo || "/images/default-profile.jpg"}
            alt={result.name}
            className="rounded-lg w-40 h-40 object-cover border border-border/40"
          />
        </div>

        {/* Column 3: Faculty Details */}
        <div className="space-y-2 text-sm">
          <p
            className="font-semibold text-lg"
            dangerouslySetInnerHTML={{
              __html: highlightMatch(result.name, currentQuery),
            }}
          />
          {(result.title || result.department) && (
            <p className="text-muted-foreground">
              {result.title && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(result.title, currentQuery),
                  }}
                />
              )}
              {result.title && result.department ? ", " : ""}
              {result.department && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(result.department, currentQuery),
                  }}
                />
              )}
            </p>
          )}

          {result.email && (
            <p>
              <span className="font-medium">Email:</span> {result.email}
            </p>
          )}
          {result.office && (
            <p>
              <span className="font-medium">Office:</span> {result.office}
            </p>
          )}
          {result.phone && (
            <p>
              <span className="font-medium">Phone:</span> {result.phone}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

                    // 📄 Paper results
                    if (result.category === "papers") {
                      return (
                        <Card key={`paper-${result.id}`} className="p-6 border">
                          <h3
                            className="font-semibold text-lg"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                result.title,
                                currentQuery
                              ),
                            }}
                          />
                          <p
                            className="text-sm text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                result.abstract?.slice(0, 200) || "",
                                currentQuery
                              ),
                            }}
                          />
                          <p className="text-xs text-gray-500">
                            {result.journal && <span>{result.journal}</span>}
                            {result.datePublished &&
                              ` • ${result.datePublished}`}
                          </p>
                        </Card>
                      );
                    }

                    // 💡 Project results
                    if (result.category === "projects") {
                      return (
                        <Card
                          key={`project-${result.id}`}
                          className="p-6 border"
                        >
                          <h3
                            className="font-semibold text-lg"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                result.title,
                                currentQuery
                              ),
                            }}
                          />
                          <p
                            className="text-sm text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                result.description || "",
                                currentQuery
                              ),
                            }}
                          />
                        </Card>
                      );
                    }

                    // 🧾 Patent results
                    if (result.category === "patents") {
                      return (
                        <Card
                          key={`patent-${result.id}`}
                          className="p-6 border"
                        >
                          <h3
                            className="font-semibold text-lg"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                result.title,
                                currentQuery
                              ),
                            }}
                          />
                          <p
                            className="text-sm text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                result.description || "",
                                currentQuery
                              ),
                            }}
                          />
                          <p className="text-xs text-gray-500">
                            Patent #{result.patentNumber || "N/A"} •{" "}
                            {result.year || "Year unknown"}
                          </p>
                        </Card>
                      );
                    }

                    return null;
                  });
                })()}
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center pt-4">
            <Button variant="outline">View all results</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
