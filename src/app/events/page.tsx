"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

import StormBackground from "@/components/StormBackground";
import { GlassNavbar } from "@/components/ui/GlassNavbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

type EventType = {
  id: string;
  title: string;
  description: string;
  mentor: string;
  startDate: string;
  endDate: string;
  imageUrls?: string[];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, "events"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data: EventType[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<EventType, "id">),
        }));

        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="fixed inset-0 z-0">
        <StormBackground />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <GlassNavbar />

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

            {loading && (
              <p className="text-white/50">Loading events...</p>
            )}

            {!loading && events.length === 0 && (
              <p className="text-white/50">No events available yet.</p>
            )}

            {events.map((event) => (
              <EventBlock key={event.id} event={event} />
            ))}
          </motion.div>
        </section>
      </div>
    </main>
  );
}

/* EVENT BLOCK  */

function EventBlock({ event }: { event: EventType }) {
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
        {/* IMAGE SECTION */}
        {event.imageUrls && event.imageUrls.length > 0 && (
        <div className={`mb-6 ${
        event.imageUrls.length === 1
        ? "flex justify-center"
        : "grid grid-cols-1 md:grid-cols-2 gap-4" }`}>
        {event.imageUrls.map((img, index) => (
        <Image
        key={index}
        src={img}
        alt={event.title}
        width={500}
        height={300}
        className="rounded-2xl object-cover"
      />
      ))}
     </div>
    )}

        {/* DATE SECTION */}
        <p className="text-crimson font-bold mb-4">
          {event.endDate && event.startDate !== event.endDate
          ? `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`
          : formatDate(event.startDate)}
          </p>

        <h2 className="text-2xl font-bold text-white mb-6">
          {event.title}
        </h2>

        <p className="text-white/60 leading-relaxed">
          {event.description}
        </p>

        {event.mentor && (
          <p className="mt-6 text-white/40 text-sm">
            Mentor(s): {event.mentor}
          </p>
        )}
      </GlassCard>
    </motion.div>
  );
}