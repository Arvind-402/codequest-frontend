export type ReviewDifficulty = 'Again' | 'Hard' | 'Good' | 'Easy';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface RatingCriteria {
  correctness: number; // 1 to 5
  completeness: number; // 1 to 5
  clarity: number; // 1 to 5
  examples: number; // 1 to 5
}

export interface PracticeSession {
  id: string;
  topicId: string;
  topicTitle: string;
  category: string;
  completedAt: string; // ISO 8601 string
  dateString: string; // YYYY-MM-DD
  durationSeconds: number;
  userAnswer: string;
  wordCount: number;
  revealedNotes: boolean;
  recallMode: 'independent' | 'assisted';
  ratingCriteria: RatingCriteria;
  averageRating: number;
  missingConcepts: string[];
  reflectionNote?: string;
  confidence: ConfidenceLevel;
  reviewDifficulty: ReviewDifficulty;
  xpEarned: number;
  xpBreakdown: {
    base: number;
    recallBonus: number;
    ratingBonus: number;
    dailyMissionBonus: number;
  };
}

export interface DraftSession {
  topicId: string;
  userAnswer: string;
  revealedNotes: boolean;
  timeSpentSeconds: number;
  lastUpdated: string;
}
