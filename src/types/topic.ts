export type Category = 
  | 'DSA'
  | 'OOPS'
  | 'PROGRAMMING'
  | 'DBMS'
  | 'OS'
  | 'NETWORKS'
  | 'SYSTEM_DESIGN'
  | 'BEHAVIORAL'
  | 'PROJECT_DEFENSE';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type TopicStatus = 
  | 'not_started' 
  | 'attempted' 
  | 'needs_revision' 
  | 'practiced_repeatedly' 
  | 'strong';

export interface CategoryMeta {
  id: Category;
  label: string;
  shortName: string;
  description: string;
  color: string; // Tailwind/HEX color code
  bgClass: string;
  borderClass: string;
  textClass: string;
  iconName: string;
}

export interface SuggestedStructureItem {
  section: string;
  guidance: string;
  durationEstimate?: string;
}

export interface Topic {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  estimatedMinutes: number;
  shortDescription: string;
  interviewQuestion: string;
  followUpQuestions: string[];
  revisionNotes: string[];
  keyConcepts: string[];
  practicalExample: string;
  suggestedAnswerStructure: SuggestedStructureItem[];
  tags: string[];
}

export interface TopicFilterState {
  searchQuery: string;
  selectedCategories: Category[];
  selectedDifficulties: Difficulty[];
  selectedStatus: TopicStatus | 'all';
  sortBy: 'title' | 'difficulty' | 'estimatedTime' | 'reviewDate';
}
