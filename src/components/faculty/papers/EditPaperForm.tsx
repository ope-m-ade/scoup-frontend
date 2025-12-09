import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Alert, AlertDescription } from "../../ui/alert";
import { Button } from "../../ui/button";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type PaperFormState = {
  title: string;
  journal: string;
  doi: string;
  date_published: string;
  abstract: string;
  download_url: string;
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

const toDateInput = (value?: string | null) =>
  value ? String(value).slice(0, 10) : "";

export default function EditPaperForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<PaperFormState>({
    title: "",
    journal: "",
    doi: "",
    date_published: "",
    abstract: "",
    download_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPaper = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/faculty/papers/${id}/`
        );
        if (!res.ok) {
          throw new Error("Unable to load paper.");
        }
        const data = await res.json();
        setForm({
          title: data.title || "",
          journal: data.journal || "",
          doi: data.doi || "",
          date_published: toDateInput(data.date_published),
          abstract: data.abstract || "",
          download_url: data.download_url || "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unexpected error loading paper."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPaper();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!localStorage.getItem("facultyAccessToken")) {
      setError("Missing access token. Please log in again.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetchWithAuth(
        isEdit
          ? `${API_BASE_URL}/faculty/papers/${id}/`
          : `${API_BASE_URL}/faculty/papers/`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(
          data?.detail ||
            data?.error ||
            (isEdit ? "Unable to save paper." : "Unable to add paper.")
        );
      }
      navigate("/faculty/papers");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error saving paper."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-600">Loading paper...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Paper" : "Add Paper"}</CardTitle>
        <CardDescription>Keep your work up-to-date and accurate.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-sm font-medium text-gray-800"
              htmlFor="journal"
            >
              Journal
            </label>
            <input
              id="journal"
              name="journal"
              value={form.journal}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800" htmlFor="doi">
              DOI
            </label>
            <input
              id="doi"
              name="doi"
              value={form.doi}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-sm font-medium text-gray-800"
              htmlFor="date_published"
            >
              Date Published
            </label>
            <input
              id="date_published"
              name="date_published"
              type="date"
              value={form.date_published}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-sm font-medium text-gray-800"
              htmlFor="download_url"
            >
              Download URL
            </label>
            <input
              id="download_url"
              name="download_url"
              value={form.download_url}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-sm font-medium text-gray-800"
              htmlFor="abstract"
            >
              Abstract
            </label>
            <textarea
              id="abstract"
              name="abstract"
              value={form.abstract}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                ? "Save"
                : "Add paper"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/faculty/papers")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
