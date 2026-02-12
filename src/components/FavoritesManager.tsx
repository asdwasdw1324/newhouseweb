/**
 * 收藏管理组件
 * 管理用户收藏的楼盘项目
 */

import React, { useState, useMemo, useEffect } from 'react';
import { NewHomeProject, newHomeProjects } from '../data/newHomes';
import { Heart, Trash2, Filter, Download, Share2, Check, Tag, Building2, MapPin, DollarSign, Ruler, Star, Calendar } from 'lucide-react';

interface FavoriteItem {
  id: string;
  projectId: string;
  addedAt: string;
  tags: string[];
  notes: string;
}

interface Category {
  id: string;
  name: string;
  itemIds: string[];
}

interface FavoritesManagerProps {
  initialFavorites: string[];
  onProjectSelect: (project: NewHomeProject) => void;
  onFavorite: (project: NewHomeProject) => void;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({ initialFavorites, onProjectSelect, onFavorite }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // 初始化收藏数据
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    } else {
      // 从 initialFavorites 初始化
      const initialData: FavoriteItem[] = initialFavorites.map((projectId, index) => ({
        id: `fav-${Date.now()}-${index}`,
        projectId,
        addedAt: new Date().toISOString(),
        tags: [],
        notes: '',
      }));
      setFavorites(initialData);
      localStorage.setItem('favorites', JSON.stringify(initialData));
    }

