import React, { useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { CloudMoon, ArrowLeft, Cloud } from 'lucide-react';

/**
 * Interactive Cloud Layer using Lucide Cloud icons for Auth Layout.
 * Cloud icons scatter smoothly away when the cursor approaches.
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

    // Initial cloud setup
    const cloudCount = 16;
    const clouds = Array.from({ length: cloudCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 40 + 35,
      opacity: Math.random() * 0.35 + 0.15,
      vx: (Math.random() - 0.5) * 0.5, // Natural drift X
      vy: (Math.random() - 0.5) * 0.3, // Natural drift Y
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

        // Wrap boundaries
        if (cloud.x < -80) cloud.x = width + 80;
        if (cloud.x > width + 80) cloud.x = -80;
        if (cloud.y < -80) cloud.y = height + 80;
        if (cloud.y > height + 80) cloud.y = -80;

        // Repulsion / Run-away logic from cursor
        const dx = cloud.x - mouse.x;
        const dy = cloud.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius && distance > 0) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);

          cloud.x += Math.cos(angle) * force * 14;
          cloud.y += Math.sin(angle) * force * 14;
        }

        // Move DOM element
        el.style.transform = `translate3d(${cloud.x}px,${cloud.y}px, 0)`;
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

  const cloudList = Array.from({ length: 16 });

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
            className="text-sky-300/25 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.25)]" 
            size={40 + (idx % 4) * 12} 
          />
        </div>
      ))}
    </div>
  );
}

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#060B13] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Floating Interactive Cloud Background */}
      <InteractiveLucideClouds />

      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2563EB]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#6366F1]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Top Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md space-y-6 relative z-10 pointer-events-none">
        {/* Header Branding */}
        <div className="text-center space-y-2 pointer-events-auto">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#6366F1] flex items-center justify-center shadow-[0_0_35px_rgba(59,130,246,.35)]">
              <CloudMoon className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white">
              Sky<span className="text-[#3B82F6]">Wise</span>
            </span>
          </Link>
          <p className="text-xs text-[#94A3B8] font-medium">
            AI Weather Intelligence Portal
          </p>
        </div>

        {/* Auth Content Card Outlet */}
        <div className="rounded-3xl bg-[#0C1322]/90 border border-[#1A253B]/80 p-8 shadow-2xl backdrop-blur-xl pointer-events-auto">
          <Outlet />
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-[#94A3B8] pointer-events-auto">
          Protected by SkyWise Security • Zero Ad Tracking
        </p>
      </div>
    </div>
  );
}