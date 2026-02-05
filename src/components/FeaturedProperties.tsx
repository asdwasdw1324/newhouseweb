/**
 * 精选楼盘页面
 * 展示高端楼盘和热门项目
 */

import React, { useState, useEffect } from 'react';
import { Star, MapPin, Building2, ArrowRight, Filter, Search, Heart, GitCompare } from 'lucide-react';
import { NewHomeProject, newHomeProjects } from '../data/newHomes';
import { shanghaiDistricts } from '../data/districts';
import useScrollAnimation from '../hooks/useScrollAnimation';
import AnimatedCard from './AnimatedCard';

interface FeaturedPropertiesProps {
  onProjectSelect: (project: NewHomeProject) => void;
  onNavigate: (view: string) => void;
  onFavorite: (project: NewHomeProject) => void;
  onAddToComparison: (project: NewHomeProject) => void;
  favorites: string[];
  activeFilter: string;
  onSetActiveFilter: (filter: string) => void;
}

// 从链家数据中获取精选楼盘
const featuredProjects = newHomeProjects.map(project => {
  // 查找对应的行政区名称
  const district = shanghaiDistricts.find(d => d.id === project.districtId);
  const districtName = district?.name || '';
  
  return {
    id: project.id,
    name: project.name,
    district: districtName,
    subDistrict: project.subDistrictId,
    price: project.price,
    areaRange: project.areaRange,
    image: project.image,
    tags: project.features,
    description: project.description,
  };
});

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ 
  onProjectSelect, 
  onNavigate, 
  onFavorite, 
  onAddToComparison,
  favorites,
  activeFilter,
  onSetActiveFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // 根据窗口大小动态调整每页显示数量
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 640) {
          setItemsPerPage(4); // 移动设备：2排2列
        } else if (width < 1024) {
          setItemsPerPage(6); // 平板设备：2排3列
        } else {
          setItemsPerPage(8); // 桌面设备：2排4列
        }
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // 生成包含所有上海行政区的筛选器
  const filters = [
    { id: 'all', label: '全部' },
    ...shanghaiDistricts.map(district => ({
      id: district.id,
      label: district.name
    }))
  ];

  const filteredProjects = featuredProjects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.subDistrict.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 修复分类逻辑：使用项目中的districtId而不是district名称进行匹配
    const projectDistrict = newHomeProjects.find(p => p.id === project.id)?.districtId;
    const matchesFilter = activeFilter === 'all' || projectDistrict === activeFilter;
    
    console.log('Filtering project:', project.name, 'projectDistrict:', projectDistrict, 'activeFilter:', activeFilter, 'matchesFilter:', matchesFilter);
    
    return matchesSearch && matchesFilter;
  });

  // 分页逻辑
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  // 搜索框聚焦状态
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  return (
    <div className="relative w-full h-full">
      {/* 背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
      </div>

      {/* 页面内容 */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20">
        {/* 搜索和筛选 - 同一行布局 */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
            {/* 搜索框 - 可展开 */}
            <div 
              className={`relative transition-all duration-300 ease-out w-full sm:w-48 md:w-64 lg:w-80`}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索楼盘..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-all"
              />
            </div>

            {/* 筛选标签 - 支持横向滚动 */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => onSetActiveFilter(filter.id)}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap text-xs sm:text-sm transition-all ${
                    activeFilter === filter.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 楼盘列表 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {currentProjects.map((project, index) => (
            <AnimatedCard
              key={project.id}
              delay={index * 100}
              className="card-hover"
            >
            <div
              className="group relative bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-orange-500/10 h-full flex flex-col"
              onClick={() => {
                // 从原始项目数据中查找完整信息
                const originalProject = newHomeProjects.find(p => p.id === project.id);
                const fullProject: NewHomeProject = {
                  id: project.id,
                  name: project.name,
                  districtId: originalProject?.districtId || '',
                  subDistrictId: originalProject?.subDistrictId || '',
                  price: project.price,
                  priceUnit: '元/㎡',
                  area: originalProject?.area || 0,
                  areaRange: project.areaRange,
                  status: originalProject?.status || '在售',
                  features: project.tags,
                  description: project.description,
                  image: project.image,
                  developer: originalProject?.developer || '',
                  address: originalProject?.address || '',
                  coordinates: originalProject?.coordinates || { lat: 0, lng: 0 },
                };
                onProjectSelect(fullProject);
                onNavigate('project-detail');
              }}
            >
              {/* 新品标签 */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-xs font-medium text-white shadow-lg">
                  精选推荐
                </span>
              </div>
              {/* 图片区域 */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-800">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                {/* 图片加载状态 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 bg-gray-900/50">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <span className="px-2.5 py-1 bg-orange-500/90 backdrop-blur-lg rounded-lg text-xs font-medium text-white shadow-lg">
                    {project.price.toLocaleString()} 元/㎡
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2" style={{ top: '36px' }}>
                  {/* 收藏按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // 从原始项目数据中查找完整信息
                      const originalProject = newHomeProjects.find(p => p.id === project.id);
                      const fullProject: NewHomeProject = {
                        id: project.id,
                        name: project.name,
                        districtId: originalProject?.districtId || '',
                        subDistrictId: originalProject?.subDistrictId || '',
                        price: project.price,
                        priceUnit: '元/㎡',
                        area: originalProject?.area || 0,
                        areaRange: project.areaRange,
                        status: originalProject?.status || '在售',
                        features: project.tags,
                        description: project.description,
                        image: project.image,
                        developer: originalProject?.developer || '',
                        address: originalProject?.address || '',
                        coordinates: originalProject?.coordinates || { lat: 0, lng: 0 },
                      };
                      onFavorite(fullProject);
                    }}
                    className={`p-2 rounded-full transition-all ${
                      favorites.includes(project.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-black/50 text-white hover:bg-red-500/80'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(project.id) ? 'fill-current' : ''}`} />
                  </button>
                  {/* 对比按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // 从原始项目数据中查找完整信息
                      const originalProject = newHomeProjects.find(p => p.id === project.id);
                      const fullProject: NewHomeProject = {
                        id: project.id,
                        name: project.name,
                        districtId: originalProject?.districtId || '',
                        subDistrictId: originalProject?.subDistrictId || '',
                        price: project.price,
                        priceUnit: '元/㎡',
                        area: originalProject?.area || 0,
                        areaRange: project.areaRange,
                        status: originalProject?.status || '在售',
                        features: project.tags,
                        description: project.description,
                        image: project.image,
                        developer: originalProject?.developer || '',
                        address: originalProject?.address || '',
                        coordinates: originalProject?.coordinates || { lat: 0, lng: 0 },
                      };
                      onAddToComparison(fullProject);
                    }}
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-blue-500/80 transition-all"
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium">
                    <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-orange-400" />
                    <span className="line-clamp-1">{project.district} · {project.subDistrict}</span>
                  </div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-orange-400 transition-colors duration-300 line-clamp-1">
                  {project.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-lg text-xs text-gray-400 hover:bg-white/10 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-lg text-xs text-gray-400">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                    <Building2 className="w-3 sm:w-4 h-3 sm:h-4 text-orange-400/70" />
                    <span>{project.areaRange}</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-400 text-xs sm:text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                    <span>查看详情</span>
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
            </AnimatedCard>
          ))}
        </div>

        {/* 空状态 */}
        {currentProjects.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">暂无符合条件的楼盘</p>
          </div>
        )}

        {/* 分页组件 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                首页
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              {/* 页码按钮 */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else {
                  if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }
                }
                return pageNumber;
              }).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === pageNumber
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              
              {/* 省略号 */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-4 py-2 text-gray-400">...</span>
              )}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                末页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 装饰效果 */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default FeaturedProperties;
