import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'Meeting' | 'Lecture' | 'Discussion' | 'Design Review' | 'New Deals';
  startTime: string;
  endTime: string;
  day: number;
}

interface Activity {
  id: string;
  title: string;
  time: string;
  icon: string;
}

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Monthly' | 'Weekly' | 'Daily'>('Monthly');

  const activities: Activity[] = [
    { id: '1', title: 'Homework grading', time: 'Just now', icon: '📚' },
    { id: '2', title: 'Meeting on Math151', time: '39 minutes ago', icon: '👥' },
    { id: '3', title: 'Quiz released', time: '12 hours ago', icon: '📝' },
    { id: '4', title: 'Students analytics', time: 'Today, 11:59 AM', icon: '📊' },
    { id: '5', title: 'Midterm need grading', time: 'Feb 2, 2025', icon: '✍️' },
  ];

  const events: Event[] = [
    { id: '1', title: 'Design Review', type: 'Design Review', startTime: '09:00', endTime: '10:00', day: 3 },
    { id: '2', title: 'Calculus Lecture', type: 'Lecture', startTime: '10:00', endTime: '11:00', day: 9 },
    { id: '3', title: 'Group Discussion', type: 'Discussion', startTime: '11:30', endTime: '12:30', day: 9 },
    { id: '4', title: 'Market Research', type: 'Meeting', startTime: '14:00', endTime: '15:00', day: 15 },
    { id: '5', title: 'Physics Lab', type: 'Lecture', startTime: '09:30', endTime: '11:00', day: 18 },
    { id: '6', title: 'Team Meeting', type: 'Meeting', startTime: '13:00', endTime: '14:00', day: 22 },
    { id: '7', title: 'Chemistry Lab', type: 'Lecture', startTime: '15:00', endTime: '16:30', day: 25 },
    { id: '8', title: 'Project Review', type: 'Design Review', startTime: '10:00', endTime: '11:00', day: 28 }
  ];

  const getEventColor = (type: Event['type']) => {
    const colors = {
      'Meeting': 'bg-green-100 text-green-700',
      'Lecture': 'bg-red-100 text-red-700',
      'Discussion': 'bg-purple-100 text-purple-700',
      'Design Review': 'bg-pink-100 text-pink-700',
      'New Deals': 'bg-orange-100 text-orange-700',
    };
    return colors[type];
  };

  const daysInMonth = Array.from({ length: 35 }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const getEventsForDay = (day: number) => {
    return events.filter(event => event.day === day);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold gradient-text">Calendar</h2>
          <div className="flex bg-white rounded-lg overflow-hidden shadow-sm">
            {['Monthly', 'Weekly', 'Daily'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-[#42bff5] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 text-sm text-white bg-gradient-to-r from-[#42bff5] to-[#93e9f5] rounded-lg shadow-sm hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">September 2023</h3>
                <span className="px-3 py-1 text-sm bg-gradient-to-br from-[#edf3f5] to-[#e1f3fa] text-[#42bff5] rounded-full">
                  week 12
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <div
                    key={day}
                    className="aspect-square p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300"
                  >
                    <div className="text-sm font-medium mb-2">{day}</div>
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded-md ${getEventColor(event.type)} truncate`}
                          title={`${event.title} (${event.startTime} - ${event.endTime})`}
                        >
                          {event.title}
                          <div className="text-[10px] opacity-75">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-80">
          <div className="glass-card rounded-2xl p-6 h-full">
            <h3 className="text-lg font-semibold mb-6">Activities</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#edf3f5] to-[#e1f3fa] rounded-lg flex items-center justify-center text-lg mr-3">
                    {activity.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{activity.title}</h4>
                    <p className="text-sm text-gray-500">{activity.time}</p>
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

export default Schedule;