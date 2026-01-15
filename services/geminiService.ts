import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IPOAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Define the schema for structured JSON output
const ipoAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    companyName: { type: Type.STRING },
    stockCode: { type: Type.STRING },
    sector: { type: Type.STRING },
    listingDate: { type: Type.STRING },
    priceRange: { type: Type.STRING },
    marketCap: { type: Type.STRING },
    prospectusUrl: { type: Type.STRING },
    business: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        mainProducts: { type: Type.ARRAY, items: { type: Type.STRING } },
        industryPosition: { type: Type.STRING }
      }
    },
    financials: {
      type: Type.OBJECT,
      properties: {
        yearlyData: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING, description: "Year label, e.g., 2021, 2022, 2023" },
              revenue: { type: Type.STRING, description: "Revenue with unit" },
              netProfit: { type: Type.STRING, description: "Net Profit with unit" },
              grossMargin: { type: Type.STRING, description: "Gross Margin %" },
              growthRate: { type: Type.STRING, description: "YoY Revenue Growth %" }
            }
          }
        },
        cagr: { type: Type.STRING, description: "Compound Annual Growth Rate (Revenue)" },
        revenueStructure: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Detailed breakdown of revenue sources/segments"
        },
        summary: { type: Type.STRING, description: "Institutional financial commentary" }
      }
    },
    issuanceInfo: {
      type: Type.OBJECT,
      properties: {
        totalShares: { type: Type.STRING, description: "Total number of shares offered" },
        publicTranchePct: { type: Type.STRING, description: "Initial public offering % (e.g. 10%)" },
        internationalTranchePct: { type: Type.STRING, description: "International placing % (e.g. 90%)" },
        cornerstonePctOfOffer: { type: Type.STRING, description: "Percentage of total offer taken by cornerstones" },
        greenshoeOption: { type: Type.STRING, description: "Over-allotment status" }
      }
    },
    cornerstones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          details: { type: Type.STRING, description: "Investment amount or %" },
          lockup: { type: Type.STRING, description: "Lock-up period (e.g. 6 months)" }
        }
      }
    },
    preIpo: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING },
        underwriters: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyInvestors: { type: Type.ARRAY, items: { type: Type.STRING } },
        financingRounds: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              round: { type: Type.STRING, description: "Round Name (Series A)" },
              investors: { type: Type.ARRAY, items: { type: Type.STRING } },
              date: { type: Type.STRING, description: "Date of investment" },
              amount: { type: Type.STRING, description: "Amount invested" },
              valuation: { type: Type.STRING, description: "Post-money valuation" },
              discount: { type: Type.STRING, description: "Discount to IPO price" }
            }
          }
        }
      }
    },
    ipoRadar: {
      type: Type.OBJECT,
      properties: {
        marketSentiment: {
          type: Type.OBJECT,
          properties: {
            internationalSubscription: { type: Type.STRING, description: "Est. International subscription multiple (e.g. '15x')" },
            publicSubscription: { type: Type.STRING, description: "Est. Public subscription multiple (e.g. '3000x')" },
            sentimentScore: { type: Type.NUMBER, description: "0-100 score based on media/analyst sentiment" },
            sentimentTrend: { type: Type.STRING, enum: ['Bullish', 'Neutral', 'Bearish'] },
            analystConsensus: { type: Type.STRING }
          }
        },
        screeningMetrics: {
          type: Type.OBJECT,
          properties: {
            sector: { type: Type.STRING },
            listingRule: { type: Type.STRING, description: "e.g. 18C, 18A, Main Board" },
            revenueGrowth: { type: Type.STRING },
            grossMargin: { type: Type.STRING },
            valuationBand: { type: Type.STRING },
            pegRatio: { type: Type.STRING },
            keyTags: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    },
    liquidityAnalysis: {
      type: Type.OBJECT,
      properties: {
        anchorHeatIndex: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "0-100 score indicating scarcity of quota" },
            status: { type: Type.STRING, enum: ['Cold', 'Neutral', 'Hot', 'Very Hot'] },
            comment: { type: Type.STRING }
          }
        },
        lockUpRisk: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            sellingPressure: { type: Type.STRING, description: "Estimate post-lockup selling pressure" },
            marketVolatilityPrediction: { type: Type.STRING, description: "Predicted market volatility in 6 months" }
          }
        },
        retailSentiment: {
          type: Type.OBJECT,
          properties: {
            subscriptionMultiple: { type: Type.STRING },
            clawbackPrediction: { type: Type.STRING, description: "Prediction of retail clawback ratio (e.g. 10%, 30%, 50%)" }
          }
        }
      }
    },
    valuation: {
      type: Type.OBJECT,
      properties: {
        peers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              ticker: { type: Type.STRING },
              pe: { type: Type.STRING },
              pb: { type: Type.STRING },
              marketCap: { type: Type.STRING }
            }
          }
        },
        fairValueRange: { type: Type.STRING, description: "Estimated Market Cap Range (e.g. HKD 150B - 180B)" },
        fairPrice: { type: Type.STRING, description: "Estimated Fair Share Price Range (e.g. HKD 18.5 - 24.0)" },
        valuationComment: { type: Type.STRING }
      }
    },
    healthCheck: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['GREEN', 'YELLOW', 'RED'] },
          value: { type: Type.STRING },
          issue: { type: Type.STRING }
        },
        required: ['id', 'label', 'status', 'value']
      }
    },
    scoring: {
      type: Type.OBJECT,
      properties: {
        totalScore: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        dimensions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.NUMBER },
              weight: { type: Type.NUMBER },
              comment: { type: Type.STRING }
            }
          }
        }
      }
    },
    scenarios: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['Conservative', 'Base', 'Optimistic'] },
          subscriptionMultiple: { type: Type.STRING },
          expectedReturn: { type: Type.STRING },
          liquidity: { type: Type.STRING },
          action: { type: Type.STRING }
        }
      }
    },
    positionAdvice: {
      type: Type.OBJECT,
      properties: {
        recommendation: { type: Type.STRING, enum: ['GO', 'NO-GO'] },
        rationale: { type: Type.STRING },
        maxDrawdownTolerance: { type: Type.STRING }
      }
    },
    exitStrategies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          investorType: { type: Type.STRING, enum: ['Anchor (Short-Term)', 'Cornerstone (Long-Term)'] },
          horizon: { type: Type.STRING },
          primaryAction: { type: Type.STRING },
          keyObservationPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          stopLossOrHedge: { type: Type.STRING }
        }
      }
    },
    lastUpdated: { type: Type.STRING },
    dataSources: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  }
};

