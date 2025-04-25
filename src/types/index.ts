export interface User {
  id: string;
  name: string;
  avatar: string;
  department: string;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  completed: boolean;
}

export interface Statistic {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export interface CourseData {
  id: string;
  name: string;
  professor: string;
  schedule: string;
  progress: number;
  description: string;
  prerequisites: string[];
  objectives: string[];
  duration: string;
  credits: number;
}

export interface UpcomingLesson {
  id: string;
  title: string;
  time: string;
  icon: string;
}

export interface EnrolledClass {
  id: string;
  title: string;
  duration: string;
  lessons: number;
  hasAssignments: boolean;
  icon: string;
}