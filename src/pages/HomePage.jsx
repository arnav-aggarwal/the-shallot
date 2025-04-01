// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSlant } from "../context/SlantContext";

const SLANTS = ["Neutral", "Conservative", "Progressive"];

const fetchArticles = async () => {
  const response = await fetch("/cache/articles.json");
  const data = await response.json();
  return data;
};

function formatTime(iso) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HomePage() {
  const { slant, setSlant } = useSlant();
  const [articles, setArticles] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    fetchArticles().then((data) => {
      setArticles(data.articles);
      setUpdatedAt(data.updatedAt);
    });
  }, []);

  const hero = articles[0];
  const remaining = articles.slice(1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-serif text-gray-900">
      <header className="border-b pb-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">🧅 The Shallot</h1>
        <p className="text-sm text-gray-600">Public Insight. Trusted Perspectives.</p>
        {updatedAt && (
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {formatTime(updatedAt)}
          </p>
        )}
      </header>

      <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
        {SLANTS.map((s) => (
          <button
            key={s}
            onClick={() => setSlant(s)}
            className={`px-4 py-2 rounded border ${
              slant === s
                ? "bg-gray-900 text-white"
                : "border-gray-300 text-gray-800 hover:bg-gray-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {hero && (
        <div className="mb-10 border-l-4 border-gray-400 pl-4">
          <p className="uppercase text-xs text-gray-500 mb-1">Featured</p>
          <Link to={`/article/${hero.slug}`} className="block hover:underline">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
              {hero[slant.toLowerCase()]?.headline}
            </h2>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
              {(() => {
                const body = hero[slant.toLowerCase()]?.body;
                return body.length > 200 ? body.slice(0, 200) + "..." : body;
              })()}
            </p>
          </Link>
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {remaining.map((article, index) => {
          const content = article[slant.toLowerCase()];
          return (
            <Link
              key={index}
              to={`/article/${article.slug}`}
              className="border border-gray-300 p-4 sm:p-6 rounded hover:bg-gray-50 block"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 leading-snug">
                {content.headline}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-800">
                {content.body.length > 160 ? content.body.slice(0, 160) + "..." : content.body}
              </p>
            </Link>
          );
        })}
      </section>

      <footer className="mt-10 pt-6 border-t text-xs sm:text-sm text-gray-500">
        <p>
          This site is a demonstration of how AI-powered rewriting can alter the tone and message of
          news. Always question the framing.
        </p>
      </footer>
    </div>
  );
}
