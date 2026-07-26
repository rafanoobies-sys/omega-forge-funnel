"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function WelcomeContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("lead_id");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("welcomeData");
    if (stored) {
      setData(JSON.parse(stored));
      setLoading(false);
      localStorage.removeItem("welcomeData");
      return;
    }
    if (leadId) {
      fetch(`/api/lead-status/${leadId}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [leadId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your story insights...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          No data found. Please go back and submit your story.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-3xl w-full border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Omega <span className="text-yellow-400">Forge</span>
          </h1>
          <p className="text-gray-400 mt-1">Forging Stories Into Growth Engines</p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            We already get you,{" "}
            <span className="text-yellow-400">{data.business_name}</span>.
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">
              Your Core Vibe
            </p>
            <p className="text-white text-lg mt-1">{data.core_vibe}</p>
          </div>

          <div className="bg-yellow-400/10 rounded-lg p-4 border border-yellow-400/30">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">
              ⚡ Your Hook
            </p>
            <p className="text-white text-lg mt-1 italic">
              "{data.hook_headline}"
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">
              SEO Keywords We'll Target
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.keywords &&
                data.keywords.split(",").map((kw, idx) => (
                  <span
                    key={idx}
                    className="bg-white/10 px-3 py-1 rounded-full text-white text-sm"
                  >
                    {kw.trim()}
                  </span>
                ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">
              Your Value Proposition
            </p>
            <p className="text-white text-lg mt-1">{data.value_prop}</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center justify-between">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">
              Growth Potential
            </p>
            <div className="flex items-center gap-2">
              <span className="text-white text-2xl font-bold">
                {data.lead_score}/10
              </span>
              <span className="text-gray-400 text-sm">🔮 AI Scored</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-300 mb-4 text-lg">
            Based on your story, this is exactly the direction we recommend.
          </p>
          <button
            onClick={() =>
              alert(
                "✅ We'll reach out to you within 24 hours to lock in your strategy call!"
              )
            }
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-all text-lg"
          >
            🚀 Approve This Direction & Book My Strategy Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
