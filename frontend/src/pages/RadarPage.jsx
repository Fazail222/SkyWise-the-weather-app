import React, { useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { CloudRain, Thermometer, Cloud, Wind, Layers, Sliders, MapPin, Loader2 } from 'lucide-react';

import { mapApi } from '../api/mapApi'; // Uses mapApi.getTileUrl
import { 
  setActiveLayer, 
  setLayerOpacity, 
  clearSelectedMarker 
} from '../redux/map/mapSlice';
import { selectLocationFromMap } from '../redux/map/mapThunk';

// Dark map styling matching your theme
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0F172A' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F172A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#CBD5E1' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748B' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1E293B' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0284C7' }],
  },
];

const LAYERS = [
  { id: 'precipitation_new', label: 'Precipitation', icon: CloudRain, color: 'text-skywise-accent' },
  { id: 'temp_new', label: 'Temperature', icon: Thermometer, color: 'text-amber-400' },
  { id: 'clouds_new', label: 'Clouds', icon: Cloud, color: 'text-indigo-400' },
  { id: 'wind_new', label: 'Wind', icon: Wind, color: 'text-emerald-400' },
];

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem',
};

export default function RadarPage() {
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  const { center, zoom, activeLayer, layerOpacity, selectedMarker, loading } = useSelector((state) => state.map);

  // Load Google Maps API Key from Vite env variables
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Handler for custom tile overlay attachment
  const updateMapTileOverlay = useCallback(
    (mapInstance) => {
      if (!mapInstance || !window.google) return;

      // Clear existing overlay index 0
      mapInstance.overlayMapTypes.setAt(0, null);

      // Construct Google Maps ImageMapType using tile proxy
      const tileOverlay = new window.google.maps.ImageMapType({
        getTileUrl: (coord, zoomLevel) => {
          return mapApi.getTileUrl(activeLayer, zoomLevel, coord.x, coord.y);
        },
        tileSize: new window.google.maps.Size(256, 256),
        opacity: layerOpacity,
        name: activeLayer,
      });

      mapInstance.overlayMapTypes.setAt(0, tileOverlay);
    },
    [activeLayer, layerOpacity]
  );

  const onLoad = useCallback(
    (map) => {
      mapRef.current = map;
      updateMapTileOverlay(map);
    },
    [updateMapTileOverlay]
  );

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Update overlay whenever layer or opacity changes in Redux
  useEffect(() => {
    if (mapRef.current) {
      updateMapTileOverlay(mapRef.current);
    }
  }, [activeLayer, layerOpacity, updateMapTileOverlay]);

  // Click handler to select coordinates and query weather data
  const handleMapClick = (e) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lon = e.latLng.lng();
    dispatch(selectLocationFromMap({ lat, lon }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12 px-4 sm:px-6">
      {/* HEADER & CONTROLS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-skywise-textPrimary tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-skywise-accent" />
            Interactive Weather Radar
          </h2>
          <p className="text-xs text-skywise-textMuted mt-1">
            Real-time radar overlay telemetry powered by OpenWeather & Google Maps.
          </p>
        </div>

        {/* LAYER TOGGLES */}
        <div className="flex flex-wrap items-center gap-2 bg-skywise-card/80 border border-skywise-border/70 p-1.5 rounded-2xl backdrop-blur-xl">
          {LAYERS.map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => dispatch(setActiveLayer(layer.id))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-skywise-accent/20 border border-skywise-accent/40 text-skywise-textPrimary shadow-lg'
                    : 'text-skywise-textMuted hover:text-skywise-textPrimary hover:bg-skywise-card/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAP CANVAS CONTAINER */}
      <div className="relative w-full h-[600px] rounded-3xl border border-skywise-border/70 overflow-hidden shadow-2xl bg-skywise-card">
        
        {/* OPACITY SLIDER OVERLAY */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-skywise-card/90 border border-skywise-border/80 backdrop-blur-xl shadow-xl">
          <Sliders className="w-4 h-4 text-skywise-accent" />
          <span className="text-xs text-skywise-textPrimary font-semibold hidden sm:inline">Opacity</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={layerOpacity}
            onChange={(e) => dispatch(setLayerOpacity(parseFloat(e.target.value)))}
            className="w-24 accent-skywise-accent cursor-pointer"
          />
          <span className="text-[11px] text-skywise-textMuted w-8 font-mono">
            {Math.round(layerOpacity * 100)}%
          </span>
        </div>

        {/* MAP SEARCH INDICATOR */}
        {loading && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-2xl bg-skywise-card/90 border border-skywise-border text-skywise-accent text-xs backdrop-blur-xl shadow-xl">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Fetching Telemetry...</span>
          </div>
        )}

        {/* GOOGLE MAP CANVAS */}
        {!isLoaded ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-skywise-textMuted">
            <Loader2 className="w-8 h-8 animate-spin text-skywise-accent mb-2" />
            <span className="text-xs">Initializing Maps Engine...</span>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {/* SELECTED MARKER & INFO WINDOW */}
            {selectedMarker && (
              <>
                <MarkerF
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onClick={() => {}}
                />
                <InfoWindowF
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onCloseClick={() => dispatch(clearSelectedMarker())}
                >
                  <div className="p-2 text-slate-900 min-w-[140px]">
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <MapPin className="w-4 h-4 text-sky-600" />
                      <span>{selectedMarker.city}</span>
                    </div>
                    {selectedMarker.temp !== undefined && (
                      <div className="text-lg font-black mt-1 text-slate-800">
                        {selectedMarker.temp}°C
                      </div>
                    )}
                  </div>
                </InfoWindowF>
              </>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}