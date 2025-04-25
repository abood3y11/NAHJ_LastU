import React from 'react';
import { DashboardCard } from '../../../types';
import {
  GraduationCap,
  BookOpen,
  Hourglass,
  CheckCircle,
  ListChecks,
  Clock
} from 'lucide-react';

const DashboardCardItem: React.FC<{ card: DashboardCard }> = ({ card }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'graduation-cap':
        return <GraduationCap className="h-6 w-6" />;
      case 'book-open':
        return <BookOpen className="h-6 w-6" />;
      case 'hourglass':
        return <Hourglass className="h-6 w-6" />;
      case 'check-circle':
        return <CheckCircle className="h-6 w-6" />;
      case 'list-checks':
        return <ListChecks className="h-6 w-6" />;
      case 'clock':
        return <Clock className="h-6 w-6" />;
      default:
        return <BookOpen className="h-6 w-6" />;
    }
  };

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-[#edf3f5] to-[#e1f3fa] border border-white/50 transition-all duration-300 hover:shadow-lg group">
      <div className="flex items-center">
        <div className={`${card.color} p-3 rounded-xl mr-3 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
          {getIcon(card.icon)}
        </div>
        <div>
          <p className="text-sm text-gray-500">{card.title}</p>
          <p className="font-semibold text-lg gradient-text">{card.value}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCardItem;