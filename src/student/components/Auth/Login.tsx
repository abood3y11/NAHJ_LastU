import React from 'react';
import { GraduationCap, UserCog } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'student' | 'teacher') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            SmartMentor  نهج
          </h1>
          <p className="text-gray-600">Welcome to your learning management system</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onLogin('student')}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
          >
            <GraduationCap className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-medium">Continue as Student</span>
          </button>

          <button
            onClick={() => onLogin('teacher')}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
          >
            <UserCog className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-medium">Continue as Teacher</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Login;