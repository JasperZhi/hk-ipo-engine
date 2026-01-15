import React from 'react';
import { ScoringModel } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  model: ScoringModel;
}

const ScoringCard: React.FC<Props> = ({ model }) => {
  const scoreColor = model.totalScore >= 70 ? '#10B981' : model.totalScore >= 50 ? '#F59E0B' : '#EF4444';
  
  const gaugeData = [
    { name: '得分', value: model.totalScore },
    { name: '剩余', value: 100 - model.totalScore }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">量化评分 (Quantitative Score)</h3>
          <p className="text-xs text-gray-500 mt-1">加权逻辑引擎 v1.0</p>
        </div>
        <div className="relative h-16 w-16">
           {/* Simple CSS Doughnut implementation since Recharts can be overkill for a single number, but using Recharts as requested by "Libraries" section */}
           <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={30}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="cell-0" fill={scoreColor} />
                  <Cell key="cell-1" fill="#E5E7EB" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center mt-2">
                <span className="text-xl font-bold" style={{ color: scoreColor }}>{model.totalScore}</span>
            </div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        {model.dimensions.map((dim, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{dim.name}</span>
              <span className="text-gray-900 font-bold">{dim.score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${dim.score}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{dim.comment}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs italic text-gray-600 leading-relaxed">
          "{model.summary}"
        </p>
      </div>
    </div>
  );
};

export default ScoringCard;