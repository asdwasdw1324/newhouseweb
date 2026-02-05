#!/usr/bin/env node

/**
 * 链家网站新房数据爬虫
 * 爬取上海地区的新房项目数据和图片
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://sh.lianjia.com';
const NEW_HOME_URL = `${BASE_URL}/loupan/pg`;
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'projects');

// 创建图片存储目录
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`创建图片存储目录: ${IMAGES_DIR}`);
}

/**
 * 爬取链家新房数据
 */
async function crawlLianjiaNewHomes() {
  try {
    console.log('开始爬取链家新房数据...');
    
    const allProjects = [];
    const maxPages = 20; // 完整模式，爬取20页
    
    for (let page = 1; page <= maxPages; page++) {
      console.log(`爬取第 ${page} 页...`);
      
      const url = `${NEW_HOME_URL}${page}`;
      
      try {
        // 随机延迟，避免被反爬
        const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5秒
        console.log(`等待 ${randomDelay}ms 后请求...`);
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0',
            'Referer': BASE_URL,
            'Origin': BASE_URL,
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1'
          },
          timeout: 30000,
          validateStatus: (status) => {
            return status >= 200 && status < 300; // 只接受200-299状态码
          }
        });
        
        console.log(`状态码: ${response.status}`);
        console.log(`响应长度: ${response.data.length} 字符`);
        
        // 保存响应到文件以便调试
        const debugFile = `debug-response-page-${page}.html`;
        fs.writeFileSync(debugFile, response.data, 'utf8');
        console.log(`已保存响应到 ${debugFile}`);
        
        // 检查是否被反爬
        if (response.data.length < 10000) {
          console.log('⚠️  响应长度异常，可能被反爬');
          console.log('响应前200字符:', response.data.substring(0, 200));
        }
        
        const $ = cheerio.load(response.data);
        
        // 尝试不同的选择器
        const projectElements1 = $('.resblock-list');
        const projectElements2 = $('.loupan-item');
        const projectElements3 = $('.item');
        
        console.log(`找到项目元素: ${projectElements1.length} (resblock-list), ${projectElements2.length} (loupan-item), ${projectElements3.length} (item)`);
        
        let projectElements = projectElements1;
        if (projectElements.length === 0) {
          projectElements = projectElements2;
        }
        if (projectElements.length === 0) {
          projectElements = projectElements3;
        }
        
        if (projectElements.length === 0) {
          console.log('没有找到更多项目，停止爬取');
          break;
        }
        
        // 收集所有异步操作
        const projectPromises = [];
        projectElements.each((index, element) => {
          projectPromises.push(parseProject($, element));
        });
        
        // 等待所有项目解析完成
        const parsedProjects = await Promise.all(projectPromises);
        const validProjects = parsedProjects.filter(project => project !== null);
        
        allProjects.push(...validProjects);
        console.log(`第 ${page} 页添加 ${validProjects.length} 个项目`);
        
        console.log(`第 ${page} 页完成，当前共 ${allProjects.length} 个项目`);
        
        // 延迟，避免被封IP
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (pageError) {
        console.error(`第 ${page} 页爬取失败:`, pageError.message);
        continue;
      }
    }
    
    console.log(`爬取完成，共获取 ${allProjects.length} 个新房项目`);
    
    if (allProjects.length > 0) {
      // 保存数据
      saveProjects(allProjects);
    } else {
      console.log('未获取到项目数据，可能被反爬或选择器错误');
    }
    
  } catch (error) {
    console.error('爬取失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

/**
 * 解析单个项目数据
 */
async function parseProject($, element) {
  try {
    const name = $(element).find('.resblock-name h2 a').text().trim();
    const locationSpans = $(element).find('.resblock-location span');
    const district = locationSpans.eq(0).text().trim();
    const subDistrict = locationSpans.eq(1).text().trim();
    const address = $(element).find('.resblock-location a').text().trim();
    const priceText = $(element).find('.resblock-price .main-price .number').text().trim();
    const priceUnit = $(element).find('.resblock-price .main-price .desc').text().trim();
    const areaRange = $(element).find('.resblock-area span').text().trim();
    const tags = $(element).find('.resblock-tag span').map((i, el) => $(el).text().trim()).get();
    const status = $(element).find('.sale-status').text().trim();
    const imageSrc = $(element).find('.resblock-img-wrapper img').attr('data-original') || '';
    
    if (!name) return null;
    
    const price = parseFloat(priceText.replace(/,/g, '')) || 0;
    
    // 生成唯一ID
    const id = `lj-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // 下载图片
    let localImagePath = '';
    if (imageSrc) {
      localImagePath = await downloadImage(imageSrc, id);
    }
    
    return {
      id,
      name,
      districtId: getDistrictId(district),
      subDistrictId: subDistrict,
      price,
      priceUnit: priceUnit || '元/㎡',
      area: 0,
      areaRange,
      status: getStatus(status),
      features: tags,
      description: `${name}位于${district}${subDistrict}，${tags.join('、')}`,
      image: localImagePath || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80`,
      developer: '',
      address: address || `${district}${subDistrict}`,
      coordinates: {
        lat: 31.23 + (Math.random() * 0.1),
        lng: 121.47 + (Math.random() * 0.1)
      }
    };
  } catch (error) {
    console.error('解析项目失败:', error.message);
    return null;
  }
}

/**
 * 获取区域ID
 */
function getDistrictId(districtName) {
  const districtMap = {
    '浦东新区': 'pudong',
    '黄浦区': 'huangpu',
    '徐汇区': 'xuhui',
    '长宁区': 'changning',
    '静安区': 'jingan',
    '普陀区': 'putuo',
    '虹口区': 'hongkou',
    '杨浦区': 'yangpu',
    '宝山区': 'baoshan',
    '闵行区': 'minhang',
    '嘉定区': 'jiading',
    '松江区': 'songjiang',
    '青浦区': 'qingpu',
    '奉贤区': 'fengxian',
    '崇明区': 'chongming'
  };
  
  return districtMap[districtName] || districtName.toLowerCase();
}

/**
 * 获取状态
 */
function getStatus(statusText) {
  if (statusText.includes('在售')) return '在售';
  if (statusText.includes('待售')) return '待售';
  if (statusText.includes('售罄')) return '售罄';
  return '在售';
}

/**
 * 下载图片并保存到本地
 */
async function downloadImage(url, projectId) {
  try {
    if (!url || url === '') {
      return '';
    }
    
    // 确保URL完整
    let fullUrl = url;
    if (!url.startsWith('http')) {
      fullUrl = BASE_URL + url;
    }
    
    // 生成唯一的图片文件名
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const extension = url.split('.').pop().split('?')[0].split('#')[0];
    const safeExtension = extension && extension.length <= 5 ? extension : 'jpg';
    const fileName = `project_${projectId}_${timestamp}_${random}.${safeExtension}`;
    const filePath = path.join(IMAGES_DIR, fileName);
    
    // 下载图片
    const response = await axios.get(fullUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 30000
    });
    
    // 保存图片
    fs.writeFileSync(filePath, response.data);
    console.log(`图片下载成功: ${fileName}`);
    
    // 返回相对路径，用于前端引用
    return `/images/projects/${fileName}`;
    
  } catch (error) {
    console.error(`图片下载失败: ${url}`, error.message);
    return '';
  }
}

