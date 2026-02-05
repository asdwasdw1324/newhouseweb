/**
 * 贷款计算工具组件
 * 支持公积金贷款和商业贷款的计算，基于上海最新利率信息
 */

import React, { useState, useEffect } from 'react';
import { BarChart3, DollarSign, Percent, Calendar, Home, Info } from 'lucide-react';

// 贷款类型
interface LoanType {
  id: string;
  label: string;
  description: string;
}

// 上海最新房贷利率信息（2026年）
const SHANGHAI_INTEREST_RATES = {
  // 商业贷款
  commercial: {
    firstHome: {
      rate: 4.1,
      description: '首套房商业贷款基准利率'
    },
    secondHome: {
      rate: 4.5,
      description: '二套房商业贷款基准利率'
    }
  },
  // 公积金贷款
  fund: {
    firstHome: {
      rate: 3.0,
      description: '首套房公积金贷款基准利率'
    },
    secondHome: {
      rate: 3.575,
      description: '二套房公积金贷款基准利率'
    }
  }
};

// 贷款年限选项
const LOAN_YEARS_OPTIONS = [
  { value: 5, label: '5年' },
  { value: 10, label: '10年' },
  { value: 15, label: '15年' },
  { value: 20, label: '20年' },
  { value: 25, label: '25年' },
  { value: 30, label: '30年' }
];

