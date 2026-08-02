import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
  LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import {
  CloudSun, Wind, Droplets, Gauge, MapPin, RefreshCw, AlertCircle,
  Sparkles, TrendingUp, Sun, Eye, Compass, Star, Loader2, Sunrise, Sunset,
  ThermometerSun, CloudRain, Navigation, Search, X
} from 'lucide-react';

import { fetchWeatherByCity, fetchWeatherByCoords } from '../redux/weather/weatherThunk';
import { clearWeatherError } from '../redux/weather/weatherSlice';
import { addHistory } from '../redux/history/historyThunk';
import { fetchFavorites, addFavorite, removeFavorite } from '../redux/favorite/favoriteThunk';

// ---- Config -----------------------------------------------------------
const GEO_API_KEY =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_OPENWEATHER_API_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENWEATHER_API_KEY) ||
  '';

const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

const getAQIDetails = (aqi) => {
  switch (aqi) {
    case 1: return { label: 'Good', color: '#10B981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    case 2: return { label: 'Fair', color: '#3B82F6', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    case 3: return { label: 'Moderate', color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    case 4: return { label: 'Poor', color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    case 5: return { label: 'Very Poor', color: '#8B5CF6', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
    default: return { label: 'Unknown', color: '#6B7280', bg: 'bg-gray-500/10', border: 'border-gray-500/30' };
  }
};

const getUVDetails = (uvi) => {
  if (uvi == null) return { label: 'Unknown', color: '#6B7280' };
  if (uvi < 3) return { label: 'Low', color: '#10B981' };
  if (uvi < 6) return { label: 'Moderate', color: '#F59E0B' };
  if (uvi < 8) return { label: 'High', color: '#F97316' };
  if (uvi < 11) return { label: 'Very High', color: '#EF4444' };
  return { label: 'Extreme', color: '#8B5CF6' };
};

const formatTime = (timestamp) => {
  if (!timestamp) return '--:--';
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatSuggestionSubtitle = (item) => {
  const parts = [];
  if (item.state) parts.push(item.state);
  if (item.country) parts.push(item.country);
  return parts.join(', ');
};

const normalize = (str) =>
  (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const rankSuggestionsByQuery = (items, query) => {
  const q = normalize(query);
  if (!q) return items;

  const score = (item) => {
    const name = normalize(item.name);
    const inLocalNames = item.local_names
      ? Object.values(item.local_names).some((n) => normalize(n).startsWith(q))
      : false;
    if (name.startsWith(q) || inLocalNames) return 0;
    if (name.includes(q)) return 1;
    return 2;
  };

  return [...items].sort((a, b) => score(a) - score(b));
};

const HighlightMatch = ({ text, query }) => {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const nText = normalize(text);
  const nQuery = normalize(q);
  const idx = nText.indexOf(nQuery);

  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);

  return (
    <>
      {before}
      <span className="text-skywise-accent font-semibold">{match}</span>
      {after}
    </>
  );
};

export default function Dashboard() {
  const dispatch = useDispatch();

  const { weather, loading, error, activeCity } = useSelector((state) => state.weather);
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  const [searchCity, setSearchCity] = useState('');
  const [locating, setLocating] = useState(true);

  // --- Live suggestion state ---
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFavorites());
    if (!weather) {
      loadInitialLocation();
    } else {
      setLocating(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = searchCity.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setSuggestLoading(false);
      return;
    }

    setSuggestLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${GEO_URL}?q=${encodeURIComponent(query)}&limit=10&appid=${GEO_API_KEY}`
        );
        const data = await res.json();
        const ranked = rankSuggestionsByQuery(Array.isArray(data) ? data : [], query);
        setSuggestions(ranked);
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [searchCity]);

  const loadInitialLocation = () => {
    dispatch(clearWeatherError());
    setLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocating(false);
          dispatch(fetchWeatherByCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }));
        },
        () => {
          setLocating(false);
          dispatch(fetchWeatherByCity(activeCity || 'Gujranwala'));
        },
        { timeout: 6000, maximumAge: 60000 }
      );
    } else {
      setLocating(false);
      dispatch(fetchWeatherByCity(activeCity || 'Gujranwala'));
    }
  };

  const runSearch = (query) => {
    if (!query) return;
    dispatch(clearWeatherError());
    dispatch(fetchWeatherByCity(query));
    dispatch(addHistory(query));
    setSearchCity('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelectSuggestion(suggestions[activeIndex]);
      return;
    }
    runSearch(searchCity.trim());
  };

  const handleSelectSuggestion = useCallback((item) => {
    dispatch(clearWeatherError());
    dispatch(fetchWeatherByCoords({ lat: item.lat, lon: item.lon }));
    dispatch(addHistory(item.name));
    setSearchCity('');
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
  }, [dispatch]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const currentCityName = weather?.location?.city;
  const isFavorite = favoriteItems?.find(
    (fav) => fav.city?.toLowerCase() === currentCityName?.toLowerCase() || fav.name?.toLowerCase() === currentCityName?.toLowerCase()
  );

  const handleToggleFavorite = () => {
    if (!currentCityName) return;
    if (isFavorite) {
      dispatch(removeFavorite(isFavorite._id));
    } else {
      dispatch(addFavorite({
        city: currentCityName,
        country: weather?.location?.country,
        temp: weather?.current?.temp,
        condition: weather?.current?.condition
      }));
    }
  };

  const { location, current, airQuality, hourlyForecast = [], dailyForecast = [] } = weather || {};
  const aqiInfo = getAQIDetails(airQuality?.aqi);

  const airComponentsData = airQuality?.components ? [
    { name: 'PM2.5', value: airQuality.components.pm2_5 },
    { name: 'PM10', value: airQuality.components.pm10 },
    { name: 'NO2', value: airQuality.components.no2 },
    { name: 'O3', value: airQuality.components.o3 },
    { name: 'SO2', value: airQuality.components.so2 },
    { name: 'CO', value: Math.round(airQuality.components.co / 100) },
  ] : [];

  const sunProgress = (() => {
    if (!current?.sunrise || !current?.sunset) return 0;
    const now = Date.now() / 1000;
    if (now <= current.sunrise) return 0;
    if (now >= current.sunset) return 1;
    return (now - current.sunrise) / (current.sunset - current.sunrise);
  })();

  const dayLengthMinutes = current?.sunrise && current?.sunset
    ? Math.round((current.sunset - current.sunrise) / 60)
    : null;

  const hasHumidityPressureTrend = hourlyForecast.some(
    (h) => h.humidity != null || h.pressure != null
  );
  const hasWindSpeedTrend = hourlyForecast.some((h) => h.windSpeed != null);
  const hasVisibilityTrend = hourlyForecast.some((h) => h.visibility != null);

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-8 sm:pb-12 px-3 sm:px-6">

      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-skywise-textPrimary tracking-tight">
            Weather Overview
          </h2>
          <p className="text-[11px] sm:text-xs text-skywise-textMuted mt-0.5">
            Real-time telemetry and predictive atmospheric analytics.
          </p>
        </div>

        <div ref={searchWrapRef} className="relative w-full sm:w-80">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-skywise-textMuted pointer-events-none" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search location (e.g. Lahore, Tokyo)..."
              autoComplete="off"
              className="w-full pl-9 pr-16 py-3 sm:py-2.5 rounded-xl bg-skywise-card/80 border border-skywise-border/80 text-sm sm:text-xs text-skywise-textPrimary placeholder:text-skywise-textMuted focus:outline-none focus:border-skywise-accent transition shadow-inner backdrop-blur-md"
            />
            {searchCity && (
              <button
                type="button"
                onClick={() => { setSearchCity(''); setSuggestions([]); setShowSuggestions(false); }}
                className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-skywise-textMuted hover:text-skywise-textPrimary transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-skywise-textMuted hover:text-skywise-accent transition"
            >
              {(loading || suggestLoading) ? <Loader2 className="w-4 h-4 text-skywise-accent animate-spin" /> : <Sparkles className="w-4 h-4 text-skywise-accent" />}
            </button>
          </form>

          {/* LIVE SUGGESTIONS DROPDOWN */}
          {showSuggestions && searchCity.trim().length >= 2 && (
            <div className="absolute z-50 mt-2 w-full rounded-2xl bg-skywise-card border border-skywise-border/80 shadow-2xl backdrop-blur-xl overflow-hidden">
              {suggestLoading && suggestions.length === 0 ? (
                <div className="px-4 py-4 text-xs text-skywise-textMuted flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-skywise-accent" /> Searching...
                </div>
              ) : suggestions.length === 0 ? (
                <div className="px-4 py-4 text-xs text-skywise-textMuted">
                  {GEO_API_KEY ? 'No matching locations found.' : 'Missing OpenWeatherMap API key for suggestions.'}
                </div>
              ) : (
                <ul className="max-h-64 sm:max-h-80 overflow-y-auto custom-scrollbar py-1">
                  {suggestions.map((item, idx) => (
                    <li key={`${item.lat}-${item.lon}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-3 sm:py-2.5 text-left transition ${
                          activeIndex === idx ? 'bg-skywise-accent/10' : 'hover:bg-skywise-cardHover'
                        }`}
                      >
                        <MapPin className={`w-4 h-4 shrink-0 ${activeIndex === idx ? 'text-skywise-accent' : 'text-skywise-textMuted'}`} />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-skywise-textPrimary truncate">
                            <HighlightMatch text={item.name} query={searchCity} />
                          </div>
                          <div className="text-[10px] text-skywise-textMuted truncate">
                            {formatSuggestionSubtitle(item)}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="p-3 sm:p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center justify-between gap-3">
          <span className="min-w-0">{typeof error === 'string' ? error : error?.message || 'Error updating weather data.'}</span>
          <button onClick={() => dispatch(clearWeatherError())} className="underline font-bold hover:opacity-80 shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* SKELETON / LOADING overlay for initial load or active search */}
      {(locating || loading) ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 animate-pulse">
          <div className="lg:col-span-7 h-64 sm:h-80 rounded-3xl bg-skywise-card/60 border border-skywise-border/50 p-4 sm:p-6" />
          <div className="lg:col-span-5 h-64 sm:h-80 rounded-3xl bg-skywise-card/60 border border-skywise-border/50 p-4 sm:p-6" />
          <div className="lg:col-span-12 h-52 sm:h-64 rounded-3xl bg-skywise-card/60 border border-skywise-border/50 p-4 sm:p-6" />
        </div>
      ) : !weather || !weather.current ? (
        <div className="w-full h-full flex flex-col items-center justify-center min-h-[340px] sm:min-h-[450px] text-center p-4 sm:p-6">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-skywise-textMuted mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-skywise-textPrimary">No Weather Data</h3>
          <p className="text-xs text-skywise-textMuted max-w-sm mb-4">We couldn't load weather data right now.</p>
          <button
            onClick={loadInitialLocation}
            className="px-5 py-2.5 rounded-xl bg-skywise-accent text-white text-xs font-semibold hover:opacity-90 transition shadow-lg active:scale-95"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* TOP CARDS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

            {/* CURRENT WEATHER CARD */}
            <div className="lg:col-span-7 rounded-3xl bg-skywise-card/80 border border-skywise-border/70 p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 sm:-mt-12 sm:-mr-12 w-40 h-40 sm:w-56 sm:h-56 bg-skywise-accent/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-start justify-between gap-3 relative z-10">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-skywise-textPrimary mb-1 min-w-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-skywise-accent shrink-0" />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate">
                      {location?.city}{location?.country ? `, ${location.country}` : ''}
                    </h3>

                    {/* FAVORITE TOGGLE BUTTON */}
                    <button
                      onClick={handleToggleFavorite}
                      className="ml-1 sm:ml-2 p-1.5 rounded-full bg-skywise-card/90 border border-skywise-border hover:border-amber-400/50 transition group active:scale-90 shrink-0"
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-400 fill-amber-400' : 'text-skywise-textMuted group-hover:text-amber-400'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-skywise-textMuted capitalize pl-6 sm:pl-7">
                    {current?.description}
                  </p>
                </div>

                {current?.icon && (
                  <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-skywise-card/90 border border-skywise-border/70 text-[11px] sm:text-xs font-semibold text-skywise-textPrimary shadow-sm shrink-0">
                    <img
                      src={`https://openweathermap.org/img/wn/${current.icon}.png`}
                      alt={current?.condition}
                      className="w-6 h-6 sm:w-7 sm:h-7"
                    />
                    <span>{current?.condition}</span>
                  </div>
                )}
              </div>

              <div className="my-6 sm:my-8 flex items-baseline justify-between relative z-10">
                <div>
                  <span className="text-5xl sm:text-6xl md:text-7xl font-black text-skywise-textPrimary tracking-tight">
                    {current?.temp}°
                  </span>
                  <span className="text-xl sm:text-2xl text-skywise-textMuted font-light">C</span>
                  <div className="text-[11px] sm:text-xs text-skywise-textMuted mt-2">
                    Feels like <strong className="text-skywise-textPrimary">{current?.feelsLike}°C</strong> • High {current?.tempMax}° / Low {current?.tempMin}°
                  </div>
                </div>

                <CloudSun className="w-16 h-16 sm:w-24 sm:h-24 text-skywise-accent/80 filter drop-shadow-[0_0_25px_rgba(37,99,235,0.3)] shrink-0" />
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-skywise-border/70 text-xs relative z-10">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded-xl bg-skywise-card/90 border border-skywise-border/70 text-skywise-accent shrink-0">
                    <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-skywise-textMuted text-[9px] sm:text-[10px]">Wind</span>
                    <span className="font-semibold text-skywise-textPrimary text-[11px] sm:text-xs truncate block">{current?.windSpeed} m/s</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded-xl bg-skywise-card/90 border border-skywise-border/70 text-teal-500 shrink-0">
                    <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-skywise-textMuted text-[9px] sm:text-[10px]">Humidity</span>
                    <span className="font-semibold text-skywise-textPrimary text-[11px] sm:text-xs truncate block">{current?.humidity}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded-xl bg-skywise-card/90 border border-skywise-border/70 text-indigo-500 shrink-0">
                    <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-skywise-textMuted text-[9px] sm:text-[10px]">Pressure</span>
                    <span className="font-semibold text-skywise-textPrimary text-[11px] sm:text-xs truncate block">{current?.pressure} hPa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AIR QUALITY CARD */}
            <div className="lg:col-span-5 rounded-3xl bg-skywise-card/80 border border-skywise-border/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-skywise-accent" />
                  <h4 className="text-sm font-bold text-skywise-textPrimary">Air Quality Index</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${aqiInfo.bg} ${aqiInfo.border}`} style={{ color: aqiInfo.color }}>
                  AQI {airQuality?.aqi} — {aqiInfo.label}
                </span>
              </div>

              {/* Bar Chart */}
              <div className="h-36 sm:h-40 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={airComponentsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '11px', color: 'var(--text-primary)' }}
                      itemStyle={{ color: 'var(--accent)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {airComponentsData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? aqiInfo.color : 'var(--border)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-[10px] sm:text-[11px] text-skywise-textMuted border-t border-skywise-border/70 pt-3 mt-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Eye className="w-3.5 h-3.5 text-skywise-textMuted shrink-0" />
                  <span className="truncate">Visibility: <strong className="text-skywise-textPrimary">{current?.visibility} km</strong></span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Compass className="w-3.5 h-3.5 text-skywise-textMuted shrink-0" />
                  <span className="truncate">Wind Deg: <strong className="text-skywise-textPrimary">{current?.windDeg}°</strong></span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Sunrise: <strong className="text-skywise-textPrimary">{formatTime(current?.sunrise)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Sun className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">Sunset: <strong className="text-skywise-textPrimary">{formatTime(current?.sunset)}</strong></span>
                </div>
              </div>
            </div>

          </div>

          {/* SUN ARC + WIND COMPASS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 sm:gap-6">

            {/* SUNRISE / SUNSET ARC */}
            <div className="lg:col-span-5 rounded-3xl bg-skywise-card/80 border border-skywise-border/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-skywise-textPrimary">Sun Path</h4>
              </div>

              <div className="relative w-full h-28 sm:h-32">
                <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                  <path d="M 10 90 A 90 90 0 0 1 190 90" fill="none" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
                  <path
                    d="M 10 90 A 90 90 0 0 1 190 90"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="282.7"
                    strokeDashoffset={282.7 * (1 - sunProgress)}
                  />
                  {(() => {
                    const angle = Math.PI * (1 - sunProgress);
                    const cx = 100 + 90 * Math.cos(angle);
                    const cy = 90 - 90 * Math.sin(angle);
                    return <circle cx={cx} cy={cy} r="7" fill="#FBBF24" stroke="var(--card)" strokeWidth="2" />;
                  })()}
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-4 gap-y-1.5 text-[11px] mt-1">
                <div className="flex items-center gap-1.5">
                  <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-skywise-textMuted">Sunrise <strong className="text-skywise-textPrimary">{formatTime(current?.sunrise)}</strong></span>
                </div>
                {dayLengthMinutes != null && (
                  <span className="text-skywise-textMuted order-3 sm:order-none w-full sm:w-auto text-center">
                    Daylight: <strong className="text-skywise-textPrimary">{Math.floor(dayLengthMinutes / 60)}h {dayLengthMinutes % 60}m</strong>
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <Sunset className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-skywise-textMuted">Sunset <strong className="text-skywise-textPrimary">{formatTime(current?.sunset)}</strong></span>
                </div>
              </div>
            </div>

            {/* WIND COMPASS */}
            <div className="lg:col-span-3 rounded-3xl bg-skywise-card/80 border border-skywise-border/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4 self-start">
                <Navigation className="w-4 h-4 text-skywise-accent" />
                <h4 className="text-sm font-bold text-skywise-textPrimary">Wind Direction</h4>
              </div>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                <div className="absolute inset-0 rounded-full border border-skywise-border" />
                <div className="absolute inset-3 rounded-full border border-skywise-border/60" />
                {['N', 'E', 'S', 'W'].map((dir, i) => (
                  <span
                    key={dir}
                    className="absolute text-[9px] text-skywise-textMuted font-semibold"
                    style={{
                      top: i === 0 ? '2px' : i === 2 ? 'auto' : '50%',
                      bottom: i === 2 ? '2px' : 'auto',
                      left: i === 3 ? '4px' : i === 1 ? 'auto' : '50%',
                      right: i === 1 ? '4px' : 'auto',
                      transform: (i === 0 || i === 2) ? 'translateX(-50%)' : 'translateY(-50%)',
                    }}
                  >
                    {dir}
                  </span>
                ))}
                <div
                  className="absolute top-1/2 left-1/2 w-0.5 h-8 sm:h-10 bg-skywise-accent origin-bottom rounded-full"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${current?.windDeg || 0}deg)`,
                    boxShadow: '0 0 8px rgba(37,99,235,0.6)'
                  }}
                />
                <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-skywise-accent" />
              </div>
              <div className="text-center mt-3">
                <span className="block text-base sm:text-lg font-bold text-skywise-textPrimary">{current?.windSpeed} <span className="text-xs text-skywise-textMuted font-normal">m/s</span></span>
                <span className="text-[10px] text-skywise-textMuted">{current?.windDeg}° heading</span>
              </div>
            </div>

          </div>

          {/* HOURLY FORECAST CHART */}
          <div className="rounded-3xl bg-skywise-card/80 border border-skywise-border/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-skywise-accent" />
                <h4 className="text-sm font-bold text-skywise-textPrimary">24-Hour Forecast Trend</h4>
              </div>
              <span className="text-[10px] sm:text-[11px] text-skywise-textMuted">°C vs Rain Chance (%)</span>
            </div>

            <div className="h-52 sm:h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--ai-glow)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--ai-glow)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(8px)',
                      fontSize: '12px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Area type="monotone" dataKey="temp" name="Temp (°C)" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
                  <Area type="monotone" dataKey="pop" name="Precipitation (%)" stroke="var(--ai-glow)" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#popGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        {/* WIND SPEED + VISIBILITY TREND ROW */}
          {(hasWindSpeedTrend || hasVisibilityTrend) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

              {/* WIND SPEED TREND */}
              {hasWindSpeedTrend && (
                <div className="rounded-3xl bg-skywise-card/80 border border-skywise-border/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-skywise-accent" />
                      <h4 className="text-sm font-bold text-skywise-textPrimary">Wind Speed Trend</h4>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-skywise-textMuted">m/s</span>
                  </div>
                  <div className="h-44 sm:h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            borderRadius: '16px',
                            fontSize: '12px',
                            color: 'var(--text-primary)'
                          }}
                          formatter={(value) => [`${value} m/s`, 'Wind Speed']}
                        />
                        <Area type="monotone" dataKey="windSpeed" name="Wind Speed (m/s)" stroke="var(--accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#windGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* VISIBILITY TREND */}
              {hasVisibilityTrend && (
                <div className="rounded-3xl bg-skywise-card/80 border border-skywise-border/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-bold text-skywise-textPrimary">Visibility Trend</h4>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-skywise-textMuted">km</span>
                  </div>
                  <div className="h-44 sm:h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 10]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            borderRadius: '16px',
                            fontSize: '12px',
                            color: 'var(--text-primary)'
                          }}
                          formatter={(value) => [`${value} km`, 'Visibility']}
                        />
                        <Area type="monotone" dataKey="visibility" name="Visibility (km)" stroke="#A78BFA" strokeWidth={2.5} fillOpacity={1} fill="url(#visGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* EXTENDED DAILY FORECAST */}
          <div className="rounded-3xl bg-skywise-card/80 border border-skywise-border/70 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h4 className="text-sm font-bold text-skywise-textPrimary">
                7-Day Forecast
              </h4>

              <span className="text-[11px] sm:text-xs text-skywise-textMuted">
                Next {dailyForecast.length} Days
              </span>
            </div>

            <div className="overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory -mx-1 px-1">
              <div className="flex gap-3 sm:gap-4 min-w-max">
                {dailyForecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="w-28 sm:w-40 h-52 sm:h-60 flex-shrink-0 snap-start rounded-2xl bg-skywise-card/40 border border-skywise-border/50 hover:border-skywise-accent/50 hover:bg-skywise-card/90 transition-all duration-300 p-3 sm:p-5 flex flex-col items-center justify-between"
                  >
                    {/* Day */}
                    <div className="text-center">
                      <h5 className="text-xs sm:text-sm font-semibold text-skywise-textPrimary">
                        {day.dayName}
                      </h5>

                      <p className="text-[10px] sm:text-[11px] text-skywise-textMuted mt-1">
                        {day.date}
                      </p>
                    </div>

                    {/* Weather Icon */}
                    <div className="flex justify-center">
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        alt={day.condition}
                        className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-md"
                      />
                    </div>

                    {/* Temperature */}
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-skywise-textPrimary">
                        {day.tempMax}°
                      </div>

                      <div className="text-xs sm:text-sm text-skywise-textMuted">
                        {day.tempMin}°
                      </div>
                    </div>

                    {/* Condition */}
                    <span className="px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-medium bg-skywise-accent/10 text-skywise-accent border border-skywise-accent/20 text-center truncate max-w-full">
                      {day.condition}
                    </span>

                    {/* Rain Probability */}
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs text-skywise-accent">
                      <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{day.pop ?? 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
