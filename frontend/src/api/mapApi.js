export const mapApi = {
  /**
   * Generates custom weather tile proxy URL for Google Maps ImageMapType overlay
   * @param {string} layer - 'temp_new', 'precipitation_new', 'clouds_new', 'wind_new'
   * @param {number} z - Zoom level
   * @param {number} x - Tile X coordinate
   * @param {number} y - Tile Y coordinate
   */
  getTileUrl: (layer, z, x, y) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    return `${baseURL}/map/tiles/${layer}/${z}/${x}/${y}`;
  },
};