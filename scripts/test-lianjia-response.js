#!/usr/bin/env node

/**
 * 测试链家网站响应
 * 保存完整的HTML响应以便分析
 */

import axios from 'axios';
import fs from 'fs';

const URL = 'https://sh.lianjia.com/loupan/pg1';

async function testResponse() {
  try {
    console.log('开始测试链家网站响应...');
    
    const response = await axios.get(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 30000
    });
    
    console.log(`状态码: ${response.status}`);
    console.log(`响应长度: ${response.data.length} 字符`);
    console.log(`响应头: ${JSON.stringify(response.headers, null, 2)}`);
    
    // 保存完整响应
    fs.writeFileSync('lianjia-response.html', response.data, 'utf8');
    console.log('已保存完整响应到 lianjia-response.html');
    
    // 检查是否是链家网站
    if (response.data.includes('链家')) {
      console.log('响应包含"链家"关键词');
    } else {
      console.log('响应不包含"链家"关键词');
    }
    
    // 检查是否有项目列表
    if (response.data.includes('resblock-list')) {
      console.log('响应包含"resblock-list"类');
    } else {
      console.log('响应不包含"resblock-list"类');
    }
    
    if (response.data.includes('loupan-item')) {
      console.log('响应包含"loupan-item"类');
    } else {
      console.log('响应不包含"loupan-item"类');
    }
    
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

testResponse();