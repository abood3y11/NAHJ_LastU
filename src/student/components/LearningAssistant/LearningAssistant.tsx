import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, MessageSquare, Send, ArrowLeft, Sparkles, Target, BarChart as ChartBar, Route, BookMarked } from 'lucide-react';
import QuizPopup from './QuizPopup';

interface Course {
  id: string;
  name: string;
  description: string;
  lectures: Lecture[];
}

interface Lecture {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

const LearningAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([
    { type: 'ai', content: 'Hello! I\'m your AI learning assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCourseButtons, setShowCourseButtons] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showLectures, setShowLectures] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    fetch('/backend/json/lectures.json')
      .then(response => response.json())
      .then(data => {
        const lecturesData = data.lectures;
        
        fetch('/backend/json/courses.json')
          .then(response => response.json())
          .then(coursesData => {
            const enhancedCourses = coursesData.courses.map((course: any) => ({
              ...course,
              lectures: lecturesData.filter((lecture: any) => lecture.courseId === course.id)
            }));
            setCourses(enhancedCourses);
          });
      });
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');
    
    if (input.toLowerCase().includes('skill gap') || input.toLowerCase().includes('gaps')) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'I can help you identify skill gaps in your courses. Which course would you like me to analyze?' 
        }]);
        setShowCourseButtons(true);
        setShowLectures(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'I understand your question. Let me help you with that...' 
        }]);
      }, 1000);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseButtons(false);
    setShowLectures(true);
    setMessages(prev => [...prev, 
      { type: 'user', content: `I want to analyze ${course.name}` },
      { type: 'ai', content: `I'll analyze your performance in ${course.name}. Please select a specific lecture to focus on:` }
    ]);
  };

  const handleLectureSelect = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setShowLectures(false);
    setShowQuiz(true);
    setMessages(prev => [...prev,
      { type: 'user', content: `I want to focus on ${lecture.title}` },
      { type: 'ai', content: `Great choice! Let's assess your knowledge of ${lecture.title}. I'll generate a quiz to help identify any gaps in understanding.` }
    ]);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setMessages(prev => [...prev,
      { type: 'ai', content: "Thank you for completing the assessment. I'll analyze your answers and provide personalized recommendations." }
    ]);
  };

  const suggestions = [
    "Identify skill gaps in my current courses",
    "Create a personalized learning path",
    "Recommend study materials",
    "Track my progress"
  ];

  const features = [
    {
      icon: Target,
      title: "Skill Gap Detection",
      description: "Advanced analytics to identify and address your knowledge gaps",
      onClick: () => {
        setInput("I want to detect skill gaps in my courses");
        handleSend();
      }
    },
    {
      icon: ChartBar,
      title: "Content Matching & Recommendation",
      description: "Smart content suggestions tailored to your learning needs"
    },
    {
      icon: Route,
      title: "Path Personalization",
      description: "Customized learning paths adapted to your goals and progress"
    }
  ];

  const handleBack = () => {
    window.location.reload();
  };

  return (
    <div className="p-8">
      <button 
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-[#42bff5] mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">AI Learning Assistant</h2>
              <div className="flex items-center text-gray-600">
                <Sparkles className="h-5 w-5 mr-2 text-[#42bff5]" />
                <span>Powered by Advanced AI</span>
              </div>
            </div>

            <div className="h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white'
                          : 'bg-white shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}

                {showCourseButtons && (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseSelect(course)}
                        className="w-full p-4 rounded-xl bg-white hover:bg-[#42bff5]/10 text-left transition-colors duration-300"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-[#42bff5]/10 flex items-center justify-center mr-3">
                            <BookOpen className="h-5 w-5 text-[#42bff5]" />
                          </div>
                          <div>
                            <div className="font-medium">{course.name}</div>
                            <div className="text-sm text-gray-600">{course.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showLectures && selectedCourse && (
                  <div className="space-y-4">
                    {selectedCourse.lectures.map((lecture) => (
                      <button
                        key={lecture.id}
                        onClick={() => handleLectureSelect(lecture)}
                        className="w-full p-4 rounded-xl bg-white hover:bg-[#42bff5]/10 text-left transition-colors duration-300"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-[#42bff5]/10 flex items-center justify-center mr-3">
                            <BookMarked className="h-5 w-5 text-[#42bff5]" />
                          </div>
                          <div>
                            <div className="font-medium">{lecture.title}</div>
                            <div className="text-sm text-gray-600">
                              {lecture.date} | {lecture.time}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#42bff5] transition-all duration-300"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#42bff5] hover:bg-[#42bff5]/10 rounded-lg transition-colors duration-300"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Suggested Questions</h3>
            <div className="grid grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(suggestion);
                    handleSend();
                  }}
                  className="p-4 rounded-xl bg-white/50 hover:bg-[#42bff5]/10 text-left transition-colors duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={feature.onClick}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#42bff5] to-[#93e9f5] flex items-center justify-center text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold ml-4">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <QuizPopup
        isOpen={showQuiz}
        onClose={handleQuizClose}
        lecture={selectedLecture}
      />
    </div>
  );
};

export default LearningAssistant;