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
    // 返回默认数据作为 fallback
    return {
      success: true,
      data: [
        {
          id: 'pudong',
          name: '浦东新区',
          subDistricts: [
            { id: 'lujiazui', name: '陆家嘴', description: '金融中心，高端楼盘聚集地' },
            { id: 'zhangjiang', name: '张江', description: '科技园区，年轻白领聚集地' }
          ]
        },
        {
          id: 'xuhui',
          name: '徐汇区',
          subDistricts: [
            { id: 'xujiahui', name: '徐家汇', description: '商业中心，交通便利' },
            { id: 'xuhui_binjiang', name: '徐汇滨江', description: '滨江区域，高端住宅' }
          ]
        },
        {
          id: 'changning',
          name: '长宁区',
          subDistricts: [
            { id: 'hongqiao', name: '虹桥', description: '交通枢纽，商务中心' },
            { id: 'zhongshan', name: '中山公园', description: '成熟商圈，生活便利' }
          ]
        },
        {
          id: 'huangpu',
          name: '黄浦区',
          subDistricts: [
            { id: 'waitan', name: '外滩', description: '历史文化街区，高端住宅' },
            { id: 'nanjinglu', name: '南京路', description: '商业中心，繁华地段' }
          ]
        },
        {
          id: 'jingan',
          name: '静安区',
          subDistricts: [
            { id: 'jingansi', name: '静安寺', description: '商业中心，高端住宅' },
            { id: 'nanjingsi', name: '南京西路', description: '繁华商圈，奢侈品聚集' }
          ]
        },
        {
          id: 'hongkou',
          name: '虹口区',
          subDistricts: [
            { id: 'beiwaitan', name: '北外滩', description: '滨江区域，发展潜力大' },
            { id: 'luxun', name: '鲁迅公园', description: '文化街区，生活便利' }
          ]
        },
        {
          id: 'yangpu',
          name: '杨浦区',
          subDistricts: [
            { id: 'wujiaochang', name: '五角场', description: '商业中心，高校聚集' },
            { id: 'yangpu_binjiang', name: '杨浦滨江', description: '滨江区域，发展中' }
          ]
        },
        {
          id: 'minhang',
          name: '闵行区',
          subDistricts: [
            { id: 'xinzhuang', name: '莘庄', description: '交通枢纽，成熟社区' },
            { id: 'huacao', name: '华漕', description: '国际社区，高端住宅' }
          ]
        },
        {
          id: 'baoshan',
          name: '宝山区',
          subDistricts: [
            { id: 'wusong', name: '吴淞', description: '滨江区域，发展中' },
            { id: 'gaojing', name: '高境', description: '成熟社区，交通便利' }
          ]
        }
      ]
    };
  }
};

// 楼盘数据接口
export const fetchProjects = async () => {
  try {
    const response = await apiClient.get('/projects');
    return response.data;
  } catch (error) {
    console.error('获取楼盘数据失败:', error);
    // 返回空数据作为 fallback
    return { success: true, data: [] };
  }
};

// 行情数据接口
export const fetchMarketTrends = async () => {
  try {
    const response = await apiClient.get('/market-trends');
    return response.data;
  } catch (error) {
    console.error('获取行情数据失败:', error);
    // 返回空数据作为 fallback
    return { success: true, data: [] };
  }
};

// 手动触发数据同步
export const triggerSync = async () => {
  try {
    const response = await apiClient.post('/sync');
    return response.data;
  } catch (error) {
    console.error('触发数据同步失败:', error);
    return { success: false, error: '同步失败' };
  }
};

// 导出API服务
export default {
  fetchDistricts,
  fetchProjects,
  fetchMarketTrends,
  triggerSync
};