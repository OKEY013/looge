// 统一API管理
import axios from 'axios';

const baseURL = '/api'; // 可根据实际后端地址调整
const request = axios.create({ baseURL });

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

// 团队相关
export const getTeamInfo = () => request.get('/team/info');

// 管理员相关
export const getAdminInfo = () => request.get('/admin/info');
export const updatePopupContent = data => request.post('/admin/popup', data);

// 其他API可按需补充
