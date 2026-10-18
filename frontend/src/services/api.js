import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API = axios.create({ baseURL: API_BASE_URL, timeout: 10000, headers: { Accept: 'application/json' } });

export const getCongestionByPnr = async (pnr, options = {}) =>
  (await API.get(`/api/pnr/${encodeURIComponent(pnr)}`, options)).data;
export const getStations = async (options = {}) => (await API.get('/api/stations', options)).data;
export const getTrains = async () => (await API.get('/api/trains')).data;
export const getDashboard = async (date, options = {}) =>
  (await API.get('/api/dashboard', { ...options, params: { date } })).data;
export const getCongestionByStationAndDate = async (stationId, date) =>
  (await API.get(`/api/stations/${stationId}/congestion`, { params: { date } })).data;
export const getStationHistory = async (stationId, from, to) =>
  (await API.get(`/api/stations/${stationId}/history`, { params: { from, to } })).data;
export const getDemoTick = async () => (await API.post('/api/demo/tick')).data;
export const getStreamUrl = () => `${API_BASE_URL}/api/congestion/stream`;
export const getApiErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;

export default API;
