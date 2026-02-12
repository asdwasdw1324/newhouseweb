/**
 * 楼盘列表组件
 * 显示筛选后的楼盘项目列表
 */

import React from 'react';
import { NewHomeProject } from '../data/newHomes';
import { Building2, MapPin, DollarSign, Ruler, Star, Calendar, Heart, Share2 } from 'lucide-react';

interface ProjectListProps {
  projects: NewHomeProject[];
  onProjectSelect: (project: NewHomeProject) => void;
  onFavorite: (project: NewHomeProject) => void;
  onAddToComparison: (project: NewHomeProject) => void;
  favorites: string[];
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onProjectSelect,
  onFavorite,
  onAddToComparison,
  favorites
}) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Building2 className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-400 mb-2">暂无符合条件的楼盘</h2>
        <p className="text-gray-500 max-w-md mb-6">
          请尝试调整筛选条件，或查看其他区域的楼盘项目
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 列表标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          楼盘列表 <span className="text-orange-500">({projects.length})</span>
        </h2>
        <div className="text-sm text-gray-400">
          共 {projects.length} 个楼盘
        </div>
      </div>

      {/* 楼盘卡片网格 - 响应式布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {projects.map((project) => {
          const isFavorite = favorites.includes(project.id);
          
          return (
            <div
              key={project.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer group h-full flex flex-col"
              onClick={() => onProjectSelect(project)}
            >
              {/* 项目图片 */}
              <div className="aspect-video relative bg-gray-800">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* 图片加载状态 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 bg-gray-900/50">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col items-end gap-1 sm:gap-2">
                  {/* 收藏按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite(project);
                    }}
                    className={`p-2 rounded-full transition-all min-w-touch min-h-touch ${
                      isFavorite
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-orange-500/30 hover:text-white'
                    }`}
                    title={isFavorite ? '取消收藏' : '添加收藏'}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  {/* 对比按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToComparison(project);
                    }}
                    className="p-2 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 hover:text-white transition-all min-w-touch min-h-touch"
                    title="添加到对比"
                  >
                    <Building2 className="w-4 h-4" />
                  </button>
                </div>
                {/* 项目状态 */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <span className={`px-2 sm:px-3 py-1 bg-black/70 backdrop-blur-lg rounded-lg text-xs font-medium ${
                    project.status === '在售'
                      ? 'text-green-400'
                      : project.status === '待售'
                      ? 'text-blue-400'
                      : 'text-gray-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* 项目信息 */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow">
                {/* 项目标题 */}
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-1">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{project.address}</span>
                </div>

                {/* 项目详情 */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 text-gray-300 text-xs sm:text-sm">
                    <DollarSign className="w-3 h-3 text-orange-500" />
                    <span>{project.price.toLocaleString()}{project.priceUnit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300 text-xs sm:text-sm">
                    <Ruler className="w-3 h-3 text-orange-500" />
                    <span>{project.areaRange}</span>
                  </div>
                </div>

                {/* 项目特色 */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {project.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                  {project.features.length > 2 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                      +{project.features.length - 2}
                    </span>
                  )}
                </div>

                {/* 开发商信息 */}
                <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                  <Calendar className="w-3 h-3" />
                  <span className="line-clamp-1">{project.developer}</span>
                </div>

                {/* 查看详情按钮 */}
                <button
                  className="w-full flex items-center justify-center gap-1 px-4 py-2 text-sm bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all mt-auto min-h-touch"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProjectSelect(project);
                  }}
                >
                  查看详情
                  <Star className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 分页（如果需要） */}
      {projects.length > 12 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all">
            上一页
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all">
            2
          </button>
          <button className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all">
            3
          </button>
          <button className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all">
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;