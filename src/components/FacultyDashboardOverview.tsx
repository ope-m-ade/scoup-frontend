import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type TabKey = "papers" | "projects" | "patents";

interface Profile {
  facultyId: string;
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  totalCitations: number;
  articleCount: number;
  avgCitations: number;
}

interface PaperItem {
  id: number;
  title: string;
  venue: string;
  year: string;
}

interface ProjectItem {
  id: number;
  title: string;
  status: string;
}

interface PatentItem {
  id: number;
  title: string;
  number: string;
}

const defaultProfile: Profile = {
  facultyId: "--",
  firstName: "",
  lastName: "",
  title: "",
  department: "",
  totalCitations: 0,
  articleCount: 0,
  avgCitations: 0,
};

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("facultyRefreshToken");
  if (!refresh) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      localStorage.removeItem("facultyAccessToken");
      localStorage.removeItem("facultyRefreshToken");
      return null;
    }

    const data = await response.json();
    if (data?.access) {
      localStorage.setItem("facultyAccessToken", data.access);
    }
    if (data?.refresh) {
      localStorage.setItem("facultyRefreshToken", data.refresh);
    }
    return data?.access ?? null;
  } catch {
    return null;
  }
};

const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("facultyAccessToken");
  if (!token) {
    return new Response(null, { status: 401, statusText: "Unauthorized" });
  }

  const doFetch = (authToken: string) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${authToken}`,
      },
    });

  let response = await doFetch(token);
  if (response.status !== 401) return response;

  const newToken = await refreshAccessToken();
  if (!newToken) return response;

  response = await doFetch(newToken);
  return response;
};

// helpers to normalize API objects into simple items
const mapPaperFromApi = (p: any): PaperItem => ({
  id: p.id,
  title: p.title || "",
  venue: p.journal || "",
  year: p.date_published ? String(p.date_published).slice(0, 4) : "",
});

const mapProjectFromApi = (p: any): ProjectItem => ({
  id: p.id,
  title: p.title || "",
  status: p.status || "",
});

const mapPatentFromApi = (p: any): PatentItem => ({
  id: p.id,
  title: p.title || "",
  number: p.patent_number || "",
});

export default function FacultyDashboardOverview() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("papers");

  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [patents, setPatents] = useState<PatentItem[]>([]);

  const [newPaper, setNewPaper] = useState({ title: "", venue: "", year: "" });
  const [newProject, setNewProject] = useState({ title: "", status: "" });
  const [newPatent, setNewPatent] = useState({ title: "", number: "" });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchPapers();
    fetchProjects();
    fetchPatents();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("facultyAccessToken");
    if (!token) {
      setError("Missing access token. Please log in again.");
      setLoadingProfile(false);
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/faculty/me/`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error || data?.detail || "Unable to load profile."
        );
      }

      const data = await response.json();
      setProfile({
        facultyId: data.faculty_id || defaultProfile.facultyId,
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        title: data.title || "",
        department: data.department || "",
        totalCitations: data.total_citations ?? 0,
        articleCount: data.article_count ?? 0,
        avgCitations: data.average_citations ?? 0,
      });
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error loading profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchPapers = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/faculty/papers/`);
      if (!res.ok) return;
      const data = await res.json();
      setPapers(Array.isArray(data) ? data.map(mapPaperFromApi) : []);
    } catch {
      // silent fail on overview
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/faculty/projects/`);
      if (!res.ok) return;
      const data = await res.json();
      setProjects(Array.isArray(data) ? data.map(mapProjectFromApi) : []);
    } catch {
      // silent
    }
  };

  const fetchPatents = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/faculty/patents/`);
      if (!res.ok) return;
      const data = await res.json();
      setPatents(Array.isArray(data) ? data.map(mapPatentFromApi) : []);
    } catch {
      // silent
    }
  };

  const handleAddPaper = async () => {
    if (!newPaper.title.trim()) return;

    setSaving(true);
    setError("");

    // minimal payload – backend will attach current faculty author
    const payload: any = {
      title: newPaper.title,
      journal: newPaper.venue || "",
      doi: `local-${Date.now()}`, // required, unique
    };

    if (newPaper.year.trim()) {
      payload.date_published = `${newPaper.year.trim()}-01-01`;
    }

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/faculty/papers/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Unable to add paper.");
      }

      setPapers((prev) => [...prev, mapPaperFromApi(data)]);
      setNewPaper({ title: "", venue: "", year: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding paper.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim()) return;

    setSaving(true);
    setError("");

    const payload = {
      title: newProject.title,
      status: newProject.status || "",
    };

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/faculty/projects/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.detail || data?.error || "Unable to add project."
        );
      }

      setProjects((prev) => [...prev, mapProjectFromApi(data)]);
      setNewProject({ title: "", status: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding project.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPatent = async () => {
    if (!newPatent.title.trim()) return;

    setSaving(true);
    setError("");

    const payload = {
      title: newPatent.title,
      patent_number: newPatent.number || `TEMP-${Date.now()}`,
    };

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/faculty/patents/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.detail || data?.error || "Unable to add patent.");
      }

      setPatents((prev) => [...prev, mapPatentFromApi(data)]);
      setNewPatent({ title: "", number: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding patent.");
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "papers") {
      return (
        <>
          <div className="space-y-2 mb-4">
            <Input
              placeholder="Title"
              value={newPaper.title}
              onChange={(e) =>
                setNewPaper((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Input
              placeholder="Journal / Venue"
              value={newPaper.venue}
              onChange={(e) =>
                setNewPaper((prev) => ({ ...prev, venue: e.target.value }))
              }
            />
            <Input
              placeholder="Year (optional)"
              value={newPaper.year}
              onChange={(e) =>
                setNewPaper((prev) => ({ ...prev, year: e.target.value }))
              }
            />
            <div className="flex justify-between gap-2">
              <Button size="sm" onClick={handleAddPaper} disabled={saving}>
                {saving && activeTab === "papers" ? "Adding..." : "Add paper"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/faculty/papers")}
              >
                Manage all papers
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {papers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing listed yet. Use the form above to add your first paper.
              </p>
            )}
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="rounded-lg border border-border/60 p-3"
              >
                <p className="font-medium">{paper.title}</p>
                <p className="text-sm text-muted-foreground">
                  {paper.venue}
                  {paper.year ? ` · ${paper.year}` : ""}
                </p>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (activeTab === "projects") {
      return (
        <>
          <div className="space-y-2 mb-4">
            <Input
              placeholder="Project title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Input
              placeholder="Status (e.g., Active, Planning)"
              value={newProject.status}
              onChange={(e) =>
                setNewProject((prev) => ({ ...prev, status: e.target.value }))
              }
            />
            <div className="flex justify-between gap-2">
              <Button size="sm" onClick={handleAddProject} disabled={saving}>
                {saving && activeTab === "projects"
                  ? "Adding..."
                  : "Add project"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/faculty/projects")}
              >
                Manage all projects
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No projects yet. Add one to get started.
              </p>
            )}
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-border/60 p-3"
              >
                <p className="font-medium">{project.title}</p>
                <p className="text-sm text-muted-foreground">
                  {project.status}
                </p>
              </div>
            ))}
          </div>
        </>
      );
    }

    // patents
    return (
      <>
        <div className="space-y-2 mb-4">
          <Input
            placeholder="Patent title"
            value={newPatent.title}
            onChange={(e) =>
              setNewPatent((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            placeholder="Patent number"
            value={newPatent.number}
            onChange={(e) =>
              setNewPatent((prev) => ({ ...prev, number: e.target.value }))
            }
          />
          <div className="flex justify-between gap-2">
            <Button size="sm" onClick={handleAddPatent} disabled={saving}>
              {saving && activeTab === "patents" ? "Adding..." : "Add patent"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/faculty/patents")}
            >
              Manage all patents
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {patents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No patents yet. Add one to highlight your filings.
            </p>
          )}
          {patents.map((patent) => (
            <div
              key={patent.id}
              className="rounded-lg border border-border/60 p-3"
            >
              <p className="font-medium">{patent.title}</p>
              <p className="text-sm text-muted-foreground">{patent.number}</p>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Faculty Dashboard
          </p>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-muted-foreground">
            Keep your campus profile current and showcase the work you care
            about.
          </p>
        </div>

        <Card className="border border-border p-6 rounded-xl bg-background shadow-sm">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Details from your faculty profile.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Name</p>
              <p className="font-medium">
                {profile.firstName} {profile.lastName}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-muted-foreground">Title</p>
              <p className="font-medium">{profile.title || "—"}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Department
              </p>
              <p className="font-medium">{profile.department || "—"}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Faculty ID
              </p>
              <p className="font-medium">{profile.facultyId}</p>
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate("/faculty/profile")}
              >
                Edit Profile
              </Button>
              <Button onClick={() => navigate("/faculty/uploads")}>
                Upload PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Faculty
              </p>
              <h2 className="text-3xl font-semibold">
                {profile.firstName || "Faculty"} {profile.lastName}
              </h2>
              <p className="text-muted-foreground">
                {profile.title || "Title TBD"}
                {profile.department ? ` · ${profile.department}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate("/faculty/profile")}
              >
                Edit profile
              </Button>
              <Button onClick={() => navigate("/faculty/uploads")}>
                Upload PDF
              </Button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-background/70 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Total citations
              </p>
              <p className="text-2xl font-semibold">{profile.totalCitations}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/70 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Articles indexed
              </p>
              <p className="text-2xl font-semibold">{profile.articleCount}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/70 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Avg citations / paper
              </p>
              <p className="text-2xl font-semibold">
                {profile.avgCitations.toFixed(1)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Faculty ID: {profile.facultyId}
          </p>
        </div> */}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loadingProfile && (
          <p className="text-sm text-muted-foreground">
            Loading faculty data...
          </p>
        )}
      </header>

      {/* SINGLE CARD with button-style tabs */}
      <section>
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Research snapshot</CardTitle>
                <CardDescription>
                  Quick view of your papers, projects, and patents.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "papers" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("papers")}
                >
                  Papers
                </Button>
                <Button
                  variant={activeTab === "projects" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("projects")}
                >
                  Projects
                </Button>
                <Button
                  variant={activeTab === "patents" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("patents")}
                >
                  Patents
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderTabContent()}</CardContent>
        </Card>
      </section>
    </div>
  );
}

