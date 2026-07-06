import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  MessageSquare, 
  Video, 
  CheckSquare, 
  Calendar, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  Globe,
  Lightbulb,
  Gamepad2,
  PlayCircle,
  Brain
} from "lucide-react";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isArabic: boolean;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  unreadCount?: number;
}

export default function SidebarMenu({
  isOpen,
  onClose,
  currentTab,
  setCurrentTab,
  isArabic,
  onOpenAuth,
  isLoggedIn,
  unreadCount = 0,
}: SidebarMenuProps) {

  const menuItems = [
    {
      id: "live",
      labelEn: "Interactive Classes",
      labelAr: "الحصص التفاعلية",
      descEn: "View upcoming real-time streaming seminars",
      descAr: "استعرض وانضم للحصص والندوات المباشرة والمجدولة",
      Icon: Video,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      requiresLogin: false
    },
    {
      id: "recorded_lessons",
      labelEn: "Recorded Sessions",
      labelAr: "الحصص المسجلة",
      descEn: "Watch recorded classes uploaded by your teacher",
      descAr: "شاهد الحصص والدروس المسجلة لمراجعتها وتثبيت الفهم",
      Icon: PlayCircle,
      color: "text-rose-650 bg-rose-50 border-rose-100",
      requiresLogin: false
    },
    {
      id: "training",
      labelEn: "Interactive Training",
      labelAr: "التدريب التفاعلي",
      descEn: "Practice speaking, speed-typing, and write essays",
      descAr: "طور نطقك، سرعتك في الكتابة، وحسّن صياغتك للمقالات التعبيرية",
      Icon: Gamepad2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      requiresLogin: true
    },
    {
      id: "tasks_weekly",
      labelEn: "Weekly Tasks",
      labelAr: "المهام الأسبوعية",
      descEn: "Review weekly study plans and progress meter",
      descAr: "تصفح خطة الأسبوع التعليمية كاملة ونسبة إنجازك",
      Icon: Calendar,
      color: "text-sky-600 bg-sky-50 border-sky-100",
      requiresLogin: true
    },
    {
      id: "skills_development",
      labelEn: "Skill Development",
      labelAr: "تطوير المهارات",
      descEn: "Improve your Listening, Reading, Writing, and Speaking",
      descAr: "طوّر مهاراتك في الاستماع والقراءة والكتابة والتحدث من خلال روابط مخصصة لمستواك",
      Icon: Brain,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      requiresLogin: true
    },
    {
      id: "about",
      labelEn: "About Us",
      labelAr: "حولنا",
      descEn: "Learn about Pathway Languages vision and contact details",
      descAr: "تعرّف على رؤية وأهداف المنصة ووسائل التواصل معنا",
      Icon: Info,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      requiresLogin: false
    }
  ];

  const handleItemClick = (id: string, requiresLogin: boolean) => {
    if (requiresLogin && !isLoggedIn) {
      onClose();
      onOpenAuth();
      return;
    }
    setCurrentTab(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 cursor-pointer"
            id="sidebar-menu-overlay"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: isArabic ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 ${
              isArabic ? "right-0" : "left-0"
            } w-full max-w-[380px] bg-white border-l border-r border-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 flex flex-col justify-between overflow-hidden select-none`}
            id="sidebar-menu-drawer"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="text-left rtl:text-right">
                <h3 className="text-sm font-black font-display tracking-wider text-slate-800 uppercase">
                  {isArabic ? "بوابة الخدمات" : "SERVICES GATEWAY"}
                </h3>
                <p className="text-[10px] text-slate-450 font-bold mt-0.5">
                  {isArabic ? "تصفح الأقسام والمهام التفاعلية" : "Explore interactive portals & goals"}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-200/40 bg-white shadow-sm"
                title={isArabic ? "إغلاق" : "Close"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {menuItems.map((item) => {
                const isSelected = currentTab === item.id;
                const Icon = item.Icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id, item.requiresLogin)}
                    className={`w-full p-4 rounded-2xl border text-left rtl:text-right flex items-center gap-4 transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer group ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "bg-white border-slate-200/75 hover:border-slate-350 text-slate-800"
                    }`}
                  >
                    {/* Icon container */}
                    <div className={`p-2.5 rounded-xl shrink-0 border ${
                      isSelected ? "bg-white/20 border-white/10 text-white" : item.color
                    }`}>
                      <Icon className="w-5 h-5 stroke-[2.2px]" />
                    </div>

                    {/* Text Details */}
                    <div className="flex-grow space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm tracking-tight truncate">
                          {isArabic ? item.labelAr : item.labelEn}
                        </h4>
                        {item.id === "chat" && unreadCount > 0 && (
                          <span className="bg-rose-500 text-white text-[9px] font-black font-mono w-4.5 h-4.5 flex items-center justify-center rounded-full animate-pulse">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] leading-relaxed truncate ${
                        isSelected ? "text-indigo-150 font-medium" : "text-slate-400"
                      }`}>
                        {isArabic ? item.descAr : item.descEn}
                      </p>
                    </div>

                    {/* Arrow Indicator */}
                    <div className={`shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${
                      isSelected ? "text-white" : "text-slate-400"
                    }`}>
                      {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}

              {/* Login warning helper if not logged in */}
              {!isLoggedIn && (
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-center space-y-2 mt-4">
                  <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
                    {isArabic 
                      ? "بعض الخدمات تتطلب تسجيل الدخول لحفظ تقدمك وإنجازاتك الشخصية." 
                      : "Some features require logging in to track your personal tasks and profile."}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[10px] rounded-xl border border-indigo-200 transition-all cursor-pointer"
                  >
                    {isArabic ? "سجّل الدخول الآن" : "Log In Now"}
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer Branding */}
            <div className="p-6 border-t border-slate-100 text-center bg-slate-50/50">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                PATHWAY LANGUAGES © 2026
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
