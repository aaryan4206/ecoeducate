import express from "express";
import cors from "cors";
import "dotenv/config";

// If on Node 18+, global fetch is available. If on <=16, install node-fetch and import it.
const app = express();
const PORT = process.env.PORT || 4000;

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// CORS: allow local frontends
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    methods: ["POST", "OPTIONS"],
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/gemini/content", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "API key is not configured." });
    }

    const { type, headline } = req.body || {};
    if (!type || (type === "summary" && !headline)) {
      return res
        .status(400)
        .json({ error: "Invalid request type or missing headline." });
    }

    let prompt, maxOutputTokens, temperature;
    if (type === "headlines") {
      prompt =
        "List 20 concise and recent environmental news headlines as bullet points. Do not include any additional text.";
      maxOutputTokens = 600;
      temperature = 0.7;
    } else {
      prompt = `Provide a 50-word summary of an environmental news article based on the following headline: "${headline}". Do not include the headline in the summary.`;
      maxOutputTokens = 150;
      temperature = 0.6;
    }

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens },
    };

    const upstream = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "x-goog-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Log non-2xx responses to diagnose “failed to fetch”
    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("Gemini upstream error:", upstream.status, text);
      return res
        .status(502)
        .json({ error: `Upstream error ${upstream.status}: ${text}` });
    }

    const data = await upstream.json();

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.status(502).json({ error: data.error.message || "Gemini error" });
    }

    const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (type === "headlines") {
      const headlines = rawOutput
        .split("\n")
        .map((line) => line.replace(/^[\-\*\d\.\)\s]+/, "").trim())
        .filter(Boolean)
        .map((title) => ({ title, url: "#" }));
      return res.json(headlines);
    }

    return res.json({ summary: rawOutput });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