// import { Input } from "./ui/input";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Button } from "./ui/button";
// import { Alert, AlertDescription } from "./ui/alert";

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// const defaultProfile = {
//   facultyId: "--",
//   firstName: "",
//   lastName: "",
//   title: "",
//   department: "",
//   totalCitations: 0,
//   articleCount: 0,
//   avgCitations: 0,
// };

// const refreshAccessToken = async () => {
//   const refresh = localStorage.getItem("facultyRefreshToken");
//   if (!refresh) return null;

//   try {
//     const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ refresh }),
//     });

//     if (!response.ok) {
//       localStorage.removeItem("facultyAccessToken");
//       localStorage.removeItem("facultyRefreshToken");
//       return null;
//     }

//     const data = await response.json();
//     if (data?.access) {
//       localStorage.setItem("facultyAccessToken", data.access);
//     }
//     if (data?.refresh) {
//       localStorage.setItem("facultyRefreshToken", data.refresh);
//     }
//     return data?.access ?? null;
//   } catch {
//     return null;
//   }
// };

// const fetchWithAuth = async (
//   url: string,
//   options: RequestInit = {}
// ): Promise<Response> => {
//   const token = localStorage.getItem("facultyAccessToken");
//   if (!token) {
//     return new Response(null, { status: 401, statusText: "Unauthorized" });
//   }

