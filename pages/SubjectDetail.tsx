import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { ChapterStatus } from '../types';
import { CheckSquare, Square, Play, ArrowLeft, Terminal } from 'lucide-react';
import { getIcon } from '../constants';
import { RetroCard } from '../components/RetroCard';

const SubjectDetail: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { subjects, chapters, updateChapterStatus, getSubjectProgress } = useStudy();

  const subject = subjects.find(s => s.id === subjectId);

  if (!subject) {
    return <Navigate to="/subjects" />;
  }

  const subjectChapters = chapters.filter(c => c.subjectId === subjectId);
  const { percentage } = getSubjectProgress(subject.id);

  const getStatusIcon = (status: ChapterStatus) => {
    switch (status) {
      case ChapterStatus.COMPLETED:
        return <CheckSquare className="w-6 h-6 text-[#39FF14]" />;
      case ChapterStatus.IN_PROGRESS:
        return <Play className="w-6 h-6 text-[#FFFF00]" />;
      default:
        return <Square className="w-6 h-6 text-slate-300" />;
    }
  };

  const handleStatusClick = (chapterId: string, currentStatus: ChapterStatus) => {
    let nextStatus = ChapterStatus.NOT_STARTED;
    if (currentStatus === ChapterStatus.NOT_STARTED) nextStatus = ChapterStatus.IN_PROGRESS;
    else if (currentStatus === ChapterStatus.IN_PROGRESS) nextStatus = ChapterStatus.COMPLETED;
    else nextStatus = ChapterStatus.NOT_STARTED;

    updateChapterStatus(chapterId, nextStatus);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Controls */}
      <div className="animate-slide-up flex gap-4">
        <Link to="/subjects" className="inline-flex items-center text-sm font-bold font-mono text-black hover:text-[#FF00FF] uppercase tracking-wider bg-white border border-black px-3 py-1 shadow-[2px_2px_0px_0px_#000000] active:shadow-none active:translate-y-1 transition-all">
          <ArrowLeft size={16} className="mr-2" /> Return to DB
        </Link>
      </div>
      
      {/* Header Window */}
      <RetroCard title={`FILE_PROPERTIES: ${subject.name.toUpperCase()}`}>
        <div className="flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
           {/* Decorative background element */}
           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity duration-500 group-hover:rotate-12">
              <Terminal size={120} />
           </div>

           <div 
              className="w-20 h-20 border-2 border-black flex items-center justify-center text-black shadow-[4px_4px_0px_0px_#000000] group-hover:shadow-[6px_6px_0px_0px_#000000] transition-shadow bg-white z-10"
              style={{ backgroundColor: subject.color }}
            >
              {getIcon(subject.icon, "w-10 h-10")}
            </div>
            <div className="flex-1 z-10 w-full">
              <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
                 <h1 className="text-4xl font-bold font-['Rajdhani'] uppercase tracking-widest">{subject.name}</h1>
                 <span className="font-mono font-bold text-2xl">{percentage}%</span>
              </div>
              
              <div className="w-full h-4 bg-[#e0e0e0] border-2 border-black p-0.5">
                 <div className="h-full bg-black transition-all duration-700 ease-out" style={{width: `${percentage}%`}}></div>
              </div>
            </div>
        </div>
      </RetroCard>

      {/* Chapter List Window */}
      <RetroCard title="CHAPTER_INDEX.LOG" delay="delay-150">
        <div className="bg-black text-white p-3 font-mono text-sm flex justify-between uppercase tracking-wider border-b-2 border-black">
           <span>Index</span>
           <span>Status_Log</span>
        </div>
        <div className="grid grid-cols-1 divide-y-2 divide-black">
          {subjectChapters.map((chapter, index) => (
            <div 
              key={chapter.id}
              onClick={() => handleStatusClick(chapter.id, chapter.status)}
              style={{ animationDelay: `${(index % 20) * 30 + 200}ms` }}
              className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-[#f0f0f0] active:bg-[#e0e0e0] group animate-slide-up ${chapter.status === ChapterStatus.COMPLETED ? 'bg-[#f0f0f0]' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="font-mono text-xs text-slate-500 w-8">
                   {chapter.number < 10 ? `0${chapter.number}` : chapter.number}
                </div>
                <div className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                  {getStatusIcon(chapter.status)}
                </div>
                <div>
                  <h4 className={`text-lg font-bold font-['Rajdhani'] uppercase tracking-wide transition-all ${chapter.status === ChapterStatus.COMPLETED ? 'line-through decoration-2 decoration-black text-slate-400' : 'text-black group-hover:text-[#FF00FF]'}`}>
                    {chapter.title}
                  </h4>
                  <p className="text-[10px] font-mono uppercase text-slate-500">
                    {chapter.status === ChapterStatus.NOT_STARTED && "WAITING..."}
                    {chapter.status === ChapterStatus.IN_PROGRESS && <span className="text-[#d97706] animate-pulse">PROCESSING...</span>}
                    {chapter.status === ChapterStatus.COMPLETED && <span className="text-[#059669]">EXECUTED</span>}
                  </p>
                </div>
              </div>
              
              <div className={`
                 text-xs font-bold font-mono px-3 py-1 border-2 border-black uppercase transition-all duration-200
                 ${chapter.status === ChapterStatus.COMPLETED ? 'bg-black text-[#39FF14]' : 'bg-white text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4'}
              `}>
                {chapter.status === ChapterStatus.COMPLETED ? 'DONE' : chapter.status === ChapterStatus.IN_PROGRESS ? 'FINISH' : 'INIT'}
              </div>
            </div>
          ))}
        </div>
      </RetroCard>
    </div>
  );
};

export default SubjectDetail;