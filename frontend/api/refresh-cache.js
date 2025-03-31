// /api/refresh-cache.js
// Vercel Scheduled Function: runs hourly to update slanted articles

import { writeFileSync } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { config as dotenv } from 'dotenv';

dotenv();

const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;

const SLANTS = ["Conservative", "Progressive", "Populist"];

const rewriteWithAI = async (content, slant) => {
  const prompt = `Rewrite the following news summary from a ${slant.toLowerCase()} perspective. Focus on tone, framing, and emphasis. Be subtle and believable.\n\nOriginal:\n"${content}"\n\nRewritten (${slant}):`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a political speechwriter and media framing expert." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 150,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content.trim() || "[Rewrite failed]";
};

export const config = {
  schedule: "0 * * * *", // every hour
};

export default async function handler(req, res) {
  try {
    const newsRes = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=6&apiKey=${NEWS_API_KEY}`
    );
    const news = await newsRes.json();
    const articles = await Promise.all(
      news.articles.map(async (a) => {
        const title = a.title;
        const neutral = a.description || a.content || "No summary available.";

        const slants = {};
        for (const slant of SLANTS) {
          slants[slant.toLowerCase()] = await rewriteWithAI(neutral, slant);
        }

        return {
          title,
          neutral,
          ...slants,
        };
      })
    );

    const outputPath = path.join(process.cwd(), "public", "cache", "articles.json");
    writeFileSync(outputPath, JSON.stringify(articles, null, 2));

    res.status(200).json({ message: "Cache updated.", count: articles.length });
  } catch (error) {
    console.error("Error in refresh-cache:", error);
    res.status(500).json({ error: "Failed to refresh cache." });
  }
}
