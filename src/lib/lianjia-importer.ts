/**
 * 链家新房数据导入工具
 * 模拟从链家网站获取新房数据并导入到项目中
 */

import { NewHomeProject } from '../data/newHomes';

// 模拟链家新房数据接口
interface LianjiaNewHome {
  id: string;
  name: string;
  district: string;
  subDistrict: string;
  price: number;
  priceUnit: string;
  area: number;
  areaRange: string;
  status: '在售' | '待售' | '售罄';
  features: string[];
  description: string;
  image: string;
  developer: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  lianjiaId: string;
  updateTime: string;
}

// 区域映射表
const districtMap: Record<string, string> = {
  '浦东新区': 'pudong',
  '黄浦区': 'huangpu',
  '徐汇区': 'xuhui',
  '长宁区': 'changning',
  '静安区': 'jingan',
  '普陀区': 'putuo',
  '虹口区': 'hongkou',
  '杨浦区': 'yangpu',
  '闵行区': 'minhang',
  '宝山区': 'baoshan',
  '嘉定区': 'jiading',
  '松江区': 'songjiang',
  '青浦区': 'qingpu',
  '奉贤区': 'fengxian',
  '金山区': 'jinshan',
  '崇明区': 'chongming'
};

// 板块映射表
const subDistrictMap: Record<string, Record<string, string>> = {
  'pudong': {
    '陆家嘴': 'lujiazui',
    '张江': 'zhangjiang',
    '唐镇': 'tangzhen',
    '前滩': 'qiantan',
    '川沙': 'chuansha',
    '花木': 'huamu',
    '三林': 'sanlin'
  },
  'huangpu': {
    '新天地': 'xintiandi',
    '外滩': 'waitan',
    '豫园': 'yuyuan'
  },
  'xuhui': {
    '徐家汇': 'xujiahui',
    '徐汇滨江': 'xuhuibinjiang',
    '衡山路': 'hengshanlu'
  },
  'changning': {
    '中山公园': 'zhongshangongyuan',
    '虹桥': 'hongqiao',
    '古北': 'gubei'
  },
  'jingan': {
    '静安寺': 'jingansi',
    '苏河湾': 'suhewan',
    '西藏北路': 'xibalu'
  },
  'putuo': {
    '长风': 'changfeng',
    '真如': 'zhenru',
    '桃浦': 'taopu'
  },
  'hongkou': {
    '北外滩': 'northwaitan',
    '四川北路': 'sichuanbeilu'
  },
  'yangpu': {
    '五角场': 'wujiaochang',
    '新江湾城': 'xinjiangwancheng',
    '东外滩': 'dongwaitan'
  },
  'minhang': {
    '莘庄': 'xinzhuang',
    '七宝': 'qibao',
    '梅陇': 'meilong',
    '华漕': 'huacao',
    '虹桥': 'hongqiao'
  },
  'baoshan': {
    '淞宝': 'songbao',
    '顾村': 'gucun',
    '上海大学': 'shanghaiuniversity'
  },
  'jiading': {
    '嘉定新城': 'jiadingnewcity',
    '南翔': 'nanxiang',
    '安亭': 'anting'
  },
  'songjiang': {
    '松江新城': 'songjiangnewcity',
    '佘山': 'sheshan',
    '九亭': 'jiuting'
  },
  'qingpu': {
    '青浦新城': 'qingpuxincheng',
    '朱家角': 'zhujiajiao',
    '徐泾': 'xujing'
  },
  'fengxian': {
    '奉贤新城': 'fengxiannewcity',
    '海湾': 'haiwan'
  },
  'jinshan': {
    '金山新城': 'jinshannewcity',
    '枫泾': 'fengjing'
  },
  'chongming': {
    '城桥': 'chengqiao',
    '东平': 'dongping'
  }
};

