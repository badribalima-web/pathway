import React from "react";
import { 
  Compass, 
  Target, 
  CheckCircle, 
  Mail, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Sparkles,
  Award
} from "lucide-react";

interface AboutUsSectionProps {
  isArabic: boolean;
}

export default function AboutUsSection({ isArabic }: AboutUsSectionProps) {
  // Goals list
  const goalsAr = [
    "تسهيل تعلم اللغات.",
    "مساعدة الطلاب على تحقيق نتائج أفضل في الاختبارات الدولية (مثل IELTS).",
    "توفير محتوى تعليمي منظم واحترافي.",
    "بناء مجتمع تعليمي تفاعلي."
  ];

  const goalsEn = [
    "Facilitating language learning.",
    "Helping students achieve better results in international exams (like IELTS).",
    "Providing organized and professional educational content.",
    "Building an interactive educational community."
  ];

  // Features list
  const featuresAr = [
    "دروس تفاعلية لتبسيط الفهم",
    "تمارين عملية مكثفة وشاملة",
    "متابعة دقيقة لمستوى التقدم",
    "مهام يومية وأسبوعية مخصصة",
    "حصص تفاعلية مباشرة مع الأساتذة"
  ];

  const featuresEn = [
    "Interactive lessons for simple understanding",
    "Intense and comprehensive practice exercises",
    "Accurate progress tracking",
    "Customized daily and weekly tasks",
    "Direct live interactive sessions with teachers"
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto" id="about-us-view">
      
      {/* Hero Platform Overview Header Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl text-center sm:text-left rtl:sm:text-right">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
             <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">
              {isArabic ? "منصة Pathway Languages التعليمية" : "PATHWAY LANGUAGES PLATFORM"}
            </span>
          </div>
          
          <h2 className="text-2.5xl sm:text-4.5xl font-black font-display tracking-tight leading-tight">
            {isArabic ? "تعليم لغات حديث ومنهجي لتفوقك الدراسي والمهني" : "Modern Language Learning Crafted for Your Success"}
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl font-medium">
            {isArabic 
              ? "Pathway Languages هي منصة تعليمية رقمية حديثة تهدف إلى مساعدة الطلاب على تعلم اللغات والتحضير للاختبارات الدولية مثل IELTS بطريقة منظمة وسهلة. نوفر دروسًا تفاعلية، تمارين عملية، متابعة للتقدم، مهام يومية وأسبوعية، وحصصًا تفاعلية مع الأساتذة لمساعدة الطلاب على تحقيق أهدافهم التعليمية." 
              : "Pathway Languages is a modern digital educational platform aiming to help students learn languages and prepare for international exams like IELTS in an organized and easy way. We provide interactive lessons, practical exercises, progress tracking, daily and weekly tasks, and live interactive sessions with instructors to help students reach their learning milestones."}
          </p>
        </div>
      </div>

      {/* Vision & Mission Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vision */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm text-left rtl:text-right space-y-4 hover:border-indigo-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Compass className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-base font-black text-slate-800">
            {isArabic ? "رؤيتنا" : "Our Vision"}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            {isArabic 
              ? "أن نصبح من أفضل المنصات التعليمية الرقمية لتعلم اللغات وتطوير المهارات الأكاديمية." 
              : "To become one of the premier digital educational platforms for language learning and academic skill development."}
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm text-left rtl:text-right space-y-4 hover:border-emerald-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Target className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-base font-black text-slate-800">
            {isArabic ? "رسالتنا" : "Our Mission"}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            {isArabic 
              ? "توفير تعليم عالي الجودة بأسلوب حديث وممتع يناسب جميع المستويات." 
              : "Providing high-quality education using modern and engaging approaches tailored to all learning levels."}
          </p>
        </div>
      </div>

      {/* Objectives / Goals */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="text-left rtl:text-right">
          <h3 className="text-base font-black text-slate-800">
            {isArabic ? "أهدافنا" : "Our Goals"}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isArabic ? "الركائز التي نسعى لتحقيقها مع طلابنا" : "The pillars we strive to build with our students"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(isArabic ? goalsAr : goalsEn).map((goal, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-750 font-semibold leading-relaxed">{goal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features List Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="text-left rtl:text-right flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-black text-slate-800">
            {isArabic ? "مميزات المنصة التعليمية" : "Platform Educational Features"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(isArabic ? featuresAr : featuresEn).map((feat, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-indigo-50/20 text-left rtl:text-right flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Contact and Social Media Links */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-lg space-y-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
        
        <div className="text-left rtl:text-right space-y-2">
          <h3 className="text-xl font-extrabold font-display">
            {isArabic ? "تواصل معنا" : "Contact & Support"}
          </h3>
          <p className="text-xs text-slate-400">
            {isArabic ? "يسعدنا الإجابة عن أي استفسار ومساعدتك في التسجيل" : "We are here to assist with any questions or enrollment inquiries"}
          </p>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="mailto:ieltspathway9@gmail.com"
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {isArabic ? "البريد الإلكتروني" : "Gmail"}
              </span>
              <span className="text-xs font-bold text-slate-200 break-all">ieltspathway9@gmail.com</span>
            </div>
          </a>

          <a
            href="https://wa.me/213673708074"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {isArabic ? "واتساب للدعم" : "WhatsApp Chat"}
              </span>
              <span className="text-xs font-bold text-slate-200">+213 673 70 80 74</span>
            </div>
          </a>
        </div>

        {/* Social Media channels */}
        <div className="pt-6 border-t border-white/10 text-center sm:text-left rtl:sm:text-right space-y-4">
          <h4 className="text-xs font-black uppercase text-indigo-300 tracking-wider">
            {isArabic ? "تابعنا على مواقع التواصل الاجتماعي" : "Follow Us on Social Media"}
          </h4>

          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <a
              href="https://www.facebook.com/profile.php?id=61591386081245"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4.5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-600/10 transition-all text-xs font-bold text-slate-200"
            >
              <Facebook className="w-4 h-4 text-blue-500" />
              <span>Facebook</span>
            </a>

            <a
              href="https://www.instagram.com/pathwayielts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4.5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-600/10 transition-all text-xs font-bold text-slate-200"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>Instagram</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
