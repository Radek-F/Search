import express from "express";
import dotenv from "dotenv";
import cors from "cors";  // <-- ADD THIS

dotenv.config();

const app = express();

// Enable CORS for all origins (works for development)
app.use(cors());   // <-- FIXES your “Failed to fetch” error

app.use(express.json());

// Prevent favicon errors
app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/search", async (req, res) => {
  const query = req.body.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  try {
    // Dynamic import — required for Jest mocking
    const { getSearchResults } = await import("./services/searchService.js");

    const raw = await getSearchResults(query, process.env.SERPAPI_KEY);

    const results = (raw.organic_results || []).map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet || ""
    }));

    return res.json({ query, results });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Failed to fetch search results" });
  }
});

// Export for tests
export default app;

// Start server normally (but not during tests)
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
