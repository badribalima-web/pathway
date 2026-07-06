import React, { useState, useEffect } from "react";
import { Video, Sparkles, CalendarDays, Clock, ExternalLink, GraduationCap } from "lucide-react";
import { LiveSession, Student } from "../types";

interface LiveClassesSectionProps {
  sessions?: LiveSession[];
  student: Student | null;
  isArabic: boolean;
}

export default function LiveClassesSection({ sessions = [], student, isArabic }: LiveClassesSectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(student?.level || "A1");

  useEffect(() => {
    if (student?.level) {
      setSelectedLevel(student.level);
    } else {
      setSelectedLevel("A1");
    }
  }, [student?.level]);

  // Filter sessions based on target level:
  const filteredSessions = sessions.filter((session) => {
    const target = session.targetLevel || "جميع المستويات";
    if (selectedLevel === "All") return true;
    return target === "جميع المستويات" || target === selectedLevel;
  });

  const levels = [
    { id: "All", en: "All Levels", ar: "جميع المستويات" },
    { id: "A1", en: "Level A1", ar: "المستوى A1" },
    { id: "A2", en: "Level A2", ar: "المستوى A2" },
    { id: "B1", en: "Level B1", ar: "المستوى B1" },
    { id: "B2", en: "Level B2", ar: "المستوى B2" },
    { id: "C1", en: "Level C1", ar: "المستوى C1" },
    { id: "C2", en: "Level C2", ar: "المستوى C2" },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left rtl:text-right font-sans" id="live-classes-view">
      {/* Premium Top Navigation Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm" id="live-navbar-head">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 stroke-[2.2px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                {isArabic ? "الحصص المباشرة واللقاءات" : "Virtual Classrooms"}
              </h3>
              <span className="text-[9px] bg-purple-50 text-purple-700 font-extrabold px-2 py-0.5 rounded-md border border-purple-100 uppercase tracking-wider">
                {isArabic ? "تفاعلي" : "Live"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {isArabic ? "انضم للحصص التفاعلية وورش العمل المباشرة" : "Join interactive workshops and scheduled video sessions"}
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-full sm:w-auto justify-center sm:justify-start">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500">
            {isArabic ? "مستعد لاستقبال الحصص" : "Ready for Broadcasting"}
          </span>
        </div>
      </div>

      {/* Level Display (no switcher) */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex items-center gap-2.5 w-fit">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          {isArabic ? "المستوى الحالي:" : "Current Level:"}
        </span>
        <span className="px-3 py-1 bg-purple-50 border border-purple-100 text-purple-700 rounded-full text-xs font-black">
          {selectedLevel}
        </span>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="live-sessions-grid">
          {filteredSessions.map((session) => {
            const isLive = session.status === "live";
            return (
              <div
                key={session.id}
                className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[220px] ${
                  isLive ? "border-purple-300 ring-2 ring-purple-100" : "border-slate-200"
                }`}
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 inset-x-0 h-1.5 ${isLive ? "bg-purple-500" : "bg-slate-200"}`} />

                <div className="space-y-4">
                  {/* Status & Level Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isLive
                          ? "bg-rose-50 text-rose-700 border border-rose-100 animate-pulse"
                          : "bg-purple-50 text-purple-700 border border-purple-100"
                      }`}
                    >
                      {isLive ? (
                        <>
                          <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-ping" />
                          {isArabic ? "مباشر الآن" : "Live Now"}
                        </>
                      ) : (
                        <>
                          <CalendarDays className="w-3 h-3 text-purple-600" />
                          {isArabic ? "قادمة قريباً" : "Scheduled"}
                        </>
                      )}
                    </span>

                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full border border-indigo-100">
                      {isArabic ? "المستوى: " : "Level: "}
                      {session.targetLevel || (isArabic ? "جميع المستويات" : "All Levels")}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                      {session.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {session.description}
                    </p>
                  </div>

                  {/* Date and Time info */}
                  <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px] font-semibold border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.teacherName || (isArabic ? "الأستاذ" : "Instructor")}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <a
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      isLive
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-100"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    <span>{isArabic ? "انضم للحصة الآن" : "Join Session Now"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Main Empty State Container */
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-6" id="live-empty-state">
          {/* Animated Icon Ring */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-100/50 rounded-full animate-ping duration-1000 opacity-75" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
              <Video className="w-8 h-8 stroke-[1.8px]" />
            </div>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {isArabic ? "بوابة الحصص المباشرة شاغرة حالياً" : "Virtual Classroom is Currently Empty"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {isArabic
                ? "القسم جاهز بالكامل ومعدّ تقنياً لبث المحاضرات واللقاءات الحية. سيقوم الأستاذ بإشعارك وإضافة المواعيد هنا فور جدولة حصة البث القادمة."
                : "This workspace is optimized and fully prepared to host live streaming sessions. Your instructor will update this area with direct links once the next live schedule is set."}
            </p>
          </div>

          {/* Features Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-4 text-right">
            <div className="flex items-center gap-2.5 p-3.5 bg-slate-50/60 border border-slate-150/50 rounded-2xl">
              <CalendarDays className="w-4 h-4 text-purple-500 shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 leading-none">
                {isArabic ? "تنبيهات فورية بالجدول الجديد" : "Instant schedule notifications"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 bg-slate-50/60 border border-slate-150/50 rounded-2xl">
              <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 leading-none">
                {isArabic ? "ربط تلقائي مع غرف البث" : "Direct access to streaming rooms"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
