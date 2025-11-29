
import React from 'react';
import { Department } from '../types';
import { 
  ChevronRight, 
  Microscope, 
  Dna, 
  FlaskConical, 
  Scan, 
  Smile, 
  Pill, 
  ShieldPlus, 
  Apple, 
  Stethoscope, 
  BookOpen 
} from 'lucide-react';

interface DepartmentCardProps {
  department: Department;
  onClick: () => void;
  index?: number;
}

const iconMap: Record<string, React.ElementType> = {
  'BS': Microscope,
  'GEN': Dna,
  'LM': FlaskConical,
  'RAD': Scan,
  'DENT': Smile,
  'DRUG': Pill,
  'PHG': ShieldPlus,
  'PHNUT': Apple,
  'MC.CCA': Stethoscope,
  'GR': BookOpen
};

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onClick, index = 0 }) => {
  const Icon = iconMap[department.code] || BookOpen;

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${index * 100}ms` }}
      className={`w-full text-left p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center group border border-transparent hover:border-gray-200 ${department.color} bg-opacity-30 animate-slide-up opacity-0 fill-mode-forwards`}
    >
      {/* Icon Container */}
      <div className="p-3 rounded-xl bg-white bg-opacity-60 shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
        <Icon className="w-6 h-6 opacity-80" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
           <span className="text-[10px] font-black uppercase tracking-widest opacity-60 bg-white bg-opacity-50 px-1.5 py-0.5 rounded-md">
             {department.code}
           </span>
        </div>
        <h3 className="text-lg font-bold truncate leading-tight">{department.name}</h3>
        <p className="text-xs opacity-70 mt-1 font-medium">{department.schedule.length} Days Scheduled</p>
      </div>

      {/* Chevron */}
      <div className="bg-white bg-opacity-40 p-2 rounded-full group-hover:bg-opacity-80 transition-all duration-300 transform group-hover:translate-x-1 flex-shrink-0 ml-2">
        <ChevronRight className="w-5 h-5 opacity-60" />
      </div>
    </button>
  );
};
