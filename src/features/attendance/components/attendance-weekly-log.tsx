import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, Clock, Save, CalendarDays, Upload, ChevronDown } from 'lucide-react';
import { startOfWeek, addDays, format, subWeeks, addWeeks, isToday as isDateToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths } from 'date-fns';
import { toast } from 'sonner';

const ATTENDANCE_OPTIONS = [
  { id: 'present', label: 'Present', sub: 'Working day', activeStyle: 'border-emerald-500 bg-emerald-50 ring-emerald-500/20', activeText: 'text-emerald-700', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { id: 'half', label: 'Half day', sub: 'Part-day hours', activeStyle: 'border-amber-500 bg-amber-50 ring-amber-500/20', activeText: 'text-amber-700', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { id: 'absent', label: 'Absent', sub: 'Not at work', activeStyle: 'border-red-500 bg-red-50 ring-red-500/20', activeText: 'text-red-700', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
  { id: 'leave', label: 'Leave', sub: 'Approved time off', activeStyle: 'border-orange-500 bg-orange-50 ring-orange-500/20', activeText: 'text-orange-700', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  { id: 'holiday', label: 'Holiday', sub: 'Day off', activeStyle: 'border-blue-500 bg-blue-50 ring-blue-500/20', activeText: 'text-blue-700', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
];

export function AttendanceWeeklyLog() {
  const [viewMode, setViewMode] = useState<'weekly'|'monthly'>('weekly');
  
  // Weekly State
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Monthly State
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  
  // Shared State
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [attendanceState, setAttendanceState] = useState('present');
  const [savedAttendance, setSavedAttendance] = useState<Record<string, { 
    status: string, 
    feedback: string, 
    reason?: string, 
    absentReason?: string, 
    leaveReason?: string, 
    file?: string,
    startTime?: string,
    startPeriod?: 'AM' | 'PM',
    endTime?: string,
    endPeriod?: 'AM' | 'PM'
  }>>({});
  const [feedback, setFeedback] = useState('');
  const [halfDayReason, setHalfDayReason] = useState('');
  const [absentReason, setAbsentReason] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [savedRecently, setSavedRecently] = useState(false);

  // Time tracking states
  const [startTime, setStartTime] = useState('09:00');
  const [startPeriod, setStartPeriod] = useState<'AM' | 'PM'>('AM');
  const [endTime, setEndTime] = useState('05:00');
  const [endPeriod, setEndPeriod] = useState<'AM' | 'PM'>('PM');

  // Custom dropdown states
  const [startDropdownOpen, setStartDropdownOpen] = useState(false);
  const [endDropdownOpen, setEndDropdownOpen] = useState(false);
  const startDropdownRef = useRef<HTMLDivElement>(null);
  const endDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (startDropdownRef.current && !startDropdownRef.current.contains(e.target as Node)) {
        setStartDropdownOpen(false);
      }
      if (endDropdownRef.current && !endDropdownRef.current.contains(e.target as Node)) {
        setEndDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    if (savedAttendance[dateStr]) {
      setAttendanceState(savedAttendance[dateStr].status);
      setFeedback(savedAttendance[dateStr].feedback || '');
      setHalfDayReason(savedAttendance[dateStr].reason || '');
      setAbsentReason(savedAttendance[dateStr].absentReason || '');
      setLeaveReason(savedAttendance[dateStr].leaveReason || '');
      setUploadedFile(savedAttendance[dateStr].file || null);
      setStartTime(savedAttendance[dateStr].startTime || '09:00');
      setStartPeriod(savedAttendance[dateStr].startPeriod || 'AM');
      setEndTime(savedAttendance[dateStr].endTime || '05:00');
      setEndPeriod(savedAttendance[dateStr].endPeriod || 'PM');
    } else {
      setAttendanceState('present');
      setFeedback('');
      setHalfDayReason('');
      setAbsentReason('');
      setLeaveReason('');
      setUploadedFile(null);
      setStartTime('09:00');
      setStartPeriod('AM');
      setEndTime('05:00');
      setEndPeriod('PM');
    }
  }, [selectedDay, savedAttendance]);

  const isTimeMinuteInvalid = (val: string): boolean => {
    if (!val || !val.includes(':')) return false;
    const parts = val.split(':');
    if (parts.length < 2) return false;
    const m = parseInt(parts[1].replace(/\D/g, ''), 10);
    return !isNaN(m) && m >= 60;
  };

  const isStartMinuteInvalid = isTimeMinuteInvalid(startTime);
  const isEndMinuteInvalid = isTimeMinuteInvalid(endTime);

  const handleSaveAttendance = () => {
    if (isStartMinuteInvalid || isEndMinuteInvalid) {
      toast.error('The minutes you are entering is more than 60 minutes. Please enter correctly.', { id: 'invalid-minute-toast' });
      return;
    }

    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    setSavedAttendance(prev => ({
      ...prev,
      [dateStr]: {
        status: attendanceState,
        feedback: feedback,
        reason: halfDayReason,
        absentReason: absentReason,
        leaveReason: leaveReason,
        file: uploadedFile || undefined,
        startTime,
        startPeriod,
        endTime,
        endPeriod
      }
    }));
    setSavedRecently(true);
    setTimeout(() => setSavedRecently(false), 2000);
  };

  const handleTimeInput = (val: string, setter: (v: string) => void, prev: string) => {
    // If deleting, allow natural backspacing
    if (val.length < prev.length) {
      setter(val);
      return;
    }

    // Keep only numbers and colons
    const cleaned = val.replace(/[^0-9:]/g, '');

    if (cleaned.includes(':')) {
      const parts = cleaned.split(':');
      const h = parts[0].replace(/\D/g, '').slice(0, 2);
      const m = parts.slice(1).join('').replace(/\D/g, '').slice(0, 2);
      if (m.length > 0) {
        const formatted = `${h}:${m}`;
        setter(formatted);
        if (m.length === 2 && parseInt(m, 10) >= 60) {
          toast.error('The minutes you are entering is more than 60 minutes. Please enter correctly.', { id: 'invalid-minute-toast' });
        }
      } else {
        setter(`${h}:`);
      }
      return;
    }

    const digits = cleaned.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      if (digits.length === 2) {
        const num = parseInt(digits, 10);
        if (num > 12) {
          setter(`0${digits[0]}:${digits[1]}`);
          return;
        }
        if (prev.length <= 1) {
          setter(`${digits}:`);
          return;
        }
      }
      setter(digits);
    } else {
      const formatted = `${digits.slice(0, 2)}:${digits.slice(2)}`;
      setter(formatted);
      const mStr = digits.slice(2);
      if (mStr.length === 2 && parseInt(mStr, 10) >= 60) {
        toast.error('The minutes you are entering is more than 60 minutes. Please enter correctly.', { id: 'invalid-minute-toast' });
      }
    }
  };

  const normalizeTimeOnBlur = (val: string, fallback: string): string => {
    const trimmed = val.trim();
    if (!trimmed) return fallback;

    let h = 9;
    let m = 0;

    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      h = parseInt(parts[0], 10);
      const mStr = parts[1] || '';
      if (mStr.length === 1) {
        m = parseInt(mStr + '0', 10);
      } else {
        m = parseInt(mStr, 10) || 0;
      }
    } else {
      const d = trimmed.replace(/\D/g, '');
      if (!d) return fallback;
      if (d.length <= 2) {
        h = parseInt(d, 10);
        m = 0;
      } else {
        h = parseInt(d.slice(0, 2), 10);
        const mStr = d.slice(2);
        m = mStr.length === 1 ? parseInt(mStr + '0', 10) : parseInt(mStr, 10) || 0;
      }
    }

    if (isNaN(h)) h = 9;
    if (isNaN(m)) m = 0;

    if (h > 12) h = 12;
    if (h < 1) h = 12;
    
    if (m >= 60) {
      toast.error('The minutes you are entering is more than 60 minutes. Please enter correctly.', { id: 'invalid-minute-toast' });
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    if (m < 0) m = 0;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const calculateTotalHours = () => {
    if (isStartMinuteInvalid || isEndMinuteInvalid) return '--';
    if (attendanceState === 'absent' || attendanceState === 'leave') return '0h 00m';
    if (attendanceState === 'half') return '4h 00m';

    const parseMinutes = (timeStr: string, period: 'AM' | 'PM') => {
      const parts = timeStr.split(':');
      if (parts.length !== 2) return null;
      let h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (isNaN(h) || isNaN(m)) return null;
      if (period === 'PM' && h < 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const startMin = parseMinutes(startTime, startPeriod);
    const endMin = parseMinutes(endTime, endPeriod);

    if (startMin !== null && endMin !== null) {
      let diff = endMin - startMin;
      if (diff < 0) diff += 24 * 60; // handles overnight shifts
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return `${h}h ${String(m).padStart(2, '0')}m`;
    }
    return '8h 00m';
  };

  // Weekly Functions
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  const handlePrevWeek = () => setCurrentWeekStart((prev) => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1));
  
  // Monthly Functions
  const handlePrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = getDay(monthStart); // 0 (Sun) to 6 (Sat)

  return (
    <div className="w-full h-full flex flex-col gap-2 py-0 overflow-hidden">
      {/* ── Header Toolbar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 shrink-0">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.18em] text-[var(--gold)] uppercase mb-0.5 flex items-center gap-1.5">
            <CalendarDays className="w-3 h-3" />
            ATTENDANCE
          </h2>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--navy)] tracking-tight">
            {viewMode === 'weekly' ? 'Weekly log' : 'Monthly log'}
          </h1>
          <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
            {viewMode === 'weekly' 
              ? `${format(currentWeekStart, 'MMMM yyyy')} · week of ${format(currentWeekStart, 'MMM d')}`
              : format(currentMonth, 'MMMM yyyy')}
          </p>
        </div>
        
        <div className="flex items-center bg-white border border-[var(--border)] rounded-full p-0.5 shadow-sm">
          <button 
            onClick={() => setViewMode('weekly')}
            className={`px-3.5 py-1 text-[11px] font-bold rounded-full transition-all ${viewMode === 'weekly' ? 'bg-[var(--navy)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--navy)] hover:bg-gray-50'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setViewMode('monthly')}
            className={`px-3.5 py-1 text-[11px] font-bold rounded-full transition-all ${viewMode === 'monthly' ? 'bg-[var(--navy)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--navy)] hover:bg-gray-50'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* ── Weekly Top Grid ── */}
      {viewMode === 'weekly' && (
        <div className="flex items-center justify-between gap-1 sm:gap-2 shrink-0 py-1.5">
          <button 
            onClick={handlePrevWeek}
            className="p-1 sm:p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--gold)] hover:bg-[var(--cream)] transition-all shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 flex-1 px-1">
            {weekDays.map((date) => {
              const isSelected = isSameDay(selectedDay, date);
              const isToday = isDateToday(date);
              const dayName = format(date, 'EEE').toUpperCase();
              const dateNum = format(date, 'd');
              const dateKey = format(date, 'yyyy-MM-dd');
              const isSavedPresent = savedAttendance[dateKey]?.status === 'present';
              const isSavedHalf = savedAttendance[dateKey]?.status === 'half';
              const isSavedAbsent = savedAttendance[dateKey]?.status === 'absent';
              const isSavedLeave = savedAttendance[dateKey]?.status === 'leave';
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDay(date)}
                  className={`flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-2xl border transition-all duration-300 outline-none relative group ${
                    isSelected
                      ? isSavedPresent
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 border-transparent shadow-[0_8px_20px_rgba(16,185,129,0.35)] z-10 scale-[1.03]'
                        : isSavedHalf
                          ? 'bg-gradient-to-br from-amber-500 to-amber-600 border-transparent shadow-[0_8px_20px_rgba(245,158,11,0.35)] z-10 scale-[1.03]'
                          : isSavedAbsent
                            ? 'bg-gradient-to-br from-red-500 to-red-600 border-transparent shadow-[0_8px_20px_rgba(239,68,68,0.35)] z-10 scale-[1.03]'
                            : isSavedLeave
                              ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-transparent shadow-[0_8px_20px_rgba(249,115,22,0.35)] z-10 scale-[1.03]'
                              : 'bg-gradient-to-br from-[var(--gold)] to-[#A37525] border-transparent shadow-[0_8px_20px_rgba(184,134,44,0.3)] z-10 scale-[1.03]'
                      : isSavedPresent
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800 shadow-[0_2px_10px_rgba(16,185,129,0.1)] hover:border-emerald-500 hover:shadow-md hover:z-10'
                        : isSavedHalf
                          ? 'bg-amber-50/90 border-amber-300 text-amber-800 shadow-[0_2px_10px_rgba(245,158,11,0.1)] hover:border-amber-500 hover:shadow-md hover:z-10'
                          : isSavedAbsent
                            ? 'bg-red-50/90 border-red-300 text-red-800 shadow-[0_2px_10px_rgba(239,68,68,0.1)] hover:border-red-500 hover:shadow-md hover:z-10'
                            : isSavedLeave
                              ? 'bg-orange-50/90 border-orange-300 text-orange-800 shadow-[0_2px_10px_rgba(249,115,22,0.1)] hover:border-orange-500 hover:shadow-md hover:z-10'
                              : isToday
                                ? 'bg-[#FDFBF7] border-[var(--gold)]/50 shadow-[0_2px_10px_rgba(184,134,44,0.05)] hover:border-[var(--gold)] hover:shadow-md hover:z-10'
                                : 'bg-white/60 border-[var(--border)] hover:bg-white hover:border-[var(--gold)]/40 hover:shadow-md hover:z-10'
                  }`}
                >
                  <span className={`text-[8px] sm:text-[9px] font-bold tracking-widest mb-1 ${
                    isSelected ? 'text-white/80' : 
                    isSavedPresent ? 'text-emerald-700' :
                    isSavedHalf ? 'text-amber-700' :
                    isSavedAbsent ? 'text-red-700' :
                    isSavedLeave ? 'text-orange-700' :
                    isToday ? 'text-[var(--gold)]' : 'text-[var(--text-secondary)]'
                  }`}>
                    {isToday ? 'TODAY' : dayName}
                  </span>
                  <span className={`text-lg sm:text-xl font-bold leading-none inline-flex items-start justify-center ${
                    isSelected 
                      ? 'text-white drop-shadow-sm' 
                      : isSavedPresent 
                        ? 'text-emerald-700' 
                        : isSavedHalf
                          ? 'text-amber-700'
                          : isSavedAbsent
                            ? 'text-red-700'
                            : isSavedLeave
                              ? 'text-orange-700'
                              : 'text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors'
                  }`}>
                    <span>{dateNum}</span>
                    {isSavedPresent && (
                      <sup className={`text-[10px] sm:text-xs font-black ml-0.5 -top-1.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`}>P</sup>
                    )}
                    {isSavedHalf && (
                      <sup className={`text-[10px] sm:text-xs font-black ml-0.5 -top-1.5 ${isSelected ? 'text-white' : 'text-amber-600'}`}>H</sup>
                    )}
                    {isSavedAbsent && (
                      <sup className={`text-[10px] sm:text-xs font-black ml-0.5 -top-1.5 ${isSelected ? 'text-white' : 'text-red-600'}`}>A</sup>
                    )}
                    {isSavedLeave && (
                      <sup className={`text-[10px] sm:text-xs font-black ml-0.5 -top-1.5 ${isSelected ? 'text-white' : 'text-orange-600'}`}>L</sup>
                    )}
                  </span>
                  {isSelected ? (
                    <span className="text-[8px] sm:text-[9px] font-bold text-white/90 mt-1 tracking-widest uppercase animate-in fade-in slide-in-from-bottom-1">
                      Selected
                    </span>
                  ) : isSavedPresent ? (
                    <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600 mt-1 tracking-widest uppercase">
                      Present
                    </span>
                  ) : isSavedHalf ? (
                    <span className="text-[8px] sm:text-[9px] font-bold text-amber-600 mt-1 tracking-widest uppercase">
                      Half Day
                    </span>
                  ) : isSavedAbsent ? (
                    <span className="text-[8px] sm:text-[9px] font-bold text-red-600 mt-1 tracking-widest uppercase">
                      Absent
                    </span>
                  ) : isSavedLeave ? (
                    <span className="text-[8px] sm:text-[9px] font-bold text-orange-600 mt-1 tracking-widest uppercase">
                      Leave
                    </span>
                  ) : (
                    <span className={`text-[8px] sm:text-[10px] mt-1 ${isToday ? 'text-[var(--gold)]/40' : 'text-gray-300'}`}>
                      ●
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <button 
            onClick={handleNextWeek}
            className="p-1 sm:p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--gold)] hover:bg-[var(--cream)] transition-all shrink-0 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className={`grid ${viewMode === 'weekly' ? 'lg:grid-cols-[1fr,1.1fr]' : 'lg:grid-cols-[1fr,1.05fr]'} gap-3 min-h-0 flex-1`}>
        
        {/* ── Monthly Calendar Panel ── */}
        {viewMode === 'monthly' && (
          <div className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(16,42,67,0.04)] border border-[var(--border)] flex flex-col min-h-0 relative">
            <div className="flex items-center justify-between mb-1.5 shrink-0">
              <h3 className="font-bold text-[var(--navy)] text-sm sm:text-base tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h3>
              <div className="flex items-center bg-gray-50 border border-[var(--border)] rounded-full overflow-hidden shadow-sm">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-white text-[var(--text-secondary)] transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5"/>
                </button>
                <div className="w-px h-3 bg-[var(--border)]" />
                <button onClick={handleNextMonth} className="p-1 hover:bg-white text-[var(--text-secondary)] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-1 shrink-0">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} className="text-center text-[9px] font-bold tracking-widest text-[var(--text-secondary)] uppercase py-0.5">
                  {d}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 flex-1 min-h-0 p-0.5">
              {Array.from({length: startOffset}).map((_,i) => <div key={`empty-${i}`} />)}
              {monthDays.map(date => {
                const isSelected = isSameDay(selectedDay, date);
                const isToday = isDateToday(date);
                const dateKey = format(date, 'yyyy-MM-dd');
                const isSavedPresent = savedAttendance[dateKey]?.status === 'present';
                const isSavedHalf = savedAttendance[dateKey]?.status === 'half';
                const isSavedAbsent = savedAttendance[dateKey]?.status === 'absent';
                const isSavedLeave = savedAttendance[dateKey]?.status === 'leave';
                
                return (
                  <button 
                    key={date.toISOString()}
                    onClick={() => setSelectedDay(date)}
                    className={`aspect-square max-h-11 sm:max-h-12 flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all outline-none ${
                      isSelected 
                        ? isSavedPresent
                          ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md scale-105 z-10'
                          : isSavedHalf
                            ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md scale-105 z-10'
                            : isSavedAbsent
                              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md scale-105 z-10'
                              : isSavedLeave
                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md scale-105 z-10'
                                : 'bg-gradient-to-br from-[var(--gold)] to-[#A37525] text-white shadow-md scale-105 z-10'
                        : isSavedPresent
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:border-emerald-500 hover:shadow-sm'
                          : isSavedHalf
                            ? 'bg-amber-50 text-amber-700 border border-amber-300 hover:border-amber-500 hover:shadow-sm'
                            : isSavedAbsent
                              ? 'bg-red-50 text-red-700 border border-red-300 hover:border-red-500 hover:shadow-sm'
                              : isSavedLeave
                                ? 'bg-orange-50 text-orange-700 border border-orange-300 hover:border-orange-500 hover:shadow-sm'
                                : isToday
                                  ? 'bg-[#FDFBF7] text-[var(--gold)] border border-[var(--gold)]/40 hover:border-[var(--gold)] hover:shadow-sm'
                                  : 'bg-white text-[var(--navy)] border border-transparent hover:border-[var(--border)] hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <span className="inline-flex items-start">
                      <span>{format(date, 'd')}</span>
                      {isSavedPresent && (
                        <sup className={`text-[9px] font-black ml-0.5 -top-1 ${isSelected ? 'text-white' : 'text-emerald-600'}`}>P</sup>
                      )}
                      {isSavedHalf && (
                        <sup className={`text-[9px] font-black ml-0.5 -top-1 ${isSelected ? 'text-white' : 'text-amber-600'}`}>H</sup>
                      )}
                      {isSavedAbsent && (
                        <sup className={`text-[9px] font-black ml-0.5 -top-1 ${isSelected ? 'text-white' : 'text-red-600'}`}>A</sup>
                      )}
                      {isSavedLeave && (
                        <sup className={`text-[9px] font-black ml-0.5 -top-1 ${isSelected ? 'text-white' : 'text-orange-600'}`}>L</sup>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Cards Stack / Grid ── */}
        <div className={`flex flex-col gap-2.5 min-h-0 ${viewMode === 'weekly' ? 'contents' : 'flex-1'}`}>
          {/* ── Set Attendance Card ── */}
          <div className={`bg-white rounded-2xl ${viewMode === 'monthly' ? 'p-3 sm:p-3.5 shrink-0' : 'p-4 sm:p-5 flex-1 min-h-0'} shadow-[0_2px_12px_rgba(16,42,67,0.04)] border border-[var(--border)] flex flex-col relative`}>
            {/* Decorative subtle element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--gold)]/5 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none"></div>

            <p className="text-[8px] sm:text-[9px] font-bold tracking-widest text-[var(--text-secondary)] uppercase mb-0.5">
              {format(selectedDay, 'EEEE, MMM d')}
            </p>
            <h3 className={`${viewMode === 'monthly' ? 'text-sm sm:text-base mb-1.5' : 'text-lg sm:text-xl mb-3'} font-bold text-[var(--navy)] tracking-tight`}>Set attendance</h3>
            
            <div className={`grid ${viewMode === 'monthly' ? 'grid-cols-2 sm:grid-cols-3 gap-1.5' : 'grid-cols-1 sm:grid-cols-2 gap-2 flex-1 overflow-y-auto p-1 -m-1'}`}>
              {ATTENDANCE_OPTIONS.map((opt) => {
                const isSelected = attendanceState === opt.id;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAttendanceState(opt.id)}
                    className={`relative flex flex-col items-start ${viewMode === 'monthly' ? 'p-1.5 sm:p-2 rounded-lg' : 'p-3 sm:p-3.5 rounded-xl'} border transition-all duration-300 text-left outline-none ${
                      viewMode === 'monthly'
                        ? (opt.id === 'holiday' ? 'col-span-2 sm:col-span-1' : '')
                        : (opt.id === 'holiday' ? 'sm:col-span-2' : '')
                    } ${
                      isSelected
                        ? `${opt.activeStyle} shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 z-10`
                        : 'bg-white border-[var(--border)] hover:border-gray-300 hover:bg-gray-50/50 hover:shadow-sm hover:z-10'
                    }`}
                  >
                    <span className={`font-bold ${viewMode === 'monthly' ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'} ${isSelected ? opt.activeText : 'text-[var(--navy)]'}`}>
                      {opt.label}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] mt-0.5 font-medium ${isSelected ? opt.activeText : 'text-[var(--text-secondary)]'} line-clamp-1`}>
                      {opt.sub}
                    </span>
                    {isSelected && (
                      <div className={`absolute top-2 right-2 w-3.5 h-3.5 rounded-full ${opt.iconBg} flex items-center justify-center animate-in zoom-in-50 duration-200`}>
                        <Check className={`w-2 h-2 ${opt.iconColor}`} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Time Tracking Card ── */}
          <div className={`bg-white rounded-2xl ${viewMode === 'monthly' ? 'p-3 sm:p-3.5' : 'p-4 sm:p-5'} flex-1 min-h-0 shadow-[0_2px_12px_rgba(16,42,67,0.04)] border border-[var(--border)] flex flex-col relative`}>
            <div className={`flex items-start sm:items-center justify-between ${viewMode === 'monthly' ? 'mb-2' : 'mb-4'} relative z-10 shrink-0`}>
              <div>
                <p className="text-[8px] sm:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">
                  {format(selectedDay, 'EEEE, MMM d')}
                </p>
                <h3 className={`${viewMode === 'monthly' ? 'text-sm sm:text-base' : 'text-lg sm:text-xl'} font-bold text-[var(--navy)] tracking-tight`}>Clock in & out</h3>
              </div>
              <button 
                onClick={() => {
                  setStartTime('09:00');
                  setStartPeriod('AM');
                  setEndTime('05:00');
                  setEndPeriod('PM');
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--border)] text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--navy)] hover:bg-gray-50 transition-colors shadow-sm bg-white cursor-pointer"
              >
                <Clock className="w-2.5 h-2.5" /> Auto-sum
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 relative z-30 shrink-0">
              <div className="flex flex-col">
                <label className={`text-[8px] sm:text-[9px] font-bold tracking-widest uppercase mb-1 ml-0.5 transition-colors ${
                  isStartMinuteInvalid ? 'text-red-600' : 'text-[var(--text-secondary)]'
                }`}>
                  Start Time
                </label>
                <div className={`flex items-center px-2 sm:px-2.5 rounded-lg border transition-all h-[30px] outline-none ${
                  isStartMinuteInvalid
                    ? 'border-red-500 bg-red-50/40 text-red-600 focus-within:border-red-600 focus-within:bg-red-50/60 shadow-sm shadow-red-100/50'
                    : 'border-[var(--border)] bg-gray-50/50 text-[var(--navy)] focus-within:border-[var(--gold)] focus-within:bg-white focus-within:shadow-sm'
                }`}>
                  <input 
                    type="text" 
                    value={startTime}
                    onChange={(e) => handleTimeInput(e.target.value, setStartTime, startTime)}
                    onBlur={() => setStartTime(prev => normalizeTimeOnBlur(prev, '09:00'))}
                    placeholder="09:00"
                    maxLength={5}
                    className={`bg-transparent w-full outline-none focus:outline-none focus:ring-0 font-bold text-xs tracking-wide min-w-0 ${
                      isStartMinuteInvalid 
                        ? 'text-red-600 selection:bg-red-200' 
                        : 'text-[var(--navy)] selection:bg-[var(--gold)]/20'
                    }`} 
                  />
                  <div ref={startDropdownRef} className="relative flex items-center shrink-0">
                    <button 
                      type="button" 
                      onClick={() => {
                        setStartDropdownOpen(prev => !prev);
                        setEndDropdownOpen(false);
                      }}
                      className={`flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded text-[11px] font-bold border-l cursor-pointer outline-none focus:outline-none transition-colors ${
                        isStartMinuteInvalid ? 'border-red-300 text-red-700' : 'border-gray-200'
                      } ${
                        startDropdownOpen
                          ? isStartMinuteInvalid ? 'bg-red-100/70 font-black text-red-800' : 'text-[var(--gold)] bg-amber-50/80 font-black'
                          : isStartMinuteInvalid ? 'hover:bg-red-100/50' : 'text-[var(--navy)] hover:text-[var(--gold)] hover:bg-gray-100/70'
                      }`}
                    >
                      <span>{startPeriod}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                        isStartMinuteInvalid ? 'text-red-400' : 'text-gray-400'
                      } ${startDropdownOpen ? 'rotate-180 text-[var(--gold)]' : ''}`} />
                    </button>

                    {startDropdownOpen && (
                      <div className="absolute top-[calc(100%+6px)] right-0 w-24 bg-white rounded-xl shadow-[0_12px_32px_rgba(16,42,67,0.18)] border border-gray-200/90 p-1.5 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setStartPeriod('AM');
                            setStartDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer outline-none ${
                            startPeriod === 'AM'
                              ? 'bg-[var(--gold)] text-white shadow-xs'
                              : 'text-[var(--navy)] hover:bg-gray-100/80 font-semibold'
                          }`}
                        >
                          <span className="tracking-wide">AM</span>
                          {startPeriod === 'AM' && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStartPeriod('PM');
                            setStartDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer outline-none ${
                            startPeriod === 'PM'
                              ? 'bg-[var(--gold)] text-white shadow-xs'
                              : 'text-[var(--navy)] hover:bg-gray-100/80 font-semibold'
                          }`}
                        >
                          <span className="tracking-wide">PM</span>
                          {startPeriod === 'PM' && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className={`text-[8px] sm:text-[9px] font-bold tracking-widest uppercase mb-1 ml-0.5 transition-colors ${
                  isEndMinuteInvalid ? 'text-red-600' : 'text-[var(--text-secondary)]'
                }`}>
                  End Time
                </label>
                <div className={`flex items-center px-2 sm:px-2.5 rounded-lg border transition-all h-[30px] outline-none ${
                  isEndMinuteInvalid
                    ? 'border-red-500 bg-red-50/40 text-red-600 focus-within:border-red-600 focus-within:bg-red-50/60 shadow-sm shadow-red-100/50'
                    : 'border-[var(--border)] bg-gray-50/50 text-[var(--navy)] focus-within:border-[var(--gold)] focus-within:bg-white focus-within:shadow-sm'
                }`}>
                  <input 
                    type="text" 
                    value={endTime}
                    onChange={(e) => handleTimeInput(e.target.value, setEndTime, endTime)}
                    onBlur={() => setEndTime(prev => normalizeTimeOnBlur(prev, '05:00'))}
                    placeholder="05:00"
                    maxLength={5}
                    className={`bg-transparent w-full outline-none focus:outline-none focus:ring-0 font-bold text-xs tracking-wide min-w-0 ${
                      isEndMinuteInvalid 
                        ? 'text-red-600 selection:bg-red-200' 
                        : 'text-[var(--navy)] selection:bg-[var(--gold)]/20'
                    }`} 
                  />
                  <div ref={endDropdownRef} className="relative flex items-center shrink-0">
                    <button 
                      type="button" 
                      onClick={() => {
                        setEndDropdownOpen(prev => !prev);
                        setStartDropdownOpen(false);
                      }}
                      className={`flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded text-[11px] font-bold border-l cursor-pointer outline-none focus:outline-none transition-colors ${
                        isEndMinuteInvalid ? 'border-red-300 text-red-700' : 'border-gray-200'
                      } ${
                        endDropdownOpen
                          ? isEndMinuteInvalid ? 'bg-red-100/70 font-black text-red-800' : 'text-[var(--gold)] bg-amber-50/80 font-black'
                          : isEndMinuteInvalid ? 'hover:bg-red-100/50' : 'text-[var(--navy)] hover:text-[var(--gold)] hover:bg-gray-100/70'
                      }`}
                    >
                      <span>{endPeriod}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                        isEndMinuteInvalid ? 'text-red-400' : 'text-gray-400'
                      } ${endDropdownOpen ? 'rotate-180 text-[var(--gold)]' : ''}`} />
                    </button>

                    {endDropdownOpen && (
                      <div className="absolute top-[calc(100%+6px)] right-0 w-24 bg-white rounded-xl shadow-[0_12px_32px_rgba(16,42,67,0.18)] border border-gray-200/90 p-1.5 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setEndPeriod('AM');
                            setEndDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer outline-none ${
                            endPeriod === 'AM'
                              ? 'bg-[var(--gold)] text-white shadow-xs'
                              : 'text-[var(--navy)] hover:bg-gray-100/80 font-semibold'
                          }`}
                        >
                          <span className="tracking-wide">AM</span>
                          {endPeriod === 'AM' && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEndPeriod('PM');
                            setEndDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer outline-none ${
                            endPeriod === 'PM'
                              ? 'bg-[var(--gold)] text-white shadow-xs'
                              : 'text-[var(--navy)] hover:bg-gray-100/80 font-semibold'
                          }`}
                        >
                          <span className="tracking-wide">PM</span>
                          {endPeriod === 'PM' && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[8px] sm:text-[9px] font-bold tracking-widest text-[var(--text-secondary)] uppercase mb-1 ml-0.5">Total Hours</label>
                <div className={`px-2.5 rounded-lg border text-xs h-[30px] flex items-center shadow-inner font-bold transition-colors ${
                  isStartMinuteInvalid || isEndMinuteInvalid
                    ? 'border-red-200 bg-red-50/30 text-red-500'
                    : 'border-[var(--gold)]/30 bg-[#FDFBF7] text-[var(--navy)]'
                }`}>
                  {calculateTotalHours()}
                </div>
              </div>
            </div>

            {attendanceState === 'present' && (
              <div className="mt-2.5 pt-2.5 border-t border-[var(--border)] relative z-0 flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[8px] sm:text-[9px] font-bold tracking-widest text-[var(--text-secondary)] uppercase mb-1 block ml-0.5 shrink-0">
                  Feedback of the day
                </label>
                <div className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-gray-50/50 text-[var(--navy)] focus-within:border-[var(--gold)] focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-[var(--gold)]/20 transition-all flex-1 flex flex-col min-h-[60px]">
                  <textarea 
                    placeholder="Enter your feedback or notes for today..." 
                    className="bg-transparent w-full flex-1 outline-none text-xs font-semibold resize-none" 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                {/* Upload option button */}
                <div className="mt-2 shrink-0 flex items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-xs font-bold cursor-pointer transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{uploadedFile ? uploadedFile : 'Upload document'}</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadedFile(file.name);
                      }}
                    />
                  </label>
                  {uploadedFile && (
                    <button 
                      onClick={() => setUploadedFile(null)} 
                      className="text-[10px] text-emerald-700 hover:text-red-600 underline font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            {attendanceState === 'half' && (
              <div className="mt-2.5 pt-2.5 border-t border-[var(--border)] relative z-0 flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[8px] sm:text-[9px] font-bold tracking-widest text-amber-700 uppercase mb-1 block ml-0.5 shrink-0">
                  Reason for the half day
                </label>
                <div className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50/30 text-[var(--navy)] focus-within:border-amber-500 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-amber-500/20 transition-all flex-1 flex flex-col min-h-[60px]">
                  <textarea 
                    placeholder="Enter reason for half day..." 
                    className="bg-transparent w-full flex-1 outline-none text-xs font-semibold resize-none" 
                    value={halfDayReason}
                    onChange={(e) => setHalfDayReason(e.target.value)}
                  />
                </div>

                {/* Upload option button */}
                <div className="mt-2 shrink-0 flex items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold cursor-pointer transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>{uploadedFile ? uploadedFile : 'Upload document'}</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadedFile(file.name);
                      }}
                    />
                  </label>
                  {uploadedFile && (
                    <button 
                      onClick={() => setUploadedFile(null)} 
                      className="text-[10px] text-amber-700 hover:text-red-600 underline font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            {attendanceState === 'absent' && (
              <div className="mt-2.5 pt-2.5 border-t border-[var(--border)] relative z-0 flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[8px] sm:text-[9px] font-bold tracking-widest text-red-700 uppercase mb-1 block ml-0.5 shrink-0">
                  Reason for absent
                </label>
                <div className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50/30 text-[var(--navy)] focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-red-500/20 transition-all flex-1 flex flex-col min-h-[60px]">
                  <textarea 
                    placeholder="Enter reason for absent..." 
                    className="bg-transparent w-full flex-1 outline-none text-xs font-semibold resize-none" 
                    value={absentReason}
                    onChange={(e) => setAbsentReason(e.target.value)}
                  />
                </div>

                {/* Upload option button */}
                <div className="mt-2 shrink-0 flex items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 bg-red-50/70 hover:bg-red-100 text-red-900 text-xs font-bold cursor-pointer transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-red-600" />
                    <span>{uploadedFile ? uploadedFile : 'Upload document'}</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadedFile(file.name);
                      }}
                    />
                  </label>
                  {uploadedFile && (
                    <button 
                      onClick={() => setUploadedFile(null)} 
                      className="text-[10px] text-red-700 hover:text-red-900 underline font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            {attendanceState === 'leave' && (
              <div className="mt-2.5 pt-2.5 border-t border-[var(--border)] relative z-0 flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[8px] sm:text-[9px] font-bold tracking-widest text-orange-700 uppercase mb-1 block ml-0.5 shrink-0">
                  Reason for leave
                </label>
                <div className="px-2.5 py-1.5 rounded-lg border border-orange-200 bg-orange-50/30 text-[var(--navy)] focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-orange-500/20 transition-all flex-1 flex flex-col min-h-[60px]">
                  <textarea 
                    placeholder="Enter reason for leave..." 
                    className="bg-transparent w-full flex-1 outline-none text-xs font-semibold resize-none" 
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                  />
                </div>

                {/* Upload option button */}
                <div className="mt-2 shrink-0 flex items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-300 bg-orange-50/70 hover:bg-orange-100 text-orange-900 text-xs font-bold cursor-pointer transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-orange-600" />
                    <span>{uploadedFile ? uploadedFile : 'Upload document'}</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadedFile(file.name);
                      }}
                    />
                  </label>
                  {uploadedFile && (
                    <button 
                      onClick={() => setUploadedFile(null)} 
                      className="text-[10px] text-orange-700 hover:text-red-600 underline font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={`flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2.5 ${['present', 'half', 'absent', 'leave'].includes(attendanceState) ? '' : 'border-t border-[var(--border)]'} relative z-10 shrink-0 mt-auto`}>
              <p className="text-[11px] font-medium text-[var(--text-secondary)]">Sign in to save your attendance</p>
              <button 
                onClick={handleSaveAttendance}
                className="w-full sm:w-auto flex justify-center items-center gap-1.5 px-3.5 py-1.5 bg-[var(--gold)] text-white rounded-full text-xs font-bold shadow-sm hover:bg-[#A37525] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                {savedRecently ? (
                  <>
                    <Check className="w-3 h-3" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" /> Save attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Stats ── */}
      <div className="bg-[var(--navy)] rounded-2xl p-2.5 sm:py-3 sm:px-5 mt-0 shadow-[0_4px_16px_rgba(16,42,67,0.15)] relative overflow-hidden shrink-0">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--gold)]/10 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#193F66]/40 to-transparent rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] font-bold tracking-widest text-white/60 uppercase">Logged Days</p>
            <p className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-none">0</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] font-bold tracking-widest text-white/60 uppercase">Present</p>
            <p className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-none">0</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] font-bold tracking-widest text-white/60 uppercase">Leave & Holidays</p>
            <p className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-none">0</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] font-bold tracking-widest text-white/60 uppercase">Hours this week</p>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[var(--gold)] tracking-tight leading-none">0h 00m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
