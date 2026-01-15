import React from 'react';
import { PositionAdvice, Recommendation } from '../types';

interface Props {
  advice: PositionAdvice;
}

const DecisionCard: React.FC<Props> = ({ advice }) => {
  const isGo = advice.recommendation === Recommendation.GO;

  return (
    <div className={`rounded-lg border shadow-sm overflow-hidden ${isGo ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <div className="p-5 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">最终决策 (Final Decision)</h2>
          <div className="flex items-center gap-3">
             <span className={`text-4xl font-extrabold tracking-tight ${isGo ? 'text-green-700' : 'text-red-700'}`}>
                {advice.recommendation}
             </span>
          </div>
          <p className="mt-3 text-sm text-gray-800 font-medium leading-relaxed">
             {advice.rationale}
          </p>
        </div>
        
        <div className="w-full md:w-auto bg-white bg-opacity-60 rounded-lg p-4 border border-gray-100 min-w-[200px]">
           <div>
             <p className="text-xs text-gray-500 uppercase">风险预算 (最大回撤)</p>
             <p className="text-md font-semibold text-gray-700">{advice.maxDrawdownTolerance}</p>
           </div>
        </div>
      </div>
      
      {!isGo && (
        <div className="bg-red-100 px-5 py-2 text-xs text-red-800 font-medium">
           STOP: 未达评分门槛，启动本金保护模式。
        </div>
      )}
       {isGo && (
        <div className="bg-green-100 px-5 py-2 text-xs text-green-800 font-medium">
           ACTION: 严格按照交易计划执行。
        </div>
      )}
    </div>
  );
};

export default DecisionCard;