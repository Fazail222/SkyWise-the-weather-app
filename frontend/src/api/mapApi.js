import axios from "./axios";

export const mapApi = {
  getWeatherByCoords(lat, lon) {
    return axios.get("/weather/coords", {
      params: {
        lat,
        lon,
      },
    });
  },
};