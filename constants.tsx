import React from 'react';
import { Subject, Chapter, ChapterStatus } from './types';
import { BookOpen, Calculator, FlaskConical, Globe, History, Languages } from 'lucide-react';

// Neon Y2K Color Palette
export const SUBJECTS: Subject[] = [
  { id: 'english', name: 'English', totalChapters: 24, color: '#00FFFF', icon: 'Languages' }, // Cyan
  { id: 'hindi', name: 'Hindi', totalChapters: 22, color: '#FF00FF', icon: 'Languages' },   // Magenta
  { id: 'marathi', name: 'Marathi', totalChapters: 21, color: '#FFFF00', icon: 'Languages' }, // Neon Yellow
  { id: 'maths1', name: 'Maths 1', totalChapters: 6, color: '#FF4500', icon: 'Calculator' }, // Neon Orange red
  { id: 'maths2', name: 'Maths 2', totalChapters: 7, color: '#7B68EE', icon: 'Calculator' }, // Medium Slate Blue (Electric Purple vibe)
  { id: 'science1', name: 'Science 1', totalChapters: 10, color: '#39FF14', icon: 'FlaskConical' }, // Neon Green
  { id: 'science2', name: 'Science 2', totalChapters: 10, color: '#00FA9A', icon: 'FlaskConical' }, // Medium Spring Green
  { id: 'geography', name: 'Geography', totalChapters: 9, color: '#1E90FF', icon: 'Globe' }, // Dodger Blue
  { id: 'history', name: 'History', totalChapters: 9, color: '#FF1493', icon: 'History' }, // Deep Pink
];

export const generateInitialChapters = (): Chapter[] => {
  const chapters: Chapter[] = [];
  SUBJECTS.forEach(subject => {
    for (let i = 1; i <= subject.totalChapters; i++) {
      chapters.push({
        id: `${subject.id}-ch${i}`,
        subjectId: subject.id,
        number: i,
        title: `Chapter ${i}`,
        status: ChapterStatus.NOT_STARTED,
        completedAt: null
      });
    }
  });
  return chapters;
};

// Map icon string names to components for rendering
export const getIcon = (iconName: string, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  switch (iconName) {
    case 'Languages': return <Languages {...props} />;
    case 'Calculator': return <Calculator {...props} />;
    case 'FlaskConical': return <FlaskConical {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'History': return <History {...props} />;
    default: return <BookOpen {...props} />;
  }
};