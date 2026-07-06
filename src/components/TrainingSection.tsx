import React, { useState, useEffect } from "react";
import { 
  Gamepad2, 
  Languages, 
  Volume2, 
  Sparkles, 
  ArrowUpRight, 
  Compass, 
  Trophy, 
  Flame,
  Award,
  Link2
} from "lucide-react";
import { Student, TrainingLink } from "../types";
import { subscribeToTrainingLinks } from "../lib/dbService";

interface TrainingSectionProps {
  student: Student;
  isArabic: boolean;
  onUpdateStudent: (updated: Student) => void;
  teacherId?: string;
}

export default function TrainingSection({
  student,
  isArabic,
  onUpdateStudent,
  teacherId
}: TrainingSectionProps) {
  const [links, setLinks] = useState<TrainingLink[]>([]);
  const tid = teacherId || student.selectedTeacherId || "teacher-sarah";

  useEffect(() => {
    const unsubscribe = subscribeToTrainingLinks((fetched) => {
      setLinks(fetched);
    }, tid);
    return () => unsubscribe();
  }, [tid]);

  // Filter links for the student's selected level:
  const studentLevel = student.level || "A1";
  const filteredLinks = links.filter(
    (link) => link.level === "All" || link.level === studentLevel
  );

  const stylePresets = [
    {
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50/40 via-white to-amber-50/10 hover:border-amber-300 border-slate-200/80",
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
      icon: Languages
    },
    {
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-indigo-50/40 via-white to-indigo-50/10 hover:border-indigo-300 border-slate-200/80",
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
      icon: Gamepad2
    },
    {
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/10 hover:border-emerald-300 border-slate-200/80",
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      icon: Volume2
    },
    {
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-rose-50/40 via-white to-rose-50/10 hover:border-rose-300 border-slate-200/80",
      iconColor: "text-rose-600 bg-rose-50 border-rose-100",
      icon: Link2
    }
  ];

  return (
    <div className="space-y-8 select-none text-left rtl:text-right font-sans" id="academic-training-portal">
      {/* Premium Hub Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 -mb-12 -ml-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold uppercase tracking-widest font-mono px-2.5 py-0.5 rounded-full border border-indigo-100">
                {isArabic ? "مختبر المهارات اللغوية" : "Pathway Skills Lab"}
              </span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold uppercase tracking-widest font-mono px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-500 animate-pulse" />
                {isArabic ? "تدريب نشط" : "Active Training"}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 leading-tight">
              {isArabic ? "بوابة التدريب التفاعلي الأكاديمي" : "Interactive Academic Training Portal"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
              {isArabic 
                ? "منصتك الأكاديمية الخاصة للتدريبات الخارجية التفاعلية. طور مفرداتك وقواعدك اللغوية ومستوى طلاقة نطقك مباشرة باستخدام أشهر الأدوات والمنصات العالمية."
                : "Your specialized academic lounge for immersive, high-impact external learning utilities. Master vocabulary, grammar, and speaking mechanics instantly."}
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl w-full md:w-auto shrink-0 justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-50 border border-amber-100 text-amber-600 p-2 rounded-xl">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{isArabic ? "مستوى الطالب" : "STUDENT LEVEL"}</span>
                <span className="text-xs font-black text-slate-800">{isArabic ? `المستوى ${student.level || "A1"}` : `Level ${student.level || "A1"}`}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-2 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{isArabic ? "مجموع النقاط" : "TOTAL POINTS"}</span>
                <span className="text-xs font-black text-emerald-700 font-mono">{student.points || 0} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Academic Grid Cards */}
      {filteredLinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="training-cards-grid">
          {filteredLinks.map((tool, idx) => {
            const preset = stylePresets[idx % stylePresets.length];
            const IconComponent = preset.icon;
            return (
              <div 
                key={tool.id}
                className={`group flex flex-col justify-between p-6 sm:p-7 rounded-3xl border ${preset.bgColor} transition-all duration-350 hover:shadow-xl hover:shadow-slate-100/40 hover:-translate-y-1.5`}
              >
                <div className="space-y-4">
                  {/* Icon & Label Bar */}
                  <div className="flex justify-between items-start">
                    <div className={`p-3.5 rounded-2xl border ${preset.iconColor} transition-transform duration-350 group-hover:scale-110 shadow-sm`}>
                      <IconComponent className="w-6 h-6 stroke-[2.2px]" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 font-bold bg-white px-2.5 py-1 border border-slate-150 rounded-xl">
                      <Compass className="w-3 h-3 text-indigo-500 animate-spin-slow" />
                      {tool.level === "All" ? (isArabic ? "عام" : "General") : `${isArabic ? "المستوى" : "Level"} ${tool.level}`}
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                      {isArabic ? tool.nameAr : tool.nameEn}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[3.5rem]">
                      {isArabic ? tool.descAr : tool.descEn}
                    </p>
                  </div>
                </div>

                {/* Start Training Button Link */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-3 px-4 rounded-2xl transition-all shadow-md hover:shadow-indigo-150/40 cursor-pointer"
                  >
                    <span>{isArabic ? "ابدأ التدريب الآن" : "Start Training Now"}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
            <Compass className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700">
              {isArabic ? "لا توجد روابط تدريب متاحة لمستواك حالياً." : "No training links available for your level currently."}
            </p>
            <p className="text-xs text-slate-400">
              {isArabic ? "سيقوم الأستاذ بإضافة تحديات جديدة قريباً." : "Your teacher will post interactive tasks here soon."}
            </p>
          </div>
        </div>
      )}

      {/* Futuristic Placeholder Block */}
      <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-3" id="future-tools-placeholder">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-white border border-slate-150/60 flex items-center justify-center text-slate-400">
          <Sparkles className="w-5 h-5 text-indigo-500/80 animate-pulse" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h5 className="font-extrabold text-slate-800 text-xs">
            {isArabic ? "جاهز لإضافة أدوات وتدريبات جديدة" : "Ready for More Academic Integrations"}
          </h5>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            {isArabic 
              ? "سيقوم أستاذك بإضافة المزيد من التحديات والمواقع التفاعلية لتناسب خطتك التعليمية المتطورة باستمرار."
              : "Your instructor will update this laboratory with new custom interactive links matching your ongoing learning tracks."}
          </p>
        </div>
      </div>
    </div>
  );
}
