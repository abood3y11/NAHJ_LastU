import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, MessageSquare, Send, ArrowLeft, Sparkles, Target, BarChart as ChartBar, Route, BookMarked } from 'lucide-react';
import QuizPopup from './QuizPopup';
// import ContentRecommendations from './ContentRecommendations';
import SimpleFacialTracker from './SimpleFacialTracker';
import FacialAnalysisTracker from './FacialAnalysisTracker';

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
  courseId?: string; // Optional field to link back to course
}

interface Recommendation {
  title: string;
  type: string;
  sections: string[];
  outcomes: string[];
  estimated_time: string;
  relevance: string;
  priority: number;
}

// Track student engagement data
interface EngagementData {
  currentScore: number;
  dominantEmotion: string;
  timeline: Array<{
    timestamp: Date;
    emotion: string;
    score: number;
  }>;
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
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations'>('chat');
  const [engagementData, setEngagementData] = useState<EngagementData>({
    currentScore: 0,
    dominantEmotion: '',
    timeline: []
  });
  
  // Mock student data for recommendations
  const [studentData, setStudentData] = useState({
    name: "Alex Johnson",
    courseHistory: [
      {
        id: "CS101",
        name: "Introduction to Computer Science",
        completion_date: "2024-01-15",
        grade: "A-"
      },
      {
        id: "MATH202",
        name: "Linear Algebra",
        completion_date: "2024-02-20",
        grade: "B+"
      }
    ],
    assessmentData: [
      {
        assessment_id: "QUIZ1",
        course_id: "CS101",
        score: 85,
        topics: ["Programming Basics", "Algorithms"]
      },
      {
        assessment_id: "MIDTERM1",
        course_id: "MATH202",
        score: 78,
        topics: ["Matrix Operations", "Vector Spaces"]
      }
    ],
    currentCourse: {
      id: "DS303",
      name: "Introduction to Data Science",
      current_topics: ["Python Basics", "Data Cleaning", "Exploratory Analysis"]
    }
  });

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
    } else if (input.toLowerCase().includes('content') || input.toLowerCase().includes('recommend') || input.toLowerCase().includes('matching')) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: 'I can provide personalized content recommendations based on your learning patterns. Would you like to see recommendations for your current courses?' 
        }]);
        // Show recommendations tab
        setActiveTab('recommendations');
        setShowRecommendations(true);
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
    
    // Update student data with selected course
    setStudentData(prev => ({
      ...prev,
      currentCourse: {
        id: course.id,
        name: course.name,
        current_topics: ["Course Overview", "Key Concepts", "Fundamentals"]
      }
    }));
  };

  const handleLectureSelect = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setShowLectures(false);
    setLoadingQuiz(true);
    
    // Add the course name to the lecture object for use in the quiz
    const lectureWithCourse = {
      ...lecture,
      courseName: selectedCourse?.name || ""
    };
    
    setMessages(prev => [...prev,
      { type: 'user', content: `I want to focus on ${lecture.title}` },
      { type: 'ai', content: `Great choice! Let's assess your knowledge of ${lecture.title}. I'll generate a quiz to help identify any gaps in understanding.` }
    ]);
    
    // Update student data with selected lecture topics
    setStudentData(prev => ({
      ...prev,
      currentCourse: {
        ...prev.currentCourse,
        current_topics: [lecture.title, "Key Concepts", "Application"]
      }
    }));
    
    // Show quiz after a short delay to simulate fetching questions
    setTimeout(() => {
      setLoadingQuiz(false);
      setShowQuiz(true);
    }, 1000);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setMessages(prev => [...prev,
      { type: 'ai', content: "Thank you for completing the assessment. I'll analyze your answers and provide personalized recommendations." }
    ]);
    
    // After quiz is completed, show content recommendations
    setActiveTab('recommendations');
    setShowRecommendations(true);
  };
  
  const handleRecommendationSelect = (recommendation: Recommendation) => {
    // Switch back to chat tab and add messages about the selected recommendation
    setActiveTab('chat');
    setMessages(prev => [...prev,
      { type: 'user', content: `Tell me more about "${recommendation.title}"` },
      { type: 'ai', content: `"${recommendation.title}" is a ${recommendation.type} that covers ${recommendation.sections.join(", ")}. It will help you ${recommendation.outcomes.join(" and ")}. This is particularly relevant for you because ${recommendation.relevance}. Would you like me to help you access this content?` }
    ]);
  };

  const suggestions = [
    "Identify skill gaps in my current courses",
    "Find personalized content recommendations",
    "Create a customized learning path",
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
      description: "Smart content suggestions tailored to your learning needs",
      onClick: () => {
        setInput("Recommend content for me");
        handleSend();
      }
    },
    {
      icon: Route,
      title: "Path Personalization",
      description: "Customized learning paths adapted to your goals and progress",
      onClick: () => {
        setInput("Create a personalized learning path for me");
        handleSend();
      }
    }
  ];

  const handleBack = () => {
    window.location.reload();
  };

  // Handle emotion updates from the facial analysis tracker
  const handleEmotionDetected = (emotion: string) => {
    // Update AI messages based on detected emotions
    if (emotion === 'sleepy' && engagementData.currentScore < 30) {
      setMessages(prev => [...prev, 
        { type: 'ai', content: "I notice you seem a bit tired. Would you like to take a short break or switch to a more interactive learning activity?" }
      ]);
    } else if (emotion === 'focused' && faceRecords.length % 5 === 0) {
      // Positive reinforcement every 5 focused detections
      setMessages(prev => [...prev, 
        { type: 'ai', content: "Great focus! You're making excellent progress with this material." }
      ]);
    }
    
    // Update the engagement timeline
    setEngagementData(prev => ({
      ...prev,
      dominantEmotion: emotion,
      timeline: [...prev.timeline, {
        timestamp: new Date(),
        emotion: emotion,
        score: prev.currentScore
      }]
    }));
  };
  
  // Handle engagement score updates
  const handleEngagementUpdate = (score: number) => {
    const previousScore = engagementData.currentScore;
    
    setEngagementData(prev => ({
      ...prev,
      currentScore: score
    }));
    
    // Adapt content recommendations based on engagement level
    if (score < 40 && previousScore >= 40) {
      // Engagement dropped significantly
      setMessages(prev => [...prev, 
        { type: 'ai', content: "I've noticed your engagement has decreased. Would you like to try a different learning format or topic?" }
      ]);
    }
  };
  
  // Store face records for the session
  const [faceRecords, setFaceRecords] = useState<any[]>([]);

  // Tab navigation handler
  const handleTabChange = (tab: 'chat' | 'recommendations') => {
    setActiveTab(tab);
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
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange('chat')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-b-2 border-[#42bff5] text-[#42bff5]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </div>
            </button>
            <button
              onClick={() => handleTabChange('recommendations')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'recommendations'
                  ? 'border-b-2 border-[#42bff5] text-[#42bff5]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Recommendations
              </div>
            </button>
          </div>

          {/* Chat Tab Content */}
          {activeTab === 'chat' && (
            <>
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
                    
                    {loadingQuiz && (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#42bff5]"></div>
                        <span className="ml-3">Generating quiz questions...</span>
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
            </>
          )}
          
          {/* Recommendations Tab Content
          {activeTab === 'recommendations' && showRecommendations && studentData.currentCourse && (
            <ContentRecommendations 
              studentName={studentData.name}
              currentCourse={studentData.currentCourse}
              courseHistory={studentData.courseHistory}
              assessmentData={studentData.assessmentData}
              onSelect={handleRecommendationSelect}
            />
          )} */}
          <div>
              <SimpleFacialTracker
                onEmotionDetected={(emotion, confidence) => {
                  console.log(`Detected: ${emotion} (${confidence})`);
                }}
                captureInterval={20000}
              />
          </div>
          
          
          {/* Prompt to select a course if no course is selected */}
          {activeTab === 'recommendations' && !showRecommendations && (
            <div className="glass-card rounded-2xl p-10 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-[#42bff5] mb-4" />
              <h3 className="text-xl font-bold mb-2">No Recommendations Yet</h3>
              <p className="text-gray-600 mb-6">
                To get personalized content recommendations, please complete a skill gap assessment or select a course.
              </p>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  setInput("I want to detect skill gaps in my courses");
                  handleSend();
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white rounded-xl"
              >
                Start Skill Gap Assessment
              </button>
            </div>
          )}
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
      
      {/* Facial Analysis Tracker */}
      <FacialAnalysisTracker
        studentId={studentData.name}
        sessionId={selectedCourse ? selectedCourse.id : 'general-session'}
        captureInterval={20000} // 20 seconds
        onEmotionDetected={handleEmotionDetected}
        onEngagementUpdate={handleEngagementUpdate}
      />

      {/* Quiz Popup */}
      {selectedLecture && selectedCourse && (
        <QuizPopup
          isOpen={showQuiz}
          onClose={handleQuizClose}
          lecture={{
            title: selectedLecture.title,
            id: selectedLecture.id,
            courseName: selectedCourse.name
          }}
        />
      )}
    </div>
  );
};

export default LearningAssistant;