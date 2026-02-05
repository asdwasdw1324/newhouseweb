/**
 * 全局类型定义
 */

// 视图模式
export type ViewMode = 'home' | 'district' | 'sub-district' | 'project-detail';

// 气泡项目类型
export type BubbleType = 'district' | 'sub-district' | 'project';

// 物理气泡数据
export interface PhysicsBubble {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: BubbleType;
  data: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    price?: number;
  };
  isHovered: boolean;
  collisionCount: number;
  isInContentArea: boolean;
}

// 地图区域数据
export interface MapRegion {
  id: string;
  name: string;
  path: string;
  center: { x: number; y: number };
  isHovered: boolean;
}

// 颜色配置
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

// 动画配置
export interface AnimationConfig {
  duration: number;
  easing: string;
}

// 响应式断点
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
