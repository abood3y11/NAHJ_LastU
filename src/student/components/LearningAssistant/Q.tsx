import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: {
    title: string;
    id: string;
  } | null;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ isOpen, onClose, lecture }) => {
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !lecture) return null;

  const questions = [
    "What are the fundamental concepts covered in this lecture?",
    "How do these concepts relate to real-world applications?",
    "Can you explain the key methodologies discussed?",
    "What are the main challenges in implementing these concepts?",
    "How does this topic connect with other areas of the course?"
  ];

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lectureId: lecture.id,
          answers: answers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      console.log('Quiz feedback:', data.feedback);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-gray-100">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          
          <h2 className="text-2xl font-bold gradient-text">Knowledge Assessment</h2>
          <p className="text-gray-600 mt-2">
            {lecture.title}
          </p>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-[#42bff5]/10 flex items-center justify-center text-[#42bff5] font-medium mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-lg font-medium text-gray-800">{question}</p>
                </div>
                <div className="ml-12">
                  <textarea
                    value={answers[index]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    placeholder="Type your answer here..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#42bff5] focus:border-transparent transition-all duration-300 resize-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Answers'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;