
import React, { useState, useMemo } from 'react';
import { SCHEDULE_DATA } from './constants';
import { Department, Lecture } from './types';
import { DepartmentCard } from './components/DepartmentCard';
import { DaySelector } from './components/DaySelector';
import { LectureCard } from './components/LectureCard';
import { FacultyLogo } from './components/FacultyLogo'; // Import the new logo component
import { 
  Calendar, 
  Search, 
  Clock, 
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

const App: React.FC = () => {
  const [selectedDeptCode, setSelectedDeptCode] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state
  const selectedDept = useMemo(
    () => SCHEDULE_DATA.find(d => d.code === selectedDeptCode),
    [selectedDeptCode]
  );

  const activeSchedule = useMemo(() => {
    if (!selectedDept || !selectedDay) return null;
    return selectedDept.schedule.find(s => s.dayName === selectedDay);
  }, [selectedDept, selectedDay]);

  // Group lectures by time
  const groupedLectures = useMemo(() => {
    if (!activeSchedule) return [];
    
    const groups: Record<string, Lecture[]> = {};
    activeSchedule.lectures.forEach(l => {
      const t = l.timeSlot;
      if (!groups[t]) groups[t] = [];
      groups[t].push(l);
    });

    return Object.entries(groups)
      .sort(([t1], [t2]) => t1.localeCompare(t2))
      .map(([time, lectures]) => ({ time, lectures }));
  }, [activeSchedule]);

  // Helper to determine frame color based on time
  const getTimeSlotStyle = (time: string) => {
    if (time.includes('08:30')) return 'bg-emerald-50 border-emerald-200 text-emerald-900';
    if (time.includes('10:30')) return 'bg-sky-50 border-sky-200 text-sky-900';
    if (time.includes('12:30')) return 'bg-indigo-50 border-indigo-200 text-indigo-900';
    if (time.includes('14:30')) return 'bg-orange-50 border-orange-200 text-orange-900';
    return 'bg-gray-50 border-gray-200 text-gray-900';
  };

  // Handlers
  const handleFullReset = () => {
    setSelectedDay(null);
    setSelectedDeptCode(null);
  };

  // Filtered Depts for search
  const filteredDepartments = useMemo(() => {
    if (!searchQuery) return SCHEDULE_DATA;
    return SCHEDULE_DATA.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const DeptIcon = selectedDept ? (iconMap[selectedDept.code] || BookOpen) : BookOpen;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12 overflow-x-hidden">
      {/* Branding Header - Only visible on Home */}
      {!selectedDeptCode && (
        <div className="bg-white border-b border-slate-200 animate-fade-in">
          <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-8 text-center sm:text-left">
             {/* Significantly increased logo container size */}
             <div className="relative w-64 h-64 md:w-96 md:h-96 flex-shrink-0 animate-pop-in hover:scale-105 transition-transform duration-300 text-blue-900">
                <FacultyLogo className="w-full h-full drop-shadow-sm" />
             </div>
             
             <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
               <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 uppercase tracking-tight leading-tight">
                 Faculty of Medical Technology
               </h1>
               <p className="text-blue-600 font-bold tracking-[0.2em] text-base sm:text-xl mt-3">
                 DERNA
               </p>
             </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20 shadow-sm transition-all animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold flex items-center gap-2 text-slate-500 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-slate-400" />
              Academic Schedule
            </h1>
          </div>
          {selectedDeptCode && (
             <button onClick={handleFullReset} className="text-xs font-semibold text-slate-500 hover:text-blue-600 animate-fade-in">
               Home
             </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6">
        
        {/* View 1: Department Selection */}
        {!selectedDeptCode && (
          <div className="animate-fade-in" key="dept-list">
            
            {/* New Compact Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 mt-2 animate-slide-up">
               <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Departments</h2>
                  <p className="text-slate-500 text-sm mt-1">Select a department to view schedules</p>
               </div>
               
               <div className="w-full md:w-72 relative group z-10">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                   <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 flex items-center transition-all duration-200 group-focus-within:border-blue-300 group-focus-within:ring-2 group-focus-within:ring-blue-100">
                      <div className="pl-3 text-slate-400">
                        <Search className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full py-2.5 px-3 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm font-medium rounded-xl focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                   </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDepartments.map((dept, idx) => (
                <DepartmentCard 
                  key={dept.code} 
                  department={dept} 
                  index={idx}
                  onClick={() => {
                    setSelectedDeptCode(dept.code);
                    // Automatically select the first day if available to save a click
                    if(dept.schedule.length > 0) {
                      setSelectedDay(dept.schedule[0].dayName);
                    }
                  }} 
                />
              ))}
              {filteredDepartments.length === 0 && (
                <div className="col-span-full text-center py-16 text-slate-400 animate-fade-in bg-white rounded-2xl border border-dashed border-slate-200">
                  <p>No departments found matching "{searchQuery}"</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-blue-600 font-semibold hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View 2 & 3: Day Selection & Schedule */}
        {selectedDept && (
          <div className="animate-fade-in" key="schedule-view">
            {/* Dept Header */}
            <div className={`p-6 rounded-2xl mb-6 ${selectedDept.color.replace('bg-opacity-30', 'bg-opacity-20')} border border-opacity-20 animate-slide-up relative overflow-hidden flex items-center justify-between`}>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white bg-opacity-80 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                    {selectedDept.code}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 leading-tight">{selectedDept.name}</h2>
                <p className="opacity-80 text-sm font-medium">Weekly Academic Plan</p>
              </div>

               {/* Large Icon */}
              <div className="relative z-10 p-3 bg-white bg-opacity-40 rounded-xl backdrop-blur-sm shadow-sm ml-4">
                 <DeptIcon className="w-10 h-10 sm:w-12 sm:h-12 opacity-80 text-current" />
              </div>
              
              {/* Decorative Background Icon */}
              <DeptIcon className="absolute -right-6 -bottom-6 w-32 h-32 opacity-5 pointer-events-none transform rotate-12" />
            </div>

            {/* Day Selector */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <DaySelector 
                days={selectedDept.schedule} 
                selectedDay={selectedDay} 
                onSelect={setSelectedDay} 
              />
            </div>

            {/* Schedule List */}
            {activeSchedule ? (
              <div className="space-y-6" key={selectedDay}>
                 <div className="flex items-center justify-between mb-2 px-1 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards', animationDuration: '0.3s' }}>
                    <h3 className="text-xl font-bold text-slate-800">
                      {activeSchedule.dayName}
                    </h3>
                    <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                      {activeSchedule.lectures.length} Lectures
                    </span>
                 </div>
                
                {groupedLectures.map(({ time, lectures }, groupIndex) => (
                  <div 
                    key={time} 
                    className={`rounded-2xl border-2 p-5 ${getTimeSlotStyle(time)} shadow-sm animate-slide-up opacity-0`}
                    style={{ 
                      animationDelay: `${50 + (groupIndex * 50)}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4 border-b border-black/5 pb-2">
                       <Clock className="w-5 h-5 opacity-70" />
                       <h4 className="font-bold text-lg tracking-tight">{time}</h4>
                    </div>
                    
                    <div className="grid gap-4">
                      {lectures.map((lecture) => (
                        <LectureCard key={lecture.id} lecture={lecture} hideTime={true} />
                      ))}
                    </div>
                  </div>
                ))}
                
                {groupedLectures.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed animate-fade-in">
                    <p className="text-slate-400">No lectures scheduled for {selectedDay}.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed animate-fade-in">
                <p className="text-slate-400">Please select a day to view the schedule.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