// 模拟链家新房数据
const mockLianjiaNewHomes: LianjiaNewHome[] = [
  {
    id: 'lj-001',
    name: '链家·璞悦湾',
    district: '浦东新区',
    subDistrict: '陆家嘴',
    price: 350000,
    priceUnit: '元/㎡',
    area: 180,
    areaRange: '180-320㎡',
    status: '在售',
    features: ['陆家嘴核心', '一线江景', '精装修', '智能家居'],
    description: '链家独家代理，陆家嘴核心区域江景豪宅，紧邻东方明珠和环球金融中心。',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    developer: '链家地产',
    address: '浦东新区陆家嘴环路',
    coordinates: { lat: 31.2350, lng: 121.4950 },
    lianjiaId: '107101234567',
    updateTime: '2026-01-28'
  },
  {
    id: 'lj-002',
    name: '链家·悦庭',
    district: '黄浦区',
    subDistrict: '新天地',
    price: 380000,
    priceUnit: '元/㎡',
    area: 220,
    areaRange: '220-400㎡',
    status: '在售',
    features: ['新天地核心', '历史风貌', '顶级配套', '稀缺地段'],
    description: '链家精选，新天地核心区域，历史与现代交融的顶级豪宅。',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    developer: '链家地产',
    address: '黄浦区太仓路',
    coordinates: { lat: 31.2250, lng: 121.4750 },
    lianjiaId: '107101234568',
    updateTime: '2026-01-29'
  },
  {
    id: 'lj-003',
    name: '链家·江宸府',
    district: '徐汇区',
    subDistrict: '徐汇滨江',
    price: 280000,
    priceUnit: '元/㎡',
    area: 145,
    areaRange: '145-260㎡',
    status: '在售',
    features: ['徐汇滨江', '江景房', '品牌开发商', '高品质'],
    description: '链家推荐，徐汇滨江核心区域，江景美宅，品质生活新标杆。',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    developer: '链家地产',
    address: '徐汇区龙腾大道',
    coordinates: { lat: 31.1750, lng: 121.4650 },
    lianjiaId: '107101234569',
    updateTime: '2026-01-27'
  },
  {
    id: 'lj-004',
    name: '链家·虹桥壹号',
    district: '长宁区',
    subDistrict: '虹桥',
    price: 220000,
    priceUnit: '元/㎡',
    area: 120,
    areaRange: '120-180㎡',
    status: '在售',
    features: ['虹桥核心', '交通便利', '商业配套', '国际化社区'],
    description: '链家独家，虹桥商务区核心位置，交通便利，配套完善。',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
    developer: '链家地产',
    address: '长宁区虹桥路',
    coordinates: { lat: 31.1930, lng: 121.3990 },
    lianjiaId: '107101234570',
    updateTime: '2026-01-26'
  },
  {
    id: 'lj-005',
    name: '链家·苏河湾壹号',
    district: '静安区',
    subDistrict: '苏河湾',
    price: 260000,
    priceUnit: '元/㎡',
    area: 150,
    areaRange: '150-280㎡',
    status: '在售',
    features: ['苏河湾核心', '河景房', '高端配套', '文化底蕴'],
    description: '链家精选，苏河湾核心区域，河景豪宅，文化底蕴深厚。',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    developer: '链家地产',
    address: '静安区苏河湾',
    coordinates: { lat: 31.2450, lng: 121.4750 },
    lianjiaId: '107101234571',
    updateTime: '2026-01-25'
  },
  {
    id: 'lj-006',
    name: '链家·长风雅苑',
    district: '普陀区',
    subDistrict: '长风',
    price: 180000,
    priceUnit: '元/㎡',
    area: 110,
    areaRange: '110-160㎡',
    status: '在售',
    features: ['长风生态商务区', '公园旁', '配套完善', '性价比高'],
    description: '链家推荐，长风生态商务区核心位置，环境优美，配套完善。',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    developer: '链家地产',
    address: '普陀区长风生态商务区',
    coordinates: { lat: 31.2180, lng: 121.3950 },
    lianjiaId: '107101234572',
    updateTime: '2026-01-24'
  },
  {
    id: 'lj-007',
    name: '链家·北外滩壹号',
    district: '虹口区',
    subDistrict: '北外滩',
    price: 240000,
    priceUnit: '元/㎡',
    area: 135,
    areaRange: '135-220㎡',
    status: '在售',
    features: ['北外滩核心', '江景房', '发展潜力', '交通便利'],
    description: '链家独家，北外滩核心区域，江景美宅，发展潜力巨大。',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    developer: '链家地产',
    address: '虹口区东大名路',
    coordinates: { lat: 31.2530, lng: 121.4950 },
    lianjiaId: '107101234573',
    updateTime: '2026-01-23'
  },
  {
    id: 'lj-008',
    name: '链家·五角场中心',
    district: '杨浦区',
    subDistrict: '五角场',
    price: 190000,
    priceUnit: '元/㎡',
    area: 105,
    areaRange: '105-155㎡',
    status: '在售',
    features: ['五角场核心', '商业中心', '教育资源', '交通便利'],
    description: '链家推荐，五角场核心区域，商业配套完善，教育资源丰富。',
    image: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800',
    developer: '链家地产',
    address: '杨浦区邯郸路',
    coordinates: { lat: 31.2920, lng: 121.5080 },
    lianjiaId: '107101234574',
    updateTime: '2026-01-22'
  },
  {
    id: 'lj-009',
    name: '链家·莘庄首府',
    district: '闵行区',
    subDistrict: '莘庄',
    price: 140000,
    priceUnit: '元/㎡',
    area: 95,
    areaRange: '95-140㎡',
    status: '在售',
    features: ['莘庄核心', '地铁上盖', '商业配套', '交通枢纽'],
    description: '链家独家，莘庄核心区域，地铁上盖，交通便利，配套完善。',
    image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800',
    developer: '链家地产',
    address: '闵行区莘庄',
    coordinates: { lat: 31.1320, lng: 121.3950 },
    lianjiaId: '107101234575',
    updateTime: '2026-01-21'
  },
  {
    id: 'lj-010',
    name: '链家·嘉定新城',
    district: '嘉定区',
    subDistrict: '嘉定新城',
    price: 95000,
    priceUnit: '元/㎡',
    area: 85,
    areaRange: '85-125㎡',
    status: '在售',
    features: ['嘉定新城核心', '地铁房', '商业配套', '生态环境'],
    description: '链家推荐，嘉定新城核心区域，地铁房，环境优美，配套完善。',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    developer: '链家地产',
    address: '嘉定区嘉定新城',
    coordinates: { lat: 31.3420, lng: 121.2650 },
    lianjiaId: '107101234576',
    updateTime: '2026-01-20'
  }
];

