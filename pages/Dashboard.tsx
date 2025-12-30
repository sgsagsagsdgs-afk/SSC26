import React from 'react';
import { useStudy } from '../context/StudyContext';
import { CalendarDays, BookOpen, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OverallPieChart } from '../components/charts/ProgressCharts';
import { RetroCard } from '../components/RetroCard';

const StatCard: React.FC<{ title: string; value: string | number; subtext?: string; icon: React.ReactNode; color: string; delay?: string }> = ({ title, value, subtext, icon, color, delay }) => (
  <RetroCard title={title} headerColor={color.replace('bg-', 'bg-opacity-50 bg-')} delay={delay}>
    <div className="flex flex-col h-full justify-between min-h-[100px]">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 border-2 border-black ${color} text-black shadow-[2px_2px_0px_0px_#000000] group-hover:animate-bounce`}>
          {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6 text-black" })}
        </div>
        {subtext && <span className="text-[10px] font-bold px-2 py-1 bg-black text-white font-mono animate-pulse">{subtext}</span>}
      </div>
      <div>
        <h3 className="text-4xl font-bold text-black mb-1 font-['Rajdhani'] leading-none">{value}</h3>
      </div>
    </div>
  </RetroCard>
);

const Dashboard: React.FC = () => {
  const { remainingDays, chaptersPerDay, overallProgress, examDate, subjects, getSubjectProgress } = useStudy();

  if (!examDate) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-slide-up">
        <RetroCard title="SYSTEM_ALERT" className="max-w-md w-full" headerColor="bg-[#FFFF00]">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-6 bg-[#00FFFF] border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:rotate-6 transition-transform">
              <CalendarDays size={48} className="text-black" />
            </div>
            <h2 className="text-2xl font-bold font-['Rajdhani'] uppercase hover-glitch">Setup Required</h2>
            <p className="font-mono text-sm text-left w-full bg-[#f0f0f0] border border-black p-4 shadow-inner">
              > User profile detected.<br/>
              > Missing variable: EXAM_DATE.<br/>
              > Action required: Configure settings.<span className="animate-blink">_</span>
            </p>
            <Link to="/settings" className="w-full text-center px-8 py-3 bg-[#FF00FF] text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000000] y2k-hover transition-all uppercase tracking-widest">
              Execute Setup
            </Link>
          </div>
        </RetroCard>
      </div>
    );
  }

  // Sort subjects by lowest completion to show "Focus Areas"
  const focusSubjects = [...subjects]
    .map(s => ({ ...s, ...getSubjectProgress(s.id) }))
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);
  
  const formattedDate = new Date(examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="COUNTDOWN" 
          value={remainingDays} 
          subtext={`TARGET: ${formattedDate}`}
          icon={<CalendarDays />} 
          color="bg-[#1E90FF]"
          delay="delay-75"
        />
        <StatCard 
          title="VELOCITY" 
          value={chaptersPerDay} 
          subtext="CH/DAY"
          icon={<TrendingUp />} 
          color="bg-[#FF00FF]"
          delay="delay-100"
        />
        <StatCard 
          title="COMPLETION" 
          value={`${overallProgress}%`} 
          icon={<BookOpen />} 
          color="bg-[#39FF14]"
          delay="delay-150"
        />
        <StatCard 
          title="SYSTEM_STATUS" 
          value={remainingDays > 0 ? "ONLINE" : "OFFLINE"} 
          subtext="SSC 2026"
          icon={<AlertCircle />} 
          color="bg-[#FFFF00]"
          delay="delay-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <RetroCard title="SYLLABUS_VISUALIZATION" className="lg:col-span-2" delay="delay-300">
           <OverallPieChart />
           <div className="mt-4 grid grid-cols-3 text-center divide-x-2 divide-black border-t-2 border-black pt-4">
             <div className="p-2 hover:bg-slate-50 transition-colors cursor-crosshair">
                <div className="text-xs font-bold uppercase tracking-widest mb-1">DONE</div>
                <div className="text-xl font-bold text-[#39FF14] bg-black inline-block px-2 font-mono">{Math.round(overallProgress)}%</div>
             </div>
             <div className="p-2 hover:bg-slate-50 transition-colors cursor-crosshair">
                <div className="text-xs font-bold uppercase tracking-widest mb-1">REMAINING</div>
                <div className="text-xl font-bold text-black font-mono">{100 - Math.round(overallProgress)}%</div>
             </div>
             <div className="p-2 hover:bg-slate-50 transition-colors cursor-crosshair">
                <div className="text-xs font-bold uppercase tracking-widest mb-1">SPEED</div>
                <div className="text-xl font-bold text-[#1E90FF] font-mono">{chaptersPerDay}</div>
             </div>
           </div>
        </RetroCard>

        {/* Focus Areas */}
        <RetroCard title="PRIORITY_TASKS" delay="delay-500">
          <p className="text-xs font-mono mb-6 border-b border-black pb-2 text-slate-500">> Analysis: High effort required for following modules:</p>
          
          <div className="space-y-6 flex-1">
            {focusSubjects.map(sub => (
              <Link key={sub.id} to={`/subject/${sub.id}`} className="block group">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-black group-hover:text-[#FF00FF] transition-colors uppercase font-['Rajdhani'] text-lg group-hover:translate-x-1 duration-200">{sub.name}</span>
                  <span className="text-xs font-bold bg-black text-white px-1 font-mono">{sub.percentage}%</span>
                </div>
                <div className="w-full h-4 border-2 border-black bg-white relative">
                  <div 
                    className="h-full bg-red-500 absolute top-0 left-0 transition-all duration-500 group-hover:bg-[#FF00FF]" 
                    style={{ width: `${Math.max(sub.percentage, 5)}%` }}
                  ></div>
                  {/* Stripes pattern */}
                  <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwqonyQBbQaJAIcdiLKwAAjQgHjQ5w4b8AAAAASUVORK5CYII=')] opacity-20 pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>

          <Link to="/subjects" className="mt-8 flex items-center justify-center gap-2 text-sm font-bold bg-black text-white border-2 border-black p-3 uppercase tracking-widest y2k-hover transition-all">
             ACCESS FULL DATABASE <ArrowRight size={16} />
          </Link>
        </RetroCard>
      </div>
    </div>
  );
};

export default Dashboard;