import { User, Task, Statistic, DashboardCard, CourseData, UpcomingLesson, EnrolledClass } from '../types';

export const teacherUser: User = {
  id: '1',
  name: 'Prof. Ahmed Ahmed',
  avatar: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg',
  department: 'Mathematics Department'
};

export const user: User = {
  id: '2',
  name: 'Sara Ahmed',
  avatar: 'https://cdn-icons-png.freepik.com/256/15675/15675890.png?ga=GA1.1.753586237.1736350067&semt=ais_hybrid',
  department: 'Mathematics Department'
};

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Math244 Homework',
    subject: 'Mathematics',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    completed: false
  },
  {
    id: '2',
    title: 'Quiz on calculator algebra',
    subject: 'Mathematics',
    startTime: '03:00 PM',
    endTime: '03:30 PM',
    completed: false
  },
  {
    id: '3',
    title: 'Midterm Math116',
    subject: 'Mathematics',
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    completed: false
  },
  {
    id: '4',
    title: 'Physics Lab Report',
    subject: 'Physics',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    completed: true
  },
  {
    id: '5',
    title: 'Chemistry Quiz',
    subject: 'Chemistry',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    completed: true
  }
];

export const statistics: Statistic[] = [
  {
    label: 'Absence',
    value: 90,
    icon: 'user',
    color: 'bg-blue-500'
  },
  {
    label: 'Tasks & Exam',
    value: 70,
    icon: 'clipboard-list',
    color: 'bg-green-500'
  },
  {
    label: 'Goals',
    value: 85,
    icon: 'target',
    color: 'bg-amber-500'
  }
];

export const dashboardCards: DashboardCard[] = [
  {
    id: '1',
    title: 'Expected Graduate',
    value: '2027 May',
    icon: 'graduation-cap',
    color: 'bg-blue-100'
  },
  {
    id: '2',
    title: 'Current Courses',
    value: 7,
    icon: 'book-open',
    color: 'bg-emerald-100'
  },
  {
    id: '3',
    title: 'Processing Tasks',
    value: 11,
    icon: 'hourglass',
    color: 'bg-purple-100'
  },
  {
    id: '4',
    title: 'Completed Courses',
    value: 27,
    icon: 'check-circle',
    color: 'bg-rose-100'
  },
  {
    id: '5',
    title: 'Total Tasks',
    value: 17,
    icon: 'list-checks',
    color: 'bg-amber-100'
  },
  {
    id: '6',
    title: 'Study Hours',
    value: '156h',
    icon: 'book-open',
    color: 'bg-cyan-100'
  }
];

export const monthlyStudyData = [
  { month: 'Jan', study: 45, test: 25 },
  { month: 'Feb', study: 38, test: 22 },
  { month: 'Mar', study: 52, test: 18 },
  { month: 'Apr', study: 42, test: 30 },
  { month: 'May', study: 28, test: 15 }
];

export const courses: CourseData[] = [
  {
    id: '1',
    name: 'CS101',
    professor: 'Dr. Sarah Johnson',
    schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
    progress: 75,
    description: 'Deep dive into advanced data structures and their applications in modern software development.',
    prerequisites: ['Basic Programming', 'Algorithms Fundamentals'],
    objectives: [
      'Master complex data structures',
      'Analyze algorithmic complexity',
      'Implement efficient solutions',
      'Optimize code performance'
    ],
    duration: '16 weeks',
    credits: 4
  },
  {
    id: '2',
    name: 'ENG203',
    professor: 'Dr. Michael Chen',
    schedule: 'Tue, Thu 2:00 PM - 3:30 PM',
    progress: 60,
    description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
    prerequisites: ['Statistics', 'Python Programming'],
    objectives: [
      'Understand ML algorithms',
      'Implement neural networks',
      'Process and analyze data',
      'Build ML models'
    ],
    duration: '14 weeks',
    credits: 4
  },
  {
    id: '3',
    name: 'MATH202',
    professor: 'Prof. Emily Rodriguez',
    schedule: 'Mon, Wed, Fri 1:00 PM - 2:30 PM',
    progress: 85,
    description: 'Advanced concepts in modern web development including frontend and backend technologies.',
    prerequisites: ['HTML/CSS', 'JavaScript Basics'],
    objectives: [
      'Master modern frameworks',
      'Build scalable applications',
      'Implement security best practices',
      'Deploy cloud solutions'
    ],
    duration: '12 weeks',
    credits: 3
  },
  {
    id: '4',
    name: 'BUS110',
    professor: 'Dr. James Wilson',
    schedule: 'Tue, Thu 11:00 AM - 12:30 PM',
    progress: 45,
    description: 'Comprehensive study of cloud computing principles, services, and architectural patterns.',
    prerequisites: ['Networking Basics', 'System Administration'],
    objectives: [
      'Design cloud solutions',
      'Implement microservices',
      'Manage cloud security',
      'Optimize cloud costs'
    ],
    duration: '15 weeks',
    credits: 4
  },
  {
    id: '5',
    name: 'PHYS101',
    professor: 'Dr. Lisa Martinez',
    schedule: 'Wed, Fri 3:00 PM - 4:30 PM',
    progress: 90,
    description: 'Exploring ethical considerations and implications of AI in modern society.',
    prerequisites: ['AI Fundamentals', 'Philosophy 101'],
    objectives: [
      'Analyze ethical dilemmas',
      'Develop AI guidelines',
      'Assess societal impact',
      'Create ethical frameworks'
    ],
    duration: '10 weeks',
    credits: 3
  },
  {
    id: '6',
    name: 'EE204',
    professor: 'Dr. Alex Thompson',
    schedule: 'Mon, Thu 9:00 AM - 10:30 AM',
    progress: 70,
    description: 'Introduction to cybersecurity principles, threats, and defense mechanisms.',
    prerequisites: ['Computer Networks', 'Operating Systems'],
    objectives: [
      'Understand security threats',
      'Implement defense strategies',
      'Conduct security audits',
      'Manage incidents'
    ],
    duration: '14 weeks',
    credits: 4
  }
];

export const enrolledClasses: EnrolledClass[] = [
  {
    id: '1',
    title: 'User Experience (UX) Design',
    duration: '5:30hrs',
    lessons: 5,
    hasAssignments: true,
    icon: '👨‍💻'
  },
  {
    id: '2',
    title: 'Visual Design and Branding',
    duration: '4:00hrs',
    lessons: 3,
    hasAssignments: true,
    icon: '🎨'
  }
];

export const upcomingLessons: UpcomingLesson[] = [
  {
    id: '1',
    title: 'UX Design Fundamentals',
    time: '5:30pm',
    icon: '🎓'
  },
  {
    id: '2',
    title: 'Interaction Design',
    time: '9:00pm',
    icon: '⚡'
  }
];