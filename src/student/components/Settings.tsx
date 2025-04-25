import React from 'react';
import { user } from '../../data/mockData';
import { UserCircle, Bell, Lock, Globe, Palette, HelpCircle } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.department}</p>
            <button className="mt-2 px-4 py-2 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white rounded-lg hover:bg-blue-600 transition-colors">
              Change Profile Picture
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <UserCircle className="h-5 w-5 mr-2 text-[#42bff5]" />
            <h3 className="font-semibold">Account Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                value={user.name}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                value="sara.ahmed@example.com"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input 
                type="text" 
                value={user.department}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 mr-2 text-[#42bff5]" />
            <h3 className="font-semibold">Notification Settings</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#42bff5]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#42bff5]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Assignment Reminders</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#42bff5]"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 mr-2 text-[#42bff5]" />
            <h3 className="font-semibold">Privacy Settings</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Show Profile to Other Students</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#42bff5]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Show Activity Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#42bff5]"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Palette className="h-5 w-5 mr-2 text-[#42bff5]" />
            <h3 className="font-semibold">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select className="w-full px-3 py-2 border rounded-lg">
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