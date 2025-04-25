import React from 'react';
import { ArrowLeft, Users, Clock, BookOpen, BarChart2, MessageSquare } from 'lucide-react';

interface CourseViewProps {
  onBack: () => void;
}

const CourseView: React.FC<CourseViewProps> = ({ onBack }) => {
  const lectures = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      lectureNumber: '#1',
      date: 'Apr 20, 2025',
      time: '09:00 - 10:30 AM',
      status: 'Live',
      students: 45,
    },
    {
      id: 2,
      title: 'Neural Networks Basics',
      lectureNumber: '#2',
      date: 'Apr 22, 2025',
      time: '09:00 - 10:30 AM',
      status: 'Upcoming',
      students: 42,
    },
    {
      id: 3,
      title: 'Python Programming Fundamentals',
      lectureNumber: '#0',
      date: 'Apr 18, 2025',
      time: '09:00 - 10:30 AM',
      status: 'Completed',
      students: 48,
    },
  ];

  const stats = [
    {
      label: 'Total Lectures',
      value: '24',
      subtext: 'This semester',
      icon: BookOpen,
    },
    {
      label: 'Average Attendance',
      value: '45',
      subtext: 'Students per lecture',
      icon: Users,
    },
    {
      label: 'Completion Rate',
      value: '92%',
      subtext: 'Course progress',
      icon: BarChart2,
    },
    {
      label: 'Student Engagement',
      value: '87%',
      subtext: 'Participation rate',
      icon: MessageSquare,
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'bg-emerald-100 text-emerald-700';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getActionButton = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return (
          <button className="px-6 py-2 teacher-gradient-primary rounded-lg hover:shadow-lg transition-all duration-300">
            Join Now
          </button>
        );
      case 'upcoming':
        return (
          <button className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300">
            Prepare
          </button>
        );
      case 'completed':
        return (
          <button className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300">
            View Report
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-[#0359a8] mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Courses
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold teacher-gradient-text mb-2">Lecture Management</h1>
        <p className="text-gray-600">Advanced Computer Science - Spring 2025</p>
      </div>

      <div className="teacher-gradient-card rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 rounded-xl bg-white/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg teacher-gradient-primary flex items-center justify-center mr-3">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-600">{stat.label}</span>
              </div>
              <div className="ml-13">
                <p className="text-2xl font-bold teacher-gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="teacher-gradient-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-2">Lecture Title</div>
            <div>Date & Time</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {lectures.map((lecture) => (
            <div key={lecture.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="col-span-2">
                  <h3 className="font-medium text-gray-900">{lecture.title}</h3>
                  <p className="text-sm text-gray-500">Lecture {lecture.lectureNumber}</p>
                </div>
                <div>
                  <p className="text-gray-900">{lecture.date}</p>
                  <p className="text-sm text-gray-500">{lecture.time}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(lecture.status)}`}>
                    {lecture.status}
                  </span>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{lecture.students}</span>
                  </div>
                </div>
                <div>
                  {getActionButton(lecture.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseView;