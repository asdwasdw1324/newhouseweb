/**
 * 板块气泡导航组件
 * 展示选中区域下的板块气泡，带有向上箭头引导效果
 */

import React, { useState, useCallback, useEffect } from 'react';
import { District, SubDistrict } from '../data/districts';
import { getProjectsByDistrict } from '../data/newHomes';
import { ArrowUp } from 'lucide-react';

interface DistrictBubblesProps {
  district: District;
  onSubDistrictSelect: (subDistrict: SubDistrict) => void;
  onBack: () => void;
}

const DistrictBubbles: React.FC<DistrictBubblesProps> = ({
  district,
  onSubDistrictSelect,
  onBack,
}) => {
  const [bubbles, setBubbles] = useState<Array<{
    subDistrict: SubDistrict;
    projectCount: number;
    x: number;
    y: number;
    radius: number;
  }>>([]);

  // 初始化气泡位置
  const initBubbles = useCallback(() => {
    const newBubbles = district.subDistricts.map((sub, index) => {
      const projects = getProjectsByDistrict(district.id);
      const projectCount = projects.filter(p => p.subDistrictId === sub.id).length || Math.floor(Math.random() * 5) + 1;

      // 围绕中心分布
      const angle = (index / district.subDistricts.length) * Math.PI * 2 - Math.PI / 2;
      const distance = 150 + Math.random() * 50;
      const centerX = 50; // 百分比
      const centerY = 70; // 百分比

      return {
        subDistrict: sub,
        projectCount,
        x: centerX + Math.cos(angle) * distance * 0.5,
        y: centerY + Math.sin(angle) * distance * 0.3,
        radius: 60 + projectCount * 8,
      };
    });
    setBubbles(newBubbles);
  }, [district]);

  useEffect(() => {
    initBubbles();
  }, [initBubbles]);

  const handleBubbleClick = useCallback((subDistrict: SubDistrict) => {
    onSubDistrictSelect(subDistrict);
  }, [onSubDistrictSelect]);

  return (
    <div className="relative w-full h-full">
      {/* 背景地图 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full opacity-10"
          preserveAspectRatio="none"
        >
          <path
            d="M 30,70 Q 40,60 50,50 Q 60,40 70,30 Q 80,40 85,50 Q 90,60 85,70 Q 80,80 70,85 Q 60,90 50,85 Q 40,80 35,70 Q 30,60 30,70"
            fill="none"
            stroke="rgba(255, 165, 0, 0.5)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 px-4 py-2 bg-white/10 hover:bg-orange-500/30 border border-white/20 hover:border-orange-500/50 rounded-lg text-white transition-all"
      >
        ← 返回地图
      </button>

      {/* 区域标题 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h2 className="text-3xl font-bold text-white mb-2">
          <span style={{ color: district.color }}>{district.name}</span>
        </h2>
        <p className="text-gray-400 text-sm">{district.description}</p>
        <p className="text-orange-400 text-xs mt-1">
          {district.subDistricts.length} 个板块 · {getProjectsByDistrict(district.id).length} 个新房项目
        </p>
      </div>

      {/* 中央箭头指示器 */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <ArrowUp className="w-8 h-8 text-white" />
        </div>
        <div className="w-px h-20 bg-gradient-to-b from-orange-500 to-transparent mt-2" />
      </div>

      {/* 板块气泡 */}
      <div className="absolute inset-0 pt-32 pb-8 px-8">
        <div className="relative w-full h-full">
          {/* 气泡网格 */}
          <div className="grid grid-cols-4 gap-6 h-full">
            {bubbles.map((bubble, index) => (
              <div
                key={bubble.subDistrict.id}
                className="relative flex items-center justify-center"
                style={{
                  gridColumn: Math.floor(index / 2) + 1,
                  gridRow: (index % 2) + 1,
                }}
              >
                {/* 连接线 */}
                <div
                  className="absolute w-px bg-gradient-to-r from-orange-500/50 to-transparent"
                  style={{
                    left: bubble.subDistrict.coordinates.x < 50 ? '100%' : '0',
                    width: '60px',
                    height: '2px',
                    transform: bubble.subDistrict.coordinates.x < 50 ? 'rotate(0deg)' : 'rotate(180deg)',
                    top: '50%',
                  }}
                />

                {/* 气泡 */}
                <button
                  onClick={() => handleBubbleClick(bubble.subDistrict)}
                  className="nav-bubble group relative"
                  style={{
                    width: `${bubble.radius}px`,
                    height: `${bubble.radius}px`,
                    background: `radial-gradient(circle at 30% 30%, ${district.color}40, ${district.color}20)`,
                    boxShadow: `0 0 ${bubble.radius}px ${district.color}30`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 group-hover:border-orange-500 transition-all" />
                  <div className="text-center p-2">
                    <span className="block text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">
                      {bubble.subDistrict.name}
                    </span>
                    <span className="block text-gray-400 text-xs mt-1">
                      {bubble.projectCount} 个项目
                    </span>
                  </div>

                  {/* 悬停显示详情 */}
                  <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/90 backdrop-blur-lg rounded-lg p-3 whitespace-nowrap border border-orange-500/30">
                      <p className="text-gray-300 text-xs">{bubble.subDistrict.description}</p>
                    </div>
                  </div>

                  {/* 箭头指示 */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUp className="w-4 h-4 text-orange-500" />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
        点击板块气泡查看该板块的新房项目
      </div>
    </div>
  );
};

export default DistrictBubbles;
