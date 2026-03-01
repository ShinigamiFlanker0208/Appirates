import { GlassCard } from '@/components/ui/GlassCard';
import Link from "next/link";

export default function Home() {
  return (
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center">

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-crimson/10 border border-crimson/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
              <span className="text-[10px] font-bold text-crimson tracking-[0.2em] uppercase">
              Expedition 2026 Active
            </span>
            </div>

            {/* Main Headline with Metallic Effect */}
            <h1 className="max-w-5xl text-6xl md:text-8xl font-display font-black mb-8 leading-tight text-metallic">
              FORGING THE <br /> RED FRONTIER
            </h1>

            {/* Subtext */}
            <p className="max-w-2xl text-lg text-white/60 mb-12 font-mono tracking-tight">
              We are <span className="text-crimson-glow font-bold">Appirates</span>.
              Navigating the blood-red storms of Android engineering and
              premium design architecture.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24">
              <Link
                href="/join"
                className="px-10 py-4 rounded-xl bg-crimson text-white font-black uppercase tracking-widest hover:bg-red-500 hover:scale-105 transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)]">
                Join The Crew
              </Link>
              <button className="px-10 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold hover:bg-white/10 transition-all">
                The Arsenal
              </button>
            </div>

            {/* Featured Decks - Updated to use correct GlassCard props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
              <GlassCard className="text-left border-gray-500/20" hover padding="lg">
                <div className="text-crimson mb-4 text-2xl font-black">01</div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Android Dev</h3>
                <p className="text-sm text-white/40 font-mono">Hard-coded excellence in Kotlin and System Architecture.</p>
              </GlassCard>

              <GlassCard className="text-left border-gray-500/20" hover padding="lg">
                <div className="text-crimson mb-4 text-2xl font-black">02</div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Metal UI</h3>
                <p className="text-sm text-white/40 font-mono">Crafting industrial-grade glassmorphic interfaces.</p>
              </GlassCard>

              <GlassCard className="text-left border-gray-500/20" hover padding="lg">
                <div className="text-crimson mb-4 text-2xl font-black">03</div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Execution</h3>
                <p className="text-sm text-white/40 font-mono">Shipping production-ready assets to the abyss.</p>
              </GlassCard>
            </div>
      </main>
  );
}