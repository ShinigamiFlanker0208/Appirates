"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GlassCard } from "@/components/ui/GlassCard";

export default function JoinPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    domain: "android",
    experience: "",
    message: "",
  });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await addDoc(collection(db, "applications"), {
        ...form,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Application submitted successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        domain: "android",
        experience: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
      <div className="relative z-10 max-w-4xl mx-auto pt-32 pb-20 px-6">
        <h1 className="text-5xl font-display font-black text-metallic text-center mb-16">
          Join The Crew
        </h1>

        <GlassCard className="p-10">
          <div className="space-y-6">

            <input
              className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <select
              className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
              value={form.domain}
              onChange={(e) =>
                setForm({ ...form, domain: e.target.value })
              }
            >
              <option value="android">Android Development</option>
              <option value="web">Web Development</option>
              <option value="backend">Backend & AI</option>
              <option value="design">UI/UX Design</option>
            </select>

            <textarea
              rows={4}
              className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
              placeholder="Tell us about your experience..."
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
            />

            <textarea
              rows={4}
              className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white"
              placeholder="Why do you want to join?"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-crimson py-4 rounded-lg font-bold hover:opacity-90 transition"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

          </div>
        </GlassCard>
      </div>
  );
}