interface LoanCalculatorProps {
  onNavigate: (view: string) => void;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onNavigate }) => {
  // 状态管理
  const [loanType, setLoanType] = useState<string>('commercial'); // commercial 或 fund
  const [homeType, setHomeType] = useState<string>('firstHome'); // firstHome 或 secondHome
  const [loanAmount, setLoanAmount] = useState<number>(1000000); // 贷款金额（元）
  const [loanYears, setLoanYears] = useState<number>(30); // 贷款年限
  const [downPayment, setDownPayment] = useState<number>(500000); // 首付金额（元）
  const [totalHousePrice, setTotalHousePrice] = useState<number>(1500000); // 总房价
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0); // 月供
  const [totalInterest, setTotalInterest] = useState<number>(0); // 总利息
  const [totalPayment, setTotalPayment] = useState<number>(0); // 总还款

  // 贷款类型选项
  const loanTypes: LoanType[] = [
    {
      id: 'commercial',
      label: '商业贷款',
      description: '适用于所有购房人群，利率略高'
    },
    {
      id: 'fund',
      label: '公积金贷款',
      description: '适用于有公积金的购房人群，利率较低'
    }
  ];

  // 计算贷款
  const calculateLoan = () => {
    // 获取当前利率
    const interestRate = SHANGHAI_INTEREST_RATES[loanType as keyof typeof SHANGHAI_INTEREST_RATES][homeType as keyof typeof SHANGHAI_INTEREST_RATES.commercial].rate / 100 / 12;
    
    // 计算还款月数
    const loanMonths = loanYears * 12;
    
    // 计算月供（等额本息）
    const payment = loanAmount * interestRate * Math.pow(1 + interestRate, loanMonths) / 
      (Math.pow(1 + interestRate, loanMonths) - 1);
    
    // 计算总还款和总利息
    const totalPay = payment * loanMonths;
    const totalInt = totalPay - loanAmount;
    
    setMonthlyPayment(payment);
    setTotalPayment(totalPay);
    setTotalInterest(totalInt);
  };

  // 当贷款参数变化时重新计算
  useEffect(() => {
    calculateLoan();
  }, [loanType, homeType, loanAmount, loanYears]);

  // 当总房价或首付变化时更新贷款金额
  useEffect(() => {
    const newLoanAmount = totalHousePrice - downPayment;
    setLoanAmount(newLoanAmount > 0 ? newLoanAmount : 0);
  }, [totalHousePrice, downPayment]);

  // 格式化数字为货币格式
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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
            <BarChart3 className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">贷款计算工具</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            基于上海最新房贷利率，轻松计算您的购房贷款月供和总利息
          </p>
        </div>

        {/* 计算表单 */}
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 sm:p-8 mb-10">
          {/* 贷款类型选择 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-orange-500" />
              贷款类型
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loanTypes.map((type) => (
                <div
                  key={type.id}
                  className={`relative rounded-xl border ${loanType === type.id ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/5'} p-4 cursor-pointer transition-all hover:border-orange-500/50`}
                  onClick={() => setLoanType(type.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${loanType === type.id ? 'text-orange-400' : 'text-white'}`}>
                        {type.label}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                      <p className="text-sm font-medium mt-2">
                        {loanType === type.id ? (
                          <span className="text-orange-400">
                            当前选择: {SHANGHAI_INTEREST_RATES[type.id as keyof typeof SHANGHAI_INTEREST_RATES][homeType as keyof typeof SHANGHAI_INTEREST_RATES.commercial].rate}%
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            首套: {SHANGHAI_INTEREST_RATES[type.id as keyof typeof SHANGHAI_INTEREST_RATES].firstHome.rate}% / 二套: {SHANGHAI_INTEREST_RATES[type.id as keyof typeof SHANGHAI_INTEREST_RATES].secondHome.rate}%
                          </span>
                        )}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${loanType === type.id ? 'border-orange-500 bg-orange-500' : 'border-white/30'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 房屋类型选择 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-orange-500" />
              房屋类型
            </h2>
            <div className="flex gap-4">
              <button
                className={`flex-1 py-3 rounded-xl transition-all ${homeType === 'firstHome' ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                onClick={() => setHomeType('firstHome')}
              >
                首套房
              </button>
              <button
                className={`flex-1 py-3 rounded-xl transition-all ${homeType === 'secondHome' ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                onClick={() => setHomeType('secondHome')}
              >
                二套房
              </button>
            </div>
          </div>

          {/* 贷款参数设置 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              贷款参数
            </h2>
            
            {/* 总房价 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-medium">总房价</label>
                <span className="text-orange-400 font-semibold">{formatCurrency(totalHousePrice)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="100000"
                value={totalHousePrice}
                onChange={(e) => setTotalHousePrice(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50万</span>
                <span>1000万</span>
              </div>
            </div>

            {/* 首付金额 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-medium">首付金额</label>
                <span className="text-orange-400 font-semibold">{formatCurrency(downPayment)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max={Math.min(totalHousePrice * 0.7, 5000000)}
                step="50000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10万</span>
                <span>{formatCurrency(Math.min(totalHousePrice * 0.7, 5000000))}</span>
              </div>
            </div>

            {/* 贷款金额（自动计算） */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-medium">贷款金额</label>
                <span className="text-orange-400 font-semibold">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-lg">
                <div 
                  className="h-full bg-orange-500 rounded-lg transition-all" 
                  style={{ width: `${Math.min((loanAmount / 10000000) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>1000万</span>
              </div>
            </div>

            {/* 贷款年限 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-medium">贷款年限</label>
                <span className="text-orange-400 font-semibold">{loanYears}年</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {LOAN_YEARS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`py-2 rounded-lg text-sm transition-all ${loanYears === option.value ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    onClick={() => setLoanYears(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 计算按钮 */}
          <div className="text-center">
            <button
              className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20"
              onClick={calculateLoan}
            >
              重新计算
            </button>
          </div>
        </div>

        {/* 计算结果 */}
        {monthlyPayment > 0 && (
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              计算结果
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* 月供 */}
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-white">月供</h3>
                </div>
                <p className="text-2xl font-bold text-orange-400">{formatCurrency(monthlyPayment)}</p>
                <p className="text-sm text-gray-400 mt-1">每月还款金额</p>
              </div>
              
              {/* 总利息 */}
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Percent className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-white">总利息</h3>
                </div>
                <p className="text-2xl font-bold text-orange-400">{formatCurrency(totalInterest)}</p>
                <p className="text-sm text-gray-400 mt-1">贷款期间总利息</p>
              </div>
              
              {/* 总还款 */}
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-white">总还款</h3>
                </div>
                <p className="text-2xl font-bold text-orange-400">{formatCurrency(totalPayment)}</p>
                <p className="text-sm text-gray-400 mt-1">贷款期间总还款</p>
              </div>
            </div>

            {/* 贷款详情 */}
            <div className="bg-white/10 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">贷款详情</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">贷款类型</span>
                  <span className="text-white">{loanTypes.find(type => type.id === loanType)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">房屋类型</span>
                  <span className="text-white">{homeType === 'firstHome' ? '首套房' : '二套房'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">利率</span>
                  <span className="text-white">{SHANGHAI_INTEREST_RATES[loanType as keyof typeof SHANGHAI_INTEREST_RATES][homeType as keyof typeof SHANGHAI_INTEREST_RATES.commercial].rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">贷款年限</span>
                  <span className="text-white">{loanYears}年 ({loanYears * 12}个月)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">总房价</span>
                  <span className="text-white">{formatCurrency(totalHousePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">首付比例</span>
                  <span className="text-white">{(downPayment / totalHousePrice * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 利率说明 */}
        <div className="max-w-4xl mx-auto mt-10 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-500" />
            利率说明
          </h2>
          <div className="text-gray-400 text-sm space-y-3">
            <p>以上利率信息基于上海市2026年最新房贷政策，仅供参考。实际贷款利率可能因银行政策、个人信用等因素有所不同。</p>
            <p><strong>商业贷款：</strong>首套房基准利率为4.1%，二套房基准利率为4.5%。</p>
            <p><strong>公积金贷款：</strong>首套房基准利率为3.0%，二套房基准利率为3.575%。</p>
            <p>公积金贷款额度上限：个人最高60万元，家庭最高120万元。</p>
            <p>本计算器采用等额本息还款方式计算，即每月还款金额固定，前期利息占比较大，后期本金占比较大。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
