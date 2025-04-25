import React, { useState } from 'react';
import { BookOpen, Users, Clock, Star, Plus, ChevronRight } from 'lucide-react';
import CourseView from './CourseView';

const Courses: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const courses = [
    {
      id: 1,
      title: 'Advanced Machine Learning',
      code: 'CS401',
      students: 45,
      lectures: 12,
      rating: 4.8,
      status: 'Active',
      progress: 75,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
    },
    {
      id: 2,
      title: 'Deep Learning Fundamentals',
      code: 'CS402',
      students: 38,
      lectures: 15,
      rating: 4.6,
      status: 'Active',
      progress: 60,
      image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg'
    },
    {
      id: 3,
      title: 'Neural Networks Learning',
      code: 'CS403',
      students: 52,
      lectures: 10,
      rating: 4.9,
      status: 'Active',
      progress: 85,
      image: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg'
    }
  ];

  if (selectedCourse !== null) {
    return <CourseView onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold teacher-gradient-text">My Courses</h2>
          <p className="text-gray-600">Manage and monitor your courses</p>
        </div>
        <button className="px-4 py-2 teacher-gradient-primary rounded-lg hover:shadow-lg transition-all duration-300 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="teacher-gradient-card rounded-xl overflow-hidden hover-scale">
            <div className="relative h-48">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.status === 'Active' 
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold teacher-gradient-text">{course.title}</h3>
                <span className="text-sm font-medium text-gray-500">{course.code}</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{course.students} Students</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>{course.lectures} Lectures</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>8 weeks</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-[#0359a8] font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full teacher-gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedCourse(course.id)}
                  className="px-4 py-2 teacher-gradient-primary rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  View Course
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
                <button className="p-2 text-gray-600 hover:text-[#0359a8] transition-colors duration-300">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;