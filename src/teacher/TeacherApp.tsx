import React, { useState } from 'react';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import Courses from './components/Courses/Courses';
import Students from './components/Students/Students';
import Schedule from './components/Schedule/Schedule';
import Grades from './components/Grades/Grades';
import Settings from './components/Settings/Settings';
import { teacherUser } from '../data/mockData';

interface TeacherAppProps {
  onLogout: () => void;
}

const TeacherApp: React.FC<TeacherAppProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <TeacherDashboard />;
      case 'Courses':
        return <Courses />;
      case 'Students':
        return <Students />;
      case 'Schedule':
        return <Schedule />;
      case 'Grades':
        return <Grades />;
      case 'Settings':
        return <Settings />;
      default:
        return <TeacherDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f1f9] to-[#cce4f6]">
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 lg:w-1/5">
            <Sidebar 
              user={teacherUser} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              onLogout={onLogout}
            />
          </div>
          <div className="md:w-3/4 lg:w-4/5 teacher-gradient-card rounded-2xl overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
      <footer className="py-6 text-center text-gray-500 mt-8">
        <p className="text-sm">Copyright © 2025 SmartEdu | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default TeacherApp