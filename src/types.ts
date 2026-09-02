export type MoodType = 
  | 'peaceful' 
  | 'reflective' 
  | 'energized' 
  | 'melancholic' 
  | 'grateful' 
  | 'anxious' 
  | 'inspired';

export interface GeminiJournalAnalysis {
  summary: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Reflective' | 'Ambivalent';
  sentimentScore: number; // 0 - 100
  emotionalArc: string;
  keyTakeaways: string[];
  cognitivePerspective: string;
  reflectiveQuestions: string[];
  actionableMicroHabits: string[];
  mindfulnessAffirmation: string;
}

export interface SanitizationReport {
  delimiterNonce: string;
  originalLength: number;
  sanitizedLength: number;
  xssTokensNeutralized: number;
  promptInjectionVectorsNeutralized: number;
  hmacDigestPreview: string;
}

export interface JournalEntry {
  id: string;
  uid: string;
  title: string;
  content: string;
  date: string;
  mood: MoodType;
  tags: string[];
  analysis?: GeminiJournalAnalysis;
  cryptographicHash: string;
  sanitizationReport?: SanitizationReport;
  createdAt: string;
  updatedAt: string;
}

export type ThreatCategoryCode = 'S' | 'T' | 'R' | 'I' | 'D' | 'E';

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  traceId: string;
  uid: string;
  action: 
    | 'SECRET_VAULT_ACCESS' 
    | 'PROMPT_SANITIZATION' 
    | 'GEMINI_INFERENCE' 
    | 'FIRESTORE_WRITE' 
    | 'FIRESTORE_READ' 
    | 'ATTACK_INTERCEPTED' 
    | 'AUTH_VERIFICATION' 
    | 'IDOR_PREVENTED';
  threatCategory: ThreatCategoryCode;
  threatLabel: string;
  status: 'SUCCESS' | 'INTERCEPTED' | 'DENIED' | 'SANITIZED';
  details: string;
  clientIpMasked: string;
}

export interface UserPersona {
  uid: string;
  name: string;
  role: string;
  email: string;
  avatarColor: string;
  badge: string;
}

export interface ThreatSimPayload {
  name: string;
  category: ThreatCategoryCode;
  categoryName: string;
  attackVector: string;
  rawPayload: string;
  intendedImpact: string;
  expectedDefense: string;
}

export interface ThreatSimExecutionResult {
  simId: string;
  timestamp: string;
  payload: ThreatSimPayload;
  sanitizedText: string;
  delimiterNonce: string;
  intercepted: boolean;
  defenseStatus: 'NEUTRALIZED' | 'ISOLATED' | 'BLOCKED' | 'MASKED';
  explanation: string;
  traceId: string;
}

export interface StrideMatrixItem {
  code: ThreatCategoryCode;
  name: string;
  threatDescription: string;
  zeroTrustMitigation: string;
  status: 'ACTIVE_DEFENSE' | 'ENFORCED';
  eventCount: number;
}
