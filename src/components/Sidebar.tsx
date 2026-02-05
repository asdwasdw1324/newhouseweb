/**
 * 侧边导航栏组件
 * 支持缩回/展开，带有平滑动画效果
 */

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  FileText,
  Settings,
  HelpCircle,
  Map,
  Building,
  Home,
  Star,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { shanghaiDistricts } from '../data/districts';

interface SidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
  onSelectDistrict: (districtId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  currentView,
  onSelectDistrict,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const quickNavItems = [
    { id: 'home', icon: Home, label: '首页', view: 'home' },
    { id: 'map', icon: Map, label: '地图找房', view: 'district' },
    { id: 'favorites', icon: Star, label: '我的收藏', view: 'favorites' },
  ];

  const toolItems = [
    { id: 'calculator', icon: BarChart3, label: '贷款计算', view: 'calculator' },
    { id: 'trends', icon: TrendingUp, label: '市场行情', view: 'trends' },
    { id: 'history', icon: Clock, label: '购房历程', view: 'history' },
    { id: 'articles', icon: FileText, label: '购房指南', view: 'articles' },
  ];

  const systemItems = [
    { id: 'filter', icon: Filter, label: '筛选条件', view: 'filter' },
    { id: 'settings', icon: Settings, label: '设置', view: 'settings' },
    { id: 'help', icon: HelpCircle, label: '帮助中心', view: 'help' },
  ];

  const toggleButton = (
    <button
      onClick={onToggleCollapse}
      className={`absolute right-0 top-6 w-8 h-8 bg-[#111827] border border-accent rounded-full flex items-center justify-center text-accent shadow-md hover:bg-accent hover:text-accent-foreground transition-all duration-300 z-50 -translate-x-1/2 focus:outline-2 focus:outline-accent focus:outline-offset-2 ${isCollapsed ? 'shadow-lg' : ''}`}
      aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
    >
      {isCollapsed ? (
        <ChevronRight className="w-4 h-4" />
      ) : (
        <ChevronLeft className="w-4 h-4" />
      )}
    </button>
  );

  // 响应式侧边栏：在移动设备上默认隐藏
  const isMobile = window.innerWidth < 768;
  
  // 在移动设备上，只有在展开状态下显示侧边栏
  if (isMobile && isCollapsed) {
    return null;
  }

  if (isCollapsed) {
    return (
      <aside
        className="sidebar fixed left-0 top-16 bottom-0 w-20 z-40 flex flex-col py-4 transition-all duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        style={{ width: '80px' }}
        aria-label="侧边导航栏"
      >
        {toggleButton}

        {/* 折叠状态下的图标导航 */}
        <div className="flex-1 px-2 space-y-2 pt-16 transition-all duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94)">
          {quickNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.view)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`nav-item-collapsed w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-touch min-h-touch ${
                currentView === item.view
                  ? 'bg-accent/20 text-accent'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 focus:outline-2 focus:outline-accent focus:outline-offset-2'
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
          ))}
        </div>

        {/* 工具区 */}
        <div className="px-2 space-y-2 mt-4">
          {toolItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.view)}
              className="nav-item-collapsed w-full flex items-center justify-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all focus:outline-2 focus:outline-accent focus:outline-offset-2 min-w-touch min-h-touch"
              aria-label={item.label}
            >
              <item.icon className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          ))}
        </div>

        {/* 系统工具 */}
        <div className="px-2 space-y-2 mt-4">
          {systemItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.view)}
              className="nav-item-collapsed w-full flex items-center justify-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all focus:outline-2 focus:outline-accent focus:outline-offset-2 min-w-touch min-h-touch"
              aria-label={item.label}
            >
              <item.icon className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          ))}
        </div>

        {/* 品牌标识 - 已简化 */}
        <div className="px-2 mt-auto">
          <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
            <Home className="w-5 sm:w-6 h-5 sm:h-6 text-accent-foreground" />
          </div>
        </div>

        {/* 悬停提示 */}
        {hoveredItem && (
          <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-xl">
            {quickNavItems.find(item => item.id === hoveredItem)?.label ||
             toolItems.find(item => item.id === hoveredItem)?.label ||
             systemItems.find(item => item.id === hoveredItem)?.label}
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside
      className={`sidebar fixed left-0 top-16 bottom-0 w-64 z-40 flex flex-col py-4 overflow-hidden transition-all duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
        isMobile ? 'w-full' : ''
      }`}
      style={{ width: isMobile ? '100%' : '256px' }}
      aria-label="侧边导航栏"
    >
      {toggleButton}

      <div className="flex-1 overflow-y-auto px-4">
        {/* Logo区域 - 已移除，保持简洁 */}

        {/* 快速导航 */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            导航
          </h3>
          <div className="space-y-1 pt-0 transition-all duration-500 cubic-bezier(0.25, 0.46, 0.45, 0.94)">
            {quickNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.view)}
                className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cubic-bezier(0.25, 0.46, 0.45, 0.94) min-h-touch ${
                  currentView === item.view
                    ? 'bg-gradient-to-r from-accent/20 to-transparent text-accent border-l-2 border-accent'
                    : 'hover:bg-white/5 text-gray-300 hover:text-white border-l-2 border-transparent focus:outline-2 focus:outline-accent focus:outline-offset-2'
                }`}
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
                {currentView === item.view && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 区域快速选择 */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Map className="w-3 h-3" />
            热门区域
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {shanghaiDistricts.filter(district => [
              'pudong', 'xuhui', 'changning', 'huangpu', 'jingan', 'hongkou', 'yangpu', 'baoshan', 'minhang'
            ].includes(district.id)).map((district) => (
              <button
                key={district.id}
                onClick={() => {
                  onSelectDistrict(district.id);
                }}
                className="group relative px-3 py-1.5 bg-white/5 hover:bg-gradient-to-r hover:from-accent/30 hover:to-transparent border border-white/10 hover:border-accent/50 rounded-lg text-xs text-gray-300 hover:text-white transition-all duration-200 text-center overflow-hidden focus:outline-2 focus:outline-accent focus:outline-offset-2 min-h-touch whitespace-nowrap"
                aria-label={`选择${district.name}区域`}
              >
                <span className="relative z-10">{district.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* 购房工具 */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <BarChart3 className="w-3 h-3" />
            购房工具
          </h3>
          <div className="space-y-1">
            {toolItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.view)}
                className="nav-item w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-2 focus:outline-accent focus:outline-offset-2 group min-h-touch"
                aria-label={item.label}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* 系统 */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
            {systemItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.view)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group focus:outline-2 focus:outline-accent focus:outline-offset-2 min-w-touch min-h-touch"
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-4 mt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-accent/10 to-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent">实时数据更新</span>
          </div>
          <p className="text-xs text-gray-500">
            已有 <span className="text-accent font-semibold">2,847</span> 个楼盘
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
