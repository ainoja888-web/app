
import React from 'react';

interface ProgressCircleProps {
  current: number;
  total: number;
  label: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ current, total, label }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="#1a1a1a"
          strokeWidth="12"
          fill="transparent"
        />
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke={percentage > 100 ? '#f43f5e' : '#c5a059'}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease-out' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white tracking-tighter">{Math.round(current)}</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">/ {Math.round(total)} kcal</span>
        <span className="text-[9px] font-black text-[#c5a059] uppercase mt-1 tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );
};
