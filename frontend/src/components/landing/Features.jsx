import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sparkles, Globe2, BarChart3, ShieldCheck, 
  Zap, Bot, Bell, Layers 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const previewRef = useRef(null);

  const [activeTab, setActiveTab] = useState(0);

  const featureList = [
    {
      id: 'radar',
      icon: Globe2,
      tag: 'Interactive Maps',
      title: 'Google Maps Tile Radar',
      description: 'Overlay real-time storm fronts, temperature heatmaps, and cloud density with high-fps tile rendering.',
      preview: {
        title: 'Live Radar Overview',
        metrics: [
          { label: 'Precipitation Coverage', value: '84%' },
          { label: 'Wind Vectors', value: '24 km/h NW' },
          { label: 'Map Provider', value: 'Google Maps API' },
        ]
      }
    },
    {
      id: 'ai',
      icon: Bot,
      tag: 'Gemini Engine',
      title: 'SkyWise AI Assistant',
      description: 'Ask personalized questions about outdoor plans, commute safety, dress recommendations, or travel weather.',
      preview: {
        title: 'AI Consultation Summary',
        metrics: [
          { label: 'Commute Safety Index', value: 'Optimal' },
          { label: 'UV Guidance', value: 'Apply SPF 30+' },
          { label: 'AI Engine', value: 'Gemini 1.5 Pro' },
        ]
      }
    },
    {
      id: 'analytics',
      icon: BarChart3,
      tag: 'Extended Insights',
      title: '7-Day Deep Analytics',
      description: 'Plan ahead with granular hourly intervals, AQI safety gauges, UV index tracking, and barometric trends.',
      preview: {
        title: '7-Day Metrics Output',
        metrics: [
          { label: 'Air Quality Index', value: '42 (Good)' },
          { label: 'Pressure Trend', value: '1014 hPa' },
          { label: 'Forecast Model', value: 'ECMWF + GFS' },
        ]
      }
    }
  ];

  const quickBadges = [
    { icon: Zap, label: 'Sub-second Latency' },
    { icon: ShieldCheck, label: '99.9% Uptime' },
    { icon: Bell, label: 'Instant Alerts' },
    { icon: Layers, label: 'Multi-layer Radar' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal on Scroll
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
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

      // 2. Feature Cards Entrance on Scroll
      gsap.fromTo(
        cardsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.cards-container',
            start: 'top 80%',
          }
        }
      );

      // 3. Bottom Preview Card Entrance
      gsap.fromTo(
        previewRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: previewRef.current,
            start: 'top 85%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-20 px-6 md:px-12 bg-[#060B13] text-white"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ================= HEADER ================= */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C1322] border border-[#1A253B] text-xs font-medium text-[#3B82F6]">
            <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>INTELLIGENT CAPABILITIES</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Engineered for <span className="text-[#3B82F6]">Extreme Accuracy</span>
          </h2>

          <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed">
            Combining high-resolution meteorological telemetry with generative AI to give you actionable insights.
          </p>

          {/* Quick Badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {quickBadges.map((badge, idx) => {
              const BadgeIcon = badge.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0C1322]/80 border border-[#1A253B] text-xs text-[#94A3B8]"
                >
                  <BadgeIcon className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 3 FEATURE CARDS ================= */}
        <div className="cards-container grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeTab === idx;

            return (
              <div
                key={item.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                onClick={() => setActiveTab(idx)}
                className={`rounded-2xl bg-[#0C1322] border p-6 cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-[#3B82F6] bg-[#111A2E]' 
                    : 'border-[#1A253B]'
                }`}
              >
                {/* Tag */}
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#3B82F6] bg-[#2563EB]/10 mb-4">
                  {item.tag}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#060B13] border border-[#1A253B] flex items-center justify-center text-[#3B82F6] mb-4">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#94A3B8] text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= PREVIEW BOX ================= */}
        <div 
          ref={previewRef}
          className="rounded-2xl bg-[#0C1322] border border-[#1A253B] p-6 md:p-8"
        >
          {/* Top Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1A253B] pb-4 mb-6">
            <span className="text-xs text-[#94A3B8] font-mono">
              Module: {featureList[activeTab].id}
            </span>

            <div className="flex gap-2">
              {featureList.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === idx
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#060B13] text-[#94A3B8] border border-[#1A253B]'
                  }`}
                >
                  {item.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Details & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl font-bold text-white">
                {featureList[activeTab].preview.title}
              </h3>

              <div className="space-y-2">
                {featureList[activeTab].preview.metrics.map((m, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#060B13] border border-[#1A253B]"
                  >
                    <span className="text-xs text-[#94A3B8]">{m.label}</span>
                    <span className="text-xs font-semibold text-white">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="h-48 rounded-xl bg-[#060B13] border border-[#1A253B] flex flex-col justify-center items-center p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 text-[#3B82F6] flex items-center justify-center mb-3">
                  {React.createElement(featureList[activeTab].icon, { className: 'w-6 h-6' })}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {featureList[activeTab].title} Selected
                </h4>
                <p className="text-xs text-[#94A3B8] max-w-xs">
                  Active parameters ready for your dashboard preview.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}