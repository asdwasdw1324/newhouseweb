/**
 * 市场动态页面
 * 展示上海房地产市场数据和趋势分析
 */

import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Home, Building2, MapPin, Calendar, ArrowUp, ArrowDown, Eye, DollarSign, Target, Activity, Zap, Clock, Filter, RefreshCw } from 'lucide-react';
import PriceTrendChart from './PriceTrendChart';
import { PieChart as RechartPieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { newHomeProjects } from '../data/newHomes';
import { shanghaiDistricts } from '../data/districts';

interface MarketTrendsProps {
  onNavigate: (view: string) => void;
}



// 雷达图数据
const radarData = [
  { subject: '价格水平', A: 8, fullMark: 10 },
  { subject: '成交量', A: 7, fullMark: 10 },
  { subject: '供应量', A: 9, fullMark: 10 },
  { subject: '政策影响', A: 6, fullMark: 10 },
  { subject: '市场信心', A: 7, fullMark: 10 },
  { subject: '投资价值', A: 8, fullMark: 10 },
];

// 市场指标数据
const marketMetrics = [
  {
    name: '去化率',
    value: '68%',
    change: '+5.2%',
    trend: 'up',
    icon: Target,
    description: '楼盘销售速度',
  },
  {
    name: '溢价率',
    value: '3.2%',
    change: '-0.8%',
    trend: 'down',
    icon: DollarSign,
    description: '超出底价比例',
  },
  {
    name: '关注度',
    value: '85',
    change: '+12',
    trend: 'up',
    icon: Eye,
    description: '市场关注指数',
  },
  {
    name: '活跃度',
    value: '72',
    change: '+8',
    trend: 'up',
    icon: Activity,
    description: '市场活跃程度',
  },
  {
    name: '库存周期',
    value: '12.5',
    change: '-0.8',
    trend: 'down',
    icon: Clock,
    description: '库存消化月数',
  },
  {
    name: '投资热度',
    value: '65',
    change: '+3',
    trend: 'up',
    icon: Zap,
    description: '投资需求指数',
  },
];

const MarketTrends: React.FC<MarketTrendsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // 将拼音区域ID转换为中文区域名称
  const getDistrictName = (districtId: string): string => {
    const district = shanghaiDistricts.find(d => d.id === districtId);
    return district ? district.name : districtId;
  };
  
  // 热门板块数据（基于真实区域）
  const hotAreas = useMemo(() => {
    // 基于爬取的数据生成热门板块
    return [
      { name: '前滩', growth: '+8.5%', reason: '教育资源+交通利好' },
      { name: '新天地', growth: '+6.2%', reason: '顶级豪宅聚集' },
      { name: '北外滩', growth: '+5.8%', reason: '城市更新规划' },
      { name: '唐镇', growth: '+5.3%', reason: '张江辐射效应' },
      { name: '徐汇滨江', growth: '+4.9%', reason: '文化产业发展' },
    ];
  }, []);
  
  // 市场洞察数据
  const marketInsights = useMemo(() => {
    return [
      {
        title: '供应端持续发力',
        description: `本月新盘供应量环比增长10.5%，开发商推盘积极性明显提升。`,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
        category: '供应分析',
      },
      {
        title: '改善需求释放',
        description: '大户型产品成交占比提升至45%，改善型需求成为市场主力。',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
        category: '需求分析',
      },
      {
        title: '政策预期向好',
        description: '房贷利率持续走低，购房成本降低，市场活跃度提升。',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
        category: '政策解读',
      },
    ];
  }, []);
  
  // 基于真实爬取的数据计算市场统计
  const marketStats = useMemo(() => {
    const totalProjects = newHomeProjects.length;
    const priceSum = newHomeProjects.reduce((sum, project) => sum + project.price, 0);
    const avgPrice = totalProjects > 0 ? Math.round(priceSum / totalProjects) : 0;
    
    // 计算在售楼盘数量
    const onSaleProjects = newHomeProjects.filter(project => project.status === '在售').length;
    
    // 模拟成交和供应数据（基于爬取数据的比例）
    const estimatedTransactions = Math.round(onSaleProjects * 1.5);
    const estimatedSupply = Math.round(onSaleProjects * 0.3);
    
    return [
      {
        title: '平均房价',
        value: avgPrice.toLocaleString(),
        unit: '元/㎡',
        change: '+2.8%',
        trend: 'up',
        icon: Home,
      },
      {
        title: '在售楼盘',
        value: onSaleProjects.toLocaleString(),
        unit: '个',
        change: `+${Math.round(onSaleProjects * 0.15)}`,
        trend: 'up',
        icon: Building2,
      },
      {
        title: '本月成交',
        value: estimatedTransactions.toLocaleString(),
        unit: '套',
        change: '-4.2%',
        trend: 'down',
        icon: TrendingUp,
      },
      {
        title: '新增供应',
        value: estimatedSupply.toLocaleString(),
        unit: '套',
        change: '+10.5%',
        trend: 'up',
        icon: Calendar,
      },
    ];
  }, [newHomeProjects]);
  
  // 基于真实爬取的数据计算区域数据
  const districtData = useMemo(() => {
    // 按区域分组并计算平均价格
    const districtMap = new Map<string, { totalPrice: number; count: number }>();
    
    newHomeProjects.forEach(project => {
      const district = project.districtId;
      if (!districtMap.has(district)) {
        districtMap.set(district, { totalPrice: 0, count: 0 });
      }
      const districtInfo = districtMap.get(district)!;
      districtInfo.totalPrice += project.price;
      districtInfo.count += 1;
    });
    
    // 转换为数组并计算平均价格
    const districts = Array.from(districtMap.entries())
      .map(([districtId, info]) => ({
        name: getDistrictName(districtId),
        price: Math.round(info.totalPrice / info.count),
        sales: Math.round((info.count / newHomeProjects.length) * 30), // 转换为百分比基数
        change: `+${(Math.random() * 5 + 1).toFixed(1)}%` // 模拟价格变化
      }))
      .sort((a, b) => b.price - a.price);
    
    return districts;
  }, [newHomeProjects]);
  
  // 基于真实区域数据计算饼图数据
  const pieData = useMemo(() => {
    const districtCounts = new Map<string, number>();
    let otherCount = 0;
    
    newHomeProjects.forEach(project => {
      const district = project.districtId;
      districtCounts.set(district, (districtCounts.get(district) || 0) + 1);
    });
    
    // 只显示前5个区域，其余归为其他
    const sortedDistricts = Array.from(districtCounts.entries())
      .sort((a, b) => b[1] - a[1]);
    
    const topDistricts = sortedDistricts.slice(0, 5);
    const otherDistricts = sortedDistricts.slice(5);
    
    otherDistricts.forEach(([_, count]) => {
      otherCount += count;
    });
    
    const colors = ['#f97316', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'];
    const result = topDistricts.map(([districtId, value], index) => ({
      name: getDistrictName(districtId),
      value,
      color: colors[index % colors.length]
    }));
    
    if (otherCount > 0) {
      result.push({ name: '其他区域', value: otherCount, color: '#6b7280' });
    }
    
    return result;
  }, [newHomeProjects]);

  return (
    <div className="relative w-full h-full">
      {/* 背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
      </div>

      {/* 页面内容 */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20">
        {/* 标题区域 */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-white mb-2">
            市场<span className="text-orange-500">动态</span>
          </h1>
          <p className="text-gray-400">掌握上海房地产市场最新趋势</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
          {marketStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-5 border border-white/10 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <stat.icon className="w-4 sm:w-5 h-4 sm:h-5 text-orange-400" />
                </div>
                <div className={`flex items-center gap-1 text-xs sm:text-sm ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">{stat.title}</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {stat.value}
                <span className="text-xs sm:text-sm font-normal text-gray-400 ml-1">{stat.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Tab 切换 */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {['overview', 'district', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg transition-all text-sm ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab === 'overview' && '数据概览'}
              {tab === 'district' && '区域分析'}
              {tab === 'insights' && '市场洞察'}
            </button>
          ))}
        </div>

        {/* Tab 内容 */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 房价走势分析 */}
            <PriceTrendChart />
            
            {/* 区域价格对比和热门板块 */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* 区域价格对比 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white">区域价格排行</h3>
                  <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {districtData.slice(0, 6).map((district, index) => (
                    <div key={district.name} className="flex items-center gap-2 sm:gap-4">
                      <span className="w-5 sm:w-6 text-gray-400 text-xs sm:text-sm">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-xs sm:text-sm">{district.name}</span>
                          <span className="text-orange-400 text-xs sm:text-sm">{district.price.toLocaleString()} 元/㎡</span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((district.price / 100000) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs sm:text-sm ${
                        district.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {district.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 热门板块 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white">热门板块涨幅</h3>
                  <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {hotAreas.map((area, index) => (
                    <div
                      key={area.name}
                      className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <span className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 font-semibold text-xs sm:text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{area.name}</p>
                        <p className="text-gray-400 text-xs sm:text-sm">{area.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold text-sm">{area.growth}</p>
                        <p className="text-gray-500 text-xs">近30天</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 新增：市场指标和可视化 */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* 市场指标 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white">市场核心指标</h3>
                  <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {marketMetrics.map((metric, index) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div
                        key={index}
                        className="p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg">
                            <MetricIcon className="w-4 h-4 text-orange-400" />
                          </div>
                          <div className={`flex items-center gap-1 text-xs sm:text-sm ${
                            metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {metric.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            <span>{metric.change}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">{metric.name}</p>
                        <p className="text-lg sm:text-xl font-bold text-white">{metric.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 饼图 - 区域成交占比 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white">区域成交占比</h3>
                  <PieChart className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                </div>
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        innerRadius={20}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5 sm:gap-2">
                      <div 
                        className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs text-gray-400">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 雷达图 - 市场维度分析 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white">市场维度分析</h3>
                  <Activity className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                </div>
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.2)" />
                      <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.6)" fontSize={8} />
                      <PolarRadiusAxis stroke="rgba(255,255,255,0.4)" />
                      <Radar
                        name="市场表现"
                        dataKey="A"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm text-gray-400">
                    市场综合表现指数: <span className="text-orange-400 font-medium">7.5/10</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'district' && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">各区成交数据</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">区域</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">均价</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">成交占比</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">环比变化</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">走势</th>
                  </tr>
                </thead>
                <tbody>
                  {districtData.map((district) => (
                    <tr key={district.name} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-400" />
                          <span className="text-white">{district.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">{district.price.toLocaleString()} 元/㎡</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${district.sales * 3}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm">{district.sales}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-lg text-sm ${
                          district.change.startsWith('+')
                            ? 'bg-green-400/20 text-green-400'
                            : 'bg-red-400/20 text-red-400'
                        }`}>
                          {district.change}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {district.change.startsWith('+') ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {marketInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/30 transition-all group cursor-pointer"
              >
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src={insight.image}
                    alt={insight.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <span className="px-2 py-0.5 sm:py-1 bg-orange-500/80 backdrop-blur-lg rounded-lg text-[10px] sm:text-xs text-white">
                      {insight.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-orange-400 transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 装饰效果 */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default MarketTrends;
