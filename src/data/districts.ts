/**
 * 上海区域数据
 * 包含各区的基本信息和下辖板块
 */

export interface District {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  subDistricts: SubDistrict[];
  color: string;
  position: {
    x: number;
    y: number;
  };
}

export interface SubDistrict {
  id: string;
  name: string;
  description: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export const shanghaiDistricts: District[] = [
  {
    id: 'pudong',
    name: '浦东新区',
    nameEn: 'Pudong New Area',
    description: '上海经济发展的核心引擎，拥有陆家嘴、张江等重要功能区',
    color: '#FF6B35',
    position: { x: 75, y: 45 },
    subDistricts: [
      { id: 'lujiazui', name: '陆家嘴', description: '金融中心，高楼林立', coordinates: { x: 65, y: 35 } },
      { id: 'zhangjiang', name: '张江', description: '科技创新中心', coordinates: { x: 72, y: 42 } },
      { id: 'jinqiao', name: '金桥', description: '先进制造业基地', coordinates: { x: 78, y: 38 } },
      { id: 'waigaoqiao', name: '外高桥', description: '保税区，贸易物流', coordinates: { x: 85, y: 30 } },
      { id: 'hongqiao', name: '川沙', description: '迪士尼度假区', coordinates: { x: 68, y: 55 } },
    ],
  },
  {
    id: 'minhang',
    name: '闵行区',
    nameEn: 'Minhang District',
    description: '西南部重要居住区，拥有虹桥枢纽和多个产业园区',
    color: '#FF8C42',
    position: { x: 55, y: 65 },
    subDistricts: [
      { id: 'hongqiao', name: '虹桥', description: '交通枢纽，商务区', coordinates: { x: 50, y: 60 } },
      { id: 'qibao', name: '七宝', description: '历史文化古镇', coordinates: { x: 52, y: 68 } },
      { id: 'wujing', name: '吴泾', description: '化工区转型中', coordinates: { x: 60, y: 72 } },
      { id: 'meilong', name: '梅陇', description: '居住为主', coordinates: { x: 55, y: 65 } },
    ],
  },
  {
    id: 'xuhui',
    name: '徐汇区',
    nameEn: 'Xuhui District',
    description: '上海核心城区，拥有徐家汇商圈和众多历史建筑',
    color: '#FFA500',
    position: { x: 45, y: 55 },
    subDistricts: [
      { id: 'xujiahui', name: '徐家汇', description: '核心商圈', coordinates: { x: 45, y: 55 } },
      { id: 'huaihai', name: '淮海中路', description: '高档商业区', coordinates: { x: 42, y: 52 } },
      { id: 'tianlin', name: '田林', description: '成熟居住区', coordinates: { x: 48, y: 58 } },
    ],
  },
  {
    id: 'changning',
    name: '长宁区',
    nameEn: 'Changning District',
    description: '位于上海市区西部，以虹桥开发区和中山公园为核心',
    color: '#FF7F50',
    position: { x: 40, y: 52 },
    subDistricts: [
      { id: 'hongqiao', name: '虹桥开发区', description: '商务办公区', coordinates: { x: 38, y: 50 } },
      { id: 'zhongshan', name: '中山公园', description: '商业中心', coordinates: { x: 42, y: 54 } },
      { id: 'gubei', name: '古北', description: '国际社区', coordinates: { x: 36, y: 48 } },
    ],
  },
  {
    id: 'huangpu',
    name: '黄浦区',
    nameEn: 'Huangpu District',
    description: '上海最核心的城区，外滩、南京路步行街所在地',
    color: '#FF6347',
    position: { x: 42, y: 45 },
    subDistricts: [
      { id: 'waitan', name: '外滩', description: '标志性景观', coordinates: { x: 40, y: 42 } },
      { id: 'nanjing', name: '南京东路', description: '商业步行街', coordinates: { x: 42, y: 45 } },
      { id: 'xintiandi', name: '新天地', description: '时尚休闲区', coordinates: { x: 44, y: 48 } },
    ],
  },
  {
    id: 'jingan',
    name: '静安区',
    nameEn: 'Jingan District',
    description: '位于上海市中心，拥有静安寺商圈和众多高端商业',
    color: '#FF5F5F',
    position: { x: 43, y: 48 },
    subDistricts: [
      { id: 'jingansi', name: '静安寺', description: '核心商圈', coordinates: { x: 43, y: 48 } },
      { id: 'nanjingxi', name: '南京西路', description: '高端商业街', coordinates: { x: 41, y: 46 } },
      { id: 'jiangwan', name: '江湾', description: '商务居住区', coordinates: { x: 45, y: 50 } },
    ],
  },
  {
    id: 'putuo',
    name: '普陀区',
    nameEn: 'Putuo District',
    description: '位于上海西北部，拥有长风公园和真如副中心',
    color: '#FF7F24',
    position: { x: 42, y: 62 },
    subDistricts: [
      { id: 'caoyang', name: '曹杨', description: '老牌居住区', coordinates: { x: 40, y: 60 } },
      { id: 'changfeng', name: '长风', description: '生态商务区', coordinates: { x: 44, y: 64 } },
      { id: 'zhenru', name: '真如', description: '城市副中心', coordinates: { x: 46, y: 66 } },
    ],
  },
  {
    id: 'hongkou',
    name: '虹口区',
    nameEn: 'Hongkou District',
    description: '位于上海市区北部，鲁迅公园和北外滩所在地',
    color: '#FF6A3D',
    position: { x: 42, y: 40 },
    subDistricts: [
      { id: 'northwaitan', name: '北外滩', description: '滨水商务区', coordinates: { x: 40, y: 38 } },
      { id: 'luxun', name: '鲁迅公园', description: '文化区', coordinates: { x: 44, y: 42 } },
      { id: 'sichang', name: '四川北路', description: '商业街', coordinates: { x: 42, y: 40 } },
    ],
  },
  {
    id: 'yangpu',
    name: '杨浦区',
    nameEn: 'Yangpu District',
    description: '位于上海东北部，拥有五角场城市副中心和众多高校',
    color: '#FF8C22',
    position: { x: 48, y: 38 },
    subDistricts: [
      { id: 'wujiaochang', name: '五角场', description: '城市副中心', coordinates: { x: 50, y: 36 } },
      { id: 'fudanda', name: '复旦大学', description: '高校区域', coordinates: { x: 46, y: 40 } },
      { id: 'kongjiang', name: '控江路', description: '居住区', coordinates: { x: 52, y: 42 } },
    ],
  },
  {
    id: 'baoshan',
    name: '宝山区',
    nameEn: 'Baoshan District',
    description: '位于上海北部，是重要的钢铁产业基地和港口物流区',
    color: '#FF9E3D',
    position: { x: 55, y: 30 },
    subDistricts: [
      { id: 'shanghaiuniversity', name: '上海大学', description: '教育区域', coordinates: { x: 52, y: 28 } },
      { id: 'youyiz', name: '友谊路', description: '行政中心', coordinates: { x: 56, y: 32 } },
      { id: 'luojing', name: '罗泾', description: '生态宜居区', coordinates: { x: 60, y: 35 } },
    ],
  },
  {
    id: 'jiading',
    name: '嘉定区',
    nameEn: 'Jiading District',
    description: '位于上海西北部，是著名的汽车城和历史文化名城',
    color: '#FFAB3D',
    position: { x: 45, y: 78 },
    subDistricts: [
      { id: 'nanxiang', name: '南翔', description: '历史文化古镇', coordinates: { x: 42, y: 82 } },
      { id: 'anting', name: '安亭', description: '汽车产业基地', coordinates: { x: 48, y: 80 } },
      { id: 'jiadingnewcity', name: '嘉定新城', description: '城市副中心', coordinates: { x: 45, y: 76 } },
    ],
  },
  {
    id: 'songjiang',
    name: '松江区',
    nameEn: 'Songjiang District',
    description: '位于上海西南部，拥有佘山国家旅游度假区和松江大学城',
    color: '#FFB847',
    position: { x: 30, y: 80 },
    subDistricts: [
      { id: 'songjiangnewcity', name: '松江新城', description: '城市副中心', coordinates: { x: 28, y: 78 } },
      { id: 'sheshan', name: '佘山', description: '旅游度假区', coordinates: { x: 25, y: 85 } },
      { id: 'songjianguniversity', name: '松江大学城', description: '高校聚集区', coordinates: { x: 32, y: 82 } },
    ],
  },
  {
    id: 'qingpu',
    name: '青浦区',
    nameEn: 'Qingpu District',
    description: '位于上海西部，是长三角一体化示范区的重要区域',
    color: '#FFC24D',
    position: { x: 25, y: 75 },
    subDistricts: [
      { id: 'qingxincheng', name: '青浦新城', description: '区域中心', coordinates: { x: 24, y: 73 } },
      { id: 'zhujiajiao', name: '朱家角', description: '历史文化古镇', coordinates: { x: 20, y: 78 } },
      { id: 'xiangchecun', name: '香花桥', description: '工业园区', coordinates: { x: 28, y: 76 } },
    ],
  },
  {
    id: 'fengxian',
    name: '奉贤区',
    nameEn: 'Fengxian District',
    description: '位于上海南部，是重要的化工产业基地和生态宜居区',
    color: '#FFD157',
    position: { x: 35, y: 95 },
    subDistricts: [
      { id: 'fengxiannewcity', name: '奉贤新城', description: '区域中心', coordinates: { x: 35, y: 93 } },
      { id: 'hongmiao', name: '奉城', description: '历史文化镇', coordinates: { x: 40, y: 98 } },
      { id: 'jinhui', name: '金汇', description: '居住区', coordinates: { x: 38, y: 90 } },
    ],
  },
  {
    id: 'jinshan',
    name: '金山区',
    nameEn: 'Jinshan District',
    description: '位于上海西南部，是重要的石化产业基地和滨海旅游区',
    color: '#FFE066',
    position: { x: 20, y: 90 },
    subDistricts: [
      { id: 'jinshanwei', name: '金山卫', description: '石化基地', coordinates: { x: 18, y: 88 } },
      { id: 'shanyang', name: '山阳', description: '滨海旅游区', coordinates: { x: 22, y: 92 } },
      { id: 'tinglin', name: '亭林', description: '工业重镇', coordinates: { x: 20, y: 90 } },
    ],
  },
  {
    id: 'chongming',
    name: '崇明区',
    nameEn: 'Chongming District',
    description: '位于上海北部，是重要的生态保护和旅游度假区',
    color: '#FFE066',
    position: { x: 65, y: 15 },
    subDistricts: [
      { id: 'chengqiao', name: '城桥', description: '行政中心', coordinates: { x: 63, y: 13 } },
      { id: 'dongping', name: '东平', description: '国家森林公园', coordinates: { x: 70, y: 18 } },
      { id: 'huangbo', name: '黄浦江源', description: '生态旅游区', coordinates: { x: 68, y: 20 } },
    ],
  },
];

export const getDistrictById = (id: string): District | undefined => {
  return shanghaiDistricts.find((district) => district.id === id);
};

export const getSubDistrictById = (districtId: string, subDistrictId: string): SubDistrict | undefined => {
  const district = getDistrictById(districtId);
  return district?.subDistricts.find((sub) => sub.id === subDistrictId);
};
