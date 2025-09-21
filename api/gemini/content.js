import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "API key is not configured." });
  }

  const { type, headline } = req.body;

  let prompt, maxOutputTokens, temperature;
  if (type === "headlines") {
    prompt = `List 20 concise and recent environmental news headlines as bullet points. Do not include any additional text.`;
    maxOutputTokens = 600;
    temperature = 0.7;
  } else if (type === "summary" && headline) {
    prompt = `Provide a 50-word summary of an environmental news article based on the following headline: "${headline}". Do not include the headline in the summary.`;
    maxOutputTokens = 150;
    temperature = 0.6;
  } else {
    return res.status(400).json({ error: "Invalid request type or missing headline." });
  }

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "x-goog-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature,
          maxOutputTokens,
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (type === "headlines") {
      const headlines = rawOutput
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(title => ({ title, url: "#" }));
      return res.status(200).json(headlines);
    } else if (type === "summary") {
      return res.status(200).json({ summary: rawOutput });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
