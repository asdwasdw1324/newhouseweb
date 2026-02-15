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
          }
        }
      } catch {
        // keep local data silently
      } finally {
        setIsRefreshing(false);
      }
    };

    loadProjects(currentPage, ITEMS_PER_PAGE);
  }, [currentPage, activeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const pageNumbers = useMemo(() => {
    const count = Math.min(5, totalPages);
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-white">精选楼盘</h1>
        <div className="text-sm text-gray-400">共 {totalProjects} 个项目</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSetActiveFilter('all')}
          className={`px-3 py-1 rounded ${activeFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-300'}`}
        >
          全部
        </button>
        {shanghaiDistricts.map((district) => (
          <button
            key={district.id}
            onClick={() => onSetActiveFilter(district.id)}
            className={`px-3 py-1 rounded ${activeFilter === district.id ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-300'}`}
          >
            {district.name}
          </button>
        ))}
      </div>

      {isRefreshing && <div className="text-gray-400 text-sm">更新中...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer"
            onClick={() => {
              onProjectSelect(project);
              onNavigate('project-detail');
            }}
          >
            <img src={project.image} alt={project.name} className="w-full h-40 object-cover" />
            <div className="p-3 space-y-2">
              <div className="text-white font-semibold line-clamp-1">{project.name}</div>
              <div className="text-sm text-gray-300 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.districtId} / {project.subDistrictId}
              </div>
              <div className="text-orange-400">{project.price.toLocaleString()} {project.priceUnit}</div>
              <div className="text-xs text-gray-400 line-clamp-1">{project.areaRange}</div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite(project);
                  }}
                  className={`p-2 rounded ${favorites.includes(project.id) ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-300'}`}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(project.id) ? 'fill-current' : ''}`} />
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
  );
};

export default FeaturedProperties;
