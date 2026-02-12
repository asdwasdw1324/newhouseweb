/**
 * 上海地图组件 - 增强版
 * 全屏地图 + 点击区域放大 + 右侧弹出楼盘列表
 */

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { shanghaiDistricts, District, SubDistrict } from '../data/districts';
import { newHomeProjects } from '../data/newHomes';
import { MapPin, Building2, X, Filter, ArrowUpDown, Clock, Grid3x3, ChevronRight } from 'lucide-react';

interface HeatData {
  districtId: string;
  priceLevel: number;
  salesVolume: number;
  projectCount: number;
  growthRate: number;
}

const heatData: HeatData[] = [
  { districtId: 'pudong', priceLevel: 4, salesVolume: 120, projectCount: 45, growthRate: 2.5 },
  { districtId: 'minhang', priceLevel: 3, salesVolume: 95, projectCount: 38, growthRate: 4.2 },
  { districtId: 'xuhui', priceLevel: 4, salesVolume: 88, projectCount: 32, growthRate: 2.9 },
  { districtId: 'changning', priceLevel: 4, salesVolume: 76, projectCount: 28, growthRate: 2.2 },
  { districtId: 'huangpu', priceLevel: 5, salesVolume: 65, projectCount: 22, growthRate: 1.8 },
  { districtId: 'putuo', priceLevel: 3, salesVolume: 82, projectCount: 30, growthRate: 3.5 },
  { districtId: 'hongkou', priceLevel: 3, salesVolume: 70, projectCount: 26, growthRate: 1.9 },
  { districtId: 'yangpu', priceLevel: 3, salesVolume: 85, projectCount: 31, growthRate: 2.1 },
  { districtId: 'baoshan', priceLevel: 2, salesVolume: 105, projectCount: 40, growthRate: 3.8 },
  { districtId: 'jiading', priceLevel: 2, salesVolume: 98, projectCount: 36, growthRate: 4.5 },
  { districtId: 'songjiang', priceLevel: 2, salesVolume: 92, projectCount: 34, growthRate: 4.1 },
  { districtId: 'qingpu', priceLevel: 2, salesVolume: 85, projectCount: 31, growthRate: 3.9 },
  { districtId: 'fengxian', priceLevel: 1, salesVolume: 78, projectCount: 29, growthRate: 5.2 },
  { districtId: 'chongming', priceLevel: 1, salesVolume: 62, projectCount: 24, growthRate: 4.8 },
  { districtId: 'jingan', priceLevel: 5, salesVolume: 70, projectCount: 25, growthRate: 2.5 },
  { districtId: 'jinshan', priceLevel: 1, salesVolume: 65, projectCount: 27, growthRate: 4.3 },
];

const getHeatData = (districtId: string): HeatData => {
  return heatData.find(data => data.districtId === districtId) || {
    districtId,
    priceLevel: 1,
    salesVolume: 0,
    projectCount: 0,
    growthRate: 0
  };
};

const getHeatColor = (priceLevel: number): string => {
  const colors = [
    '#10b981',
    '#3b82f6',
    '#ec4899',
    '#f97316',
    '#9f7aea'
  ];
  return colors[Math.min(priceLevel - 1, colors.length - 1)];
};

interface ShanghaiMapProps {
  onDistrictSelect: (district: District) => void;
  onSubDistrictSelect: (districtId: string, subDistrict: SubDistrict) => void;
  selectedDistrict?: District;
}

