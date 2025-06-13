import axios from 'axios';

const API_BASE_URL = '/api'; // Замените на реальный URL бэкенда

export const getUser = async (telegramId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${telegramId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch user');
  }
};

export const createDeal = async (dealData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/deals/`, dealData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create deal');
  }
};

export const getUserDeals = async (telegramId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deals/user/${telegramId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch deals');
  }
};

export const cancelDeal = async (dealId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/deals/${dealId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to cancel deal');
  }
};

export const markDone = async (dealId, telegramId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/deals/${dealId}/mark-done`, null, {
      params: { telegram_id: telegramId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to mark done');
  }
};

export const payDeal = async (dealId, telegramId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deals/${dealId}/pay`, {
      params: { telegram_id: telegramId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to mark payment');
  }
};

export const completeDeal = async (dealId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/deals/${dealId}/complete`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to complete deal');
  }
};