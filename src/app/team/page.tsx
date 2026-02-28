"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import StormBackground from "@/components/StormBackground";
import { GlassNavbar } from "@/components/ui/GlassNavbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

type Member = {
  id: string;
  name: string;
  role: string;
  category: string;
  order: number;
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const q = query(collection(db, "team"), orderBy("order"));
      const snapshot = await getDocs(q);

      const data: Member[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Member, "id">),
      }));

      setMembers(data);
    };

    fetchMembers();
  }, []);

  const faculty = members.filter((m) => m.category === "faculty");
  const core = members.filter((m) => m.category === "core");
  const general = members.filter((m) => m.category === "member");

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="fixed inset-0 z-0">
        <StormBackground />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <GlassNavbar />

        <HeroSection />

        <Section title="Faculty Coordinators" members={faculty} />
        <Section title="Core Leadership" members={core} />
        <Section title="Members" members={general} />
      </div>
    </main>
  );
}

function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
      <h1 className="text-6xl md:text-7xl font-display font-black text-metallic mb-6">
        The Crew
      </h1>

      <p className="text-white/60 leading-relaxed">
        We are the operational core of <span className="text-crimson font-bold">Appirates</span> —
        a disciplined collective of engineers, designers, and builders driven by
        execution, not experimentation.
    </p>

    <p className="text-white/60 leading-relaxed">
        From architecting Android applications and scalable backend systems
        to crafting immersive web platforms and intelligent AI integrations,
        every member contributes to building production-grade solutions that
        extend beyond classrooms and into real-world deployment.
    </p>

    <p className="text-white/60 leading-relaxed">
        Collaboration is our multiplier. Mentorship is our foundation.
        Technical depth is our standard.
    </p>

    <div className="pt-4 text-xl text-white">
        Our <span className="text-crimson font-bold">crew</span> is not just a roster —
        it is a network of builders shaping digital frontiers.
    </div>
    </section>
  );
}

function Section({
  title,
  members,
}: {
  title: string;
  members: Member[];
}) {
  return (
    <section className="py-20 px-6 text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-14">{title}</h2>

        <div className="grid md:grid-cols-3 gap-10">
          {members.map((member) => (
            <GlassCard key={member.id} className="border-white/10" padding="lg">
              <div className="space-y-4">
                <div className="w-28 h-28 mx-auto rounded-full bg-crimson/70" />
                <h3 className="text-xl font-bold text-white">
                  {member.name}
                </h3>
                <p className="text-white/50 text-sm">
                  {member.role}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}