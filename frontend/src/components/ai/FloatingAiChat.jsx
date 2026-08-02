import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { askSkyWiseAI } from '../../redux/ai/aiThunk';
import { clearChatHistory } from '../../redux/ai/aiSlice';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  MapPin,
  Minimize2,
} from 'lucide-react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function FloatingAIChat() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const promptsRef = useRef(null);

  // Redux State Selectors
  const { messages, loading, error } = useSelector((state) => state.ai);

  // MATCH DASHBOARD DATA EXACTLY:
  const dashboardCity = useSelector(
    (state) => state.weather.weather?.location?.city || state.weather.activeCity || ''
  );

  // Clear manual override when background dashboard location changes
  useEffect(() => {
    setCustomCity('');
  }, [dashboardCity]);

  // Derive active context city
  const currentCity = customCity || dashboardCity;

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, loading, isOpen]);

  // Lock background scroll on mobile while the panel is open full-screen
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Focus the input as soon as the panel finishes opening
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    dispatch(askSkyWiseAI({ city: currentCity, message: messageText }));
  };

  const handleQuickPrompt = (promptType) => {
    if (loading) return;

    let promptText = '';
    switch (promptType) {
      case 'outfit':
        promptText = `What should I wear in ${currentCity} right now?`;
        break;
      case 'outdoor':
        promptText = `Is it suitable for outdoor activities in ${currentCity}?`;
        break;
      case 'rain':
        promptText = `Will it rain in ${currentCity} today?`;
        break;
      default:
        promptText = promptType;
    }

    dispatch(askSkyWiseAI({ city: currentCity, message: promptText }));
  };

  const handleCityChangeSubmit = (e) => {
    e.preventDefault();
    if (customCity.trim()) {
      setIsEditingCity(false);
    }
  };

  return (
    <div className="fixed lg:bottom-6 bottom-20 lg:right-6 right-3 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* Launcher button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={launcherRef}
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative m-4 sm:m-0 flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-skywise-accent via-skywise-accentGlow to-skywise-aiGlow text-skywise-textPrimary shadow-lg shadow-skywise-accent/25 hover:shadow-xl hover:shadow-skywise-accentGlow/40 cursor-pointer border border-skywise-border/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-skywise-accentGlow focus-visible:ring-offset-2 focus-visible:ring-offset-skywise-bg"
          >
            <Sparkles className="w-5 h-5 text-skywise-textPrimary animate-pulse motion-reduce:animate-none transition-transform duration-500 group-hover:rotate-12" />
            <span className="text-xs font-bold tracking-wide">Ask SkyWise AI</span>

            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-skywise-accentGlow opacity-75 motion-reduce:animate-none"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-skywise-accent border-2 border-skywise-bg"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.92, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.92, transition: { duration: 0.2, ease: 'easeInOut' } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="
                fixed inset-0 sm:relative sm:inset-auto
                w-full h-[100dvh] sm:h-[540px]
                sm:w-[380px] md:w-[400px]
                rounded-none sm:rounded-3xl
                bg-skywise-card border-0 sm:border sm:border-skywise-border
                shadow-2xl backdrop-blur-2xl
                flex flex-col overflow-hidden
              "
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Header */}
              <div
                className="px-4 sm:px-5 py-3.5 sm:py-4 bg-skywise-bg/90 border-b border-skywise-border flex items-center justify-between backdrop-blur-md shrink-0"
                style={{ paddingTop: 'max(0.875rem, env(safe-area-inset-top))' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <motion.div 
                    initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-skywise-accent to-skywise-aiGlow flex items-center justify-center text-skywise-textPrimary shadow-md shadow-skywise-accent/20 shrink-0"
                  >
                    <Bot className="w-5 h-5" />
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-skywise-textPrimary flex items-center gap-1.5">
                      SkyWise AI
                      <Sparkles className="w-3.5 h-3.5 text-skywise-accentGlow" />
                    </h3>

                    {isEditingCity ? (
                      <form onSubmit={handleCityChangeSubmit} className="flex items-center gap-1 mt-0.5">
                        <input
                          type="text"
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
                          placeholder="Type city..."
                          className="bg-skywise-bg border border-skywise-accent rounded px-1.5 py-0.5 text-[10px] text-skywise-textPrimary focus:outline-none focus:ring-1 focus:ring-skywise-accentGlow w-24 sm:w-auto transition-all duration-200"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="text-[10px] text-skywise-accentGlow font-semibold hover:underline shrink-0"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <p
                        onClick={() => setIsEditingCity(true)}
                        className="text-[11px] text-skywise-textMuted flex items-center gap-1 cursor-pointer hover:text-skywise-textPrimary transition-colors duration-200 truncate"
                        title="Click to override context city"
                      >
                        <MapPin className="w-3 h-3 text-skywise-accentGlow shrink-0" />
                        <span className="truncate">
                          Context: <strong className="text-skywise-textPrimary underline decoration-dotted">{currentCity}</strong>
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => dispatch(clearChatHistory())}
                    title="Clear Chat"
                    className="p-2 text-skywise-textMuted hover:text-rose-400 hover:bg-skywise-cardHover rounded-lg transition-all duration-200 cursor-pointer active:scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    title="Minimize Window"
                    className="p-2 text-skywise-textMuted hover:text-skywise-textPrimary hover:bg-skywise-cardHover rounded-lg transition-all duration-200 cursor-pointer active:scale-90"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-skywise-border scrollbar-track-transparent overscroll-contain"
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex gap-2.5 sm:gap-3 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-skywise-bg flex items-center justify-center text-skywise-accentGlow shrink-0 mt-0.5 border border-skywise-border">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-3.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-skywise-accent to-skywise-aiGlow text-skywise-textPrimary rounded-tr-none shadow-md shadow-skywise-accent/10'
                          : 'bg-skywise-bg border border-skywise-border text-skywise-textPrimary rounded-tl-none shadow-inner'
                      }`}
                    >
                      {msg.sender === 'ai' && (
                        <p className="text-skywise-accentGlow font-semibold mb-1 flex items-center gap-1 text-[11px] opacity-90">
                          SkyWise Insights
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-skywise-accent/20 border border-skywise-accent/40 flex items-center justify-center text-skywise-textPrimary shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 sm:gap-3 justify-start"
                  >
                    <div className="w-7 h-7 rounded-lg bg-skywise-bg flex items-center justify-center text-skywise-accentGlow shrink-0 border border-skywise-border">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-skywise-bg border border-skywise-border p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-skywise-textMuted">
                      <span className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={
                              prefersReducedMotion()
                                ? {}
                                : { y: [-6, 0] }
                            }
                            transition={
                              prefersReducedMotion()
                                ? {}
                                : {
                                    duration: 0.4,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    ease: 'easeInOut',
                                    delay: i * 0.15,
                                  }
                            }
                            className="w-1.5 h-1.5 rounded-full bg-skywise-accentGlow inline-block"
                          />
                        ))}
                      </span>
                      <span className="truncate">Fetching live telemetry for {currentCity}...</span>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick prompts */}
              {messages.length <= 1 && !loading && (
                <motion.div
                  ref={promptsRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="px-3.5 sm:px-4 py-2 border-t border-skywise-border/60 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0"
                >
                  {[
                    { key: 'outfit', label: '👕 Outfit Advice' },
                    { key: 'outdoor', label: '🏃 Outdoor Workout' },
                    { key: 'rain', label: '☔ Umbrella Needed?' },
                  ].map((item) => (
                    <motion.button
                      key={item.key}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickPrompt(item.key)}
                      className="px-2.5 py-1.5 sm:py-1 rounded-full bg-skywise-bg hover:bg-skywise-cardHover border border-skywise-border hover:border-skywise-accentGlow/50 text-[10px] text-skywise-textMuted hover:text-skywise-textPrimary whitespace-nowrap transition-colors duration-200 cursor-pointer focus:outline-none"
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-skywise-bg border-t border-skywise-border shrink-0"
                style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
              >
                <div
                  className={`relative flex items-center rounded-xl transition-all duration-200 ${
                    isFocused ? 'ring-1 ring-skywise-accent' : ''
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={`Ask about ${currentCity}...`}
                    disabled={loading}
                    className="w-full bg-skywise-card border border-skywise-border rounded-xl pl-4 pr-11 py-3 sm:py-2.5 text-sm sm:text-xs text-skywise-textPrimary placeholder-skywise-textMuted focus:outline-none focus:border-skywise-accent transition-all duration-200 disabled:opacity-50"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={loading || !inputMessage.trim()}
                    className="absolute right-2 p-1.5 rounded-lg bg-skywise-accent hover:bg-skywise-accentGlow text-skywise-textPrimary disabled:opacity-40 transition-all duration-200 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}