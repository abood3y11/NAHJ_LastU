import React from 'react';
import { Clock, BookOpen, Target, Award } from 'lucide-react';
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

interface ActivityStatsProps {
  studentActivity: {
    total_hours: number;
    current_week_hours: number;
    activity_metrics: {
      course_engagement: number;
      assignment_completion: number;
      attendance_rate: number;
      participation_score: number;
    };
    monthly_summary: Array<{
      month: string;
      total_hours: number;
      average_daily_hours: number;
    }>;
  };
}

const ActivityStats: React.FC<ActivityStatsProps> = ({ studentActivity }) => {
  const metrics = [
    {
      label: 'Course Engagement',
      value: studentActivity.activity_metrics.course_engagement,
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      label: 'Assignment Completion',
      value: studentActivity.activity_metrics.assignment_completion,
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      label: 'Attendance Rate',
      value: studentActivity.activity_metrics.attendance_rate,
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      label: 'Participation Score',
      value: studentActivity.activity_metrics.participation_score,
      icon: Award,
      color: 'bg-amber-500'
    }
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Study Hours',
        data: [45, 52, 49, 60, 55],
        borderColor: '#42bff5',
        backgroundColor: '#42bff5',
        tension: 0.4
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
        beginAtZero: true,
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="glass-card rounded-xl p-6 hover-scale">
            <div className="flex items-center mb-4">
              <div className={`${metric.color} p-3 rounded-xl text-white`}>
                <metric.icon className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">{metric.label}</h3>
              <p className="text-2xl font-bold gradient-text">{metric.value}%</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Study Hours Overview</h3>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Current Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Hours</span>
                <span className="font-medium">{studentActivity.total_hours}h</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#42bff5] to-[#93e9f5]"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Weekly Hours</span>
                <span className="font-medium">{studentActivity.current_week_hours}h</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#42bff5] to-[#93e9f5]"
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Daily Average</span>
                <span className="font-medium">
                  {studentActivity.monthly_summary[0].average_daily_hours}h
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#42bff5] to-[#93e9f5]"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;