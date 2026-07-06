import React, { useState, useEffect } from "react";
import { Chrome, Sparkles, CheckCircle2, ChevronRight, BookOpen, User, Languages, AlertCircle, HelpCircle, RefreshCw } from "lucide-react";
import { auth, GoogleAuthProvider, signInWithPopup, db, doc, setDoc } from "../lib/firebase";
import { getStudentProfile, saveStudentProfile, getTeachers, subscribeToTeachers } from "../lib/dbService";
import { Student, Teacher } from "../types";


interface LoginPageProps {
  isArabic: boolean;
  onAuthSuccess: (uid: string, name: string, email: string) => void;
  student: Student | null;
  onUpdateStudent: (updated: Student) => void;
  onLogoClick: () => void;
}

export default function LoginPage({
  isArabic,
  onAuthSuccess,
  student,
  onUpdateStudent,
  onLogoClick,
}: LoginPageProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Onboarding wizard states
  const [step, setStep] = useState<"login" | "level" | "teacher" | "complete">("login");
  const [selectedLevel, setSelectedLevel] = useState<"A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null>(null);
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Fallback sandbox state in case Google popup gets blocked (iframe environment issue)
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxName, setSandboxName] = useState("");
  const [sandboxEmail, setSandboxEmail] = useState("");

  // Load teachers on mount to display in step 3
  useEffect(() => {
    const unsubscribe = subscribeToTeachers((list) => {
      // Filter out disabled and hidden teachers for student registration
      const activeTeachers = list.filter(t => !t.isDisabled && !t.isHiddenFromSelection);
      setTeachersList(activeTeachers);
    });
    return unsubscribe;
  }, []);

  // Determine starting step based on student object
  useEffect(() => {
    if (student) {
      if (!student.selectedLevelCode || !student.selectedTeacherId || !student.isRegistrationComplete) {
        setStep("level");
      } else {
        setStep("complete");
      }
    } else {
      setStep("login");
    }
  }, [student]);

  // Synchronize local selected states with student profile if available
  useEffect(() => {
    if (student) {
      if (student.selectedLevelCode) {
        setSelectedLevel(student.selectedLevelCode as any);
      }
      if (student.selectedTeacherId) {
        const found = teachersList.find(t => t.uid === student.selectedTeacherId);
        if (found) {
          setSelectedTeacher(found);
        }
      }
    }
  }, [student, teachersList]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!auth) {
        throw new Error("Firebase auth not initialized");
      }
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onAuthSuccess(user.uid, user.displayName || "Student User", user.email || "student@gmail.com");
    } catch (e: any) {
      console.warn("Google Sign-In failed, fallback enabled:", e);
      setError(
        isArabic
          ? "تنبيه: تم تفعيل تسجيل الدخول التجريبي لتسهيل الدخول داخل الإطار."
          : "Notice: Enabled sandbox entry to support the iframe environment."
      );
      setShowSandbox(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxName.trim() || !sandboxEmail.trim()) return;
    const cleanEmail = sandboxEmail.trim().toLowerCase();
    const sandboxUid = `user_${btoa(cleanEmail).replace(/=/g, "").slice(0, 10)}`;
    onAuthSuccess(sandboxUid, sandboxName.trim(), cleanEmail);
  };

  // Step 2: Level selection helper
  const levels: ("A1" | "A2" | "B1" | "B2" | "C1" | "C2")[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  
  const levelNamesEn: Record<string, string> = {
    A1: "Beginner / Breakthrough",
    A2: "Elementary / Waystage",
    B1: "Intermediate / Threshold",
    B2: "Upper Intermediate / Vantage",
    C1: "Advanced / Effective Operational",
    C2: "Mastery / Highly Proficient",
  };

  const levelNamesAr: Record<string, string> = {
    A1: "مبتدئ / أساسي",
    A2: "مبتدئ متقدم",
    B1: "متوسط / متوسط أساسي",
    B2: "فوق المتوسط",
    C1: "متقدم / احترافي",
    C2: "مستوى الإتقان التام",
  };

  const isTeacherForLevel = (teacher: Teacher, lvl: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null) => {
    if (!lvl) return false;
    if (!teacher.levels || teacher.levels.length === 0) {
      // Backwards compatibility
      return true;
    }
    return teacher.levels.includes(lvl);
  };

  const handleSelectLevel = (lvl: "A1" | "A2" | "B1" | "B2" | "C1" | "C2") => {
    setSelectedLevel(lvl);
    setSelectedTeacher(null); // Cancel previous selection as requested
  };

  const handleSelectTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleCompleteRegistration = async () => {
    if (!student || !selectedLevel || !selectedTeacher) return;
    
    const updated: Student = {
      ...student,
      level: selectedLevel,
      selectedLevelCode: selectedLevel,
      selectedTeacherId: selectedTeacher.uid,
      selectedTeacherName: selectedTeacher.name,
      selectedLanguage: "English",
      isRegistrationComplete: true,
      allowTeacherChange: false, // Reset change flag
    };

    setLoading(true);
    try {
      await saveStudentProfile(updated, selectedTeacher.uid);
      onUpdateStudent(updated);
      setStep("complete");
    } catch (err) {
      console.error("Failed to save final student profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Determine dynamic container width for a gorgeous layout
  const isWideStep = step === "level" || step === "teacher";
  const containerClass = isWideStep ? "max-w-4xl" : "max-w-md";

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F3FF] font-sans relative overflow-hidden" id="login-onboarding-container">
      
      {/* Decorative premium ambient glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-violet-300/15 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-purple-300/15 blur-[120px]" />
      </div>

      <div className={`w-full ${containerClass} space-y-8 bg-[#FFFFFF] border border-slate-200/85 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden transition-all duration-500 z-10`}>
        
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600" />
        
        {/* Title & Brand Header */}
        <div className="text-center flex flex-col items-center">
          <div 
            onClick={onLogoClick}
            className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-display font-black text-xl shadow-lg shadow-purple-500/30 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            title="Pathway Languages"
          >
            P
          </div>
          
          <h2 className="mt-4 text-3xl font-black text-slate-900 font-display tracking-tight">
            Pathway <span className="text-[#7C3AED]">Languages</span>
          </h2>
          
          <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {isArabic 
              ? "منصة تعليمية ذكية متكاملة لتطوير مهارات اللغة الإنجليزية ومتابعة تقدمك مع معلمين متخصصين."
              : "An integrated smart language platform to develop your English skills with professional tutors."}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          
          {/* STEP 1: LOGIN */}
          {step === "login" && (
            <div className="space-y-6 animate-fade-in" id="step-login-box">
              <div className="text-center">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-3.5 py-1 rounded-full uppercase tracking-wider font-mono border border-indigo-100">
                  {isArabic ? "بوابة الطالب الآمنة" : "STUDENT SECURE PORTAL"}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2.5">
                  {isArabic ? "مرحباً بك! ابدأ رحلتك التعليمية اليوم" : "Welcome! Start your learning journey today"}
                </h3>
              </div>

              {error && (
                <div className="flex gap-2.5 bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-[11px] text-amber-800 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Secure Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3.5 px-5 rounded-2xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50 cursor-pointer text-xs"
                id="main-google-login-btn"
              >
                <Chrome className="w-4.5 h-4.5 text-white stroke-[2.5]" />
                <span>
                  {loading 
                    ? (isArabic ? "جاري الاتصال..." : "Connecting...") 
                    : (isArabic ? "تسجيل الدخول بواسطة Google" : "Sign in with Google")}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>{isArabic ? "تسجيل دخول فوري مشفر بنقرة واحدة" : "Instant secured one-click authentication"}</span>
              </div>

              {/* Sandbox option for local or iframe bypass */}
              {showSandbox && (
                <form onSubmit={handleSandboxSubmit} className="pt-4 border-t border-dashed border-slate-200 mt-4 space-y-3 animate-fade-in">
                  <div className="text-center pb-1">
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200">
                      {isArabic ? "تسجيل سريع بديل" : "Sandbox Fast Sign-in"}
                    </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={isArabic ? "اسم الطالب" : "Student Name"}
                      required
                      value={sandboxName}
                      onChange={(e) => setSandboxName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-[#7C3AED] bg-slate-50 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="student@gmail.com"
                      required
                      value={sandboxEmail}
                      onChange={(e) => setSandboxEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-[#7C3AED] bg-slate-50 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer border border-slate-200 shadow-sm"
                  >
                    {isArabic ? "تسجيل الدخول التجريبي" : "Proceed with Sandbox User"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: LEVEL & DYNAMIC TEACHER SELECTION */}
          {step === "level" && (
            <div className="space-y-6 animate-fade-in" id="step-level-box">
              <div className="text-center">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max mx-auto border border-indigo-100">
                  <BookOpen className="w-3.5 h-3.5" />
                  {isArabic ? "الخطوة 2 من 2" : "Step 2 of 2"}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {isArabic ? "حدد مستواك الدراسي الحالي" : "Select Your Current English Level"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {isArabic 
                    ? "اختر المستوى المناسب لعرض الدروس المخصصة لك ومتابعة تقدمك:" 
                    : "Select the level that fits you to load the appropriate material:"}
                </p>
              </div>

              {/* Levels Grid layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {levels.map((lvl) => {
                  const isSelected = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleSelectLevel(lvl)}
                      className={`p-5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center group cursor-pointer space-y-3 shadow-sm ${
                        isSelected 
                          ? "bg-violet-50 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-violet-500/5"
                          : "border-slate-200 bg-slate-50/50 hover:bg-violet-50/30 hover:border-[#7C3AED]"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl font-black text-lg flex items-center justify-center transition-all border shadow-sm ${
                        isSelected
                          ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                          : "bg-[#F5F3FF] text-[#7C3AED] border-violet-100 group-hover:bg-[#7C3AED] group-hover:text-white"
                      }`}>
                        {lvl}
                      </div>
                      <div className="space-y-0.5">
                        <span className={`block font-black text-xs transition-all ${
                          isSelected ? "text-[#7C3AED]" : "text-slate-800 group-hover:text-[#7C3AED]"
                        }`}>
                          {isArabic ? levelNamesAr[lvl] : levelNamesEn[lvl]}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-mono">
                          {isArabic ? "منهاج Pathway معتمد" : "Official Pathway Curriculum"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* SECTION FOR ASSOCIATED TEACHERS - DISPLAYED BELOW IN SAME PAGE DYNAMICALLY */}
              {selectedLevel && (
                <div className="pt-8 border-t border-slate-100 space-y-6 animate-fade-in" id="dynamic-teacher-section">
                  <div className="text-center">
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max mx-auto border border-indigo-100">
                      <User className="w-3.5 h-3.5" />
                      {isArabic ? `الأساتذة المتاحون لمستوى ${selectedLevel}` : `Available Tutors for ${selectedLevel}`}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-2">
                      {isArabic ? "اختر الأستاذ المفضل لديك" : "Choose Your Preferred Tutor"}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isArabic 
                        ? "اختر أحد الأساتذة المعتمدين لتدريس هذا المستوى لمتابعة وتوجيه مسيرتك التعليمية:"
                        : "Select from the certified tutors available for this level to guide your learning:"}
                    </p>
                  </div>

                  {teachersList.filter(t => isTeacherForLevel(t, selectedLevel)).length === 0 ? (
                    <div className="text-center py-8 bg-amber-50/40 border border-amber-100 rounded-2xl text-xs text-amber-700 font-medium">
                      {isArabic ? "لا يوجد أساتذة متاحون لهذا المستوى حاليًا." : "No teachers available for this level currently."}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                      {teachersList.filter(t => isTeacherForLevel(t, selectedLevel)).map((teacherItem) => {
                        const isTeacherSelected = selectedTeacher?.uid === teacherItem.uid;
                        const logoUrl = teacherItem.customLogoUrl || teacherItem.photoUrl;
                        return (
                          <button
                            key={teacherItem.uid}
                            type="button"
                            onClick={() => handleSelectTeacher(teacherItem)}
                            className={`p-6 rounded-3xl border transition-all flex flex-col items-center justify-between text-center group cursor-pointer space-y-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 duration-300 relative overflow-hidden ${
                              isTeacherSelected
                                ? "bg-violet-50/20 border-[#7C3AED] ring-2 ring-[#7C3AED]/10"
                                : "border-slate-200 bg-white hover:border-[#7C3AED]"
                            }`}
                            id={`teacher-select-card-${teacherItem.uid}`}
                          >
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {isArabic ? "متاح" : "Online"}
                              </span>
                            </div>

                            {/* Teacher Logo / Photo container */}
                            <div className="relative">
                              {logoUrl ? (
                                <img
                                  src={logoUrl}
                                  alt={teacherItem.name}
                                  className={`w-20 h-20 rounded-full object-cover border-2 shadow-sm transition-all ${
                                    isTeacherSelected ? "border-[#7C3AED]" : "border-slate-100 group-hover:border-[#7C3AED]"
                                  }`}
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className={`w-20 h-20 rounded-full font-black text-2xl flex items-center justify-center border shadow-sm transition-all ${
                                  isTeacherSelected
                                    ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                                    : "bg-[#F5F3FF] text-[#7C3AED] border-violet-100 group-hover:bg-[#7C3AED] group-hover:text-white"
                                }`}>
                                  {teacherItem.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                            </div>
                            
                            {/* Name and Description */}
                            <div className="space-y-2 flex-grow w-full">
                              <h4 className="block font-black text-slate-800 text-base group-hover:text-[#7C3AED] transition-colors truncate max-w-[220px] mx-auto">
                                {teacherItem.name}
                              </h4>
                              <span className="inline-block text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 font-extrabold px-2.5 py-0.5 rounded-full">
                                {isArabic 
                                  ? (teacherItem.specialtyAr || "أستاذ لغة إنجليزية معتمد") 
                                  : (teacherItem.specialty || "Certified English Instructor")}
                              </span>
                            </div>

                            {/* CTA button inside card */}
                            <div className={`w-full text-xs font-black py-3 rounded-2xl transition-all shadow-xs ${
                              isTeacherSelected
                                ? "bg-[#7C3AED] text-white border border-[#7C3AED]"
                                : "text-[#7C3AED] bg-[#F5F3FF] border border-violet-100 group-hover:bg-[#7C3AED] group-hover:text-white group-hover:border-[#7C3AED]"
                            }`}>
                              {isTeacherSelected 
                                ? (isArabic ? "تم الاختيار بنجاح" : "Selected") 
                                : (isArabic ? "اختيار هذا المعلم" : "Choose Tutor")}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Submission and completion button inside selectedLevel section */}
                  {teachersList.filter(t => isTeacherForLevel(t, selectedLevel)).length > 0 && (
                    <div className="pt-6 flex justify-center">
                      <button
                        type="button"
                        onClick={handleCompleteRegistration}
                        disabled={!selectedTeacher || loading}
                        className="w-full sm:max-w-md bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-purple-100 cursor-pointer text-xs flex items-center justify-center gap-2 disabled:shadow-none disabled:cursor-not-allowed"
                      >
                        {loading && <RefreshCw className="w-4 h-4 animate-spin text-white" />}
                        <span>{isArabic ? "إكمال التسجيل ومتابعة" : "Complete Registration & Continue"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SETUP COMPLETED */}
          {step === "complete" && (
            <div className="space-y-6 text-center animate-fade-in" id="step-complete-box">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm border border-emerald-100 scale-110 animate-bounce">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  {isArabic ? "تم إكمال الإعداد بنجاح!" : "Account Setup Complete!"}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {isArabic 
                    ? "تم إنشاء ملفك الشخصي بالكامل وربط معلمك ومنهاجك بنجاح."
                    : "Your personalized learning profile and curriculum have been synchronized!"}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left rtl:text-right space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-450">{isArabic ? "اللغة:" : "Language:"}</span>
                  <span className="font-bold text-slate-800">🇬🇧 English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isArabic ? "المستوى الدراسي:" : "Study Level:"}</span>
                  <span className="font-bold text-[#7C3AED] font-mono text-[11px] bg-[#F5F3FF] px-2 py-0.5 rounded border border-violet-100">
                    {student?.level || selectedLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isArabic ? "الأستاذ المختار:" : "Selected Tutor:"}</span>
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">
                    {student?.selectedTeacherName || selectedTeacher?.name || (isArabic ? "المعلم المشرف" : "Academic Instructor")}
                  </span>
                </div>
              </div>

              <button
                onClick={async () => {
                  if (student) {
                    const activeTeacher = selectedTeacher || teachersList.find(t => t.uid === student.selectedTeacherId) || { uid: student.selectedTeacherId || "teacher-sarah", name: student.selectedTeacherName || "المعلم المشرف" } as Teacher;
                    const updated: Student = {
                      ...student,
                      selectedTeacherId: activeTeacher.uid,
                      selectedTeacherName: activeTeacher.name,
                      level: selectedLevel || student.level || "A1",
                      selectedLevelCode: selectedLevel || student.selectedLevelCode || "A1",
                      selectedLanguage: "English",
                      isRegistrationComplete: true,
                    };
                    
                    setLoading(true);
                    try {
                      await saveStudentProfile(updated, activeTeacher.uid);
                      onUpdateStudent(updated);
                    } catch (err) {
                      console.error("Failed to save final student profile:", err);
                    } finally {
                      setLoading(false);
                    }
                  } else {
                    window.location.reload();
                  }
                }}
                disabled={loading}
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-lg shadow-purple-100 cursor-pointer text-xs flex items-center justify-center gap-2 disabled:opacity-55"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin text-white" />}
                <span>{isArabic ? "دخول لوحة التحكم المباشرة" : "Enter Interactive Learning Board"}</span>
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
