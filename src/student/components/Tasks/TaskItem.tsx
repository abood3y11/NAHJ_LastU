import React from 'react';
import { Task } from '../../../types';
import { CheckCircle, Clock } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  toggleComplete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, toggleComplete }) => {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${task.completed ? 'border-green-500' : 'border-blue-500'} flex justify-between mb-3 transition-all hover:shadow-md`}>
      <div>
        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
        <p className="text-sm text-gray-600">{task.subject}</p>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{task.startTime} - {task.endTime}</span>
        </div>
      </div>
      
      <div className="flex items-center">
        <button 
          onClick={() => toggleComplete(task.id)}
          className={`p-2 rounded-full ${
            task.completed 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600'
          }`}
        >
          <CheckCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;