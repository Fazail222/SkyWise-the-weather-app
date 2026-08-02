import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeContext } from '../context/ThemeProvider';
import { 
  Sun, 
  Moon, 
  User, 
  Mail, 
  ShieldCheck, 
  Check, 
  Save, 
  Sparkles,
  Lock,
  Loader2,
  AlertCircle
} from 'lucide-react';
// Import your async thunks here when ready:
// import { updateProfile, changePassword } from '../store/authThunk';

export default function SettingsPage() {
  const dispatch = useDispatch();

  // Theme context state
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Redux auth state
  const { user, loading, error } = useSelector((state) => state.auth);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  // UI Feedback States
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Sync profile form when Redux user state updates
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Handle Profile Inputs
  const handleProfileChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Password Inputs
  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.value]: e.target.value,
    }));
  };

  // Dispatch Profile Update (PATCH /api/v1/auth/profile)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // dispatch(updateProfile({ name: profileData.name, avatar: profileData.avatar }))
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  // Dispatch Password Change (PATCH /api/v1/auth/change-password)
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('Both current and new password are required');
      return;
    }

    try {
      // dispatch(changePassword(passwordData))
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err?.message || 'Failed to change password');
    }
  };

  // Generate User Initials
  const initials = profileData.name
    ? profileData.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-2 sm:px-4 custom-scrollbar">
      
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-skywise-textPrimary tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-skywise-textMuted mt-1">
            Manage your profile details, security settings, and theme preferences.
          </p>
        </div>
      </div>

      <div className="space-y-6">

        {/* 1. PROFILE SETTINGS SECTION */}
        <section className="p-5 sm:p-6 rounded-3xl bg-skywise-card/80 border border-skywise-border/80 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-skywise-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-skywise-accent/10 text-skywise-accent">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-skywise-textPrimary">Profile Information</h2>
                <p className="text-xs text-skywise-textMuted">Update your personal account details.</p>
              </div>
            </div>

            <button
              form="profile-form"
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-skywise-accent hover:bg-skywise-accentGlow text-white text-xs sm:text-sm font-semibold transition shadow-lg shadow-skywise-accent/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : profileSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>

          {/* AVATAR BANNER */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-skywise-cardHover/40 border border-skywise-border/60">
            {profileData.avatar ? (
              <img 
                src={profileData.avatar} 
                alt="Avatar" 
                className="w-14 h-14 rounded-full object-cover border-2 border-skywise-accent shadow-lg shrink-0" 
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-skywise-accent to-skywise-aiGlow flex items-center justify-center text-lg font-bold text-white shadow-lg shrink-0">
                {initials}
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-skywise-textPrimary">
                {profileData.name || 'SkyWise User'}
              </h3>
              <p className="text-xs text-skywise-textMuted flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {user?.isVerified ? 'Verified Account' : 'Standard User'}
              </p>
            </div>
          </div>

          {/* PROFILE FORM */}
          <form id="profile-form" onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-skywise-textPrimary flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-skywise-textMuted" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-2xl bg-skywise-cardHover/60 border border-skywise-border text-xs sm:text-sm text-skywise-textPrimary focus:outline-none focus:border-skywise-accent transition"
              />
            </div>

            {/* Email Address (ReadOnly per Backend Spec) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-skywise-textPrimary flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-skywise-textMuted" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                readOnly
                disabled
                className="w-full px-4 py-2.5 rounded-2xl bg-skywise-cardHover/30 border border-skywise-border/40 text-xs sm:text-sm text-skywise-textMuted cursor-not-allowed"
              />
            </div>

          </form>
        </section>

        {/* 2. SECURITY & PASSWORD SECTION */}
        <section className="p-5 sm:p-6 rounded-3xl bg-skywise-card/80 border border-skywise-border/80 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-skywise-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-skywise-accent/10 text-skywise-accent">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-skywise-textPrimary">Security</h2>
                <p className="text-xs text-skywise-textMuted">Update your account password.</p>
              </div>
            </div>

            <button
              form="password-form"
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-skywise-accent hover:bg-skywise-accentGlow text-white text-xs sm:text-sm font-semibold transition shadow-lg shadow-skywise-accent/20 cursor-pointer disabled:opacity-50"
            >
              {passwordSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Updated</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>

          {passwordError && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form id="password-form" onSubmit={handleSavePassword} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-skywise-textPrimary flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-skywise-textMuted" />
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-2xl bg-skywise-cardHover/60 border border-skywise-border text-xs sm:text-sm text-skywise-textPrimary focus:outline-none focus:border-skywise-accent transition"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-skywise-textPrimary flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-skywise-textMuted" />
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-2xl bg-skywise-cardHover/60 border border-skywise-border text-xs sm:text-sm text-skywise-textPrimary focus:outline-none focus:border-skywise-accent transition"
              />
            </div>
          </form>
        </section>

        {/* 3. THEME & APPEARANCE SETTINGS */}
        <section className="p-5 sm:p-6 rounded-3xl bg-skywise-card/80 border border-skywise-border/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-skywise-border/50 pb-4">
            <div className="p-2.5 rounded-2xl bg-skywise-accent/10 text-skywise-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-skywise-textPrimary">Theme & Appearance</h2>
              <p className="text-xs text-skywise-textMuted">Select your preferred color theme mode.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* LIGHT MODE */}
            <button
              type="button"
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
                theme === 'light'
                  ? 'border-skywise-accent bg-skywise-accent/10 text-skywise-textPrimary shadow-md'
                  : 'border-skywise-border bg-skywise-cardHover/50 text-skywise-textMuted hover:text-skywise-textPrimary'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold">Light Mode</span>
              </div>
              {theme === 'light' && <Check className="w-4 h-4 text-skywise-accent" />}
            </button>

            {/* DARK MODE */}
            <button
              type="button"
              onClick={() => theme === 'light' && toggleTheme()}
              className={`flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
                theme === 'dark'
                  ? 'border-skywise-accent bg-skywise-accent/10 text-skywise-textPrimary shadow-md'
                  : 'border-skywise-border bg-skywise-cardHover/50 text-skywise-textMuted hover:text-skywise-textPrimary'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold">Dark Mode</span>
              </div>
              {theme === 'dark' && <Check className="w-4 h-4 text-skywise-accent" />}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}