import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { 
  Sparkles, MapPin, CloudSun, Wind, 
  Droplets, Bot, ArrowRight, Calendar, AirVent, 
  Radar, Bell, Heart, Cloud 
} from 'lucide-react';

/**
 * Interactive Cloud Layer using Lucide Cloud icons.
 * Cloud icons float around and scatter away when cursor gets near.
 */
function InteractiveLucideClouds() {
  const containerRef = useRef(null);
  const cloudElementsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let width = container.offsetWidth;
    let height = container.offsetHeight;

    const mouse = { x: -1000, y: -1000, radius: 200 };

    // Initial cloud data setup
    const cloudCount = 18;
    const clouds = Array.from({ length: cloudCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 40 + 35, // Icon size in px
      opacity: Math.random() * 0.35 + 0.15,
      vx: (Math.random() - 0.5) * 0.5, // Drift speed X
      vy: (Math.random() - 0.5) * 0.3, // Drift speed Y
    }));

    const handleResize = () => {
      if (!container) return;
      width = container.offsetWidth;
      height = container.offsetHeight;
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const updatePhysics = () => {
      clouds.forEach((cloud, idx) => {
        const el = cloudElementsRef.current[idx];
        if (!el) return;

        // Natural Drift
        cloud.x += cloud.vx;
        cloud.y += cloud.vy;

        // Wrap around hero section bounds
        if (cloud.x < -80) cloud.x = width + 80;
        if (cloud.x > width + 80) cloud.x = -80;
        if (cloud.y < -80) cloud.y = height + 80;
        if (cloud.y > height + 80) cloud.y = -80;

        // Distance to cursor
        const dx = cloud.x - mouse.x;
        const dy = cloud.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        // Scatter / Push away from cursor
        if (distance < mouse.radius && distance > 0) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);

          cloud.x += Math.cos(angle) * force * 14;
          cloud.y += Math.sin(angle) * force * 14;
        }

        // Apply position to DOM node
        el.style.transform = `translate3d(${cloud.x}px, ${cloud.y}px, 0)`;
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Generate fixed cloud elements array
  const cloudList = Array.from({ length: 18 });

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden"
    >
      {cloudList.map((_, idx) => (
        <div
          key={idx}
          ref={(el) => (cloudElementsRef.current[idx] = el)}
          className="absolute top-0 left-0 transition-transform ease-out duration-75 pointer-events-none"
          style={{ willChange: 'transform' }}
        >
          <Cloud 
            className="text-sky-300/30 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.25)]" 
            size={42 + (idx % 4) * 12} 
          />
        </div>
      ))}
    </div>
  );
}

