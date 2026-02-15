import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Heart, GitCompare } from 'lucide-react';
import { NewHomeProject, newHomeProjects } from '../data/newHomes';
import { shanghaiDistricts } from '../data/districts';
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

const ITEMS_PER_PAGE = 8;

const normalizeProject = (project: any): NewHomeProject => ({
  id: project.id,
  name: project.name,
  districtId: project.districtId || '',
  subDistrictId: project.subDistrictId || project.subDistrict || '',
  price: Number(project.price || 0),
  priceUnit: project.priceUnit || '元/㎡',
  area: Number(project.area || project.areaMin || project.areaMax || 0),
  areaRange: project.areaRange || '',
  status: project.status || '在售',
  features: Array.isArray(project.features)
    ? project.features.map((f: any) => (typeof f === 'string' ? f : f?.feature)).filter(Boolean)
    : Array.isArray(project.tags)
      ? project.tags
      : [],
  description: project.description || '',
  image: project.mainImage
    ? (project.mainImage.startsWith('http') ? project.mainImage : `http://localhost:3001${project.mainImage}`)
    : (project.image || ''),
  developer: project.developer || '',
  address: project.address || project.location || '',
  coordinates: project.coordinates || { lat: 0, lng: 0 },
  publishDate: project.publishDate,
  floorRange: project.floorRange
});

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  onProjectSelect,
  onNavigate,
  onFavorite,
  onAddToComparison,
  favorites,
  activeFilter,
  onSetActiveFilter
}) => {
  const [projects, setProjects] = useState<NewHomeProject[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [localFavorites, setLocalFavorites] = useState<string[]>(favorites);

  const applyLocalPagination = (allProjects: NewHomeProject[], page: number, limit: number) => {
    const filtered = activeFilter === 'all'
      ? allProjects
      : allProjects.filter((p) => p.districtId === activeFilter);

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;

    setProjects(filtered.slice(start, start + limit));
    setTotalProjects(total);
    setTotalPages(pages);
  };

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    const handleFavoritesChange = () => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        try {
          const favoritesData = JSON.parse(storedFavorites);
          const favoriteIds = favoritesData.map((fav: any) => fav.projectId);
          setLocalFavorites(favoriteIds);
        } catch (e) {
          console.error('解析收藏数据失败:', e);
        }
      }
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);
    window.addEventListener('storage', handleFavoritesChange);

    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
      window.removeEventListener('storage', handleFavoritesChange);
    };
  }, []);

  useEffect(() => {
    const loadProjects = async (page = 1, limit = ITEMS_PER_PAGE) => {
      // 1) instant paint from local data
      applyLocalPagination(newHomeProjects, page, limit);

      // 2) background refresh from API (if available)
      setIsRefreshing(true);
      try {
        const params: any = { page, limit };
        if (activeFilter !== 'all') {
          params.district = activeFilter;
        }

        const response = await fetchProjects(params);

        if (response?.success && response.data) {
          if (Array.isArray(response.data.list) && response.data.list.length > 0) {
            const formatted = response.data.list.map(normalizeProject);
            setProjects(formatted);
            setTotalPages(response.data.totalPages || Math.max(1, Math.ceil((response.data.total || formatted.length) / limit)));
            setTotalProjects(response.data.total || formatted.length);
            return;
          }

          if (Array.isArray(response.data) && response.data.length > 0) {
            applyLocalPagination(response.data.map(normalizeProject), page, limit);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadProjects(currentPage, ITEMS_PER_PAGE);
  }, [activeFilter, currentPage]);

  // 将拼音区域ID转换为中文区域名称
  const getDistrictName = (districtId: string): string => {
    const district = shanghaiDistricts.find(d => d.id === districtId);
    return district ? district.name : districtId;
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-6">
          精选<span className="text-orange-500">楼盘</span>
        </h1>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-6">
          <button
            onClick={() => onSetActiveFilter('all')}
            className={`px-4 py-2 rounded ${activeFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            全部
          </button>
          {shanghaiDistricts.map((district) => (
            <button
              key={district.id}
              onClick={() => onSetActiveFilter(district.id)}
              className={`px-4 py-2 rounded text-sm ${activeFilter === district.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
            >
              {district.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            共 {totalProjects} 个楼盘
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-white/10 text-gray-300 disabled:opacity-50"
            >
              上一页
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`px-3 py-1 rounded ${currentPage === n ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-300'}`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-white/10 text-gray-300 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden cursor-pointer hover:bg-white/10 transition-all"
            onClick={() => {
              onProjectSelect(project);
              onNavigate('project-detail');
            }}
          >
            <img src={project.image} alt={project.name} className="w-full h-56 object-cover" />
            <div className="p-3 space-y-3">
              <div className="flex items-start justify-between">
                <div className="text-white font-semibold line-clamp-1 flex-1">{project.name}</div>
                <div className="text-sm text-gray-300 flex items-center gap-1 ml-2">
                  <MapPin className="w-4 h-4" />
                  {getDistrictName(project.districtId)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-orange-400">{project.price.toLocaleString()} {project.priceUnit}</div>
                <div className="text-xs text-gray-400">{project.areaRange}</div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('收藏按钮点击:', project.name, 'ID:', project.id);
                    onFavorite(project);
                  }}
                  className={`p-2 rounded ${localFavorites.includes(project.id) ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-300'}`}
                >
                  <Heart className={`w-4 h-4 ${localFavorites.includes(project.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToComparison(project);
                  }}
                  className="p-2 rounded bg-white/10 text-gray-300"
                >
                  <GitCompare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-white/10 text-gray-300 disabled:opacity-50"
        >
          上一页
        </button>
        {pageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => setCurrentPage(n)}
            className={`px-3 py-1 rounded ${currentPage === n ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-300'}`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-white/10 text-gray-300 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default FeaturedProperties;