/**
 * 保存项目数据
 */
function saveProjects(projects) {
  // 简单方法：直接使用相对路径
  const outputPath = path.join(process.cwd(), 'src/data/newHomes.ts');
  
  const dataContent = `/**
 * 上海新房项目数据
 * 从链家网站爬取的真实数据
 */

export interface NewHomeProject {
  id: string;
  name: string;
  districtId: string;
  subDistrictId: string;
  price: number;
  priceUnit: string;
  area: number;
  areaRange: string;
  status: '在售' | '待售' | '售罄';
  features: string[];
  description: string;
  image: string;
  developer: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const newHomeProjects: NewHomeProject[] = ${JSON.stringify(projects, null, 2)};

export const getProjectsByDistrict = (districtId: string): NewHomeProject[] => {
  return newHomeProjects.filter((project) => project.districtId === districtId);
};

export const getProjectsBySubDistrict = (districtId: string, subDistrictId: string): NewHomeProject[] => {
  return newHomeProjects.filter(
    (project) => project.districtId === districtId && project.subDistrictId === subDistrictId
  );
};

export const getProjectById = (id: string): NewHomeProject | undefined => {
  return newHomeProjects.find((project) => project.id === id);
};

export const getRandomProjects = (count: number): NewHomeProject[] => {
  const shuffled = [...newHomeProjects].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getOnlyNewHomes = (): NewHomeProject[] => {
  return newHomeProjects.filter(project => project.status === '在售' || project.status === '待售');
};

export const addLianjiaProjects = (lianjiaProjects: NewHomeProject[]): NewHomeProject[] => {
  return [...newHomeProjects, ...lianjiaProjects];
};
`;
  
  fs.writeFileSync(outputPath, dataContent, 'utf8');
  console.log(`数据保存成功，共 ${projects.length} 个项目，保存到 ${outputPath}`);
}

/**
 * 主函数
 */
async function main() {
  console.log('链家新房数据爬虫');
  console.log('='.repeat(50));
  console.log('当前目录:', process.cwd());
  console.log('脚本路径:', import.meta.url);
  
  try {
    // 检查依赖
    console.log('检查依赖...');
    await import('axios');
    await import('cheerio');
    console.log('依赖检查完成');
    
    // 开始爬取
    console.log('开始爬取链家新房数据...');
    await crawlLianjiaNewHomes();
    console.log('爬取完成');
  } catch (error) {
    console.error('主函数错误:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

// 执行主函数
main();
