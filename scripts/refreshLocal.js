import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;

const SLANTS = ["Neutral", "Conservative", "Progressive"];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function generatePrompt(content, slant) {
  let modifier = "";
  if (slant === "Conservative") {
    modifier = " Take a tone that is explicitly pro-Trump and frames his actions positively.";
  } else if (slant === "Progressive") {
    modifier = " Take a tone that is explicitly critical of Trump and frames his actions negatively.";
  }

  return `Rewrite the following article from a ${slant.toLowerCase()} perspective. Include a slanted headline and a full-length article (150–300 words). Be subtle, persuasive, and believable.${modifier}\n\nOriginal:\n"${content}"\n\nRewritten (${slant}):`;
}

function cleanTextBlock(text) {
  return text
    .replace(/^\"|\"$/g, "")
    .replace(/^Headline:\s*/i, "")
    .replace(/^Article:\s*/i, "")
    .trim();
}

async function rewriteFullArticle(content, slant) {
  const prompt = generatePrompt(content, slant);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a political speechwriter and editorial writer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 600,
    }),
  });

  const data = await response.json();
  let result = data.choices?.[0]?.message?.content.trim() || "[Rewrite failed]";

  if (result.startsWith('"') && result.endsWith('"')) {
    result = result.slice(1, -1);
  }

  const [headlineRaw, ...bodyParts] = result.split("\n").filter(Boolean);
  const headline = cleanTextBlock(headlineRaw);
  const body = cleanTextBlock(bodyParts.join("\n").trim());
  return { headline, body };
}

async function run() {
  const newsRes = await fetch(
    `https://newsapi.org/v2/top-headlines?sources=politico,the-hill,cnn,fox-news,msnbc&pageSize=6&apiKey=${NEWS_API_KEY}`
  );
  const news = await newsRes.json();

  const articles = await Promise.all(
    news.articles.map(async (a) => {
      const title = a.title;
      const slug = slugify(title);
      const description = a.description || a.content || "No summary available.";

      const slants = {};
      for (const slant of SLANTS) {
        slants[slant.toLowerCase()] = await rewriteFullArticle(description, slant);
      }

      return {
        title,
        slug,
        ...slants,
      };
    })
  );

  const output = {
    updatedAt: new Date().toISOString(),
    articles,
  };

  const outputPath = path.join("public", "cache", "articles.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log("✅ articles.json written to", outputPath);
}

run();
