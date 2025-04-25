import React from 'react';
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Schedule: React.FC = () => {
  const classes = [
    {
      id: 1,
      title: 'Advanced Calculus',
      time: '10:00 AM - 11:30 AM',
      location: 'Room 301',
      students: 45,
      status: 'ongoing'
    },
    {
      id: 2,
      title: 'Linear Algebra',
      time: '1:30 PM - 3:00 PM',
      location: 'Room 205',
      students: 38,
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Numerical Methods',
      time: '3:45 PM - 5:15 PM',
      location: 'Room 401',
      students: 52,
      status: 'upcoming'
    }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold teacher-gradient-text">Class Schedule</h2>
          <p className="text-gray-600">Manage your daily teaching schedule</p>
        </div>
        <button className="px-4 py-2 teacher-gradient-primary rounded-lg hover:shadow-lg transition-all duration-300 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="teacher-gradient-card rounded-xl p-6">
            <div className="space-y-6">
              {classes.map((class_) => (
                <div
                  key={class_.id}
                  className={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${
                    class_.status === 'ongoing'
                      ? 'bg-blue-50 border-l-4 border-[#0359a8]'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{class_.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-5 w-5 mr-2" />
                          <span>{class_.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span>{class_.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-5 w-5 mr-2" />
                          <span>{class_.students} Students</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      {class_.status === 'ongoing' ? (
                        <button className="px-4 py-2 teacher-gradient-primary rounded-lg hover:shadow-lg transition-all duration-300">
                          Join Class
                        </button>
                      ) : (
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="teacher-gradient-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Calendar</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="text-center">
                <p className="font-medium">March 2025</p>
                <p className="text-sm text-gray-500">Week 12</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            {/* Calendar grid would go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;