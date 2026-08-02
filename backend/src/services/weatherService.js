import axios from 'axios';
import ApiError from '../utils/ApiError.js';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const MS_IN_DAY = 1000 * 60 * 60 * 24;
const TARGET_FUTURE_DAYS = 6; // how many days AFTER today to return

const getDayName = (date, diffDays) => {
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Helper to pick the dominant weather condition of a day
 */
const getMostFrequentCondition = (arr) => {
  return arr
    .sort((a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length)
    .pop();
};

/**
 * Group 3-hour interval forecasts into daily summaries, EXCLUDING today,
 * and always return exactly TARGET_FUTURE_DAYS days.
 *
 * OpenWeatherMap's free /forecast endpoint only covers ~5 days of 3-hour
 * data, which (depending on the time of day the request is made) often
 * isn't enough to produce 6 full days *after* today. When real data runs
 * short, the missing day(s) are extrapolated from the trend of the most
 * recent real days rather than left out — each such day is flagged with
 * `estimated: true` so the frontend can optionally indicate it's a
 * projection rather than direct forecast data.
 */
const groupForecastByDay = (forecastList, targetDays = TARGET_FUTURE_DAYS) => {
  const dailyMap = {};

  forecastList.forEach((item) => {
    const dateKey = item.dt_txt.split(' ')[0];

    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = {
        date: dateKey,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        conditions: [],
        popMax: item.pop || 0,
        icon: item.weather[0].icon,
      };
    }

    dailyMap[dateKey].tempMin = Math.min(dailyMap[dateKey].tempMin, item.main.temp_min);
    dailyMap[dateKey].tempMax = Math.max(dailyMap[dateKey].tempMax, item.main.temp_max);
    dailyMap[dateKey].popMax = Math.max(dailyMap[dateKey].popMax, item.pop || 0);
    dailyMap[dateKey].conditions.push(item.weather[0].main);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Only future days (diffDays > 0 excludes today), sorted chronologically
  const futureDays = Object.values(dailyMap)
    .map((day) => {
      const currentDate = new Date(`${day.date}T00:00:00`);
      const diffDays = Math.round((currentDate - today) / MS_IN_DAY);
      return { ...day, currentDate, diffDays };
    })
    .filter((day) => day.diffDays > 0)
    .sort((a, b) => a.diffDays - b.diffDays);

  const realDays = futureDays.slice(0, targetDays).map((day) => ({
    date: day.date,
    dayName: getDayName(day.currentDate, day.diffDays),
    tempMin: Math.round(day.tempMin),
    tempMax: Math.round(day.tempMax),
    pop: Math.round(day.popMax * 100),
    condition: getMostFrequentCondition(day.conditions),
    icon: day.icon,
    estimated: false,
  }));

  const missing = targetDays - realDays.length;
  if (missing > 0 && realDays.length > 0) {
    const lastReal = realDays[realDays.length - 1];
    const prevReal = realDays[realDays.length - 2] || lastReal;
    const lastRealDate = new Date(`${lastReal.date}T00:00:00`);

    // Dampened trend (40%) so projected days don't run away from reality
    const tempMinTrend = (lastReal.tempMin - prevReal.tempMin) * 0.4;
    const tempMaxTrend = (lastReal.tempMax - prevReal.tempMax) * 0.4;

    for (let i = 1; i <= missing; i++) {
      const projectedDate = new Date(lastRealDate.getTime() + i * MS_IN_DAY);
      const diffDays = Math.round((projectedDate - today) / MS_IN_DAY);

      realDays.push({
        date: projectedDate.toISOString().split('T')[0],
        dayName: getDayName(projectedDate, diffDays),
        tempMin: Math.round(lastReal.tempMin + tempMinTrend * i),
        tempMax: Math.round(lastReal.tempMax + tempMaxTrend * i),
        pop: lastReal.pop,
        condition: lastReal.condition,
        icon: lastReal.icon,
        estimated: true,
      });
    }
  }

  return realDays;
};

/**
 * Clean & standard output payload builder
 */
const formatWeatherData = (current, airQuality, forecastList) => {
  return {
    location: {
      city: current.name,
      country: current.sys.country,
      coordinates: current.coord,
    },
    current: {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      tempMin: Math.round(current.main.temp_min),
      tempMax: Math.round(current.main.temp_max),
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      visibility: (current.visibility / 1000).toFixed(1),
      windSpeed: current.wind.speed,
      windDeg: current.wind.deg,
      condition: current.weather[0].main,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
    },
    airQuality: {
      aqi: airQuality.main.aqi, // 1 = Good, 5 = Very Poor
      components: airQuality.components,
    },
    hourlyForecast: forecastList.slice(0, 8).map((item) => ({
      dt: item.dt,
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
      }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
      pop: Math.round((item.pop || 0) * 100),
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      windSpeed: item.wind?.speed ?? null,
      windDeg: item.wind?.deg ?? null,
      visibility: item.visibility != null ? Number((item.visibility / 1000).toFixed(1)) : null,
    })),
    dailyForecast: groupForecastByDay(forecastList),
  };
};

/**
 * Fetch Weather by City Name
 */
export const fetchWeatherByCity = async (city) => {
  const apiKey = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;

  try {
    const currentRes = await axios.get(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    const { lat, lon } = currentRes.data.coord;

    const [airQualityRes, forecastRes] = await Promise.all([
      axios.get(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`),
      axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
    ]);

    return formatWeatherData(currentRes.data, airQualityRes.data.list[0], forecastRes.data.list);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new ApiError(404, `City '${city}' not found.`);
    }
    throw new ApiError(500, error.response?.data?.message || 'Error fetching weather data.');
  }
};

/**
 * Fetch Weather by Lat/Lon Coordinates
 */
export const fetchWeatherByCoords = async (lat, lon) => {
  const apiKey = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;

  try {
    const [currentRes, airQualityRes, forecastRes] = await Promise.all([
      axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
      axios.get(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`),
      axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
    ]);

    return formatWeatherData(currentRes.data, airQualityRes.data.list[0], forecastRes.data.list);
  } catch (error) {
    throw new ApiError(500, error.response?.data?.message || 'Error fetching weather data by coordinates.');
  }
};
