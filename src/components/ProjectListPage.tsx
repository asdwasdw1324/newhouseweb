/**
 * 楼盘列表页面组件
 * 组合筛选和列表功能
 */

import React, { useState, useMemo } from 'react';
import { NewHomeProject, newHomeProjects } from '../data/newHomes';
import ProjectFilter from './ProjectFilter';
import ProjectList from './ProjectList';
import { ArrowLeft } from 'lucide-react';

interface ProjectListPageProps {
  onBack: () => void;
  onProjectSelect: (project: NewHomeProject) => void;
  onFavorite: (project: NewHomeProject) => void;
  onAddToComparison: (project: NewHomeProject) => void;
  favorites: string[];
}

const ProjectListPage: React.FC<ProjectListPageProps> = ({
  onBack,
  onProjectSelect,
  onFavorite,
  onAddToComparison,
  favorites
}) => {
  const [filteredProjects, setFilteredProjects] = useState<NewHomeProject[]>(newHomeProjects);

  // 处理筛选变化
  const handleFilterChange = (projects: NewHomeProject[]) => {
    setFilteredProjects(projects);
  };

  // 处理重置筛选
  const handleResetFilter = () => {
    setFilteredProjects(newHomeProjects);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
      </div>

      {/* 页面内容 */}
      <div className="relative z-10 px-8 py-8">
        {/* 标题区域 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </button>
          <h1 className="text-3xl font-light text-white">
            楼盘<span className="text-orange-500">列表</span>
          </h1>
        </div>

        {/* 筛选和列表区域 */}
        <div className="space-y-8">
          {/* 筛选组件 */}
          <ProjectFilter
            projects={newHomeProjects}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilter}
          />

          {/* 列表组件 */}
          <ProjectList
            projects={filteredProjects}
            onProjectSelect={onProjectSelect}
            onFavorite={onFavorite}
            onAddToComparison={onAddToComparison}
            favorites={favorites}
          />
        </div>
      </div>

      {/* 装饰效果 */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default ProjectListPage;