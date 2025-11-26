module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StudyAgent",
    ()=>StudyAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfjs$2d$dist$2f$legacy$2f$build$2f$pdf$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdfjs-dist/legacy/build/pdf.mjs [app-route] (ecmascript)");
;
;
// Configure PDF.js worker for Node.js
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfjs$2d$dist$2f$legacy$2f$build$2f$pdf$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GlobalWorkerOptions"].workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';
class StudyAgent {
    model;
    constructor(){
        console.log('Environment variables:', {
            GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Found' : 'Not found',
            NODE_ENV: ("TURBOPACK compile-time value", "development"),
            allEnvKeys: Object.keys(process.env).filter((k)=>k.includes('GEMINI'))
        });
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY not found in environment variables");
        }
        const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
        // Using the same model as in the Python version
        this.model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-lite-preview-02-05'
        });
    }
    async extractTextFromPdf(buffer) {
        try {
            const uint8Array = new Uint8Array(buffer);
            const loadingTask = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfjs$2d$dist$2f$legacy$2f$build$2f$pdf$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDocument"]({
                data: uint8Array
            });
            const pdf = await loadingTask.promise;
            let fullText = '';
            for(let i = 1; i <= pdf.numPages; i++){
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item)=>item.str).join(' ');
                fullText += pageText + '\n';
            }
            return fullText;
        } catch (e) {
            throw new Error(`Error reading PDF: ${e.message}`);
        }
    }
    async generateSummary(text) {
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
    async generateQuiz(text, numQuestions = 5) {
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
            return [
                {
                    question: "Error parsing quiz",
                    options: [],
                    answer: ""
                }
            ];
        }
    }
}
}),
"[project]/src/app/api/process/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/agent.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const mode = formData.get('mode');
        if (!file) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'No file uploaded'
            }, {
                status: 400
            });
        }
        if (!mode || ![
            'summary',
            'quiz'
        ].includes(mode)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid mode'
            }, {
                status: 400
            });
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const agent = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StudyAgent"]();
        // Extract text
        const text = await agent.extractTextFromPdf(buffer);
        let result;
        if (mode === 'summary') {
            result = await agent.generateSummary(text);
        } else if (mode === 'quiz') {
            result = await agent.generateQuiz(text);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Internal server error',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5db0da6c._.js.map