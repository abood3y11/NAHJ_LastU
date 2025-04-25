import React from 'react';
import { BarChart2 } from 'lucide-react';

interface LearningTimeCardProps {
  hours: number;
  minutes: number;
}

const LearningTimeCard: React.FC<LearningTimeCardProps> = ({ hours, minutes }) => {
  return (
    <div className="glass-card rounded-xl p-4 hover-scale group">
      <div className="flex items-center">
        <div className="bg-gradient-to-br from-[#edf3f5] to-[#e1f3fa] p-3 rounded-xl mr-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
          <BarChart2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Learning Time</p>
          <p className="font-semibold text-lg gradient-text">{hours}h {minutes}m</p>
        </div>
      </div>
    </div>
  );
};

export default LearningTimeCard;