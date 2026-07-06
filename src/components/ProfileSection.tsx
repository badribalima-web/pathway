import React, { useState, useEffect } from "react";
import { Student, Lesson, Vocabulary, Teacher } from "../types";
import { Award, BookOpen, Star, Flame, Calendar, Clock, Smile, Trash2, ArrowRight, Play, Square, Activity, Percent, User, Sparkles } from "lucide-react";
import { getTeachers, saveStudentProfile } from "../lib/dbService";

interface ProfileSectionProps {
  student: Student | null;
  onUpdateStudent: (updated: Student) => void;
  lessons: Lesson[];
  vocabulary: Vocabulary[];
  isArabic: boolean;
  onOpenAuth: () => void;
  isStudying?: boolean;
  setIsStudying?: (val: boolean) => void;
  studyElapsedSeconds?: number;
  setStudyElapsedSeconds?: (val: number) => void;
  formatDuration?: (secs: number) => string;
}

export default function ProfileSection({
  student,
  onUpdateStudent,
  lessons,
  vocabulary,
  isArabic,
  onOpenAuth,
  isStudying,
  setIsStudying,
  studyElapsedSeconds,
  setStudyElapsedSeconds,
  formatDuration,
}: ProfileSectionProps) {
  
  if (!student) {
    return (
      <div className="space-y-8 animate-fade-in" id="profile-guest-view">
        {/* Header & Stats Banner - PROFILE GUEST */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-rose-500/10">
          <div className="relative z-10 max-w-2xl text-left rtl:text-right space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-400/20 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              {isArabic ? "الملف الشخصي" : "Profile"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight">
              {isArabic ? "الملف الشخصي" : "Profile"}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              {isArabic
                ? "إدارة بيانات حسابك، تتبع تقدمك، والاطلاع على إنجازاتك."
                : "Manage account data, track progress, and view achievements."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-slate-300">
              <div className="bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
                <Award className="w-4 h-4 text-rose-400" />
                <span>
                  {isArabic ? "مستوى الزائر: A1" : "Guest Level: A1"}
                </span>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
                <Star className="w-4 h-4 text-amber-400" />
                <span>
                  {isArabic ? "النقاط المكتسبة: 0" : "Earned Points: 0"}
                </span>
              </div>
            </div>
          </div>
          {/* Background design accents */}
          <div className="absolute right-0 bottom-0 opacity-15 rtl:left-0 rtl:right-auto pointer-events-none">
            <User className="w-72 h-72 -mr-12 -mb-12 text-rose-400" />
          </div>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Smile className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold font-display text-slate-800">
              {isArabic ? "سجل كطالب لمتابعة إنجازك" : "Create a Student Account"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isArabic
                ? "انضم إلينا اليوم لحفظ كلماتك المفضلة، وحل اختبارات القواعد، ومراقبة مستوى تقدمك، والتحدث مع المعلم الذكي لحفظ جلساتك."
                : "Register or log in to track your English proficiency progress, save customized vocabulary lists, study lessons, and chat with teachers."}
            </p>
          </div>

          <button
            onClick={onOpenAuth}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-indigo-100 cursor-pointer"
          >
            {isArabic ? "تسجيل الدخول / إنشاء حساب" : "Sign In / Join Now"}
          </button>
        </div>
      </div>
    );
  }

  // Local fallback states in case they are not passed from parent
  const [localIsStudying, setLocalIsStudying] = useState(false);
  const [localStudySeconds, setLocalStudySeconds] = useState(0);
  
  const activeIsStudying = isStudying !== undefined ? isStudying : localIsStudying;
  const activeStudySeconds = studyElapsedSeconds !== undefined ? studyElapsedSeconds : localStudySeconds;
  
  // Local timer effect in case parent doesn't provide it
  React.useEffect(() => {
    let interval: any = null;
    if (isStudying === undefined && localIsStudying) {
      interval = setInterval(() => {
        setLocalStudySeconds(p => p + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [localIsStudying, isStudying]);

  const handleToggleStudy = async () => {
    if (student) {
      if (activeIsStudying) {
        if (setIsStudying) setIsStudying(false);
        else setLocalIsStudying(false);
        
        const added = activeStudySeconds;
        if (setStudyElapsedSeconds) setStudyElapsedSeconds(0);
        else setLocalStudySeconds(0);
        
        const updated = {
          ...student,
          studySecondsToday: (student.studySecondsToday || 0) + added,
          studySecondsThisWeek: (student.studySecondsThisWeek || 0) + added,
          studySecondsTotal: (student.studySecondsTotal || 0) + added,
        };
        await onUpdateStudent(updated);
      } else {
        if (setIsStudying) setIsStudying(true);
        else {
          setLocalStudySeconds(0);
          setLocalIsStudying(true);
        }
        if (setStudyElapsedSeconds) setStudyElapsedSeconds(0);
      }
    }
  };

  const formatTimeLocal = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (v: number) => String(v).padStart(2, "0");
    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  // Get list of saved words objects
  const savedWordsList = vocabulary.filter(v => student.savedWords.includes(v.id));
  
  // Get list of completed lessons objects
  const completedLessonsList = lessons.filter(l => student.completedLessons.includes(l.id));

  const handleLevelChange = (newLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2") => {
    onUpdateStudent({
      ...student,
      level: newLevel,
      selectedLevelCode: newLevel
    });
  };

  const handleRemoveSavedWord = (wordId: string) => {
    onUpdateStudent({
      ...student,
      savedWords: student.savedWords.filter(id => id !== wordId)
    });
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString(isArabic ? 'ar-EG-u-nu-latn' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="profile-student-view">
      {/* Header & Stats Banner - PROFILE STUDENT */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-rose-500/10">
        <div className="relative z-10 max-w-2xl text-left rtl:text-right space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-400/20 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            {isArabic ? "الملف الشخصي" : "Profile"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight">
            {isArabic ? "الملف الشخصي" : "Profile"}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            {isArabic
              ? "إدارة بيانات حسابك، تتبع تقدمك، والاطلاع على إنجازاتك."
              : "Manage account data, track progress, and view achievements."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-slate-300">
            <div className="bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>
                {isArabic ? `الدروس المكتملة: ${completedLessonsList.length}` : `Completed Lessons: ${completedLessonsList.length}`}
              </span>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
              <Star className="w-4 h-4 text-amber-400" />
              <span>
                {isArabic ? `النقاط: ${student.points || 0}` : `Points: ${student.points || 0}`}
              </span>
            </div>
          </div>
        </div>
        {/* Background design accents */}
        <div className="absolute right-0 bottom-0 opacity-15 rtl:left-0 rtl:right-auto pointer-events-none">
          <User className="w-72 h-72 -mr-12 -mb-12 text-rose-400" />
        </div>
      </div>

      {/* Student Profile Card Header */}
      <div className="bg-gradient-to-br from-white via-indigo-50/15 to-purple-50/20 rounded-3xl border border-indigo-100/70 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left rtl:md:text-right">
            {/* Student Photo */}
            <div className="w-18 h-18 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl uppercase shadow-inner shrink-0">
              {student.name.charAt(0)}
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold font-display text-slate-800">
                {student.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {student.email}
              </p>

              {/* Level Display */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-1.5 justify-center md:justify-start">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isArabic ? "مستوى اللغة الحالي:" : "Current Level:"}
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-indigo-100 font-mono">
                    {student.level}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 justify-center md:justify-start flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isArabic ? "الأستاذ الحالي:" : "Current Teacher:"}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-emerald-100">
                    {student.selectedTeacherName || (isArabic ? "المعلم الأكاديمي" : "Academic Instructor")}
                  </span>
                  {student.allowTeacherChange && (
                    <button
                      onClick={async () => {
                        const confirmReset = window.confirm(
                          isArabic 
                            ? "لقد سمحت لك الإدارة بتغيير الأستاذ. هل ترغب في إعادة تعيين الأستاذ المختار حالياً واختيار أستاذ جديد؟" 
                            : "The administration has allowed you to change your tutor. Would you like to reset your current tutor selection and choose a new one?"
                        );
                        if (confirmReset) {
                          onUpdateStudent({
                            ...student,
                            selectedTeacherId: "",
                            selectedTeacherName: "",
                            allowTeacherChange: true,
                          });
                        }
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg transition-all shadow-xs cursor-pointer animate-pulse"
                    >
                      {isArabic ? "تغيير الأستاذ" : "Change Teacher"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Block Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* 1. Saved Vocabulary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm relative overflow-hidden group flex flex-col justify-between min-h-[140px]">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2">
            <Star className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-xl font-black font-display text-slate-800 font-mono">
              {student.savedWords.length}
            </span>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              {isArabic ? "الكلمات المحفوظة" : "Saved Vocabulary"}
            </p>
          </div>
        </div>

        {/* 2. Completed Lessons */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm relative overflow-hidden group flex flex-col justify-between min-h-[140px]">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block text-xl font-black font-display text-slate-800 font-mono">
              {student.completedLessons.length}
            </span>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              {isArabic ? "الدروس المكتملة" : "Completed Lessons"}
            </p>
          </div>
        </div>
      </div>

      {/* Two Columns List Area (Saved Vocabs & Completed Lessons) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Vocabulary List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-sm font-display flex items-center gap-2">
              <Star className="w-4 h-4 text-teal-600" />
              <span>{isArabic ? "بنك مفرداتي المحفوظة" : "My Saved Dictionary"}</span>
            </h3>

            <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2.5 py-0.5 rounded-full">
              {savedWordsList.length} {isArabic ? "كلمة" : "words"}
            </span>
          </div>

          {savedWordsList.length > 0 ? (
            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {savedWordsList.map((word) => (
                <div
                  key={word.id}
                  className="flex justify-between items-center p-3 bg-slate-50 hover:bg-teal-50/20 border border-slate-200 rounded-xl transition-all"
                >
                  <div className="text-left rtl:text-right space-y-0.5">
                    <span className="font-extrabold text-slate-800 text-sm">{word.word}</span>
                    <p className="text-xs text-teal-600 font-medium">{word.translation}</p>
                    {word.example && <p className="text-[10px] text-slate-400 italic">"{word.example}"</p>}
                  </div>

                  <button
                    onClick={() => handleRemoveSavedWord(word.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
                    title={isArabic ? "إزالة الحفظ" : "Remove bookmark"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
              <Smile className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                {isArabic
                  ? "لم تقم بحفظ أي كلمات حتى الآن. اضغط على علامة الحفظ في صفحة المفردات."
                  : "No bookmark saved. Hit bookmark button on the Vocabulary tab to practice later."}
              </p>
            </div>
          )}
        </div>

        {/* Finished Lessons List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-sm font-display flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>{isArabic ? "الشهادات والدروس المكتملة" : "Finished Certificates & Lessons"}</span>
            </h3>

            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full">
              {completedLessonsList.length} {isArabic ? "درس" : "lessons"}
            </span>
          </div>

          {completedLessonsList.length > 0 ? (
            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {completedLessonsList.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex justify-between items-center p-3 bg-slate-50 hover:bg-indigo-50/20 border border-slate-200 rounded-xl transition-all"
                >
                  <div className="text-left rtl:text-right space-y-0.5">
                    <span className="font-extrabold text-slate-800 text-xs font-display">
                      {isArabic ? lesson.titleAr : lesson.title}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {isArabic ? lesson.category : lesson.category.toUpperCase()} • {lesson.level}
                    </p>
                  </div>

                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                    {isArabic ? "درجة كاملة" : "100% Score"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
              <Smile className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                {isArabic
                  ? "لم تكتمل أي دروس حتى الآن. انطلق لحل اختبارات الدروس وكسب نقاط الطريق!"
                  : "No lessons completed. Take some quizzes on the Lessons tab and gain awesome awards!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
