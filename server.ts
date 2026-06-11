import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set high limits for document handling
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  let aiClient: GoogleGenAI | null = null;

  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY key is missing. Please configure it in your AI Studio Secrets panel.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Summarization & Analysis POST route
  app.post("/api/summarize", async (req, res) => {
    try {
      const { text, language, mode } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        res.status(400).json({ error: "Text content is required for analysis." });
        return;
      }

      const client = getGeminiClient();
      
      const selectedLanguage = language || "en"; // en, hi, bn
      const selectedMode = mode || "short"; // short, detailed, action, study, flashcards

      // Define language instruction
      let langInstruction = "Write the output in English.";
      if (selectedLanguage === "hi") {
        langInstruction = "Write the summary and all text outputs in Hindi (हिंदी).";
      } else if (selectedLanguage === "bn") {
        langInstruction = "Write the summary and all text outputs in Bengali (বাংলা).";
      }

      const prompt = `
        You are a highly advanced AI Note Analyst. Analyze the following user note/document content and generate custom learning and summary metadata.
        
        ${langInstruction}
        
        Focus and expand primarily on the requested mode: "${selectedMode}". However, you MUST populate all fields in the JSON response schema.
        
        User Content:
        """
        ${text}
        """

        Requested JSON fields definition:
        - title: A highly professional and creative AI-generated title for the document.
        - shortSummary: A clean summary in exactly 3-5 sentences.
        - detailedSummary: A rich structured summary in markdown format with headings and sections.
        - category: A single-word category or topic classification (e.g. Technology, Finance, Medicine, History, Engineering, Task).
        - sentiment: Mood of the content (Positive, Neutral, or Analytical).
        - difficulty: Estimate complexity: "easy", "medium", or "hard".
        - readingTime: Estimated reading/study time of original content in minutes (e.g. 1.5, 3.0, 5).
        - explainLikeIm5: A highly simplified, engaging, analogies-based explanation for beginners.
        - keyPoints: List of 4-8 extracted critical bullet points or core insights.
        - actionItems: List of action items, deadlines, tasks, and responsibility assignments detected (or logical ones if implicit).
        - studyNotes: Comprehensive, structured exam-ready study notes in Markdown.
        - questions: Array of 3-5 multiple choice or interview style questions. Each must contain:
           * question: The question text.
           * options: Exactly 4 options.
           * answerIndex: The index of the correct option (0-3).
           * explanation: Brief explanation why that option is correct.
        - flashcards: Array of 4-8 quick-revision cards, each containing:
           * front: Concept, word, or query.
           * back: Definition or concise answer.
        - mindMap: Structured hierarchical mind map data with properties:
           * name: The root topic.
           * children: Array of objects, each containing:
               - name: The subtopic.
               - children: Array of leaf objects containing "name".
        - keywords: Array of 5-8 prominent tags/keywords.
        - importantDatesNumbersFullList: Array of strings capturing significant dates, values, percentages, or milestones found.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "title", "shortSummary", "detailedSummary", "category", "sentiment", 
              "difficulty", "readingTime", "explainLikeIm5", "keyPoints", 
              "actionItems", "studyNotes", "questions", "flashcards", "mindMap", "keywords"
            ],
            properties: {
              title: { type: Type.STRING },
              shortSummary: { type: Type.STRING },
              detailedSummary: { type: Type.STRING },
              category: { type: Type.STRING },
              sentiment: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] },
              readingTime: { type: Type.NUMBER },
              explainLikeIm5: { type: Type.STRING },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              actionItems: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              studyNotes: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["question", "options", "answerIndex", "explanation"],
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    answerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  }
                }
              },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["front", "back"],
                  properties: {
                    front: { type: Type.STRING },
                    back: { type: Type.STRING }
                  }
                }
              },
              mindMap: {
                type: Type.OBJECT,
                required: ["name", "children"],
                properties: {
                  name: { type: Type.STRING },
                  children: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["name"],
                      properties: {
                        name: { type: Type.STRING },
                        children: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            required: ["name"],
                            properties: {
                              name: { type: Type.STRING }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              importantDatesNumbersFullList: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      });

      const responseText = response.text || "{}";
      res.setHeader("Content-Type", "application/json");
      res.send(responseText);
    } catch (error) {
      console.error("Endpoint summary failure:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "System was unable to analyze your notes with Gemini AI."
      });
    }
  });

  // Vite development vs production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartNote AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
