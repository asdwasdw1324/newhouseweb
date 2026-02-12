/**
 * 链家新房数据导入组件
 * 用于从链家网站导入新房数据并显示导入结果
 */

import React, { useState } from 'react';
import { importLianjiaNewHomes, filterOnlyNewHomes } from '../lib/lianjia-importer';
import { addLianjiaProjects, NewHomeProject } from '../data/newHomes';

interface LianjiaImporterProps {
  onImportComplete?: (projects: NewHomeProject[]) => void;
}

const LianjiaImporter: React.FC<LianjiaImporterProps> = ({ onImportComplete }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    projects: NewHomeProject[];
  } | null>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setImportResult(null);

    try {
      // 导入链家新房数据
      const lianjiaProjects = await importLianjiaNewHomes();
      
      // 过滤只获取在售和待售的新房
      const filteredProjects = filterOnlyNewHomes(lianjiaProjects);
      
      // 添加到现有数据中
      const updatedProjects = addLianjiaProjects(filteredProjects);
      
      // 计算新添加的项目数量
      const newProjectCount = filteredProjects.length;
      
      setImportResult({
        success: true,
        message: `成功从链家导入 ${newProjectCount} 个新房项目`,
        projects: filteredProjects
      });

      // 通知父组件导入完成
      if (onImportComplete) {
        onImportComplete(filteredProjects);
      }
    } catch (error) {
      console.error('导入链家新房数据失败:', error);
      setImportResult({
        success: false,
        message: '导入链家新房数据失败，请稍后重试',
        projects: []
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 导入按钮 */}
      <button
        onClick={handleImport}
        disabled={isImporting}
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isImporting ? (
          <>
            <svg className="inline-block w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            导入中...
          </>
        ) : (
          <>
            <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            从链家导入新房数据
          </>
        )}
      </button>

      {/* 导入结果 */}
      {importResult && (
        <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'}`}>
          <div className="flex items-start space-x-3">
            <div className={`mt-0.5 ${importResult.success ? 'text-green-500' : 'text-red-500'}`}>
              {importResult.success ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${importResult.success ? 'text-green-400' : 'text-red-400'}`}>
                {importResult.message}
              </h3>
              {importResult.success && importResult.projects.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-300">新导入的项目：</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {importResult.projects.slice(0, 4).map((project) => (
                      <div key={project.id} className="bg-white/5 p-2 rounded">
                        <p className="text-sm font-medium text-white">{project.name}</p>
                        <p className="text-xs text-gray-400">{project.districtId} · {project.price} {project.priceUnit}</p>
                      </div>
                    ))}
                  </div>
                  {importResult.projects.length > 4 && (
                    <p className="text-xs text-gray-400 mt-1">
                      以及 {importResult.projects.length - 4} 个其他项目
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 导入说明 */}
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-2">导入说明</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• 从链家网站导入最新的新房数据</li>
          <li>• 只导入在售和待售的新房项目</li>
          <li>• 自动过滤掉已存在的项目</li>
          <li>• 导入的数据将添加到现有项目中</li>
        </ul>
      </div>
</div>
);
};

export default LianjiaImporter;
