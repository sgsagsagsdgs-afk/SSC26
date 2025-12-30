export enum ChapterStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Chapter {
  id: string;
  subjectId: string;
  number: number;
  title: string;
  status: ChapterStatus;
  completedAt?: number | null; // Timestamp
}

export interface Subject {
  id: string;
  name: string;
  totalChapters: number;
  color: string;
  icon: string;
}

export interface UserData {
  examDate: string | null; // ISO Date string
  chapters: Chapter[];
}

export interface StudyContextType {
  subjects: Subject[];
  chapters: Chapter[];
  examDate: string | null;
  setExamDate: (date: string) => void;
  updateChapterStatus: (chapterId: string, status: ChapterStatus) => void;
  getSubjectProgress: (subjectId: string) => { completed: number; total: number; percentage: number };
  overallProgress: number;
  remainingDays: number;
  chaptersPerDay: number;
  resetData: () => void;
}
