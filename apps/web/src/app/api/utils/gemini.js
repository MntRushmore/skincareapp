import { GoogleGenAI } from "@google/genai";

function parseDataUrl(imageDataUrl) {
  const match = /^data:([^;]+);base64,([\s\S]+)$/.exec(imageDataUrl || "");
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return {
    mimeType: "image/jpeg",
    data: String(imageDataUrl).replace(/^data:image\/\w+;base64,/, ""),
  };
}

/**
 * Calls Gemini 2.5 Flash with the same prompt + image the app already sends.
 * Returns the OpenAI-style envelope the route parses:
 * `{ choices: [{ message: { content } }] }`.
 */
export async function analyzeWithGemini({ prompt, imageDataUrl, signal }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error(
      "GEMINI_API_KEY is not set. Add it to the web server environment.",
    );
    error.status = 500;
    throw error;
  }

  const { mimeType, data } = parseDataUrl(imageDataUrl);
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: process.env.GEMINI_API_BASE_URL
      ? { baseUrl: process.env.GEMINI_API_BASE_URL }
      : undefined,
  });

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data,
            },
          },
        ],
      },
    ],
    config: signal ? { abortSignal: signal } : undefined,
  });

  const content = typeof response.text === "string" ? response.text : "";
  return {
    choices: [
      {
        message: {
          content,
        },
      },
    ],
  };
}
