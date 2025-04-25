import React from 'react';
import { UpcomingLesson } from '../../../types';

interface UpcomingLessonsCardProps {
  lessons: UpcomingLesson[];
}

const UpcomingLessonsCard: React.FC<UpcomingLessonsCardProps> = ({ lessons }) => {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <h3 className="text-xl font-bold mb-6">Upcoming Lesson</h3>
      
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-[#edf3f5] to-[#e1f3fa] border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                {lesson.icon}
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-800">{lesson.title}</h4>
                <p className="text-sm text-gray-500">{lesson.time}</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-[#42bff5] text-white rounded-lg hover:bg-[#93e9f5] transition-colors">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingLessonsCard;