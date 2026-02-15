import React, { useState, useCallback, useEffect, Suspense, lazy, startTransition } from 'react';
import './App.css';
import './styles/globals.css';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';

// 懒加载组件
const Home = lazy(() => import('./components/Home'));
const FeaturedProperties = lazy(() => import('./components/FeaturedProperties'));
const MarketTrends = lazy(() => import('./components/MarketTrends'));
const ShanghaiMap = lazy(() => import('./components/ShanghaiMap'));
const NewHomeDetail = lazy(() => import('./components/NewHomeDetail'));
const ProjectComparison = lazy(() => import('./components/ProjectComparison'));
const FavoritesManager = lazy(() => import('./components/FavoritesManager'));
const LoanCalculator = lazy(() => import('./components/LoanCalculator'));
const PurchaseHistory = lazy(() => import('./components/PurchaseHistory'));
const PurchaseGuide = lazy(() => import('./components/PurchaseGuide'));
import { District, SubDistrict, shanghaiDistricts } from './data/districts';
import { NewHomeProject } from './data/newHomes';

// 视图模式类型
type ViewMode = 'home' | 'featured' | 'trends' | 'district' | 'favorites' | 'comparison' | 'project-detail' | 'calculator' | 'history' | 'articles';

// 视图顺序
const viewOrder: ViewMode[] = ['home', 'featured', 'trends', 'district', 'favorites', 'comparison', 'calculator', 'history', 'articles'];

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<SubDistrict | null>(null);
  const [selectedProject, setSelectedProject] = useState<NewHomeProject | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisonList, setComparisonList] = useState<NewHomeProject[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [favoritesChanged, setFavoritesChanged] = useState(0);

  // 从localStorage加载收藏的楼盘ID列表
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        const favoritesData = JSON.parse(storedFavorites);
        const favoriteIds = favoritesData.map((fav: any) => fav.projectId);
        setFavorites(favoriteIds);
        console.log('从localStorage加载收藏ID:', favoriteIds);
      } catch (e) {
        console.error('解析收藏数据失败:', e);
        setFavorites([]);
      }
    }
  }, []);

  // 监听收藏变化，同步更新favorites列表
  useEffect(() => {
    const handleStorageChange = () => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        try {
          const favoritesData = JSON.parse(storedFavorites);
          const favoriteIds = favoritesData.map((fav: any) => fav.projectId);
          setFavorites(favoriteIds);
          console.log('storage事件更新收藏ID:', favoriteIds);
        } catch (e) {
          console.error('解析收藏数据失败:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Preload featured chunk in idle time to reduce first-switch latency.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      import('./components/FeaturedProperties');
    }, 800);
    return () => window.clearTimeout(timer);
  }, []);

  // 导航处理 - 直接切换页面
  const handleNavigate = useCallback((view: ViewMode) => {
    console.log('handleNavigate called with view:', view);
    setCurrentView(view);
    console.log('currentView set to:', view);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 区域选择处理
  const handleDistrictSelect = useCallback((district: District) => {
    console.log('handleDistrictSelect called with:', district);
    setSelectedDistrict(district);
    setActiveFilter(district.id);
    console.log('Setting activeFilter to:', district.id);
    setCurrentView('featured');
    console.log('Setting currentView to: featured');
  }, []);

  // 板块选择处理
  const handleSubDistrictSelect = useCallback((districtId: string, subDistrict: SubDistrict) => {
    const district = shanghaiDistricts.find((d: District) => d.id === districtId);
    if (district) {
      setSelectedDistrict(district);
      setSelectedSubDistrict(subDistrict);
      setCurrentView('district');
    }
  }, []);

  // 项目选择处理
  const handleProjectSelect = useCallback((project: NewHomeProject) => {
    startTransition(() => {
      setSelectedProject(project);
      setShowProjectDetail(true);
    });
  }, []);

  // 收藏处理
  const handleFavorite = useCallback((project: NewHomeProject) => {
    console.log('handleFavorite called:', project.name, 'ID:', project.id);
    
    try {
      const storedFavorites = localStorage.getItem('favorites');
      console.log('Stored favorites before:', storedFavorites);
      
      let favoritesData: any[] = [];
      
      if (storedFavorites) {
        try {
          favoritesData = JSON.parse(storedFavorites);
          console.log('Parsed favorites data:', favoritesData);
        } catch (e) {
          console.error('解析收藏数据失败:', e);
          favoritesData = [];
        }
      }
      
      const existingIndex = favoritesData.findIndex((fav) => fav.projectId === project.id);
      console.log('Existing index:', existingIndex);
      
      if (existingIndex >= 0) {
        favoritesData.splice(existingIndex, 1);
        console.log('Removed from favorites:', project.name);
      } else {
        favoritesData.push({
          id: `fav-${Date.now()}`,
          projectId: project.id,
          addedAt: new Date().toISOString(),
          tags: [],
          notes: ''
        });
        console.log('Added to favorites:', project.name);
      }
      
      localStorage.setItem('favorites', JSON.stringify(favoritesData));
      console.log('Stored favorites after:', JSON.stringify(favoritesData));
      
      const updatedFavoriteIds = favoritesData.map((fav) => fav.projectId);
      setFavorites(updatedFavoriteIds);
      console.log('Updated favorite IDs:', updatedFavoriteIds);
      
      setFavoritesChanged(prev => prev + 1);
      console.log('Favorites changed count:', favoritesChanged + 1);
      
      window.dispatchEvent(new CustomEvent('favoritesChanged', { detail: favoritesData }));
      console.log('favoritesChanged event dispatched');
    } catch (e) {
      console.error('收藏操作失败:', e);
    }
  }, [favoritesChanged]);

  // 对比处理
  const handleAddToComparison = useCallback((project: NewHomeProject) => {
    setComparisonList((prev) => {
      if (prev.some((p) => p.id === project.id)) {
        return prev;
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), project];
      }
      return [...prev, project];
    });
  }, []);

  // 移除对比项目
  const handleRemoveFromComparison = useCallback((projectId: string) => {
    setComparisonList((prev) => prev.filter((project) => project.id !== projectId));
  }, []);

  // 清空对比列表
  const handleClearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  // 渲染当前页面
  const renderCurrentPage = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home
            onNavigate={handleNavigate}
            onProjectSelect={handleProjectSelect}
          />
        );
      case 'featured':
        return (
          <FeaturedProperties
            onNavigate={handleNavigate}
            onProjectSelect={handleProjectSelect}
            onFavorite={handleFavorite}
            onAddToComparison={handleAddToComparison}
            favorites={favorites}
            activeFilter={activeFilter}
            onSetActiveFilter={setActiveFilter}
          />
        );
      case 'trends':
        return (
          <MarketTrends
            onNavigate={handleNavigate}
          />
        );
      case 'district':
        return (
          <ShanghaiMap
            onDistrictSelect={handleDistrictSelect}
            onSubDistrictSelect={handleSubDistrictSelect}
            selectedDistrict={selectedDistrict}
          />
        );
      case 'favorites':
        return (
          <FavoritesManager
            initialFavorites={favorites}
            onProjectSelect={handleProjectSelect}
            onFavorite={handleFavorite}
          />
        );
      case 'comparison':
        return (
          <ProjectComparison
            initialProjects={comparisonList}
            onRemove={handleRemoveFromComparison}
            onClear={handleClearComparison}
          />
        );
      case 'calculator':
        return (
          <LoanCalculator
            onNavigate={handleNavigate}
          />
        );
      case 'history':
        return (
          <PurchaseHistory
            onNavigate={handleNavigate}
          />
        );
      case 'articles':
        return (
          <PurchaseGuide
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <Home
            onNavigate={handleNavigate}
            onProjectSelect={handleProjectSelect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部工具栏 */}
      <Toolbar onNavigate={handleNavigate} currentView={currentView} />

      {/* 侧边导航栏 */}
      <Sidebar
        onNavigate={handleNavigate}
        currentView={currentView}
        onSelectDistrict={(districtId) => {
          const district = shanghaiDistricts.find((d: District) => d.id === districtId);
          if (district) {
            handleDistrictSelect(district);
          }
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 主内容区 */}
      <main
        className="min-h-screen pt-16 transition-all duration-300 overflow-auto"
        style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}
      >
        <div className="page-transition min-h-full">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-pulse text-center">
                <div className="w-16 h-16 mx-auto border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg text-gray-400">加载中...</p>
              </div>
            </div>
          }>
            {renderCurrentPage()}
          </Suspense>
        </div>
      </main>

      {/* 项目详情滑出卡片 */}
      {showProjectDetail && selectedProject && (
        <NewHomeDetail
          project={selectedProject}
          onClose={() => setShowProjectDetail(false)}
          onFavorite={handleFavorite}
          onAddToComparison={handleAddToComparison}
          isFavorite={favorites.includes(selectedProject.id)}
        />
      )}

      {/* 移动端侧边栏切换按钮 */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-orange-500 text-white rounded-full shadow-lg lg:hidden"
        aria-label={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isSidebarCollapsed ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          )}
        </svg>
      </button>

      {/* 背景效果 */}
      <div className="shanghai-map-bg" />
    </div>
  );
}

export default App;