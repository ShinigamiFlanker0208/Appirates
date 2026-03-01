"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
        {/* WHO WE ARE */}
        <section className="pt-32 pb-24 px-6 text-center relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-display font-black text-metallic">
              Who We Are?
            </h1>

            <p className="text-lg text-white/70">
              We are <span className="text-crimson font-bold">Appirates</span> —  not just developers, but digital navigators sailing the vast seas of technology.
            </p>

            <p className="text-white/60 leading-relaxed">
              Crew of builders, explorers, and relentless innovators who dare to chart unknown territories in the world of software.
              From Android systems to desktop engines and scalable web platforms, our fleet sails across domains — disciplined in structure, bold in execution.
            </p>

            <p className="text-white/60 leading-relaxed">
              
    Where others see complexity, we see adventure.  
    Where others see bugs, we see challenges waiting to be conquered.  
    Every application we craft is a ship — engineered for strength, speed, and purpose.
            </p>

            <div className="pt-6 text-xl text-white">
              Our <span className="text-crimson font-bold"> Crew Members </span>  are not just passengers — they are captains of innovation.
            </div>
          </motion.div>

          {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson to-transparent opacity-40 animate-pulse" />
        */} </section>

        {/* OUR DOMAINS */}
        <section className="py-24 px-6 text-center relative bg-black/60">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto space-y-14"
          >
            <h2 className="text-5xl font-display font-black text-metallic">
              Our Fleet
            </h2>

            <DomainBlock
              title="Android Development"
              date="23 Sept 2008: The Release of Android"
              text="Our flagship vessel. Forged with Kotlin, powered by Jetpack Compose — built to conquer mobile seas."
            />

            <AnimatedDivider />

            <DomainBlock
              title="Desktop App Development"
              date="24 Aug 1981: The Birth of IBM PC"
              text="The ironclad battleships of productivity. Stable, Structured, Unstoppable."
            />

            <AnimatedDivider />

            <DomainBlock
              title="Web App Development"
              date="6 Aug 1991: The First Website went Live"
              text="The fastest ships in our armada — scalable, adaptive, and ready for global tides. "
            />
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson to-transparent opacity-40 animate-pulse" />
        </section>

        {/* OUR MOTIVE */}
        <section className="py-24 px-6 text-center relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-5xl font-display font-black text-metallic mb-14">
              Our Compass
            </h2>

            <div className="grid md:grid-cols-2 gap-10">
              <GlassCard className="border-white/10" padding="lg">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Workshops
                </h3>
                <p className="text-crimson mb-4">
                  Hosting / Mentoring Workshops
                </p>
                <p className="text-white/60 leading-relaxed">
                  We love hosting workshops and mentoring students. Covering Mobile App Development, Desktop App Development and Web App Development, our aim is not solely delivering knowledge, but also to ensure some significant output product by each attendee.
                </p>
              </GlassCard>

              <GlassCard className="border-white/10" padding="lg">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Projects
                </h3>
                <p className="text-crimson mb-4">
                  Crafting Community and Projects
                </p>
                <p className="text-white/60 leading-relaxed">
                  We believe knowledge must evolve into execution — transforming
                  ideas into powerful, feature-rich, real-world solutions.
                  No matter how much knowledge you gain, until you apply it is just a string
                  in your head that is filling your memory.
                </p>
              </GlassCard>
            </div>
          </motion.div>
        </section>

    </div>
  );
}
/* ---------------- DOMAIN BLOCK ---------------- */
function DomainBlock({
  title,
  date,
  text,
}: {
  title: string;
  date: string;
  text: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-4"
    >
      <h3 className="text-3xl font-bold text-white">{title}</h3>
      <p className="text-crimson">{date}</p>
      <p className="text-white/60 max-w-3xl mx-auto">{text}</p>
    </motion.div>
  );
}

/* ---------------- ANIMATED DIVIDER ---------------- */

function AnimatedDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="h-px bg-gradient-to-r from-transparent via-crimson to-transparent origin-center"
    />
  );
}
