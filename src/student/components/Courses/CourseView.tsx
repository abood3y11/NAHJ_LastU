import React, { useState } from 'react';
import { CourseData } from '../../../types';
import { ArrowLeft, BookOpen, Clock, User, Calendar, Video, FileText, Users, Award, Brain, Target, Sparkles, ArrowRight, BookMarked, GraduationCap, Radio } from 'lucide-react';
import VirtualClassroom from './VirtualClassroom';

interface CourseViewProps {
  course: CourseData;
  onBack: () => void;
}

const CourseView: React.FC<CourseViewProps> = ({ course, onBack }) => {
  const [showLiveSession, setShowLiveSession] = useState(false);

  const modules = [
    { title: 'Introduction to Course', duration: '1h 30m', videos: 12, files: 3 },
    { title: 'Basic Concepts', duration: '2h 15m', videos: 8, files: 5 },
    { title: 'Advanced Topics', duration: '3h 45m', videos: 15, files: 7 },
    { title: 'Practical Applications', duration: '2h 30m', videos: 10, files: 4 }
  ];

  const stats = [
    { label: 'Students Enrolled', value: '1,234', icon: Users },
    { label: 'Video Content', value: '45 hours', icon: Video },
    { label: 'Course Materials', value: '19 files', icon: FileText },
    { label: 'Completion Rate', value: '92%', icon: Award }
  ];

  const learningPath = {
    prerequisites: [
      { title: 'Basic Mathematics', status: 'completed', icon: BookMarked },
      { title: 'Introduction to Programming', status: 'completed', icon: Brain },
      { title: 'Data Structures Fundamentals', status: 'recommended', icon: Target }
    ],
    objectives: [
      'Understanding core principles of algorithms',
      'Implementing efficient data structures',
      'Problem-solving techniques',
      'Advanced optimization methods'
    ],
    recommendedMaterials: [
      { title: 'Algorithm Visualization Guide', type: 'interactive', duration: '2h' },
      { title: 'Practice Problems Set', type: 'exercise', count: '25 problems' },
      { title: 'Video Tutorials Series', type: 'video', duration: '5h' }
    ]
  };

  const handleLeaveSession = () => {
    setShowLiveSession(false);
  };

  return (
    <div className="p-8">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-[#42bff5] mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Courses
      </button>

      <div className="glass-card rounded-2xl p-8 mb-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-4 gradient-text">{course.name}</h1>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{course.professor}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{course.schedule}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text mb-2">{course.progress}%</div>
            <p className="text-gray-600">Course Progress</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#42bff5] to-[#93e9f5] flex items-center justify-center text-white">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {!showLiveSession ? (
        <div className="glass-card rounded-2xl p-6 mb-8 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Live Session Available</h3>
                <p className="text-white/80">Join the ongoing class session with Prof. Sarah Johnson</p>
              </div>
            </div>
            <button 
              onClick={() => setShowLiveSession(true)}
              className="px-6 py-3 bg-white text-[#42bff5] rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Join Live Session
            </button>
          </div>
        </div>
      ) : (
        <VirtualClassroom onLeave={handleLeaveSession} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Course Content</h2>
          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={index} className="bg-white/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  <span className="text-[#42bff5]">{module.duration}</span>
                </div>
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    <span>{module.videos} videos</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>{module.files} files</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 px-4 rounded-lg border border-[#42bff5] text-[#42bff5] font-medium hover:bg-[#e1f3fa] transition-all duration-300">
                  Start Module
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Learning Path</h2>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#42bff5] to-[#93e9f5] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Prerequisites</h3>
            <div className="space-y-3">
              {learningPath.prerequisites.map((prereq, index) => (
                <div key={index} className="flex items-center p-3 bg-white/50 rounded-lg">
                  <div className={`w-8 h-8 rounded-lg ${prereq.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center mr-3`}>
                    <prereq.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1">{prereq.title}</span>
                  {prereq.status === 'completed' && (
                    <Award className="h-4 w-4 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Course Objectives</h3>
            <div className="space-y-3">
              {learningPath.objectives.map((objective, index) => (
                <div key={index} className="flex items-start p-3 bg-white/50 rounded-lg">
                  <Target className="h-4 w-4 text-[#42bff5] mt-1 mr-3 flex-shrink-0" />
                  <span className="text-sm">{objective}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Recommended Materials</h3>
            <div className="space-y-3">
              {learningPath.recommendedMaterials.map((material, index) => (
                <div key={index} className="group p-4 bg-white/50 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{material.title}</h4>
                    <ArrowRight className="h-4 w-4 text-[#42bff5] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span>{material.type === 'exercise' ? material.count : material.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;