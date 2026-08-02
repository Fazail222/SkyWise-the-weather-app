import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudSun, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#060B13] text-white border-t border-[#1A253B]/60 py-12 px-6 md:px-12 transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ================= TOP SECTION: BRAND & NAVIGATION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div 
              onClick={handleScrollToTop}
              className="inline-flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0C1322] border border-[#1A253B] flex items-center justify-center text-[#3B82F6] transition-transform group-hover:scale-105">
                <CloudSun className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                SkyWise
              </span>
            </div>

            <p className="text-[#94A3B8] text-xs leading-relaxed max-w-sm">
              Next-generation atmospheric telemetry platform paired with Gemini AI contextual reasoning. Fast, accurate, and completely privacy-focused.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            
            {/* Product Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Product
              </h4>
              <ul className="space-y-2 text-[#94A3B8]">
                <li>
                  <button onClick={() => navigate('/')} className="hover:text-[#3B82F6] transition-colors">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/login')} className="hover:text-[#3B82F6] transition-colors">
                    AI Assistant
                  </button>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#3B82F6] transition-colors">
                    Telemetry Stream
                  </a>
                </li>
              </ul>
            </div>

            {/* Platform Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Engine
              </h4>
              <ul className="space-y-2 text-[#94A3B8]">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open-Meteo API</span>
                </li>
                <li>
                  <span>Gemini 1.5 Pro</span>
                </li>
                <li>
                  <span>MapLibre GL</span>
                </li>
              </ul>
            </div>

            {/* Account & Auth */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Account
              </h4>
              <ul className="space-y-2 text-[#94A3B8]">
                <li>
                  <button onClick={() => navigate('/login')} className="hover:text-[#3B82F6] transition-colors">
                    Sign In
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/login')} className="hover:text-[#3B82F6] transition-colors">
                    Create Account
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="pt-6 border-t border-[#1A253B]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          
          {/* Copyright */}
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} SkyWise. Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
            <span>for clear skies.</span>
          </div>

        </div>

      </div>
    </footer>
  );
}