//   const doFetch = (authToken: string) =>
//     fetch(url, {
//       ...options,
//       headers: {
//         ...(options.headers || {}),
//         Authorization: `Bearer ${authToken}`,
//       },
//     });

//   let response = await doFetch(token);
//   if (response.status !== 401) return response;

//   const newToken = await refreshAccessToken();
//   if (!newToken) return response;

//   response = await doFetch(newToken);
//   return response;
// };

// export default function FacultyDashboardOverview() {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(defaultProfile);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [papers, setPapers] = useState<
//     { title: string; venue: string; year: string }[]
//   >([]);
//   const [projects, setProjects] = useState<{ title: string; status: string }[]>(
//     []
//   );
//   const [patents, setPatents] = useState<{ title: string; number: string }[]>(
//     []
//   );
//   const [newPaper, setNewPaper] = useState({ title: "", venue: "", year: "" });
//   const [newProject, setNewProject] = useState({ title: "", status: "" });
//   const [newPatent, setNewPatent] = useState({ title: "", number: "" });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     const token = localStorage.getItem("facultyAccessToken");
//     if (!token) {
//       setError("Missing access token. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetchWithAuth(`${API_BASE_URL}/faculty/me/`);

//       if (!response.ok) {
//         const data = await response.json().catch(() => ({}));
//         throw new Error(
//           data?.error || data?.detail || "Unable to load profile."
//         );
//       }

