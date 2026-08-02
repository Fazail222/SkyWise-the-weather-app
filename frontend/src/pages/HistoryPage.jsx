import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, Search, ArrowUpRight, Loader2 } from 'lucide-react';
import { fetchHistory, clearHistory } from '../redux/history/historyThunk';
import { fetchWeatherByCity } from '../redux/weather/weatherThunk';

export default function HistoryPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: historyItems, loading } = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const handleSelectCity = (cityName) => {
    dispatch(fetchWeatherByCity(cityName));
    navigate('/dashboard');
  };

  const handleClearAll = () => {
    dispatch(clearHistory());
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-skywise-textPrimary tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-skywise-accent" />
            Search History
          </h2>
          <p className="text-xs text-skywise-textMuted mt-1">
            Logs of your recent meteorological queries.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition"
          >
            <Trash2 className="w-4 h-4" />
            Clear Log
          </button>
        )}
      </div>

      {loading && historyItems.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-skywise-accent animate-spin" />
        </div>
      ) : historyItems.length === 0 ? (
        <div className="rounded-3xl bg-skywise-card/50 border border-skywise-border/70 p-12 text-center">
          <Search className="w-12 h-12 text-skywise-textMuted mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-skywise-textPrimary">No Search History</h3>
          <p className="text-xs text-skywise-textMuted mt-1">
            Your recent searches will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-skywise-card/80 border border-skywise-border/70 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="divide-y divide-skywise-border/50">
            {historyItems.map((item, index) => {
              const cityName = typeof item === 'string' ? item : item.city || item.query;
              const timestamp = item.createdAt ? new Date(item.createdAt).toLocaleString() : null;

              return (
                <div
                  key={item._id || index}
                  onClick={() => handleSelectCity(cityName)}
                  className="flex items-center justify-between p-4 sm:px-6 hover:bg-skywise-card/90 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-skywise-card border border-skywise-border/40 text-skywise-textMuted group-hover:text-skywise-accent transition">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-skywise-textPrimary group-hover:text-skywise-accent transition capitalize">
                        {cityName}
                      </p>
                      {timestamp && <p className="text-[10px] text-skywise-textMuted">{timestamp}</p>}
                    </div>
                  </div>

                  <span className="text-xs text-skywise-textMuted flex items-center gap-1 group-hover:text-skywise-textPrimary transition">
                    Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}