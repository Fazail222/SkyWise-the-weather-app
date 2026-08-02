import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, CheckCircle2, Cpu, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function OverviewSection() {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useEffect(() => {
    // Guard clause: ensure DOM elements exist before running GSAP
    if (!containerRef.current || !row1Ref.current) return;

    // Pass containerRef.current (DOM node) to gsap.context
    const ctx = gsap.context(() => {

      // Row 1 Slide In
      if (row1Ref.current?.children) {
        gsap.fromTo(
          row1Ref.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row1Ref.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Row 2 Slide In (if active/present)
      if (row2Ref.current?.children) {
        gsap.fromTo(
          row2Ref.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row2Ref.current,
              start: 'top 80%',
            },
          }
        );
      }

    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-24 px-6 md:px-12 bg-[#060B13] text-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-28">

        {/* ================= BLOCK 1: Left Text / Right Weather Graphic ================= */}
        <div ref={row1Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C1322] border border-[#1A253B] text-xs font-semibold text-[#3B82F6]">
              <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Real-Time Engine</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Hyper-local Forecasts <br />
              <span className="text-[#3B82F6]">Powered by Precision Telemetry.</span>
            </h2>

            <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed">
              SkyWise aggregates micro-meteorological data from global stations to provide second-by-second atmospheric accuracy. Never get caught off guard by sudden rain fronts again.
            </p>

            <ul className="space-y-3 pt-2 text-sm text-[#94A3B8]">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>Sub-hourly rain probability and cloud movement maps.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>Barometric pressure and wind velocity vectors.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>Global air quality index (AQI) with pollutant breakdown.</span>
              </li>
            </ul>
          </div>

          {/* Right SVG Graphic Card */}
          <div className="lg:col-span-6">
            <div className="group relative rounded-3xl bg-[#0C1322] border border-[#1A253B] p-8 transition-all duration-300 hover:border-[#3B82F6]/40 hover:bg-[#111A2E] shadow-2xl">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-[#1A253B]/70 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-[#94A3B8]">telemetry-feed.v1</span>
              </div>

              {/* Weather Telemetry SVG */}
              <div className="relative h-64 w-full flex items-center justify-center">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="gridGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="40" x2="400" y2="40" stroke="#1A253B" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="90" x2="400" y2="90" stroke="#1A253B" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="140" x2="400" y2="140" stroke="#1A253B" strokeWidth="1" strokeDasharray="4 4" />

                  <path
                    d="M0 140 Q 80 60, 160 100 T 320 50 T 400 90 L 400 180 L 0 180 Z"
                    fill="url(#gridGlow)"
                  />

                  <path
                    d="M0 140 Q 80 60, 160 100 T 320 50 T 400 90"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                  />

                  <circle cx="160" cy="100" r="5" fill="#3B82F6" />
                  <circle cx="320" cy="50" r="5" fill="#6366F1" />

                  <rect x="260" y="8" width="110" height="32" rx="8" fill="#0C1322" stroke="#1A253B" strokeWidth="1" />
                  <text x="315" y="28" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">Peak Temp: 32°C</text>
                </svg>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#1A253B]/70 text-center">
                <div className="bg-[#060B13] p-2.5 rounded-xl border border-[#1A253B]/50">
                  <span className="block text-[10px] text-[#94A3B8]">Humidity</span>
                  <span className="text-xs font-bold text-white">64%</span>
                </div>
                <div className="bg-[#060B13] p-2.5 rounded-xl border border-[#1A253B]/50">
                  <span className="block text-[10px] text-[#94A3B8]">Wind</span>
                  <span className="text-xs font-bold text-[#3B82F6]">18 km/h</span>
                </div>
                <div className="bg-[#060B13] p-2.5 rounded-xl border border-[#1A253B]/50">
                  <span className="block text-[10px] text-[#94A3B8]">Visibility</span>
                  <span className="text-xs font-bold text-[#6366F1]">10 km</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}