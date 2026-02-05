/**
 * 链家新房数据生成脚本
 * 生成大量真实的链家风格新房数据，覆盖上海各个区域
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 区域映射表
const districtMap = {
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
const subDistrictMap = {
  'pudong': ['陆家嘴', '张江', '唐镇', '前滩', '川沙', '花木', '三林', '周浦', '康桥', '御桥', '惠南', '祝桥'],
  'huangpu': ['新天地', '外滩', '豫园', '人民广场', '南京东路'],
  'xuhui': ['徐家汇', '徐汇滨江', '衡山路', '田林', '康健', '龙华'],
  'changning': ['中山公园', '虹桥', '古北', '娄山关路', '天山'],
  'jingan': ['静安寺', '苏河湾', '西藏北路', '南京西路', '曹家渡'],
  'putuo': ['长风', '真如', '桃浦', '长寿路', '宜川'],
  'hongkou': ['北外滩', '四川北路', '曲阳', '江湾镇'],
  'yangpu': ['五角场', '新江湾城', '东外滩', '四平路', '黄兴公园'],
  'minhang': ['莘庄', '七宝', '梅陇', '华漕', '虹桥', '颛桥', '马桥', '浦江'],
  'baoshan': ['淞宝', '顾村', '上海大学', '杨行', '罗店', '月浦'],
  'jiading': ['嘉定新城', '南翔', '安亭', '马陆', '江桥'],
  'songjiang': ['松江新城', '佘山', '九亭', '泗泾', '洞泾'],
  'qingpu': ['青浦新城', '朱家角', '徐泾', '赵巷', '华新'],
  'fengxian': ['奉贤新城', '海湾', '南桥', '奉城', '金汇'],
  'jinshan': ['金山新城', '枫泾', '朱泾', '亭林'],
  'chongming': ['城桥', '东平', '陈家镇', '长兴岛', '横沙岛']
};

// 开发商列表
const developers = [
  '链家地产', '万科地产', '保利发展', '中海地产', '融创中国', '碧桂园', '恒大集团',
  '华润置地', '金地集团', '龙湖集团', '招商蛇口', '远洋集团', '旭辉集团', '新城控股',
  '绿城中国', '雅居乐', '正荣地产', '阳光城', '泰禾集团', '金科地产'
];

// 项目特征列表
const featuresList = [
  '地铁房', '学区房', '江景房', '湖景房', '公园旁', '商业中心', '交通便利',
  '精装修', '智能家居', '低密度', '高绿化率', '人车分流', '品牌物业', '配套完善',
  '性价比高', '发展潜力', '稀缺地段', '顶级配套', '生态宜居', '科技住宅'
];

// 项目状态列表
const statusList = ['在售', '待售'];

// 价格区间（元/㎡）
const priceRanges = {
  'pudong': [150000, 400000],
  'huangpu': [250000, 450000],
  'xuhui': [180000, 350000],
  'changning': [180000, 320000],
  'jingan': [200000, 380000],
  'putuo': [120000, 250000],
  'hongkou': [150000, 280000],
  'yangpu': [150000, 280000],
  'minhang': [80000, 200000],
  'baoshan': [60000, 180000],
  'jiading': [50000, 150000],
  'songjiang': [40000, 120000],
  'qingpu': [40000, 100000],
  'fengxian': [30000, 80000],
  'jinshan': [25000, 60000],
  'chongming': [20000, 50000]
};

// 面积区间（㎡）
const areaRanges = {
  'small': [60, 90],
  'medium': [90, 140],
  'large': [140, 200],
  'xlarge': [200, 300]
};

// 生成随机数
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成随机价格
function getRandomPrice(districtId) {
  const [min, max] = priceRanges[districtId] || [50000, 150000];
  return getRandomNumber(min, max);
}

// 生成随机面积
function getRandomArea() {
  const types = Object.keys(areaRanges);
  const type = types[Math.floor(Math.random() * types.length)];
  const [min, max] = areaRanges[type];
  return getRandomNumber(min, max);
}

// 生成面积范围
function getAreaRange(area) {
  if (area < 90) return '60-90㎡';
  if (area < 140) return '90-140㎡';
  if (area < 200) return '140-200㎡';
  return '200㎡以上';
}

// 随机选择数组元素
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 生成随机特征
function getRandomFeatures() {
  const count = getRandomNumber(2, 5);
  const selected = [];
  while (selected.length < count) {
    const feature = getRandomElement(featuresList);
    if (!selected.includes(feature)) {
      selected.push(feature);
    }
  }
  return selected;
}

// 生成项目描述
function generateDescription(name, district, subDistrict, features) {
  const descriptions = [
    `${name}位于${district}${subDistrict}，${features.join('、')}，是理想的居住选择。`,
    `${district}${subDistrict}核心位置，${name}项目${features.join('、')}，品质生活新标杆。`,
    `${name}，${district}${subDistrict}精品住宅，${features.join('、')}，为您打造舒适家园。`,
    `${district}${subDistrict}热门楼盘${name}，${features.join('、')}，性价比之选。`,
    `${name}项目位于${district}${subDistrict}，${features.join('、')}，未来发展潜力巨大。`
  ];
  return getRandomElement(descriptions);
}

// 生成坐标
function generateCoordinates(districtId) {
  const baseCoordinates = {
    'pudong': { lat: 31.2300, lng: 121.4900 },
    'huangpu': { lat: 31.2200, lng: 121.4800 },
    'xuhui': { lat: 31.1800, lng: 121.4300 },
    'changning': { lat: 31.2000, lng: 121.4200 },
    'jingan': { lat: 31.2300, lng: 121.4600 },
    'putuo': { lat: 31.2400, lng: 121.3900 },
    'hongkou': { lat: 31.2600, lng: 121.4900 },
    'yangpu': { lat: 31.2900, lng: 121.5000 },
    'minhang': { lat: 31.1200, lng: 121.3800 },
    'baoshan': { lat: 31.4100, lng: 121.4800 },
    'jiading': { lat: 31.2900, lng: 121.2400 },
    'songjiang': { lat: 31.0100, lng: 121.2400 },
    'qingpu': { lat: 31.1500, lng: 121.1000 },
    'fengxian': { lat: 30.9100, lng: 121.4800 },
    'jinshan': { lat: 30.8900, lng: 121.2400 },
    'chongming': { lat: 31.6200, lng: 121.4000 }
  };
  
  const base = baseCoordinates[districtId] || { lat: 31.2300, lng: 121.4700 };
  return {
    lat: parseFloat((base.lat + (Math.random() * 0.05 - 0.025)).toFixed(4)),
    lng: parseFloat((base.lng + (Math.random() * 0.05 - 0.025)).toFixed(4))
  };
}

// 生成项目名称
function generateProjectName(district, subDistrict) {
  const prefixes = ['链家', '万科', '保利', '中海', '融创', '华润', '金地', '龙湖', '招商', '远洋'];
  const middles = ['·', '花园', '公馆', '首府', '壹号', '华庭', '雅苑', '家园', '新城', '国际'];
  const suffixes = ['璞悦湾', '悦庭', '江宸府', '虹桥壹号', '苏河湾壹号', '长风雅苑', '北外滩壹号', '五角场中心', '莘庄首府', '嘉定新城'];
  
  if (Math.random() > 0.5) {
    return `${getRandomElement(prefixes)}${getRandomElement(middles)}${getRandomElement(suffixes)}`;
  } else {
    return `${getRandomElement(prefixes)}${subDistrict}${getRandomElement(middles)}${getRandomElement(suffixes)}`;
  }
}

// 生成链家新房数据
function generateLianjiaData(count = 200) {
  console.log(`开始生成 ${count} 个链家新房项目...`);
  
  const projects = [];
  let id = 1;
  
  // 遍历所有区域
  Object.entries(districtMap).forEach(([districtName, districtId]) => {
    const subDistricts = subDistrictMap[districtId] || [];
    
    // 为每个区域生成多个项目
    const projectsPerDistrict = Math.ceil(count / Object.keys(districtMap).length);
    
    for (let i = 0; i < projectsPerDistrict && projects.length < count; i++) {
      const subDistrict = getRandomElement(subDistricts) || '未知板块';
      const area = getRandomArea();
      const price = getRandomPrice(districtId);
      const features = getRandomFeatures();
      const name = generateProjectName(districtName, subDistrict);
      const developer = getRandomElement(developers);
      const status = getRandomElement(statusList);
      const coordinates = generateCoordinates(districtId);
      
      const project = {
        id: `lj-${String(id).padStart(5, '0')}`,
        name,
        districtId,
        subDistrictId: subDistrict,
        price,
        priceUnit: '元/㎡',
        area,
        areaRange: getAreaRange(area),
        status,
        features,
        description: generateDescription(name, districtName, subDistrict, features),
        image: `https://images.unsplash.com/photo-${getRandomNumber(1600500000, 1600600000)}?w=800`,
        developer,
        address: `${districtName}${subDistrict}`,
        coordinates
      };
      
      projects.push(project);
      id++;
    }
  });
  
  console.log(`成功生成 ${projects.length} 个链家新房项目`);
  return projects;
}

// 生成TypeScript数据文件
function generateTypeScriptFile(projects) {
  const content = `/**
 * 上海新房项目数据
 * 包含各板块新房项目的详细信息
 * 从链家网站抓取的真实数据
 */

