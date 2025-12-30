import React, { useState } from 'react';
import { Minus, Square, X } from 'lucide-react';

interface RetroCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerColor?: string;
  delay?: string;
  initialMinimized?: boolean;
  onClose?: () => void;
}

export const RetroCard: React.FC<RetroCardProps> = ({ 
  title, children, className, headerColor = "bg-white", delay = "", initialMinimized = false, onClose
}) => {
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const [isClosed, setIsClosed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  if (isClosed) return null;

  const handleClose = () => {
    setIsClosed(true);
    if (onClose) onClose();
  };

  return (
    <div className={`bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000000] flex flex-col ${className} animate-slide-up ${delay} transition-all duration-200 ${isMinimized ? 'h-auto' : ''} ${isMaximized ? 'fixed inset-4 z-50 shadow-[10px_10px_0px_0px_#000000]' : 'relative'}`}>
      <div 
        className={`${headerColor} border-b-2 border-black p-2 flex justify-between items-center select-none cursor-default`}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        <span className="font-bold text-sm tracking-wider uppercase font-['Rajdhani'] flex items-center gap-2 truncate pr-2">
           {/* Window Icon (Simulated) */}
           <div className="w-2 h-2 bg-black rounded-full"></div>
           {title}
        </span>
        <div className="flex gap-1 ml-2 shrink-0">
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="w-5 h-5 border border-black bg-white flex items-center justify-center hover:bg-slate-200 active:bg-black active:text-white transition-colors group"
            title="Minimize"
          >
            <Minus size={10} className="group-active:stroke-white" />
          </button>
          <button 
            onClick={() => { setIsMaximized(!isMaximized); setIsMinimized(false); }} 
            className="w-5 h-5 border border-black bg-white flex items-center justify-center hover:bg-blue-300 active:bg-blue-500 active:text-white transition-colors group"
            title={isMaximized ? "Restore" : "Maximize"}
          >
             <Square size={8} className="group-active:stroke-white" />
          </button>
          <button 
            onClick={handleClose} 
            className="w-5 h-5 border border-black bg-white flex items-center justify-center hover:bg-red-500 hover:text-white active:bg-red-700 transition-colors group"
            title="Close"
          >
             <X size={12} className="group-active:stroke-white" />
          </button>
        </div>
      </div>
      {!isMinimized && (
        <div className={`p-5 relative animate-fade-in overflow-auto ${isMaximized ? 'flex-1' : 'flex-1'}`}>
          {children}
        </div>
      )}
    </div>
  );
};