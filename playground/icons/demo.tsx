import React, { useState } from 'react';
import {
  HouseIcon,
  MapIcon,
  PriceIcon,
  AreaIcon,
  SearchIcon,
  FavoriteIcon,
  CompareIcon,
  ShareIcon,
  DetailIcon,
  ApartmentIcon,
  VillaIcon,
  CommercialIcon,
  OfficeIcon
} from './RealEstateIcons';

const IconDemo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const iconCategories = [
    { id: 'all', name: '全部' },
    { id: 'core', name: '核心功能' },
    { id: 'interaction', name: '交互' },
    { id: 'category', name: '分类' }
  ];

  const icons = [
    {
      name: 'HouseIcon',
      component: HouseIcon,
      category: 'core',
      description: '房子/住宅图标（Apple风格立体设计）',
      code: '<HouseIcon size={24} color="#f97316" />'
    },
    {
      name: 'MapIcon',
      component: MapIcon,
      category: 'core',
      description: '地图/位置图标（Apple风格）',
      code: '<MapIcon size={24} color="#f97316" />'
    },
    {
      name: 'PriceIcon',
      component: PriceIcon,
      category: 'core',
      description: '价格/财务图标（Apple风格）',
      code: '<PriceIcon size={24} color="#f97316" />'
    },
    {
      name: 'AreaIcon',
      component: AreaIcon,
      category: 'core',
      description: '面积/尺寸图标（Apple风格）',
      code: '<AreaIcon size={24} color="#f97316" />'
    },
    {
      name: 'SearchIcon',
      component: SearchIcon,
      category: 'core',
      description: '搜索/筛选图标（Apple风格）',
      code: '<SearchIcon size={24} color="#f97316" />'
    },
    {
      name: 'FavoriteIcon',
      component: FavoriteIcon,
      category: 'interaction',
      description: '收藏/喜欢图标（Apple风格）',
      code: '<FavoriteIcon size={24} color="#f97316" />'
    },
    {
      name: 'CompareIcon',
      component: CompareIcon,
      category: 'interaction',
      description: '对比/比较图标（Apple风格）',
      code: '<CompareIcon size={24} color="#f97316" />'
    },
    {
      name: 'ShareIcon',
      component: ShareIcon,
      category: 'interaction',
      description: '分享图标（Apple风格）',
      code: '<ShareIcon size={24} color="#f97316" />'
    },
    {
      name: 'DetailIcon',
      component: DetailIcon,
      category: 'interaction',
      description: '查看详情图标（Apple风格）',
      code: '<DetailIcon size={24} color="#f97316" />'
    },
    {
      name: 'ApartmentIcon',
      component: ApartmentIcon,
      category: 'category',
      description: '公寓/住宅图标（Apple风格）',
      code: '<ApartmentIcon size={24} color="#f97316" />'
    },
    {
      name: 'VillaIcon',
      component: VillaIcon,
      category: 'category',
      description: '别墅/豪宅图标（Apple风格）',
      code: '<VillaIcon size={24} color="#f97316" />'
    },
    {
      name: 'CommercialIcon',
      component: CommercialIcon,
      category: 'category',
      description: '商业地产图标（Apple风格）',
      code: '<CommercialIcon size={24} color="#f97316" />'
    },
    {
      name: 'OfficeIcon',
      component: OfficeIcon,
      category: 'category',
      description: '写字楼图标（Apple风格）',
      code: '<OfficeIcon size={24} color="#f97316" />'
    }
  ];

  const filteredIcons = icons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            房地产Web图标库
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            一套专为房地产Web网站设计的现代图标，包含核心功能、交互和分类图标
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索图标..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2">
            {iconCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === category.id ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 图标网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIcons.map((icon, index) => {
            const IconComponent = icon.component;
            return (
              <div
                key={icon.name}
                className="bg-gray-800 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/10 transition-all"
              >
                {/* 图标展示 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <IconComponent size={32} color="#f97316" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-400">{icon.category === 'core' ? '核心功能' : icon.category === 'interaction' ? '交互' : '分类'}</span>
                    <span className="text-xs text-gray-500 mt-1">{index + 1}</span>
                  </div>
                </div>

                {/* 图标信息 */}
                <h3 className="text-xl font-semibold mb-2">{icon.name}</h3>
                <p className="text-gray-400 mb-4">{icon.description}</p>

                {/* 代码示例 */}
                <div className="bg-gray-900 rounded-lg p-3 mb-4 overflow-x-auto">
                  <code className="text-sm text-gray-300">{icon.code}</code>
                </div>

                {/* 尺寸示例 */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex flex-col items-center">
                    <IconComponent size={16} color="#f97316" />
                    <span className="text-xs text-gray-500 mt-1">16px</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <IconComponent size={24} color="#f97316" />
                    <span className="text-xs text-gray-500 mt-1">24px</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <IconComponent size={32} color="#f97316" />
                    <span className="text-xs text-gray-500 mt-1">32px</span>
                  </div>
                </div>

                {/* 颜色示例 */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <IconComponent size={24} color="#f97316" />
                    <span className="text-xs text-gray-500 mt-1">橙色</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <IconComponent size={24} color="#3b82f6" />
                    <span className="text-xs text-gray-500 mt-1">蓝色</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <IconComponent size={24} color="#10b981" />
                    <span className="text-xs text-gray-500 mt-1">绿色</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 使用说明 */}
        <div className="mt-16 bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">使用说明</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. 导入图标</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">
                  {`import { HouseIcon, MapIcon, PriceIcon } from './playground/icons';`}
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2. 使用图标</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">
                  {`<HouseIcon size={24} color="#f97316" className="hover:scale-110 transition-transform" />`}
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3. 自定义属性</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li><code className="text-sm bg-gray-900 px-1 rounded">size</code>: 图标大小（默认: 24）</li>
                <li><code className="text-sm bg-gray-900 px-1 rounded">color</code>: 图标颜色（默认: #f97316）</li>
                <li><code className="text-sm bg-gray-900 px-1 rounded">className</code>: 自定义CSS类</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2026 房地产Web图标库 - 为上海新房网站设计</p>
        </div>
      </div>
    </div>
  );
};

export default IconDemo;
