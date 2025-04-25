import React from 'react';
import { ListChecks } from 'lucide-react';

interface TasksCardProps {
  count: number;
}

const TasksCard: React.FC<TasksCardProps> = ({ count }) => {
  return (
    <div className="glass-card rounded-xl p-4 hover-scale group">
      <div className="flex items-center">
        <div className="bg-gradient-to-br from-[#edf3f5] to-[#e1f3fa] p-3 rounded-xl mr-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
          <ListChecks className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">My Activities</p>
          <p className="font-semibold text-lg gradient-text">{count} Tasks</p>
        </div>
      </div>
    </div>
  );
};

export default TasksCard;