//       const data = await response.json();
//       setProfile({
//         facultyId: data.faculty_id || defaultProfile.facultyId,
//         firstName: data.first_name || "",
//         lastName: data.last_name || "",
//         title: data.title || "",
//         department: data.department || "",
//         totalCitations: data.total_citations ?? 0,
//         articleCount: data.article_count ?? 0,
//         avgCitations: data.average_citations ?? 0,
//       });
//       setError("");
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Unexpected error loading profile."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <header className="space-y-4">
//         <div className="flex flex-col gap-2">
//           <p className="text-sm uppercase tracking-wide text-muted-foreground">
//             Faculty Dashboard
//           </p>
//           <h1 className="text-3xl font-semibold">Welcome back</h1>
//           <p className="text-muted-foreground">
//             Keep your campus profile current and showcase the work you care
//             about.
//           </p>
//         </div>

//         <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm">
//           <div className="flex flex-wrap items-center gap-4">
//             <div className="flex-1">
//               <p className="text-xs uppercase tracking-wide text-muted-foreground">
//                 Faculty
//               </p>
//               <h2 className="text-3xl font-semibold">
//                 {profile.firstName || "Faculty"} {profile.lastName}
//               </h2>
//               <p className="text-muted-foreground">
//                 {profile.title || "Title TBD"}
//                 {profile.department ? ` · ${profile.department}` : ""}
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 variant="secondary"
//                 onClick={() => navigate("/faculty/profile")}
//               >
//                 Edit profile
//               </Button>
//               <Button onClick={() => navigate("/faculty/uploads")}>
//                 Upload PDF
//               </Button>
//             </div>
//           </div>
//           <div className="mt-4 grid gap-4 sm:grid-cols-3">
//             <div className="rounded-lg border border-border/60 bg-background/70 p-3">
//               <p className="text-xs uppercase tracking-wide text-muted-foreground">
//                 Total citations
//               </p>
//               <p className="text-2xl font-semibold">{profile.totalCitations}</p>
//             </div>
//             <div className="rounded-lg border border-border/60 bg-background/70 p-3">
//               <p className="text-xs uppercase tracking-wide text-muted-foreground">
//                 Articles indexed
//               </p>
//               <p className="text-2xl font-semibold">{profile.articleCount}</p>
//             </div>
//             <div className="rounded-lg border border-border/60 bg-background/70 p-3">
//               <p className="text-xs uppercase tracking-wide text-muted-foreground">
//                 Avg citations / paper
//               </p>
//               <p className="text-2xl font-semibold">
//                 {profile.avgCitations.toFixed(1)}
//               </p>
//             </div>
//           </div>
//           <p className="mt-4 text-xs text-muted-foreground">
//             Faculty ID: {profile.facultyId}
//           </p>
//         </div>

//         {error && (
//           <Alert variant="destructive">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
//       </header>

