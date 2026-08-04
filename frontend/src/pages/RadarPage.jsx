import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  Compass,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Loader2,
} from "lucide-react";
import {
  clearSelectedMarker,
  setPendingMarker,
} from "../redux/map/mapSlice";
import { selectLocationFromMap } from "../redux/map/mapThunk";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const pulseIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:22px;height:22px;">
      <div style="
          position:absolute;
          inset:0;
          border-radius:9999px;
          background:#0284c7;
          opacity:.35;
          animation:pulseRing 1.6s ease-out infinite;
      "></div>

      <div style="
          position:absolute;
          top:6px;
          left:6px;
          width:10px;
          height:10px;
          border-radius:9999px;
          background:#0284c7;
          box-shadow:0 0 0 3px rgba(2,132,199,.25);
      "></div>
    </div>

    <style>
      @keyframes pulseRing{
        0%{
          transform:scale(.6);
          opacity:.5;
        }
        100%{
          transform:scale(2.2);
          opacity:0;
        }
      }
    </style>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function MapClickHandler() {
  const dispatch = useDispatch();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      dispatch(
        setPendingMarker({
          lat,
          lng,
        })
      );

      dispatch(
        selectLocationFromMap({
          lat,
          lon: lng,
        })
      );
    },
  });

  return null;
}

function WeatherMarker({
  marker,
  loading,
  dispatch,
}) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!markerRef.current) return;

    setTimeout(() => {
      markerRef.current.openPopup();
    }, 120);
  }, [marker.lat, marker.lng, loading]);

  const isPopupLoading = loading || marker.city === null;

  return (
    <Marker
      ref={markerRef}
      position={[marker.lat, marker.lng]}
      icon={pulseIcon}
    >
      <Popup
        className="weather-popup"
        closeButton
        autoPan
        eventHandlers={{
          remove: () => dispatch(clearSelectedMarker()),
        }}
      >
        <div className="min-w-[210px] p-1">

          <div className="flex items-center gap-2 font-bold text-slate-800">
            <MapPin
              className="text-sky-500 shrink-0"
              size={16}
            />

            <span className="truncate">
              {isPopupLoading
                ? "Locating weather..."
                : marker.city}
            </span>
          </div>

          {isPopupLoading ? (
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
              Fetching current weather...
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mt-3">

               {marker.icon && (
  <img
    src={`https://openweathermap.org/img/wn/${marker.icon}@2x.png`}
    alt={marker.description || "weather icon"}
    className="w-10 h-10 -ml-1"
    onError={(e) => { e.target.style.display = 'none'; }}
  />
)}

                <div className="flex items-center gap-2">
                  <Thermometer
                    className="text-orange-500"
                    size={18}
                  />

                  <span className="text-2xl font-bold text-slate-800">
                    {marker.temp}°C
                  </span>
                </div>

              </div>

              {marker.description && (
                <p className="mt-2 text-xs capitalize text-slate-500">
                  {marker.description}

                  {marker.feelsLike !== undefined &&
                    ` • Feels like ${marker.feelsLike}°C`}
                </p>
              )}

              <div className="flex gap-4 mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">

                {marker.humidity !== undefined && (
                  <div className="flex items-center gap-1">
                    <Droplets
                      size={14}
                      className="text-sky-500"
                    />
                    {marker.humidity}%
                  </div>
                )}

                {marker.windSpeed !== undefined && (
                  <div className="flex items-center gap-1">
                    <Wind
                      size={14}
                      className="text-slate-400"
                    />
                    {marker.windSpeed} m/s
                  </div>
                )}

              </div>

            </>
          )}

        </div>
      </Popup>
    </Marker>
  );
}

export default function RadarPage() {
  const dispatch = useDispatch();

  const {
    center,
    zoom,
    loading,
    selectedMarker,
  } = useSelector((state) => state.map);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">

        <div>

          <h2 className="flex items-center gap-3 text-3xl md:text-4xl font-extrabold tracking-tight text-skywise-textPrimary">

            <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30">

              <Compass className="w-6 h-6 text-white" />

            </span>

            Interactive Weather Inspector

          </h2>

          <p className="mt-2 text-sm text-skywise-textMuted">
            Click anywhere on the map to inspect real-time weather.
          </p>

        </div>

        {loading && (
          <div className="flex items-center gap-2 rounded-full border border-skywise-border bg-skywise-card/80 px-4 py-2 backdrop-blur shadow-sm">

            <Loader2 className="w-4 h-4 animate-spin text-sky-500" />

            <span className="text-xs font-medium text-skywise-textPrimary">
              Fetching weather...
            </span>

          </div>
        )}

      </div>

      {/* Map */}
      <div className="relative h-[600px] overflow-hidden rounded-3xl border border-skywise-border shadow-2xl ring-1 ring-black/5 bg-white">

        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          style={containerStyle}
          zoomControl={true}
        >

          {/* Clean Light/White Tile Layer (CartoDB Voyager) */}
    <TileLayer
  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
  attribution="© OpenStreetMap contributors © CARTO"
/>
          <MapClickHandler />

          {selectedMarker && (
            <WeatherMarker
              marker={selectedMarker}
              loading={loading}
              dispatch={dispatch}
            />
          )}

        </MapContainer>

      </div>

    </div>
  );
}