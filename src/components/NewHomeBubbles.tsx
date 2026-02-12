/**
 * 新房项目气泡组件
 * 展示选中板块下的所有新房项目缩略图气泡
 */

import React, { useState, useCallback, useEffect } from 'react';
import { SubDistrict, District } from '../data/districts';
import { NewHomeProject, getProjectsBySubDistrict } from '../data/newHomes';
import { ArrowUp, MapPin, Home, DollarSign } from 'lucide-react';

interface NewHomeBubblesProps {
  subDistrict: SubDistrict;
  district: District;
  onProjectSelect: (project: NewHomeProject) => void;
  onBack: () => void;
}

const NewHomeBubbles: React.FC<NewHomeBubblesProps> = ({
  subDistrict,
  district,
  onProjectSelect,
  onBack,
}) => {
  const [projects, setProjects] = useState<NewHomeProject[]>([]);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    // 获取该板块的项目，如果没有则使用模拟数据
    let projectList = getProjectsBySubDistrict(district.id, subDistrict.id);
    if (projectList.length === 0) {
      // 如果没有真实数据，生成一些模拟数据用于展示
      projectList = generateMockProjects(subDistrict, district);
    }
    setProjects(projectList);
  }, [subDistrict, district]);

  // 生成模拟数据
  const generateMockProjects = (sub: SubDistrict, dist: District): NewHomeProject[] => {
    const mockNames = [
      `${sub.name}公馆`,
      `${sub.name}悦府`,
      `${sub.name}华庭`,
      `${sub.name}锦园`,
      `${sub.name}翡翠园`,
      `${dist.name}${sub.name}壹号`,
    ];

    return mockNames.map((name, index) => ({
      id: `${dist.id}-${sub.id}-${index}`,
      name,
      districtId: dist.id,
      subDistrictId: sub.id,
      price: Math.floor(Math.random() * 150000) + 30000,
      priceUnit: '元/㎡',
      area: Math.floor(Math.random() * 100) + 50,
      areaRange: `${50 + index * 10}-${150 + index * 10}㎡`,
      status: ['在售', '在售', '待售'][Math.floor(Math.random() * 3)] as '在售' | '待售' | '售罄',
      features: ['近地铁', '配套完善', '品质物业', '环境优美'].slice(0, Math.floor(Math.random() * 4) + 1),
      description: `位于${dist.name}${sub.name}核心地段，享有一流配套设施和优越地理位置，是您理想居所的不二之选。`,
      image: `https://images.unsplash.com/photo-${1600 + index}-${1600500 + index * 100}?w=400`,
      developer: ['万科', '华润', '金地', '保利', '融创'][Math.floor(Math.random() * 5)],
      address: `${dist.name}${sub.name}路${100 + index * 50}号`,
      coordinates: { lat: 31.2 + Math.random() * 0.1, lng: 121.4 + Math.random() * 0.1 },
    }));
  };

  const handleProjectClick = useCallback((project: NewHomeProject) => {
    onProjectSelect(project);
  }, [onProjectSelect]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '在售':
        return 'bg-green-500';
      case '待售':
        return 'bg-yellow-500';
      case '售罄':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${district.color}40, transparent 70%)`,
          }}
        />
      </div>

      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 px-4 py-2 bg-white/10 hover:bg-orange-500/30 border border-white/20 hover:border-orange-500/50 rounded-lg text-white transition-all flex items-center gap-2"
      >
        ← 返回板块
      </button>

      {/* 区域标题 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-gray-400 text-sm">{district.name}</span>
          <ArrowUp className="w-4 h-4 text-orange-500" />
          <span style={{ color: district.color }} className="font-bold">{subDistrict.name}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">{projects.length} 个新房项目</p>
      </div>

      {/* 项目气泡网格 */}
      <div className="absolute inset-0 pt-32 pb-8 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full content-center">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => handleProjectClick(project)}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className="group relative mx-auto w-full max-w-xs"
              style={{
                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
              }}
            >
              {/* 气泡主体 */}
              <div
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border border-white/10 group-hover:border-orange-500/50 transition-all duration-300"
                style={{
                  transform: hoveredProject === project.id ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {/* 图片区域 */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* 状态标签 */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                  {/* 价格标签 */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-lg rounded-lg">
                    <span className="text-orange-400 font-bold">{project.price?.toLocaleString()}</span>
                    <span className="text-gray-300 text-xs ml-1">{project.priceUnit}</span>
                  </div>
                </div>

                {/* 信息区域 */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{project.address}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                    <Home className="w-4 h-4" />
                    <span>{project.areaRange}</span>
                  </div>

                  {/* 悬停显示更多信息 */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-1">
                      {project.features.slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 悬停时的箭头 */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUp className="w-5 h-5 text-orange-500" />
                  </div>
                </div>

                {/* 悬停时的光泽效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
        点击项目卡片查看详情
      </div>

      {/* CSS动画 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NewHomeBubbles;
