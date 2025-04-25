import React from 'react';
import { Search, Filter, Download, ArrowUp, ArrowDown, Plus } from 'lucide-react';

const Grades: React.FC = () => {
  const grades = [
    {
      id: 1,
      student: 'Emma Thompson',
      course: 'Advanced Mathematics',
      midterm: 92,
      final: 88,
      assignments: 95,
      overall: 'A',
      trend: 'up'
    },
    {
      id: 2,
      student: 'James Wilson',
      course: 'Linear Algebra',
      midterm: 85,
      final: 78,
      assignments: 88,
      overall: 'B+',
      trend: 'down'
    },
    {
      id: 3,
      student: 'Sophie Chen',
      course: 'Calculus II',
      midterm: 96,
      final: 94,
      assignments: 98,
      overall: 'A+',
      trend: 'up'
    }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold teacher-gradient-text">Grade Book</h2>
          <p className="text-gray-600">Manage and track student grades</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center transition-all duration-300">
            <Download className="h-5 w-5 mr-2" />
            Export Grades
          </button>
          <button className="px-4 py-2 teacher-gradient-primary rounded-lg hover:shadow-lg transition-all duration-300 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Grade
          </button>
        </div>
      </div>

      <div className="teacher-gradient-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0359a8] focus:border-transparent transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center transition-all duration-300">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Course</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Midterm</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Final</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Assignments</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Overall Grade</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{grade.student}</td>
                  <td className="px-6 py-4 text-gray-600">{grade.course}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-[#0359a8] rounded-full">
                      {grade.midterm}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full">
                      {grade.final}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                      {grade.assignments}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#0359a8] to-[#0284c7] text-white rounded-full">
                      {grade.overall}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {grade.trend === 'up' ? (
                      <div className="flex items-center text-emerald-600">
                        <ArrowUp className="h-5 w-5 mr-1" />
                        <span className="text-sm">Improving</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <ArrowDown className="h-5 w-5 mr-1" />
                        <span className="text-sm">Needs Help</span>
                      </div>
                    )}
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

export default Grades;