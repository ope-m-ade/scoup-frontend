import { useState, useEffect } from "react";

interface Project {
  id: number;
  title: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  keywords?: string[] | null;
}

export default function ProjectsPage() {
  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const token = localStorage.getItem("facultyAccessToken") || "";

  const [projects, setProjects] = useState<Project[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  // Load projects
  useEffect(() => {
    if (!token) return;

    fetch(API + "/faculty/projects/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setProjects(data));
  }, [API, token]);

  // Add project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !keywords.trim()) {
      alert("Title and at least 1 keyword are required.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    };

    setLoading(true);

    const res = await fetch(API + "/faculty/projects/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Error adding project.");
      setLoading(false);
      return;
    }

    setProjects((prev) => [...prev, data]);

    // Reset form
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setKeywords("");

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Document your current and past projects to showcase your body of work.
        </p>
      </header>

      {/* FORM */}
      <form
        onSubmit={handleAddProject}
        className="space-y-6 border border-border rounded-xl p-6 shadow-sm bg-background"
      >
        <h2 className="text-xl font-semibold">Add a new project</h2>

        {/* Title */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            className="border border-border rounded-md px-3 py-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <textarea
            className="border border-border rounded-md px-3 py-2 w-full min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short summary"
          />
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Start date</label>
            <input
              type="date"
              className="border border-border rounded-md px-3 py-2 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">End date</label>
            <input
              type="date"
              className="border border-border rounded-md px-3 py-2 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Keywords (comma separated) <span className="text-red-600">*</span>
          </label>
          <input
            className="border border-border rounded-md px-3 py-2 w-full"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="AI, grant writing, sustainability"
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Submit"}
          </button>
        </div>
      </form>

      {/* LIST */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your projects</h2>

        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No projects yet. Add one above.
          </p>
        )}

        <div className="space-y-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="border border-border rounded-xl p-5 shadow-sm bg-white"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <button className="text-sm text-emerald-700 hover:text-emerald-900">
                  Edit
                </button>
              </div>

              {/* Dates */}
              <div className="text-xs text-muted-foreground flex gap-4 mt-1">
                {project.start_date && <span>Start: {project.start_date}</span>}
                {project.end_date && <span>End: {project.end_date}</span>}
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-sm leading-relaxed mt-3">
                  {project.description}
                </p>
              )}

              {/* Keywords */}
              {project.keywords && project.keywords.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Keywords: {project.keywords.join(", ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
