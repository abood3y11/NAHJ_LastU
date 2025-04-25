import React from 'react';
import { Search, Mail, Bell, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 py-4 px-6 sticky top-0 z-50 from-[#42bff5] to-[#93e9f5]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/nahj-logo.png" 
            alt="SmartMentor نهج"
            className="h-10"
          />
        </div>
        
        <div className="flex-1 max-w-3xl mx-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything"
              className="w-full py-2 px-4 pl-10 bg-white/50 backdrop-blur rounded-full border border-gray-200/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#42bff5]/50 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-[#42bff5] transition-colors duration-300 rounded-full hover:bg-[#42bff5]/10">
            <Mail className="h-6 w-6" />
          </button>
          <button className="p-2 text-gray-500 hover:text-[#42bff5] transition-colors duration-300 rounded-full hover:bg-[#42bff5]/10">
            <Bell className="h-6 w-6" />
          </button>
          <button className="p-2 text-gray-500 hover:text-[#42bff5] transition-colors duration-300 rounded-full hover:bg-[#42bff5]/10">
            <HelpCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header