// Enums
export enum HealthStatus {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED'
}

export enum Recommendation {
  GO = 'GO',
  NO_GO = 'NO-GO'
}

export enum ScenarioType {
  CONSERVATIVE = 'Conservative',
  BASE = 'Base',
  OPTIMISTIC = 'Optimistic'
}

// Interfaces
export interface DimensionScore {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1
  comment: string;
}

export interface ScoringModel {
  totalScore: number; // 0-100
  dimensions: DimensionScore[];
  summary: string;
}

export interface HealthCheckItem {
  id: string;
  label: string;
  status: HealthStatus;
  value: string;
  issue?: string;
}

// IPO Radar (Smart Screening & Sentiment)
export interface MarketSentiment {
  internationalSubscription: string; // e.g. "5.5x"
  publicSubscription: string; // e.g. "120x"
  sentimentScore: number; // 0-100
  sentimentTrend: 'Bullish' | 'Neutral' | 'Bearish';
  analystConsensus: string; // e.g. "Positive due to AI hype"
}

export interface ScreeningMetrics {
  sector: string;
  listingRule: string; // e.g. "18C", "18A", "Main Board"
  revenueGrowth: string; // e.g. "+35% YoY"
  grossMargin: string; // e.g. "60%"
  valuationBand: string; // e.g. "PE 20x-25x"
  pegRatio: string; // e.g. "1.2"
  keyTags: string[]; // e.g. ["AI", "Unprofitable", "Hot"]
}

export interface IPORadar {
  marketSentiment: MarketSentiment;
  screeningMetrics: ScreeningMetrics;
}

// Liquidity & Risk Module
export interface LiquidityAnalysis {
  anchorHeatIndex: {
    score: number; // 0-100 (Higher is hotter/scarcer)
    status: 'Cold' | 'Neutral' | 'Hot' | 'Very Hot';
    comment: string;
  };
  lockUpRisk: {
    riskLevel: 'Low' | 'Medium' | 'High';
    sellingPressure: string; // e.g. "High selling pressure expected due to PE exits"
    marketVolatilityPrediction: string; // e.g. "Stable" or "High Volatility"
  };
  retailSentiment: {
    subscriptionMultiple: string;
    clawbackPrediction: string; // e.g. "Likely to trigger 30% clawback"
  };
}

// Valuation Module
export interface PeerComparison {
  name: string;
  ticker: string;
  pe?: string;
  pb?: string;
  marketCap?: string;
}

export interface ValuationData {
  peers: PeerComparison[];
  fairValueRange: string; // e.g. "HKD 120B - 140B" (Market Cap)
  fairPrice?: string; // e.g. "HKD 18.5 - 22.0" (Price per share)
  valuationComment: string;
}

// Exit Strategy Module
export interface ExitStrategy {
  investorType: 'Anchor (Short-Term)' | 'Cornerstone (Long-Term)';
  horizon: string; // e.g. "Day 1 - Week 1" or "6 Months"
  primaryAction: string;
  keyObservationPoints: string[];
  stopLossOrHedge: string;
}

export interface ScenarioResult {
  type: ScenarioType;
  subscriptionMultiple: string; // e.g., "15x - 20x"
  expectedReturn: string; // e.g., "+5% to +10%"
  liquidity: string;
  action: string;
}

export interface PositionAdvice {
  recommendation: Recommendation;
  rationale: string;
  maxDrawdownTolerance: string;
}

// Capital Structure & Pre-IPO
export interface PreIPORound {
  round: string; // e.g. "Series A"
  investors: string[];
  date: string; // e.g. "Jan 2021"
  amount: string; // e.g. "USD 50M"
  valuation: string; // e.g. "USD 500M"
  discount: string; // e.g. "50% discount to IPO"
}

export interface PreIPOInfo {
  status: string; // e.g. "Passed Hearing"
  underwriters: string[];
  financingRounds: PreIPORound[];
  keyInvestors: string[];
}

export interface IssuanceInfo {
    totalShares: string; // Total shares offered
    publicTranchePct: string; // e.g. "10%"
    internationalTranchePct: string; // e.g. "90%"
    cornerstonePctOfOffer: string; // e.g. "40%"
    greenshoeOption: string; // e.g. "15% Over-allotment"
}

export interface BusinessInfo {
  description: string;
  mainProducts: string[];
  industryPosition: string;
}

export interface FinancialYearData {
  year: string; // e.g. "2021", "2022", "2023"
  revenue: string;
  netProfit: string;
  grossMargin: string;
  growthRate?: string; // Revenue YoY
}

export interface FinancialInfo {
  yearlyData: FinancialYearData[]; // Structured multi-year data
  cagr: string; // Compound Annual Growth Rate
  revenueStructure: string[]; // Detailed breakdown list
  summary: string;
}

export interface CornerstoneItem {
  name: string;
  details?: string; // Amount or share info
  lockup?: string;
}

export interface IPOAnalysis {
  companyName: string;
  stockCode: string;
  sector: string;
  listingDate: string;
  priceRange: string;
  marketCap: string;
  prospectusUrl?: string; 
  
  business: BusinessInfo; 
  financials: FinancialInfo; 
  
  // Capital Structure
  issuanceInfo: IssuanceInfo;
  cornerstones: CornerstoneItem[]; 
  preIpo: PreIPOInfo;

  // Analysis Modules
  ipoRadar: IPORadar; 
  liquidityAnalysis: LiquidityAnalysis; 
  valuation: ValuationData; 
  exitStrategies: ExitStrategy[];
  
  healthCheck: HealthCheckItem[];
  scoring: ScoringModel;
  scenarios: ScenarioResult[];
  positionAdvice: PositionAdvice;
  
  // Metadata
  lastUpdated: string;
  dataSources: string[];
}