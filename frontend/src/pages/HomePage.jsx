import React, { useState, useEffect } from "react";

const SLANTS = ["Neutral", "Conservative", "Progressive", "Populist"];

const fetchArticles = async () => {
  // TEMPORARY: placeholder data. Will replace with live news + AI soon.
  return [
    {
      title: "President Announces New Tariff Policy",
      neutral: "President announces reciprocal tariff policy aimed at leveling trade playing field.",
      conservative: "President takes bold stand against unfair foreign trade with sweeping tariffs.",
      progressive: "President's tariff move risks escalating trade tensions and harming consumers.",
      populist: "President fights globalist elites with tariffs to bring back American jobs.",
    },
    {
      title: "Supreme Court Reviews Key Cases",
      neutral: "Court considers cases on guns, transgender care, online content, and religion in schools.",
      conservative: "Conservative-leaning court could rein in radical progressive policies.",
      progressive: "Court may undermine essential rights for trans youth and online freedoms.",
      populist: "Elites on the bench debate our freedoms while the people wait.",
    },
  ];
};

export default function HomePage() {
  const [slant, setSlant] = useState("Neutral");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then(setArticles);
  }, []);

  const hero = articles[0];
  const remaining = articles.slice(1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-serif text-gray-900">
      <header className="border-b pb-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">The Bulletin</h1>
        <p className="text-sm text-gray-600">Public Insight. Trusted Perspectives.</p>
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
        <div className="mb-10">
          <div className="border-l-4 border-gray-400 pl-4">
            <p className="uppercase text-xs text-gray-500 mb-1">Featured</p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">{hero.title}</h2>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
              {hero[slant.toLowerCase()]}
            </p>
          </div>
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {remaining.map((article, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 sm:p-6 rounded"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 leading-snug">
              {article.title}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-gray-800">
              {article[slant.toLowerCase()]}
            </p>
          </div>
        ))}
      </section>

      <footer className="mt-10 pt-6 border-t text-xs sm:text-sm text-gray-500">
        This site is a demonstration of how AI-powered rewriting can alter the tone and message of news. Always question the framing.
      </footer>
    </div>
  );
}
