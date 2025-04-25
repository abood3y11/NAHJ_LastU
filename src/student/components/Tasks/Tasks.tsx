import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { tasks as initialTasks } from '../../../data/mockData';
import { Search, Filter, Plus, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const taskStats = {
    total: 1220,
    inProgress: 7,
    pending: 43,
    completed: 1550
  };

  const taskProgress = [
    { subject: 'Web Programming', completed: 8, total: 10 },
    { subject: 'Data and Structures', completed: 4, total: 15 },
    { subject: 'Artificial Intelligence', completed: 2, total: 20 }
  ];

  const quickActions = [
    { title: 'Tasks Generating', icon: '🎯' },
    { title: 'Tasks priority', icon: '📊' },
    { title: 'Research Suggestion', icon: '📝' },
    { title: 'Personal Learning', icon: '🎓' }
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="text-sm opacity-90">Total Task</span>
          </div>
          <div className="text-2xl font-bold">{taskStats.total}</div>
        </div>
        
        <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-sm opacity-90">In Progress</span>
          </div>
          <div className="text-2xl font-bold">{taskStats.inProgress}</div>
        </div>
        
        <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-red-400 to-red-500 text-white">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm opacity-90">Pending</span>
          </div>
          <div className="text-2xl font-bold">{taskStats.pending}</div>
        </div>
        
        <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-green-400 to-green-500 text-white">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="text-sm opacity-90">Completed</span>
          </div>
          <div className="text-2xl font-bold">{taskStats.completed}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Today Task</h2>
                <p className="text-gray-600">Check your daily tasks and schedules</p>
              </div>
              <button className="bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white px-4 py-2 rounded-xl hover:bg-[#7d52c7] transition-colors">
                Today's schedule
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="pb-4">Assignment</th>
                    <th className="pb-4">Course</th>
                    <th className="pb-4">Due Date</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Submit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tasks.map((task) => (
                    <tr key={task.id} className="group hover:bg-gray-50">
                      <td className="py-4">{task.title}</td>
                      <td className="py-4">{task.subject}</td>
                      <td className="py-4">{task.startTime}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          task.completed 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {task.completed ? 'Done' : 'In Progress'}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          {task.completed ? 'Submitted' : 'Upload'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Task Progress</h3>
            <div className="space-y-4">
              {taskProgress.map((subject, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{subject.subject}</span>
                    <span className="text-gray-600">{subject.completed}/{subject.total}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400"
                      style={{ width: `${(subject.completed / subject.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img src="https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg" alt="AI Assistant" className="w-12 h-12 rounded-full" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Assignment deadline is tomorrow!</h3>
                  <p className="text-sm text-gray-600 mt-1">Deadline alert: Submission closes in 24 hours.</p>
                  <div className="mt-3">
                    <button className="text-gray-600 mr-4">Dismiss</button>
                    <button className="text-red-600 font-medium">Accept</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div key={index} className="p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{action.icon}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-700">{action.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;