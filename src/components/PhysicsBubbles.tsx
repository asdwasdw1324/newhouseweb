/**
 * 物理碰撞气泡组件
 * 实现首页的物理碰撞效果气泡展示，支持内容区域虚化
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PhysicsBubble } from '../types';
import { NewHomeProject, getRandomProjects } from '../data/newHomes';

interface PhysicsBubblesProps {
  onBubbleClick: (project: NewHomeProject) => void;
  bubbleCount?: number;
  contentRef?: React.RefObject<HTMLDivElement>;
}

const PhysicsBubbles: React.FC<PhysicsBubblesProps> = ({ onBubbleClick, bubbleCount = 6, contentRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<PhysicsBubble[]>([]);
  const animationRef = useRef<number>(0);
  const [hoveredBubble, setHoveredBubble] = useState<PhysicsBubble | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [contentArea, setContentArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // 检测内容区域
  const detectContentArea = useCallback(() => {
    if (contentRef?.current && containerRef.current) {
      const contentRect = contentRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setContentArea({
        x: contentRect.left - containerRect.left,
        y: contentRect.top - containerRect.top,
        width: contentRect.width,
        height: contentRect.height,
      });
    }
  }, [contentRef]);

  // 初始化气泡
  const initBubbles = useCallback(() => {
    const projects = getRandomProjects(bubbleCount);
    const newBubbles: PhysicsBubble[] = projects.map((project, index) => ({
      id: `bubble-${index}`,
      x: Math.random() * (dimensions.width - 150) + 75,
      y: Math.random() * (dimensions.height - 150) + 75,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 50 + Math.random() * 35,
      type: 'project',
      data: {
        id: project.id,
        name: project.name,
        description: project.description,
        image: project.image,
        price: project.price,
      },
      isHovered: false,
      collisionCount: 0,
      isInContentArea: false,
    }));
    bubblesRef.current = newBubbles;
  }, [bubbleCount, dimensions]);

  // 检测气泡是否在内容区域
  const isInContentArea = useCallback((bubble: PhysicsBubble) => {
    if (!contentArea) return false;

    const padding = bubble.radius + 30;
    const areaLeft = contentArea.x - padding;
    const areaRight = contentArea.x + contentArea.width + padding;
    const areaTop = contentArea.y - padding;
    const areaBottom = contentArea.y + contentArea.height + padding;

    return (
      bubble.x > areaLeft &&
      bubble.x < areaRight &&
      bubble.y > areaTop &&
      bubble.y < areaBottom
    );
  }, [contentArea]);

  // 刷新气泡内容
  const refreshBubbles = useCallback(() => {
    const projects = getRandomProjects(bubbleCount);
    bubblesRef.current.forEach((bubble, index) => {
      const project = projects[index % projects.length];
      bubble.data = {
        id: project.id,
        name: project.name,
        description: project.description,
        image: project.image,
        price: project.price,
      };
      bubble.collisionCount = 0;
    });
  }, [bubbleCount]);

  // 检测气泡碰撞
  const checkCollisions = useCallback(() => {
    const bubbles = bubblesRef.current;
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const b1 = bubbles[i];
        const b2 = bubbles[j];
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = b1.radius + b2.radius;

        if (distance < minDistance) {
          // 碰撞响应
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          // 旋转速度
          const vx1 = b1.vx * cos + b1.vy * sin;
          const vy1 = b1.vy * cos - b1.vx * sin;
          const vx2 = b2.vx * cos + b2.vy * sin;
          const vy2 = b2.vy * cos - b2.vx * sin;

          // 交换速度
          const temp = vx1;
          b1.vx = vx2 * cos - vy1 * sin;
          b1.vy = vy1 * cos + vx2 * sin;
          b2.vx = temp * cos - vy2 * sin;
          b2.vy = vy2 * cos + temp * sin;

          // 分离气泡防止重叠
          const overlap = minDistance - distance;
          const separationX = (overlap / 2) * Math.cos(angle);
          const separationY = (overlap / 2) * Math.sin(angle);
          b1.x -= separationX;
          b1.y -= separationY;
          b2.x += separationX;
          b2.y += separationY;

          // 更新碰撞计数
          b1.collisionCount++;
          b2.collisionCount++;

          // 检查是否需要刷新
          if (b1.collisionCount >= 2) {
            const projects = getRandomProjects(1);
            b1.data = {
              id: projects[0].id,
              name: projects[0].name,
              description: projects[0].description,
              image: projects[0].image,
              price: projects[0].price,
            };
            b1.collisionCount = 0;
          }
          if (b2.collisionCount >= 2) {
            const projects = getRandomProjects(1);
            b2.data = {
              id: projects[0].id,
              name: projects[0].name,
              description: projects[0].description,
              image: projects[0].image,
              price: projects[0].price,
            };
            b2.collisionCount = 0;
          }
        }
      }
    }
  }, []);

  // 边界碰撞检测
  const checkBoundary = useCallback((bubble: PhysicsBubble) => {
    // 定义首页有效区域的边界（避开Toolbar和Sidebar）
    const TOP_MARGIN = 60;      // Toolbar下方60px
    const LEFT_MARGIN = 80;     // Sidebar折叠状态宽度
    const PADDING = bubble.radius;

    // 左侧边界（避开Sidebar）
    const minX = LEFT_MARGIN + PADDING;
    if (bubble.x - bubble.radius < minX) {
      bubble.x = minX;
      bubble.vx = Math.abs(bubble.vx);
    }

    // 右侧边界
    if (bubble.x + bubble.radius > dimensions.width) {
      bubble.x = dimensions.width - bubble.radius;
      bubble.vx = -Math.abs(bubble.vx);
    }

    // 顶部边界（避开Toolbar）
    const minY = TOP_MARGIN + PADDING;
    if (bubble.y - bubble.radius < minY) {
      bubble.y = minY;
      bubble.vy = Math.abs(bubble.vy);
    }

    // 底部边界
    if (bubble.y + bubble.radius > dimensions.height) {
      bubble.y = dimensions.height - bubble.radius;
      bubble.vy = -Math.abs(bubble.vy);
    }

    // 检测内容区域并避开
    if (contentArea) {
      const padding = bubble.radius + 30;
      const areaLeft = contentArea.x - padding;
      const areaRight = contentArea.x + contentArea.width + padding;
      const areaTop = contentArea.y - padding;
      const areaBottom = contentArea.y + contentArea.height + padding;

      // 检测气泡中心是否在内容区域内
      if (
        bubble.x > areaLeft &&
        bubble.x < areaRight &&
        bubble.y > areaTop &&
        bubble.y < areaBottom
      ) {
        bubble.isInContentArea = true;

        // 计算最近的边界并推开
        const distances = {
          left: bubble.x - areaLeft,
          right: areaRight - bubble.x,
          top: bubble.y - areaTop,
          bottom: areaBottom - bubble.y
        };

        const minDistance = Math.min(distances.left, distances.right, distances.top, distances.bottom);

        if (minDistance === distances.left) {
          bubble.x = areaLeft - bubble.radius;
          bubble.vx = -Math.abs(bubble.vx) * 0.8;
        } else if (minDistance === distances.right) {
          bubble.x = areaRight + bubble.radius;
          bubble.vx = Math.abs(bubble.vx) * 0.8;
        } else if (minDistance === distances.top) {
          bubble.y = areaTop - bubble.radius;
          bubble.vy = -Math.abs(bubble.vy) * 0.8;
        } else {
          bubble.y = areaBottom + bubble.radius;
          bubble.vy = Math.abs(bubble.vy) * 0.8;
        }
      } else {
        bubble.isInContentArea = false;
      }
    }
  }, [dimensions, contentArea]);

  // 更新气泡位置
  const updateBubbles = useCallback(() => {
    bubblesRef.current.forEach((bubble) => {
      if (!bubble.isHovered) {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        checkBoundary(bubble);
      }
    });
    checkCollisions();
  }, [checkBoundary, checkCollisions]);

  // 绘制气泡
  const drawBubble = useCallback((ctx: CanvasRenderingContext2D, bubble: PhysicsBubble) => {
    const { x, y, radius, data, isHovered, isInContentArea } = bubble;

    // 计算透明度：在内容区域时降低透明度
    const baseOpacity = isInContentArea ? 0.15 : 0.3;
    const hoverOpacity = 0.5;

    // 创建渐变
    const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
    gradient.addColorStop(0, isHovered ? `rgba(255, 165, 0, ${hoverOpacity})` : `rgba(255, 255, 255, ${baseOpacity})`);
    gradient.addColorStop(0.5, isHovered ? `rgba(255, 140, 0, ${hoverOpacity * 0.7})` : `rgba(255, 165, 0, ${baseOpacity * 0.3})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

    // 绘制气泡主体
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制边框
    const borderOpacity = isInContentArea ? 0.1 : (isHovered ? 0.8 : 0.3);
    ctx.strokeStyle = isHovered ? `rgba(255, 165, 0, ${borderOpacity})` : `rgba(255, 165, 0, ${borderOpacity})`;
    ctx.lineWidth = isHovered ? 2 : 1;
    ctx.stroke();

    // 在内容区域时添加模糊效果
    if (isInContentArea && !isHovered) {
      ctx.filter = 'blur(2px)';
      ctx.stroke();
      ctx.filter = 'none';
    }

    // 添加发光效果
    if (isHovered) {
      ctx.shadowColor = 'rgba(255, 165, 0, 0.8)';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 绘制文字（仅在非内容区域或悬停时显示）
    if (!isInContentArea || isHovered) {
      ctx.fillStyle = isHovered ? '#fff' : 'rgba(255, 255, 255, 0.9)';
      ctx.font = isHovered ? 'bold 14px Arial' : '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.name, x, y);
    }
  }, []);

  // 主渲染循环
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // 先绘制在内容区域的气泡（虚化效果）
    bubblesRef.current
      .filter((bubble) => bubble.isInContentArea)
      .forEach((bubble) => drawBubble(ctx, bubble));

    // 再绘制不在内容区域的气泡（清晰显示）
    bubblesRef.current
      .filter((bubble) => !bubble.isInContentArea)
      .forEach((bubble) => drawBubble(ctx, bubble));

    // 更新位置
    updateBubbles();

    // 继续动画
    animationRef.current = requestAnimationFrame(render);
  }, [dimensions, drawBubble, updateBubbles]);

  // 初始化
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // 延迟检测内容区域，确保DOM已渲染
    setTimeout(detectContentArea, 100);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [detectContentArea]);

  // 初始化气泡并开始动画
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      // 再次检测内容区域
      detectContentArea();

      if (bubblesRef.current.length === 0) {
        initBubbles();
      }
      render();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [dimensions, initBubbles, render, detectContentArea]);

  // 鼠标交互
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let foundBubble = null;
    for (const bubble of bubblesRef.current) {
      const dx = x - bubble.x;
      const dy = y - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < bubble.radius) {
        foundBubble = bubble;
        bubble.isHovered = true;
        break;
      }
    }

    bubblesRef.current.forEach((bubble) => {
      if (bubble !== foundBubble) {
        bubble.isHovered = false;
      }
    });

    setHoveredBubble(foundBubble || null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    bubblesRef.current.forEach((bubble) => {
      bubble.isHovered = false;
    });
    setHoveredBubble(null);
  }, []);

  const handleClick = useCallback(() => {
    if (hoveredBubble) {
      const project: NewHomeProject = {
        id: hoveredBubble.data.id,
        name: hoveredBubble.data.name || '',
        districtId: '',
        subDistrictId: '',
        price: hoveredBubble.data.price || 0,
        priceUnit: '元/㎡',
        area: 0,
        areaRange: '',
        status: '在售',
        features: [],
        description: hoveredBubble.data.description || '',
        image: hoveredBubble.data.image || '',
        developer: '',
        address: '',
        coordinates: { lat: 0, lng: 0 },
      };
      onBubbleClick(project);
    }
  }, [hoveredBubble, onBubbleClick]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* 悬停信息卡片 */}
      {hoveredBubble && (
        <div
          className="project-info-card"
          style={{
            left: Math.min(hoveredBubble.x + hoveredBubble.radius + 20, dimensions.width - 300),
            top: Math.max(hoveredBubble.y - 100, 20),
          }}
        >
          <div className="flex gap-4">
            <img
              src={hoveredBubble.data.image}
              alt={hoveredBubble.data.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {hoveredBubble.data.name}
              </h3>
              <p className="text-orange-400 text-lg font-bold mb-2">
                {hoveredBubble.data.price?.toLocaleString()} 元/㎡
              </p>
              <p className="text-gray-400 text-sm line-clamp-2">
                {hoveredBubble.data.description}
              </p>
              <button className="mt-2 px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors">
                查看详情
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicsBubbles;
