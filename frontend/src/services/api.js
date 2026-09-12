import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8084';

const API = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch congestion data by PNR
export const getCongestionByPnr = async (pnr) => {
  const response = await API.get(`/pnr/${pnr}`);
  return response.data;
};

// Fetch all 10 stations
export const getStations = async () => {
  const response = await API.get('/stations');
  return response.data;
};

// Fetch station details by ID
export const getStationById = async (id) => {
  const response = await API.get(`/stations/${id}`);
  return response.data;
};

// Fetch trains for a specific station
export const getStationTrains = async (stationId) => {
  const response = await API.get(`/stations/${stationId}/trains`);
  return response.data;
};

// Fetch congestion by station and date
export const getCongestionByStationAndDate = async (stationId, date) => {
  const response = await API.get('/api/congestion', {
    params: { stationId, date },
  });
  return response.data;
};

// What-If Delay Cascading Simulator
export const simulateDelay = async (trainId, delayMinutes, journeyDate) => {
  const response = await API.post('/api/simulator/delay', {
    trainId,
    delayMinutes,
    journeyDate,
  });
  return response.data;
};

export default API;
