/**
 * 购房指南组件
 * 分类展示官方政策文件和购房相关信息，提供清晰的导航结构和内容展示方式
 */

import React, { useState, useEffect } from 'react';
import { Book, FileText, Search, Filter, ChevronRight, ArrowRight, ExternalLink, Download, Bookmark, Star, Info, Home, AlertCircle, CheckCircle } from 'lucide-react';

// 指南分类
interface GuideCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

// 指南文章
interface GuideArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  publishDate: string;
  source: string;
  author: string;
  tags: string[];
  isOfficial: boolean;
  isPopular: boolean;
  isNew: boolean;
  downloadUrl?: string;
  externalUrl?: string;
}

// 分类数据
const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: 'policy',
    title: '政策法规',
    icon: <FileText className="w-6 h-6" />,
    description: '最新购房政策、法律法规和官方文件',
    color: 'text-blue-400'
  },
  {
    id: 'process',
    title: '购房流程',
    icon: <Home className="w-6 h-6" />,
    description: '从看房到交房的完整购房流程指南',
    color: 'text-green-400'
  },
  {
    id: 'tax',
    title: '税费计算',
    icon: <Book className="w-6 h-6" />,
    description: '购房税费计算方法和省钱技巧',
    color: 'text-purple-400'
  },
  {
    id: 'loan',
    title: '贷款指南',
    icon: <AlertCircle className="w-6 h-6" />,
    description: '公积金贷款、商业贷款和组合贷款指南',
    color: 'text-orange-400'
  },
  {
    id: 'property',
    title: '房产知识',
    icon: <Info className="w-6 h-6" />,
    description: '房产相关知识和常见问题解答',
    color: 'text-pink-400'
  },
  {
    id: 'checklist',
    title: '验房指南',
    icon: <CheckCircle className="w-6 h-6" />,
    description: '新房验收注意事项和验房流程',
    color: 'text-cyan-400'
  }
];

