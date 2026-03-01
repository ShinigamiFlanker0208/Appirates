"use client";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import NextImage from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function EventsPage() {
  return (
        <section className="pt-32 pb-24 px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto space-y-16"
          >
            <h1 className="text-6xl font-display font-black text-metallic">
              Appirates Workshops & Events
            </h1>

            {/* FULLSTACK 2.0 */}
            <EventBlock
              imageSrc="/FullStack 2.0.jpeg"
              date="2–6 February 2026"
              subtitle="Fullstack Development Workshop 2.0 (Appirates × CodeHub Nexus)"
              content={[
                "Covered HTML, CSS, JavaScript, React fundamentals, and modern frontend structuring.",
                "Built backend APIs using Express.js with CRUD operations and MongoDB integration.",
                "Integrated frontend with backend and deployed projects using Vercel & Render.",
              ]}
              footer="Mentor: Siddharth Sharma (Co-Founder, TechVanch Innovations & CodeHub Nexus)"
            />

            {/* AI + IOT WORKSHOP */}
            <EventBlock
              imageSrc = "/IOT.jpeg"
              date="3–4 & 10–11 November 2025"
              subtitle="AI + IoT Smart Robot Workshop"
              content={[
                "Built a Line Follower Robot using Arduino ESP32 and IR sensors.",
                "Implemented proportional control logic and real-time motor adjustments.",
                "Learned sensor calibration, embedded systems architecture, and hardware-software integration.",
              ]}
              footer="Mentors: Mr. Dheeraj Chauhan (IoT Systems Architect, Senior R&D Engineer – 17+ years experience) | Mr. Parth Gaba (Software Architect, Senior AI & Systems Engineer – 9+ years experience | Founder & Director – NDM Infocom Pvt. Ltd., EkWorth Tech Pvt. Ltd.)"
            />

            {/* FULLSTACK 1.0 */}
            <EventBlock
              // imageSrc = "/"
              date="30 October 2025"
              subtitle="Fullstack Development Workshop 1.0 (Appirates × CodeHub Nexus)"
              content={[
                "Built and deployed complete fullstack applications with frontend-backend integration.",
                "Practiced Git & GitHub collaboration and implemented scalable coding standards.",
                "Explored Gen AI tool integration within web development workflows.",
              ]}
              footer="Mentor: Siddharth Sharma (Co-Founder, TechVanch Innovations & CodeHub Nexus)"
            />

            {/* ANDROID DEVELOPMENT WORKSHOP */}
            <EventBlock
              // imageSrc = "/"
              date="16–17 & 24–25 September 2025"
              subtitle="Android Development Workshop"
              content={[
                "Covered Kotlin fundamentals, OOPS, Jetpack Compose, layouts, navigation, and dynamic theming.",
                "Integrated Supabase and Firebase into Android applications for real-world backend handling.",
                "Guided participants through professional app deployment to Play Store & Indus App Store.",
              ]}
              footer="Mentors: Ashwin, Ishita, Samarpreet, Shri, Rashi, Rakshita, Anand"
            />

            {/* WORKSHOP 1.0 */}
            <EventBlock
              imageSrc = "/Workshop-1.png"
              date="11 March 2025"
              subtitle="Workshop 1.0"
              content={[
                "Introduced modern Android UI development using Jetpack Compose and reactive UI structuring.",
                "Built a structured 3-Layer ToDo application separating FileSystem, AppState, and UI logic.",
                "Implemented a Vertex Bot project to understand backend APIs and intelligent app integrations.",
              ]}
            />

          </motion.div>
        </section>
  );
}

/* ---------------- REUSABLE EVENT BLOCK ---------------- */

function EventBlock({
  date,
  subtitle,
  content,
  footer,
  imageSrc,
}: {
  date: string;
  subtitle: string;
  content: string[];
  footer?: string;
  imageSrc?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="flex justify-center"
    >
      <GlassCard
        className="border-white/10 text-center max-w-3xl w-full"
        padding="lg"
      >
        {imageSrc && (
  <div className="mb-6 flex justify-center">
    <NextImage
      src={imageSrc}
      alt={subtitle}
      width={500}
      height={300}
      className="rounded-2xl object-cover"
    />
  </div>
)}

        <p className="text-crimson font-bold mb-2">{date}</p>

        <h2 className="text-2xl font-bold text-white mb-6">
          {subtitle}
        </h2>

        <ul className="space-y-3 text-white/60 leading-relaxed">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        {footer && (
          <p className="mt-6 text-white/40 text-sm">
            {footer}
          </p>
        )}
      </GlassCard>
    </motion.div>
  );
}