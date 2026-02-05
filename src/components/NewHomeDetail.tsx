/**
 * 新房项目详情组件
 * 展示单个新房项目的详细信息
 */

import React, { useState } from 'react';
import { NewHomeProject } from '../data/newHomes';
import {
  ArrowLeft,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  Building2,
  Phone,
  Heart,
  Share2,
  Star,
  Check,
  Clock,
  Car,
  ShoppingCart,
  BookOpen,
  Stethoscope,
} from 'lucide-react';

interface NewHomeDetailProps {
  project: NewHomeProject;
  onBack: () => void;
  onFavorite: (project: NewHomeProject) => void;
  onAddToComparison?: (project: NewHomeProject) => void;
  isFavorite?: boolean;
}

const NewHomeDetail: React.FC<NewHomeDetailProps> = ({
  project,
  onBack,
  onFavorite,
  onAddToComparison,
  isFavorite = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const featureIcons: Record<string, React.ReactNode> = {
    '近地铁': <Car className="w-4 h-4" />,
    '商业配套': <ShoppingCart className="w-4 h-4" />,
    '学区资源': <BookOpen className="w-4 h-4" />,
    '医疗配套': <Stethoscope className="w-4 h-4" />,
    '江景房': <MapPin className="w-4 h-4" />,
    '精装修': <Building2 className="w-4 h-4" />,
    '智能家居': <Star className="w-4 h-4" />,
    '顶级装修': <Star className="w-4 h-4" />,
    '泳池会所': <Star className="w-4 h-4" />,
    '管家服务': <Star className="w-4 h-4" />,
  };

  const displayedFeatures = showAllFeatures ? project.features : project.features.slice(0, 4);

  return (
    <div className="relative w-full h-full">
      {/* 详情页面容器 */}
      <div className="detail-container min-h-screen pb-20">
        {/* 顶部导航 */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-orange-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onFavorite(project)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-orange-500/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => onAddToComparison?.(project)}
                className="p-2 bg-white/10 text-gray-300 rounded-full hover:bg-orange-500/30 transition-colors"
                title="添加到对比"
              >
                <Building2 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/10 text-gray-300 rounded-full hover:bg-orange-500/30 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容区 */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧 - 图片画廊 */}
            <div className="space-y-4">
              {/* 主图 */}
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover image-hover-effect"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-lg rounded-lg">
                  <span className="text-white font-semibold">
                    {currentImageIndex + 1} / 5
                  </span>
                </div>
              </div>

              {/* 缩略图 */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index - 1)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index - 1
                        ? 'border-orange-500'
                        : 'border-transparent hover:border-orange-500/50'
                    }`}
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${1600 + index}-${1600500 + index * 100}?w=200`}
                      alt={`${project.name} 效果图 ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧 - 基本信息 */}
            <div className="space-y-6">
              {/* 标题和价格 */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                  <span
                    className={`status-tag ${
                      project.status === '在售'
                        ? 'selling'
                        : project.status === '待售'
                        ? 'pending'
                        : 'soldout'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{project.address}</span>
                </div>
              </div>

              {/* 价格信息 */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">单价</p>
                    <p className="text-3xl font-bold text-orange-400">
                      {project.price?.toLocaleString()}
                      <span className="text-lg font-normal text-gray-400 ml-1">
                        {project.priceUnit}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">户型面积</p>
                    <p className="text-xl font-semibold text-white">{project.areaRange}</p>
                  </div>
                </div>
              </div>

              {/* 开发商信息 */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <Building2 className="w-10 h-10 text-orange-500" />
                <div>
                  <p className="text-gray-400 text-sm">开发商</p>
                  <p className="text-white font-semibold">{project.developer}</p>
                </div>
              </div>

              {/* 项目特色 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">项目特色</h3>
                <div className="grid grid-cols-2 gap-3">
                  {displayedFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20"
                    >
                      <div className="text-orange-500">
                        {featureIcons[feature] || <Check className="w-4 h-4" />}
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                {project.features.length > 4 && (
                  <button
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="mt-3 text-orange-400 text-sm hover:text-orange-300 transition-colors"
                  >
                    {showAllFeatures
                      ? '收起全部特色'
                      : `查看全部 ${project.features.length} 个特色`}
                  </button>
                )}
              </div>

              {/* 预约咨询按钮 */}
              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 min-w-touch min-h-touch">
                  <Phone className="w-5 h-5" />
                  立即预约看房
                </button>
                <button className="flex-1 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 min-w-touch min-h-touch">
                  <Calendar className="w-5 h-5" />
                  咨询详情
                </button>
              </div>
            </div>
          </div>

          {/* 项目介绍 */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">项目介绍</h2>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <p className="text-gray-300 leading-relaxed">{project.description}</p>
            </div>
          </div>

          {/* 地图位置 */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">位置周边</h2>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="aspect-[2/1] bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                  <p className="text-gray-400">{project.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    经度: {project.coordinates.lng.toFixed(4)} | 纬度: {project.coordinates.lat.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 相似推荐 */}
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">相似推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer"
                >
                  <div className="aspect-video bg-gray-800">
                    <img
                      src={`https://images.unsplash.com/photo-${1600 + index}-${1600500 + index * 100}?w=400`}
                      alt={`相似项目 ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-1">附近相似楼盘 {index}</h3>
                    <p className="text-orange-400 text-sm">
                      {(project.price! * (0.9 + index * 0.05)).toLocaleString()} 元/㎡起
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHomeDetail;
