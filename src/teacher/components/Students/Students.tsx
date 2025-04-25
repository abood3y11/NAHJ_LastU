import React from 'react';
import { Search, Filter, Download, MoreVertical, Plus } from 'lucide-react';

const Students: React.FC = () => {
  const students = [
    {
      id: 1,
      name: 'Emma Thompson',
      email: 'emma.t@example.com',
      course: 'Advanced Mathematics',
      progress: 85,
      grade: 'A',
      avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg'
    },
    {
      id: 2,
      name: 'James Wilson',
      email: 'james.w@example.com',
      course: 'Linear Algebra',
      progress: 72,
      grade: 'B+',
      avatar: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg'
    },
    {
      id: 3,
      name: 'Sophie Chen',
      email: 'sophie.c@example.com',
      course: 'Calculus II',
      progress: 93,
      grade: 'A+',
      avatar: 'https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg'
    }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold teacher-gradient-text">Students</h2>
          <p className="text-gray-600">Manage and monitor student progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center transition-all duration-300">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 teacher-gradient-primary rounded-lg hover:shadow-lg transition-all duration-300 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Student
          </button>
        </div>
      </div>

      <div className="teacher-gradient-card rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center transition-all duration-300">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Course</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Progress</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Grade</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 text-gray-500">{student.course}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-[#0359a8] to-[#0284c7] h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-4 text-gray-500">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;