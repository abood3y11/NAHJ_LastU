import React from 'react';
import { User } from '../../types';
import { 
  LayoutDashboard, 
  GraduationCap,
  Users,
  Calendar, 
  LineChart, 
  Settings, 
  LogOut 
} from 'lucide-react';

type SidebarProps = {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Courses', icon: GraduationCap },
    { name: 'Students', icon: Users },
    { name: 'Schedule', icon: Calendar },
    { name: 'Grades', icon: LineChart },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="teacher-gradient-card rounded-2xl p-6 flex flex-col h-full transition-all duration-300">
      <div className="flex flex-col items-center mb-8">
        <div className="w-28 h-28 rounded-full overflow-hidden mb-3 ring-4 ring-[#0359a8]/20 shadow-xl">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-lg font-semibold mt-2 text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.department}</p>
      </div>

      <nav className="w-full space-y-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 ${
              activeTab === item.name
                ? 'teacher-gradient-primary shadow-lg'
                : 'text-gray-600 hover:bg-[#0359a8]/10'
            }`}
          >
            <item.icon className={`h-5 w-5 ${
              activeTab === item.name ? 'text-white' : 'text-gray-400'
            }`} />
            <span className="ml-4">{item.name}</span>
          </button>
        ))}
      </nav>

      <button 
        onClick={onLogout}
        className="w-full flex items-center p-4 mt-auto text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-300"
      >
        <LogOut className="h-5 w-5" />
        <span className="ml-4">Log Out</span>
      </button>
    </div>
  );
};

export default Sidebar