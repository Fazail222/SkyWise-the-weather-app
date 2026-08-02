import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { fetchFavorites, removeFavorite } from '../redux/favorite/favoriteThunk';
import { fetchWeatherByCity } from '../redux/weather/weatherThunk';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: favorites, loading, error } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleSelectCity = (cityName) => {
    dispatch(fetchWeatherByCity(cityName));
    navigate('/dashboard');
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    dispatch(removeFavorite(id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-skywise-textPrimary tracking-tight flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Star className="w-6 h-6 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
            </div>
            Favorite Locations
          </h2>
          <p className="text-xs text-skywise-textMuted mt-1">
            Quick access to your saved operational locations.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {loading && favorites.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-skywise-accent animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          {error}
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-3xl bg-skywise-card/50 border border-skywise-border/70 p-12 text-center">
          <Star className="w-12 h-12 text-skywise-textMuted mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-skywise-textPrimary">No Favorites Saved</h3>
          <p className="text-xs text-skywise-textMuted mt-1 max-w-sm mx-auto">
            Click the star icon next to any city on the dashboard to save it to your favorites.
          </p>
        </div>
      ) : (
        /* GRID LAYOUT FOR CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => {
            const cityName = fav.city || fav.name;
            return (
              <div
                key={fav._id}
                onClick={() => handleSelectCity(cityName)}
                className="group relative rounded-2xl bg-skywise-card/80 border border-skywise-border/70 p-5 hover:border-skywise-accent/50 hover:bg-skywise-card transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl backdrop-blur-xl"
              >
                {/* CARD HEADER */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-skywise-textPrimary font-bold text-lg min-w-0">
                    <MapPin className="w-4 h-4 text-skywise-accent shrink-0" />
                    <span className="truncate capitalize">{cityName}</span>
                    {fav.country && (
                      <span className="text-xs font-normal text-skywise-textMuted shrink-0">
                        ({fav.country})
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => handleRemove(e, fav._id)}
                    className="p-1.5 rounded-lg text-skywise-textMuted hover:text-red-400 hover:bg-red-500/10 transition shrink-0"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* CARD FOOTER */}
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    {fav.temp !== undefined && (
                      <p className="text-3xl font-black text-skywise-textPrimary tracking-tight">
                        {fav.temp}°C
                      </p>
                    )}
                    {fav.condition && (
                      <p className="text-xs font-medium text-skywise-textMuted capitalize mt-0.5">
                        {fav.condition}
                      </p>
                    )}
                  </div>
                  
                  <span className="text-xs text-skywise-accent flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}