/**
 * 精选楼盘页面
 * 展示高端楼盘和热门项目
 */

import React, { useState, useEffect } from 'react';
import { Star, MapPin, Building2, ArrowRight, Filter, Search, Heart, GitCompare } from 'lucide-react';
import { NewHomeProject } from '../data/newHomes';
import { shanghaiDistricts } from '../data/districts';
import useScrollAnimation from '../hooks/useScrollAnimation';
import AnimatedCard from './AnimatedCard';
import { fetchProjects } from '../services/api';

interface FeaturedPropertiesProps {
  onProjectSelect: (project: NewHomeProject) => void;
  onNavigate: (view: string) => void;
  onFavorite: (project: NewHomeProject) => void;
  onAddToComparison: (project: NewHomeProject) => void;
  favorites: string[];
  activeFilter: string;
  onSetActiveFilter: (filter: string) => void;
}

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
  const [projects, setProjects] = useState<NewHomeProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);

  const ITEMS_PER_PAGE = 8;

  // 从API获取楼盘数据
  useEffect(() => {
    const loadProjects = async (page = 1, limit = ITEMS_PER_PAGE) => {
      setIsLoading(true);
      try {
        const response = await fetchProjects({ page, limit });
        if (response.success && response.data && response.data.list) {
          const formattedProjects = response.data.list.map((project: any) => {
            const district = shanghaiDistricts.find(d => d.id === project.districtId);
            return {
              id: project.id,
              name: project.name,
              districtId: project.districtId,
              subDistrictId: project.subDistrictId || project.subDistrict || '',
              price: project.price,
              priceUnit: project.priceUnit || '元/㎡',
              area: project.areaMin || project.areaMax || 0,
              areaRange: project.areaRange || '',
              status: project.status || '在售',
              features: project.features ? project.features.map((f: any) => f.feature) : project.tags || [],
              description: project.description || '',
              image: project.mainImage.startsWith('http') ? project.mainImage : `http://localhost:3001${project.mainImage}`,
              developer: project.developer || '',
              address: project.address || '',
              coordinates: project.coordinates || { lat: 0, lng: 0 }
            };
          });
          setProjects(formattedProjects);
          setTotalPages(response.data.totalPages || 1);
          setTotalProjects(response.data.total || 0);
        }
      } catch (error) {
        console.error('加载楼盘数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects(currentPage, ITEMS_PER_PAGE);
  }, [currentPage, activeFilter]);

  // 筛选和搜索功能
  const filteredProjects = projects;

  // 显示的楼盘数量
  const displayedProjects = filteredProjects;

  // 分页控制
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 重置页码当筛选变化时
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // 处理筛选变化
  const handleFilterChange = (filter: string) => {
    onSetActiveFilter(filter);
  };

  return (
    <div className="relative w-full h-full">
      {/* 背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
      </div>

      {/* 页面内容 */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20">
        {/* 标题区域 */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-white mb-2">
            精选<span className="text-orange-500">楼盘</span>
          </h1>
          <p className="text-gray-400">发现上海最值得关注的优质楼盘</p>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="flex flex-wrap items-start gap-2 sm:gap-3 mb-6 sm:mb-8">
          {/* 搜索框 */}
          <div className="relative flex-shrink-0 h-[36px]">
            <input
              type="text"
              placeholder="搜索楼盘..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[100px] sm:w-[110px] focus:w-[180px] sm:focus:w-[220px] px-4 py-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 focus:outline-none focus:border-orange-500 text-white placeholder-gray-400 text-sm transition-all duration-300 ease-out h-full"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* 筛选按钮 */}
          <div className="flex flex-wrap gap-2 flex-1 items-start">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                activeFilter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              全部区域
            </button>
            {shanghaiDistricts.map((district) => (
              <button
                key={district.id}
                onClick={() => handleFilterChange(district.id)}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  activeFilter === district.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {district.name}
              </button>
            ))}
          </div>
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">加载楼盘数据中...</p>
          </div>
        )}

        {/* 楼盘列表 */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProjects.map((project, index) => (
              <AnimatedCard
                key={project.id}
                delay={index * 100}
                className="card-hover"
              >
                <div
                  className="group relative bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-orange-500/10 h-full flex flex-col"
                  onClick={() => {
                    // 从API获取的项目数据中查找完整信息
                    const originalProject = projects.find(p => p.id === project.id);
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
                      features: project.features || [],
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
                    <span className="px-2.5 py-1 bg-orange-500/90 backdrop-blur-lg rounded-lg text-xs font-medium text-white shadow-lg">
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
                          // 从API获取的项目数据中查找完整信息
                          const originalProject = projects.find(p => p.id === project.id);
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
                      features: project.features || [],
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
                          // 从API获取的项目数据中查找完整信息
                          const originalProject = projects.find(p => p.id === project.id);
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
                      features: project.features || [],
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
                        <span className="line-clamp-1">{project.districtId} · {project.subDistrictId}</span>
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
                      {project.features.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-lg text-xs text-gray-400 hover:bg-white/10 transition-all"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.features.length > 3 && (
                        <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-lg text-xs text-gray-400">
                          +{project.features.length - 3}
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
        )}

        {/* 空状态 */}
        {!isLoading && displayedProjects.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">暂无符合条件的楼盘</p>
          </div>
        )}

        {/* 分页组件 */}
        {!isLoading && displayedProjects.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
            >
              上一页
            </button>
            
            {/* 页码按钮 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${currentPage === pageNum ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {/* 省略号 */}
            {totalPages > 5 && (
              <span className="px-4 py-2 text-gray-400">...</span>
            )}
            
            {/* 最后一页 */}
            {totalPages > 5 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${currentPage === totalPages ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'}`}
              >
                {totalPages}
              </button>
            )}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
            >
              下一页
            </button>
            
            {/* 页码信息 */}
            <div className="ml-4 text-gray-400 text-sm">
              第 {currentPage} / {totalPages} 页
            </div>
          </div>
        )}

        {/* 总项目数 */}
        {!isLoading && displayedProjects.length > 0 && (
          <div className="text-center mt-6 text-gray-400 text-sm">
            共 {totalProjects} 个楼盘
          </div>
        )}
      </div>

      {/* 装饰效果 */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default FeaturedProperties;