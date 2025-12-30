import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { Save, Trash2, Calendar, Terminal } from 'lucide-react';
import { RetroCard } from '../components/RetroCard';

const Settings: React.FC = () => {
  const { examDate, setExamDate, resetData } = useStudy();
  const [dateInput, setDateInput] = useState('');

  useEffect(() => {
    if (examDate) {
      // Format YYYY-MM-DD for input
      const d = new Date(examDate);
      setDateInput(d.toISOString().split('T')[0]);
    }
  }, [examDate]);

  const handleSave = () => {
    if (dateInput) {
      setExamDate(new Date(dateInput).toISOString());
      alert("Exam date updated!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
      <RetroCard title="SYSTEM_CONFIGURATION">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000] hover:animate-spin">
             <Terminal size={24} />
          </div>
          <div>
             <h2 className="text-3xl font-bold text-black font-['Rajdhani'] uppercase">System_Config</h2>
             <p className="text-sm font-mono text-slate-600">Modify global parameters.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold font-mono uppercase text-black mb-2 tracking-widest">
               <span className="bg-[#00FFFF] px-1">Param 01:</span> Board_Exam_Start_Date
            </label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-black w-5 h-5 group-hover:text-[#FF00FF] transition-colors"/>
                  </div>
                  <input 
                    type="date" 
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f0f0f0] border-2 border-black focus:bg-[#FFFF00] focus:ring-0 outline-none transition-all font-mono shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-none"
                  />
              </div>
              <button 
                onClick={handleSave}
                className="px-6 py-3 bg-[#39FF14] text-black font-bold border-2 border-black hover:bg-[#32CD32] y2k-hover transition-all flex items-center gap-2 uppercase font-mono tracking-wider active:scale-95 duration-75"
              >
                <Save size={18} />
                Save
              </button>
            </div>
            <p className="mt-3 text-xs font-mono text-slate-500 border-l-2 border-black pl-2">
              > Default: Feb 20, 2026 (SSC Board Exam Start).<br/>
              > Exam ends on March 18, 2026.
            </p>
          </div>

          <div className="h-0.5 bg-black w-full my-6 opacity-20"></div>

          <div>
             <h3 className="text-lg font-bold text-red-600 mb-2 uppercase font-['Rajdhani'] tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                Danger Zone
             </h3>
             <p className="text-sm font-mono text-slate-500 mb-4">
               Executing reset will purge all local storage data. This action is irreversible.
             </p>
             <button 
                onClick={resetData}
                className="px-6 py-3 border-2 border-red-500 text-red-600 font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 uppercase font-mono tracking-wider w-full justify-center shadow-[4px_4px_0px_0px_#dc2626] active:translate-y-1 active:shadow-[1px_1px_0px_0px_#dc2626]"
              >
                <Trash2 size={18} />
                Purge System Data
              </button>
          </div>
        </div>
      </RetroCard>
    </div>
  );
};

export default Settings;