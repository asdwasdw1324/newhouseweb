import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// 房子/住宅图标（Apple风格立体设计）
export const HouseIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
    >
      <defs>
        <linearGradient id="houseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <filter id="houseShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 房子主体 */}
      <path
        d="M12 18 L20 10 L28 18 L28 32 L12 32 Z"
        fill="url(#houseGradient)"
        filter="url(#houseShadow)"
      />
      {/* 房子边框 */}
      <path
        d="M12 18 L20 10 L28 18 L28 32 L12 32 Z"
        fill="none"
        stroke="#ea580c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 屋顶 */}
      <path
        d="M10 18 L20 8 L30 18"
        fill="url(#roofGradient)"
        filter="url(#houseShadow)"
      />
      {/* 屋顶边框 */}
      <path
        d="M10 18 L20 8 L30 18"
        fill="none"
        stroke="#c2410c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 门 */}
      <rect x="18" y="24" width="4" height="8" rx="1" fill="white" opacity="0.9" />
      <path
        d="M20 28 L20 32"
        stroke="#ea580c"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      {/* 窗户 */}
      <rect x="14" y="19" width="3" height="3" rx="0.5" fill="white" opacity="0.8" />
      <path
        d="M15.5 19 L15.5 22"
        stroke="#ea580c"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M14 20.5 L17 20.5"
        stroke="#ea580c"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <rect x="23" y="19" width="3" height="3" rx="0.5" fill="white" opacity="0.8" />
      <path
        d="M24.5 19 L24.5 22"
        stroke="#ea580c"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <path
        d="M23 20.5 L26 20.5"
        stroke="#ea580c"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      {/* 房脊 */}
      <path
        d="M20 8 L20 18"
        stroke="#c2410c"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* 地面阴影 */}
      <path
        d="M12 32 L28 32"
        stroke="#c2410c"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <ellipse cx="20" cy="33" rx="8" ry="1" fill="rgba(0,0,0,0.1)" />
    </svg>
  );
};

// 地图/位置图标（Apple风格）
export const MapIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 地图标记底部 */}
      <path
        d="M12 10 L12 20 L8 16 L16 16 L12 20 Z"
        fill={color}
        filter="url(#mapShadow)"
      />
      {/* 地图标记边框 */}
      <path
        d="M12 10 L12 20 L8 16 L16 16 L12 20 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 中心圆点 */}
      <circle cx="12" cy="10" r="3" fill={color} filter="url(#mapShadow)" />
      {/* 圆点边框 */}
      <circle cx="12" cy="10" r="3"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 高光效果 */}
      <circle cx="11" cy="9" r="1" fill="white" opacity="0.8" />
    </svg>
  );
};

// 价格/财务图标（Apple风格）
export const PriceIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="priceShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 背景圆环 */}
      <circle cx="12" cy="12" r="8" fill={color} opacity="0.1" />
      {/* 价格标签 */}
      <path
        d="M12 8 L12 16 L10 14 L14 14 L12 16"
        fill={color}
        filter="url(#priceShadow)"
      />
      {/* 价格标签边框 */}
      <path
        d="M12 8 L12 16 L10 14 L14 14 L12 16"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 人民币符号 */}
      <text x="12" y="14.5" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        ¥
      </text>
      {/* 高光效果 */}
      <circle cx="11" cy="11" r="1" fill="white" opacity="0.6" />
    </svg>
  );
};

// 面积/尺寸图标（Apple风格）
export const AreaIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="areaShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 背景矩形 */}
      <rect x="4" y="4" width="16" height="16" rx="2" fill={color} opacity="0.1" />
      {/* 矩形边框 */}
      <rect x="4" y="4" width="16" height="16" rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 水平线 */}
      <path
        d="M4 12 L20 12"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="2,2"
      />
      {/* 垂直线 */}
      <path
        d="M12 4 L12 20"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="2,2"
      />
      {/* 面积符号 */}
      <text x="12" y="14.5" textAnchor="middle" fill={color} fontSize="7" fontWeight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        m²
      </text>
      {/* 高光效果 */}
      <circle cx="5" cy="5" r="1" fill="white" opacity="0.6" />
    </svg>
  );
};