    const storedCategories = localStorage.getItem('favoriteCategories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      const defaultCategories: Category[] = [
        { id: 'all', name: '全部', itemIds: [] },
        { id: 'wishlist', name: '愿望清单', itemIds: [] },
        { id: 'considering', name: '考虑中', itemIds: [] },
        { id: 'visited', name: '已参观', itemIds: [] },
      ];
      setCategories(defaultCategories);
      localStorage.setItem('favoriteCategories', JSON.stringify(defaultCategories));
    }
  }, [initialFavorites]);

  // 保存收藏数据到本地存储
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 保存分类数据到本地存储
  useEffect(() => {
    localStorage.setItem('favoriteCategories', JSON.stringify(categories));
  }, [categories]);

  // 获取收藏的楼盘项目
  const favoriteProjects = useMemo(() => {
    return favorites
      .map((favorite) => {
        const project = newHomeProjects.find((p) => p.id === favorite.projectId);
        return project ? { ...project, favoriteId: favorite.id, tags: favorite.tags, addedAt: favorite.addedAt } : null;
      })
      .filter((project): project is NewHomeProject & { favoriteId: string; tags: string[]; addedAt: string } => project !== null);
  }, [favorites]);

  // 根据分类筛选项目
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') {
      return favoriteProjects;
    }
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return [];
    return favoriteProjects.filter((project) => category.itemIds.includes(project.favoriteId));
  }, [favoriteProjects, categories, selectedCategory]);

  // 处理删除收藏
  const handleRemoveFavorite = (favoriteId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        itemIds: category.itemIds.filter((id) => id !== favoriteId),
      }))
    );
  };

  // 处理批量删除
  const handleBatchRemove = () => {
    if (selectedItems.length === 0) return;
    
    setFavorites((prev) => prev.filter((fav) => !selectedItems.includes(fav.id)));
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        itemIds: category.itemIds.filter((id) => !selectedItems.includes(id)),
      }))
    );
    setSelectedItems([]);
    setIsEditMode(false);
  };

  // 处理添加到对比
  const handleAddToComparison = (project: NewHomeProject) => {
    // 这里需要通过回调函数通知父组件添加到对比列表
    console.log('Add to comparison:', project.name);
  };

  // 处理添加分类
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: newCategoryName.trim(),
      itemIds: [],
    };
    
    setCategories((prev) => [...prev, newCategory]);
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  // 处理分类选择
  const handleCategorySelect = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          if (category.itemIds.includes(itemId)) {
            return {
              ...category,
              itemIds: category.itemIds.filter((id) => id !== itemId),
            };
          } else {
            return {
              ...category,
              itemIds: [...category.itemIds, itemId],
            };
          }
        }
        return category;
      })
    );
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectedItems.length === filteredProjects.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProjects.map((project) => project.favoriteId));
    }
  };

  // 处理单个项目选择
  const handleItemSelect = (favoriteId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(favoriteId)) {
        return prev.filter((id) => id !== favoriteId);
      } else {
        return [...prev, favoriteId];
      }
    });
  };

  if (favoriteProjects.length === 0) {
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
              我的<span className="text-orange-500">收藏</span>
            </h1>
          </div>

          {/* 空状态 */}
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <Heart className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">暂无收藏项目</h2>
            <p className="text-gray-500 text-center mb-8 max-w-md">
              浏览楼盘时点击收藏按钮，将喜欢的项目添加到收藏列表中
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
                我的<span className="text-orange-500">收藏</span>
              </h1>
            </div>
          <div className="flex items-center gap-4">
            {/* 编辑模式切换 */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isEditMode
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{isEditMode ? '完成' : '管理'}</span>
            </button>
            
            {/* 批量操作按钮 */}
            {isEditMode && selectedItems.length > 0 && (
              <button
                onClick={handleBatchRemove}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>删除 ({selectedItems.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* 分类和筛选 */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* 分类选择 */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 flex-wrap">
            {categories.map((category) => {
              const count = category.id === 'all' 
                ? favoriteProjects.length 
                : category.itemIds.length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 text-sm rounded-md transition-all ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category.name} {count > 0 && <span className="text-xs opacity-80">({count})</span>}
                </button>
              );
            })}
            
            {/* 添加分类按钮 */}
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
            >
              <Tag className="w-4 h-4 inline mr-1" />
              添加分类
            </button>
          </div>

          {/* 添加分类输入 */}
          {showAddCategory && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="输入分类名称"
                className="px-4 py-2 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
              >
                确定
              </button>
            </div>
          )}

          {/* 其他操作按钮 */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-4 py-2 text-sm bg-white/5 text-gray-400 rounded-lg hover:text-white hover:bg-white/10 transition-all">
              <Filter className="w-4 h-4" />
              筛选
            </button>
            <button className="flex items-center gap-1 px-4 py-2 text-sm bg-white/5 text-gray-400 rounded-lg hover:text-white hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" />
              导出
            </button>
            <button className="flex items-center gap-1 px-4 py-2 text-sm bg-white/5 text-gray-400 rounded-lg hover:text-white hover:bg-white/10 transition-all">
              <Share2 className="w-4 h-4" />
              分享
            </button>
          </div>
        </div>

        {/* 全选和统计 */}
        {isEditMode && (
          <div className="flex items-center justify-between mb-4 px-4 py-2 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className={`w-5 h-5 rounded border ${selectedItems.length === filteredProjects.length ? 'border-orange-500 bg-orange-500/20' : 'border-gray-400'} flex items-center justify-center transition-all`}
              >
                {selectedItems.length === filteredProjects.length && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </button>
              <span className="text-gray-400 text-sm">
                全选 ({selectedItems.length} / {filteredProjects.length})
              </span>
            </div>
            <span className="text-gray-400 text-sm">
              共 {favoriteProjects.length} 个收藏项目
            </span>
          </div>
        )}

        {/* 收藏列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isSelected = selectedItems.includes(project.favoriteId);
            const favoriteItem = favorites.find((fav) => fav.id === project.favoriteId);
            
            return (
              <div
                key={project.favoriteId}
                className={`bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border transition-all ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/30'
                    : 'border-white/10 hover:border-orange-500/50'
                }`}
              >
                {/* 项目图片 */}
                <div className="aspect-video relative">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    {/* 编辑模式选择框 */}
                    {isEditMode && (
                      <button
                        onClick={() => handleItemSelect(project.favoriteId)}
                        className={`w-6 h-6 rounded-full border ${isSelected ? 'border-orange-500 bg-orange-500/20' : 'border-gray-400'} flex items-center justify-center transition-all`}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    )}
                    {/* 收藏按钮 */}
                    <button
                      onClick={() => handleRemoveFavorite(project.favoriteId)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-all"
                      title="取消收藏"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  {/* 项目状态 */}
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 bg-black/70 backdrop-blur-lg rounded-lg text-xs font-medium ${
                      project.status === '在售'
                        ? 'text-green-400'
                        : project.status === '待售'
                        ? 'text-blue-400'
                        : 'text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* 项目信息 */}
                <div className="p-5">
                  {/* 项目标题 */}
                  <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <MapPin className="w-3 h-3" />
                    <span>{project.address}</span>
                  </div>

                  {/* 项目详情 */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-1 text-gray-300 text-sm">
                      <DollarSign className="w-3 h-3 text-orange-500" />
                      <span>{project.price.toLocaleString()}{project.priceUnit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 text-sm">
                      <Ruler className="w-3 h-3 text-orange-500" />
                      <span>{project.areaRange}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 text-sm">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      <span>{new Date(favoriteItem?.addedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 text-sm">
                      <Star className="w-3 h-3 text-orange-500" />
                      <span>{project.features.length} 个特色</span>
                    </div>
                  </div>

                  {/* 项目特色 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* 标签 */}
                  {favoriteItem?.tags && favoriteItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {favoriteItem.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleAddToComparison(project)}
                      className="flex items-center gap-1 px-3 py-2 text-xs bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all"
                    >
                      <Building2 className="w-3 h-3" />
                      添加到对比
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 分页或加载更多 */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">当前分类下暂无收藏项目</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesManager;