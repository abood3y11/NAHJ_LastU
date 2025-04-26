import React, { useState } from 'react';
import { BookOpen, Users, Clock, Star, Plus, ChevronRight, Search, Filter } from 'lucide-react';
import CourseView from './CourseView';

const Courses: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      status: 'Canceled',
      progress: 85,
      image: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg'
    }
  ];

  if (selectedCourse !== null) {
    return <CourseView onBack={() => setSelectedCourse(null)} />;
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold teacher-gradient-text">My Courses</h2>
          <p className="text-gray-600">Manage and monitor your courses</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0359a8] focus:border-transparent transition-all duration-300"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300">
            <Filter className="h-5 w-5" />
          </button>
          <button className="px-4 py-2 teacher-gradient-primary rounded-lg hover:shadow-lg transition-all duration-300 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div 
            key={course.id} 
            className="teacher-gradient-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
            onClick={() => setSelectedCourse(course.id)}
          >
            <div className="relative h-48">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.status === 'Active' 
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {course.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                <p className="text-sm opacity-90">{course.code}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="h-4 w-4 text-[#0359a8]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Students</p>
                    <p className="font-semibold">{course.students}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lectures</p>
                    <p className="font-semibold">{course.lectures}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    <span>{course.rating}</span>
                  </div>
                  <span className="text-gray-500">8 weeks</span>
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

              <button className="w-full mt-6 py-2 text-[#0359a8] border border-[#0359a8] rounded-lg hover:bg-[#0359a8] hover:text-white transition-all duration-300 flex items-center justify-center group">
                Manage Course
                <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;