import React, { useState } from 'react';
import CourseCard from './CourseCard';
import CourseView from './CourseView';
import PerformanceCard from './PerformanceCard';
import EnrolledClassesCard from './EnrolledClassesCard';
import UpcomingLessonsCard from './UpcomingLessonsCard';
import { courses, enrolledClasses, upcomingLessons } from '../../../data/mockData';
import { Plus } from 'lucide-react';
import { CourseData } from '../../../types';

const Courses: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

  const handleViewCourse = (course: CourseData) => {
    setSelectedCourse(course);
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };

  if (selectedCourse) {
    return <CourseView course={selectedCourse} onBack={handleBack} />;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <button className="bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white px-4 py-2 rounded-xl flex items-center hover:shadow-lg hover:scale-105 transition-all duration-300">
          <Plus className="h-5 w-5 mr-1" />
          Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onView={() => handleViewCourse(course)} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceCard grade={8.966} />
        </div>
        <div>
          <UpcomingLessonsCard lessons={upcomingLessons} />
        </div>
      </div>
      
      <div>
        <EnrolledClassesCard classes={enrolledClasses} />
      </div>
    </div>
  );
};

export default Courses;