/**
 * 从链家获取新房数据（模拟）
 * @returns 新房数据列表
 */
export const fetchLianjiaNewHomes = async (): Promise<LianjiaNewHome[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('从链家获取新房数据...');
  console.log(`获取到 ${mockLianjiaNewHomes.length} 个新房项目`);
  
  return mockLianjiaNewHomes;
};

/**
 * 将链家数据转换为项目数据格式
 * @param lianjiaHome 链家新房数据
 * @returns 项目数据
 */
export const convertToProject = (lianjiaHome: LianjiaNewHome): NewHomeProject => {
  const districtId = districtMap[lianjiaHome.district] || 'unknown';
  const subDistrictId = subDistrictMap[districtId]?.[lianjiaHome.subDistrict] || 'unknown';
  
  return {
    id: `lj-${lianjiaHome.id}`,
    name: lianjiaHome.name,
    districtId,
    subDistrictId,
    price: lianjiaHome.price,
    priceUnit: lianjiaHome.priceUnit,
    area: lianjiaHome.area,
    areaRange: lianjiaHome.areaRange,
    status: lianjiaHome.status,
    features: lianjiaHome.features,
    description: lianjiaHome.description,
    image: lianjiaHome.image,
    developer: lianjiaHome.developer,
    address: lianjiaHome.address,
    coordinates: lianjiaHome.coordinates
  };
};

/**
 * 导入链家新房数据
 * @returns 导入的项目数据列表
 */
export const importLianjiaNewHomes = async (): Promise<NewHomeProject[]> => {
  try {
    console.log('开始导入链家新房数据...');
    
    // 获取链家新房数据
    const lianjiaHomes = await fetchLianjiaNewHomes();
    
    // 转换为项目数据格式
    const projects = lianjiaHomes.map(convertToProject);
    
    console.log(`成功导入 ${projects.length} 个链家新房项目`);
    
    return projects;
  } catch (error) {
    console.error('导入链家新房数据失败:', error);
    return [];
  }
};

/**
 * 过滤只获取在售的新房
 * @param projects 项目数据列表
 * @returns 在售的新房列表
 */
export const filterOnlyNewHomes = (projects: NewHomeProject[]): NewHomeProject[] => {
  return projects.filter(project => project.status === '在售' || project.status === '待售');
};
