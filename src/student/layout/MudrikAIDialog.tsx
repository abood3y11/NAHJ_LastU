import React from 'react';
import { X, Brain, Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface MudrikAIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSmartLearningClick: () => void;
}

const MudrikAIDialog: React.FC<MudrikAIDialogProps> = ({ isOpen, onClose, onSmartLearningClick }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: Brain,
      title: 'Smart Learning Assistant',
      description: 'Get personalized help with your studies and assignments through advanced AI tutoring',
      onClick: onSmartLearningClick
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Receive custom recommendations and insights based on your unique learning style and progress'
    },
    {
      icon: Calendar,
      title: 'Study Planning',
      description: 'Create optimized study schedules and get AI-powered recommendations for better time management'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative">
          <div className="p-8 border-b border-white/10">
            <button 
              onClick={onClose}
              className="absolute right-8 top-8 p-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#42bff5] to-[#93e9f5] bg-clip-text text-transparent">
              Welcome to Mudrik AI
            </h2>
            <p className="text-gray-600 mt-2 text-lg">Your intelligent learning companion powered by advanced AI</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-6 rounded-2xl bg-white/50 hover:bg-gradient-to-br hover:from-[#42bff5] hover:to-[#93e9f5] transition-all duration-500 cursor-pointer"
                  onClick={feature.onClick}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#42bff5]/10 flex items-center justify-center group-hover:bg-white/20">
                      <feature.icon className="h-6 w-6 text-[#42bff5] group-hover:text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-white">{feature.title}</h3>
                  <p className="text-gray-600 group-hover:text-white/90">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-center space-x-4">
              <button 
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Maybe Later
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Start Learning with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MudrikAIDialog;