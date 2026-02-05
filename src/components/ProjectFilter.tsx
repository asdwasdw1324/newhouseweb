/**
 * 楼盘筛选组件
 * 提供多维度的楼盘筛选和排序选项
 */

import React, { useState, useCallback, useMemo } from 'react';
import { NewHomeProject } from '../data/newHomes';
import { Filter, Sliders, X, ArrowUpDown, Check, Trash2, MapPin, DollarSign, Ruler, Building2, Calendar, Star } from 'lucide-react';

interface FilterOptions {
  priceRange: [number, number];
  areaRange: [number, number];
  status: string[];
  features: string[];
  districts: string[];
  sortBy: 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc' | 'hot' | 'newest';
}

interface ProjectFilterProps {
  projects: NewHomeProject[];
  onFilterChange: (filteredProjects: NewHomeProject[]) => void;
  onReset: () => void;
  defaultFilters?: Partial<FilterOptions>;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ 
  projects, 
  onFilterChange, 
  onReset, 
  defaultFilters 
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: defaultFilters?.priceRange || [0, 500000],
    areaRange: defaultFilters?.areaRange || [0, 500],
    status: defaultFilters?.status || [],
    features: defaultFilters?.features || [],
    districts: defaultFilters?.districts || [],
    sortBy: defaultFilters?.sortBy || 'hot'
  });

  // 获取所有可能的状态选项
  const statusOptions = useMemo(() => {
    const statuses = new Set(projects.map(project => project.status));
    return Array.from(statuses);
  }, [projects]);

  // 获取所有可能的特色选项
  const featureOptions = useMemo(() => {
    const features = new Set<string>();
    projects.forEach(project => {
      project.features.forEach(feature => features.add(feature));
    });
    return Array.from(features).slice(0, 10); // 限制前10个特色选项
  }, [projects]);

  // 获取所有可能的区域选项
  const districtOptions = useMemo(() => {
    const districts = new Set(projects.map(project => project.districtId));
    return Array.from(districts);
  }, [projects]);

  // 处理筛选和排序
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // 价格范围筛选
    result = result.filter(project => {
      const price = project.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // 面积范围筛选
    result = result.filter(project => {
      const area = project.area;
      return area >= filters.areaRange[0] && area <= filters.areaRange[1];
    });

    // 状态筛选
    if (filters.status.length > 0) {
      result = result.filter(project => filters.status.includes(project.status));
    }

    // 特色筛选
    if (filters.features.length > 0) {
      result = result.filter(project => {
        return filters.features.some(feature => project.features.includes(feature));
      });
    }

    // 区域筛选
    if (filters.districts.length > 0) {
      result = result.filter(project => filters.districts.includes(project.districtId));
    }

    // 排序
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'area-asc':
          return a.area - b.area;
        case 'area-desc':
          return b.area - a.area;
        case 'hot':
          // 模拟热度排序，实际项目中应该有热度字段
          return Math.random() - 0.5;
        case 'newest':
          // 模拟最新排序，实际项目中应该有开盘时间字段
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    return result;
  }, [projects, filters]);

  // 当筛选条件变化时，通知父组件
  React.useEffect(() => {
    onFilterChange(filteredAndSortedProjects);
  }, [filteredAndSortedProjects, onFilterChange]);

  // 处理价格范围变化
  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  }, []);

  // 处理面积范围变化
  const handleAreaRangeChange = useCallback((range: [number, number]) => {
    setFilters(prev => ({ ...prev, areaRange: range }));
  }, []);

  // 处理状态选择
  const handleStatusToggle = useCallback((status: string) => {
    setFilters(prev => {
      const newStatus = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      return { ...prev, status: newStatus };
    });
  }, []);

  // 处理特色选择
  const handleFeatureToggle = useCallback((feature: string) => {
    setFilters(prev => {
      const newFeatures = prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features: newFeatures };
    });
  }, []);

  // 处理区域选择
  const handleDistrictToggle = useCallback((district: string) => {
    setFilters(prev => {
      const newDistricts = prev.districts.includes(district)
        ? prev.districts.filter(d => d !== district)
        : [...prev.districts, district];
      return { ...prev, districts: newDistricts };
    });
  }, []);

  // 处理排序方式变化
  const handleSortChange = useCallback((sortBy: FilterOptions['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  // 重置筛选
  const handleReset = useCallback(() => {
    const defaultValues: FilterOptions = {
      priceRange: [0, 500000],
      areaRange: [0, 500],
      status: [],
      features: [],
      districts: [],
      sortBy: 'hot'
    };
    setFilters(defaultValues);
    onReset();
  }, [onReset]);

  // 计算筛选条件数量
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) count++;
    if (filters.areaRange[0] > 0 || filters.areaRange[1] < 500) count++;
    count += filters.status.length;
    count += filters.features.length;
    count += filters.districts.length;
    if (filters.sortBy !== 'hot') count++;
    return count;
  }, [filters]);

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10">
      {/* 筛选标题和重置 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500" />
          <h3 className="text-base sm:text-lg font-semibold text-white">楼盘筛选</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
              {activeFiltersCount} 个筛选条件
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 transition-all min-w-touch min-h-touch"
          >
            <Trash2 className="w-3 h-3" />
            重置
          </button>
        )}
      </div>

      {/* 价格范围 */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <label className="flex items-center gap-2 text-gray-300">
            <DollarSign className="w-4 h-4" />
            <span>价格范围</span>
          </label>
          <span className="text-sm text-orange-400">
            {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} 元/㎡
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            style={{ 
              width: `${((filters.priceRange[1] - filters.priceRange[0]) / 500000) * 100}%`,
              marginLeft: `${(filters.priceRange[0] / 500000) * 100}%`
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 gap-3">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange([parseInt(e.target.value) || 0, filters.priceRange[1]])}
            className="w-full sm:w-24 px-2 py-1.5 bg-white/5 text-white text-sm rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-orange-500 min-h-touch"
            min="0"
            max="500000"
          />
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange([filters.priceRange[0], parseInt(e.target.value) || 500000])}
            className="w-full sm:w-24 px-2 py-1.5 bg-white/5 text-white text-sm rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-orange-500 min-h-touch"
            min="0"
            max="500000"
          />
        </div>
      </div>

      {/* 面积范围 */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <label className="flex items-center gap-2 text-gray-300">
            <Ruler className="w-4 h-4" />
            <span>面积范围</span>
          </label>
          <span className="text-sm text-orange-400">
            {filters.areaRange[0]} - {filters.areaRange[1]} ㎡
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
            style={{ 
              width: `${((filters.areaRange[1] - filters.areaRange[0]) / 500) * 100}%`,
              marginLeft: `${(filters.areaRange[0] / 500) * 100}%`
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 gap-3">
          <input
            type="number"
            value={filters.areaRange[0]}
            onChange={(e) => handleAreaRangeChange([parseInt(e.target.value) || 0, filters.areaRange[1]])}
            className="w-full sm:w-24 px-2 py-1.5 bg-white/5 text-white text-sm rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-touch"
            min="0"
            max="500"
          />
          <input
            type="number"
            value={filters.areaRange[1]}
            onChange={(e) => handleAreaRangeChange([filters.areaRange[0], parseInt(e.target.value) || 500])}
            className="w-full sm:w-24 px-2 py-1.5 bg-white/5 text-white text-sm rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-touch"
            min="0"
            max="500"
          />
        </div>
      </div>

      {/* 楼盘状态 */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4" />
          <h4 className="text-gray-300">楼盘状态</h4>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {statusOptions.map((status) => {
            const isSelected = filters.status.includes(status);
            return (
              <button
                key={status}
                onClick={() => handleStatusToggle(status)}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-sm rounded-full transition-all min-w-touch min-h-touch ${
                  isSelected
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* 项目特色 */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4" />
          <h4 className="text-gray-300">项目特色</h4>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {featureOptions.map((feature) => {
            const isSelected = filters.features.includes(feature);
            return (
              <button
                key={feature}
                onClick={() => handleFeatureToggle(feature)}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-sm rounded-full transition-all min-w-touch min-h-touch ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {feature}
              </button>
            );
          })}
        </div>
      </div>

      {/* 区域选择 */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4" />
          <h4 className="text-gray-300">区域选择</h4>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {districtOptions.map((district) => {
            const isSelected = filters.districts.includes(district);
            return (
              <button
                key={district}
                onClick={() => handleDistrictToggle(district)}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-sm rounded-full transition-all min-w-touch min-h-touch ${
                  isSelected
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {district}
              </button>
            );
          })}
        </div>
      </div>

      {/* 排序方式 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUpDown className="w-4 h-4" />
          <h4 className="text-gray-300">排序方式</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { value: 'hot', label: '热度优先' },
            { value: 'price-asc', label: '价格从低到高' },
            { value: 'price-desc', label: '价格从高到低' },
            { value: 'area-asc', label: '面积从小到大' },
            { value: 'area-desc', label: '面积从大到小' },
            { value: 'newest', label: '最新开盘' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value as any)}
              className={`flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg transition-all min-h-touch ${
                filters.sortBy === option.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {filters.sortBy === option.value && <Check className="w-3 h-3" />}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 筛选结果 */}
      <div className="bg-white/10 rounded-lg p-3 sm:p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-500" />
            <span className="text-gray-300 text-sm">筛选结果</span>
          </div>
          <span className="text-orange-400 font-semibold">
            {filteredAndSortedProjects.length} 个楼盘
          </span>
        </div>
        {activeFiltersCount > 0 && (
          <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
            {/* 显示当前筛选条件 */}
            {filters.priceRange[0] > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                价格 ≥ {filters.priceRange[0].toLocaleString()}
                <button 
                  onClick={() => handlePriceRangeChange([0, filters.priceRange[1]])}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.priceRange[1] < 500000 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                价格 ≤ {filters.priceRange[1].toLocaleString()}
                <button 
                  onClick={() => handlePriceRangeChange([filters.priceRange[0], 500000])}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.areaRange[0] > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                面积 ≥ {filters.areaRange[0]}㎡
                <button 
                  onClick={() => handleAreaRangeChange([0, filters.areaRange[1]])}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.areaRange[1] < 500 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                面积 ≤ {filters.areaRange[1]}㎡
                <button 
                  onClick={() => handleAreaRangeChange([filters.areaRange[0], 500])}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.status.map((status) => (
              <span key={status} className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                {status}
                <button 
                  onClick={() => handleStatusToggle(status)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.features.slice(0, 3).map((feature) => (
              <span key={feature} className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                {feature}
                <button 
                  onClick={() => handleFeatureToggle(feature)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.features.length > 3 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                +{filters.features.length - 3} 个特色
              </span>
            )}
            {filters.districts.slice(0, 3).map((district) => (
              <span key={district} className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                {district}
                <button 
                  onClick={() => handleDistrictToggle(district)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.districts.length > 3 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                +{filters.districts.length - 3} 个区域
              </span>
            )}
            {filters.sortBy !== 'hot' && (
              <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                {filters.sortBy === 'price-asc' && '价格从低到高'}
                {filters.sortBy === 'price-desc' && '价格从高到低'}
                {filters.sortBy === 'area-asc' && '面积从小到大'}
                {filters.sortBy === 'area-desc' && '面积从大到小'}
                {filters.sortBy === 'newest' && '最新开盘'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFilter;