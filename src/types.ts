/**
 * Core Type Definitions for SmartNote AI
 */

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "user" | "admin";
  totalSummaries: number;
  readingTimeSaved: number;
  createdAt: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
}

export interface AISummary {
  summaryId: string;
  userId: string;
  title: string;
  originalText: string;
  fileType: "manual" | "txt" | "pdf" | "docx";
  fileName?: string;
  shortSummary: string;
  detailedSummary: string;
  language: "en" | "hi" | "bn";
  category: string;
  sentiment: string;
  difficulty: "easy" | "medium" | "hard";
  readingTime: number;
  explainLikeIm5: string;
  keyPoints: string[];
  actionItems: string[];
  studyNotes: string;
  questions: MCQQuestion[];
  flashcards: Flashcard[];
  mindMap: MindMapNode;
  keywords: string[];
  importantDatesNumbersFullList?: string[];
  isBookmarked: boolean;
  createdAt: string;
  wordCount: number;
  charCount: number;
}

export type AIMode = "short" | "detailed" | "action" | "study" | "flashcards";

export interface UserStats {
  totalSummaries: number;
  readingTimeSaved: number;
}
