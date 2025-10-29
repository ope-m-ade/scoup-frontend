import fs from "fs";

// 1️⃣ Load your article data
const raw = JSON.parse(fs.readFileSync("data/article_data.json", "utf8"));

// 2️⃣ Filter only valid papers (must have abstract or title)
const papers = raw.filter(
  (item) => item.abstract || item.title || item.download_url
);

// 3️⃣ Simplify data structure
const simplified = papers.map((item) => {
  const title = Array.isArray(item.title) ? item.title[0] : item.title;

  return {
    id: item._id || item.doi || item.url,
    type: "paper",
    title: title || "Untitled",
    abstract: item.abstract?.replace(/^ABSTRACT\s*/i, "").trim() || "",
    authors: item.faculty_members || [],
    journal: item.journal || "",
    datePublished:
      item.date_published_online || item.date_published_print || "",
    aiKeywords: item.themes || [],
    facultyKeywords: item.categories || [],
    downloadUrl: item.download_url || item.doi || "",
    licenseUrl: item.license_url || "",
  };
});

// 4️⃣ Save the result
fs.writeFileSync("data/papersData.json", JSON.stringify(simplified, null, 2));

console.log(`✅ Converted ${simplified.length} papers`);
