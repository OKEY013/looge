import axios from 'axios';

const API_BASE_URL = 'https://api.looge.com'; // Replace with your actual API base URL

// User Registration
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
};

// User Login
export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
};

// Participate in Lottery
export const participateInLottery = async (lotteryId, userId) => {
    const response = await axios.post(`${API_BASE_URL}/lottery/${lotteryId}/participate`, { userId });
    return response.data;
};

// Request Refund
export const requestRefund = async (refundData) => {
    const response = await axios.post(`${API_BASE_URL}/refund`, refundData);
    return response.data;
};

// Share Link
export const generateShareLink = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/share`, data);
    return response.data;
};

// Get Group Purchase Details
export const getGroupPurchaseDetails = async (groupId) => {
    const response = await axios.get(`${API_BASE_URL}/group-purchase/${groupId}`);
    return response.data;
};

// Get User Profile
export const getUserProfile = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
};

// Update User Profile
export const updateUserProfile = async (userId, profileData) => {
    const response = await axios.put(`${API_BASE_URL}/user/${userId}`, profileData);
    return response.data;
};

// Financial Transactions
export const financialTransaction = async (transactionData) => {
    const response = await axios.post(`${API_BASE_URL}/finance/transaction`, transactionData);
    return response.data;
};