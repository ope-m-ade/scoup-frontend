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
import { FileUp, PenLine, Plus, FileText } from "lucide-react";

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

const defaultKeywords: string[] = [];

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
  options: RequestInit = {},
): Promise<Response> => {
  const token = localStorage.getItem("facultyAccessToken");
  if (!token) {
    return new Response(null, { status: 401, statusText: "Unauthorized" });
  }

  const doFetch = (authToken: string) =>
    fetch(url, {
      ...options,
      headers: {
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

export default function FacultyProfilePage() {
  const [profile, setProfile] = useState<FacultyProfile>(defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [personalKeywords, setPersonalKeywords] =
    useState<string[]>(defaultKeywords);
  const [newKeyword, setNewKeyword] = useState("");
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
      const response = await fetchWithAuth(`${API_BASE_URL}/faculty/me/`);

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
      const response = await fetchWithAuth(`${API_BASE_URL}/faculty/me/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Faculty Dashboard
          </p>
          <h1 className="text-3xl font-semibold">Profile & Activity</h1>
        </div>
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
            <h2 className="text-2xl font-bold">
              {profile.firstName || "Faculty"} {profile.lastName}
            </h2>
            <p className="text-muted-foreground">
              {profile.title || "Title TBD"}
              {profile.department ? ` · ${profile.department}` : ""}
            </p>
          </div>
          {loadingProfile && (
            <span className="text-sm text-muted-foreground">Syncing profile...</span>
          )}
        </div>
      </header>

      <Card>
        <CardHeader className="grid gap-2 sm:flex sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Metrics
            </CardTitle>
            <CardDescription>Snapshot of your current record.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground tracking-wide">
                Total citations
              </p>
              <p className="text-xl font-semibold">{profile.totalCitations}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground tracking-wide">
                Articles indexed
              </p>
              <p className="text-xl font-semibold">{profile.articleCount}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground tracking-wide">
                Avg citations / paper
              </p>
              <p className="text-xl font-semibold">
                {profile.avgCitations.toFixed(1)}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

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
            <CardTitle>Keywords</CardTitle>
            <CardDescription>
              Help colleagues find you by keeping this list fresh.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex flex-wrap gap-2">
                {personalKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No keywords yet.
                  </p>
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
            <p className="text-xs text-muted-foreground">
              Keywords sync with your faculty profile and power the search
              experience across the campus portal.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
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
      </section>
    </div>
  );
}
