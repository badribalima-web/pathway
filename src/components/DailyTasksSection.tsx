import React, { useState, useEffect } from "react";
import { WeeklyTask, Student } from "../types";
import { subscribeToStudentWeeklyTasks, saveStudentWeeklyTask } from "../lib/dbService";
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  RefreshCw,
  Calendar,
  BookOpen,
  MessageSquare,
  Volume2,
  PenTool,
  CheckSquare
} from "lucide-react";
import confetti from "canvas-confetti";

interface DailyTasksSectionProps {
  student: Student | null;
  isArabic: boolean;
  onOpenAuth: () => void;
  onUpdateStudent?: (s: Student) => void;
}

export default function DailyTasksSection({
  student,
  isArabic,
  onOpenAuth,
  onUpdateStudent,
}: DailyTasksSectionProps) {
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current day of the week in English lowercase, e.g., "monday"
  const currentDayName = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

  const studentId = student?.uid || "guest";

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to student's own weekly tasks
    const unsubscribe = subscribeToStudentWeeklyTasks(studentId, (fetchedTasks) => {
      // Filter tasks for the current day and sort by order
      const filtered = fetchedTasks.filter((t) => t.day === currentDayName);
      const sorted = filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
      setTasks(sorted);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [studentId, currentDayName]);

  const handleToggleTask = async (task: WeeklyTask) => {
    const updatedTask: WeeklyTask = {
      ...task,
      completed: !task.completed
    };

    try {
      // Update local state immediately for rapid feedback
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      
      await saveStudentWeeklyTask(updatedTask);

      if (updatedTask.completed) {
        // Confetti if all current day's tasks are completed
        const remainingUncompleted = tasks.filter(t => t.id !== task.id && !t.completed);
        if (remainingUncompleted.length === 0) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.75 }
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError(isArabic ? "فشل حفظ حالة المهمة." : "Failed to save task status.");
    }
  };

  const getDayLabel = () => {
    const dayLabelsAr: Record<string, string> = {
      saturday: "السبت",
      sunday: "الأحد",
      monday: "الإثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
    };
    const dayLabelsEn: Record<string, string> = {
      saturday: "Saturday",
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
    };
    return isArabic ? dayLabelsAr[currentDayName] : dayLabelsEn[currentDayName];
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Helper to render beautiful category skill icons
  const getTypeIcon = (type?: string) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("grammar") || t.includes("قواعد")) return <BookOpen className="w-3.5 h-3.5" />;
    if (t.includes("vocabulary") || t.includes("مفردات")) return <CheckSquare className="w-3.5 h-3.5" />;
    if (t.includes("speaking") || t.includes("تحدث")) return <MessageSquare className="w-3.5 h-3.5" />;
    if (t.includes("listening") || t.includes("استماع")) return <Volume2 className="w-3.5 h-3.5" />;
    if (t.includes("writing") || t.includes("كتابة")) return <PenTool className="w-3.5 h-3.5" />;
    return <Calendar className="w-3.5 h-3.5" />;
  };

  // Helper to get type styling
  const getTypeStyle = (type?: string) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("grammar") || t.includes("قواعد")) return "bg-violet-50 text-violet-700 border-violet-100";
    if (t.includes("vocabulary") || t.includes("مفردات")) return "bg-amber-50 text-amber-700 border-amber-100";
    if (t.includes("speaking") || t.includes("تحدث")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (t.includes("listening") || t.includes("استماع")) return "bg-blue-50 text-blue-700 border-blue-100";
    if (t.includes("writing") || t.includes("كتابة")) return "bg-pink-50 text-pink-700 border-pink-100";
    return "bg-slate-50 text-slate-700 border-slate-100";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5" id="daily-current-tasks-container">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="text-left rtl:text-right">
          <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 uppercase tracking-wider inline-flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            {getDayLabel()}
          </span>
          <h3 className="text-sm font-black text-slate-800 font-display mt-2">
            {isArabic ? "مهامك لليوم الحالي" : "Your Tasks Today"}
          </h3>
        </div>
        <div className="text-right rtl:text-left font-mono">
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
            {completedCount} / {tasks.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 italic text-xs font-semibold space-y-2">
            <p>
              {isArabic 
                ? "لا توجد مهام مضافة لليوم الحالي." 
                : "No tasks created for today."}
            </p>
            <p className="text-[10px] text-slate-400 not-italic">
              {isArabic 
                ? "أضف مهامك الأسبوعية من قسم المهام لتنظيم دراستك!" 
                : "Add tasks in the Weekly Tasks section to organize your learning!"}
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const isCompleted = task.completed;
            return (
              <button
                key={task.id}
                onClick={() => handleToggleTask(task)}
                className="w-full p-3.5 text-left rtl:text-right hover:bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex items-start gap-3 cursor-pointer focus:outline-none"
                id={`daily-current-task-item-${task.id}`}
              >
                <div className="shrink-0 pt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-50" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500 transition-colors" />
                  )}
                </div>

                <div className="flex-grow space-y-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-xs font-extrabold leading-relaxed ${
                      isCompleted ? "text-slate-400 line-through font-normal" : "text-slate-700"
                    }`}>
                      {task.title}
                    </h4>
                    {task.type && (
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border shrink-0 inline-flex items-center gap-1 uppercase font-mono ${getTypeStyle(task.type)}`}>
                        {getTypeIcon(task.type)}
                        {task.type}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className={`text-[10px] leading-normal ${isCompleted ? "text-slate-350 line-through" : "text-slate-400"}`}>
                      {task.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Mini Progress Bar if there are tasks */}
      {tasks.length > 0 && (
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            <span>{isArabic ? "مستوى الإنجاز لليوم" : "Today's Completion Rate"}</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
            <div 
              className="h-full bg-rose-500 rounded-full transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
