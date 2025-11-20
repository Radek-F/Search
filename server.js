import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const SERPAPI_KEY = process.env.SERPAPI_KEY;

/**
 * Root endpoint to verify the API is working
 */
app.get("/", (req, res) => {
  res.send("API is running ✔️");
});

/**
 * POST /search
 * Fetches search results from SerpAPI
 */
app.post("/search", async (req, res) => {
  const query = req.body.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google",
        q: query,
        api_key: SERPAPI_KEY
      }
    });

    res.json({
      status: "success",
      query: query,
      results: response.data.organic_results || []
    });

  } catch (error) {
    console.error("SerpAPI error:", error.response?.data || error.message);

    res.status(500).json({
      status: "error",
      message: "SerpAPI request failed",
      details: error.response?.data || error.message
    });
  }
});

/**
 * Required for Render deployment
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
