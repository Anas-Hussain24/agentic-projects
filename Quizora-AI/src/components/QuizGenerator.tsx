'use client';

import { useState } from 'react';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizGeneratorProps {
  onGenerateQuiz: () => void;
  isLoading: boolean;
  quizData: Question[] | null;
}

export default function QuizGenerator({ onGenerateQuiz, isLoading, quizData }: QuizGeneratorProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (showResults) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let score = 0;
    quizData.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) score++;
    });
    return score;
  };

  if (!quizData) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 text-center">
        <button
          onClick={onGenerateQuiz}
          disabled={isLoading}
          className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-200 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Quiz...
            </>
          ) : (
            <>
              <span className="mr-2">✨</span> Generate Quiz from Notes
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Practice Quiz
          </h2>
          {showResults && (
            <div className="bg-white/20 px-4 py-1 rounded-full text-white font-bold backdrop-blur-sm">
              Score: {calculateScore()} / {quizData.length}
            </div>
          )}
        </div>
        
        <div className="p-8 space-y-8">
          {quizData.map((q, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 text-sm">
                  {idx + 1}
                </span>
                {q.question}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                {q.options.map((option, optIdx) => {
                  let className = "p-4 rounded-xl border-2 text-left transition-all duration-200 ";
                  
                  if (showResults) {
                    if (option === q.answer) {
                      className += "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium";
                    } else if (userAnswers[idx] === option) {
                      className += "bg-red-50 border-red-500 text-red-700";
                    } else {
                      className += "border-slate-100 text-slate-400 opacity-60";
                    }
                  } else {
                    if (userAnswers[idx] === option) {
                      className += "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm";
                    } else {
                      className += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(idx, option)}
                      className={className}
                      disabled={showResults}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(userAnswers).length !== quizData.length}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              Check Answers
            </button>
          ) : (
            <button
              onClick={() => {
                setShowResults(false);
                setUserAnswers({});
                onGenerateQuiz();
              }}
              className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Generate New Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
