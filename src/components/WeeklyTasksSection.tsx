import React, { useState, useEffect } from "react";
import { WeeklyTask, Student } from "../types";
import { 
  subscribeToStudentWeeklyTasks, 
  saveStudentWeeklyTask, 
  deleteStudentWeeklyTask 
} from "../lib/dbService";
import { 
  CalendarDays, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  BookOpen,
  MessageSquare,
  Volume2,
  PenTool,
  CheckSquare,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

interface WeeklyTasksSectionProps {
  student: Student | null;
  isArabic: boolean;
  onOpenAuth: () => void;
  onUpdateStudent?: (s: Student) => void;
}

const DAYS_OF_WEEK = [
  { key: "saturday", labelEn: "Saturday", labelAr: "السبت" },
  { key: "sunday", labelEn: "Sunday", labelAr: "الأحد" },
  { key: "monday", labelEn: "Monday", labelAr: "الإثنين" },
  { key: "tuesday", labelEn: "Tuesday", labelAr: "الثلاثاء" },
  { key: "wednesday", labelEn: "Wednesday", labelAr: "الأربعاء" },
  { key: "thursday", labelEn: "Thursday", labelAr: "الخميس" },
  { key: "friday", labelEn: "Friday", labelAr: "الجمعة" },
] as const;

const SKILL_TYPES = [
  { value: "Grammar", labelEn: "Grammar", labelAr: "قواعد" },
  { value: "Vocabulary", labelEn: "Vocabulary", labelAr: "مفردات" },
  { value: "Speaking", labelEn: "Speaking", labelAr: "محادثة وتحدث" },
  { value: "Listening", labelEn: "Listening", labelAr: "استماع" },
  { value: "Reading", labelEn: "Reading", labelAr: "قراءة" },
  { value: "Writing", labelEn: "Writing", labelAr: "كتابة" },
  { value: "General", labelEn: "General", labelAr: "عام" },
];

export default function WeeklyTasksSection({
  student,
  isArabic,
  onOpenAuth,
  onUpdateStudent,
}: WeeklyTasksSectionProps) {
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedDay, setSelectedDay] = useState<typeof DAYS_OF_WEEK[number]["key"]>("saturday");
  
  // Form Fields
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState("General");

  const studentId = student?.uid || "guest";

  // Subscribe to student weekly tasks
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToStudentWeeklyTasks(studentId, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [studentId]);

  // Open modal to add a new task for a specific day
  const handleOpenAddModal = (dayKey: typeof DAYS_OF_WEEK[number]["key"]) => {
    setModalMode("add");
    setSelectedDay(dayKey);
    setEditingTaskId(null);
    setFormTitle("");
    setFormDescription("");
    setFormType("General");
    setIsModalOpen(true);
  };

  // Open modal to edit an existing task
  const handleOpenEditModal = (task: WeeklyTask) => {
    setModalMode("edit");
    setSelectedDay(task.day);
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormDescription(task.description || "");
    setFormType(task.type || "General");
    setIsModalOpen(true);
  };

  // Save or Update Task
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    // Determine order
    let taskOrder = 1;
    if (modalMode === "add") {
      const dayTasks = tasks.filter(t => t.day === selectedDay);
      taskOrder = dayTasks.length > 0 ? Math.max(...dayTasks.map(t => t.order)) + 1 : 1;
    } else {
      const existing = tasks.find(t => t.id === editingTaskId);
      taskOrder = existing ? existing.order : 1;
    }

    const taskToSave: WeeklyTask = {
      id: editingTaskId || `task_${Date.now()}`,
      studentId,
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      type: formType,
      completed: modalMode === "edit" ? (tasks.find(t => t.id === editingTaskId)?.completed || false) : false,
      day: selectedDay,
      order: taskOrder,
      createdAt: modalMode === "edit" ? (tasks.find(t => t.id === editingTaskId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    try {
      // Optimistic local update
      if (modalMode === "add") {
        setTasks(prev => [...prev, taskToSave]);
      } else {
        setTasks(prev => prev.map(t => t.id === editingTaskId ? taskToSave : t));
      }

      await saveStudentWeeklyTask(taskToSave);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(isArabic ? "فشل حفظ المهمة." : "Failed to save task.");
    }
  };

  // Toggle Task Completion
  const handleToggleTask = async (task: WeeklyTask) => {
    const updatedTask: WeeklyTask = {
      ...task,
      completed: !task.completed
    };

    try {
      // Optimistic state update
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      await saveStudentWeeklyTask(updatedTask);

      if (updatedTask.completed) {
        // Confetti feedback if all tasks for that day are completed after this toggle
        const dayTasks = tasks.filter(t => t.day === task.day);
        const remainingUncompleted = dayTasks.filter(t => t.id !== task.id && !t.completed);
        if (remainingUncompleted.length === 0) {
          confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.8 }
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError(isArabic ? "فشل تغيير حالة المهمة." : "Failed to toggle task completion.");
    }
  };

  // Delete Task
  const handleDeleteTask = async (task: WeeklyTask) => {
    const confirmMsg = isArabic 
      ? `هل أنت متأكد من حذف مهمة "${task.title}"؟` 
      : `Are you sure you want to delete "${task.title}"?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setTasks(prev => prev.filter(t => t.id !== task.id));
      await deleteStudentWeeklyTask(studentId, task.id);
    } catch (err) {
      console.error(err);
      setError(isArabic ? "فشل حذف المهمة." : "Failed to delete task.");
    }
  };

  // Move Task Up (Reordering)
  const handleMoveUp = async (task: WeeklyTask) => {
    const dayTasks = tasks.filter(t => t.day === task.day).sort((a, b) => a.order - b.order);
    const index = dayTasks.findIndex(t => t.id === task.id);
    if (index === 0) return; // Already at top

    const swapTask = dayTasks[index - 1];
    
    // Swap orders
    const tempOrder = task.order;
    task.order = swapTask.order;
    swapTask.order = tempOrder;

    try {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...task } : t.id === swapTask.id ? { ...swapTask } : t));
      await Promise.all([
        saveStudentWeeklyTask(task),
        saveStudentWeeklyTask(swapTask)
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // Move Task Down (Reordering)
  const handleMoveDown = async (task: WeeklyTask) => {
    const dayTasks = tasks.filter(t => t.day === task.day).sort((a, b) => a.order - b.order);
    const index = dayTasks.findIndex(t => t.id === task.id);
    if (index === dayTasks.length - 1) return; // Already at bottom

    const swapTask = dayTasks[index + 1];

    // Swap orders
    const tempOrder = task.order;
    task.order = swapTask.order;
    swapTask.order = tempOrder;

    try {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...task } : t.id === swapTask.id ? { ...swapTask } : t));
      await Promise.all([
        saveStudentWeeklyTask(task),
        saveStudentWeeklyTask(swapTask)
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to render beautiful category skill icons
  const getTypeIcon = (type?: string) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("grammar") || t.includes("قواعد")) return <BookOpen className="w-3.5 h-3.5" />;
    if (t.includes("vocabulary") || t.includes("مفردات")) return <CheckSquare className="w-3.5 h-3.5" />;
    if (t.includes("speaking") || t.includes("تحدث")) return <MessageSquare className="w-3.5 h-3.5" />;
    if (t.includes("listening") || t.includes("استماع")) return <Volume2 className="w-3.5 h-3.5" />;
    if (t.includes("writing") || t.includes("كتابة")) return <PenTool className="w-3.5 h-3.5" />;
    return <CalendarDays className="w-3.5 h-3.5" />;
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

  // Calculations for total progress
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const totalPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in text-slate-800" id="weekly-tasks-section-root">
      
      {/* 1. COMPREHENSIVE DEFINED HEADER BANNER BOX */}
      <div className="bg-gradient-to-br from-violet-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-violet-500/10">
        <div className="absolute top-0 right-0 w-[45%] h-[90%] pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-400/35 via-transparent to-transparent blur-3xl z-0" />
        
        <div className="relative z-10 max-w-2xl text-left rtl:text-right space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-violet-500/20 text-violet-300 border border-violet-400/20 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            <CalendarDays className="w-3.5 h-3.5 animate-pulse text-violet-400" />
            {isArabic ? "منظم المهام الأسبوعي" : "Weekly Tasks Planner"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight">
            {isArabic ? "جدولك الدراسي المخصص" : "Your Personal Learning Schedule"}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            {isArabic
              ? "قم بتنظيم دراستك اليومية وجدولة أهدافك التعليمية لكل يوم من أيام الأسبوع السبعة. أضف مهامًا غير محدودة، حدد المهارات المطلوبة، وتابع نسبة إنجازك الأسبوعية أولاً بأول."
              : "Organize your daily studies and schedule your educational goals for each day of the week. Add unlimited tasks, define required skills, and track your weekly completion rate."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-slate-300">
            <div className="bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {isArabic ? `المهام المنجزة: ${completedCount} من أصل ${totalCount}` : `Completed Tasks: ${completedCount} of ${totalCount}`}
              </span>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
              <span>{isArabic ? `إجمالي الإنجاز للأسبوع:` : `Weekly Completion Rate:`}</span>
              <span className="text-violet-300 font-black">{totalPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROGRESS ROADMAP BLOCK */}
      {totalCount > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              {isArabic ? "مؤشر التقدم العام لهذا الأسبوع" : "Weekly Study Roadmap Progress"}
            </span>
            <span className="text-sm font-black text-indigo-600 font-mono">{totalPercent}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex gap-2.5 bg-rose-50 border border-rose-100 p-4 rounded-2xl text-xs text-rose-800 leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Guest Notice */}
      {studentId === "guest" && (
        <div className="flex gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-3xl text-xs text-indigo-800 leading-relaxed">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block mb-0.5">{isArabic ? "وضع الزائر النشط" : "Guest Mode Active"}</span>
            <p className="font-medium">
              {isArabic 
                ? "يتم حالياً حفظ المهام في متصفحك مؤقتاً. لتخزينها بشكل دائم على السحابة والوصول إليها من أي جهاز ومزامنتها تلقائياً، يرجى تسجيل الدخول إلى حسابك."
                : "Your tasks are currently saved temporarily in your local browser. Please sign in to securely persist and sync your tasks in the cloud across all your devices."}
            </p>
          </div>
        </div>
      )}

      {/* 3. SEVEN DAYS GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {DAYS_OF_WEEK.map((day) => {
            const dayTasks = tasks.filter(t => t.day === day.key).sort((a, b) => a.order - b.order);
            const completedDayCount = dayTasks.filter(t => t.completed).length;
            const dayPercent = dayTasks.length > 0 ? Math.round((completedDayCount / dayTasks.length) * 100) : 0;

            return (
              <div 
                key={day.key} 
                className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                id={`weekly-day-card-${day.key}`}
              >
                <div>
                  {/* Day Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-black text-slate-800 font-display">
                        {isArabic ? day.labelAr : day.labelEn}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
                        {isArabic ? day.labelEn : day.labelAr}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {dayTasks.length > 0 && (
                        <span className={`text-[9px] font-black font-mono px-2 py-0.5 rounded-lg border ${
                          dayPercent === 100 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-indigo-50 text-indigo-700 border-indigo-100"
                        }`}>
                          {completedDayCount} / {dayTasks.length} ({dayPercent}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5 min-h-[140px] max-h-[350px] overflow-y-auto pr-1">
                    {dayTasks.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 italic text-[11px] font-medium">
                        {isArabic ? "لا توجد مهام مضافة لهذا اليوم" : "No tasks added for this day"}
                      </div>
                    ) : (
                      dayTasks.map((task, idx) => {
                        return (
                          <div
                            key={task.id}
                            className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-2.5 group relative"
                          >
                            {/* Checkbox toggle */}
                            <button
                              onClick={() => handleToggleTask(task)}
                              className="shrink-0 pt-0.5 text-slate-300 hover:text-indigo-600 transition-colors focus:outline-none"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600 fill-indigo-50" />
                              ) : (
                                <Circle className="w-4.5 h-4.5 hover:scale-105 transition-all text-slate-400" />
                              )}
                            </button>

                            {/* Task Content */}
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start gap-1">
                                <h4 className={`text-xs font-bold leading-tight ${
                                  task.completed ? "text-slate-400 line-through font-normal" : "text-slate-700"
                                }`}>
                                  {task.title}
                                </h4>
                                {task.type && (
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shrink-0 border uppercase font-mono ${getTypeStyle(task.type)}`}>
                                    {task.type}
                                  </span>
                                )}
                              </div>
                              {task.description && (
                                <p className={`text-[10px] leading-relaxed mt-0.5 ${
                                  task.completed ? "text-slate-350 line-through" : "text-slate-400 font-medium"
                                }`}>
                                  {task.description}
                                </p>
                              )}
                            </div>

                            {/* Action Buttons (visible on hover) */}
                            <div className="absolute right-2 top-2 rtl:right-auto rtl:left-2 flex items-center bg-white border border-slate-100 shadow-sm rounded-lg py-0.5 px-1 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleMoveUp(task)}
                                disabled={idx === 0}
                                title={isArabic ? "نقل لأعلى" : "Move Up"}
                                className="p-1 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-20"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveDown(task)}
                                disabled={idx === dayTasks.length - 1}
                                title={isArabic ? "نقل لأسفل" : "Move Down"}
                                className="p-1 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-20"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(task)}
                                title={isArabic ? "تعديل" : "Edit"}
                                className="p-1 rounded text-indigo-500 hover:bg-indigo-50"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task)}
                                title={isArabic ? "حذف" : "Delete"}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Card Footer: Add Button */}
                <button
                  onClick={() => handleOpenAddModal(day.key)}
                  className="w-full mt-4 py-2 px-3 border border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/20 hover:bg-indigo-50/25 rounded-2xl text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isArabic ? "إضافة مهمة جديدة" : "Add Task"}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODAL FOR ADDING/EDITING TASKS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-extrabold text-slate-800 font-display text-sm flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-indigo-600" />
                  {modalMode === "add" 
                    ? (isArabic ? `إضافة مهمة جديدة ليوم ${DAYS_OF_WEEK.find(d => d.key === selectedDay)?.labelAr}` : `Add New Task for ${DAYS_OF_WEEK.find(d => d.key === selectedDay)?.labelEn}`)
                    : (isArabic ? "تعديل بيانات المهمة" : "Edit Task details")}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveTask} className="p-6 space-y-4 overflow-y-auto">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">
                    {isArabic ? "عنوان المهمة" : "Task Title"} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isArabic ? "أدخل عنوان المهمة هنا..." : "e.g., Learn passive voice rules"}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-slate-50 placeholder-slate-400"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">
                    {isArabic ? "وصف المهمة (اختياري)" : "Description (Optional)"}
                  </label>
                  <textarea
                    placeholder={isArabic ? "أدخل تفاصيل إضافية للمهمة..." : "e.g., Complete 3 interactive quizzes"}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-slate-50 placeholder-slate-400 resize-none"
                  />
                </div>

                {/* Skill Type Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">
                    {isArabic ? "المهارة / نوع المهمة" : "Skill / Task Type"}
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-slate-50"
                  >
                    {SKILL_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {isArabic ? type.labelAr : type.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Day of Week Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">
                    {isArabic ? "يوم الأسبوع" : "Day of the Week"}
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value as typeof DAYS_OF_WEEK[number]["key"])}
                    className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-slate-50"
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day.key} value={day.key}>
                        {isArabic ? day.labelAr : day.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer text-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isArabic ? "حفظ التغييرات" : "Save Task"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