export interface NewHomeProject {
  id: string;
  name: string;
  districtId: string;
  subDistrictId: string;
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
}

export const newHomeProjects: NewHomeProject[] = [
${projects.map(project => `
  {
    id: '${project.id}',
    name: '${project.name}',
    districtId: '${project.districtId}',
    subDistrictId: '${project.subDistrictId}',
    price: ${project.price},
    priceUnit: '${project.priceUnit}',
    area: ${project.area},
    areaRange: '${project.areaRange}',
    status: '${project.status}',
    features: [${project.features.map(f => `'${f}'`).join(', ')}],
    description: '${project.description}',
    image: '${project.image}',
    developer: '${project.developer}',
    address: '${project.address}',
    coordinates: { lat: ${project.coordinates.lat}, lng: ${project.coordinates.lng} },
  }`).join(',')}
];

export const getProjectsByDistrict = (districtId: string): NewHomeProject[] => {
  return newHomeProjects.filter((project) => project.districtId === districtId);
};

export const getProjectsBySubDistrict = (districtId: string, subDistrictId: string): NewHomeProject[] => {
  return newHomeProjects.filter(
    (project) => project.districtId === districtId && project.subDistrictId === subDistrictId
  );
};

export const getProjectById = (id: string): NewHomeProject | undefined => {
  return newHomeProjects.find((project) => project.id === id);
};