//       <section className="grid gap-6 lg:grid-cols-3">
//         <Card>
//           <CardHeader className="space-y-3">
//             <div>
//               <CardTitle>Papers</CardTitle>
//               <CardDescription>
//                 Keep your publication list fresh for discovery.
//               </CardDescription>
//             </div>
//             <div className="space-y-2">
//               <Input
//                 placeholder="Title"
//                 value={newPaper.title}
//                 onChange={(e) =>
//                   setNewPaper((prev) => ({ ...prev, title: e.target.value }))
//                 }
//               />
//               <Input
//                 placeholder="Journal / Venue"
//                 value={newPaper.venue}
//                 onChange={(e) =>
//                   setNewPaper((prev) => ({ ...prev, venue: e.target.value }))
//                 }
//               />
//               <Input
//                 placeholder="Year"
//                 value={newPaper.year}
//                 onChange={(e) =>
//                   setNewPaper((prev) => ({ ...prev, year: e.target.value }))
//                 }
//               />
//               <Button
//                 size="sm"
//                 onClick={() => {
//                   if (!newPaper.title.trim()) return;
//                   setPapers((prev) => [...prev, newPaper]);
//                   setNewPaper({ title: "", venue: "", year: "" });
//                 }}
//               >
//                 Add paper
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {papers.map((paper, idx) => (
//               <div
//                 key={`${paper.title}-${idx}`}
//                 className="rounded-lg border p-3"
//               >
//                 <p className="font-medium">{paper.title}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {paper.venue}
//                   {paper.year ? ` · ${paper.year}` : ""}
//                 </p>
//               </div>
//             ))}
//             {papers.length === 0 && (
//               <p className="text-sm text-muted-foreground">
//                 Nothing listed yet. Use the form above to add your first paper.
//               </p>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="space-y-3">
//             <div>
//               <CardTitle>Projects</CardTitle>
//               <CardDescription>
//                 Track the initiatives you want colleagues to see.
//               </CardDescription>
//             </div>
//             <div className="space-y-2">
//               <Input
//                 placeholder="Project title"
//                 value={newProject.title}
//                 onChange={(e) =>
//                   setNewProject((prev) => ({ ...prev, title: e.target.value }))
//                 }
//               />
//               <Input
//                 placeholder="Status (e.g., Active, Planning)"
//                 value={newProject.status}
//                 onChange={(e) =>
//                   setNewProject((prev) => ({ ...prev, status: e.target.value }))
//                 }
//               />
//               <Button
//                 size="sm"
//                 onClick={() => {
//                   if (!newProject.title.trim()) return;
//                   setProjects((prev) => [...prev, newProject]);
//                   setNewProject({ title: "", status: "" });
//                 }}
//               >
//                 Add project
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {projects.map((project, idx) => (
//               <div
//                 key={`${project.title}-${idx}`}
//                 className="rounded-lg border p-3"
//               >
//                 <p className="font-medium">{project.title}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {project.status}
//                 </p>
//               </div>
//             ))}
//             {projects.length === 0 && (
//               <p className="text-sm text-muted-foreground">
//                 No projects yet. Add one to get started.
//               </p>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="space-y-3">
//             <div>
//               <CardTitle>Patents</CardTitle>
//               <CardDescription>
//                 List filings or disclosures linked to your work.
//               </CardDescription>
//             </div>
//             <div className="space-y-2">
//               <Input
//                 placeholder="Patent title"
//                 value={newPatent.title}
//                 onChange={(e) =>
//                   setNewPatent((prev) => ({ ...prev, title: e.target.value }))
//                 }
//               />
//               <Input
//                 placeholder="Patent number"
//                 value={newPatent.number}
//                 onChange={(e) =>
//                   setNewPatent((prev) => ({ ...prev, number: e.target.value }))
//                 }
//               />
//               <Button
//                 size="sm"
//                 onClick={() => {
//                   if (!newPatent.title.trim()) return;
//                   setPatents((prev) => [...prev, newPatent]);
//                   setNewPatent({ title: "", number: "" });
//                 }}
//               >
//                 Add patent
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {patents.map((patent, idx) => (
//               <div
//                 key={`${patent.title}-${idx}`}
//                 className="rounded-lg border p-3"
//               >
//                 <p className="font-medium">{patent.title}</p>
//                 <p className="text-sm text-muted-foreground">{patent.number}</p>
//               </div>
//             ))}
//             {patents.length === 0 && (
//               <p className="text-sm text-muted-foreground">
//                 No patents yet. Add one to highlight your filings.
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </section>
//       {loading && (
//         <p className="text-sm text-muted-foreground">Loading faculty data...</p>
//       )}
//     </div>
//   );
// }
