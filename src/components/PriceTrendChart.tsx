/**
 * 房价走势图表组件
 * 展示房价走势分析数据
 */

import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, BarChart, Bar, ReferenceLine } from 'recharts';
import { Calendar, TrendingUp, Filter, Download, ArrowUp, ArrowDown, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface PriceTrendData {
  date: string;
  price: number;
  volume: number;
  averageArea: number;
}

interface DistrictPriceData {
  districtId: string;
  districtName: string;
  trends: PriceTrendData[];
}

interface PriceTrendChartProps {
  initialDistrict?: string;
  initialTimeRange?: '3m' | '6m' | '1y' | '2y' | '5y';
}

// 模拟房价走势数据
const generateMockData = (months: number): PriceTrendData[] => {
  const data: PriceTrendData[] = [];
  const startDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() - i);
    
    const basePrice = 65000 + Math.random() * 5000;
    const baseVolume = 3000 + Math.random() * 2000;
    const baseArea = 100 + Math.random() * 30;
    
    data.push({
      date: date.toISOString().slice(0, 7), // YYYY-MM 格式
      price: Math.round(basePrice),
      volume: Math.round(baseVolume),
      averageArea: Math.round(baseArea * 10) / 10,
    });
  }
  
  return data;
};

// 各区域模拟数据
const districtData: DistrictPriceData[] = [
  {
    districtId: 'all',
    districtName: '全市',
    trends: generateMockData(24),
  },
  {
    districtId: 'pudong',
    districtName: '浦东新区',
    trends: generateMockData(24),
  },
  {
    districtId: 'huangpu',
    districtName: '黄浦区',
    trends: generateMockData(24),
  },
  {
    districtId: 'jing-an',
    districtName: '静安区',
    trends: generateMockData(24),
  },
  {
    districtId: 'xuhui',
    districtName: '徐汇区',
    trends: generateMockData(24),
  },
];

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ initialDistrict = 'all', initialTimeRange = '1y' }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | '2y' | '5y'>(initialTimeRange);
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [showVolume, setShowVolume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  const [expandedStats, setExpandedStats] = useState(false);

  // 触发图表动画
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAnimateChart(true);
      const resetTimer = setTimeout(() => {
        setAnimateChart(false);
      }, 1000);
      return () => clearTimeout(resetTimer);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedDistrict, timeRange, chartType]);

  // 根据时间范围过滤数据
  const filteredData = useMemo(() => {
    const district = districtData.find(d => d.districtId === selectedDistrict) || districtData[0];
    const monthsMap = {
      '3m': 3,
      '6m': 6,
      '1y': 12,
      '2y': 24,
      '5y': 60,
    };
    
    return district.trends.slice(-monthsMap[timeRange]);
  }, [selectedDistrict, timeRange]);

  // 计算额外统计数据
  const additionalStats = useMemo(() => {
    if (filteredData.length === 0) return {
      highestPrice: 0,
      lowestPrice: 0,
      avgVolume: 0,
      priceVolatility: 0
    };
    
    const prices = filteredData.map(item => item.price);
    const volumes = filteredData.map(item => item.volume);
    
    return {
      highestPrice: Math.max(...prices),
      lowestPrice: Math.min(...prices),
      avgVolume: Math.round(volumes.reduce((sum, val) => sum + val, 0) / volumes.length),
      priceVolatility: Math.round((Math.max(...prices) - Math.min(...prices)) / Math.min(...prices) * 100 * 10) / 10
    };
  }, [filteredData]);

  // 计算趋势
  const trend = useMemo(() => {
    if (filteredData.length < 2) return 'stable';
    const firstPrice = filteredData[0].price;
    const lastPrice = filteredData[filteredData.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  }, [filteredData]);

  // 计算平均价格
  const averagePrice = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const sum = filteredData.reduce((acc, curr) => acc + curr.price, 0);
    return Math.round(sum / filteredData.length);
  }, [filteredData]);

  // 计算价格变化
  const priceChange = useMemo(() => {
    if (filteredData.length < 2) return 0;
    const firstPrice = filteredData[0].price;
    const lastPrice = filteredData[filteredData.length - 1].price;
    return Math.round(((lastPrice - firstPrice) / firstPrice) * 100 * 10) / 10;
  }, [filteredData]);

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      {/* 标题和控制区 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">房价走势分析</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{districtData.find(d => d.districtId === selectedDistrict)?.districtName || '全市'}</span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-400">
              {timeRange === '3m' && '近3个月'}
              {timeRange === '6m' && '近6个月'}
              {timeRange === '1y' && '近1年'}
              {timeRange === '2y' && '近2年'}
              {timeRange === '5y' && '近5年'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* 时间范围选择 */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {(['3m', '6m', '1y', '2y', '5y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {range === '3m' && '3M'}
                {range === '6m' && '6M'}
                {range === '1y' && '1Y'}
                {range === '2y' && '2Y'}
                {range === '5y' && '5Y'}
              </button>
            ))}
          </div>
          
          {/* 图表类型选择 */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {(['line', 'area', 'bar'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  chartType === type
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {type === 'line' && '折线'}
                {type === 'area' && '面积'}
                {type === 'bar' && '柱状'}
              </button>
            ))}
          </div>
          
          {/* 区域选择 */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-white/5 text-white text-sm rounded-lg px-3 py-2 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              {districtData.map((district) => (
                <option key={district.districtId} value={district.districtId}>
                  {district.districtName}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          {/* 显示成交量 */}
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-all ${
              showVolume
                ? 'bg-orange-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            成交量
          </button>
          
          {/* 下载按钮 */}
          <button className="flex items-center gap-1 px-3 py-1 text-xs bg-white/5 text-gray-400 rounded-md hover:text-white hover:bg-white/10 transition-all">
            <Download className="w-3 h-3" />
            下载
          </button>
        </div>
      </div>
      
      {/* 统计数据 */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
            <p className="text-sm text-gray-400 mb-1">平均价格</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-white">{averagePrice.toLocaleString()}</p>
              <p className="text-sm text-gray-400">元/㎡</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
            <p className="text-sm text-gray-400 mb-1">价格变化</p>
            <div className="flex items-center gap-2">
              <p className={`text-xl font-bold ${
                priceChange > 0 ? 'text-green-400' : priceChange < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {priceChange > 0 ? '+' : ''}{priceChange}%
              </p>
              {priceChange > 0 && <ArrowUp className="w-4 h-4 text-green-400" />}
              {priceChange < 0 && <ArrowDown className="w-4 h-4 text-red-400" />}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
            <p className="text-sm text-gray-400 mb-1">市场趋势</p>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                trend === 'up'
                  ? 'bg-green-400/20 text-green-400'
                  : trend === 'down'
                  ? 'bg-red-400/20 text-red-400'
                  : 'bg-gray-400/20 text-gray-400'
              }`}>
                {trend === 'up' && '上涨'}
                {trend === 'down' && '下跌'}
                {trend === 'stable' && '稳定'}
              </span>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* 扩展统计数据 */}
        <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
          <button
            onClick={() => setExpandedStats(!expandedStats)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-all duration-300"
          >
            <span className="text-sm font-medium text-white">详细统计数据</span>
            {expandedStats ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedStats && (
            <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
              <div>
                <p className="text-xs text-gray-400 mb-1">最高价格</p>
                <p className="text-sm text-orange-400 font-medium">{additionalStats.highestPrice.toLocaleString()} 元/㎡</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">最低价格</p>
                <p className="text-sm text-blue-400 font-medium">{additionalStats.lowestPrice.toLocaleString()} 元/㎡</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">平均成交量</p>
                <p className="text-sm text-green-400 font-medium">{additionalStats.avgVolume.toLocaleString()} 套</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">价格波动率</p>
                <p className="text-sm text-purple-400 font-medium">{additionalStats.priceVolatility}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 加载动画 */}
      {isLoading ? (
        <div className="h-80 flex items-center justify-center bg-black/30 rounded-lg">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-400">加载数据中...</p>
          </div>
        </div>
      ) : (
        /* 图表区域 */
        <div className={`h-80 transition-all duration-500 ${animateChart ? 'scale-[1.01]' : 'scale-100'}`}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    borderColor: 'rgba(249, 115, 22, 0.3)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  itemStyle={{ color: '#f97316' }}
                  formatter={(value: number) => [`${value.toLocaleString()}`, '']}
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: '10px',
                    fontSize: '12px'
                  }}
                />
                <ReferenceLine 
                  y={averagePrice} 
                  stroke="rgba(249, 115, 22, 0.6)" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `均价: ${averagePrice.toLocaleString()}`, 
                    position: 'right',
                    fill: 'rgba(249, 115, 22, 0.8)',
                    fontSize: '12'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  name="房价" 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  activeDot={{ 
                    r: 10, 
                    fill: '#f97316',
                    stroke: '#fff',
                    strokeWidth: 2
                  }} 
                  dot={{ 
                    r: 5, 
                    fill: '#f97316', 
                    strokeWidth: 2, 
                    stroke: '#fff'
                  }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
                {showVolume && (
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    name="成交量" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ 
                      r: 4, 
                      fill: '#3b82f6', 
                      strokeWidth: 1, 
                      stroke: '#fff'
                    }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                )}
              </LineChart>
            ) : chartType === 'area' ? (
              <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    borderColor: 'rgba(249, 115, 22, 0.3)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Legend />
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  name="房价" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  strokeWidth={3}
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
                {showVolume && (
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    name="成交量" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                    strokeWidth={2}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                )}
              </AreaChart>
            ) : (
              <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    borderColor: 'rgba(249, 115, 22, 0.3)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Legend />
                <Bar 
                  dataKey="price" 
                  name="房价" 
                  fill="#f97316" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  barSize={30}
                />
                {showVolume && (
                  <Bar 
                    dataKey="volume" 
                    name="成交量" 
                    fill="#3b82f6" 
                    radius={[6, 6, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    barSize={30}
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
      
      {/* 分析结论 */}
      <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
        <h4 className="text-sm font-medium text-white mb-2">市场分析</h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          {trend === 'up' && `根据近${timeRange === '3m' ? '3个月' : timeRange === '6m' ? '6个月' : timeRange === '1y' ? '1年' : timeRange === '2y' ? '2年' : '5年'}的数据显示，${districtData.find(d => d.districtId === selectedDistrict)?.districtName || '全市'}房价呈现${priceChange > 10 ? '显著' : ''}上涨趋势，平均涨幅为${priceChange}%。建议购房者关注市场动态，把握购房时机。`}
          {trend === 'down' && `根据近${timeRange === '3m' ? '3个月' : timeRange === '6m' ? '6个月' : timeRange === '1y' ? '1年' : timeRange === '2y' ? '2年' : '5年'}的数据显示，${districtData.find(d => d.districtId === selectedDistrict)?.districtName || '全市'}房价呈现${Math.abs(priceChange) > 10 ? '显著' : ''}下跌趋势，平均跌幅为${Math.abs(priceChange)}%。建议购房者可以适当观望，寻找合适的购房机会。`}
          {trend === 'stable' && `根据近${timeRange === '3m' ? '3个月' : timeRange === '6m' ? '6个月' : timeRange === '1y' ? '1年' : timeRange === '2y' ? '2年' : '5年'}的数据显示，${districtData.find(d => d.districtId === selectedDistrict)?.districtName || '全市'}房价保持稳定，波动幅度较小。建议购房者根据自身需求和预算，选择合适的购房时机。`}
        </p>
      </div>
    </div>
  );
};

export default PriceTrendChart;