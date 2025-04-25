import React, { useState } from 'react';
import Login from './components/auth/Login';
import StudentApp from './student/StudentApp';
import TeacherApp from './teacher/TeacherApp';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);

  const handleLogin = (role: 'student' | 'teacher') => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return userRole === 'teacher' ? (
    <TeacherApp onLogout={handleLogout} />
  ) : (
    <StudentApp onLogout={handleLogout} />
  );
}

export default App;