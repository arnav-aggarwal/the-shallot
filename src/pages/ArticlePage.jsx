// src/pages/ArticlePage.jsx
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const SLANTS = ["Neutral", "Conservative", "Progressive", "Populist"];

export default function ArticlePage() {
  const { slug } = useParams();
  const [slant, setSlant] = useState("Neutral");
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch("/cache/articles.json")
      .then((res) => res.json())
      .then((data) => {
        const match = data.articles.find((a) => a.slug === slug);
        setArticle(match);
      });
  }, [slug]);

  if (!article) return <div className="p-8 text-gray-700">Loading...</div>;

  const content =
    slant === "Neutral"
      ? { headline: article.title, body: article.neutral }
      : article[slant.toLowerCase()];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-serif text-gray-900">
      <header className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{content.headline}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {SLANTS.map((s) => (
            <button
              key={s}
              onClick={() => setSlant(s)}
              className={`px-4 py-1 rounded border text-sm ${
                slant === s ? "bg-gray-900 text-white" : "border-gray-300 text-gray-800 hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <article className="prose prose-lg max-w-none">
        {content.body.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>
    </div>
  );
}