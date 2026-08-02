import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const timelineLineRef = useRef(null);
  const stepsRef = useRef([]);

  const steps = [
    {
      number: '01',
      tag: 'GEOCODING & MAPS',
      title: 'Search or Pin Your Location',
      description:
        'Select any city worldwide or click anywhere on the interactive map. SkyWise immediately converts geographical coordinates into high-resolution weather grid points.',
      highlight: 'Sub-millisecond resolution via Open-Meteo'
    },
    {
      number: '02',
      tag: 'TELEMETRY STREAMING',
      title: 'Real-Time Data Processing',
      description:
        'Our telemetry engine calculates barometric shifts, wind vector grids, cloud coverage densities, and precipitation probabilities across a 10-day outlook.',
      highlight: 'Live updates with zero ad tracking'
    },
    {
      number: '03',
      tag: 'INTELLIGENT AI REASONING',
      title: 'Context-Aware Guidance',
      description:
        'Ask Gemini AI anything about your daily schedule. The assistant reads your active telemetry stream directly to output precise clothing, commute, and outdoor recommendations.',
      highlight: 'Strictly contextual • Never invents numbers'
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Scroll-driven vertical line fill animation
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.timeline-container',
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: 0.5,
            }
          }
        );
      }

      // 2. Animate each step on scroll
      stepsRef.current.forEach((stepEl) => {
        if (!stepEl) return;

        const node = stepEl.querySelector('.step-node');
        const content = stepEl.querySelector('.step-content');

        gsap.fromTo(
          [node, content],
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepEl,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 px-6 md:px-12 bg-[#060B13] text-white overflow-hidden border-t border-[#1A253B]/40"
    >
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* ================= HEADER ================= */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C1322] border border-[#1A253B] text-xs font-semibold text-[#3B82F6] shadow-sm">
            <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Workflow Engine</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            How Sky<span className="text-[#3B82F6]">Wise</span> Works
          </h2>

          <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed">
            Scroll down to watch how complex atmospheric telemetry transforms into effortless daily planning.
          </p>
        </div>

        {/* ================= TIMELINE CONTAINER ================= */}
        <div className="timeline-container relative pl-6 sm:pl-12 md:pl-20 space-y-16">
          
          {/* Base Background Line (Unfilled State) */}
          <div className="absolute left-[23px] sm:left-[47px] md:left-[79px] top-4 bottom-4 w-0.5 bg-[#1A253B]/60" />

          {/* Animated Foreground Line (Fills on Scroll via GSAP) */}
          <div 
            ref={timelineLineRef}
            className="absolute left-[23px] sm:left-[47px] md:left-[79px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#2563EB] to-[#6366F1] origin-top shadow-[0_0_12px_#3B82F6]"
          />

          {/* ================= STEP ITEMS ================= */}
          {steps.map((step, idx) => (
            <div 
              key={idx}
              ref={(el) => (stepsRef.current[idx] = el)}
              className="relative flex items-start gap-6 sm:gap-10 group"
            >
              {/* Step Glowing Node Pin */}
              <div className="step-node relative z-10 w-12 h-12 rounded-2xl bg-[#0C1322] border border-[#1A253B] flex items-center justify-center shrink-0 -ml-6 sm:-ml-12 md:-ml-20 transition-all duration-300 group-hover:border-[#3B82F6] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <span className="text-xs font-mono font-bold text-[#3B82F6]">
                  {step.number}
                </span>
              </div>

              {/* Step Content Card */}
              <div className="step-content flex-1 rounded-2xl bg-[#0C1322] border border-[#1A253B] p-6 md:p-8 space-y-4 shadow-xl transition-all duration-300 hover:border-[#1A253B]/90 hover:bg-[#111A2E]">
                
                {/* Tag Pill */}
                <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-[#6366F1] uppercase bg-[#6366F1]/10 px-2.5 py-1 rounded-md border border-[#6366F1]/20">
                  {step.tag}
                </span>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Highlight Chip */}
                <div className="pt-2 border-t border-[#1A253B]/50 flex items-center gap-2 text-xs font-medium text-[#3B82F6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  <span>{step.highlight}</span>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}