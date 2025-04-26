import React from 'react';
import { BarChart2, Users, AlertTriangle, MessageSquare, ChevronRight, BarChart, HelpCircle, Users2, ArrowLeft } from 'lucide-react';

interface LiveClassroomProps {
  onClose: () => void;
}

const LiveClassroom: React.FC<LiveClassroomProps> = ({ onClose }) => {
  const comprehensionData = {
    percentage: 76,
    activeStudents: '42/45',
    questionsAsked: 12,
    confusionFlags: 3
  };

  const quickActions = [
    { id: 1, title: 'Launch Quick Poll', icon: BarChart },
    { id: 2, title: 'Start Mini Quiz', icon: HelpCircle },
    { id: 3, title: 'Think-Pair-Share', icon: Users2 }
  ];

  const studentQuestions = [
    {
      id: 1,
      student: {
        name: 'Emma Thompson',
        avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg'
      },
      question: 'Can you explain the difference between Stack and Queue again?',
      timeAgo: '2 mins ago'
    },
    {
      id: 2,
      student: {
        name: 'James Wilson',
        avatar: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg'
      },
      question: 'Is the time complexity O(n) or O(n²) in this case?',
      timeAgo: '5 mins ago'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'error',
      title: 'Understanding Drop Detected',
      description: 'Topic: Data Structures',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'warning',
      title: 'Multiple Questions Pending',
      description: '3 students waiting',
      icon: MessageSquare
    }
  ];

  const suggestions = [
    {
      id: 1,
      title: 'Slow Down Pace',
      description: 'Multiple students showing signs of falling behind',
      icon: '💡'
    },
    {
      id: 2,
      title: 'Show Visual Example',
      description: 'Consider drawing a diagram for Stack vs Queue',
      icon: '🔗'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 bg-white border-b">
        <button 
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-[#0359a8] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Exit Live Session
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Class Comprehension */}
            <div className="teacher-gradient-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Class Comprehension</h2>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-[#0359a8] font-medium">Live</span>
                </div>
              </div>

              <div className="flex items-center justify-center mb-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#0359a8"
                      strokeWidth="10"
                      strokeDasharray={`${comprehensionData.percentage * 2.83}, 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#0359a8]">{comprehensionData.percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-[#0359a8]">{comprehensionData.activeStudents}</div>
                  <div className="text-gray-600">Active Students</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-[#0359a8]">{comprehensionData.questionsAsked}</div>
                  <div className="text-gray-600">Questions Asked</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-[#0359a8]">{comprehensionData.confusionFlags}</div>
                  <div className="text-gray-600">Confusion Flags</div>
                </div>
              </div>
            </div>

            {/* Student Questions */}
            <div className="teacher-gradient-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Student Questions</h2>
              <div className="space-y-4">
                {studentQuestions.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 bg-white shadow-sm hover:shadow-md rounded-xl transition-all">
                    <img
                      src={item.student.avatar}
                      alt={item.student.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">{item.question}</p>
                      <p className="text-sm text-gray-500">{item.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Adjustments */}
            <div className="teacher-gradient-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Suggested Adjustments</h2>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 bg-blue-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div>
                        <h3 className="font-medium text-[#0359a8]">{suggestion.title}</h3>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#0359a8] text-white rounded-lg hover:bg-[#0284c7] transition-colors">
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Alerts */}
          <div className="col-span-4 space-y-6">
            {/* Quick Actions */}
            <div className="teacher-gradient-card rounded-2xl p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className="w-full p-4 bg-[#0359a8] text-white rounded-xl hover:bg-[#0284c7] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center">
                      <action.icon className="h-5 w-5 mr-3" />
                      {action.title}
                    </div>
                    <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Active Alerts */}
            <div className="teacher-gradient-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Active Alerts</h2>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl ${
                      alert.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <alert.icon className={`h-5 w-5 mt-1 ${
                        alert.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div className="ml-3">
                        <h3 className={`font-medium ${
                          alert.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {alert.title}
                        </h3>
                        <p className="text-gray-600">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassroom;