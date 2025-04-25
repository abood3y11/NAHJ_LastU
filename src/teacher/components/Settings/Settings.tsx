import React from 'react';
import { User, Bell, Lock, Palette, HelpCircle, Camera } from 'lucide-react';
import { teacherUser } from '../../../data/mockData';

const Settings: React.FC = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold teacher-gradient-text mb-8">Settings</h2>
      
      <div className="teacher-gradient-card rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
              <img 
                src={teacherUser.avatar} 
                alt={teacherUser.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-2 rounded-full teacher-gradient-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold teacher-gradient-text">{teacherUser.name}</h3>
            <p className="text-gray-600">{teacherUser.department}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="teacher-gradient-card rounded-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg teacher-gradient-primary flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold ml-3">Account Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                value={teacherUser.name}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0359a8] focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                value="prof.ahmed@example.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0359a8] focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input 
                type="text" 
                value={teacherUser.department}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0359a8] focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
        </div>
        
        <div className="teacher-gradient-card rounded-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg teacher-gradient-primary flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold ml-3">Notification Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span>Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0359a8]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span>Assignment Submissions</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0359a8]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span>Course Updates</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0359a8]"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="teacher-gradient-card rounded-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg teacher-gradient-primary flex items-center justify-center">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold ml-3">Privacy Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span>Show Online Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0359a8]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span>Share Course Analytics</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0359a8]"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="teacher-gradient-card rounded-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg teacher-gradient-primary flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold ml-3">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0359a8] focus:border-transparent transition-all duration-300">
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0359a8] focus:border-transparent transition-all duration-300">
                <option>Small</option>
                <option selected>Medium</option>
                <option>Large</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;