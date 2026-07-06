import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Create Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Teacher Chat
  app.post("/api/chat-teacher", async (req, res) => {
    try {
      const { messages, studentName, studentLevel, isArabic } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const chatContext = messages.slice(-15).map((m: any) => {
        const role = m.senderRole === "student" ? "user" : "model";
        return {
          role,
          parts: [{ text: m.text }],
        };
      });

      const systemInstruction = `You are "Professor Thomas", a friendly, warm, and highly professional native English teacher on "Pathway Languages" platform.
Your student is named ${studentName || "Student"} and is at the ${studentLevel || "Beginner"} level.
Your goals:
1. Reply in a friendly, encouraging, and supportive tone.
2. ALWAYS adapt your vocabulary and complexity of language to the student's level (${studentLevel || "Beginner"}).
   - If they are Beginner, use very simple, short sentences.
   - If they are Intermediate, use natural but clear sentences, introducing occasional idioms or phrasal verbs.
   - If they are Advanced, engage in mature, expressive discussions, using natural phrasing and advanced vocabulary.
3. If the student makes any grammatical, spelling, or structural mistakes in English, GENTLY correct them at the end of your message in a constructive "Grammar Tip / نصيحة قواعدية" section.
4. Keep your response brief and interactive. End with an engaging question to keep the conversation going.
5. If the user asks in Arabic or needs Arabic explanations, you can provide bilingual support (Arabic and English) to help them understand better, but encourage them to practice English!
6. Make sure your response is formatted beautifully with paragraphs or bullet points for readability.`;

      // Call Gemini API
      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatContext.length > 0 ? chatContext : [{ role: "user", parts: [{ text: "Hello, Professor! Let's start learning." }] }],
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      });

      const responseText = result.text || "I'm sorry, I couldn't process that. Let's try again!";
      res.json({ text: responseText });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI Teacher. " + (error.message || "") });
    }
  });

  // API Route: AI Writing Analyzer
  app.post("/api/analyze-writing", async (req, res) => {
    try {
      const { essayText, promptText, studentLevel } = req.body;

      if (!essayText) {
        return res.status(400).json({ error: "Essay text is required." });
      }

      const prompt = `You are a strict and professional CEFR English examiner and professional native proofreader.
Analyze the student's essay text in detail based on their target level: ${studentLevel || "B1"}.
The prompt they were writing about was: "${promptText || "General writing task"}".
The essay written by the student is:
"""
${essayText}
"""

You MUST identify and correct ALL mistakes, no matter how small, including grammar, spelling, punctuation, sentence structure, word order, tenses, articles, prepositions, natural English phrasing, repeated words, formal vs informal registers, collocations, idioms, and academic tone. Do NOT be lenient or ignore any errors!

For each error, you MUST specify:
- location (approximate position or context)
- errorText (the incorrect word or phrase)
- type of error (must be one of: Grammar, Vocabulary, Spelling, Punctuation, Sentence Structure, Word Order, Tenses, Articles, Prepositions, Natural English, Repeated Words, Formal vs Informal English, Collocations, Idioms, Academic Writing)
- reason for the error (explain in Arabic)
- correction (the correct spelling or grammar word/phrase)
- explanation of the grammatical/lexical rule (in Arabic)
- similarExample (English sentence with Arabic translation showcasing the correct rule)

In addition, provide:
1. Overall Evaluation (التقييم العام) in Arabic
2. Writing Score (درجة الكتابة) from 0 to 100 based strictly on quality (be rigorous!)
3. Strengths (نقاط القوة) (minimum of 3 points, in Arabic)
4. Weaknesses (نقاط الضعف) (minimum of 3 points, in Arabic)
5. Suggested new vocabulary words to elevate their writing (at least 4 words/phrases, formatted as "English word (Arabic meaning)")
6. The fully corrected version of their essay with all errors resolved.
7. A highly professional/academic version of their essay rewritten at a higher, natural native level.
8. Custom improvement tips (نصائح مخصصة) (at least 3 points, in Arabic).

You MUST respond with a single, valid JSON object conforming exactly to this structure:
{
  "overallEvaluation": "string",
  "score": number,
  "strengths": ["string", "string", ...],
  "weaknesses": ["string", "string", ...],
  "suggestedWords": ["string", "string", ...],
  "correctedVersion": "string",
  "professionalVersion": "string",
  "tips": ["string", "string", ...],
  "errors": [
    {
      "errorText": "string",
      "location": "string",
      "type": "string",
      "reason": "string",
      "correction": "string",
      "explanation": "string",
      "similarExample": "string"
    }
  ]
}

CRITICAL: Return ONLY raw, valid JSON. No markdown backticks, no text wrapping!`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2, // low temperature for precise JSON correction
          maxOutputTokens: 2548,
        },
      });

      let responseText = result.text || "{}";
      responseText = responseText.trim();
      if (responseText.startsWith("```")) {
        responseText = responseText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      responseText = responseText.trim();

      const parsedReport = JSON.parse(responseText);
      res.json({ success: true, report: parsedReport });
    } catch (error: any) {
      console.error("Gemini Writing Analyzer Error:", error);
      res.status(500).json({ error: "Failed to analyze writing. " + (error.message || "") });
    }
  });

  // API Route: AI Speaking Analyzer
  app.post("/api/analyze-speaking", async (req, res) => {
    try {
      const { transcript, promptText, studentLevel } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: "Transcript is required." });
      }

      const prompt = `You are a professional CEFR speech examiner and phonetician.
Analyze the student's transcribed speech response in detail based on their target level: ${studentLevel || "B1"}.
The prompt/question they responded to was: "${promptText || "General speaking task"}".
The student's transcribed speech is:
"""
${transcript}
"""

Analyze Pronunciation, Fluency, Grammar, Vocabulary, Intonation, Stress, Rhythm, Speaking Speed, and Clarity.
Identify mispronounced words, unclear letters, hesitation parts, long pauses, repeated words, grammar errors, incorrectly used words, and unnatural sentences.

For each error, provide:
- Approximate time inside the audio (e.g., "0:04", "0:08" etc.)
- Original spoken error
- Correct word/phrase
- Correct IPA/phonetic pronunciation
- Reason for the error (in Arabic)
- Method of improvement (طريقة التحسين) (in Arabic)

In addition, provide:
1. Overall speaking score from 0 to 100
2. Separate sub-scores (0-100) for metrics: pronunciation, fluency, grammar, vocabulary, intonation, stress, rhythm, speakingSpeed, clarity
3. Fully corrected version of what they said.
4. A highly natural, professional native-equivalent version of their response.
5. Review words: key words from their response that need practice, with their correct IPA/phonetic representation and Arabic meaning.
6. A personalized training plan (خطة تدريب شخصية) in Arabic based on their specific errors (at least 4 actionable exercises or areas to focus on).

You MUST respond with a single, valid JSON object conforming exactly to this structure:
{
  "overall": number,
  "metrics": {
    "pronunciation": number,
    "fluency": number,
    "grammar": number,
    "vocabulary": number,
    "intonation": number,
    "stress": number,
    "rhythm": number,
    "speakingSpeed": number,
    "clarity": number
  },
  "errors": [
    {
      "time": "string",
      "errorText": "string",
      "correction": "string",
      "pronunciationIPA": "string",
      "reason": "string",
      "improvementMethod": "string"
    }
  ],
  "transcript": "string",
  "correctedVersion": "string",
  "professionalVersion": "string",
  "reviewWords": [
    {
      "word": "string",
      "ipa": "string",
      "meaningAr": "string"
    }
  ],
  "trainingPlan": "string"
}

CRITICAL: Return ONLY raw, valid JSON. No markdown backticks, no text wrapping!`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2, // low temperature for precise phonetic/syntactic evaluation JSON
          maxOutputTokens: 2548,
        },
      });

      let responseText = result.text || "{}";
      responseText = responseText.trim();
      if (responseText.startsWith("```")) {
        responseText = responseText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      responseText = responseText.trim();

      const parsedReport = JSON.parse(responseText);
      res.json({ success: true, report: parsedReport });
    } catch (error: any) {
      console.error("Gemini Speaking Analyzer Error:", error);
      res.status(500).json({ error: "Failed to analyze speech. " + (error.message || "") });
    }
  });

  // Serve static files / Vite middleware
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
