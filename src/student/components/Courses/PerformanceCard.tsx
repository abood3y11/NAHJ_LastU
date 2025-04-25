import React from 'react';

interface PerformanceCardProps {
  grade: number;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ grade }) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-6">Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg text-gray-600 mb-4">Study learning performance</h4>
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 rounded-lg bg-white/50 border border-gray-200/50 text-gray-700">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="10"
                strokeDasharray={`${(grade / 10) * 282.7}, 282.7`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#42bff5" />
                  <stop offset="100%" stopColor="#93e9f5" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center transform">
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Your Grade:</p>
                <p className="text-3xl font-bold gradient-text">{grade}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;