'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-slate-500 font-medium">Processing your PDF...</p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-4 bg-indigo-50 rounded-full text-indigo-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="mb-2 text-lg text-slate-700 font-semibold">
                <span className="text-indigo-600 cursor-pointer hover:underline" onClick={onButtonClick}>Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-slate-500">PDF files only (max 10MB)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
