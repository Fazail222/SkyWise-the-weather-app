import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  CloudSun, 
  Terminal, 
  Lock, 
  Cpu, 
  Globe, 
  ArrowRight 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    // Null safety check to prevent crash on mount
    if (!sectionRef.current || !leftColRef.current || !rightColRef.current) return;

    const ctx = gsap.context(() => {
      // Left Column Entrance
      if (leftColRef.current?.children) {
        gsap.fromTo(
          leftColRef.current.children,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: leftColRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Right Column Entrance
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rightColRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 px-6 md:px-12 bg-[#060B13] text-white overflow-hidden border-t border-[#1A253B]/40"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* ================= LEFT SIDE: CONTENT ================= */}
        <div ref={leftColRef} className="lg:col-span-6 space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C1322] border border-[#1A253B] text-xs font-semibold text-[#3B82F6]">
            <CloudSun className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>About SkyWise</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Built for Clarity. <br />
            <span className="text-[#3B82F6]">Zero Noise Weather.</span>
          </h2>

          {/* Description */}
          <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed">
            SkyWise was engineered to solve modern weather clutter. We stripped away intrusive ads, unnecessary widgets, and trackers to deliver raw, real-time atmospheric telematics integrated with Gemini AI reasoning.
          </p>

          {/* Key Value Points */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0C1322] border border-[#1A253B] flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Open Telemetry Pipeline</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">Direct integration with Open-Meteo & MapLibre for instant data refresh.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0C1322] border border-[#1A253B] flex items-center justify-center text-[#6366F1] shrink-0 mt-0.5">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Contextual Intelligence</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">Gemini 1.5 Pro analyzes live weather conditions to give personalized recommendations.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0C1322] border border-[#1A253B] flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Scoped Privacy</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">Zero tracking. Your saved places and searches stay strictly inside your account.</p>
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="pt-2">
            <button className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold text-xs transition-all hover:bg-[#3B82F6] hover:shadow-lg hover:shadow-[#2563EB]/20 flex items-center gap-2 cursor-pointer">
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* ================= RIGHT SIDE: COMPOSITE GRAPHIC CARD ================= */}
        <div ref={rightColRef} className="lg:col-span-6">
          <div className="group relative rounded-3xl bg-[#0C1322] border border-[#1A253B] p-6 md:p-8 space-y-6 shadow-2xl transition-all duration-300 hover:border-[#3B82F6]/40">
            
            {/* Top Bar Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1A253B]/70">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs font-mono text-white font-semibold">skywise-core-v2.0</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Main Visual Image Container */}
            <div className="relative h-64 w-full rounded-2xl bg-[#060B13] border border-[#1A253B]/60 overflow-hidden group/img">
              
              {/* Featured Weather/Dashboard Image */}
              <img
                src="https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1000&auto=format&fit=crop"
                alt="SkyWise Radar Interface"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105 opacity-85"
              />

              {/* Gradient Overlay for Seamless Blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1322] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-[#060B13]/20" />

              {/* Floating Telemetry Badge Overlay */}
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-[#060B13]/90 backdrop-blur-md border border-[#1A253B]/80 text-[10px] font-bold text-white shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
                <span>Open-Meteo Live Data</span>
              </div>

              {/* Bottom Overlay Label */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#0C1322]/80 backdrop-blur-md border border-[#1A253B]/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span className="text-xs font-medium text-white">Radar & Cloud Layer Active</span>
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8]">120ms Latency</span>
              </div>

            </div>

            {/* Bottom Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#060B13] border border-[#1A253B]/60 text-center">
                <span className="block text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Accuracy</span>
                <span className="text-sm font-extrabold text-[#3B82F6]">99.8%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#060B13] border border-[#1A253B]/60 text-center">
                <span className="block text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Ads</span>
                <span className="text-sm font-extrabold text-emerald-400">0% Zero</span>
              </div>
              <div className="p-3 rounded-xl bg-[#060B13] border border-[#1A253B]/60 text-center">
                <span className="block text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Engine</span>
                <span className="text-sm font-extrabold text-[#6366F1]">Gemini AI</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}