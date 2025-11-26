import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Configure PDF.js worker for Node.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';

export class StudyAgent {
  private model: any;

  constructor() {
    console.log('Environment variables:', {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Found' : 'Not found',
      NODE_ENV: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('GEMINI'))
    });
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using the same model as in the Python version
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite-preview-02-05' });
  }

  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const uint8Array = new Uint8Array(buffer);
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (e: any) {
      throw new Error(`Error reading PDF: ${e.message}`);
    }
  }

  async generateSummary(text: string): Promise<string> {
    const prompt = `
    You are an expert study assistant. Please provide a clean, meaningful summary of the following text.
    The summary should be structured and easy to read for students.
    
    Text:
    ${text.slice(0, 30000)}
    
    Summary:
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async generateQuiz(text: string, numQuestions: number = 5): Promise<any[]> {
    const prompt = `
    You are an expert study assistant. Create a quiz based on the following text.
    Generate ${numQuestions} multiple choice questions.
    Return the result ONLY as a valid JSON array of objects.
    Each object should have:
    - "question": string
    - "options": array of 4 strings
    - "answer": string (the correct option text)
    
    Do not include markdown formatting like \`\`\`json ... \`\`\`. Just the raw JSON string.

    Text:
    ${text.slice(0, 30000)}
    
    JSON:
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    let textResponse = response.text().trim();

    // Clean up potential markdown formatting
    if (textResponse.startsWith("```json")) {
      textResponse = textResponse.slice(7);
    }
    if (textResponse.startsWith("```")) {
      textResponse = textResponse.slice(3);
    }
    if (textResponse.endsWith("```")) {
      textResponse = textResponse.slice(0, -3);
    }

    try {
      return JSON.parse(textResponse);
    } catch (e) {
      console.error("Failed to parse quiz JSON", textResponse);
      return [{ question: "Error parsing quiz", options: [], answer: "" }];
    }
  }
}
