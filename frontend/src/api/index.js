// 统一API管理
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const request = axios.create({ 
  baseURL,
  timeout: 10000
});

// 请求拦截器 - 添加token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
request.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminToken');
      window.location.href = '#/login';
    }
    return Promise.reject(error);
  }
);

// 用户相关
export const login = data => request.post('/user/login', data);
export const register = data => request.post('/user/register', data);
export const getProfile = () => request.get('/user/profile');
export const buyVIP = () => request.post('/user/vip');

// 拼团相关
export const getGroupList = () => request.get('/group/list');
export const joinGroup = data => request.post('/group/join', data);

// 消息相关
export const getMessages = () => request.get('/message/list');

// 财务相关
export const getFinance = () => request.get('/finance/list');
export const withdraw = data => request.post('/finance/withdraw', data);
export const recharge = data => request.post('/finance/recharge', data);

// 钱包相关
export const getWalletBalance = () => request.get('/wallet/balance');
export const getWalletTransactions = (params) => request.get('/wallet/transactions', { params });
export const walletRecharge = data => request.post('/wallet/recharge', data);
export const walletWithdraw = data => request.post('/wallet/withdraw', data);

// 邀请相关
export const generateInviteCode = () => request.get('/invite/generate');
export const validateInviteCode = data => request.post('/invite/validate', data);
export const useInviteCode = data => request.post('/invite/use', data);
export const getInviteStats = () => request.get('/invite/stats');
export const getMyInvites = (params) => request.get('/invite/list', { params });

// 轮播图相关
export const getCarousels = (params) => request.get('/carousel/list', { params });
export const getCarousel = id => request.get(`/carousel/${id}`);
export const createCarousel = data => request.post('/carousel', data);
export const updateCarousel = (id, data) => request.put(`/carousel/${id}`, data);
export const deleteCarousel = id => request.delete(`/carousel/${id}`);

// 团队相关
export const getTeamInfo = () => request.get('/team/info');

// 管理员相关
export const getAdminInfo = () => request.get('/admin/info');
export const updatePopupContent = data => request.post('/admin/popup', data);

// 默认导出request实例
export default request;
