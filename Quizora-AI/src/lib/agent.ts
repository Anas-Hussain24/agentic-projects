import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from 'pdf-parse';

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
    // Using the official stable alias that works across all API key tiers
    this.model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  }

  /**
   * Retry helper with exponential backoff for rate limit errors
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        // Check if it's a rate limit error (429)
        const isRateLimit = error.status === 429 || 
                           error.message?.includes('429') ||
                           error.message?.includes('Resource exhausted');
        
        if (!isRateLimit || attempt === maxRetries - 1) {
          // If not a rate limit error or last attempt, throw immediately
          throw error;
        }
        
        // Calculate delay with exponential backoff
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdf(buffer);
      return data.text;
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

    try {
      return await this.retryWithBackoff(async () => {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      });
    } catch (error: any) {
      const isRateLimit = error.status === 429 || 
                         error.message?.includes('429') ||
                         error.message?.includes('Resource exhausted');
      
      if (isRateLimit) {
        throw new Error('API rate limit exceeded. Please try again in a few moments.');
      }
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
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

    try {
      return await this.retryWithBackoff(async () => {
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
      });
    } catch (error: any) {
      const isRateLimit = error.status === 429 || 
                         error.message?.includes('429') ||
                         error.message?.includes('Resource exhausted');
      
      if (isRateLimit) {
        throw new Error('API rate limit exceeded. Please try again in a few moments.');
      }
      throw new Error(`Failed to generate quiz: ${error.message}`);
    }
  }
}