// 模拟文章数据
const MOCK_ARTICLES: GuideArticle[] = [
  {
    id: 'article1',
    title: '2026年上海市购房政策最新解读',
    category: 'policy',
    summary: '详细解读2026年上海市最新购房政策，包括限购、限贷、税费等方面的变化。',
    content: '2026年上海市购房政策有以下主要变化：1. 限购政策：上海户籍单身人士可购买1套住房，已婚家庭可购买2套住房；非上海户籍人士需连续缴纳社保或个税满5年才能购买1套住房。2. 限贷政策：首套房首付比例不低于35%，二套房首付比例不低于50%。3. 税费政策：个人购买普通住房，契税税率为1%；购买非普通住房，契税税率为1.5%。4. 公积金政策：个人最高贷款额度为60万元，家庭最高贷款额度为120万元。',
    publishDate: '2026-01-15',
    source: '上海市住房和城乡建设委员会',
    author: '官方发布',
    tags: ['限购', '限贷', '税费', '公积金'],
    isOfficial: true,
    isPopular: true,
    isNew: true,
    downloadUrl: 'https://example.com/policy2026.pdf'
  },
  {
    id: 'article2',
    title: '上海购房全流程指南',
    category: 'process',
    summary: '从看房、选房到签约、贷款、过户、交房的完整购房流程指南。',
    content: '上海购房流程主要包括以下步骤：1. 前期准备：确定预算、了解政策、选择区域。2. 看房选房：通过中介或开发商看房，比较不同楼盘。3. 认购签约：缴纳定金，签订购房合同。4. 办理贷款：选择贷款方式，提交贷款申请。5. 网签备案：在网上签订合同并备案。6. 缴纳税费：缴纳契税、印花税等税费。7. 办理产证：办理不动产权证。8. 验房交房：验收房屋，办理交房手续。',
    publishDate: '2026-01-10',
    source: '上海房产网',
    author: '房产专家',
    tags: ['购房流程', '签约', '贷款', '过户', '交房'],
    isOfficial: false,
    isPopular: true,
    isNew: false
  },
  {
    id: 'article3',
    title: '2026年上海购房税费计算指南',
    category: 'tax',
    summary: '详细介绍上海购房需要缴纳的税费种类和计算方法，帮助购房者合理规划预算。',
    content: '上海购房需要缴纳的税费主要包括：1. 契税：购买普通住房，税率为1%；购买非普通住房，税率为1.5%。2. 印花税：税率为0.05%，买卖双方各承担一半。3. 增值税：满2年的普通住房免征增值税；不满2年的住房，按照5%的征收率全额缴纳增值税。4. 个人所得税：满5年且为家庭唯一住房的，免征个人所得税；否则，按照1%的税率缴纳个人所得税。',
    publishDate: '2026-01-05',
    source: '上海市税务局',
    author: '税务专家',
    tags: ['契税', '印花税', '增值税', '个人所得税'],
    isOfficial: true,
    isPopular: true,
    isNew: true
  },
  {
    id: 'article4',
    title: '上海公积金贷款指南',
    category: 'loan',
    summary: '详细介绍上海公积金贷款的申请条件、额度计算、利率和流程。',
    content: '上海公积金贷款指南：1. 申请条件：连续缴存公积金满6个月，有稳定的职业和收入，信用良好。2. 贷款额度：个人最高贷款额度为60万元，家庭最高贷款额度为120万元。3. 贷款利率：首套房利率为3.0%，二套房利率为3.575%。4. 贷款期限：最长贷款期限为30年，且不超过借款人法定退休年龄。5. 申请流程：准备材料，提交申请，银行审批，签订合同，办理抵押，发放贷款。',
    publishDate: '2025-12-20',
    source: '上海市公积金管理中心',
    author: '公积金专家',
    tags: ['公积金贷款', '申请条件', '额度计算', '利率', '流程'],
    isOfficial: true,
    isPopular: false,
    isNew: false
  },
  {
    id: 'article5',
    title: '上海新房验房全攻略',
    category: 'checklist',
    summary: '新房验收的详细步骤和注意事项，帮助购房者避免收房陷阱。',
    content: '新房验房主要包括以下步骤：1. 检查房屋结构：查看墙面、地面、天花板是否有裂缝，门窗是否密封。2. 检查水电：测试水管是否漏水，电路是否畅通。3. 检查装修：查看墙面涂料、地板、瓷砖是否平整，厨卫设备是否齐全。4. 检查公共部位：查看小区环境、电梯、楼道等公共设施。5. 核对面积：测量房屋实际面积，与合同面积进行核对。6. 查看文件：要求开发商提供《住宅质量保证书》、《住宅使用说明书》等文件。',
    publishDate: '2025-12-15',
    source: '上海验房网',
    author: '验房专家',
    tags: ['验房', '收房', '房屋质量', '注意事项'],
    isOfficial: false,
    isPopular: true,
    isNew: false
  },
  {
    id: 'article6',
    title: '上海购房常见问题解答',
    category: 'property',
    summary: '解答购房者常见的问题，包括产权、贷款、税费、落户等方面。',
    content: '上海购房常见问题解答：1. 产权问题：普通住宅产权为70年，商业用房产权为40年。2. 落户问题：购买上海住房不能直接落户，需要满足积分落户条件。3. 贷款问题：首套房贷款利率为4.1%，二套房贷款利率为4.5%。4. 税费问题：满5年且为家庭唯一住房的，免征个人所得税。5. 学区问题：上海实行划片入学政策，具体学区以教育部门公布为准。',
    publishDate: '2025-12-10',
    source: '上海房产咨询中心',
    author: '房产顾问',
    tags: ['产权', '落户', '贷款', '税费', '学区'],
    isOfficial: false,
    isPopular: false,
    isNew: false
  }
];

