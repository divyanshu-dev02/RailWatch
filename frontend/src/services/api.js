import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API = axios.create({ baseURL: API_BASE_URL, timeout: 10000, headers: { 'Content-Type': 'application/json' } });

export const getCongestionByPnr = async (pnr) => (await API.get(`/api/pnr/${encodeURIComponent(pnr)}`)).data;
export const getStations = async () => (await API.get('/api/stations')).data;
export const getTrains = async () => (await API.get('/api/trains')).data;
export const getDashboard = async (date) => (await API.get('/api/dashboard', { params: { date } })).data;
export const getCongestionByStationAndDate = async (stationId, date) =>
  (await API.get(`/api/stations/${stationId}/congestion`, { params: { date } })).data;
export const getStationHistory = async (stationId, from, to) =>
  (await API.get(`/api/stations/${stationId}/history`, { params: { from, to } })).data;
export const getDemoTick = async () => (await API.post('/api/demo/tick')).data;
export const getStreamUrl = () => `${API_BASE_URL}/api/congestion/stream`;

export default API;