// 搜索/筛选图标（Apple风格）
export const SearchIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="searchShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 搜索圆环 */}
      <circle cx="11" cy="11" r="8" fill="none" stroke={color} strokeWidth="1.5" />
      {/* 搜索手柄 */}
      <path
        d="M21 21 L16.65 16.65"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* 高光效果 */}
      <circle cx="8" cy="8" r="1" fill="white" opacity="0.6" />
    </svg>
  );
};

// 收藏/喜欢图标（Apple风格）
export const FavoriteIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="favoriteShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 心形主体 */}
      <path
        d="M12 21.35 L10.55 20.03 C5.4 15.36 2 12.28 2 8.5 C2 5.42 4.42 3 7.5 3 C9.24 3 10.91 3.81 12 5.09 C13.09 3.81 14.76 3 16.5 3 C19.58 3 22 5.42 22 8.5 C22 12.28 18.6 15.36 13.45 20.03 L12 21.35 Z"
        fill={color}
        filter="url(#favoriteShadow)"
      />
      {/* 心形边框 */}
      <path
        d="M12 21.35 L10.55 20.03 C5.4 15.36 2 12.28 2 8.5 C2 5.42 4.42 3 7.5 3 C9.24 3 10.91 3.81 12 5.09 C13.09 3.81 14.76 3 16.5 3 C19.58 3 22 5.42 22 8.5 C22 12.28 18.6 15.36 13.45 20.03 L12 21.35 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 高光效果 */}
      <path
        d="M12 9 L14 7 L12 5 L10 7 Z"
        fill="white"
        opacity="0.4"
      />
    </svg>
  );
};

// 对比/比较图标（Apple风格）
export const CompareIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="compareShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 左侧卡片 */}
      <rect x="4" y="6" width="6" height="12" rx="2" fill={color} opacity="0.1" />
      <rect x="4" y="6" width="6" height="12" rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 右侧卡片 */}
      <rect x="14" y="6" width="6" height="12" rx="2" fill={color} opacity="0.1" />
      <rect x="14" y="6" width="6" height="12" rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 连接线条 */}
      <path
        d="M10 12 L14 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 10 L12 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* 高光效果 */}
      <circle cx="5" cy="7" r="1" fill="white" opacity="0.6" />
      <circle cx="15" cy="7" r="1" fill="white" opacity="0.6" />
    </svg>
  );
};

// 分享图标（Apple风格）
export const ShareIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="shareShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 顶部圆点 */}
      <circle cx="18" cy="5" r="3" fill={color} filter="url(#shareShadow)" />
      <circle cx="18" cy="5" r="3"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 中间圆点 */}
      <circle cx="6" cy="12" r="3" fill={color} filter="url(#shareShadow)" />
      <circle cx="6" cy="12" r="3"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 底部圆点 */}
      <circle cx="18" cy="19" r="3" fill={color} filter="url(#shareShadow)" />
      <circle cx="18" cy="19" r="3"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 连接线 */}
      <path
        d="M8.59 13.51 L15.42 17.49"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.41 6.51 L8.59 10.49"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* 高光效果 */}
      <circle cx="17" cy="4" r="1" fill="white" opacity="0.6" />
      <circle cx="5" cy="11" r="1" fill="white" opacity="0.6" />
      <circle cx="17" cy="18" r="1" fill="white" opacity="0.6" />
    </svg>
  );
};

// 查看详情图标（Apple风格）
export const DetailIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="detailShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 背景圆环 */}
      <circle cx="12" cy="12" r="10" fill={color} opacity="0.1" />
      <circle cx="12" cy="12" r="10"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 垂直线 */}
      <path
        d="M12 8 L12 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* 水平线 */}
      <path
        d="M8 12 L16 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* 高光效果 */}
      <circle cx="9" cy="9" r="1" fill="white" opacity="0.6" />
    </svg>
  );
};

