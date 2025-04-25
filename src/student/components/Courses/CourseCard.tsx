import React from 'react';
import { CourseData } from '../../../types';
import { BookOpen, Clock, User } from 'lucide-react';

interface CourseCardProps {
  course: CourseData;
  onView: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onView }) => {
  return (
    <div className="glass-card rounded-xl p-6 hover-scale group">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-br from-[#edf3f5] to-[#e1f3fa] p-3 rounded-xl mr-3 transition-transform group-hover:scale-110 group-hover:rotate-3">
          <BookOpen className="h-5 w-5 text-[#42bff5]" />
        </div>
        <h3 className="font-semibold text-lg text-[#42bff5]">{course.name}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">{course.professor}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{course.schedule}</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-[#42bff5]">{course.progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#42bff5] to-[#93e9f5] transition-all duration-500 ease-out"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
      
      <button 
        onClick={onView}
        className="mt-6 w-full py-2 px-4 rounded-lg border border-[#42bff5] text-[#42bff5] font-medium hover:bg-[#e1f3fa] transition-all duration-300"
      >
        View Course
      </button>
    </div>
  );
};

export default CourseCard;