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
              We are a dynamic sub-community of{" "}
              <span className="text-crimson font-bold">CIIE</span> —
              a collective of thinkers, builders, and relentless problem-solvers.
            </p>

            <p className="text-white/60 leading-relaxed">
              At Appirates, we don’t just write code — we architect experiences.
              From crafting seamless mobile ecosystems to engineering powerful
              desktop tools and immersive web platforms, our mission is to build
              applications that are not only functional, but unforgettable.
            </p>

            <p className="text-white/60 leading-relaxed">
              Every line we write is driven by curiosity. Every project we ship
              is fueled by discipline. We believe in high-performance systems,
              clean design philosophies, and execution that speaks louder than
              ambition.
            </p>

            <div className="pt-6 text-xl text-white">
              Our <span className="text-crimson font-bold">humans</span> are not
              just members — they are architects of digital frontiers.
            </div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson to-transparent opacity-40 animate-pulse" />
        </section>

        {/* TEAM SECTION */}
        <section className="pb-24 px-6 text-center">
          <div className="max-w-6xl mx-auto space-y-16">

            {/* Faculty */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Faculty</h2>

              <div className="flex justify-center gap-8">
                <GlassCard className="max-w-sm border-white/10" padding="lg">
                  <div>
                    <div className="w-40 h-40 mx-auto rounded-full bg-crimson/80 mb-6" />
                    <h3 className="text-xl font-bold text-white">
                      Dr. Namrata Sukhija
                    </h3>
                    <p className="text-white/50 text-sm">Faculty</p>
                  </div>
                </GlassCard>

                <GlassCard className="max-w-sm border-white/10" padding="lg">
                  <div>
                    <div className="w-40 h-40 mx-auto rounded-full bg-crimson/80 mb-6" />
                    <h3 className="text-xl font-bold text-white">
                      Dr. Rama Kant
                    </h3>
                    <p className="text-white/50 text-sm">Faculty</p>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Leaders */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Leaders</h2>

              <div className="flex justify-center gap-8">
                <GlassCard className="max-w-sm border-white/10" padding="lg">
                  <div>
                    <div className="w-40 h-40 mx-auto rounded-2xl bg-white/20 mb-6" />
                    <h3 className="text-xl font-bold text-white">
                      Ashwin Sharma
                    </h3>
                  </div>
                </GlassCard>

                <GlassCard className="max-w-sm border-white/10" padding="lg">
                  <div>
                    <div className="w-40 h-40 mx-auto rounded-2xl bg-white/20 mb-6" />
                    <h3 className="text-xl font-bold text-white">
                      Lakshay Sharma
                    </h3>
                  </div>
                </GlassCard>
              </div>
            </div>

          </div>
        </section>

        {/* OUR DOMAINZ */}
        <section className="py-24 px-6 text-center relative bg-black/60">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto space-y-14"
          >
            <h2 className="text-5xl font-display font-black text-metallic">
              Our Domainz
            </h2>

            <DomainBlock
              title="Android Development"
              date="23 Sept 2008: The Release of Android"
              text="Our hearty core domain lies in Android engineering — crafting performant, elegant, and production-grade mobile experiences."
            />

            <AnimatedDivider />

            <DomainBlock
              title="Desktop App Development"
              date="24 Aug 1981: The Birth of IBM PC"
              text="Desktop engineering forms our sturdy backbone — building robust tools that power productivity and enterprise-grade workflows."
            />

            <AnimatedDivider />

            <DomainBlock
              title="Web App Development"
              date="6 Aug 1991: The First Website went Live"
              text="Our passionate web domain pushes boundaries — building scalable, modern, and immersive digital platforms."
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
              Our Motive
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
                  We love hosting workshops and mentoring students. Covering Mobile App Dev, Desktop App Dev and Web App Dev, our aim is not solely delivering knowledge, but also to ensure some significant output product by each attendee.
                </p>
              </GlassCard>

              <GlassCard className="border-white/10" padding="lg">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Projects
                </h3>
                <p className="text-crimson mb-4">
                  Crafting Community and Paid Projects
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