// 文章数据
const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'article1',
    title: '2026年上海市购房政策最新解读',
    category: 'policy',
    summary: '详细解读2026年上海市最新购房政策，包括限购、限贷、税费等方面的变化。',
    content: '2026年上海市购房政策有以下主要变化：1. 限购政策：上海户籍单身人士可购买1套住房，已婚家庭可购买2套住房；非上海户籍人士需连续缴纳社保或个税满5年才能购买1套住房。2. 限贷政策：首套房首付比例不低于35%，二套房首付比例不低于50%。3. 税费政策：个人购买普通住房，契税税率为1%；购买非普通住房，契税税率为1.5%。4. 公积金政策：个人最高贷款额度为60万元，家庭最高贷款额度为120万元。',
    publishDate: '2026-01-15',
    source: '上海市住房和城乡建设委员会',
    author: '官方发布',
    tags: ['限购', '限贷', '税费', '公积金'],
    isOfficial: true,
    isPopular: true,
    isNew: true,
    downloadUrl: 'https://example.com/policy2026.pdf'
  },
  {
    id: 'article2',
    title: '上海购房全流程指南',
    category: 'process',
    summary: '从看房、选房到签约、贷款、过户、交房的完整购房流程指南。',
    content: '上海购房流程主要包括以下步骤：1. 前期准备：确定预算、了解政策、选择区域。2. 看房选房：通过中介或开发商看房，比较不同楼盘。3. 认购签约：缴纳定金，签订购房合同。4. 办理贷款：选择贷款方式，提交贷款申请。5. 网签备案：在网上签订合同并备案。6. 缴纳税费：缴纳契税、印花税等税费。7. 办理产证：办理不动产权证。8. 验房交房：验收房屋，办理交房手续。',
    publishDate: '2026-01-10',
    source: '上海房产网',
    author: '房产专家',
    tags: ['购房流程', '签约', '贷款', '过户', '交房'],
    isOfficial: false,
    isPopular: true,
    isNew: false
  },
  {
    id: 'article3',
    title: '2026年上海购房税费计算指南',
    category: 'tax',
    summary: '详细介绍上海购房需要缴纳的税费种类和计算方法，帮助购房者合理规划预算。',
    content: '上海购房需要缴纳的税费主要包括：1. 契税：购买普通住房，税率为1%；购买非普通住房，税率为1.5%。2. 印花税：税率为0.05%，买卖双方各承担一半。3. 增值税：满2年的普通住房免征增值税；不满2年的住房，按照5%的征收率全额缴纳增值税。4. 个人所得税：满5年且为家庭唯一住房的，免征个人所得税；否则，按照1%的税率缴纳个人所得税。',
    publishDate: '2026-01-05',
    source: '上海市税务局',
    author: '税务专家',
    tags: ['契税', '印花税', '增值税', '个人所得税'],
    isOfficial: true,
    isPopular: true,
    isNew: true
  },
  {
    id: 'article4',
    title: '上海公积金贷款指南',
    category: 'loan',
    summary: '详细介绍上海公积金贷款的申请条件、额度计算、利率和流程。',
    content: '上海公积金贷款指南：1. 申请条件：连续缴存公积金满6个月，有稳定的职业和收入，信用良好。2. 贷款额度：个人最高贷款额度为60万元，家庭最高贷款额度为120万元。3. 贷款利率：首套房利率为3.0%，二套房利率为3.575%。4. 贷款期限：最长贷款期限为30年，且不超过借款人法定退休年龄。5. 申请流程：准备材料，提交申请，银行审批，签订合同，办理抵押，发放贷款。',
    publishDate: '2025-12-20',
    source: '上海市公积金管理中心',
    author: '公积金专家',
    tags: ['公积金贷款', '申请条件', '额度计算', '利率', '流程'],
    isOfficial: true,
    isPopular: false,
    isNew: false
  },
  {
    id: 'article5',
    title: '上海新房验房全攻略',
    category: 'checklist',
    summary: '新房验收的详细步骤和注意事项，帮助购房者避免收房陷阱。',
    content: '新房验房主要包括以下步骤：1. 检查房屋结构：查看墙面、地面、天花板是否有裂缝，门窗是否密封。2. 检查水电：测试水管是否漏水，电路是否畅通。3. 检查装修：查看墙面涂料、地板、瓷砖是否平整，厨卫设备是否齐全。4. 检查公共部位：查看小区环境、电梯、楼道等公共设施。5. 核对面积：测量房屋实际面积，与合同面积进行核对。6. 查看文件：要求开发商提供《住宅质量保证书》、《住宅使用说明书》等文件。',
    publishDate: '2025-12-15',
    source: '上海验房网',
    author: '验房专家',
    tags: ['验房', '收房', '房屋质量', '注意事项'],
    isOfficial: false,
    isPopular: true,
    isNew: false
  },
  {
    id: 'article6',
    title: '上海购房常见问题解答',
    category: 'property',
    summary: '解答购房者常见的问题，包括产权、贷款、税费、落户等方面。',
    content: '上海购房常见问题解答：1. 产权问题：普通住宅产权为70年，商业用房产权为40年。2. 落户问题：购买上海住房不能直接落户，需要满足积分落户条件。3. 贷款问题：首套房贷款利率为4.1%，二套房贷款利率为4.5%。4. 税费问题：满5年且为家庭唯一住房的，免征个人所得税。5. 学区问题：上海实行划片入学政策，具体学区以教育部门公布为准。',
    publishDate: '2025-12-10',
    source: '上海房产咨询中心',
    author: '房产顾问',
    tags: ['产权', '落户', '贷款', '税费', '学区'],
    isOfficial: false,
    isPopular: false,
    isNew: false
  },
  {
    id: 'article7',
    title: '上海市住房保障政策解读',
    category: 'policy',
    summary: '详细介绍上海市住房保障政策，包括经济适用房、公租房、廉租房等。',
    content: '上海市住房保障政策主要包括：1. 经济适用房：面向中低收入家庭，价格低于市场价。2. 公租房：面向符合条件的家庭和个人，租金低于市场价。3. 廉租房：面向最低收入家庭，租金极低。4. 共有产权房：政府和个人共同拥有房屋产权，个人可逐步购买政府份额。5. 申请条件：根据家庭收入、住房状况等因素确定。',
    publishDate: '2025-12-05',
    source: '上海市住房保障和房屋管理局',
    author: '官方发布',
    tags: ['住房保障', '经济适用房', '公租房', '廉租房', '共有产权房'],
    isOfficial: true,
    isPopular: false,
    isNew: false,
    downloadUrl: 'https://example.com/housing-security.pdf'
  },
  {
    id: 'article8',
    title: '上海二手房交易指南',
    category: 'process',
    summary: '详细介绍上海二手房交易的流程、注意事项和风险防范。',
    content: '上海二手房交易流程主要包括：1. 寻找房源：通过中介或网络寻找合适的房源。2. 实地看房：查看房屋实际情况，了解周边环境。3. 签订合同：与卖方签订二手房买卖合同。4. 办理贷款：如需要贷款，向银行申请贷款。5. 网签备案：在网上签订合同并备案。6. 缴纳税费：缴纳契税、增值税、个人所得税等税费。7. 办理过户：办理房屋产权过户手续。8. 交接房屋：交接房屋钥匙，结算相关费用。',
    publishDate: '2025-11-30',
    source: '上海二手房网',
    author: '二手房专家',
    tags: ['二手房', '交易流程', '注意事项', '风险防范'],
    isOfficial: false,
    isPopular: true,
    isNew: false
  }
];

