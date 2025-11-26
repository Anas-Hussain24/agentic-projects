import { NextRequest, NextResponse } from 'next/server';
import { StudyAgent } from '@/lib/agent';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const mode = formData.get('mode') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    if (!mode || !['summary', 'quiz'].includes(mode)) {
      return NextResponse.json({ success: false, error: 'Invalid mode' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const agent = new StudyAgent();
    
    // Extract text
    const text = await agent.extractTextFromPdf(buffer);

    let result;
    if (mode === 'summary') {
      result = await agent.generateSummary(text);
    } else if (mode === 'quiz') {
      result = await agent.generateQuiz(text);
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error('API Error:', error);
    
    // Check if it's a rate limit error
    const isRateLimit = error.message?.includes('rate limit') || 
                       error.message?.includes('429') ||
                       error.message?.includes('Resource exhausted');
    
    if (isRateLimit) {
      return NextResponse.json({ 
        success: false, 
        error: 'API rate limit exceeded. Please wait a moment and try again.',
        details: error.message 
      }, { status: 429 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'An error occurred while processing the file. Please try again.',
      details: error.message 
    }, { status: 500 });
  }
}
