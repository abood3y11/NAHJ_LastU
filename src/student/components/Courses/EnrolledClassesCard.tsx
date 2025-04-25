import React from 'react';
import { EnrolledClass } from '../../../types';
import { Clock, BookOpen, CheckSquare } from 'lucide-react';

interface EnrolledClassesCardProps {
  classes: EnrolledClass[];
}

const EnrolledClassesCard: React.FC<EnrolledClassesCardProps> = ({ classes }) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Recent enrolled classes</h3>
        <div className="flex items-center space-x-2">
          <button className="text-[#42bff5] hover:text-[#93e9f5] transition-colors">All</button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Clock className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {classes.map((classItem) => (
          <div key={classItem.id} className="p-4 rounded-xl bg-gradient-to-br from-[#edf3f5] to-[#e1f3fa] border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                {classItem.icon}
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">{classItem.title}</h4>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{classItem.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{classItem.lessons} Lessons</span>
                  </div>
                  {classItem.hasAssignments && (
                    <div className="flex items-center">
                      <CheckSquare className="h-4 w-4 mr-1" />
                      <span>Assignments</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledClassesCard;