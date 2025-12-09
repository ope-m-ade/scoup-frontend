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

type ProjectFormState = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  funding_source: string;
  link: string;
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

export default function EditProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<ProjectFormState>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "",
    funding_source: "",
    link: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/faculty/projects/${id}/`
        );
        if (!res.ok) {
          throw new Error("Unable to load project.");
        }
        const data = await res.json();
        setForm({
          title: data.title || "",
          description: data.description || "",
          start_date: toDateInput(data.start_date),
          end_date: toDateInput(data.end_date),
          status: data.status || "",
          funding_source: data.funding_source || "",
          link: data.link || "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unexpected error loading project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
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
          ? `${API_BASE_URL}/faculty/projects/${id}/`
          : `${API_BASE_URL}/faculty/projects/`,
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
            (isEdit ? "Unable to save project." : "Unable to add project.")
        );
      }
      navigate("/faculty/projects");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error saving project."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-600">Loading project...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Project" : "Add Project"}</CardTitle>
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
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-gray-800"
                htmlFor="start_date"
              >
                Start Date
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-gray-800"
                htmlFor="end_date"
              >
                End Date
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800" htmlFor="status">
              Status
            </label>
            <input
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-sm font-medium text-gray-800"
              htmlFor="funding_source"
            >
              Funding Source
            </label>
            <input
              id="funding_source"
              name="funding_source"
              value={form.funding_source}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800" htmlFor="link">
              Link
            </label>
            <input
              id="link"
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
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
                : "Add project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/faculty/projects")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
