# 新房数据库完整方案

## 概述

本文档描述了从链家网站爬取新房数据并建立自动更新系统的完整方案。

---

## 一、技术架构

### 1.1 技术栈选择

| 层级 | 技术 | 说明 |
|------|------|------|
| 数据库 | SQLite | 轻量级，零配置，适合个人项目 |
| ORM | Prisma | 类型安全，支持迁移，开发效率高 |
| 后端 | Node.js + Express | 轻量级 REST API 服务 |
| 爬虫 | Playwright | 模拟真实浏览器，绕过反爬 |
| 定时任务 | node-schedule | 本地定时执行数据同步 |
| 部署 | Render/Railway | 免费云端部署方案 |

### 1.2 项目结构

```
/server
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   └── migrations/            # 数据库迁移文件
├── src/
│   ├── crawler/
│   │   ├── lianjia-crawler.js # 链家爬虫核心
│   │   ├── data-parser.js     # 数据解析清洗
│   │   └── image-downloader.js# 图片下载器
│   ├── scheduler/
│   │   └── sync-job.js        # 定时同步任务
│   ├── database/
│   │   └── db-service.js      # 数据库服务
│   ├── routes/
│   │   ├── projects.js        # 楼盘 API
│   │   ├── districts.js       # 区域 API
│   │   └── sync.js            # 同步 API
│   ├── utils/
│   │   ├── proxy-rotator.js   # 代理 IP 轮换
│   │   └── retry-helper.js    # 重试机制
│   └── index.js               # 服务入口
├── data/
│   └── newhouse.db            # SQLite 数据库文件
├── logs/
│   └── crawler.log            # 爬取日志
├── .env                       # 环境变量
└── package.json
```

---

## 二、数据库设计

### 2.1 实体关系图

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│  districts  │────<│  sub_districts  │────<│  projects   │
└─────────────┘     └─────────────────┘     └──────┬──────┘
                                                   │
                          ┌────────────────────────┼────────┐
                          │                        │        │
                    ┌─────┴─────┐          ┌──────┴─────┐  │
                    │ features  │          │   images   │  │
                    └───────────┘          └────────────┘  │
                                                             │
                                                   ┌─────────┴─────┐
                                                   │ price_history │
                                                   └───────────────┘
