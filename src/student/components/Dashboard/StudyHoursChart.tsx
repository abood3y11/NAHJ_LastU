import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StudyHoursChartProps {
  data: {
    month: string;
    study: number;
    test: number;
  }[];
}

const StudyHoursChart: React.FC<StudyHoursChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Study',
        data: data.map(item => item.study),
        backgroundColor: '#38c4f5',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Online Test',
        data: data.map(item => item.test),
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        padding: 12,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
    },
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover-scale">
      <h3 className="text-lg font-semibold mb-4 ">Hours Spent</h3>
      <div className="w-full h-56 relative">
        <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg">
          <Bar data={chartData} options={options} className="!rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default StudyHoursChart;