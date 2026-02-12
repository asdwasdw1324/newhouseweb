/**
 * 楼盘对比组件
 * 允许用户选择多个楼盘进行详细参数对比
 */

import React, { useState, useCallback } from 'react';
import { NewHomeProject } from '../data/newHomes';
import { X, BarChart3, Check, Star, MapPin, Home, DollarSign, Ruler, Building2, Calendar } from 'lucide-react';

interface ProjectComparisonProps {
  initialProjects?: NewHomeProject[];
  onRemove?: (projectId: string) => void;
  onClear?: () => void;
}

const ProjectComparison: React.FC<ProjectComparisonProps> = ({ initialProjects = [], onRemove, onClear }) => {
  const [comparisonList, setComparisonList] = useState<NewHomeProject[]>(initialProjects);

  const handleRemoveProject = useCallback((projectId: string) => {
    setComparisonList((prev) => prev.filter((project) => project.id !== projectId));
  }, []);

  const getFeatureIcons = (features: string[]) => {
    const iconMap: Record<string, React.ReactNode> = {
      '江景房': <Home className="w-4 h-4" />,
      '顶级装修': <Star className="w-4 h-4" />,
      '智能家居': <Building2 className="w-4 h-4" />,
      '地铁房': <MapPin className="w-4 h-4" />,
      '学区房': <Star className="w-4 h-4" />,
      '商业配套': <DollarSign className="w-4 h-4" />,
      '生态环境': <Home className="w-4 h-4" />,
    };

    return features.map((feature, index) => (
      <span key={index} className="flex items-center gap-1 text-xs text-gray-400">
        {iconMap[feature] || <Check className="w-4 h-4" />}
        {feature}
      </span>
    ));
  };

  if (comparisonList.length === 0) {
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
            <h1 className="text-3xl font-light text-white">
              楼盘<span className="text-orange-500">对比</span>
            </h1>
          </div>

          {/* 空状态 */}
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <BarChart3 className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">暂无对比楼盘</h2>
            <p className="text-gray-500 text-center mb-8 max-w-md">
              请从楼盘列表中选择要对比的项目，最多可同时对比4个楼盘
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* 背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
      </div>

      {/* 页面内容 */}
        <div className="relative z-10 px-8 py-8 pb-20">
          {/* 标题区域 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-light text-white">
                楼盘<span className="text-orange-500">对比</span>
              </h1>
            </div>
            <div className="text-gray-400 text-sm">
              {comparisonList.length} / 4 个楼盘
            </div>
          </div>

        {/* 对比表格 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* 楼盘名称行 */}
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-6 text-left text-gray-400 font-normal">对比项</th>
                {comparisonList.map((project) => (
                  <th key={project.id} className="py-4 px-6 text-center relative">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleRemoveProject(project.id)}
                        className="absolute top-0 right-0 p-2 hover:bg-white/10 rounded-full transition-all"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <h3 className="text-lg font-semibold text-white max-w-[200px] truncate">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {project.districtId} · {project.subDistrictId}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* 价格 */}
              <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>价格</span>
                  </div>
                </td>
                {comparisonList.map((project) => (
                  <td key={project.id} className="py-4 px-6 text-center">
                    <p className="text-xl font-bold text-orange-400">
                      {project.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{project.priceUnit}</p>
                  </td>
                ))}
              </tr>

              {/* 面积 */}
              <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Ruler className="w-4 h-4" />
                    <span>面积</span>
                  </div>
                </td>
                {comparisonList.map((project) => (
                  <td key={project.id} className="py-4 px-6 text-center">
                    <p className="text-lg font-semibold text-white">
                      {project.area}㎡
                    </p>
                    <p className="text-xs text-gray-400">{project.areaRange}</p>
                  </td>
                ))}
              </tr>

              {/* 状态 */}
              <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>状态</span>
                  </div>
                </td>
                {comparisonList.map((project) => (
                  <td key={project.id} className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === '在售' ? 'bg-green-400/20 text-green-400' :
                      project.status === '待售' ? 'bg-blue-400/20 text-blue-400' :
                      'bg-gray-400/20 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* 开发商 */}
              <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Building2 className="w-4 h-4" />
                    <span>开发商</span>
                  </div>
                </td>
                {comparisonList.map((project) => (
                  <td key={project.id} className="py-4 px-6 text-center">
                    <p className="text-sm text-white max-w-[200px] mx-auto">
                      {project.developer}
                    </p>
                  </td>
                ))}
              </tr>

              {/* 地址 */}
              <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>地址</span>
                  </div>
                </td>
                {comparisonList.map((project) => (
                  <td key={project.id} className="py-4 px-6 text-center">
                    <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                      {project.address}
                    </p>
                  </td>
                ))}
              </tr>

              {/* 特色 */}
              <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Star className="w-4 h-4" />
                    <span>特色</span>
                  </div>
                </td>
                {comparisonList.map((project) => (
                  <td key={project.id} className="py-4 px-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {getFeatureIcons(project.features.slice(0, 3))}
                      {project.features.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{project.features.length - 3} 更多
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* 描述 */}
              <tr className="hover:bg-white/5 transition-all">
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Home className="w-4 h-4" />
                    <span>描述</span>
                  </div>
                </td>
                {comparisonList.map((project) => (
                  <td key={project.id} className="py-4 px-6 text-center">
                    <p className="text-xs text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                      {project.description}
                    </p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* 对比分析 */}
        <div className="mt-12 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">对比分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">价格对比</h4>
              <div className="h-32 bg-white/5 rounded-lg flex items-end gap-4 p-4">
                {comparisonList.map((project, index) => {
                  const maxPrice = Math.max(...comparisonList.map(p => p.price));
                  const height = (project.price / maxPrice) * 100;
                  
                  return (
                    <div key={project.id} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${height}%`,
                          backgroundColor: `hsl(${25 + index * 60}, 100%, 50%)`,
                          opacity: 0.8
                        }}
                      />
                      <span className="text-xs text-gray-400">
                        {project.name.split(' ')[0]}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {Math.round(project.price / 10000)}万/㎡
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">面积对比</h4>
              <div className="h-32 bg-white/5 rounded-lg flex items-end gap-4 p-4">
                {comparisonList.map((project, index) => {
                  const maxArea = Math.max(...comparisonList.map(p => p.area));
                  const height = (project.area / maxArea) * 100;
                  
                  return (
                    <div key={project.id} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${height}%`,
                          backgroundColor: `hsl(${150 + index * 60}, 100%, 50%)`,
                          opacity: 0.8
                        }}
                      />
                      <span className="text-xs text-gray-400">
                        {project.name.split(' ')[0]}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {project.area}㎡
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 装饰效果 */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default ProjectComparison;