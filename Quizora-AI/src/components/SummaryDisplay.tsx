'use client';

interface SummaryDisplayProps {
  summary: string;
}

export default function SummaryDisplay({ summary }: SummaryDisplayProps) {
  if (!summary) return null;

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Study Summary
          </h2>
        </div>
        <div className="p-8 prose prose-slate max-w-none">
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
            {summary}
          </div>
        </div>
      </div>
    </div>
  );
}
