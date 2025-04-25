import React from 'react';
import { Users, BookOpen, ChevronRight, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TeacherDashboard: React.FC = () => {
  const stats = [
    { title: 'Homeworks and Project', value: '23', icon: BookOpen },
    { title: 'Exams', value: '12', icon: TrendingUp },
    { title: 'Students', value: '321', icon: Users },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'This year',
        data: [45, 42, 45, 48, 55, 53, 55],
        borderColor: '#0359a8',
        backgroundColor: '#0359a8',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Last year',
        data: [40, 38, 40, 42, 45, 48, 50],
        borderColor: '#E2E8F0',
        backgroundColor: '#E2E8F0',
        tension: 0.4,
        borderDash: [5, 5],
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 65,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const schedule = [
    {
      title: 'Advanced Calculus',
      time: '10:00 AM - Room 301',
      status: 'Now'
    },
    {
      title: 'Linear Algebra',
      time: '1:30 PM - Room 205',
      status: 'Next'
    },
    {
      title: 'Numerical Methods',
      time: '3:45 PM - Room 401',
      status: ''
    }
  ];

  const attentionAreas = [
    {
      subject: 'Complex Integration',
      percentage: '32% students struggling'
    },
    {
      subject: 'Vector Calculus',
      percentage: '28% students struggling'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold teacher-gradient-text mb-2">
          Hi Prof. Ahmed <span className="text-black">👋</span>
        </h1>
        <p className="text-gray-600">
          Nice to have you back, what an exciting day!<br />
          Get ready and continue your lesson.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="teacher-gradient-card rounded-2xl p-6 hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">{stat.title}</p>
                <p className="text-2xl font-bold teacher-gradient-text">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-xl teacher-gradient-primary flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="teacher-gradient-card rounded-2xl p-6">
            <div className="flex gap-4 mb-6">
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 teacher-card-hover rounded-lg">
                Total Student
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 teacher-card-hover rounded-lg">
                Total Courses
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 teacher-card-hover rounded-lg">
                Status
              </button>
            </div>
            <div className="h-[300px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="teacher-gradient-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Performance</h3>
                <select className="text-sm bg-transparent border border-gray-200 rounded-lg px-2 py-1">
                  <option>Monthly</option>
                </select>
              </div>
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold teacher-gradient-text">35.4%</p>
                      <p className="text-sm text-gray-500">Performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="teacher-gradient-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-6">Areas Needing Attention</h3>
              <div className="space-y-4">
                {attentionAreas.map((area, index) => (
                  <div key={index} className="bg-red-50 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-all duration-300">
                    <div>
                      <p className="font-medium">{area.subject}</p>
                      <p className="text-sm text-gray-600">{area.percentage}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="teacher-gradient-card rounded-2xl p-6">
          <div className="mb-8">
            <button className="w-full teacher-gradient-primary rounded-lg py-3 px-4 flex items-center justify-center hover:shadow-lg transition-all duration-300">
              Display your Schedule
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
            <button className="w-full mt-4 border border-gray-200 rounded-lg py-3 px-4 text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-all duration-300">
              Add new activity for today!
              <span className="ml-2">+</span>
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{item.title}</p>
                    {item.status && (
                      <span className={`text-sm ${item.status === 'Now' ? 'text-blue-600' : 'text-gray-600'}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;