import axios from 'axios';

// API基础配置
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 错误处理
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// 区域数据接口
export const fetchDistricts = async () => {
  try {
    const response = await apiClient.get('/districts');
    return response.data;
  } catch (error) {
    console.error('获取区域数据失败:', error);
    return { success: false, error: error.message };
  }
};

// 获取单个行政区详情
export const fetchDistrict = async (id: string) => {
  try {
    const response = await apiClient.get(`/districts/${id}`);
    return response.data;
  } catch (error) {
    console.error('获取行政区详情失败:', error);
    return { success: false, error: error.message };
  }
};

// 获取行政区的板块列表
export const fetchSubDistricts = async (districtId: string) => {
  try {
    const response = await apiClient.get(`/districts/${districtId}/sub-districts`);
    return response.data;
  } catch (error) {
    console.error('获取板块列表失败:', error);
    return { success: false, error: error.message };
  }
};

// 楼盘数据接口（支持筛选和分页）
export const fetchProjects = async (params?: {
  district?: string;
  subDistrict?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await apiClient.get('/projects', { params });
    return response.data;
  } catch (error) {
    console.error('获取楼盘数据失败:', error);
    return { success: false, error: error.message };
  }
};

// 获取单个楼盘详情
export const fetchProject = async (id: string) => {
  try {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('获取楼盘详情失败:', error);
    return { success: false, error: error.message };
  }
};

// 获取楼盘价格历史
export const fetchProjectPriceHistory = async (id: string) => {
  try {
    const response = await apiClient.get(`/projects/${id}/price-history`);
    return response.data;
  } catch (error) {
    console.error('获取价格历史失败:', error);
    return { success: false, error: error.message };
  }
};

// 获取楼盘版本历史
export const fetchProjectVersions = async (id: string) => {
  try {
    const response = await apiClient.get(`/projects/${id}/versions`);
    return response.data;
  } catch (error) {
    console.error('获取版本历史失败:', error);
    return { success: false, error: error.message };
  }
};

// 同步状态接口
export const fetchSyncStatus = async () => {
  try {
    const response = await apiClient.get('/sync/status');
    return response.data;
  } catch (error) {
    console.error('获取同步状态失败:', error);
    return { success: false, error: error.message };
  }
};

// 获取同步日志
export const fetchSyncLogs = async (params?: { page?: number; limit?: number }) => {
  try {
    const response = await apiClient.get('/sync/logs', { params });
    return response.data;
  } catch (error) {
    console.error('获取同步日志失败:', error);
    return { success: false, error: error.message };
  }
};

// 手动触发数据同步
export const triggerSync = async (maxPages?: number) => {
  try {
    const response = await apiClient.post('/sync/trigger', { maxPages });
    return response.data;
  } catch (error) {
    console.error('触发数据同步失败:', error);
    return { success: false, error: error.message };
  }
};

// 行情数据接口（使用统计数据）
export const fetchMarketTrends = async () => {
  try {
    const response = await apiClient.get('/districts');
    if (response.data.success && response.data.data) {
      const districts = response.data.data;
      const trends = districts.map((district: any) => ({
        district: district.name,
        districtId: district.id,
        avgPrice: district.statistics?.avgPrice || 0,
        totalProjects: district._count?.projects || 0,
        sellingCount: district.statistics?.sellingCount || 0,
        pendingCount: district.statistics?.pendingCount || 0,
        soldoutCount: district.statistics?.soldoutCount || 0
      }));
      return { success: true, data: trends };
    }
    return { success: false, error: '无法获取行情数据' };
  } catch (error) {
    console.error('获取行情数据失败:', error);
    return { success: false, error: error.message };
  }
};

// 导出API服务
export default {
  fetchDistricts,
  fetchProjects,
  fetchMarketTrends,
  triggerSync
};