import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CloudSun, Zap, ArrowRight, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
          },
        }
      );
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative py-12 md:py-16 px-6 md:px-12 bg-[#060B13] text-white overflow-hidden border-t border-[#1A253B]/40"
    >
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* ================= COMPACT CTA CARD ================= */}
        <div 
          ref={cardRef}
          className="relative rounded-2xl bg-[#0C1322] border border-[#1A253B]/80 p-6 sm:p-8 md:p-10 text-center shadow-[0_0_40px_-10px_#000000] overflow-hidden group transition-all duration-300 hover:border-[#3B82F6]/40"
        >
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A253B15_1px,transparent_1px),linear-gradient(to_bottom,#1A253B15_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center gap-4">
            
            {/* Top Interactive Status Pill */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#060B13]/80 border border-[#1A253B] text-xs">
              <CloudSun className="w-4 h-4 text-[#3B82F6] animate-pulse" />
              <span className="font-semibold text-white">SkyWise Weather Intelligence</span>
              <span className="text-[#1A253B]">•</span>
              <Activity className="w-3.5 h-3.5 text-[#6366F1]" />
              <span className="text-[10px] font-mono text-[#94A3B8]">Gemini AI Active</span>
            </div>

            {/* Title Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-xl">
              Ready for Smarter Daily Planning?
            </h2>

            {/* Description Subtitle */}
            <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed max-w-md">
              Get hyper-local accuracy combined with contextual AI advice—zero ads, zero tracking.
            </p>

            {/* Single Get Started Button */}
            <div className="pt-2">
              <button 
                onClick={() => navigate('/login')}
                className="relative px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold text-xs tracking-wide transition-all hover:bg-[#3B82F6] hover:shadow-lg hover:shadow-[#2563EB]/20 flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Footer Latency Badge */}
            <div className="pt-1 flex items-center gap-2 text-[10px] text-[#94A3B8]">
              <Zap className="w-3 h-3 text-[#6366F1]" />
              <span>Instant Setup • Latency <span className="font-mono text-emerald-400">120ms</span></span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}