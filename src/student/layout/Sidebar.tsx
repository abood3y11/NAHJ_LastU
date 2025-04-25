import React, { useState } from 'react';
import { User } from '../../types';
import Spline from '@splinetool/react-spline';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  Settings, 
  LogOut,
  Brain,
  Sparkles,
  GraduationCap,
  MessageCircle
} from 'lucide-react';
import MudrikAIDialog from './MudrikAIDialog';

type SidebarProps = {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onMudrikAIClick: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, onLogout, onMudrikAIClick }) => {
  const [showMudrikAI, setShowMudrikAI] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Courses', icon: BookOpen },
    { name: 'Schedule', icon: Calendar },
    { name: 'Tasks', icon: CheckSquare },
    { name: 'Settings', icon: Settings },
  ];

  const handleMudrikAIClose = () => {
    setShowMudrikAI(false);
  };

  const handleSmartLearningClick = () => {
    handleMudrikAIClose();
    onMudrikAIClick();
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-6 flex flex-col h-full transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden mb-3 ring-4 ring-white/50 shadow-xl">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold mt-2 gradient-text">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.department}</p>
        </div>

        <nav className="w-full space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                activeTab === item.name
                  ? 'bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-[#42bff5]/10'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${
                activeTab === item.name ? 'text-white' : 'text-gray-500'
              }`} />
              <span>{item.name}</span>
            </button>
          ))}
          
          <div 
            className="w-full h-[400px] rounded-xl overflow-hidden cursor-pointer relative group"
            onClick={() => setShowMudrikAI(true)}
          >
            <Spline scene="https://prod.spline.design/9fF9yd6YQSPHOP-t/scene.splinecode" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <span className="text-white text-lg font-medium">Open Mudrik AI</span>
            </div>
          </div>
        </nav>

        <button 
          onClick={onLogout}
          className="w-full flex items-center p-3 mt-auto text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-300 mb-4"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>

      <MudrikAIDialog 
        isOpen={showMudrikAI} 
        onClose={handleMudrikAIClose}
        onSmartLearningClick={handleSmartLearningClick}
      />
    </>
  );
};

export default Sidebar;