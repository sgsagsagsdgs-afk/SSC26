import React from 'react';
import { useStudy } from '../context/StudyContext';
import { Link } from 'react-router-dom';
import { getIcon } from '../constants';
import { RetroCard } from '../components/RetroCard';

const Subjects: React.FC = () => {
  const { subjects, getSubjectProgress } = useStudy();

  return (
    <div className="space-y-6">
      <RetroCard title="DATABASE_EXPLORER" className="min-h-[80vh]">
        <div className="flex items-center gap-4 animate-slide-up mb-6">
          <div className="w-4 h-4 bg-black animate-pulse"></div>
          <h2 className="text-3xl font-bold font-['Rajdhani'] uppercase tracking-wider">Subject_Database</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => {
            const { completed, total, percentage } = getSubjectProgress(subject.id);
            
            return (
              <Link 
                key={subject.id} 
                to={`/subject/${subject.id}`}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-up bg-white border-2 border-black p-0 shadow-[6px_6px_0px_0px_#000000] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0px_0px_#000000] transition-all duration-200 group relative overflow-hidden"
              >
                {/* Header Bar */}
                <div 
                  className="h-12 border-b-2 border-black flex items-center px-4 justify-between"
                  style={{ backgroundColor: subject.color }}
                >
                  <div className="font-mono text-xs font-bold uppercase tracking-widest text-black/80">ID: {subject.id.toUpperCase()}</div>
                  <div className="bg-black text-white font-mono text-xs px-2 py-0.5 group-hover:bg-white group-hover:text-black transition-colors">{percentage}%</div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-black uppercase font-['Rajdhani'] leading-none group-hover:text-[#FF00FF] transition-colors">
                      {subject.name}
                    </h3>
                    <div className="text-black group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                      {getIcon(subject.icon, "w-8 h-8")}
                    </div>
                  </div>
                  
                  <p className="text-sm font-mono text-slate-600 mb-4 border-l-4 border-black pl-3 group-hover:border-[#00FFFF] transition-colors">
                    PROGRESS: {completed}/{total}
                  </p>

                  {/* Retro Progress Bar */}
                  <div className="w-full h-6 border-2 border-black p-0.5 bg-[#e0e0e0]">
                    <div 
                      className="h-full bg-black transition-all duration-500 relative overflow-hidden group-hover:bg-[#39FF14]"
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwqonyQBbQaJAIcdiLKwAAjQgHjQ5w4b8AAAAASUVORK5CYII=')] opacity-30"></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </RetroCard>
    </div>
  );
};

export default Subjects;