import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Chapter, ChapterStatus, StudyContextType, Subject } from '../types';
import { SUBJECTS, generateInitialChapters } from '../constants';

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEY = 'ssc_tracker_data_v1';
// Default to SSC Board Exam 2026 start date (Feb 20, 2026)
const DEFAULT_EXAM_DATE = '2026-02-20T00:00:00.000Z';

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [examDate, setExamDateState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setChapters(parsed.chapters || generateInitialChapters());
        // Default to predefined date if not set, or if null in storage
        setExamDateState(parsed.examDate || DEFAULT_EXAM_DATE);
      } catch (e) {
        console.error("Failed to parse saved data", e);
        setChapters(generateInitialChapters());
        setExamDateState(DEFAULT_EXAM_DATE);
      }
    } else {
      setChapters(generateInitialChapters());
      setExamDateState(DEFAULT_EXAM_DATE);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ chapters, examDate }));
    }
  }, [chapters, examDate, isLoaded]);

  const setExamDate = (date: string) => {
    setExamDateState(date);
  };

  const updateChapterStatus = useCallback((chapterId: string, status: ChapterStatus) => {
    setChapters(prev => prev.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          status,
          completedAt: status === ChapterStatus.COMPLETED ? Date.now() : (status === ChapterStatus.NOT_STARTED ? null : ch.completedAt)
        };
      }
      return ch;
    }));
  }, []);

  const getSubjectProgress = useCallback((subjectId: string) => {
    const subjectChapters = chapters.filter(c => c.subjectId === subjectId);
    const completed = subjectChapters.filter(c => c.status === ChapterStatus.COMPLETED).length;
    const total = subjectChapters.length;
    return {
      completed,
      total,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  }, [chapters]);

  const resetData = () => {
    if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      setChapters(generateInitialChapters());
      setExamDateState(DEFAULT_EXAM_DATE);
    }
  };

  // Derived Stats
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter(c => c.status === ChapterStatus.COMPLETED).length;
  const overallProgress = totalChapters === 0 ? 0 : Math.round((completedChapters / totalChapters) * 100);

  const calculateRemainingDays = () => {
    if (!examDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = calculateRemainingDays();
  const remainingChapters = totalChapters - completedChapters;
  const chaptersPerDay = remainingDays > 0 ? parseFloat((remainingChapters / remainingDays).toFixed(1)) : 0;

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center text-slate-500">Loading...</div>;
  }

  return (
    <StudyContext.Provider value={{
      subjects: SUBJECTS,
      chapters,
      examDate,
      setExamDate,
      updateChapterStatus,
      getSubjectProgress,
      overallProgress,
      remainingDays,
      chaptersPerDay,
      resetData
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};