const ShanghaiMap: React.FC<ShanghaiMapProps> = ({
  onDistrictSelect,
  onSubDistrictSelect,
  selectedDistrict: externalSelectedDistrict,
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [showProjectList, setShowProjectList] = useState(false);
  const [showSubDistrictCard, setShowSubDistrictCard] = useState(false);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string | null>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [areaFilter, setAreaFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | '在售' | '待售'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'area' | 'latest'>('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showProjectDetail, setShowProjectDetail] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  const chartRef = useRef<ReactECharts>(null);
  const selectedDistrict = externalSelectedDistrict || shanghaiDistricts.find(d => d.id === selectedDistrictId);

  useEffect(() => {
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/310000_full.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch map data');
        return res.json();
      })
      .then(data => {
        setMapData(data);
        echarts.registerMap('shanghai', data);
      })
      .catch(err => {
        console.error('Failed to load map data:', err);
        setMapData({ features: [] });
      });
  }, []);

  const handleDistrictClick = useCallback((districtId: string) => {
    // 将中文区域名称转换为对应的英文ID
    const districtNames: Record<string, string> = {
      '黄浦区': 'huangpu',
      '徐汇区': 'xuhui',
      '长宁区': 'changning',
      '静安区': 'jingan',
      '普陀区': 'putuo',
      '虹口区': 'hongkou',
      '杨浦区': 'yangpu',
      '闵行区': 'minhang',
      '宝山区': 'baoshan',
      '浦东新区': 'pudong',
      '金山区': 'jinshan',
      '松江区': 'songjiang',
      '青浦区': 'qingpu',
      '奉贤区': 'fengxian',
      '崇明区': 'chongming',
    };
    
    // 获取对应的英文ID
    const englishDistrictId = districtNames[districtId] || districtId;
    
    setSelectedDistrictId(englishDistrictId);
    setShowSubDistrictCard(true);
    setSelectedSubDistrict(null);
    setCurrentPage(1);
    setShowSubDistrictProjects(false);
    setSelectedSubDistrictName(null);
    
    if (chartRef.current) {
      const chart = chartRef.current.getEchartsInstance();
      chart.dispatchAction({
        type: 'geoSelect',
        name: districtId,
      });
    }
  }, []);

  const handleClosePanel = useCallback(() => {
    setShowProjectList(false);
    setSelectedDistrictId(null);
  }, []);

  const handleProjectClick = useCallback((project: any) => {
    setShowProjectDetail(project);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowProjectDetail(null);
  }, []);

  const [selectedSubDistrictName, setSelectedSubDistrictName] = useState<string | null>(null);
  const [showSubDistrictProjects, setShowSubDistrictProjects] = useState(false);

  const handleSubDistrictClick = useCallback((subDistrictId: string) => {
    setSelectedSubDistrict(subDistrictId);
    
    // 查找板块名称
    const subDistrict = selectedDistrict?.subDistricts.find(sd => sd.id === subDistrictId);
    if (subDistrict) {
      setSelectedSubDistrictName(subDistrict.name);
    }
    
    // 在卡片内显示对应楼盘，而非跳转到右侧面板
    setShowSubDistrictProjects(true);
  }, [selectedDistrict]);

  const handleCloseSubDistrictCard = useCallback(() => {
    setShowSubDistrictCard(false);
    setSelectedDistrictId(null);
    setSelectedSubDistrict(null);
    setSelectedSubDistrictName(null);
    setShowSubDistrictProjects(false);
  }, []);

  const projectsInSelectedDistrict = useMemo(() => {
    if (!selectedDistrict) return [];
    
    let filtered = newHomeProjects.filter(p => p.districtId === selectedDistrict.id);
    
    // 如果选中了板块，进一步过滤
    if (selectedSubDistrictName) {
      filtered = filtered.filter(p => p.subDistrictId.includes(selectedSubDistrictName));
    }
    
    if (priceFilter !== 'all') {
      if (priceFilter === 'low') {
        filtered = filtered.filter(p => p.price < 40000);
      } else if (priceFilter === 'medium') {
        filtered = filtered.filter(p => p.price >= 40000 && p.price < 60000);
      } else if (priceFilter === 'high') {
        filtered = filtered.filter(p => p.price >= 60000);
      }
    }
    
    if (areaFilter !== 'all') {
      if (areaFilter === 'small') {
        filtered = filtered.filter(p => p.areaRange.includes('81-') || p.areaRange.includes('90-'));
      } else if (areaFilter === 'medium') {
        filtered = filtered.filter(p => p.areaRange.includes('100-') || p.areaRange.includes('120-'));
      } else if (areaFilter === 'large') {
        filtered = filtered.filter(p => p.areaRange.includes('140-') || p.areaRange.includes('160-'));
      }
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    if (sortBy === 'price') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'area') {
      filtered = filtered.sort((a, b) => {
        const getArea = (range: string) => {
          const match = range.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };
        return getArea(b.areaRange) - getArea(a.areaRange);
      });
    } else {
      filtered = filtered.sort((a, b) => new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime());
    }
    
    return filtered;
  }, [selectedDistrict, selectedSubDistrictName, priceFilter, areaFilter, statusFilter, sortBy]);

  const currentDistrictHeat = selectedDistrict ? getHeatData(selectedDistrict.id) : null;
  const projectsPerPage = 8;
  const totalPages = Math.ceil(projectsInSelectedDistrict.length / projectsPerPage);
  const displayedProjects = projectsInSelectedDistrict.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const getOption = useMemo(() => {
    if (!mapData) return {};

    const districtNames: Record<string, string> = {
      '310101': '黄浦区',
      '310104': '徐汇区',
      '310105': '长宁区',
      '310106': '静安区',
      '310107': '普陀区',
      '310109': '虹口区',
      '310110': '杨浦区',
      '310112': '闵行区',
      '310113': '宝山区',
      '310114': '嘉定区',
      '310115': '浦东新区',
      '310116': '金山区',
      '310117': '松江区',
      '310118': '青浦区',
      '310120': '奉贤区',
      '310151': '崇明区',
    };

    const districtIdMapping: Record<string, string> = {
      '310101': 'huangpu',
      '310104': 'xuhui',
      '310105': 'changning',
      '310106': 'jingan',
      '310107': 'putuo',
      '310109': 'hongkou',
      '310110': 'yangpu',
      '310112': 'minhang',
      '310113': 'baoshan',
      '310114': 'jiading',
      '310115': 'pudong',
      '310116': 'jinshan',
      '310117': 'songjiang',
      '310118': 'qingpu',
      '310120': 'fengxian',
      '310151': 'chongming',
    };

    const data = mapData.features.map((feature: any) => {
      const adcode = feature.properties.adcode;
      const districtId = districtIdMapping[adcode];
      const heat = getHeatData(districtId);
      const isSelected = selectedDistrictId === districtId;
      return {
        name: districtNames[adcode] || feature.properties.name,
        value: heat.priceLevel,
        itemStyle: {
          areaColor: getHeatColor(heat.priceLevel),
          opacity: isSelected ? 1 : 0.6,
          borderWidth: isSelected ? 3 : 1,
          borderColor: isSelected ? '#f97316' : 'rgba(255, 255, 255, 0.3)',
        },
        emphasis: {
          itemStyle: {
            areaColor: '#f97316',
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 20,
            shadowColor: 'rgba(249, 115, 22, 0.5)',
          },
        },
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const adcode = params.data?.adcode;
          const districtId = districtIdMapping[adcode];
          const heat = getHeatData(districtId);
          const projects = newHomeProjects.filter(p => p.districtId === districtId);
          return `
            <div style="padding: 12px; background: rgba(0,0,0,0.9); border-radius: 8px; border: 1px solid #f97316;">
              <div style="font-weight: bold; color: #fff; margin-bottom: 8px;">${params.name}</div>
              <div style="color: #f97316; font-size: 14px;">均价水平: ${heat.priceLevel}/5</div>
              <div style="color: #3b82f6; font-size: 14px;">在售项目: ${projects.length}个</div>
              <div style="color: #10b981; font-size: 14px;">成交量: ${heat.salesVolume}套</div>
            </div>
          `;
        },
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderColor: '#f97316',
        textStyle: {
          color: '#fff',
        },
      },
      geo: {
        map: 'shanghai',
        roam: true,
        zoom: 1.2,
        scaleLimit: {
          min: 1.0,
          max: 3.0
        },
        label: {
          show: true,
          color: '#fff',
          fontSize: 12,
          fontWeight: 500,
        },
        itemStyle: {
          areaColor: '#1f2937',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: '#f97316',
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 20,
            shadowColor: 'rgba(249, 115, 22, 0.5)',
          },
          label: {
            show: true,
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
      },
      series: [
        {
          type: 'map',
          geoIndex: 0,
          data: data,
        },
      ],
    };
  }, [mapData, selectedDistrictId]);

  const onEvents = useMemo(() => ({
    click: (params: any) => {
      const districtId = params.name;
      handleDistrictClick(districtId);
    },
  }), [handleDistrictClick]);

  if (!mapData) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-400">加载地图数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

      <div className="absolute inset-0 flex items-center justify-center">
        <ReactECharts
          ref={chartRef}
          option={getOption}
          onEvents={onEvents}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>

      {showProjectList && selectedDistrict && (
        <div className="absolute top-4 right-4 bottom-4 w-[400px] bg-black/90 backdrop-blur-xl rounded-2xl border border-orange-500/30 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedDistrict.name}</h3>
                <p className="text-xs text-gray-400">{selectedDistrict.nameEn}</p>
              </div>
            </div>
            <button
              onClick={handleClosePanel}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex border-b border-white/10">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                !showFilters ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              筛选
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                showFilters ? 'text-gray-400 hover:text-white' : 'text-orange-400 border-b-2 border-orange-400'
              }`}
            >
              楼盘列表 ({projectsInSelectedDistrict.length})
            </button>
          </div>

          {showFilters ? (
            <div className="p-4 border-b border-white/10">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-2">价格区间</p>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: '全部' },
                      { id: 'low', label: '4万以下' },
                      { id: 'medium', label: '4-6万' },
                      { id: 'high', label: '6万以上' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setPriceFilter(item.id as any)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all ${
                          priceFilter === item.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-2">户型面积</p>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: '全部' },
                      { id: 'small', label: '90㎡以下' },
                      { id: 'medium', label: '90-120㎡' },
                      { id: 'large', label: '120㎡以上' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAreaFilter(item.id as any)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all ${
                          areaFilter === item.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-2">销售状态</p>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: '全部' },
                      { id: '在售', label: '在售' },
                      { id: '待售', label: '待售' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setStatusFilter(item.id as any)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all ${
                          statusFilter === item.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-2">排序</p>
                  <div className="flex gap-2">
                    {[
                      { id: 'latest', label: '最新' },
                      { id: 'price', label: '价格' },
                      { id: 'area', label: '面积' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSortBy(item.id as any)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all ${
                          sortBy === item.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPriceFilter('all');
                    setAreaFilter('all');
                    setStatusFilter('all');
                  }}
                  className="w-full px-4 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  重置筛选
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {displayedProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/10"
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white truncate">{project.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        project.status === '在售' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mb-1">{project.subDistrictId}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.areaRange}
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3" />
                        {project.floorRange}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-orange-400">
                      ¥{project.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">/㎡</p>
                  </div>
                </div>
              ))}
              
              {projectsInSelectedDistrict.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无符合条件的楼盘</p>
                </div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="p-4 border-t border-white/10 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
              >
                上一页
              </button>
              <span className="text-sm text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      )}

      {showProjectDetail && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-orange-500/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{showProjectDetail.name}</h3>
                <button
                  onClick={handleCloseDetail}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <img
                src={showProjectDetail.image}
                alt={showProjectDetail.name}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-400 mb-1">价格</p>
                  <p className="text-lg font-bold text-orange-400">
                    ¥{showProjectDetail.price.toLocaleString()}/㎡
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">状态</p>
                  <span className={`text-sm px-3 py-1 rounded ${
                    showProjectDetail.status === '在售' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {showProjectDetail.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">户型</p>
                  <p className="text-sm text-white">{showProjectDetail.areaRange}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">楼层</p>
                  <p className="text-sm text-white">{showProjectDetail.floorRange}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6">{showProjectDetail.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseDetail}
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    handleCloseDetail();
                    onSubDistrictSelect(selectedDistrict.id, selectedDistrict.subDistricts[0]);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all"
                >
                  查看更多
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-lg rounded-lg px-4 py-2 text-xs text-gray-400">
        点击区域查看楼盘 · 滚轮缩放地图
      </div>

      {showSubDistrictCard && selectedDistrict && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-orange-500/30 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in duration-300">
            {/* 卡片头部 */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedDistrict.name}</h3>
                      <p className="text-sm text-gray-400">{selectedDistrict.description}</p>
                    </div>
                  </div>
                  
                  {/* 区域核心数据 */}
                  {currentDistrictHeat && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">均价水平</p>
                        <p className="text-lg font-semibold text-orange-400">{currentDistrictHeat.priceLevel}/5</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">在售项目</p>
                        <p className="text-lg font-semibold text-blue-400">{currentDistrictHeat.projectCount}个</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">成交量</p>
                        <p className="text-lg font-semibold text-green-400">{currentDistrictHeat.salesVolume}套</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">增长率</p>
                        <p className="text-lg font-semibold text-purple-400">{currentDistrictHeat.growthRate}%</p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCloseSubDistrictCard}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-orange-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                选择板块查看对应楼盘信息
              </p>
            </div>
            
            {/* 卡片内容 */}
            <div className="p-6">
              {/* 板块列表 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-medium text-white">{selectedDistrict.name}板块</h4>
                  <span className="text-sm text-gray-400">共{selectedDistrict.subDistricts.length}个板块</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedDistrict.subDistricts.map((subDistrict) => {
                    // 计算板块内楼盘数量
                    const subDistrictProjects = newHomeProjects.filter(p => 
                      p.districtId === selectedDistrict.id && 
                      p.subDistrictId.includes(subDistrict.name)
                    );
                    
                    // 计算平均价格
                    const avgPrice = subDistrictProjects.length > 0 
                      ? Math.round(subDistrictProjects.reduce((sum, p) => sum + p.price, 0) / subDistrictProjects.length)
                      : 0;
                    
                    return (
                      <div
                        key={subDistrict.id}
                        onClick={() => handleSubDistrictClick(subDistrict.id)}
                        className="bg-white/5 rounded-xl border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer group overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/10 flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-500/20 transition-all">
                              <MapPin className="w-5 h-5 text-orange-400" />
                            </div>
                            <h4 className="text-lg font-medium text-white group-hover:text-orange-400 transition-colors">
                              {subDistrict.name}
                            </h4>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{subDistrict.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">楼盘数量</span>
                              <span className="text-sm font-medium text-white">{subDistrictProjects.length}个</span>
                            </div>
                            {avgPrice > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">平均价格</span>
                                <span className="text-sm font-medium text-orange-400">¥{avgPrice.toLocaleString()}/㎡</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-gray-500">点击查看详情</span>
                            <ChevronRight className="w-5 h-5 text-orange-500/50 group-hover:text-orange-400 transition-all transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 热门楼盘推荐 */}
              {projectsInSelectedDistrict.length > 0 && (
                <div className="mt-10 border-t border-white/10 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-medium text-white">热门楼盘推荐</h4>
                    <span className="text-sm text-gray-400">共{projectsInSelectedDistrict.length}个楼盘</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projectsInSelectedDistrict.slice(0, 6).map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project)}
                        className="bg-white/5 rounded-xl border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all cursor-pointer group overflow-hidden"
                      >
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors truncate">
                              {project.name}
                            </h5>
                            <span className={`text-xs px-2 py-0.5 rounded ${project.status === '在售' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 truncate mb-3">{project.subDistrictId}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-orange-400">
                              ¥{project.price.toLocaleString()}/㎡
                            </p>
                            <span className="text-xs text-gray-400">{project.areaRange}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 板块楼盘显示 */}
              {showSubDistrictProjects && selectedSubDistrictName && (
                <div className="mt-10 border-t border-white/10 pt-8 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-medium text-white">{selectedSubDistrictName}板块楼盘</h4>
                      <p className="text-sm text-gray-400">共{projectsInSelectedDistrict.length}个楼盘</p>
                    </div>
                    <button
                      onClick={() => setShowSubDistrictProjects(false)}
                      className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      返回板块列表
                    </button>
                  </div>
                  
                  {/* 筛选和排序 */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-2">价格区间</p>
                        <div className="flex gap-2">
                          {[
                            { id: 'all', label: '全部' },
                            { id: 'low', label: '4万以下' },
                            { id: 'medium', label: '4-6万' },
                            { id: 'high', label: '6万以上' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setPriceFilter(item.id as any)}
                              className={`px-2 py-1 rounded text-xs transition-all ${priceFilter === item.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2">排序方式</p>
                        <div className="flex gap-2">
                          {[
                            { id: 'latest', label: '最新' },
                            { id: 'price', label: '价格' },
                            { id: 'area', label: '面积' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setSortBy(item.id as any)}
                              className={`px-2 py-1 rounded text-xs transition-all ${sortBy === item.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 楼盘列表 */}
                  {projectsInSelectedDistrict.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projectsInSelectedDistrict.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => handleProjectClick(project)}
                          className="bg-white/5 rounded-xl border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all cursor-pointer group overflow-hidden"
                        >
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors truncate">
                                {project.name}
                              </h5>
                              <span className={`text-xs px-2 py-0.5 rounded ${project.status === '在售' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {project.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 truncate mb-3">{project.subDistrictId}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold text-orange-400">
                                ¥{project.price.toLocaleString()}/㎡
                              </p>
                              <span className="text-xs text-gray-400">{project.areaRange}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/5 rounded-xl">
                      <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">该板块暂无楼盘数据</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* 底部按钮 */}
              {!showSubDistrictProjects && (
                <div className="mt-10 flex justify-between">
                  <button
                    onClick={handleCloseSubDistrictCard}
                    className="px-6 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    关闭
                  </button>
                  <button
                    onClick={() => {
                      handleCloseSubDistrictCard();
                      onDistrictSelect(selectedDistrict);
                    }}
                    className="px-6 py-3 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    查看全部楼盘
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default ShanghaiMap;
