export { default } from "./FacultyProfilePage";

/* Legacy dashboard kept for reference
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  FileUp,
  PenLine,
  Plus,
  Check,
  X,
  FileText,
  Lightbulb,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface FacultyProfile {
  id?: number;
  facultyId: string;
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  office: string;
  room: string;
  phone: string;
  email: string;
  bio: string;
  totalCitations: number;
  articleCount: number;
  avgCitations: number;
}

const defaultProfile: FacultyProfile = {
  facultyId: "--",
  firstName: "",
  lastName: "",
  title: "",
  department: "",
  office: "",
  room: "",
  phone: "",
  email: "",
  bio: "",
  totalCitations: 0,
  articleCount: 0,
  avgCitations: 0,
};

const defaultKeywords = [
  "Human-centered AI",
  "Faculty development",
  "Learning analytics",
];

const samplePapers = [
  {
    title: "Learning Analytics for Inclusive STEM Studios",
    journal: "IEEE Transactions on Learning Technologies",
    year: 2024,
  },
  {
    title: "Human-in-the-loop Curation of Research Keywords",
    journal: "Journal of Informetrics",
    year: 2023,
  },
];

const sampleProjects = [
  {
    title: "Adaptive Mentorship Recommender",
    status: "In Progress",
    start: "2023",
  },
  {
    title: "Cross-campus AI Literacy Initiative",
    status: "Proposed",
    start: "2024",
  },
];

const samplePatents = [
  {
    title: "Systems and Methods for Semantic Author Disambiguation",
    number: "US 10,987,654",
  },
];

const aiKeywordSuggestions = [
  { label: "Generative Pedagogy", confidence: 0.82, status: "pending" as const },
  {
    label: "AI-assisted Faculty Development",
    confidence: 0.76,
    status: "pending" as const,
  },
  {
    label: "Responsible Model Stewardship",
    confidence: 0.71,
    status: "pending" as const,
  },
];

const mapApiToProfile = (data: any): FacultyProfile => ({
  id: data.id,
  facultyId: data.faculty_id || defaultProfile.facultyId,
  firstName: data.first_name || "",
  lastName: data.last_name || "",
  title: data.title || "",
  department: data.department || "",
  office: data.office || "",
  room: data.room || "",
  phone: data.phone || "",
  email: data.email || "",
  bio: data.bio || "",
  totalCitations: data.total_citations ?? 0,
  articleCount: data.article_count ?? 0,
  avgCitations: data.average_citations ?? 0,
});

const keywordsFromText = (value?: string | null) =>
  value
    ?.split(/[\n,]/)
    .map((kw) => kw.trim())
    .filter(Boolean) ?? [];

const keywordsToText = (keywords: string[]) => keywords.join(", ");

export default function FacultyDashboard() {
  const [profile, setProfile] = useState<FacultyProfile>(defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [personalKeywords, setPersonalKeywords] =
    useState<string[]>(defaultKeywords);
  const [newKeyword, setNewKeyword] = useState("");
  const [aiKeywords, setAiKeywords] = useState(
    aiKeywordSuggestions.map((k) => ({ ...k, status: "pending" as const })),
  );
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("facultyAccessToken");
    if (!token) {
      setProfileError("Missing access token. Please log in again.");
      setLoadingProfile(false);
      return;
    }

    try {
      setProfileError("");
      const response = await fetch(`${API_BASE_URL}/faculty/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || data?.detail || "Unable to load profile.");
      }

      const data = await response.json();
      setProfile(mapApiToProfile(data));
      setPersonalKeywords(keywordsFromText(data.faculty_keywords));
    } catch (err) {
      setProfileError(
        err instanceof Error
          ? err.message
          : "Unexpected error loading profile.",
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleProfileChange = (field: keyof FacultyProfile, value: string) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const handleProfileSave = async () => {
    const token = localStorage.getItem("facultyAccessToken");
    if (!token) {
      setProfileError("Missing access token. Please log in again.");
      return;
    }

    setSavingProfile(true);
    setSaveMessage("");
    setProfileError("");

    const payload = {
      first_name: profile.firstName,
      last_name: profile.lastName,
      title: profile.title,
      department: profile.department,
      office: profile.office,
      room: profile.room,
      phone: profile.phone,
      email: profile.email,
      bio: profile.bio,
      faculty_keywords: keywordsToText(personalKeywords),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/faculty/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || data?.error || "Unable to save changes.");
      }

      setProfile(mapApiToProfile(data));
      setPersonalKeywords(keywordsFromText(data.faculty_keywords));
      setSaveMessage("Profile updated successfully.");
    } catch (err) {
      setProfileError(
        err instanceof Error
          ? err.message
          : "Unexpected error saving profile.",
      );
    } finally {
      setSavingProfile(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    setPersonalKeywords((prev) => [...prev, newKeyword.trim()]);
    setNewKeyword("");
  };

  const handleKeywordAction = (label: string, action: "approve" | "reject") => {
    setAiKeywords((prev) =>
      prev.map((keyword) =>
        keyword.label === label ? { ...keyword, status: action } : keyword,
      ),
    );
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (!files.length) return;
    const pdfs = files.filter((file) => file.type === "application/pdf");
    if (!pdfs.length) {
      setUploadError("Only PDF files are supported for now.");
      return;
    }
    setUploadError("");
    setDocuments((prev) => [...prev, ...pdfs]);
    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-6">
      <header className="space-y-3">
        {profileError && (
          <Alert variant="destructive">
            <AlertDescription>{profileError}</AlertDescription>
          </Alert>
        )}
        {saveMessage && (
          <Alert>
            <AlertDescription>{saveMessage}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Faculty ID</p>
            <p className="text-lg font-semibold">
              {profile.facultyId || "--"}
            </p>
          </div>
          <Separator orientation="vertical" className="h-10 hidden md:block" />
          <div>
            <h1 className="text-2xl font-bold">
              {profile.firstName || "Faculty"} {profile.lastName}
            </h1>
            <p className="text-muted-foreground">
              {profile.title || "Title TBD"}
              {profile.department ? ` · ${profile.department}` : ""}
            </p>
          </div>
          {loadingProfile && (
            <span className="text-sm text-muted-foreground">Syncing profile...</span>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Citations</CardDescription>
              <CardTitle className="text-3xl">{profile.totalCitations}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Articles indexed</CardDescription>
              <CardTitle className="text-3xl">{profile.articleCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average citations / paper</CardDescription>
              <CardTitle className="text-3xl">
                {profile.avgCitations.toFixed(1)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Profile management</CardTitle>
              <CardDescription>
                Keep your campus profile accurate for discovery results.
              </CardDescription>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={handleProfileSave}
              disabled={savingProfile}
            >
              <PenLine className="h-4 w-4" />
              {savingProfile ? "Saving..." : "Save changes"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={profile.firstName}
                onChange={(e) => handleProfileChange("firstName", e.target.value)}
                placeholder="First name"
              />
              <Input
                value={profile.lastName}
                onChange={(e) => handleProfileChange("lastName", e.target.value)}
                placeholder="Last name"
              />
              <Input
                value={profile.title}
                onChange={(e) => handleProfileChange("title", e.target.value)}
                placeholder="Title"
              />
              <Input
                value={profile.department}
                onChange={(e) =>
                  handleProfileChange("department", e.target.value)
                }
                placeholder="Department"
              />
              <Input
                value={profile.office}
                onChange={(e) => handleProfileChange("office", e.target.value)}
                placeholder="Office / Building"
              />
              <Input
                value={profile.room}
                onChange={(e) => handleProfileChange("room", e.target.value)}
                placeholder="Room"
              />
              <Input
                value={profile.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                placeholder="Phone"
              />
              <Input
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                placeholder="Email"
              />
            </div>
            <Textarea
              value={profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              placeholder="Short bio"
            />
            <div className="flex justify-end">
              <Button
                className="gap-2"
                onClick={handleProfileSave}
                disabled={savingProfile}
              >
                <PenLine className="h-4 w-4" />
                {savingProfile ? "Publishing..." : "Publish updates"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyword stewardship</CardTitle>
            <CardDescription>
              Combine your self-identified keywords with AI suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">Your keywords</p>
              <div className="flex flex-wrap gap-2">
                {personalKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">No keywords yet.</p>
                )}
                {personalKeywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword"
                />
                <Button onClick={addKeyword} type="button">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                AI suggestions
              </div>
              {aiKeywords.map((keyword) => (
                <div
                  key={keyword.label}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div>
                    <p className="font-medium">{keyword.label}</p>
                    <p className="text-xs text-muted-foreground">
                      Confidence {(keyword.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        keyword.status === "approve" ? "default" : "secondary"
                      }
                      size="icon"
                      onClick={() => handleKeywordAction(keyword.label, "approve")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        keyword.status === "reject" ? "destructive" : "ghost"
                      }
                      size="icon"
                      onClick={() => handleKeywordAction(keyword.label, "reject")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upload PDFs</CardTitle>
            <CardDescription>
              We’ll extract metadata and feed it into Scoup automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center cursor-pointer hover:bg-muted/40 transition">
              <FileUp className="h-10 w-10 text-muted-foreground" />
              <p className="font-medium">Drop PDF or browse</p>
              <p className="text-sm text-muted-foreground">
                Max 25MB · PDF only
              </p>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </label>

            {uploadError && (
              <Alert variant="destructive">
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">
                  No uploads yet.
                </p>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.name + doc.lastModified}
                    className="flex items-center gap-3 rounded-md border p-2 text-sm"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 truncate">{doc.name}</div>
                    <Badge variant="secondary">Queued</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Papers</CardTitle>
              <CardDescription>Your curated research outputs.</CardDescription>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add paper
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {samplePapers.map((paper) => (
              <div key={paper.title} className="rounded-lg border p-3">
                <p className="font-medium">{paper.title}</p>
                <p className="text-sm text-muted-foreground">
                  {paper.journal} · {paper.year}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Projects & Patents</CardTitle>
              <CardDescription>Track initiatives and filings.</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">Projects</p>
              <div className="space-y-2">
                {sampleProjects.map((project) => (
                  <div key={project.title} className="rounded-lg border p-3">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.status} · since {project.start}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-semibold mb-2">Patents</p>
              {samplePatents.map((patent) => (
                <div key={patent.number} className="rounded-lg border p-3">
                  <p className="font-medium">{patent.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {patent.number}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
*/
