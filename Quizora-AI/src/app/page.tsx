'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import SummaryDisplay from '@/components/SummaryDisplay';
import QuizGenerator from '@/components/QuizGenerator';

export default function Home() {
  const [summary, setSummary] = useState<string>('');
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setCurrentFile(file);
    setSummary('');
    setQuizData(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'summary');

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.data);
      } else {
        setError(data.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError('An error occurred while processing the file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!currentFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', currentFile);
    formData.append('mode', 'quiz');

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setQuizData(data.data);
      } else {
        setError(data.error || 'Failed to generate quiz');
      }
    } catch (err) {
      setError('An error occurred while generating the quiz');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-4 tracking-tight">
            Study Notes AI
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your study notes (PDF) and let our AI summarize them and create practice quizzes for you instantly.
          </p>
        </div>

        <FileUpload onUpload={handleFileUpload} isLoading={loading && !summary && !quizData} />

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="space-y-12">
          {summary && <SummaryDisplay summary={summary} />}
          
          {summary && (
            <QuizGenerator 
              onGenerateQuiz={handleGenerateQuiz} 
              isLoading={loading && !!summary} 
              quizData={quizData} 
            />
          )}
        </div>
      </div>
    </main>
  );
}
