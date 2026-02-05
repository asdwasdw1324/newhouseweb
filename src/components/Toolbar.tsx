/**
 * 顶部工具栏组件
 * 提供全局导航功能
 */

import React, { useState } from 'react';
import { Bell, User, Menu, Home, MapPin, Building2, Heart, Star, TrendingUp, X } from 'lucide-react';

interface ToolbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ onNavigate, currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="toolbar fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 sm:px-6">
      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex flex-col items-center justify-center">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors focus:outline-2 focus:outline-accent focus:outline-offset-2"
            aria-label="关闭菜单"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center gap-6">
            {
              [
                { view: 'home', icon: Home, label: '首页' },
                { view: 'featured', icon: Star, label: '精选' },
                { view: 'trends', icon: TrendingUp, label: '行情' },
                { view: 'district', icon: MapPin, label: '地图' },
                { view: 'favorites', icon: Heart, label: '收藏' },
                { view: 'comparison', icon: Building2, label: '对比' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      onNavigate(item.view);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                      currentView === item.view
                        ? 'bg-accent text-accent-foreground'
                        : 'text-gray-400 hover:text-white hover:bg-white/10 focus:outline-2 focus:outline-accent focus:outline-offset-2'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-lg">{item.label}</span>
                  </button>
                );
              })
            }
          </div>
        </div>
      )}

      {/* 左侧 Logo 和导航 */}
      <div className="flex items-center gap-4 sm:gap-8">
        {/* 艺术化 Logo 设计 */}
        <div
          className="flex items-center gap-3 cursor-pointer group pt-1"
          onClick={() => onNavigate('home')}
          role="button"
          tabIndex={0}
          aria-label="返回首页"
        >
          {/* 全黑色填充房子图标 */}
          <div className="relative w-10 h-10 sm:w-10 sm:h-10 flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-full h-full transition-transform group-hover:scale-110">
              {/* 房子主体外框 */}
              <path
                d="M3 9 L12 2 L21 9 L21 20 C21 20.5523 20.5523 21 20 21 L4 21 C3.44772 21 3 20.5523 3 20 L3 9 Z"
                fill="#111827"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* 中间门 */}
              <rect x="9" y="12" width="6" height="9" rx="1" fill="#111827" stroke="#f97316" strokeWidth="2" />
              {/* 门把 */}
              <circle cx="14" cy="17" r="1" fill="#f97316" />
            </svg>
          </div>

          {/* 艺术化文字排版 */}
          <div className="relative hidden sm:block pt-1">
            <h1 className="text-lg font-light tracking-widest text-white">
              魔都<span className="text-accent font-normal">新舍</span>
            </h1>
            {/* Slogan */}
            <p className="text-xs text-gray-400 mt-1">每一套新房，都是生活的新起点</p>
            {/* 装饰性下划线 */}
            <div className="absolute -bottom-0.5 left-0 w-8 h-1 bg-gradient-to-r from-accent to-transparent" />
          </div>
        </div>

        {/* 导航链接 */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 min-w-touch min-h-touch ${
              currentView === 'home'
                ? 'bg-accent/20 text-accent'
                : 'text-gray-400 hover:text-white hover:bg-white/5 focus:outline-2 focus:outline-accent focus:outline-offset-2'
            }`}
            aria-label="首页"
          >
            <Home className="w-4 h-4" />
            <span className="hidden lg:inline">首页</span>
          </button>
          <button
            onClick={() => onNavigate('featured')}
            className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 min-w-touch min-h-touch ${
              currentView === 'featured'
                ? 'bg-accent/20 text-accent'
                : 'text-gray-400 hover:text-white hover:bg-white/5 focus:outline-2 focus:outline-accent focus:outline-offset-2'
            }`}
            aria-label="精选"
          >
            <Star className="w-4 h-4" />
            <span className="hidden lg:inline">精选</span>
          </button>
          <button
            onClick={() => onNavigate('trends')}
            className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 min-w-touch min-h-touch ${
              currentView === 'trends'
                ? 'bg-accent/20 text-accent'
                : 'text-gray-400 hover:text-white hover:bg-white/5 focus:outline-2 focus:outline-accent focus:outline-offset-2'
            }`}
            aria-label="行情"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden lg:inline">行情</span>
          </button>
          <button
            onClick={() => onNavigate('district')}
            className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 min-w-touch min-h-touch ${
              currentView === 'district'
                ? 'bg-accent/20 text-accent'
                : 'text-gray-400 hover:text-white hover:bg-white/5 focus:outline-2 focus:outline-accent focus:outline-offset-2'
            }`}
            aria-label="地图"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden lg:inline">地图</span>
          </button>
          <button
            onClick={() => onNavigate('favorites')}
            className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 min-w-touch min-h-touch ${
              currentView === 'favorites'
                ? 'bg-accent/20 text-accent'
                : 'text-gray-400 hover:text-white hover:bg-white/5 focus:outline-2 focus:outline-accent focus:outline-offset-2'
            }`}
            aria-label="收藏"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden lg:inline">收藏</span>
          </button>
          <button
            onClick={() => onNavigate('comparison')}
            className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 min-w-touch min-h-touch ${
              currentView === 'comparison'
                ? 'bg-accent/20 text-accent'
                : 'text-gray-400 hover:text-white hover:bg-white/5 focus:outline-2 focus:outline-accent focus:outline-offset-2'
            }`}
            aria-label="对比"
          >
            <Building2 className="w-4 h-4" />
            <span className="hidden lg:inline">对比</span>
          </button>
        </nav>
      </div>

      {/* 右侧功能区 */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* 通知按钮 */}
        <button className="relative p-2 sm:p-2.5 text-gray-400 hover:text-accent hover:bg-white/5 rounded-lg transition-all focus:outline-2 focus:outline-accent focus:outline-offset-2 min-w-touch min-h-touch" aria-label="通知">
          <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        {/* 用户按钮 */}
        <button className="flex items-center gap-2 px-2 sm:px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all focus:outline-2 focus:outline-accent focus:outline-offset-2 min-w-touch min-h-touch" aria-label="登录">
          <User className="w-4 sm:w-5 h-4 sm:h-5" />
          <span className="hidden md:block text-sm">登录</span>
        </button>

        {/* 移动端菜单按钮 */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 sm:p-2.5 text-gray-400 hover:text-accent hover:bg-white/5 rounded-lg transition-all focus:outline-2 focus:outline-accent focus:outline-offset-2 min-w-touch min-h-touch"
          aria-label="打开菜单"
        >
          <Menu className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>
      </div>
    </header>
  );
};

export default Toolbar;
