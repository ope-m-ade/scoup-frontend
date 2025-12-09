import { useState, useEffect } from "react";

interface Paper {
  id: number;
  title: string;
  doi: string;
  abstract?: string;
  journal?: string;
  date_published?: string | null;
  url?: string | null;
  keywords?: string[] | null;
}

export default function PapersPage() {
  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const token = localStorage.getItem("facultyAccessToken") || "";

  const [papers, setPapers] = useState<Paper[]>([]);

  // Form fields
  const [title, setTitle] = useState("");
  const [doi, setDoi] = useState("");
  const [abstract, setAbstract] = useState("");
  const [journal, setJournal] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch papers once on mount
  useEffect(() => {
    if (!token) return;

    fetch(API + "/faculty/papers/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPapers(data as Paper[]);
        }
      })
      .catch(() => {
        // you can show a toast here if you want
      });
  }, [API, token]);

  const handleAddPaper = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !doi.trim() || !keywords.trim()) {
      alert("Title, DOI, and at least 1 keyword are required.");
      return;
    }

    setLoading(true);
    const payload = {
      title: title.trim(),
      doi: doi.trim(),
      abstract: abstract.trim() || null,
      journal: journal.trim() || null,
      date_published: datePublished || null,
      url: url.trim() || null,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch(API + "/faculty/papers/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert("Error adding paper.");
        return;
      }

      // Add to local list
      setPapers((prev) => [...prev, data as Paper]);

      // Reset form
      setTitle("");
      setDoi("");
      setAbstract("");
      setJournal("");
      setDatePublished("");
      setUrl("");
      setKeywords("");
    } catch (err) {
      console.error(err);
      alert("Network error adding paper.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold">Papers</h1>
        <p className="text-muted-foreground">
          Add and maintain your research publications. Changes here feed
          directly into the search experience.
        </p>
      </header>

      {/* ADD PAPER FORM */}
      <form
        onSubmit={handleAddPaper}
        className="space-y-6 border border-border rounded-xl p-6 shadow-sm bg-background"
      >
        <h2 className="text-xl font-semibold">Add a new paper</h2>

        {/* Title + DOI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              className="border border-border rounded-md px-3 py-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Full paper title"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              DOI <span className="text-red-600">*</span>
            </label>
            <input
              className="border border-border rounded-md px-3 py-2 w-full"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="10.xxxx/xxxxx"
            />
          </div>
        </div>

        {/* Abstract */}
        <div>
          <label className="block mb-1 text-sm font-medium">Abstract</label>
          <textarea
            className="border border-border rounded-md px-3 py-2 w-full min-h-[100px]"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            placeholder="Short summary of the paper (optional but recommended)"
          />
        </div>

        {/* Journal + Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Journal</label>
            <input
              className="border border-border rounded-md px-3 py-2 w-full"
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="Journal or venue"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Date published
            </label>
            <input
              type="date"
              className="border border-border rounded-md px-3 py-2 w-full"
              value={datePublished}
              onChange={(e) => setDatePublished(e.target.value)}
            />
          </div>
        </div>

        {/* Link + Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div>
            <label className="block mb-1 text-sm font-medium">
              Link to paper <span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              className="border border-border rounded-md px-3 py-2 w-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div> */}

          <div>
            <label className="block mb-1 text-sm font-medium">
              Keywords (comma separated) <span className="text-red-600">*</span>
            </label>
            <input
              className="border border-border rounded-md px-3 py-2 w-full"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="AI, machine learning, data mining"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON – clearly visible */}
        <div className="submit-btn">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Adding..." : "Submit"}
          </button>
        </div>
      </form>

      {/* LIST OF PAPERS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your papers</h2>

        {papers.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No papers added yet. Use the form above to add your first paper.
          </p>
        )}

        <div className="space-y-3">
          {papers.map((paper) => (
            <article
              key={paper.id}
              className="border border-border rounded-lg p-4 flex flex-col gap-2 bg-background/80"
            >
              {/* Top row: title + DOI */}
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                <h3 className="font-semibold text-lg">{paper.title}</h3>
                {paper.doi && (
                  <p className="text-xs text-muted-foreground">
                    DOI: {paper.doi}
                  </p>
                )}
              </div>

              {/* Meta row */}
              <div className="text-sm text-muted-foreground flex flex-wrap gap-4">
                {paper.journal && <span>{paper.journal}</span>}
                {paper.date_published && (
                  <span>Published: {paper.date_published}</span>
                )}
              </div>

              {/* Abstract */}
              {paper.abstract && (
                <p className="text-sm mt-1 leading-snug">{paper.abstract}</p>
              )}

              {/* Link + keywords + actions */}
              <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="text-sm space-y-1">
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline break-all"
                    >
                      View paper
                    </a>
                  )}

                  {paper.keywords && paper.keywords.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Keywords: {paper.keywords.join(", ")}
                    </p>
                  )}
                </div>

                {/* Edit button – wired later if you want */}
                <button
                  type="button"
                  className="self-start md:self-auto text-sm font-medium text-emerald-700 hover:text-emerald-900"
                  onClick={() => {
                    // For now, just a placeholder – we can wire this to an EditPaperForm route or inline editor later
                    alert(
                      "Edit coming soon – data is already stored correctly."
                    );
                  }}
                >
                  Edit
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
