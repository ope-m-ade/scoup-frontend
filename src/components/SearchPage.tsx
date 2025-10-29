interface FacultyResult {
  id: string | number;
  category: "faculty";
  name: string;
  title?: string;
  department?: string;
  email?: string;
  office?: string;
  phone?: string;
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
  licenseUrl?: string;
}

type SearchResult = FacultyResult | PaperResult;

const highlightMatch = (text: string | undefined, query: string): string => {
  if (!text) return "";
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  try {
    const regex = new RegExp(`(${trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.replace(regex, "<mark class=\"bg-yellow-200 font-medium rounded-sm px-1\">$1</mark>");
  } catch (error) {
    return text;
  }
};

import { useEffect, useState } from "react";
import {
  Search,
  User,
  Lightbulb,
  Mail,
  FileText,
  Award,
  ChevronDown,
  Database,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { facultyData } from "../data/faculty";
import papersData from "../data/papersData.json";
// import { projectsData } from "../data/projects";
// import { papersData } from "../data/papers";
// import { patentsData } from "../data/patents";

interface SearchPageProps {
  initialQuery?: string;
  onBack?: () => void;
}

export function SearchPage({ initialQuery, onBack }: SearchPageProps) {
  const [activeQuery, setActiveQuery] = useState(initialQuery || "");
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery || "");
  const [activeTab, setActiveTab] = useState("all");
  const [searchFilter, setSearchFilter] = useState("all");

  const currentQuery = (submittedQuery || activeQuery).trim();

  const filterOptions = [
    {
      value: "all",
      label: "All Content",
      icon: <Database className="w-4 h-4" />,
    },
    { value: "faculty", label: "Faculty", icon: <User className="w-4 h-4" /> },
    {
      value: "projects",
      label: "Projects",
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      value: "papers",
      label: "Papers",
      icon: <FileText className="w-4 h-4" />,
    },
    { value: "patents", label: "Patents", icon: <Award className="w-4 h-4" /> },
  ];

  const getSelectedFilter = () =>
    filterOptions.find((option) => option.value === searchFilter) ||
    filterOptions[0];

  const allResults: SearchResult[] = [
    ...facultyData.map((f) => ({ ...f, category: "faculty" as const })),
    ...papersData.map((p) => ({ ...p, category: "papers" as const })),
  ];

  const getFilteredResults = (category: string) => {
    const tabCategory =
      category === "experts" ? "faculty" : category === "all" ? "all" : category;

    const results =
      tabCategory === "all"
        ? allResults
        : allResults.filter((r) => r.category === tabCategory);

    if (!currentQuery) return [];

    const query = currentQuery.toLowerCase();

    return results.filter((r) => {
      if (r.category === "faculty") {
        return (
          r.name?.toLowerCase().includes(query) ||
          r.title?.toLowerCase().includes(query) ||
          r.aiKeywords?.some((kw) => kw.toLowerCase().includes(query)) ||
          r.facultyKeywords?.some((kw) => kw.toLowerCase().includes(query))
        );
      }

      const searchableFields = [
        r.title,
        r.abstract,
        r.journal,
        ...(r.authors || []),
        ...(r.aiKeywords || []),
        ...(r.facultyKeywords || []),
      ];

      return searchableFields.some(
        (field) => field && field.toLowerCase().includes(query)
      );
    });
  };

  // const queries = [
  //   "cybersecurity data analytics",
  //   "environmental sustainability research",
  //   "business process optimization",
  //   "educational technology innovation",
  // ];

  useEffect(() => {
    const normalizedQuery = initialQuery?.trim() ?? "";
    setActiveQuery(normalizedQuery);
    setSubmittedQuery(normalizedQuery);
  }, [initialQuery]);

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-12 items-center">
          {/* Demo Interface */}
          <div>
            {/* <h2 className="text-3xl md:text-4xl mb-6">See it in action</h2> */}
            <p className="text-3xl md:text-4xl mb-6">
              Search through SU's expertise with intelligent keyword matching.
            </p>

            {/* Search Interface */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  value={activeQuery}
                  onChange={(e) => setActiveQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSubmittedQuery(activeQuery);
                    }
                  }}
                  placeholder="Search keywords in papers, patents, projects, or find faculty expertise..."
                  className="pl-12 pr-36 py-3 bg-card border-border"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* {queries.map((query) => (
                  <Button
                    key={query}
                    variant={activeQuery === query ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveQuery(query)}
                    className="text-sm"
                  >
                    {query}
                  </Button>
                ))} */}
              </div>
            </div>
          </div>

          {/* Results Preview with Tabs */}
          <div className="space-y-4">
            {/* <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Found {getFilteredResults(activeTab).length} results in 47ms
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div> */}

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
                      if (result.category === "papers") {
                        const abstractSnippet = result.abstract
                          ? `${result.abstract.slice(0, 200)}${
                              result.abstract.length > 200 ? "..." : ""
                            }`
                          : "";

                        return (
                          <Card
                            key={result.id}
                            className="p-6 border border-border/50"
                          >
                            <div className="space-y-2">
                              <h3
                                className="font-semibold text-lg"
                                dangerouslySetInnerHTML={{
                                  __html: highlightMatch(
                                    result.title,
                                    currentQuery
                                  ),
                                }}
                              />
                              {abstractSnippet && (
                                <p
                                  className="text-sm text-muted-foreground"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightMatch(
                                      abstractSnippet,
                                      currentQuery
                                    ),
                                  }}
                                />
                              )}
                              <p className="text-xs text-gray-600">
                                <strong>Journal:</strong>{" "}
                                {result.journal || "N/A"} |{" "}
                                <strong>Published:</strong>{" "}
                                {result.datePublished || "Unknown"}
                              </p>

                              {result.authors?.length ? (
                                <p className="text-xs text-gray-600">
                                  <strong>Authors:</strong>{" "}
                                  {result.authors.join(", ")}
                                </p>
                              ) : null}
                              {result.downloadUrl && (
                                <a
                                  href={result.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 text-xs"
                                >
                                  View Full Paper →
                                </a>
                              )}
                            </div>
                          </Card>
                        );
                      }

                      // fallback for faculty
                      return (
                        <Card
                          key={result.id}
                          className="border border-border/50 p-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Column 1: Keywords */}
                            <div className="space-y-4">
                              {result.aiKeywords && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-1">
                                    AI-matched keywords
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {result.aiKeywords.map((kw) => (
                                      <Badge key={kw} variant="secondary">
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: highlightMatch(
                                              kw,
                                              currentQuery
                                            ),
                                          }}
                                        />
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {result.facultyKeywords && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-1">
                                    Faculty-generated keywords
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {result.facultyKeywords.map((kw) => (
                                      <Badge key={kw} variant="outline">
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: highlightMatch(
                                              kw,
                                              currentQuery
                                            ),
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
                                src={
                                  result.photo || "/images/default-profile.jpg"
                                }
                                alt={result.name}
                                className="rounded-lg w-40 h-40 object-cover border border-border/40"
                              />
                            </div>

                            {/* Column 3: Contact Info */}
                            <div className="space-y-2 text-sm">
                              <p
                                className="font-semibold text-lg"
                                dangerouslySetInnerHTML={{
                                  __html: highlightMatch(
                                    result.name,
                                    currentQuery
                                  ),
                                }}
                              />
                              {(result.title || result.department) && (
                                <p className="text-muted-foreground">
                                  {result.title && (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: highlightMatch(
                                          result.title,
                                          currentQuery
                                        ),
                                      }}
                                    />
                                  )}
                                  {result.title && result.department ? ", " : ""}
                                  {result.department && (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: highlightMatch(
                                          result.department,
                                          currentQuery
                                        ),
                                      }}
                                    />
                                  )}
                                </p>
                              )}
                              {result.email && (
                                <p>
                                  <span className="font-medium">Email:</span>{" "}
                                  {result.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
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
      </div>
    </section>
  );
}
