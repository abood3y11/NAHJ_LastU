import React from 'react';
import { Statistic } from '../../../types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
  User, 
  ClipboardList, 
  Target
} from 'lucide-react';

interface StatisticsCardProps {
  statistics: Statistic[];
  overallGrade: number;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics, overallGrade }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return <User className="w-5 h-5 text-white" />;
      case 'clipboard-list':
        return <ClipboardList className="w-5 h-5 text-white" />;
      case 'target':
        return <Target className="w-5 h-5 text-white" />;
      default:
        return <User className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="gradient-card rounded-2xl p-8 hover-scale">
      <h3 className="text-xl font-semibold mb-1">Statistics</h3>
      <p className="text-sm text-gray-500 mb-6">January - June 2025</p>
      
      <div className="flex">
        <div className="space-y-6 flex-1">
          {statistics.map((stat, index) => (
            <div key={index} className="flex items-center group">
              <div className={`w-10 h-10 rounded-xl gradient-blue flex items-center justify-center mr-4 transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                {getIcon(stat.icon)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="font-semibold text-lg gradient-text">{stat.value}%</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-40 h-40">
          <CircularProgressbar
            value={overallGrade}
            text={`${overallGrade}%`}
            styles={buildStyles({
              textSize: '16px',
              pathColor: '#42bff5',
              textColor: '#42bff5',
              trailColor: '#E5E7EB',
              pathTransition: 'stroke-dashoffset 0.5s ease 0s',
              rotation: 0.25,
            })}
          />
          <p className="text-center text-sm text-gray-500 mt-3">Grades Completed</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;