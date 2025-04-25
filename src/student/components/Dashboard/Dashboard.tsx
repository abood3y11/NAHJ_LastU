import React, { useEffect, useState } from 'react';
import WelcomeCard from './WelcomeCard';
import StatisticsCard from './StatisticsCard';
import LearningTimeCard from './LearningTimeCard';
import TasksCard from './TasksCard';
import UpcomingTasksCard from './UpcomingTasksCard';
import StudyHoursChart from './StudyHoursChart';
import DashboardCardItem from './DashboardCardItem';
import ActivityStats from './ActivityStats';
import { 
  user, 
  tasks, 
  statistics, 
  dashboardCards, 
  monthlyStudyData 
} from '../../../data/mockData';

const Dashboard: React.FC = () => {
  const [studentActivity, setStudentActivity] = useState(null);

  useEffect(() => {
    // In a real application, this would be an API call
    fetch('/backend/json/student_activity.json')
      .then(response => response.json())
      .then(data => {
        setStudentActivity(data.student_activities[0]);
      })
      .catch(error => console.error('Error fetching student activity:', error));
  }, []);

  if (!studentActivity) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 w-full">
        <div className="md:col-span-1">
          <WelcomeCard name="Sarah" />
        </div>
        <div className="flex gap-2 pt-6">
          <div className="flex-1">
            <LearningTimeCard hours={Math.floor(studentActivity.current_week_hours)} minutes={Math.round((studentActivity.current_week_hours % 1) * 60)} />
          </div>
          <div className="flex-1">
            <TasksCard count={21} />
          </div>
        </div>
      </div>
      
      <ActivityStats studentActivity={studentActivity} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-8">
        <StatisticsCard statistics={statistics} overallGrade={75} />
        <StudyHoursChart data={monthlyStudyData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <UpcomingTasksCard tasks={tasks} />
        </div>
        <div>
          <div className="glass-card rounded-2xl p-6 h-full hover-scale">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Quick Stats</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] rounded-full"></div>
            </div>
            <div className="space-y-4">
              {dashboardCards.map((card) => (
                <DashboardCardItem key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;