```

### 2.2 数据表结构

#### districts (行政区)
```sql
CREATE TABLE districts (
  id TEXT PRIMARY KEY,           -- 如: pudong
  name TEXT NOT NULL,            -- 如: 浦东新区
  name_en TEXT,                  -- 如: Pudong
  sort_order INTEGER DEFAULT 0,  -- 排序
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### sub_districts (板块/子区域)
```sql
CREATE TABLE sub_districts (
  id TEXT PRIMARY KEY,
  district_id TEXT NOT NULL,
  name TEXT NOT NULL,            -- 如: 陆家嘴
  description TEXT,              -- 描述
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (district_id) REFERENCES districts(id)
);
```

#### projects (楼盘项目)
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,           -- 唯一标识
  name TEXT NOT NULL,            -- 楼盘名称
  district_id TEXT NOT NULL,     -- 行政区
  sub_district_id TEXT,          -- 板块
  
  -- 价格信息
  price INTEGER,                 -- 均价 (元/㎡)
  price_unit TEXT DEFAULT '元/㎡',
  total_price_min INTEGER,       -- 总价最低
  total_price_max INTEGER,       -- 总价最高
  
  -- 面积信息
  area_min INTEGER,              -- 最小面积
  area_max INTEGER,              -- 最大面积
  area_range TEXT,               -- 面积范围描述
  
  -- 基本信息
  status TEXT CHECK(status IN ('在售', '待售', '售罄')),
  developer TEXT,                -- 开发商
  property_type TEXT,            -- 物业类型 (住宅/别墅/公寓)
  decoration TEXT,               -- 装修情况
  
  -- 位置信息
  address TEXT,
  lat REAL,                      -- 纬度
  lng REAL,                      -- 经度
  
  -- 描述信息
  description TEXT,
  tags TEXT,                     -- 标签 JSON 数组
  
  -- 媒体信息
  main_image TEXT,               -- 主图 URL
  
  -- 数据来源
  source_url TEXT,               -- 来源链接
  source_site TEXT DEFAULT '链家',
  source_id TEXT,                -- 源站 ID
  
  -- 时间戳
  last_sync_at DATETIME,         -- 最后同步时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (district_id) REFERENCES districts(id),
  FOREIGN KEY (sub_district_id) REFERENCES sub_districts(id)
);
```

#### project_features (楼盘特色标签)
```sql
CREATE TABLE project_features (
  project_id TEXT NOT NULL,
  feature TEXT NOT NULL,         -- 如: 近地铁、江景
  PRIMARY KEY (project_id, feature),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### project_images (楼盘图片)
```sql
CREATE TABLE project_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  url TEXT NOT NULL,             -- 图片 URL
  local_path TEXT,               -- 本地存储路径
  type TEXT DEFAULT 'gallery',   -- main/gallery/floor_plan
  sort_order INTEGER DEFAULT 0,
  downloaded BOOLEAN DEFAULT 0,  -- 是否已下载
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### price_history (价格历史)
```sql
CREATE TABLE price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  price INTEGER NOT NULL,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### sync_logs (同步日志)
```sql
CREATE TABLE sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sync_type TEXT,                -- full/incremental
  started_at DATETIME,
  ended_at DATETIME,
  total_count INTEGER,
  added_count INTEGER,
  updated_count INTEGER,
  failed_count INTEGER,
  status TEXT,                   -- success/failed
  message TEXT
);
```

---

## 三、数据来源方案

### 3.1 链家新房页面分析

#### 列表页
- **URL**: `https://sh.fang.lianjia.com/loupan/`
- **分页**: `https://sh.fang.lianjia.com/loupan/pg{page}/`
- **筛选**: 支持按区域、价格、面积筛选

#### 详情页
- **URL**: `https://sh.fang.lianjia.com/loupan/{id}.html`
- **数据字段**:
  - 基本信息: 名称、价格、地址、开发商
  - 详细信息: 物业类型、装修标准、产权年限
  - 户型信息: 面积范围、户型图
  - 配套信息: 交通、教育、商业
  - 图片: 效果图、实景图、户型图

### 3.2 爬取策略

#### 阶段一: 列表页爬取
```javascript
// 获取所有楼盘链接
async function getAllProjectUrls() {
  const urls = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore && page <= 100) {  // 最多 100 页
    const listUrl = `https://sh.fang.lianjia.com/loupan/pg${page}/`;
    const projects = await crawlListPage(listUrl);
    
    if (projects.length === 0) {
      hasMore = false;
    } else {
      urls.push(...projects.map(p => p.detailUrl));
      page++;
    }
    
    // 随机延迟 1-3 秒
    await randomDelay(1000, 3000);
  }
  
  return urls;
}
```

#### 阶段二: 详情页爬取
```javascript
// 爬取单个楼盘详情
async function crawlProjectDetail(url) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  
  const data = await page.evaluate(() => {
    return {
      name: extractText('.main-title h1'),
      price: extractNumber('.price .number'),
      address: extractText('.address'),
      developer: extractText('.developer'),
      // ... 更多字段
    };
  });
  
  await page.close();
  return data;
}
```

#### 阶段三: 图片下载
```javascript
// 下载楼盘图片
async function downloadImages(projectId, imageUrls) {
  const downloadDir = `./data/images/${projectId}`;
  await fs.mkdir(downloadDir, { recursive: true });
  
  for (const url of imageUrls) {
    const filename = path.basename(url);
    const localPath = `${downloadDir}/${filename}`;
    
    await downloadFile(url, localPath);
    await db.saveImage(projectId, url, localPath);
  }
}
```

### 3.3 反爬对策

| 对策 | 实现方式 |
|------|----------|
| 请求频率控制 | 每次请求间隔 1-3 秒随机延迟 |
| User-Agent 轮换 | 使用真实浏览器 UA 列表 |
| Cookie 管理 | 模拟登录状态，定期更新 Cookie |
| 代理 IP | 使用代理池轮换 IP |
| 浏览器指纹 | Playwright 模拟真实浏览器 |
| 失败重试 | 失败 3 次后跳过，记录日志 |
| 人机验证处理 | 检测到验证码时暂停并通知 |

---

## 四、自动更新机制

### 4.1 同步策略

#### 全量同步 (每周一次)
- 重新爬取所有楼盘数据
- 对比数据库，识别新增/更新/下架
- 更新所有楼盘信息

#### 增量同步 (每天一次)
- 只爬取最近更新的楼盘
- 检查价格变动
- 更新动态信息

### 4.2 定时任务配置

```javascript
// scheduler/sync-job.js
const schedule = require('node-schedule');

// 每天凌晨 2:00 执行增量同步
schedule.scheduleJob('0 2 * * *', async () => {
  console.log('🕐 开始每日增量同步...');
  await runIncrementalSync();
});