// 公寓/住宅图标（Apple风格）
export const ApartmentIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="apartmentShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 建筑主体 */}
      <rect x="4" y="4" width="16" height="16" rx="2" fill={color} opacity="0.1" />
      <rect x="4" y="4" width="16" height="16" rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 楼层分隔 */}
      <path
        d="M4 10 L20 10"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M4 16 L20 16"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 垂直分隔 */}
      <path
        d="M10 4 L10 20"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M16 4 L16 10"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 窗户细节 */}
      <rect x="5" y="5" width="3" height="3" rx="0.5" fill="white" opacity="0.6" />
      <rect x="11" y="5" width="3" height="3" rx="0.5" fill="white" opacity="0.6" />
      <rect x="17" y="5" width="3" height="3" rx="0.5" fill="white" opacity="0.6" />
      <rect x="5" y="11" width="3" height="3" rx="0.5" fill="white" opacity="0.6" />
      <rect x="11" y="11" width="3" height="3" rx="0.5" fill="white" opacity="0.6" />
      <rect x="17" y="11" width="3" height="3" rx="0.5" fill="white" opacity="0.6" />
      <rect x="5" y="17" width="3" height="3" rx="0.5" fill="white" opacity="0.6" />
      <rect x="11" y="17" width="3" height="3" rx="0.5" fill="white" opacity="0.6" />
      <rect x="17" y="17" width="3" height="3" rx="0.5" fill="white" opacity="0.6" />
    </svg>
  );
};

// 别墅/豪宅图标（Apple风格）
export const VillaIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <linearGradient id="villaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="villaShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 别墅主体 */}
      <path
        d="M6 12 L12 8 L18 12 L18 20 L6 20 L6 12 Z"
        fill="url(#villaGradient)"
        opacity="0.1"
      />
      <path
        d="M6 12 L12 8 L18 12 L18 20 L6 20 L6 12 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 屋顶 */}
      <path
        d="M6 12 L12 8 L18 12"
        fill="url(#villaGradient)"
        opacity="0.8"
        filter="url(#villaShadow)"
      />
      <path
        d="M6 12 L12 8 L18 12"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 中央分隔 */}
      <path
        d="M12 12 L12 20"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 门廊 */}
      <path
        d="M9 16 L15 16"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 窗户细节 */}
      <rect x="7" y="13" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="15" y="13" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="7" y="17" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="15" y="17" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      {/* 门 */}
      <rect x="11" y="17" width="2" height="3" rx="0.5" fill="white" opacity="0.8" />
      {/* 屋顶脊线 */}
      <path
        d="M12 8 L12 12"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  );
};

// 商业地产图标（Apple风格）
export const CommercialIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="commercialShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 建筑主体 */}
      <rect x="4" y="6" width="16" height="14" rx="2" fill={color} opacity="0.1" />
      <rect x="4" y="6" width="16" height="14" rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 楼层分隔 */}
      <path
        d="M4 10 L20 10"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M4 14 L20 14"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M4 18 L20 18"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 顶部标志 */}
      <rect x="8" y="2" width="8" height="4" rx="1" fill={color} filter="url(#commercialShadow)" />
      <rect x="8" y="2" width="8" height="4" rx="1"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 窗户细节 */}
      <rect x="5" y="7" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="9" y="7" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="13" y="7" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="17" y="7" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="5" y="11" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="9" y="11" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="13" y="11" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="17" y="11" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="5" y="15" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="9" y="15" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="13" y="15" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="17" y="15" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="5" y="19" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="9" y="19" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="13" y="19" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="17" y="19" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
    </svg>
  );
};

// 写字楼图标（Apple风格）
export const OfficeIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#f97316',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <filter id="officeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      {/* 建筑主体 */}
      <rect x="6" y="4" width="12" height="16" rx="2" fill={color} opacity="0.1" />
      <rect x="6" y="4" width="12" height="16" rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 楼层分隔 */}
      <path
        d="M6 8 L18 8"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M6 12 L18 12"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M6 16 L18 16"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 垂直分隔 */}
      <path
        d="M10 4 L10 20"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M14 4 L14 20"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* 窗户细节 */}
      <rect x="7" y="5" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="11" y="5" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="15" y="5" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="7" y="9" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="11" y="9" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="15" y="9" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="7" y="13" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="11" y="13" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="15" y="13" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="7" y="17" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="11" y="17" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
      <rect x="15" y="17" width="2" height="2" rx="0.5" fill="white" opacity="0.6" />
    </svg>
  );
};