const getMimeType = (file: File) => {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'doc') return 'application/msword';
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (ext === 'xls') return 'application/vnd.ms-excel';
  if (ext === 'xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (ext === 'ppt') return 'application/vnd.ms-powerpoint';
  if (ext === 'pptx') return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  return 'application/octet-stream';
};

async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: getMimeType(file),
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const analyzeIPO = async (
  companyName: string,
  subscriptionMultiple: string,
  file?: File,
  prospectusUrlInput?: string,
  onProgress?: (message: string) => void
): Promise<IPOAnalysis> => {
  const model = "gemini-2.0-flash-lite-preview-02-05";

  const prompt = `
    You are a professional, rigorous, and fact-based Institutional IPO Analyst. 
    Your job is to analyze the target company: "${companyName}".

    **MARKET CONTEXT UPDATE (2025 HK IPO RENAISSANCE):**
    The Hong Kong IPO market in 2025 is extremely active with a "frenzy" of retail participation.
    Use the following benchmarks to calibrate your Sentiment Analysis and Subscription predictions. DO NOT use old/conservative benchmarks.
    - **Tier 1 (Frenzy > 5,000x):** Rare, historical records. Examples: Golden Leaf (11,464x), Quant Group (9,365x), Dipu Tech (7,569x), Blue (6,000x), Mixue (5,300x).
    - **Tier 2 (Very Hot 1,000x - 5,000x):** Common for popular sectors (BioTech, Consumer). Examples: Aunti Jenny (3,616x), Different Group (3,300x), Sipuni (2,500x).
    - **Tier 3 (Hot 100x - 1,000x):** Approximately 30% of market. Examples: Ningde Times (120x).
    - **Baseline:** 98% of IPOs are oversubscribed.
    
    *Instruction:* If the company belongs to a hot sector (AI, BioTech, Consumer Chain), DO NOT be conservative. Predict high multiples (e.g., >500x) if the fundamentals match the 2025 trend.

    **STRICT EXECUTION PROTOCOL:**
    1. **MANDATORY GOOGLE SEARCH:** You MUST use the 'googleSearch' tool immediately to find the official status of this company on HKEX (Hong Kong Stock Exchange).
       - Verify: Is it ALREADY LISTED? Is it "Passed Hearing" (PHIP)? Is the application "Lapsed"?
       - If it is LISTED, get the exact Listing Date and Stock Code.
       - If it is NOT LISTED, get the latest filing status.
       - **DO NOT HALLUCINATE STATUS.** If search shows it traded today, it is LISTED.

    2. **DATA CONSISTENCY CHECK:**
       - **Underwriters:** Only list underwriters found in search results or news. If unknown, state "N/A".
       - **Financials:** Search for the latest prospectus (PHIP) or annual report. Extract REAL numbers (Revenue, Profit) for the last 3 years.
       - **Primary Market / Pre-IPO:** Search for "Series A", "Series B", "Pre-IPO" financing rounds. **YOU MUST FIND**: Date of investment, Amount, Valuation, and Cost per Share/Discount to IPO if available.
       - **Issuance Info:** Search for "Global Offering" details. **YOU MUST FIND**: Total number of shares offered, Allocation breakdown (Public % vs International %), and Cornerstone Investor details (Names, Amount, Lock-up).
       - **Valuation:** Estimate the "Fair Value Range" (Total Market Cap) and "Fair Price" (Share Price) based on peer comparison (PE/PB) and 2025 market sentiment.
       - **Prospectus URL:** Only provide a URL if you find a direct link to a PDF or the HKEX news page.

    3. **USER INPUTS:**
       - User provided Subscription Multiple: "${subscriptionMultiple}" (Use this for sentiment analysis if provided, otherwise search for actual subscription results if listed).
       - User provided URL: "${prospectusUrlInput || 'N/A'}" (Prioritize this if valid).
       ${file ? "- **FILE PROVIDED:** A document was uploaded. Treat this as the primary source for Financials and Business details." : ""}

    **OUTPUT REQUIREMENTS:**
    - Output language: **Simplified Chinese** (Simplified Chinese).
    - Return ONLY valid JSON matching the schema.
    - **Strategy Matrix:** Analyze from 3 perspectives (Cornerstone, Anchor, Retail).
    
    **CRITICAL:** 
    - If the company is ALREADY LISTED, the "Decision" should reflect its post-IPO performance or be marked as "Review" rather than a pre-IPO "GO/NO-GO", but still provide the analysis.
    - Ensure the "Listing Date" is accurate.
  `;

  try {
    const parts: any[] = [];

    // Add file part if provided
    if (file) {
      if (onProgress) onProgress("正在读取并处理文档 (Reading & Processing Document)...");
      const filePart = await fileToGenerativePart(file);
      parts.push(filePart);
    }

    if (onProgress) onProgress("正在联网检索 HKEX 官方披露 (Searching HKEX)...");

    // Add prompt text
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: parts }],
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0, // CRITICAL: Set to 0 to maximize determinism and factual accuracy
        responseMimeType: "application/json",
        responseSchema: ipoAnalysisSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let result: IPOAnalysis;
    try {
      result = JSON.parse(cleanText) as IPOAnalysis;
    } catch (e) {
      console.error("Failed to parse JSON:", cleanText);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Append grounding sources if available
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const sources = response.candidates[0].groundingMetadata.groundingChunks
        .map(chunk => chunk.web?.uri)
        .filter((uri): uri is string => !!uri);
      const existingSources = result.dataSources || [];
      const uniqueSources = Array.from(new Set([...existingSources, ...sources]));
      result.dataSources = uniqueSources;
    }

    if (prospectusUrlInput && prospectusUrlInput.startsWith('http')) {
      if (!result.dataSources) result.dataSources = [];
      if (!result.dataSources.includes(prospectusUrlInput)) {
        result.dataSources.push(prospectusUrlInput);
      }
    }

    return result;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const askResearchAssistant = async (
  contextData: IPOAnalysis,
  history: { role: 'user' | 'model', text: string }[],
  question: string
): Promise<string> => {
  const model = "gemini-2.0-flash-lite-preview-02-05";

  // Flatten history for simple text generation context (or use chat interface)
  // Here we construct a single prompt with context to ensure stateless-like simplicity but with memory
  const contextPrompt = `
      You are an expert Investment Research Assistant. 
      The user is viewing an IPO Analysis Report for: ${contextData.companyName}.
      
      **CURRENT REPORT DATA (Context):**
      ${JSON.stringify(contextData)}

      **INSTRUCTIONS:**
      - Answer the user's question based strictly on the provided JSON data.
      - If the answer requires external knowledge (e.g. recent news not in the report), you may use your general knowledge but mention it is outside the report scope.
      - Keep answers concise, professional, and financial-focused.
      - Output in Simplified Chinese.
    `;

  const chatHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  // We use the 'chats' interface for multi-turn capability
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: contextPrompt,
      temperature: 0.7,
    },
    history: chatHistory
  });

  const result = await chat.sendMessage({ message: question });
  return result.text || "Sorry, I couldn't generate a response.";
};