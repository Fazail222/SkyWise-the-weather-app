import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/auth/authThunk';
import {
  LayoutDashboard,
  CloudSun,
  Radar,
  Star,
  Settings,
  User,
  History,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import FloatingAIChat from '../components/ai/FloatingAiChat';

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Radar, label: 'Radar', path: '/radar' },
    { icon: Star, label: 'Favorites', path: '/favorites' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      console.warn('Logout request failed, clearing session locally.', err);
    } finally {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : null;

  return (
    <div className="h-screen bg-skywise-bg text-skywise-textPrimary relative flex overflow-hidden p-3 sm:p-4 md:p-6 transition-colors duration-300">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-10 left-10 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-skywise-accent/20 rounded-full blur-[100px] md:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-skywise-aiGlow/20 rounded-full blur-[100px] md:blur-[140px] pointer-events-none" />

      {/* FLOATING PILL SIDEBAR — Desktop/Tablet with Neon Glow Shadow */}
      <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center py-6 px-3 w-20 h-[80vh] rounded-[40px] bg-skywise-card/85 border border-skywise-accent/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(var(--skywise-accent-rgb),0.3),inset_0_0_20px_rgba(var(--skywise-accent-rgb),0.1)] transition-all duration-300">

        {/* Ambient Back Glow Inside Sidebar */}
        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-skywise-accent/15 via-transparent to-skywise-aiGlow/15 pointer-events-none blur-md" />

        {/* Top Logo */}
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-skywise-accent to-skywise-aiGlow flex items-center justify-center shadow-[0_0_25px_rgba(var(--skywise-accent-rgb),0.8)] shrink-0">
          <CloudSun className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>
          
        {/* Divider */}
        <div className="w-8 h-px bg-skywise-accent/40 my-5 shrink-0 shadow-[0_0_10px_rgba(var(--skywise-accent-rgb),0.6)]" />

        {/* Navigation Links */}
        <nav className="relative flex flex-col items-center gap-3 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `w-12 h-12 rounded-2xl transition-all duration-200 relative group flex items-center justify-center ${
                    isActive
                      ? 'bg-skywise-accent text-white shadow-[0_0_30px_rgba(var(--skywise-accent-rgb),0.8)] scale-105'
                      : 'text-skywise-textMuted hover:text-skywise-textPrimary hover:bg-skywise-cardHover hover:shadow-[0_0_20px_rgba(var(--skywise-accent-rgb),0.35)]'
                  }`
                }
                title={item.label}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]' : ''}`} strokeWidth={isActive ? 2.4 : 2} />
                    {isActive && (
                      <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full bg-skywise-accentGlow shadow-[0_0_15px_var(--skywise-accent)]" />
                    )}
                    <span className="absolute left-16 px-2.5 py-1 rounded-lg bg-skywise-card border border-skywise-border text-xs text-skywise-textPrimary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-40">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="w-8 h-px bg-skywise-accent/40 my-5 shrink-0 shadow-[0_0_10px_rgba(var(--skywise-accent-rgb),0.6)]" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="relative w-12 h-12 rounded-2xl text-skywise-textMuted hover:text-rose-500 hover:bg-rose-500/10 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition flex items-center justify-center group shrink-0 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="absolute left-16 px-2.5 py-1 rounded-lg bg-skywise-card border border-skywise-border text-xs text-skywise-textPrimary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-40">
            Log out
          </span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:pl-28 pb-20 md:pb-2 pr-2 md:pr-4 w-full z-10 h-full min-h-0">

        {/* TOP BAR */}
        <header className="w-full flex items-center justify-between gap-3 mb-4 md:mb-6 shrink-0">
          
          {/* Logo Section (Mobile) */}
          <div className="flex items-center gap-3">
            <div className="md:hidden w-9 h-9 rounded-full bg-gradient-to-tr from-skywise-accent to-skywise-aiGlow flex items-center justify-center shadow-[0_0_20px_rgba(var(--skywise-accent-rgb),0.7)] shrink-0">
              <CloudSun className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            </div>
          </div>

          {/* ACTIONS: THEME TOGGLE & USER PROFILE INFO */}
          <div className="flex items-center gap-2.5 ml-auto">
            <ThemeToggle />

            <div className="relative shrink-0" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full bg-skywise-card/85 border border-skywise-accent/40 hover:border-skywise-accent transition shadow-[0_0_25px_rgba(var(--skywise-accent-rgb),0.25)] backdrop-blur-xl cursor-pointer"
              >
                {/* Avatar */}
                <span className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-skywise-accent to-skywise-aiGlow flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-[0_0_15px_rgba(var(--skywise-accent-rgb),0.7)]">
                  {initials ?? <User className="w-4 h-4" />}
                </span>

                {/* Name & Email */}
                <div className="text-left leading-tight hidden sm:block">
                  <p className="text-xs font-bold text-skywise-textPrimary max-w-[140px] truncate">
                    {user?.name || 'Account'}
                  </p>
                  {user?.email && (
                    <p className="text-[10px] text-skywise-textMuted max-w-[140px] truncate">
                      {user.email}
                    </p>
                  )}
                </div>

                {/* Arrow Icon */}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-skywise-textMuted transition-transform ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-skywise-card border border-skywise-accent/40 backdrop-blur-xl shadow-[0_0_40px_rgba(var(--skywise-accent-rgb),0.3)] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-skywise-border/70">
                    <p className="text-xs font-bold text-skywise-textPrimary truncate">{user?.name || 'Account'}</p>
                    <p className="text-[11px] text-skywise-textMuted truncate">{user?.email || 'No email attached'}</p>
                  </div>
                  <nav className="py-1.5">
                    <NavLink
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-skywise-textPrimary hover:bg-skywise-cardHover transition"
                    >
                      <Settings className="w-4 h-4 text-skywise-textMuted" />
                      Settings
                    </NavLink>
                  </nav>
                  <div className="border-t border-skywise-border/70 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ROUTER OUTLET VIEWPORT WITH CUSTOM THEME SCROLLBAR */}
        <main className="flex-1 w-full overflow-y-auto min-h-0 custom-scrollbar pr-1">
          <Outlet />
        </main>

      </div>

      {/* BOTTOM TAB BAR — Mobile only */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-30 flex items-center justify-around px-2 py-2 rounded-[28px] bg-skywise-card/90 border border-skywise-accent/40 backdrop-blur-xl shadow-[0_0_40px_rgba(var(--skywise-accent-rgb),0.3)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-skywise-textPrimary'
                    : 'text-skywise-textMuted hover:text-skywise-textPrimary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                      isActive ? 'bg-skywise-accent text-white shadow-[0_0_20px_rgba(var(--skywise-accent-rgb),0.8)] scale-105' : ''
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] ${isActive ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]' : ''}`} strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  <span className="text-[9px] font-medium leading-none">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <FloatingAIChat />
    </div>
  );
}