"use client";

import { useState } from "react";

export default function StoryForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    origin_story: "",
    products_list: "",
    struggles: "",
    secret_edge: "",
    goal_6months: "",
  });

  const steps = [
    { title: "The Origin Story", field: "origin_story", question: "Let's start at the very beginning. Tell us about your business. How long have you been doing it, and what made you start? Don't overthink it—just tell us the story.", placeholder: "I've been doing this for 2 years... I started because..." },
    { title: "Your Products", field: "products_list", question: "What exactly are you selling or providing? List your main products or services. Be specific—we need to know what you actually put out into the world.", placeholder: "Organic vegetables, fruit boxes, farm tours..." },
    { title: "The Struggle", field: "struggles", question: "What's the real problem right now? Why did you search for help today? Are sales dropping? Can't get reviews? Getting buried by competitors?", placeholder: "Ever since my neighbors started selling the same thing... I'm almost not having a single sale..." },
    { title: "Your Secret Edge", field: "secret_edge", question: "Here is where we separate you from the rest. What makes your version better than theirs? What's the special ingredient your customers love but you haven't shouted loud enough?", placeholder: "My baked chicken has a more aromatic taste because of my secret herb blend..." },
    { title: "The 6-Month Win", field: "goal_6months", question: "If we absolutely crushed this for you in 6 months, what does winning look like? More sales? A booked calendar? 100+ glowing reviews? Paint us the picture.", placeholder: "I want to be the go-to place in town... I want to expand to 3 new cities..." },
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleNext = () => { if (step < steps.length - 1) setStep(step + 1); };
  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/onboard-lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("leadId", data.record_id);
        localStorage.setItem("welcomeData", JSON.stringify(data));
        window.location.href = `/welcome?lead_id=${data.record_id}`;
      } else { alert("Something went wrong. Please try again."); }
    } catch (error) { console.error("Error:", error); alert("Something went wrong. Please try again."); } 
    finally { setLoading(false); }
  };

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Omega <span className="text-yellow-400">Forge</span></h1>
          <p className="text-gray-400 mt-1">Forging Stories Into Growth Engines</p>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-6"><div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        <div className="mb-6"><span className="text-yellow-400 text-sm font-semibold">Step {step + 1} of {steps.length}</span><h2 className="text-2xl font-semibold text-white mt-1">{currentStep.title}</h2></div>
        <p className="text-gray-300 mb-4 text-lg">{currentStep.question}</p>
        <textarea name={currentStep.field} value={formData[currentStep.field]} onChange={handleChange} placeholder={currentStep.placeholder} rows={6} className="w-full p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all" />
        <div className="flex justify-between mt-6 gap-4">
          <button onClick={handleBack} disabled={step === 0} className={`px-6 py-2 rounded-lg font-semibold transition-all ${step === 0 ? "bg-white/5 text-gray-500 cursor-not-allowed" : "bg-white/10 text-white hover:bg-white/20"}`}>Back</button>
          {step === steps.length - 1 ? <button onClick={handleSubmit} disabled={loading} className={`px-8 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>{loading ? "Processing..." : "Tell My Story →"}</button> : <button onClick={handleNext} className="px-8 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-all">Next →</button>}
        </div>
      </div>
    </div>
  );
}
