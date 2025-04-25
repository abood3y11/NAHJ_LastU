import React from 'react';
import { Task } from '../../../types';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

interface UpcomingTasksCardProps {
  tasks: Task[];
}

const UpcomingTasksCard: React.FC<UpcomingTasksCardProps> = ({ tasks }) => {
  const upcomingTasks = tasks.filter(task => !task.completed).slice(0, 3);
  
  return (
    <div className="glass-card rounded-2xl p-6 h-full hover-scale flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold ">Upcoming Tasks</h3>
        <button className="gradient-text flex items-center text-sm font-medium hover:text-indigo-600 transition-colors duration-300 group">
          View all
          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
      
      <div className="space-y-6 flex-1">
        {upcomingTasks.map((task) => (
          <div 
            key={task.id} 
            className="group p-6 rounded-xl bg-gradient-to-br from-[#edf3f5] to-[#e1f3fa] border border-white/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="flex items-center mb-4">
              <div className="bg-[edf3f5] p-3 rounded-lg mr-4">
                <BookOpen className="h-5 w-5 text-[#42bff5]" />
              </div>
              <h4 className="font-medium text-lg text-gray-800">{task.title}</h4>
            </div>
            <div className="flex items-center text-sm text-gray-500 ml-14">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {task.startTime} - {task.endTime}
              </span>
            </div>
            <div className="ml-14 mt-3">
              <span className="inline-block px-4 py-1.5 text-sm font-medium text-[#42bff5] bg-[#edf3f5] rounded-full">
                {task.subject}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {upcomingTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500 flex-1 flex items-center justify-center">
          <p className="text-sm">No upcoming tasks</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTasksCard;