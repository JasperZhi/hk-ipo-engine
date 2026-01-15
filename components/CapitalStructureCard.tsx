import React from 'react';
import { IPOAnalysis } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Props {
  data: IPOAnalysis;
}

const CapitalStructureCard: React.FC<Props> = ({ data }) => {
  const { issuanceInfo, cornerstones, preIpo } = data;

  // Prepare data for Allocation Pie Chart
  const parsePct = (str: string) => parseFloat(str?.replace('%', '')) || 0;
  
  const publicPct = parsePct(issuanceInfo.publicTranchePct) || 10;
  const internationalPct = parsePct(issuanceInfo.internationalTranchePct) || 90;
  
  const allocationData = [
    { name: '公开发售 (Public)', value: publicPct, color: '#3B82F6' }, // Blue
    { name: '国际配售 (Intl)', value: internationalPct, color: '#6366F1' }, // Indigo
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Header matching IPO Radar style */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
           <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
           </svg>
           资本结构与发行 (Capital Structure)
        </h3>
        <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">Issuance & Pre-IPO</span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Offering Structure */}
        <div className="col-span-1 space-y-6">
             {/* Key Stats Grid */}
             <div className="grid grid-cols-2 gap-3">
                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">发行总股数</span>
                    <span className="text-sm font-bold text-gray-900 truncate block" title={issuanceInfo.totalShares}>
                        {issuanceInfo.totalShares}
                    </span>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">绿鞋机制</span>
                    <span className="text-sm font-bold text-gray-900 truncate block" title={issuanceInfo.greenshoeOption}>
                        {issuanceInfo.greenshoeOption}
                    </span>
                 </div>
             </div>

             {/* Chart */}
             <div className="bg-white rounded-lg border border-gray-100 p-4 relative">
                 <h4 className="text-xs font-bold text-gray-400 uppercase text-center mb-2">全球发售分配</h4>
                 <div className="h-32 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={50}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {allocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                        <span className="text-[10px] text-gray-400 font-medium">基石占比</span>
                        <span className="text-sm font-bold text-indigo-600">{issuanceInfo.cornerstonePctOfOffer}</span>
                    </div>
                 </div>
                 <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-xs text-gray-600">公开发售 {issuanceInfo.publicTranchePct}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="text-xs text-gray-600">国际配售 {issuanceInfo.internationalTranchePct}</span>
                    </div>
                 </div>
            </div>
        </div>

        {/* Right Column: Cornerstones & Pre-IPO */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
            
            {/* Cornerstone Investors */}
            <div>
                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">基石投资者 (Cornerstone Investors)</h4>
                    <span className="text-[10px] font-mono text-gray-400">Total: {data.cornerstones?.length || 0}</span>
                </div>
                {cornerstones && cornerstones.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cornerstones.map((c, idx) => (
                            <div key={idx} className="bg-gray-50 rounded p-3 border border-gray-100 flex justify-between items-start">
                                <div>
                                    <span className="text-sm font-bold text-gray-800 block">{c.name}</span>
                                    <span className="text-xs text-gray-500">{c.details}</span>
                                </div>
                                <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-400 whitespace-nowrap">
                                    {c.lockup || '6M Lockup'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-gray-50 rounded border border-gray-100 border-dashed text-gray-400 text-xs">
                        暂无基石信息披露
                    </div>
                )}
            </div>

            {/* Pre-IPO Financing */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 border-b border-gray-100 pb-2">一级市场融资 (Pre-IPO Rounds)</h4>
                <div className="space-y-4">
                    {preIpo.financingRounds && preIpo.financingRounds.length > 0 ? (
                        preIpo.financingRounds.map((round, idx) => (
                            <div key={idx} className="flex relative pl-4 border-l-2 border-gray-200 pb-1 last:pb-0 last:border-0">
                                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 border border-white ring-2 ring-gray-100"></span>
                                <div className="w-full bg-white rounded border border-gray-100 p-3 ml-2 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-gray-900 bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{round.round}</span>
                                        <span className="text-[10px] text-gray-400 font-mono">{round.date}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-400 block scale-90 origin-left">投后估值</span>
                                            <span className="font-medium text-gray-700">{round.valuation}</span>
                                        </div>
                                         <div>
                                            <span className="text-gray-400 block scale-90 origin-left">折让</span>
                                            <span className={`font-medium ${round.discount ? 'text-green-600' : 'text-gray-400'}`}>{round.discount || '-'}</span>
                                        </div>
                                         <div>
                                            <span className="text-gray-400 block scale-90 origin-left">投资方</span>
                                            <span className="font-medium text-gray-700 truncate block" title={round.investors.join(', ')}>
                                                {round.investors.length > 0 ? `${round.investors[0]}...` : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-400 italic pl-2">暂无公开融资记录</div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CapitalStructureCard;