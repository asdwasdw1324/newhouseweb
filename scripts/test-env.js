#!/usr/bin/env node

/**
 * 测试Node.js环境
 */

console.log('测试Node.js环境');
console.log('Node.js版本:', process.version);
console.log('当前目录:', process.cwd());
console.log('脚本路径:', import.meta.url);
console.log('环境变量:', Object.keys(process.env).slice(0, 5));

// 测试基本功能
try {
  console.log('测试基本功能...');
  const fs = require('fs');
  const path = require('path');
  
  console.log('fs模块加载成功');
  console.log('path模块加载成功');
  
  // 测试文件写入
  const testContent = '测试内容';
  fs.writeFileSync('test-file.txt', testContent, 'utf8');
  console.log('文件写入成功');
  
  // 测试文件读取
  const readContent = fs.readFileSync('test-file.txt', 'utf8');
  console.log('文件读取成功:', readContent);
  
  console.log('测试完成，环境正常');
} catch (error) {
  console.error('测试失败:', error.message);
  console.error('错误堆栈:', error.stack);
}
