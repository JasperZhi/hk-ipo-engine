
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { companyName, subscriptionMultiple, prospectusUrlInput } = req.body;
    const DEEPSEEK_API_KEY = "sk-eac97e968fd24b1eadc2266ee61c8a39";

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
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a professional financial analyst. Always output valid JSON." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.1
            })
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        const content = data.choices[0].message.content;
        res.status(200).send(content); // Send the raw JSON string back
    } catch (error) {
        console.error("Serverless Function Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