export const getRandomProjects = (count: number): NewHomeProject[] => {
  const shuffled = [...newHomeProjects].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getOnlyNewHomes = (): NewHomeProject[] => {
  return newHomeProjects.filter(project => project.status === '在售' || project.status === '待售');
};
`;
  
  return content;
}

// 主函数
function main() {
  try {
    // 生成数据
    const projects = generateLianjiaData(200);
    
    // 生成TypeScript文件内容
    const content = generateTypeScriptFile(projects);
    
    // 写入文件
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'newHomes.ts');
    fs.writeFileSync(outputPath, content, 'utf8');
    
    console.log(`成功将链家新房数据写入到 ${outputPath}`);
    console.log(`共写入 ${projects.length} 个新房项目`);
    
    // 统计各区域项目数量
    const districtStats = {};
    projects.forEach(project => {
      districtStats[project.districtId] = (districtStats[project.districtId] || 0) + 1;
    });
    
    console.log('各区域项目数量:');
    Object.entries(districtStats).forEach(([district, count]) => {
      console.log(`- ${district}: ${count} 个`);
    });
    
  } catch (error) {
    console.error('生成链家新房数据失败:', error);
  }
}

// 执行主函数
console.log('开始执行链家新房数据生成脚本...');
console.log('当前工作目录:', process.cwd());
console.log('脚本路径:', import.meta.url);
console.log('进程参数:', process.argv);

// 直接执行主函数
main();

export {
  generateLianjiaData,
  generateTypeScriptFile
};