export default function Hero({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef(null);

  const popularCities = ['Lahore', 'London', 'Dubai', 'Tokyo', 'New York'];

  const features = [
    {
      icon: CloudSun,
      title: 'Live Weather',
      desc: 'Real-time updates for any location worldwide.',
      color: 'text-[#3B82F6]',
    },
    {
      icon: Calendar,
      title: '7 Days Forecast',
      desc: '7-day forecasts with accuracy.',
      color: 'text-[#6366F1]',
    },
    {
      icon: AirVent,
      title: 'Air Quality',
      desc: 'Real-time AQI and pollution level monitoring.',
      color: 'text-teal-400',
    },
    {
      icon: Radar,
      title: 'Live Radar',
      desc: 'Interactive radar maps and satellite views.',
      color: 'text-[#3B82F6]',
    },
    {
      icon: Bell,
      title: 'Weather Alerts',
      desc: 'Instant alerts for severe weather conditions.',
      color: 'text-indigo-400',
    },
    {
      icon: Heart,
      title: 'Your Favorites',
      desc: 'Save your favorite cities and track easily.',
      color: 'text-[#6366F1]',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-left-content',
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8 }
      )
        .fromTo(
          '.hero-preview-card',
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9 },
          '-=0.5'
        )
        .fromTo(
          '.hero-bottom-card',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen bg-[#060B13] text-white pt-24 pb-16 px-6 md:px-12 overflow-hidden flex flex-col justify-between"
    >
      {/* Floating Interactive Lucide Cloud Layer */}
      <InteractiveLucideClouds />

      {/* Background Soft Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-[#2563EB]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-[#6366F1]/15 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Main Top Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto relative z-10 pointer-events-none">
        
        {/* LEFT COLUMN */}
        <div className="hero-left-content lg:col-span-6 space-y-8 pointer-events-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0C1322] border border-[#1A253B]/80 text-xs font-semibold text-[#3B82F6] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#6366F1] animate-pulse" />
            <span>AI POWERED WEATHER INTELLIGENCE</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="block text-white">Weather That</span>
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-indigo-300 bg-clip-text text-transparent block">
              Thinks Ahead.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-[#94A3B8] max-w-xl leading-relaxed">
            Real-time weather updates, AI forecasts, air quality insights, and intelligent recommendations — all in one place.
          </p>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[#94A3B8] font-medium mr-1">Popular Searches:</span>
            {popularCities.map((city, idx) => (
              <button
                key={city}
                onClick={() => {
                  setSearchQuery(city);
                  if (onSearch) onSearch(city);
                }}
                className={`px-3.5 py-1.5 rounded-xl border transition cursor-pointer ${
                  idx === 0 
                    ? 'bg-[#2563EB]/20 border-[#3B82F6] text-white font-medium' 
                    : 'bg-[#0C1322]/60 border-[#1A253B]/60 text-[#94A3B8] hover:text-white hover:border-[#1A253B]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="hero-preview-card lg:col-span-6 flex justify-center pointer-events-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0C1322]/90 border border-[#1A253B]/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-4 h-4 text-[#3B82F6]" />
                <span className="font-semibold text-sm md:text-base">Lahore, Pakistan</span>
              </div>
              <span className="text-xs text-[#94A3B8] font-mono">May 27, 2025 • 09:30 PM</span>
            </div>

            {/* Main Temp */}
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <div className="text-6xl md:text-7xl font-extrabold text-white tracking-tight">
                  27<span className="text-4xl text-[#94A3B8] font-light">°C</span>
                </div>
                <div className="text-[#3B82F6] text-sm font-medium mt-1">Partly Cloudy</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#111A2E] border border-[#1A253B]/50 text-[#3B82F6]">
                <CloudSun className="w-12 h-12" />
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4 text-xs text-[#94A3B8] border-b border-[#1A253B]/60 pb-6 mb-6">
              <span>Feels like 29°</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-[#3B82F6]" /> Humidity 68%</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-[#3B82F6]" /> Wind 18 km/h</span>
            </div>

            {/* Forecast Strip & AQI */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-8 flex justify-between items-center bg-[#060B13]/50 rounded-2xl p-3 border border-[#1A253B]/40 text-center">
                {[
                  { time: 'Now', temp: '27°' },
                  { time: '10 PM', temp: '26°' },
                  { time: '11 PM', temp: '25°' },
                  { time: '12 AM', temp: '24°' },
                  { time: '1 AM', temp: '23°' },
                  { time: '2 AM', temp: '22°' },
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <span className="block text-[10px] text-[#94A3B8]">{item.time}</span>
                    <CloudSun className="w-4 h-4 mx-auto text-[#94A3B8]" />
                    <span className="block text-xs font-semibold text-white">{item.temp}</span>
                  </div>
                ))}
              </div>

              <div className="col-span-4 bg-[#060B13]/50 rounded-2xl p-3 border border-[#1A253B]/40 text-center flex flex-col justify-center items-center">
                <span className="text-[10px] text-[#94A3B8] mb-1">Air Quality Index</span>
                <div className="w-10 h-10 rounded-full border-2 border-emerald-500/80 flex items-center justify-center font-bold text-sm text-emerald-400">
                  45
                </div>
                <span className="text-[10px] text-emerald-400 font-medium mt-1">Good</span>
                <span className="text-[9px] text-[#94A3B8]/70">PM2.5 • 18 µg/m³</span>
              </div>
            </div>

            {/* Ask AI Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#111A2E] via-[#0C1322] to-[#111A2E] border border-[#6366F1]/40 p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6366F1]/20 text-[#6366F1] flex items-center justify-center border border-[#6366F1]/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Ask SkyWise AI</h4>
                  <p className="text-[11px] text-[#94A3B8] leading-tight">Get intelligent answers to all your weather questions.</p>
                </div>
              </div>

              <button className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-[#2563EB]/30 shrink-0 cursor-pointer">
                Ask Anything
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* BOTTOM FEATURE CARDS */}
      <div className="max-w-7xl mx-auto w-full pt-16 relative z-10 pointer-events-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="hero-bottom-card rounded-2xl bg-[#0C1322]/70 border border-[#1A253B]/70 p-4 hover:border-[#2563EB]/50 hover:bg-[#111A2E] transition duration-300 group backdrop-blur-sm"
              >
                <div className={`mb-3 p-2.5 rounded-xl bg-[#060B13] border border-[#1A253B]/50 w-fit ${feat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{feat.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-snug">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}