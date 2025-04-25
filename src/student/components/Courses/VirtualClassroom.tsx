import React, { useState } from 'react';
import { Video, Mic, Users, MessageSquare, Share2, Settings, Radio } from 'lucide-react';

interface VirtualClassroomProps {
  onLeave?: () => void;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isTeacher: boolean;
  isSpeaking: boolean;
  hasCamera: boolean;
  hasMic: boolean;
}

const VirtualClassroom: React.FC<VirtualClassroomProps> = ({ onLeave }) => {
  const [isLive, setIsLive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const participants: Participant[] = [
    {
      id: '1',
      name: 'Prof. Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg',
      isTeacher: true,
      isSpeaking: true,
      hasCamera: true,
      hasMic: true
    },
    {
      id: '2',
      name: 'Emma Thompson',
      avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg',
      isTeacher: false,
      isSpeaking: false,
      hasCamera: true,
      hasMic: true
    },
    {
      id: '3',
      name: 'James Wilson',
      avatar: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg',
      isTeacher: false,
      isSpeaking: false,
      hasCamera: true,
      hasMic: false
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Live Session</h3>
          <p className="text-gray-600">Advanced Data Structures - Week 5</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-600">
            <Radio className="w-4 h-4 mr-1 animate-pulse" />
            Live Now
          </span>
          <div className="flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-[#42bff5]">
            <Users className="w-4 h-4 mr-1" />
            {participants.length} Participants
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {participants.map((participant) => (
          <div 
            key={participant.id} 
            className={`relative aspect-video rounded-xl overflow-hidden ${
              participant.isTeacher ? 'col-span-2' : ''
            }`}
          >
            <img 
              src={participant.avatar} 
              alt={participant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-white text-sm font-medium">{participant.name}</span>
                  {participant.isSpeaking && (
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {participant.hasMic && (
                    <Mic className="w-4 h-4 text-white" />
                  )}
                  {participant.hasCamera && (
                    <Video className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-lg transition-all duration-300 ${
              isVideoOn ? 'bg-[#42bff5] text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            <Video className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-lg transition-all duration-300 ${
              !isMuted ? 'bg-[#42bff5] text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg hover:bg-[#42bff5]/10 text-gray-600 transition-all duration-300">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg hover:bg-[#42bff5]/10 text-gray-600 transition-all duration-300">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        
        <button 
          onClick={onLeave}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
        >
          Leave Session
        </button>
      </div>
    </div>
  );
};

export default VirtualClassroom;