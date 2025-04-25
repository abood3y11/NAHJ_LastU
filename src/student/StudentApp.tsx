import React, { useState } from 'react';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Courses from './components/Courses/Courses';
import Schedule from './components/Schedule/Schedule';
import Tasks from './components/Tasks/Tasks';
import Settings from './components/Settings/Settings';
import LearningAssistant from './components/LearningAssistant/LearningAssistant';
import { user } from '../data/mockData';

interface StudentAppProps {
  onLogout: () => void;
}

const StudentApp: React.FC<StudentAppProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showLearningAssistant, setShowLearningAssistant] = useState(false);

  const handleMudrikAIClick = () => {
    setShowLearningAssistant(true);
  };

  if (showLearningAssistant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e3f4fa] to-[#93e9f5]">
        <Header />
        <div className="container mx-auto p-6">
          <div className="glass-card rounded-2xl overflow-hidden">
            <LearningAssistant />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f4fa] to-[#93e9f5]">
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 lg:w-1/5">
            <Sidebar 
              user={user} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              onLogout={onLogout}
              onMudrikAIClick={handleMudrikAIClick}
            />
          </div>
          <div className="md:w-3/4 lg:w-4/5 glass-card rounded-2xl overflow-hidden">
            {activeTab === 'Dashboard' && <Dashboard />}
            {activeTab === 'Courses' && <Courses />}
            {activeTab === 'Schedule' && <Schedule />}
            {activeTab === 'Tasks' && <Tasks />}
            {activeTab === 'Settings' && <Settings />}
          </div>
        </div>
      </div>
      <footer className="py-6 text-center text-gray-500 mt-8">
        <p className="text-sm">Copyright © 2025 SmartEdu | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default StudentApp;