// 每周日凌晨 3:00 执行全量同步
schedule.scheduleJob('0 3 * * 0', async () => {
  console.log('🕐 开始每周全量同步...');
  await runFullSync();
});
```

### 4.3 数据对比逻辑

```javascript
// 对比新旧数据
async function compareData(newProjects) {
  const result = {
    added: [],      // 新增
    updated: [],    // 更新
    priceChanged: [], // 价格变动
    removed: []     // 下架
  };
  
  const existingProjects = await db.getAllProjects();
  const existingMap = new Map(existingProjects.map(p => [p.source_id, p]));
  
  for (const newProject of newProjects) {
    const existing = existingMap.get(newProject.source_id);
    
    if (!existing) {
      // 新增楼盘
      result.added.push(newProject);
    } else {
      // 检查是否有更新
      const changes = detectChanges(existing, newProject);
      if (changes.length > 0) {
        result.updated.push({ ...newProject, changes });
        
        // 检查价格变动
        if (existing.price !== newProject.price) {
          result.priceChanged.push({
            projectId: existing.id,
            oldPrice: existing.price,
            newPrice: newProject.price
          });
        }
      }
      
      existingMap.delete(newProject.source_id);
    }
  }
  
  // 剩余的为已下架
  result.removed = Array.from(existingMap.values());
  
  return result;
}
```

---

## 五、API 接口设计

### 5.1 楼盘接口

```
GET /api/projects
参数:
  - district: 行政区 ID
  - subDistrict: 板块 ID
  - minPrice: 最低价格
  - maxPrice: 最高价格
  - status: 销售状态
  - keyword: 关键词搜索
  - page: 页码
  - limit: 每页数量
返回:
  {
    success: true,
    data: {
      list: [...],
      total: 100,
      page: 1,
      limit: 20
    }
  }

GET /api/projects/:id
返回楼盘详情

GET /api/projects/:id/price-history
返回价格历史
```

### 5.2 区域接口

```
GET /api/districts
返回所有行政区

GET /api/districts/:id/sub-districts
返回指定行政区的板块列表
```

### 5.3 同步接口

```
POST /api/sync/trigger
手动触发同步 (需要权限验证)

GET /api/sync/status
获取同步状态

GET /api/sync/logs
获取同步日志
```

---

## 六、部署方案

### 6.1 本地开发环境

```bash
# 1. 初始化项目
mkdir server && cd server
npm init -y

# 2. 安装依赖
npm install express prisma @prisma/client sqlite3
npm install playwright node-schedule axios
npm install -D nodemon

# 3. 初始化 Prisma
npx prisma init

# 4. 启动开发服务器
npm run dev
```

### 6.2 生产部署 (Render)

```yaml
# render.yaml
services:
  - type: web
    name: newhouse-api
    env: node
    buildCommand: npm install && npx prisma migrate deploy
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        value: file:./data/newhouse.db
      - key: NODE_ENV
        value: production
```

### 6.3 环境变量配置

```env
# .env
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./data/newhouse.db"
CRAWLER_HEADLESS=true
CRAWLER_DELAY_MIN=1000
CRAWLER_DELAY_MAX=3000
PROXY_ENABLED=false
PROXY_URL=
```

---

## 七、实施计划

### 阶段一: 基础架构 (2 天)
- [ ] 搭建 Express + Prisma + SQLite 基础框架
- [ ] 设计并创建数据库表结构
- [ ] 实现基础 CRUD API

### 阶段二: 爬虫开发 (3 天)
- [ ] 分析链家页面结构
- [ ] 实现列表页爬虫
- [ ] 实现详情页爬虫
- [ ] 实现图片下载功能
- [ ] 添加反爬对策

### 阶段三: 数据同步 (2 天)
- [ ] 实现数据对比逻辑
- [ ] 实现增量/全量同步
- [ ] 配置定时任务
- [ ] 添加同步日志

### 阶段四: API 完善 (1 天)
- [ ] 实现筛选搜索接口
- [ ] 实现价格历史接口
- [ ] 添加接口文档

### 阶段五: 部署上线 (1 天)
- [ ] 配置生产环境
- [ ] 部署到 Render
- [ ] 配置定时任务
- [ ] 监控和日志

---

## 八、成本估算

| 项目 | 方案 | 月成本 |
|------|------|--------|
| 数据库 | SQLite 本地 | ¥0 |
| 服务器 | Render 免费版 | ¥0 |
| 代理 IP | 芝麻代理 (可选) | ¥0-50 |
| 存储 | Render 免费 1GB | ¥0 |
| **总计** | | **¥0-50** |

---

## 九、注意事项

### 9.1 法律合规
- 爬取数据仅用于个人学习研究
- 遵守网站的 robots.txt 规则
- 控制请求频率，不要对目标网站造成压力
- 数据不用于商业用途

### 9.2 数据质量
- 定期验证数据准确性
- 处理异常情况（如页面结构变化）
- 建立数据清洗规则

### 9.3 维护计划
- 每周检查爬虫运行状态
- 每月更新反爬对策
- 定期备份数据库

---

## 十、后续优化

1. **多数据源**: 接入贝壳、安居客等更多数据源
2. **数据分析**: 添加价格趋势分析、热度分析
3. **用户系统**: 添加收藏、对比功能
4. **地图集成**: 集成高德/百度地图展示楼盘位置
5. **消息通知**: 价格变动时推送通知

---

*文档版本: 1.0*
*创建日期: 2026-02-12*
