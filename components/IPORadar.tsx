import React from 'react';
import { IPORadar as IPORadarType } from '../types';

interface Props {
  data: IPORadarType;
}

const IPORadar: React.FC<Props> = ({ data }) => {
  const { marketSentiment, screeningMetrics } = data;
  
  const sentimentColor = 
    marketSentiment.sentimentTrend === 'Bullish' ? 'text-green-600' :
    marketSentiment.sentimentTrend === 'Bearish' ? 'text-red-600' : 'text-gray-600';
    
  const sentimentBg = 
    marketSentiment.sentimentTrend === 'Bullish' ? 'bg-green-50' :
    marketSentiment.sentimentTrend === 'Bearish' ? 'bg-red-50' : 'bg-gray-50';

  // Helper to parse subscription string (e.g., "3000x", "15.5倍") to number
  const parseSubscription = (val: string): number => {
      if (!val) return 0;
      const clean = val.replace(/,/g, '').replace(/x/i, '').replace(/倍/g, '');
      return parseFloat(clean) || 0;
  };

  // Logarithmic scale for progress bar because range is huge (0 to 11,000x)
  const calculateWidth = (val: string): string => {
      const num = parseSubscription(val);
      if (num <= 1) return '2%';
      const logVal = Math.log10(num);
      // Map log(1)=0 to log(10000)=4 range to 0-100%
      const pct = (logVal / 4) * 100; 
      return `${Math.min(Math.max(pct, 2), 100)}%`;
  };

  const intlWidth = calculateWidth(marketSentiment.internationalSubscription);
  const publicWidth = calculateWidth(marketSentiment.publicSubscription);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
           <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
           </svg>
           智能筛查与机会发现 (IPO Radar)
        </h3>
        <span className="text-xs text-slate-400 font-mono tracking-tight opacity-80">Market Sentiment & Screening</span>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Left: Sentiment Dashboard */}
        <div className="space-y-6">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-2">市场情绪仪表盘 (Sentiment Dashboard)</h4>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* International */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between gap-4 min-h-[140px]">
                 <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">国配热度 (INTL)</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight leading-tight break-words" title={marketSentiment.internationalSubscription}>
                        {marketSentiment.internationalSubscription}
                    </p>
                 </div>
                 <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-auto">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000" style={{ width: intlWidth }}></div> 
                 </div>
              </div>
              
              {/* Public */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between gap-4 min-h-[140px]">
                 <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">公配热度 (PUBLIC)</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight leading-tight break-words" title={marketSentiment.publicSubscription}>
                        {marketSentiment.publicSubscription}
                    </p>
                 </div>
                 <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-auto">
                     <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-1000" style={{ width: publicWidth }}></div>
                 </div>
              </div>

              {/* Sentiment Score */}
              <div className={`${sentimentBg} p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center gap-2 min-h-[140px]`}>
                 <p className="text-[10px] text-slate-500 uppercase font-bold">综合情绪分</p>
                 <p className={`text-5xl font-black ${sentimentColor} leading-none`}>{marketSentiment.sentimentScore}</p>
                 <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/50 ${sentimentColor}`}>
                    {marketSentiment.sentimentTrend}
                 </span>
              </div>
           </div>
           
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">分析师共识:</span> 
              {marketSentiment.analystConsensus}
           </div>
        </div>

        {/* Right: Smart Screening */}
        <div className="space-y-6">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-2">策略筛选指标 (Smart Screening)</h4>
           
           <div className="flex flex-wrap gap-2.5 min-h-[40px]">
              {screeningMetrics.keyTags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg shadow-sm border border-indigo-100 transition-colors hover:bg-indigo-100 cursor-default">
                      #{tag}
                  </span>
              ))}
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-2">
               <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <span className="text-xs text-slate-500 font-medium">赛道 (Sector)</span>
                  <span className="text-sm font-bold text-slate-900 text-right">{screeningMetrics.sector}</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <span className="text-xs text-slate-500 font-medium">上市规则 (Rule)</span>
                  <span className="text-sm font-bold text-purple-700 text-right">{screeningMetrics.listingRule}</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <span className="text-xs text-slate-500 font-medium">营收增速 (Growth)</span>
                  <span className={`text-sm font-bold text-right ${screeningMetrics.revenueGrowth.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                      {screeningMetrics.revenueGrowth}
                  </span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <span className="text-xs text-slate-500 font-medium">毛利率 (Margin)</span>
                  <span className="text-sm font-bold text-slate-900 text-right">{screeningMetrics.grossMargin}</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <span className="text-xs text-slate-500 font-medium">估值区间 (Valuation)</span>
                  <span className="text-sm font-bold text-slate-900 text-right break-words max-w-[60%]">{screeningMetrics.valuationBand}</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <span className="text-xs text-slate-500 font-medium">PEG Ratio</span>
                  <span className="text-sm font-bold text-slate-900 text-right">{screeningMetrics.pegRatio}</span>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default IPORadar;