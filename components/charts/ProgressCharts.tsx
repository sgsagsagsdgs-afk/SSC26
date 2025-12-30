import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Area
} from 'recharts';
import { useStudy } from '../../context/StudyContext';
import { ChapterStatus } from '../../types';

export const OverallPieChart: React.FC = () => {
  const { chapters } = useStudy();
  
  const completed = chapters.filter(c => c.status === ChapterStatus.COMPLETED).length;
  const inProgress = chapters.filter(c => c.status === ChapterStatus.IN_PROGRESS).length;
  const notStarted = chapters.filter(c => c.status === ChapterStatus.NOT_STARTED).length;

  const data = [
    { name: 'Completed', value: completed, color: '#39FF14' }, // Neon Green
    { name: 'In Progress', value: inProgress, color: '#FFFF00' }, // Neon Yellow
    { name: 'Not Started', value: notStarted, color: '#e0e0e0' }, // Grey
  ];

  // Filter out zero values so legend looks clean
  const activeData = data.filter(d => d.value > 0);

  if (activeData.length === 0) return <div className="text-center font-mono text-slate-500">NO DATA AVAILABLE</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={0}
          dataKey="value"
          stroke="#000"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '2px solid #000', 
            boxShadow: '4px 4px 0px 0px #000',
            fontFamily: 'Space Mono'
          }} 
          itemStyle={{ color: '#000' }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="square"
          formatter={(value) => <span style={{ color: 'black', fontFamily: 'Space Mono', fontWeight: 'bold' }}>{value.toUpperCase()}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const SubjectProgressBarChart: React.FC = () => {
  const { subjects, getSubjectProgress } = useStudy();

  const data = subjects.map(s => {
    const { completed, total } = getSubjectProgress(s.id);
    return {
      name: s.name.substring(0, 3).toUpperCase(), // Short name caps
      Completed: completed,
      Remaining: total - completed,
      full: s.name
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={50} 
          tick={{fontSize: 12, fill: '#000', fontFamily: 'Space Mono', fontWeight: 'bold'}} 
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          cursor={{fill: '#f0f0f0'}} 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '2px solid #000', 
            boxShadow: '4px 4px 0px 0px #000',
            fontFamily: 'Space Mono'
          }}
        />
        <Bar dataKey="Completed" stackId="a" fill="#00FFFF" stroke="#000" strokeWidth={2} barSize={15} />
        <Bar dataKey="Remaining" stackId="a" fill="#fff" stroke="#000" strokeWidth={2} barSize={15} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DailyProgressChart: React.FC = () => {
  const { chapters } = useStudy();

  // Aggregate completion by date (last 7 days active)
  const completionsByDate = chapters
    .filter(c => c.status === ChapterStatus.COMPLETED && c.completedAt)
    .reduce((acc, curr) => {
      const date = new Date(curr.completedAt!).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const data = Object.keys(completionsByDate).map(date => ({
    date,
    count: completionsByDate[date]
  })).slice(-7); // Last 7 active days

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-slate-500 bg-white border-2 border-dashed border-black">
        <p>AWAITING DATA INPUT...</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis 
          dataKey="date" 
          axisLine={{ stroke: '#000', strokeWidth: 2 }} 
          tickLine={{ stroke: '#000' }} 
          tick={{fill: '#000', fontSize: 12, fontFamily: 'Space Mono'}} 
          dy={10} 
        />
        <YAxis 
          axisLine={{ stroke: '#000', strokeWidth: 2 }} 
          tickLine={{ stroke: '#000' }} 
          tick={{fill: '#000', fontSize: 12, fontFamily: 'Space Mono'}} 
          allowDecimals={false} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '2px solid #000', 
            boxShadow: '4px 4px 0px 0px #000',
            fontFamily: 'Space Mono'
          }}
        />
        <Line 
          type="step" 
          dataKey="count" 
          stroke="#FF00FF" 
          strokeWidth={3} 
          dot={{r: 4, fill: '#FF00FF', stroke: '#000', strokeWidth: 2}} 
          activeDot={{r: 6, fill: '#00FFFF', stroke: '#000'}} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const SubjectRadarChart: React.FC = () => {
  const { subjects, getSubjectProgress } = useStudy();

  const data = subjects.map(s => {
    const { percentage } = getSubjectProgress(s.id);
    return {
      subject: s.name.substring(0, 4).toUpperCase(),
      percentage,
      fullMark: 100
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#000" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#000', fontSize: 10, fontFamily: 'Space Mono', fontWeight: 'bold' }} 
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Completion"
          dataKey="percentage"
          stroke="#00FFFF"
          strokeWidth={2}
          fill="#00FFFF"
          fillOpacity={0.4}
        />
        <Tooltip 
           contentStyle={{ 
            backgroundColor: '#fff', 
            border: '2px solid #000', 
            boxShadow: '4px 4px 0px 0px #000',
            fontFamily: 'Space Mono'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const BurndownChart: React.FC = () => {
  const { chapters, examDate } = useStudy();
  
  if (!examDate) return <div className="text-center font-mono text-slate-500 py-10">SET EXAM DATE TO ENABLE PROJECTION</div>;

  const totalChapters = chapters.length;
  const completedChapters = chapters
    .filter(c => c.status === ChapterStatus.COMPLETED && c.completedAt)
    .sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0));

  const startTime = completedChapters.length > 0 
    ? Math.min(completedChapters[0].completedAt!, Date.now() - 7 * 24 * 60 * 60 * 1000) 
    : Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  const endTime = new Date(examDate).getTime();
  const today = Date.now();

  // If exam date is passed or weird
  if (endTime < startTime) return <div className="text-center font-mono text-slate-500">INVALID TIMELINE</div>;

  // Generate data points
  const data = [];
  const oneDay = 24 * 60 * 60 * 1000;
  const totalDuration = endTime - startTime;
  
  let currentRemaining = totalChapters;
  let completedIndex = 0;

  // Iterate daily from start to end (or a reasonable max limit to prevent crashing)
  // To avoid too many points, we can sample if duration is huge, but for 1-2 years it's fine (~700 points max)
  for (let time = startTime; time <= endTime; time += oneDay) {
    // Update actual remaining
    while (
      completedIndex < completedChapters.length && 
      (completedChapters[completedIndex].completedAt || 0) <= time
    ) {
      currentRemaining--;
      completedIndex++;
    }

    // Calculate ideal remaining (Linear)
    const timePassed = time - startTime;
    const idealRemaining = totalChapters - (totalChapters * (timePassed / totalDuration));

    // Only push 'actual' if time is <= today
    const dataPoint: any = {
      date: new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ideal: Math.max(0, Math.round(idealRemaining)),
    };

    if (time <= today + oneDay) {
       dataPoint.actual = Math.max(0, currentRemaining);
    }

    data.push(dataPoint);
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 10, fontFamily: 'Space Mono' }} 
          minTickGap={30}
          axisLine={{ stroke: '#000' }}
          tickLine={{ stroke: '#000' }}
        />
        <YAxis 
          tick={{ fontSize: 10, fontFamily: 'Space Mono' }} 
          axisLine={{ stroke: '#000' }}
          tickLine={{ stroke: '#000' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '2px solid #000', 
            boxShadow: '4px 4px 0px 0px #000',
            fontFamily: 'Space Mono'
          }}
        />
        <Legend verticalAlign="top" height={36} iconType="plainline" />
        <Line 
          type="monotone" 
          dataKey="ideal" 
          stroke="#FF00FF" 
          strokeDasharray="5 5" 
          strokeWidth={2} 
          dot={false} 
          name="Ideal Trajectory" 
        />
        <Line 
          type="stepAfter" 
          dataKey="actual" 
          stroke="#39FF14" 
          strokeWidth={3} 
          dot={false} 
          name="Actual Remaining" 
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};