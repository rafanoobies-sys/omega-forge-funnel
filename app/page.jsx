"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatFunnel() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    full_name: "",
    business_name: "",
    business_status: "",
    origin_story: "",
    products_list: "",
    struggles: "",
    secret_edge: "",
    goal_6months: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [offTrack, setOffTrack] = useState(false);

  const productOptions = ["Mekaniko", "Masahe", "Aircon/Ref", "Elektrisyan", "Pagkain/Catering", "Linis", "Iba pa"];
  const struggleOptions = ["Walang nakakakilala", "Hindi marunong sa social media", "Walang booking", "Maraming kalaban", "Hindi alam kung saan magsisimula", "Iba pa"];
  const statusOptions = [
    { label: "🧑‍🔧 Freelancer", desc: "Ikaw lang, sariling pangalan ang gamit" },
    { label: "🚀 Startup", desc: "May brand ka na, gusto mong lumago" },
    { label: "🏢 Negosyo na", desc: "May kliyente ka na, gusto mong lumaki" },
    { label: "📌 Iba pa", desc: "Iba ang sitwasyon mo" }
  ];

  const updateAnswer = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setOffTrack(false);
  };

  const goToNext = () => {
    if (step === 0 && !answers.full_name.trim()) {
      setOffTrack(true);
      return;
    }
    if (step === 1 && !answers.business_name.trim()) {
      setOffTrack(true);
      return;
    }
    if (step === 2 && !answers.business_status) {
      setOffTrack(true);
      return;
    }
    setOffTrack(false);
    setStep((s) => s + 1);
  };

  const goToPrev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboard-lead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(answers),
});
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("welcomeData", JSON.stringify(data));
        router.push(`/welcome?lead_id=${data.record_id}`);
      } else {
        alert("May mali. Pakisubukan ulit.");
      }
    } catch (err) {
      alert("Error sa connection. Pakicheck ang internet mo.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Kumusta! 👋</h2>
            <p>Ano ang pangalan mo?</p>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-transparent text-white"
              placeholder="Halimbawa: Mark Santos"
              value={answers.full_name}
              onChange={(e) => updateAnswer("full_name", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToNext()}
              autoFocus
            />
            {offTrack && <p className="text-yellow-400 text-sm">Paki‑type ang iyong pangalan para magpatuloy.</p>}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">At ano ang tawag sa iyong negosyo?</h2>
            <p>Kahit ikaw lang — bigyan mo ng pangalan.</p>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-transparent text-white"
              placeholder="Halimbawa: Mark's Auto Repair"
              value={answers.business_name}
              onChange={(e) => updateAnswer("business_name", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToNext()}
            />
            {offTrack && <p className="text-yellow-400 text-sm">Paki‑type ang pangalan ng negosyo mo.</p>}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Alin sa mga ito ang pinaka‑tumutugma sa'yo?</h2>
            <p className="text-gray-400 text-sm">Makakatulong ito para ma‑tailor namin ang iyong site.</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.label}
                  className={`px-4 py-2 rounded-xl border text-left ${
                    answers.business_status === opt.label
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-transparent border-gray-600 text-white hover:border-yellow-400"
                  } transition`}
                  onClick={() => {
                    updateAnswer("business_status", opt.label);
                    setTimeout(goToNext, 300);
                  }}
                >
                  <div className="font-semibold">{opt.label}</div>
                  <div className="text-xs opacity-60">{opt.desc}</div>
                </button>
              ))}
            </div>
            {offTrack && <p className="text-yellow-400 text-sm">Pumili ng isa para magpatuloy.</p>}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Kwento mo, paano ka nagsimula?</h2>
            <p>
              {answers.business_status === "🧑‍🔧 Freelancer" && "Ano ang nag‑udyok sa'yo na gamitin ang iyong kakayahan para makatulong sa iba?"}
              {answers.business_status === "🚀 Startup" && "Bakit mo naisipang bumuo ng isang bagay na higit pa sa iyong sarili?"}
              {answers.business_status === "🏢 Negosyo na" && "Ano ang nagtulak sa'yo na magnegosyo — at ano ang nagpapanatili sa'yo?"}
              {!answers.business_status && "Ano ang kwento ng iyong pagsisimula?"}
            </p>
            <textarea
              className="w-full p-3 border rounded-lg bg-transparent text-white h-32"
              placeholder="Halimbawa: Nagsimula ako dahil..."
              value={answers.origin_story}
              onChange={(e) => updateAnswer("origin_story", e.target.value)}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ano ang iyong iniaalok?</h2>
            <p>Piliin ang lahat ng naaangkop:</p>
            <div className="flex flex-wrap gap-2">
              {productOptions.map((opt) => (
                <button
                  key={opt}
                  className={`px-4 py-2 rounded-full border ${
                    answers.products_list.includes(opt)
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-transparent border-gray-400 text-white"
                  }`}
                  onClick={() => {
                    let current = answers.products_list ? answers.products_list.split(",").map(s => s.trim()) : [];
                    if (current.includes(opt)) {
                      current = current.filter((i) => i !== opt);
                    } else {
                      current.push(opt);
                    }
                    updateAnswer("products_list", current.join(", "));
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {answers.products_list.includes("Iba pa") && (
              <input
                type="text"
                className="w-full p-3 border rounded-lg bg-transparent text-white mt-2"
                placeholder="Ilagay ang iba mong produkto/serbisyo"
                onChange={(e) => {
                  const current = answers.products_list.split(",").filter(s => s.trim() !== "Iba pa" && s.trim() !== "");
                  current.push(e.target.value);
                  updateAnswer("products_list", current.join(", "));
                }}
              />
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ano ang pinakamalaking hamon mo ngayon?</h2>
            <p>Piliin ang isa o higit pa:</p>
            <div className="flex flex-wrap gap-2">
              {struggleOptions.map((opt) => (
                <button
                  key={opt}
                  className={`px-4 py-2 rounded-full border ${
                    answers.struggles.includes(opt)
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-transparent border-gray-400 text-white"
                  }`}
                  onClick={() => {
                    let current = answers.struggles ? answers.struggles.split(",").map(s => s.trim()) : [];
                    if (current.includes(opt)) {
                      current = current.filter((i) => i !== opt);
                    } else {
                      current.push(opt);
                    }
                    updateAnswer("struggles", current.join(", "));
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {answers.struggles.includes("Iba pa") && (
              <input
                type="text"
                className="w-full p-3 border rounded-lg bg-transparent text-white mt-2"
                placeholder="Ilagay ang iyong hamon"
                onChange={(e) => {
                  const current = answers.struggles.split(",").filter(s => s.trim() !== "Iba pa" && s.trim() !== "");
                  current.push(e.target.value);
                  updateAnswer("struggles", current.join(", "));
                }}
              />
            )}
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ano ang nagpapa‑iba sa'yo?</h2>
            <p>
              {answers.business_status === "🧑‍🔧 Freelancer" && "Ano ang sinasabi ng iyong mga kliyente tungkol sa'yo?"}
              {answers.business_status === "🚀 Startup" && "Ano ang isang bagay na pinaninindigan ng iyong brand?"}
              {answers.business_status === "🏢 Negosyo na" && "Ano ang pundasyon ng iyong reputasyon?"}
              {!answers.business_status && "Ano ang ginagawa mong mas mahusay kaysa sa iba?"}
            </p>
            <textarea
              className="w-full p-3 border rounded-lg bg-transparent text-white h-32"
              placeholder="Halimbawa: Pinapahalagahan ko ang..."
              value={answers.secret_edge}
              onChange={(e) => updateAnswer("secret_edge", e.target.value)}
            />
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ano ang iyong layunin sa susunod na 6 na buwan?</h2>
            <p>
              {answers.business_status === "🧑‍🔧 Freelancer" && "Mas maraming kliyente, mas matatag na kita?"}
              {answers.business_status === "🚀 Startup" && "Unang 10 kliyente, pagkilala sa brand?"}
              {answers.business_status === "🏢 Negosyo na" && "Pag‑lago, sistema, at mas maraming review?"}
              {!answers.business_status && "Saan mo nakikita ang iyong negosyo?"}
            </p>
            <textarea
              className="w-full p-3 border rounded-lg bg-transparent text-white h-32"
              placeholder="Halimbawa: Sa susunod na 6 na buwan, gusto kong..."
              value={answers.goal_6months}
              onChange={(e) => updateAnswer("goal_6months", e.target.value)}
            />
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Paano namin ka maaabot?</h2>
            <p>Ipadadala namin ang iyong AI insights at booking reminders dito.</p>
            <input
              type="email"
              className="w-full p-3 border rounded-lg bg-transparent text-white"
              placeholder="Email address"
              value={answers.email}
              onChange={(e) => updateAnswer("email", e.target.value)}
            />
            <input
              type="tel"
              className="w-full p-3 border rounded-lg bg-transparent text-white"
              placeholder="Phone number"
              value={answers.phone}
              onChange={(e) => updateAnswer("phone", e.target.value)}
            />
          </div>
        );
      case 9:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Balikan ang iyong mga sagot</h2>
            <div className="bg-white/5 p-4 rounded-lg space-y-2 text-sm">
              <p><span className="text-yellow-400">Pangalan:</span> {answers.full_name}</p>
              <p><span className="text-yellow-400">Negosyo:</span> {answers.business_name}</p>
              <p><span className="text-yellow-400">Uri:</span> {answers.business_status}</p>
              <p><span className="text-yellow-400">Kwento:</span> {answers.origin_story?.slice(0, 60)}...</p>
              <p><span className="text-yellow-400">Alok:</span> {answers.products_list}</p>
              <p><span className="text-yellow-400">Hamon:</span> {answers.struggles}</p>
              <p><span className="text-yellow-400">Edge:</span> {answers.secret_edge?.slice(0, 60)}...</p>
              <p><span className="text-yellow-400">Layunin:</span> {answers.goal_6months?.slice(0, 60)}...</p>
              <p><span className="text-yellow-400">Contact:</span> {answers.email} | {answers.phone}</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              {loading ? "Ipinapadala..." : "Ipadala ang Kwento 🚀"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-6">
          <div
            className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / 9) * 100}%` }}
          />
        </div>
        <div className="min-h-[300px]">
          {renderStep()}
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={goToPrev}
            className={`px-4 py-2 text-sm rounded-lg ${step === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-700"}`}
            disabled={step === 0}
          >
            ← Bumalik
          </button>
          {step < 9 && (
            <button
              onClick={goToNext}
              className="px-4 py-2 text-sm bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              {step === 8 ? "Suriin at Ipadala →" : "Susunod →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}