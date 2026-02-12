/**
 * 首页组件
 * 居中布局，品牌信息更新，视觉效果优化
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NewHomeProject } from '../data/newHomes';
import { Search, MapPin, ArrowRight, Home as HomeIcon, TrendingUp, Heart } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: string) => void;
  onProjectSelect: (project: NewHomeProject) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onProjectSelect }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleBubbleClick = useCallback((project: NewHomeProject) => {
    onProjectSelect(project);
    onNavigate('project-detail');
  }, [onNavigate, onProjectSelect]);

  // 统计数据
  const stats = [
    { number: '16', label: '行政区域' },
    { number: '200+', label: '热门板块' },
    { number: '2847', label: '新房项目' },
  ];

  // 热门搜索标签
  const hotSearches = ['浦东新区', '陆家嘴', '静安寺', '徐家汇', '虹桥商务区', '前滩', '张江', '大虹桥'];

  // 页面加载动画
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setStatsAnimated(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      </div>

      {/* 主内容区域 - 全屏居中放置 */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center">
        <div
          className={`flex flex-col items-center text-center px-6 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 transform-translate-y-10'}`}
          data-content-area="true"
        >
          {/* 顶部标签 */}
          <div className="flex items-center gap-2 mb-6 animate-fadeIn">
            <MapPin className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-gray-400 text-sm">覆盖上海16个区 · 200+板块</span>
          </div>

          {/* 主标题 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6 animate-slideIn">
            魔都
            <span className="text-accent">新舍</span>
          </h1>

          {/* 副标题 */}
          <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-md sm:max-w-lg mb-6 sm:mb-10 leading-relaxed animate-slideIn animation-delay-200 px-4">
            每一套新房，都是生活的新起点
          </p>

          {/* 搜索框 */}
          <div
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mb-6 sm:mb-8 animate-slideIn animation-delay-300 z-10 px-4"
            data-search-box="true"
          >
            <div
              className={`
                relative flex items-center bg-gray-900/80 backdrop-blur-xl rounded-full border border-white/10
                transition-all duration-300 ease-in-out
              `}
            >
              <div className="pl-3 sm:pl-4 md:pl-5">
                <Search className="w-4 h-4 text-gray-400" />
              </div>

              <input
                type="text"
                placeholder="搜索区域、板块或楼盘名称..."
                className="flex-1 bg-transparent text-white px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 outline-none placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-white/10 text-sm sm:text-base"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />

              <button
                onClick={() => onNavigate('featured')}
                className="mr-1 sm:mr-2 px-3 sm:px-4 md:px-6 py-2 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold rounded-full hover:from-accent/80 hover:to-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 text-sm"
              >
                搜索
              </button>
            </div>

            {/* 搜索提示文字 */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 p-3 sm:p-4 bg-gray-900 backdrop-blur-lg rounded-xl border border-white/10 animate-fadeIn z-50 max-h-60 overflow-y-auto">
                <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">热门搜索:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {hotSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // 这里可以添加搜索逻辑
                        setSearchFocused(false);
                      }}
                      className="px-2.5 py-1 text-xs sm:text-sm bg-white/10 hover:bg-accent/20 text-gray-300 hover:text-white rounded-full transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 行动按钮 */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center animate-slideIn animation-delay-400 px-4">
            <button
              onClick={() => onNavigate('district')}
              className="group flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-white/10 transform hover:-translate-y-1 w-full sm:w-auto text-sm sm:text-base min-w-touch min-h-touch"
            >
              <span>开始探索</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => onNavigate('trends')}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 transform hover:-translate-y-1 w-full sm:w-auto text-sm sm:text-base min-w-touch min-h-touch"
            >
              <HomeIcon className="w-4 h-4" />
              <span>查看新房</span>
            </button>
            <button
              onClick={() => onNavigate('trends')}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-transparent border border-accent/30 text-accent font-semibold rounded-full hover:bg-accent/10 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 transform hover:-translate-y-1 w-full sm:w-auto text-sm sm:text-base min-w-touch min-h-touch"
            >
              <TrendingUp className="w-4 h-4" />
              <span>查看行情</span>
            </button>
          </div>

          {/* 统计数据 */}
          <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-center animate-fadeIn animation-delay-500 px-4">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center min-w-[70px]">
                <p className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-accent transition-colors duration-300 ${statsAnimated ? 'animate-countUp' : ''}`}>
                  {stat.number}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 group-hover:text-gray-300 transition-colors duration-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* 装饰效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />
      </div>

      {/* 动画样式 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animate-countUp {
          animation: countUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
