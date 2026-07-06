import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SkillLink, Student } from "../types";
import { subscribeToSkillLinks } from "../lib/dbService";
import { 
  Volume2, 
  BookOpen, 
  PenTool, 
  MessageSquare, 
  ExternalLink, 
  Brain,
  Sparkles,
  Award
} from "lucide-react";

interface SkillDevelopmentSectionProps {
  isArabic: boolean;
  student: Student | null;
  teacherId?: string;
}

export default function SkillDevelopmentSection({
  isArabic,
  student,
  teacherId
}: SkillDevelopmentSectionProps) {
  const [links, setLinks] = useState<SkillLink[]>([]);
  const [activeSkill, setActiveSkill] = useState<"all" | "listening" | "reading" | "writing" | "speaking">("all");

  const studentLevel = student?.level || "A1";
  const activeTeacherId = teacherId || student?.selectedTeacherId || "teacher-sarah";

  useEffect(() => {
    const unsub = subscribeToSkillLinks((items) => {
      // Filter links to show only the ones assigned to the student's level
      const levelLinks = items.filter(link => link.level === studentLevel);
      // Sort by order
      levelLinks.sort((a, b) => (a.order || 0) - (b.order || 0));
      setLinks(levelLinks);
    }, activeTeacherId);

    return unsub;
  }, [activeTeacherId, studentLevel]);

  // Skill configuration helper
  const skillConfig = {
    listening: {
      titleAr: "الاستماع (Listening)",
      titleEn: "Listening",
      color: "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100/50",
      badgeColor: "bg-blue-100 text-blue-800",
      icon: Volume2,
      descAr: "طوّر مهارتك في فهم اللكنات المختلفة ومتابعة المحادثات الصوتية والبودكاست.",
      descEn: "Improve your comprehension of different accents, audio conversations, and podcasts."
    },
    reading: {
      titleAr: "القراءة (Reading)",
      titleEn: "Reading",
      color: "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100/50",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: BookOpen,
      descAr: "حسّن سرعتك في القراءة، واستيعاب النصوص، وتوسيع حصيلتك من الكلمات السياقية.",
      descEn: "Enhance your reading speed, textual comprehension, and contextual vocabulary acquisition."
    },
    writing: {
      titleAr: "الكتابة (Writing)",
      titleEn: "Writing",
      color: "bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100/50",
      badgeColor: "bg-purple-100 text-purple-800",
      icon: PenTool,
      descAr: "طوّر مهارات صياغة الجمل، القواعد النحوية، والتعبير الكتابي السليم.",
      descEn: "Develop sentence structure, grammatical accuracy, and effective written expression."
    },
    speaking: {
      titleAr: "التحدث (Speaking)",
      titleEn: "Speaking",
      color: "bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100/50",
      badgeColor: "bg-amber-100 text-amber-800",
      icon: MessageSquare,
      descAr: "عزز طلاقتك في الكلام، ونطقك الصحيح للمخارج الصوتية، والثقة بالنفس.",
      descEn: "Boost your spoken fluency, correct phonetics/pronunciation, and conversational confidence."
    }
  };

  const skills: ("listening" | "reading" | "writing" | "speaking")[] = ["listening", "reading", "writing", "speaking"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto"
      id="skills-development-wrapper"
    >
      {/* Dynamic Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
          <Brain className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>{isArabic ? "برنامج تطوير المهارات" : "Skill Development Program"}</span>
          <span className="bg-indigo-600 text-white rounded-full px-2.5 py-0.5 text-[10px] font-black">
            {studentLevel}
          </span>
        </div>
        <h2 className="text-3xl font-black font-display text-slate-900 leading-tight">
          {isArabic ? `مهارات المستوى اللغوي: ${studentLevel}` : `${studentLevel} Level Skills`}
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
          {isArabic
            ? "بوابة مخصصة ومصممة لتقوية مهاراتك اللغوية الأربعة الأساسية، الروابط أدناه مضافة ومعدلة خصيصاً لمستواك بواسطة أستاذك."
            : "A specialized portal built to strengthen your four fundamental language skills. The links below are custom tailored for your level by your instructor."}
        </p>
      </div>

      {/* Skills Tab Filter Controls */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-slate-100 pb-4">
        <button
          onClick={() => setActiveSkill("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            activeSkill === "all"
              ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {isArabic ? "الكل" : "All Skills"}
        </button>
        {skills.map((skill) => {
          const config = skillConfig[skill];
          const IconComponent = config.icon;
          const isActive = activeSkill === skill;
          return (
            <button
              key={skill}
              onClick={() => setActiveSkill(skill)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <IconComponent className="w-4 h-4 shrink-0" />
              <span>{isArabic ? config.titleAr.split(" ")[0] : config.titleEn}</span>
            </button>
          );
        })}
      </div>

      {/* Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills
          .filter(skill => activeSkill === "all" || activeSkill === skill)
          .map((skill) => {
            const config = skillConfig[skill];
            const IconComponent = config.icon;
            const skillLinks = links.filter(link => link.skillType === skill);

            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                {/* Skill Header Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl border ${config.color} shrink-0`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${config.badgeColor}`}>
                      {isArabic ? config.titleAr : config.titleEn}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 font-display">
                      {isArabic ? config.titleAr : config.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {isArabic ? config.descAr : config.descEn}
                    </p>
                  </div>
                </div>

                {/* Skill Links List */}
                <div className="space-y-3 flex-grow border-t border-slate-100 pt-4">
                  {skillLinks.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-150">
                      <p className="text-xs text-slate-400">
                        {isArabic 
                          ? "لم يضف الأستاذ أي روابط لهذه المهارة بعد." 
                          : "Your teacher hasn't added any links for this skill yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {skillLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100/50 text-slate-700 hover:text-indigo-700 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-indigo-500 shrink-0" />
                            <span className="text-xs font-extrabold truncate pr-2">
                              {link.title}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>
    </motion.div>
  );
}
