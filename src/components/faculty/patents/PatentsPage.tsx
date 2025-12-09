import { useState, useEffect } from "react";

interface Patent {
  id: number;
  title: string;
  patent_number?: string | null;
  date_filed?: string | null;
  date_granted?: string | null;
  abstract?: string | null;
  keywords?: string[] | null;
}

export default function PatentsPage() {
  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const token = localStorage.getItem("facultyAccessToken") || "";

  const [patents, setPatents] = useState<Patent[]>([]);

  // Form fields
  const [title, setTitle] = useState("");
  const [patentNumber, setPatentNumber] = useState("");
  const [dateFiled, setDateFiled] = useState("");
  const [dateGranted, setDateGranted] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");

  const [loading, setLoading] = useState(false);

  // Load patents
  useEffect(() => {
    if (!token) return;

    fetch(API + "/faculty/patents/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setPatents(data));
  }, [API, token]);

  // Add new patent
  const handleAddPatent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !keywords.trim()) {
      alert("Title and at least 1 keyword are required.");
      return;
    }

    const payload = {
      title: title.trim(),
      patent_number: patentNumber.trim() || null,
      date_filed: dateFiled || null,
      date_granted: dateGranted || null,
      abstract: abstract.trim() || null,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    };

    setLoading(true);

    const res = await fetch(API + "/faculty/patents/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Error adding patent.");
      setLoading(false);
      return;
    }

    setPatents((prev) => [...prev, data]);

    // Reset form
    setTitle("");
    setPatentNumber("");
    setAbstract("");
    setDateFiled("");
    setDateGranted("");
    setKeywords("");

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Patents</h1>
        <p className="text-muted-foreground">
          Add and update your patents. These also feed into search results.
        </p>
      </header>

      {/* FORM */}
      <form
        onSubmit={handleAddPatent}
        className="space-y-6 border border-border rounded-xl p-6 shadow-sm bg-background"
      >
        <h2 className="text-xl font-semibold">Add a new patent</h2>

        {/* Title + Patent Number */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              className="border border-border rounded-md px-3 py-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Patent title"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Patent number
            </label>
            <input
              className="border border-border rounded-md px-3 py-2 w-full"
              value={patentNumber}
              onChange={(e) => setPatentNumber(e.target.value)}
              placeholder="US-XXXXXXX"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Date filed</label>
            <input
              type="date"
              className="border border-border rounded-md px-3 py-2 w-full"
              value={dateFiled}
              onChange={(e) => setDateFiled(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Date granted
            </label>
            <input
              type="date"
              className="border border-border rounded-md px-3 py-2 w-full"
              value={dateGranted}
              onChange={(e) => setDateGranted(e.target.value)}
            />
          </div>
        </div>

        {/* Abstract */}
        <div>
          <label className="text-sm font-medium mb-1 block">Abstract</label>
          <textarea
            className="border border-border rounded-md px-3 py-2 w-full min-h-[100px]"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            placeholder="Patent summary (optional)"
          />
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
            placeholder="AI, robotics, imaging"
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
        <h2 className="text-2xl font-semibold">Your patents</h2>

        {patents.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No patents yet. Use the form above to add one.
          </p>
        )}

        <div className="space-y-3">
          {patents.map((p) => (
            <article
              key={p.id}
              className="border border-border rounded-xl p-5 shadow-sm bg-white"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <button className="text-sm text-emerald-700 hover:text-emerald-900">
                  Edit
                </button>
              </div>

              <div className="text-xs text-muted-foreground flex gap-4 mt-1">
                {p.patent_number && <span>Patent #: {p.patent_number}</span>}
                {p.date_filed && <span>Filed: {p.date_filed}</span>}
                {p.date_granted && <span>Granted: {p.date_granted}</span>}
              </div>

              {p.abstract && (
                <p className="text-sm leading-relaxed mt-3">{p.abstract}</p>
              )}

              {p.keywords && p.keywords.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Keywords: {p.keywords.join(", ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
