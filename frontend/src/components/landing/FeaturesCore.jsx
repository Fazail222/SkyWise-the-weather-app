import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sun, 
  MapPin, 
  Bot, 
  Search, 
  Heart, 
  Shield 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesCore() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  const featureList = [
    {
      icon: Sun,
      title: 'Hyper-Local Weather',
      description: 'Get precise live conditions, 10-day forecasts, hourly precipitation trends, and UV index insights tailored to your exact coordinates.'
    },
    {
      icon: MapPin,
      title: 'Interactive Radar Map',
      description: 'Explore dynamic weather overlays featuring real-time rain radar, cloud coverage, temperature heatmaps, and customizable location pins.'
    },
    {
      icon: Bot,
      title: 'SkyWise AI Assistant',
      description: 'Interact with an intelligent assistant that understands your live weather context to give tailored travel and daily activity recommendations.'
    },
    {
      icon: Search,
      title: 'Instant City Search',
      description: 'Lightning-fast global geocoding autocomplete designed to help you quickly find, explore, and track weather anywhere on Earth.'
    },
    {
      icon: Heart,
      title: 'Saved Locations',
      description: 'Bookmark your favorite cities, pin quick-access weather hubs, and keep your personal search history effortlessly synced.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Built with privacy at its core. Zero tracking, no intrusive ads, and account data safely managed through secured infrastructure.'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Entrance
      gsap.fromTo(
        headerRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          }
        }
      );

      // Grid Cards Entrance
      gsap.fromTo(
        cardsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 px-6 md:px-12 bg-[#060B13] text-white"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* ================= HEADER ================= */}
        <div ref={headerRef} className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Badge Pill */}
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#0C1322] border border-[#1A253B] text-xs font-semibold text-[#3B82F6] shadow-sm">
            Features
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Smart Weather. <span className="text-[#3B82F6]">Zero Complexity.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed">
            Everything you need for smarter daily planning, powered by AI-driven weather insights and real-time telemetry.
          </p>
        </div>

        {/* ================= 2x3 FEATURE GRID WITH HOVER EFFECTS ================= */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureList.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="group relative rounded-2xl bg-[#0C1322] border border-[#1A253B] p-8 space-y-4 flex flex-col justify-start transition-all duration-300 hover:bg-[#111A2E] hover:border-[#3B82F6]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2563EB]/10"
              >
                {/* Icon Box with hover accent transition */}
                <div className="w-10 h-10 rounded-xl bg-[#060B13] border border-[#1A253B] flex items-center justify-center text-[#3B82F6] transition-colors duration-300 group-hover:border-[#3B82F6]/40 group-hover:bg-[#2563EB]/10 group-hover:text-[#3B82F6]">
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white tracking-wide pt-1 transition-colors duration-300 group-hover:text-white">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[#94A3B8] text-sm leading-relaxed transition-colors duration-300 group-hover:text-[#94A3B8]/90">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}