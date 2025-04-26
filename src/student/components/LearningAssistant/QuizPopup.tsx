import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: {
    title: string;
    id: string;
    courseName: string;
  } | null;
}

interface AnswerResult {
  is_correct: boolean;
  score: number;
  feedback: string;
  question: string;
  answer: string;
  matched_keywords?: number;
  expected_keywords_count?: number;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ isOpen, onClose, lecture }) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [analyzingAnswers, setAnalyzingAnswers] = useState(false);

  useEffect(() => {
    if (isOpen && lecture) {
      fetchQuestions();
      // Reset state when reopening
      setAnswers([]);
      setResults([]);
      setOverallScore(null);
      setSubmitted(false);
    }
  }, [isOpen, lecture]);

  const fetchQuestions = async () => {
    if (!lecture) return;
    
    setIsLoading(true);
    setError(null);
    setSubmitted(false);
    
    try {
      console.log("Sending request with:", {
        lecture_title: lecture.title,
        course_name: lecture.courseName,
      });
      
      // First try the direct POST request
      let response;
      try {
        response = await fetch('http://localhost:8000/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            lecture_title: lecture.title,
            course_name: lecture.courseName,
          }),
        });
      } catch (fetchError) {
        console.error("Error with POST request:", fetchError);
        // If the POST fails, try the GET test endpoint as a fallback
        console.log("Falling back to test endpoint...");
        response = await fetch('http://localhost:8000/test-generate-quiz');
      }
      
      console.log("Raw response:", response);
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setResponseData(data); // Store the full response for debugging
      
      console.log("Response data:", data);
      
      // Handle both possible formats of the response
      let extractedQuestions;
      if (data.questions && Array.isArray(data.questions)) {
        extractedQuestions = data.questions;
      } else if (data.detail && data.detail.questions && Array.isArray(data.detail.questions)) {
        extractedQuestions = data.detail.questions;
      } else {
        console.error("Invalid questions format:", data);
        throw new Error('Invalid question format received: ' + JSON.stringify(data));
      }

      console.log("Extracted questions:", extractedQuestions);
      
      setQuestions(extractedQuestions);
      setAnswers(Array(extractedQuestions.length).fill(''));
      
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(
        err instanceof Error ? 
        err.message : 
        'Failed to generate questions. Please try again later.'
      );
      
      // Fallback questions if fetch fails
      const fallbackQuestions = [
        "What are the fundamental concepts covered in this lecture?",
        "How do these concepts relate to real-world applications?",
        "Can you explain the key methodologies discussed?",
        "What are the main challenges in implementing these concepts?",
        "How does this topic connect with other areas of the course?"
      ];
      setQuestions(fallbackQuestions);
      setAnswers(Array(fallbackQuestions.length).fill(''));
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeAnswers = async () => {
    if (!lecture || questions.length === 0) return;
    
    setAnalyzingAnswers(true);
    
    try {
      console.log("Analyzing answers for:", {
        lecture_title: lecture.title,
        course_name: lecture.courseName,
        questions: questions,
        answers: answers
      });
      
      const response = await fetch('http://localhost:8000/analyze-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          lecture_title: lecture.title,
          course_name: lecture.courseName,
          questions: questions,
          answers: answers
        }),
      });
      
      console.log("Analysis response:", response);
      
      if (!response.ok) {
        throw new Error(`Analysis request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Analysis data:", data);
      
      if (data.status === 'success' && Array.isArray(data.results)) {
        setResults(data.results);
        setOverallScore(data.overall_score || 0);
        setSubmitted(true);
      } else {
        throw new Error('Invalid response format from analysis endpoint');
      }
      
    } catch (err) {
      console.error('Error analyzing answers:', err);
      // Create fallback results if the analysis fails
      const fallbackResults = answers.map((answer, index) => ({
        is_correct: answer.length > 50, // Simple fallback - consider answers over 50 chars as correct
        score: answer.length > 50 ? 70 : 30,
        feedback: answer.length > 50 
          ? "Your answer seems reasonable, but couldn't be fully analyzed." 
          : "Your answer may be too brief. Consider providing more details.",
        question: questions[index],
        answer: answer
      }));
      
      setResults(fallbackResults);
      const correctCount = fallbackResults.filter(r => r.is_correct).length;
      setOverallScore((correctCount / fallbackResults.length) * 100);
      setSubmitted(true);
    } finally {
      setAnalyzingAnswers(false);
    }
  };

  const handleSubmit = async () => {
    await analyzeAnswers();
  };

  const testDirectFetch = async () => {
    try {
      setIsLoading(true);
      const testData = {
        lecture_title: "Test Lecture",
        course_name: "Test Course"
      };
      
      console.log("TEST: Sending request with:", testData);
      
      const response = await fetch('http://localhost:8000/test-generate-quiz');
      console.log("TEST: Raw response:", response);
      
      const data = await response.json();
      console.log("TEST: Response data:", data);
      
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(''));
        console.log("TEST: Questions set successfully");
      }
    } catch (err) {
      console.error("TEST: Error during test fetch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to restart the quiz
  const handleRetake = () => {
    setResults([]);
    setOverallScore(null);
    setSubmitted(false);
    setAnswers(Array(questions.length).fill(''));
  };

  // Get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Get text color based on score
  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-blue-700';
    if (score >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  if (!isOpen || !lecture) return null;

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
            disabled={isLoading || analyzingAnswers}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          
          <h2 className="text-2xl font-bold gradient-text">Knowledge Assessment</h2>
          <p className="text-gray-600 mt-2">
            {lecture.title} - {lecture.courseName}
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              <p className="font-medium">Error:</p>
              <p className="text-sm mt-1">{error}</p>
              
              {/* Debug info - can be removed in production */}
              <details className="mt-2 text-xs">
                <summary>Debug Info</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </details>
            </div>
          )}
          
          {submitted && overallScore !== null && (
            <div className={`mt-4 p-4 rounded-lg ${getScoreBgColor(overallScore)}`}>
              <h3 className={`text-lg font-bold ${getScoreTextColor(overallScore)}`}>
                Overall Score: {Math.round(overallScore)}%
              </h3>
              <p className="text-gray-700 mt-1">
                {overallScore >= 80 ? 'Excellent understanding of the material!' : 
                 overallScore >= 60 ? 'Good understanding, but some room for improvement.' :
                 overallScore >= 40 ? 'You should review this material more carefully.' :
                 'You need to spend more time studying this topic.'}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading || analyzingAnswers ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#42bff5]"></div>
              <span className="mt-4">
                {isLoading ? 'Generating questions...' : 'Analyzing your answers...'}
              </span>
              <p className="text-gray-500 text-sm mt-2">This may take up to 30 seconds</p>
            </div>
          ) : (
            <div className="space-y-8">
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-lg bg-[#42bff5]/10 flex items-center justify-center text-[#42bff5] font-medium mr-4 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-lg font-medium text-gray-800">{question}</p>
                    </div>
                    <div className="ml-12">
                      <textarea
                        value={answers[index] || ''}
                        onChange={(e) => {
                          if (!submitted) { // Only allow edits if not submitted
                            const newAnswers = [...answers];
                            newAnswers[index] = e.target.value;
                            setAnswers(newAnswers);
                          }
                        }}
                        placeholder="Type your answer here..."
                        className={`w-full h-32 p-4 border ${
                          submitted 
                            ? results[index]?.is_correct 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-red-300 bg-red-50'
                            : 'border-gray-200'
                        } rounded-xl focus:ring-2 focus:ring-[#42bff5] focus:border-transparent transition-all duration-300 resize-none`}
                        disabled={submitted}
                      />
                      
                      {/* Feedback after submission */}
                      {submitted && results[index] && (
                        <div className={`mt-2 p-3 rounded-lg ${
                          results[index].is_correct ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <div className="flex items-center">
                            {results[index].is_correct ? (
                              <CheckCircle2 className="h-5 w-5 text-green-700 mr-2" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-700 mr-2" />
                            )}
                            <span className={`font-medium ${
                              results[index].is_correct ? 'text-green-700' : 'text-red-700'
                            }`}>
                              Score: {results[index].score}%
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">{results[index].feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                !isLoading && !error && (
                  <div className="text-center py-8 text-gray-500">
                    No questions available for this lecture. Click "Generate Questions" to create some.
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between space-x-4">
            <div>
              {/* <button 
                onClick={testDirectFetch}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Test Connection
              </button> */}
            </div>
            <div className="flex space-x-4">
            <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading || analyzingAnswers}
              >
                Close
              </button>
              {submitted ? (
                <button
                  onClick={handleRetake}
                  className="px-8 py-2 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50">
                  Retake Quiz
                </button>
              ) : (
                <button 
                  onClick={fetchQuestions}
                  disabled={isLoading || analyzingAnswers}
                  className="px-8 py-2 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50">
                  {isLoading ? 'Generating...' : 'Generate Questions'}
                </button>
              )}
              
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || analyzingAnswers || questions.length === 0 || answers.every(a => !a.trim())}
                  className="px-8 py-2 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {analyzingAnswers ? 'Analyzing...' : 'Submit Answers'}
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-8 py-2 bg-gradient-to-r from-[#42bff5] to-[#93e9f5] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;