interface PurchaseGuideProps {
  onNavigate: (view: string) => void;
}

const PurchaseGuide: React.FC<PurchaseGuideProps> = ({ onNavigate }) => {
  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredArticles, setFilteredArticles] = useState<GuideArticle[]>(GUIDE_ARTICLES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<GuideArticle | null>(null);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);

  // 筛选文章
  useEffect(() => {
    let filtered = GUIDE_ARTICLES;

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // 按搜索词筛选
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, searchTerm]);

  // 处理文章保存
  const handleSaveArticle = (articleId: string) => {
    setSavedArticles(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative w-full h-full">
      {/* 背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      </div>

      {/* 页面内容 */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* 标题区域 */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Book className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">购房指南</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            全面的购房政策、流程指南和专业知识，助您轻松应对购房过程中的各种问题
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索政策、流程、税费等相关信息..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 分类导航 */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>全部</span>
            </button>
            {GUIDE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <div className={category.color}>{category.icon}</div>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 分类介绍 */}
        {selectedCategory !== 'all' && (
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              {GUIDE_CATEGORIES.map((category) => (
                category.id === selectedCategory && (
                  <div key={category.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className={`p-3 rounded-full ${category.color} bg-white/5`}>
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">{category.title}</h2>
                      <p className="text-gray-400">{category.description}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* 热门文章推荐 */}
        {selectedCategory === 'all' && (
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-500" />
              热门推荐
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GUIDE_ARTICLES.filter(article => article.isPopular).slice(0, 3).map((article) => (
                <div
                  key={article.id}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {article.isOfficial && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            官方
                          </span>
                        )}
                        {article.isNew && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            最新
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveArticle(article.id);
                        }}
                        className={`text-gray-400 hover:text-white transition-colors ${
                          savedArticles.includes(article.id) ? 'text-blue-400' : ''
                        }`}
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(article.publishDate)}</span>
                      <span>{article.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 文章列表 */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            {selectedCategory === 'all' ? '全部指南' : GUIDE_CATEGORIES.find(cat => cat.id === selectedCategory)?.title}
            <span className="text-sm font-normal text-gray-400">({filteredArticles.length})</span>
          </h2>

          {/* 文章卡片 */}
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:border-orange-500/50 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {article.isOfficial && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          官方
                        </span>
                      )}
                      {article.isNew && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          最新
                        </span>
                      )}
                      {article.isPopular && (
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                          热门
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSaveArticle(article.id)}
                        className={`text-gray-400 hover:text-white transition-colors ${
                          savedArticles.includes(article.id) ? 'text-blue-400' : ''
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      {article.downloadUrl && (
                        <a
                          href={article.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      {article.externalUrl && (
                        <a
                          href={article.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 hover:text-orange-400 transition-colors cursor-pointer" onClick={() => setSelectedArticle(article)}>
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    {article.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-full hover:bg-orange-500/20 hover:text-orange-400 transition-all cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                      <span>发布时间: {formatDate(article.publishDate)}</span>
                      <span>来源: {article.source}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>作者: {article.author}</span>
                      <button
                        className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
                        onClick={() => setSelectedArticle(article)}
                      >
                        查看详情
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 空状态 */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">未找到相关指南</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 文章详情模态框 */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">{selectedArticle.title}</h2>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 模态框内容 */}
            <div className="p-6">
              {/* 文章信息 */}
              <div className="mb-6 pb-4 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {selectedArticle.isOfficial && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      官方文件
                    </span>
                  )}
                  {selectedArticle.isNew && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      最新发布
                    </span>
                  )}
                  {selectedArticle.isPopular && (
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      热门文章
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span>发布时间: {formatDate(selectedArticle.publishDate)}</span>
                  <span>来源: {selectedArticle.source}</span>
                  <span>作者: {selectedArticle.author}</span>
                </div>
              </div>

              {/* 文章摘要 */}
              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <h3 className="text-sm font-medium text-gray-400 mb-2">摘要</h3>
                <p className="text-white">{selectedArticle.summary}</p>
              </div>

              {/* 文章内容 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">内容</h3>
                <div className="text-gray-300 space-y-4">
                  <p>{selectedArticle.content}</p>
                </div>
              </div>

              {/* 文章标签 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">相关标签</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white/10 text-gray-400 text-xs rounded-full hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    savedArticles.includes(selectedArticle.id)
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-white/10 text-gray-400 hover:bg-white/15'
                  }`}
                  onClick={() => handleSaveArticle(selectedArticle.id)}
                >
                  <Bookmark className="w-4 h-4" />
                  {savedArticles.includes(selectedArticle.id) ? '已收藏' : '收藏'}
                </button>
                {selectedArticle.downloadUrl && (
                  <a
                    href={selectedArticle.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 rounded-lg hover:bg-white/15 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    下载文件
                  </a>
                )}
                {selectedArticle.externalUrl && (
                  <a
                    href={selectedArticle.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 rounded-lg hover:bg-white/15 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    查看原文
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseGuide;