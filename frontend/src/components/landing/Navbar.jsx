import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CloudMoon, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", path: "hero" },
  { name: "About", path: "about" },
  { name: "Features", path: "features" },
  { name: "How It Works", path: "how-it-works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status on mount / location change
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, [location]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Smooth scroll handler for section IDs
  const handleNavClick = (sectionId) => {
    setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-[#1A253B] bg-[#060B13]/70 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#6366F1] flex items-center justify-center shadow-[0_0_35px_rgba(59,130,246,.35)] transition-transform group-hover:scale-105">
              <CloudMoon className="text-white w-6 h-6" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Sky<span className="text-[#2563EB]">Wise</span>
              </h1>
              <p className="text-xs text-[#94A3B8] -mt-1 font-medium">
                AI Weather Intelligence
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Action Buttons (Auth Conditioned) */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-[0_0_35px_rgba(59,130,246,.35)] transition cursor-pointer flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2.5 rounded-xl border border-[#1A253B] bg-[#0C1322] text-white text-xs font-semibold hover:bg-[#111A2E] transition cursor-pointer"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-[0_0_35px_rgba(59,130,246,.35)] transition cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-2 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-[#0C1322] border-t border-[#1A253B] overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-5 text-sm font-medium">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className="text-left text-[#94A3B8] hover:text-white transition-colors py-1 cursor-pointer"
                >
                  {item.name}
                </button>
              ))}

              <div className="pt-2 flex flex-col gap-3">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard");
                    }}
                    className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/login");
                      }}
                      className="h-11 rounded-xl border border-[#1A253B] text-white text-xs font-semibold bg-[#060B13] hover:bg-[#111A2E] transition cursor-pointer"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/register");
                      }}
                      className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition cursor-pointer"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}