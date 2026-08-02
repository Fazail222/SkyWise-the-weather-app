import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake } from 'lucide-react';

export default function DualCityTicker() {
  // Sample data split into two sets for visual variety
  const citiesRow1 = [
    { name: 'Lahore', temp: '27°C', condition: 'Partly Cloudy', icon: Cloud },
    { name: 'Tokyo', temp: '19°C', condition: 'Rain', icon: CloudRain },
    { name: 'London', temp: '14°C', condition: 'Cloudy', icon: Cloud },
    { name: 'New York', temp: '22°C', condition: 'Sunny', icon: Sun },
  ];

  const citiesRow2 = [
    { name: 'Dubai', temp: '36°C', condition: 'Sunny', icon: Sun },
    { name: 'Paris', temp: '17°C', condition: 'Thunderstorm', icon: CloudLightning },
    { name: 'Sydney', temp: '20°C', condition: 'Clear', icon: Sun },
    { name: 'Toronto', temp: '11°C', condition: 'Snow', icon: Snowflake },
  ];

  // Duplicating the lists ensures a seamless infinite loop
  const tickerItemsRow1 = [...citiesRow1, ...citiesRow1, ...citiesRow1, ...citiesRow1];
  const tickerItemsRow2 = [...citiesRow2, ...citiesRow2, ...citiesRow2, ...citiesRow2];

  const TickerItem = ({ item }) => {
    const IconComponent = item.icon;
    return (
      <div className="flex items-center gap-3 px-6 border-r border-[#1A253B]/40 shrink-0 text-xs md:text-sm font-medium">
        <span className="text-white font-semibold tracking-wide">
          {item.name}
        </span>
        <IconComponent className="w-4 h-4 text-[#3B82F6]" />
        <span className="text-white font-bold">
          {item.temp}
        </span>
        <span className="text-[#94A3B8] text-[11px] hidden sm:inline">
          {item.condition}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#0C1322]/80 border-y border-[#1A253B]/80 py-3 overflow-hidden backdrop-blur-md relative select-none flex flex-col gap-3">
      {/* Gradient Edge Overlays */}
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#060B13] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#060B13] to-transparent z-10 pointer-events-none" />

      {/* Row 1: Leftward Scroll */}
      <div className="flex w-max animate-ticker-left hover:[animation-play-state:paused]">
        {tickerItemsRow1.map((item, idx) => (
          <TickerItem key={`row1-${idx}`} item={item} />
        ))}
      </div>

      {/* Row 2: Rightward Scroll */}
      <div className="flex w-max animate-ticker-right hover:[animation-play-state:paused]">
        {tickerItemsRow2.map((item, idx) => (
          <TickerItem key={`row2-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
}