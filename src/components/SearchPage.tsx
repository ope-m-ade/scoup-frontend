import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type FacultyResult = {
  id: number;
  first_name: string;
  last_name: string;
  department?: string;
  title?: string;
  email?: string;
  bio?: string;
  photo?: string;
};

type PaperResult = {
  id: number;
  title: string;
  abstract?: string;
  journal?: string;
  date_published?: string;
};

type SearchResult =
  | (FacultyResult & { category: "faculty" })
  | (PaperResult & { category: "papers" });

const DEFAULT_API_BASE = "http://127.0.0.1:8000/api";
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || DEFAULT_API_BASE
).replace(/\/$/, "");

const buildSearchUrl = (path: string, query: string) => {
  const queryParam = query ? `?search=${encodeURIComponent(query)}` : "";
  return `${API_BASE_URL}${path}${queryParam}`;
};

const highlightMatch = (text: string | undefined, query: string) => {
  if (!text) {
    return null;
  }
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return text;
  }
  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "gi");
  const parts: Array<string | JSX.Element> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(regex)) {
    const startIndex = match.index ?? 0;
    if (startIndex > lastIndex) {
      parts.push(text.slice(lastIndex, startIndex));
    }

    const matchedText = match[0];
    parts.push(
      <mark
        key={`${startIndex}-${matchedText}`}
        className="bg-yellow-200 font-medium rounded-sm px-1"
      >
        {matchedText}
      </mark>
    );

    lastIndex = startIndex + matchedText.length;
  }

  if (parts.length === 0) {
    return text;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = (searchParams.get("query") || "").trim();

  const [activeQuery, setActiveQuery] = useState(queryParam);
  const [submittedQuery, setSubmittedQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState("all");

  const [facultyData, setFacultyData] = useState<FacultyResult[]>([]);
  const [papersData, setPapersData] = useState<PaperResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActiveQuery(queryParam);
    setSubmittedQuery(queryParam);
  }, [queryParam]);

  const normalizedQuery = submittedQuery.trim();
  const loweredQuery = normalizedQuery.toLowerCase();

  // 🧩 Fetch data from backend
  useEffect(() => {
    if (!normalizedQuery) {
      setFacultyData([]);
      setPapersData([]);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [facultyRes, papersRes] = await Promise.all([
          fetch(buildSearchUrl("/faculty/", loweredQuery), {
            signal: controller.signal,
          }),
          fetch(buildSearchUrl("/papers/", loweredQuery), {
            signal: controller.signal,
          }),
        ]);

        if (!facultyRes.ok || !papersRes.ok) {
          throw new Error("Failed to fetch search results");
        }

        const [faculty, papers] = await Promise.all([
          facultyRes.json(),
          papersRes.json(),
        ]);

        setFacultyData(faculty);
        setPapersData(papers);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        console.error("Error fetching data:", err);
        setError("Unable to load search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [loweredQuery, normalizedQuery]);

  const allResults: SearchResult[] = useMemo(
    () => [
      ...facultyData.map((f) => ({ ...f, category: "faculty" as const })),
      ...papersData.map((p) => ({ ...p, category: "papers" as const })),
    ],
    [facultyData, papersData]
  );

  const getFilteredResults = (category: string) => {
    if (!normalizedQuery) return [];
    if (category === "all") return allResults;
    if (category === "experts")
      return allResults.filter((r) => r.category === "faculty");
    return allResults.filter((r) => r.category === category);
  };

  const handleSubmit = () => {
    const trimmedQuery = activeQuery.trim();
    setSubmittedQuery(trimmedQuery);
    setActiveTab("all");
    if (trimmedQuery) {
      setSearchParams({ query: trimmedQuery });
    } else {
      setSearchParams({});
    }
  };

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
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
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
              {loading ? (
                <p className="text-center text-muted-foreground">
                  Loading results...
                </p>
              ) : error ? (
                <p className="text-center text-destructive">{error}</p>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    const filteredResults = getFilteredResults(activeTab);
                    if (filteredResults.length === 0) {
                      return normalizedQuery ? (
                        <p className="text-center text-muted-foreground">
                          No results found for "{normalizedQuery}".
                        </p>
                      ) : (
                        <p className="text-center text-muted-foreground">
                          Type a keyword to begin searching.
                        </p>
                      );
                    }

                    return filteredResults.map((result) => {
                      // 👩‍🏫 Faculty card
                      if (result.category === "faculty") {
                        return (
                          <Card
                            key={`faculty-${result.id}`}
                            className="border p-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="flex justify-center items-start">
                                <img
                                  src={
                                    result.photo ||
                                    "/images/default-profile.jpg"
                                  }
                                  alt={result.first_name}
                                  className="rounded-lg w-40 h-40 object-cover border border-border/40"
                                />
                              </div>

                              <div className="md:col-span-2 space-y-2 text-sm">
                                <p className="font-semibold text-lg">
                                  {highlightMatch(
                                    `${result.first_name} ${result.last_name}`,
                                    normalizedQuery
                                  )}
                                </p>
                                <p className="text-muted-foreground">
                                  {result.title && `${result.title}, `}
                                  {result.department}
                                </p>
                                <p>
                                  <span className="font-medium">Email:</span>{" "}
                                  {result.email}
                                </p>
                                {result.bio && (
                                  <p>
                                    {highlightMatch(result.bio, normalizedQuery)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      }

                      // 📄 Paper card
                      if (result.category === "papers") {
                        return (
                          <Card
                            key={`paper-${result.id}`}
                            className="p-6 border"
                          >
                            <h3 className="font-semibold text-lg">
                              {highlightMatch(result.title, normalizedQuery)}
                            </h3>
                            {result.abstract && (
                              <p className="text-sm text-gray-600 mt-1">
                                {highlightMatch(
                                  result.abstract.slice(0, 250),
                                  normalizedQuery
                                )}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              {result.journal && `${result.journal} `}
                              {result.date_published &&
                                `• ${result.date_published}`}
                            </p>
                          </Card>
                        );
                      }

                      return null;
                    });
                  })()}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="text-center pt-4">
            <Button variant="outline" onClick={handleSubmit}>
              Refresh results
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
