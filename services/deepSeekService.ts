import { IPOAnalysis } from "../types";

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = "/api/analyze";

export const analyzeIPO = async (
    companyName: string,
    subscriptionMultiple: string,
    file?: File,
    prospectusUrlInput?: string,
    onProgress?: (message: string) => void
): Promise<IPOAnalysis> => {
    const model = "deepseek-chat";

    const prompt = `
    You are a professional, rigorous, and fact-based Institutional IPO Analyst. 
    Your job is to analyze the target company: "${companyName}".

    **MARKET CONTEXT UPDATE (2025 HK IPO RENAISSANCE):**
    The Hong Kong IPO market in 2025 is extremely active.
    Use high-growth benchmarks for sentiment analysis.
    - Tier 1 (Frenzy > 5,000x)
    - Tier 2 (Very Hot 1,000x - 5,000x)
    - Tier 3 (Hot 100x - 1,000x)
    
    *Instruction:* If the company belongs to a hot sector (AI, BioTech, Consumer Chain), predict high multiples if fundamentals match 2025 trends.

    **DATA PROTOCOL:**
    1. Verify if it is ALREADY LISTED or "Passed Hearing".
    2. Extract Financials (last 3 years), Underwriters, Pre-IPO rounds, and Cornerstone details.
    3. Provide accurate Listing Date and Stock Code if available.
    4. Provide Sentiment Analysis based on user input: "${subscriptionMultiple}".
    5. User provided URL: "${prospectusUrlInput || 'N/A'}".

    **OUTPUT REQUIREMENTS:**
    - Output language: Simplified Chinese.
    - Return ONLY valid JSON matching the standard IPOAnalysis schema.
    - If data is unknown, provide reasonable institutional estimates based on peers but mark as estimates.
  `;

    try {
        if (onProgress) onProgress("正在通过 DeepSeek 引擎分析数据 (Analyzing with DeepSeek Engine)...");

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                companyName,
                subscriptionMultiple,
                prospectusUrlInput
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server Error: ${response.status}`);
        }

        const result = await response.json() as IPOAnalysis;

        // Add metadata
        result.lastUpdated = new Date().toLocaleString();
        result.dataSources = result.dataSources || [];
        if (prospectusUrlInput) result.dataSources.push(prospectusUrlInput);

        return result;

    } catch (error) {
        console.error("DeepSeek Analysis failed:", error);
        throw error;
    }
};

export const askResearchAssistant = async (
    contextData: IPOAnalysis,
    history: { role: 'user' | 'model', text: string }[],
    question: string
): Promise<string> => {
    const model = "deepseek-chat";

    const contextPrompt = `
      You are an expert Investment Research Assistant. 
      The user is viewing an IPO Analysis Report for: ${contextData.companyName}.
      
      **CURRENT REPORT DATA (Context):**
      ${JSON.stringify(contextData)}

      **INSTRUCTIONS:**
      - Answer based strictly on the provided JSON data.
      - Output in Simplified Chinese.
    `;

    const messages = [
        { role: "system", content: contextPrompt },
        ...history.map(msg => ({ role: msg.role === 'model' ? 'assistant' : 'user', content: msg.text })),
        { role: "user", content: question }
    ];

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.7
            })
        });

        const json = await response.json();
        return json.choices[0].message.content || "Sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("DeepSeek Assistant failed:", error);
        return "抱歉，分析助手暂时无法响应。";
    }
};
