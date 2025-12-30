import React, { useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { SubjectProgressBarChart, DailyProgressChart, OverallPieChart, SubjectRadarChart, BurndownChart } from '../components/charts/ProgressCharts';
import { Activity, Target, Zap, Clock } from 'lucide-react';
import { ChapterStatus } from '../types';
import { RetroCard } from '../components/RetroCard';

const MiniStat: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <RetroCard title={label} className="h-full" headerColor={color.replace('bg-', 'bg-opacity-20 bg-')} initialMinimized={false}>
    <div className="flex items-center gap-4">
      <div className={`p-2 border-2 border-black ${color} text-black shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold font-['Rajdhani'] leading-none">{value}</div>
      </div>
    </div>
  </RetroCard>
);

const Analytics: React.FC = () => {
  const { chapters, remainingDays, chaptersPerDay } = useStudy();

  const stats = useMemo(() => {
    // 1. Current Streak
    const completionDates = new Set(
      chapters
        .filter(c => c.status === ChapterStatus.COMPLETED && c.completedAt)
        .map(c => new Date(c.completedAt!).toLocaleDateString())
    );
    
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
       const d = new Date();
       d.setDate(today.getDate() - i);
       if (completionDates.has(d.toLocaleDateString())) {
         streak++;
       } else if (i === 0 && !completionDates.has(d.toLocaleDateString())) {
         continue; 
       } else {
         break;
       }
    }

    // 2. Velocity
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentCompletions = chapters.filter(
      c => c.status === ChapterStatus.COMPLETED && c.completedAt && c.completedAt > sevenDaysAgo
    ).length;
    const velocity = parseFloat((recentCompletions / 7).toFixed(1));

    // 3. Projected Finish
    const remainingChapters = chapters.filter(c => c.status !== ChapterStatus.COMPLETED).length;
    let projectedDate = "N/A";
    if (velocity > 0) {
      const daysNeeded = Math.ceil(remainingChapters / velocity);
      const proj = new Date();
      proj.setDate(proj.getDate() + daysNeeded);
      projectedDate = proj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else if (remainingChapters === 0) {
      projectedDate = "DONE";
    }

    return { streak, velocity, projectedDate };
  }, [chapters]);

  return (
    <div className="space-y-8">
      <div className="animate-slide-up">
        <RetroCard title="MODULE_HEADER" initialMinimized={true} className="border-dashed border-slate-400 shadow-none">
          <h2 className="text-3xl font-bold font-['Rajdhani'] uppercase tracking-wider mb-1">Data_Analytics</h2>
          <p className="font-mono text-sm text-slate-600">> Advanced visualization module loaded.</p>
        </RetroCard>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up delay-75">
         <MiniStat 
            label="Current Streak" 
            value={`${stats.streak} DAYS`} 
            icon={<Zap size={18} />} 
            color="bg-[#FFFF00]" 
         />
         <MiniStat 
            label="Study Velocity" 
            value={`${stats.velocity} CH/DAY`} 
            icon={<Activity size={18} />} 
            color="bg-[#39FF14]" 
         />
         <MiniStat 
            label="Projected End" 
            value={stats.projectedDate.toUpperCase()} 
            icon={<Target size={18} />} 
            color="bg-[#00FFFF]" 
         />
         <MiniStat 
            label="Required Pace" 
            value={`${chaptersPerDay} CH/DAY`} 
            icon={<Clock size={18} />} 
            color="bg-[#FF00FF]" 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Burndown Chart */}
        <RetroCard title="MISSION_TRAJECTORY (BURNDOWN)" className="lg:col-span-2" delay="delay-100">
          <BurndownChart />
          <p className="mt-4 text-center text-xs font-mono text-slate-400 border-t-2 border-black pt-2 border-dotted">
            > Comparing ACTUAL remaining chapters vs IDEAL linear path to deadline
          </p>
        </RetroCard>

        {/* Radar Chart */}
        <RetroCard title="SUBJECT_BALANCE_MATRIX" delay="delay-200">
           <div className="h-[300px]">
             <SubjectRadarChart />
           </div>
           <p className="mt-2 text-center text-xs font-mono text-slate-400">
             > Polygon area represents overall syllabus coverage balance
           </p>
        </RetroCard>

        {/* Status Breakdown */}
        <RetroCard title="STATUS_DISTRIBUTION" delay="delay-200">
          <OverallPieChart />
        </RetroCard>

        {/* Daily Progress */}
        <RetroCard title="ACTIVITY_LOG (LAST 7 DAYS)" delay="delay-300">
          <DailyProgressChart />
        </RetroCard>

        {/* Subject Comparison */}
        <RetroCard title="SUBJECT_COMPLETION_BARS" className="lg:col-span-2" delay="delay-300">
          <SubjectProgressBarChart />
        </RetroCard>
      </div>
    </div>
  );
};

export default Analytics;