import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Building,
  Lightbulb,
  BookOpen,
  Users,
  Mail,
  Phone,
  FileText,
  Award,
  Layers,
  ChevronDown,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { ImageWithFallback } from "./figma/ImageWithFallback";

import { facultyData } from "../data/faculty";
// import { projectsData } from "../data/projects";
// import { papersData } from "../data/papers";
// import { patentsData } from "../data/patents";

interface SearchDemoProps {
  onBack?: () => void;
}

export function SearchDemo({ onBack }: SearchDemoProps) {
  const [activeQuery, setActiveQuery] = useState(
    "cybersecurity data analytics"
  );
  const [activeTab, setActiveTab] = useState("all");
  const [searchFilter, setSearchFilter] = useState("all");

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

  const allResults = [
    ...facultyData,
    // ...projectsData,
    // ...papersData,
    // ...patentsData,
  ];

  const getFilteredResults = (category: string) => {
    if (category === "all") return allResults;
    return allResults.filter((result) => result.category === category);
  };

  const queries = [
    "cybersecurity data analytics",
    "environmental sustainability research",
    "business process optimization",
    "educational technology innovation",
  ];

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
                  placeholder="Search keywords in papers, patents, projects, or find faculty expertise..."
                  className="pl-12 pr-36 py-3 bg-card border-border"
                />

                {/* Filter Dropdown in Search
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        {getSelectedFilter().icon}
                        <span className="ml-1 mr-1 text-xs">
                          {getSelectedFilter().label}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {filterOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => {
                            setSearchFilter(option.value);
                            // Sync with tabs - map filter values to tab values
                            const tabMapping = {
                              all: "all",
                              faculty: "experts",
                              projects: "projects",
                              papers: "papers",
                              patents: "patents",
                            };
                            setActiveTab(
                              tabMapping[
                                option.value as keyof typeof tabMapping
                              ] || "all"
                            );
                          }}
                          className="flex items-center gap-2"
                        >
                          {option.icon}
                          <span>{option.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div> */}
              </div>

              <div className="flex flex-wrap gap-2">
                {queries.map((query) => (
                  <Button
                    key={query}
                    variant={activeQuery === query ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveQuery(query)}
                    className="text-sm"
                  >
                    {query}
                  </Button>
                ))}
              </div>

              {/* Filters
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="w-3 h-3" />
                  Available now
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="w-3 h-3" />
                  Active research
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Users className="w-3 h-3" />
                  Collaboration ready
                </Badge>
              </div> */}
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
                  {getFilteredResults(activeTab)
                    .filter(
                      (result) =>
                        // Check AI keywords, Faculty keywords, or name for the search query
                        activeQuery === "" ||
                        result.aiKeywords?.some((kw) =>
                          kw.toLowerCase().includes(activeQuery.toLowerCase())
                        ) ||
                        result.facultyKeywords?.some((kw) =>
                          kw.toLowerCase().includes(activeQuery.toLowerCase())
                        ) ||
                        result.name
                          .toLowerCase()
                          .includes(activeQuery.toLowerCase())
                    )
                    .map((result) => (
                      <Card
                        key={result.id}
                        className="border border-border/50 hover:border-border transition-colors cursor-pointer p-6"
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
                                      {kw}
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
                                      {kw}
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
                            <p className="font-semibold text-lg">
                              {result.name}
                            </p>
                            {result.department && (
                              <p className="text-muted-foreground">
                                {result.title}, {result.department}
                              </p>
                            )}
                            {result.office && (
                              <p>
                                <span className="font-medium">Office:</span>{" "}
                                {result.office}
                              </p>
                            )}
                            {result.phone && (
                              <p>
                                <span className="font-medium">Phone:</span>{" "}
                                {result.phone}
                              </p>
                            )}
                            {result.email && (
                              <p>
                                <span className="font-medium">Email:</span>{" "}
                                {result.email}
                              </p>
                            )}

                            <div className="pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                              >
                                <Mail className="w-3 h-3 mr-1" />
                                Connect
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
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
