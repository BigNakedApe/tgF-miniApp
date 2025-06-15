import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getUserByTelegramId = async (telegramId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${telegramId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch user');
  }
};

export const createDeal = async (dealData) => {
  try {
    const response = await axios.post(`${API_URL}/deals/`, dealData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create deal');
  }
};

export const getUserDeals = async (telegramId) => {
  try {
    const response = await axios.get(`${API_URL}/deals/user/${telegramId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch deals');
  }
};

export const cancelDeal = async (dealId, telegramId) => {
  try {
    const response = await axios.put(`${API_URL}/deals/${dealId}/cancel`, {}, {
      params: { telegram_id: telegramId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to cancel deal');
  }
};

export const acceptDeal = async (dealId, telegramId) => {
  try {
    const response = await axios.put(`${API_URL}/deals/${dealId}/accept`, {}, {
      params: { telegram_id: telegramId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to accept deal');
  }
};

export const payDeal = async (dealId, telegramId, isCreator) => {
  try {
    const response = await axios.get(`${API_URL}/deals/${dealId}/pay`, {
      params: { telegram_id: telegramId, is_creator: isCreator }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to get payment URL');
  }
};

export const completeDeal = async (dealId, telegramId, isCreator) => {
  try {
    const response = await axios.put(`${API_URL}/deals/${dealId}/complete`, {}, {
      params: { telegram_id: telegramId, is_creator: isCreator }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to complete deal');
  }
};

export const getAppeals = async (tgId) => {
  try {
    const response = await axios.get(`${API_URL}/appeals/${tgId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch appeals');
  }
};

export const createAppeal = async (appealData) => {
  try {
    const response = await axios.post(`${API_URL}/appeals`, appealData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create appeal');
  }
};
