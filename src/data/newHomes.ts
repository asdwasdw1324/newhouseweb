/**
 * 上海新房项目数据
 * 从链家网站爬取的真实数据
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
  {
    "id": "lj-1769864149755-6042",
    "name": "中国铁建·熙语",
    "districtId": "fengxian",
    "subDistrictId": "西渡",
    "price": 42000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 81-121㎡",
    "status": "在售",
    "features": [
      "近地铁",
      "公交直达",
      "综合商场",
      "公园"
    ],
    "description": "中国铁建·熙语位于奉贤西渡，近地铁、公交直达、综合商场、公园",
    "image": "/images/projects/project_lj-1769864149755-6042_1769864149755_840.jpg",
    "developer": "",
    "address": "上海奉贤西渡扶兰路68弄",
    "coordinates": {
      "lat": 31.25731711058415,
      "lng": 121.5513887014063
    }
  },
  {
    "id": "lj-1769864149757-6242",
    "name": "保利西郊和煦领墅",
    "districtId": "songjiang",
    "subDistrictId": "洞泾",
    "price": 45000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 96-122㎡",
    "status": "在售",
    "features": [
      "公交直达",
      "医疗配套",
      "综合商场",
      "期房"
    ],
    "description": "保利西郊和煦领墅位于松江洞泾，公交直达、医疗配套、综合商场、期房",
    "image": "/images/projects/project_lj-1769864149757-6242_1769864149757_613.jpg",
    "developer": "",
    "address": "泗砖南路与振业路交叉口",
    "coordinates": {
      "lat": 31.328381417171748,
      "lng": 121.49606772674379
    }
  },
  {
    "id": "lj-1769864149759-4258",
    "name": "保利虹桥和著",
    "districtId": "jiading",
    "subDistrictId": "江桥",
    "price": 58000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 94-128㎡",
    "status": "在售",
    "features": [
      "河景",
      "湖景",
      "近主干道",
      "临近高速"
    ],
    "description": "保利虹桥和著位于嘉定江桥，河景、湖景、近主干道、临近高速",
    "image": "/images/projects/project_lj-1769864149759-4258_1769864149759_999.jpg",
    "developer": "",
    "address": "上海市嘉定区曹安公路3333",
    "coordinates": {
      "lat": 31.291219902158243,
      "lng": 121.52456695953363
    }
  },
  {
    "id": "lj-1769864149760-3505",
    "name": "华润华发时代之城",
    "districtId": "jiading",
    "subDistrictId": "南翔",
    "price": 58500,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 89-135㎡",
    "status": "在售",
    "features": [
      "公交直达",
      "综合商场",
      "期房",
      "大三居"
    ],
    "description": "华润华发时代之城位于嘉定南翔，公交直达、综合商场、期房、大三居",
    "image": "/images/projects/project_lj-1769864149760-3505_1769864149760_427.jpg",
    "developer": "",
    "address": "嘉前路288号",
    "coordinates": {
      "lat": 31.2587073149861,
      "lng": 121.51390187349959
    }
  },
  {
    "id": "lj-1769864149761-8160",
    "name": "同润新云都会",
    "districtId": "pudong",
    "subDistrictId": "新场",
    "price": 48000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 86-135㎡",
    "status": "在售",
    "features": [
      "公交直达",
      "医疗配套",
      "综合商场",
      "公园"
    ],
    "description": "同润新云都会位于浦东新场，公交直达、医疗配套、综合商场、公园",
    "image": "/images/projects/project_lj-1769864149761-8160_1769864149761_736.jpg",
    "developer": "",
    "address": "上海市浦东新区杨辉路",
    "coordinates": {
      "lat": 31.23112208406234,
      "lng": 121.50006046108358
    }
  },
  {
    "id": "lj-1769864149763-5495",
    "name": "华发海上都荟",
    "districtId": "songjiang",
    "subDistrictId": "洞泾",
    "price": 43000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 91-101㎡",
    "status": "在售",
    "features": [
      "山景",
      "天然氧吧",
      "近主干道",
      "临近高速"
    ],
    "description": "华发海上都荟位于松江洞泾，山景、天然氧吧、近主干道、临近高速",
    "image": "/images/projects/project_lj-1769864149763-5495_1769864149763_698.jpg",
    "developer": "",
    "address": "上海市松江区长兴西路与城隆路交叉口",
    "coordinates": {
      "lat": 31.278454585025347,
      "lng": 121.48567093249784
    }
  },
  {
    "id": "lj-1769864149764-2834",
    "name": "大宁揽翠艺墅",
    "districtId": "jingan",
    "subDistrictId": "大宁",
    "price": 115000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 260㎡",
    "status": "在售",
    "features": [
      "近地铁",
      "公交直达",
      "综合商场",
      "公园"
    ],
    "description": "大宁揽翠艺墅位于静安大宁，近地铁、公交直达、综合商场、公园",
    "image": "/images/projects/project_lj-1769864149764-2834_1769864149764_491.jpg",
    "developer": "",
    "address": "广延路1099弄",
    "coordinates": {
      "lat": 31.279184295746404,
      "lng": 121.48701636411546
    }
  },
  {
    "id": "lj-1769864149765-3667",
    "name": "上海长滩",
    "districtId": "baoshan",
    "subDistrictId": "淞宝",
    "price": 57481,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 66-245㎡",
    "status": "在售",
    "features": [
      "江景",
      "河景",
      "临近高速",
      "公交直达"
    ],
    "description": "上海长滩位于宝山淞宝，江景、河景、临近高速、公交直达",
    "image": "/images/projects/project_lj-1769864149765-3667_1769864149765_846.jpg",
    "developer": "",
    "address": "牡丹江路1875号(近富锦路)",
    "coordinates": {
      "lat": 31.32264440207015,
      "lng": 121.49329285138187
    }
  },
  {
    "id": "lj-1769864149767-5998",
    "name": "长城逸府",
    "districtId": "jinshan",
    "subDistrictId": "金山",
    "price": 21579,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 90-125㎡",
    "status": "在售",
    "features": [
      "河景",
      "天然氧吧",
      "临近高速",
      "公交直达"
    ],
    "description": "长城逸府位于金山金山，河景、天然氧吧、临近高速、公交直达",
    "image": "/images/projects/project_lj-1769864149767-5998_1769864149767_790.jpg",
    "developer": "",
    "address": "枫泾白牛路1068弄",
    "coordinates": {
      "lat": 31.231555500432982,
      "lng": 121.5596801932625
    }
  },
  {
    "id": "lj-1769864149768-4158",
    "name": "新城尚品",
    "districtId": "songjiang",
    "subDistrictId": "新桥",
    "price": 43000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 69-165㎡",
    "status": "在售",
    "features": [
      "临近高速",
      "公交直达",
      "综合商场",
      "公园"
    ],
    "description": "新城尚品位于松江新桥，临近高速、公交直达、综合商场、公园",
    "image": "/images/projects/project_lj-1769864149768-4158_1769864149768_226.jpg",
    "developer": "",
    "address": "上海市松江区新北街431号",
    "coordinates": {
      "lat": 31.256037693897593,
      "lng": 121.49587046895816
    }
  },
  {
    "id": "lj-1769864157310-5803",
    "name": "上海高尔夫社区汤泉美地城",
    "districtId": "jinshan",
    "subDistrictId": "金山",
    "price": 19500,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 91-143㎡",
    "status": "在售",
    "features": [
      "公交直达",
      "现房",
      "大三居",
      "小三居"
    ],
    "description": "上海高尔夫社区汤泉美地城位于金山金山，公交直达、现房、大三居、小三居",
    "image": "/images/projects/project_lj-1769864157310-5803_1769864157310_466.jpg",
    "developer": "",
    "address": "金石北路6800弄",
    "coordinates": {
      "lat": 31.314937654470903,
      "lng": 121.5084560124634
    }
  },
  {
    "id": "lj-1769864157312-8651",
    "name": "大宁叠翠苑",
    "districtId": "jingan",
    "subDistrictId": "大宁",
    "price": 105000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 260-280㎡",
    "status": "在售",
    "features": [
      "天然氧吧",
      "近主干道",
      "近地铁",
      "综合商场"
    ],
    "description": "大宁叠翠苑位于静安大宁，天然氧吧、近主干道、近地铁、综合商场",
    "image": "/images/projects/project_lj-1769864157312-8651_1769864157312_378.jpg",
    "developer": "",
    "address": "广延路1199弄、广延路1188弄",
    "coordinates": {
      "lat": 31.300756423171574,
      "lng": 121.48482303260924
    }
  },
  {
    "id": "lj-1769864157313-3114",
    "name": "品尊国际",
    "districtId": "putuo",
    "subDistrictId": "真如",
    "price": 120000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 140-205㎡",
    "status": "在售",
    "features": [
      "河景",
      "近主干道",
      "近地铁",
      "综合商场"
    ],
    "description": "品尊国际位于普陀真如，河景、近主干道、近地铁、综合商场",
    "image": "/images/projects/project_lj-1769864157313-3114_1769864157313_552.jpg",
    "developer": "",
    "address": "铜川路58弄",
    "coordinates": {
      "lat": 31.32776236560328,
      "lng": 121.51613809392374
    }
  },
  {
    "id": "lj-1769864157315-3647",
    "name": "上尚缘",
    "districtId": "songjiang",
    "subDistrictId": "松江大学城",
    "price": 57300,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 98-178㎡",
    "status": "待售",
    "features": [
      "公交直达",
      "综合商场",
      "公园",
      "低密居所"
    ],
    "description": "上尚缘位于松江松江大学城，公交直达、综合商场、公园、低密居所",
    "image": "/images/projects/project_lj-1769864157315-3647_1769864157315_10.jpg",
    "developer": "",
    "address": "上海市松江区文涵路1188号",
    "coordinates": {
      "lat": 31.316510210512426,
      "lng": 121.47468670130138
    }
  },
  {
    "id": "lj-1769864157316-9681",
    "name": "中鹰黑森林",
    "districtId": "putuo",
    "subDistrictId": "万里",
    "price": 160000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 250-580㎡",
    "status": "在售",
    "features": [
      "天然氧吧",
      "近主干道",
      "公交直达",
      "医疗配套"
    ],
    "description": "中鹰黑森林位于普陀万里，天然氧吧、近主干道、公交直达、医疗配套",
    "image": "/images/projects/project_lj-1769864157316-9681_1769864157316_966.jpg",
    "developer": "",
    "address": "上海市普陀区新村路1721号",
    "coordinates": {
      "lat": 31.291368685214877,
      "lng": 121.5654161075641
    }
  },
  {
    "id": "lj-1769864157318-3484",
    "name": "御品园林",
    "districtId": "qingpu",
    "subDistrictId": "徐泾",
    "price": 129602,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 312-473㎡",
    "status": "在售",
    "features": [
      "综合商场",
      "公园",
      "期房",
      "低密居所"
    ],
    "description": "御品园林位于青浦徐泾，综合商场、公园、期房、低密居所",
    "image": "/images/projects/project_lj-1769864157318-3484_1769864157318_884.jpg",
    "developer": "",
    "address": "青浦区徐南路1188号",
    "coordinates": {
      "lat": 31.292804820185847,
      "lng": 121.50208961952146
    }
  },
  {
    "id": "lj-1769864157319-4159",
    "name": "苏河融景",
    "districtId": "jingan",
    "subDistrictId": "不夜城",
    "price": 118000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 94-164㎡",
    "status": "在售",
    "features": [
      "近地铁",
      "公交直达",
      "现房",
      "近期开盘"
    ],
    "description": "苏河融景位于静安不夜城，近地铁、公交直达、现房、近期开盘",
    "image": "/images/projects/project_lj-1769864157319-4159_1769864157319_696.jpg",
    "developer": "",
    "address": "恒丰路318弄, 长安路795号, 长安路797号, 长安路799号, 长安路801号, 长安路805号",
    "coordinates": {
      "lat": 31.24032448758739,
      "lng": 121.52665947475461
    }
  },
  {
    "id": "lj-1769864157320-6318",
    "name": "御岛财富",
    "districtId": "chongming",
    "subDistrictId": "长兴岛",
    "price": 30000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 115-287㎡",
    "status": "在售",
    "features": [
      "江景",
      "河景",
      "临近高速",
      "公交直达"
    ],
    "description": "御岛财富位于崇明长兴岛，江景、河景、临近高速、公交直达",
    "image": "/images/projects/project_lj-1769864157320-6318_1769864157321_582.jpg",
    "developer": "",
    "address": "凤蓉路455弄",
    "coordinates": {
      "lat": 31.254862369124645,
      "lng": 121.50548897805406
    }
  },
  {
    "id": "lj-1769864157322-5122",
    "name": "新虹桥首府",
    "districtId": "songjiang",
    "subDistrictId": "九亭",
    "price": 82783,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 352-656㎡",
    "status": "在售",
    "features": [
      "河景",
      "临近高速",
      "公交直达",
      "综合商场"
    ],
    "description": "新虹桥首府位于松江九亭，河景、临近高速、公交直达、综合商场",
    "image": "/images/projects/project_lj-1769864157322-5122_1769864157322_10.jpg",
    "developer": "",
    "address": "涞坊路1080弄",
    "coordinates": {
      "lat": 31.267799715092963,
      "lng": 121.53876154722977
    }
  },
  {
    "id": "lj-1769864157324-6323",
    "name": "汇贤阁(别墅)",
    "districtId": "songjiang",
    "subDistrictId": "九亭",
    "price": 70000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 859-877㎡",
    "status": "在售",
    "features": [
      "近主干道",
      "临近高速",
      "综合商场",
      "公园"
    ],
    "description": "汇贤阁(别墅)位于松江九亭，近主干道、临近高速、综合商场、公园",
    "image": "/images/projects/project_lj-1769864157324-6323_1769864157324_594.jpg",
    "developer": "",
    "address": "上海市松江区涞坊路705号",
    "coordinates": {
      "lat": 31.27822697724145,
      "lng": 121.55383144557855
    }
  },
  {
    "id": "lj-1769864165016-3526",
    "name": "通用昱墅(海上兰乔别墅)",
    "districtId": "chongming",
    "subDistrictId": "崇明其它",
    "price": 36000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 404-636㎡",
    "status": "在售",
    "features": [
      "临近高速",
      "公交直达",
      "公园",
      "科技住宅"
    ],
    "description": "通用昱墅(海上兰乔别墅)位于崇明崇明其它，临近高速、公交直达、公园、科技住宅",
    "image": "/images/projects/project_lj-1769864165016-3526_1769864165016_274.jpg",
    "developer": "",
    "address": "港东公路66弄",
    "coordinates": {
      "lat": 31.296042979980758,
      "lng": 121.47732436251543
    }
  },
  {
    "id": "lj-1769864165018-1145",
    "name": "阳明花园广场",
    "districtId": "pudong",
    "subDistrictId": "外高桥",
    "price": 57500,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 75-183㎡",
    "status": "在售",
    "features": [
      "近地铁",
      "公交直达",
      "医疗配套",
      "综合商场"
    ],
    "description": "阳明花园广场位于浦东外高桥，近地铁、公交直达、医疗配套、综合商场",
    "image": "/images/projects/project_lj-1769864165018-1145_1769864165018_598.jpg",
    "developer": "",
    "address": "季景路333弄",
    "coordinates": {
      "lat": 31.300818148983616,
      "lng": 121.569628023208
    }
  },
  {
    "id": "lj-1769864165019-7325",
    "name": "东亚威尼斯公馆",
    "districtId": "chongming",
    "subDistrictId": "崇明新城",
    "price": 27999,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 54-154㎡",
    "status": "在售",
    "features": [
      "天然氧吧",
      "近主干道",
      "公交直达",
      "综合商场"
    ],
    "description": "东亚威尼斯公馆位于崇明崇明新城，天然氧吧、近主干道、公交直达、综合商场",
    "image": "/images/projects/project_lj-1769864165019-7325_1769864165019_411.jpg",
    "developer": "",
    "address": "乔松路750号",
    "coordinates": {
      "lat": 31.28612837213661,
      "lng": 121.50896308570468
    }
  },
  {
    "id": "lj-1769864165020-9908",
    "name": "圣和静安公馆",
    "districtId": "jingan",
    "subDistrictId": "西藏北路",
    "price": 133000,
    "priceUnit": "元/㎡(均价)",
    "area": 0,
    "areaRange": "建面 65-141㎡",
    "status": "在售",
    "features": [
      "公交直达",
      "视频看房"
    ],
    "description": "圣和静安公馆位于静安西藏北路，公交直达、视频看房",
     "image": "/images/projects/project_lj-1769864165020-9908_1769864165020_813.jpg",
     "developer": "",
     "address": "山西北路399弄",
     "coordinates": {
       "lat": 31.327059300712385,
       "lng": 121.51152449969949
     }
   },
   {
     "id": "lj-1769864165021-1773",
     "name": "水榭兰亭",
     "districtId": "fengxian",
     "subDistrictId": "奉城",
     "price": 25500,
     "priceUnit": "元/㎡(均价)",
     "area": 0,
     "areaRange": "建面 89-123㎡",
     "status": "在售",
     "features": [
       "公交直达",
       "公园",
       "现房",
       "成熟商圈"
     ],
     "description": "水榭兰亭位于奉贤奉城，公交直达、公园、现房、成熟商圈",
     "image": "/images/projects/project_lj-1769864165021-1773_1769864165021_568.jpg",
     "developer": "",
     "address": "奉贤区奉城镇浦兰路91弄19号",
     "coordinates": {
       "lat": 31.241882231621442,
       "lng": 121.56078869911418
     }
   },
   {
     "id": "lj-1769864165022-2750",
     "name": "禹洲东滩雍禧",
     "districtId": "chongming",
     "subDistrictId": "陈家镇",
     "price": 36000,
     "priceUnit": "元/㎡(均价)",
     "area": 0,
     "areaRange": "建面 109-120㎡",
     "status": "在售",
     "features": [
       "公交直达",
       "综合商场",
       "公园",
       "大三居"
     ],
     "description": "禹洲东滩雍禧位于崇明陈家镇，公交直达、综合商场、公园、大三居",
     "image": "/images/projects/project_lj-1769864165022-2750_1769864165022_567.jpg",
     "developer": "",
     "address": "北陈公路1568弄",
     "coordinates": {
       "lat": 31.248274427469244,
       "lng": 121.55973016994358
     }
   },
   {
     "id": "lj-1769864165024-6538",
     "name": "中铁北城时代",
     "districtId": "baoshan",
     "subDistrictId": "杨行",
     "price": 28000,
     "priceUnit": "元/㎡(均价)",
     "area": 0,
     "areaRange": "",
     "status": "在售",
     "features": [
       "公交直达",
       "综合商场",
       "公园",
       "现房"
     ],
     "description": "中铁北城时代位于宝山杨行，公交直达、综合商场、公园、现房",
     "image": "/images/projects/project_lj-1769864165024-6538_1769864165024_465.jpg",
     "developer": "",
     "address": "月辉路108弄",
     "coordinates": {
       "lat": 31.325684147018528,
       "lng": 121.47743898225843
     }
   },
   {
     "id": "lj-1769864165025-1253",
     "name": "泰禾海上院子",
     "districtId": "fengxian",
     "subDistrictId": "海湾",
     "price": 45000,
     "priceUnit": "元/㎡(均价)",
     "area": 0,
     "areaRange": "建面 99-188㎡",
     "status": "在售",
     "features": [
       "天然氧吧",
       "临近高速",
       "公交直达",
       "公园"
     ],
     "description": "泰禾海上院子位于奉贤海湾，天然氧吧、临近高速、公交直达、公园",
     "image": "/images/projects/project_lj-1769864165025-1253_1769864165025_453.jpg",
     "developer": "",
     "address": "海湾路1288弄",
     "coordinates": {
       "lat": 31.298035685855016,
       "lng": 121.54051872341685
     }
   },
   {
     "id": "lj-1769864165026-8143",
     "name": "东滩海上明月",
     "districtId": "chongming",
     "subDistrictId": "陈家镇",
     "price": 33600,
     "priceUnit": "元/㎡(均价)",
     "area": 0,
     "areaRange": "建面 95-150㎡",
     "status": "在售",
     "features": [
       "公园",
       "现房",
       "期房",
       "大三居"
     ],
     "description": "东滩海上明月位于崇明陈家镇，公园、现房、期房、大三居",
     "image": "/images/projects/project_lj-1769864165026-8143_1769864165026_131.jpg",
     "developer": "",
     "address": "陈家镇揽海路3弄",
     "coordinates": {
       "lat": 31.256963301142406,
       "lng": 121.4799375642598
     }
   },
   {
     "id": "lj-1769864165027-7764",
     "name": "信达上海院子",
     "districtId": "yangpu",
     "subDistrictId": "新江湾城",
     "price": 133130,
     "priceUnit": "元/㎡(均价)",
     "area": 0,
     "areaRange": "建面 989㎡",
     "status": "在售",
     "features": [
       "近地铁",
       "公交直达",
       "医疗配套",
       "综合商场"
     ],
     "description": "信达上海院子位于杨浦新江湾城，近地铁、公交直达、医疗配套、综合商场",
     "image": "/images/projects/project_lj-1769864165027-7764_1769864165027_990.jpg",
     "developer": "",
     "address": "江湾城路399弄",
     "coordinates": {
       "lat": 31.235533281174796,
       "lng": 121.50614995096235
     }
   }
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

export const addLianjiaProjects = (lianjiaProjects: NewHomeProject[]): NewHomeProject[] => {
  return [...newHomeProjects, ...lianjiaProjects];
};
