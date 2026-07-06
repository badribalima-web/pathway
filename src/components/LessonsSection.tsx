import React, { useState, useRef, useEffect } from "react";
import { BookOpen, CheckCircle, Lock, Award, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, ChevronRight, HelpCircle, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Lesson, Student } from "../types";
import confetti from "canvas-confetti";

interface LessonsSectionProps {
  lessons: Lesson[];
  student: Student | null;
  onUpdateStudent: (updated: Student) => void;
  onOpenAuth: () => void;
  isArabic: boolean;
}

export default function LessonsSection({
  lessons,
  student,
  onUpdateStudent,
  onOpenAuth,
  isArabic,
}: LessonsSectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(student?.level || "A1");
  const [selectedCategory, setSelectedCategory] = useState<string>("grammar");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (student?.level) {
      setSelectedLevel(student.level);
    } else {
      setSelectedLevel("A1");
    }
  }, [student?.level]);

  // Custom video player states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Sync isPlaying state with html5 video element events
  useEffect(() => {
    if (!activeLesson) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [activeLesson]);

  // Quiz state
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const categories = [
    { id: "grammar", en: "Grammar", ar: "القواعد" },
    { id: "reading", en: "Reading", ar: "القراءة" },
    { id: "writing", en: "Writing", ar: "الكتابة" },
    { id: "listening", en: "Listening", ar: "الاستماع" },
    { id: "speaking", en: "Speaking", ar: "المحادثة" },
    { id: "shadowing", en: "Shadowing", ar: "Shadowing (التظليل الصوتي)" },
  ];

  const levels = [
    { id: "All", en: "All Levels", ar: "جميع المستويات" },
    { id: "A1", en: "Level A1", ar: "المستوى A1" },
    { id: "A2", en: "Level A2", ar: "المستوى A2" },
    { id: "B1", en: "Level B1", ar: "المستوى B1" },
    { id: "B2", en: "Level B2", ar: "المستوى B2" },
    { id: "C1", en: "Level C1", ar: "المستوى C1" },
  ];

  // Filter and sort lessons by order
  const filteredLessons = lessons
    .filter((lesson) => {
      // Filter out hidden lessons
      if (lesson.isHidden) return false;
      // Filter by level
      const levelMatch = selectedLevel === "All" || lesson.level === selectedLevel;
      const catMatch = selectedCategory === "All" || lesson.category === selectedCategory;
      return levelMatch && catMatch;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setAnswers({
      ...answers,
      [qIdx]: oIdx,
    });
  };

  const handleSubmitQuiz = () => {
    if (!activeLesson) return;
    
    let unanswered = false;
    for (let i = 0; i < activeLesson.quiz.length; i++) {
      if (answers[i] === undefined || answers[i] === null || String(answers[i]).trim() === "") {
        unanswered = true;
        break;
      }
    }
    
    if (unanswered) {
      alert(
        isArabic
          ? "الرجاء الإجابة على جميع الأسئلة وكتابة الفراغات أولاً!"
          : "Please answer all questions and fill in all blanks first!"
      );
      return;
    }

    // Calculate score
    let correctCount = 0;
    activeLesson.quiz.forEach((q, idx) => {
      const qType = q.type || "multiple";
      if (qType === "fill_blank") {
        const studentAns = String(answers[idx] || "").trim().toLowerCase();
        const correctAns = String(q.correctAnswer || "").trim().toLowerCase();
        if (studentAns === correctAns) {
          correctCount++;
        }
      } else {
        if (Number(answers[idx]) === Number(q.correctAnswer)) {
          correctCount++;
        }
      }
    });

    setQuizScore(correctCount);
    setQuizSubmitted(true);

    const isPassed = correctCount === activeLesson.quiz.length;

    if (isPassed) {
      // Trigger confetti celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Save progress if student is logged in
      if (student) {
        const isAlreadyCompleted = student.completedLessons.includes(activeLesson.id);
        if (!isAlreadyCompleted) {
          const updatedCompleted = [...student.completedLessons, activeLesson.id];
          
          // Recalculate progress: base it on total lessons
          const totalLessonsCount = lessons.length || 3;
          const progressPercent = Math.min(
            100,
            Math.round((updatedCompleted.length / totalLessonsCount) * 100)
          );
          
          const updatedStudent: Student = {
            ...student,
            completedLessons: updatedCompleted,
            progress: progressPercent,
            points: student.points + 25, // 25 points for fully passing a quiz!
          };

          onUpdateStudent(updatedStudent);
        }
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="lessons-view-container">
      {/* Header & Stats Banner - LESSONS */}
      {!activeLesson && (
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-emerald-500/10">
          <div className="relative z-10 max-w-2xl text-left rtl:text-right space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              {isArabic ? "الدروس" : "Lessons"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight">
              {isArabic ? "الدروس" : "Lessons"}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              {isArabic
                ? "تصفح كافة الدروس المتاحة لمستواك الدراسي وابدأ التعلم الآن بكل سهولة."
                : "Browse all available lessons according to your level and start learning easily."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-slate-300">
              <div className="bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>
                  {isArabic ? `إجمالي الدروس: ${lessons.length}` : `Total Lessons: ${lessons.length}`}
                </span>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
                <Award className="w-4 h-4 text-amber-400" />
                <span>
                  {isArabic ? `مستوى الطالب: ${student?.level || "A1"}` : `Student Level: ${student?.level || "A1"}`}
                </span>
              </div>
            </div>
          </div>
          {/* Background design accents */}
          <div className="absolute right-0 bottom-0 opacity-15 rtl:left-0 rtl:right-auto pointer-events-none">
            <BookOpen className="w-72 h-72 -mr-12 -mb-12 text-emerald-400" />
          </div>
        </div>
      )}

      {/* Level and Category Selectors */}
      {!activeLesson ? (
        <div className="space-y-6">
          {/* 🧭 Professional Lessons Navigation Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm" id="lessons-navbar-head">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div className="text-left rtl:text-right">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                    {isArabic ? "مكتبة الدروس والمسارات" : "Pathway Lessons"}
                  </h3>
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md border border-indigo-100 uppercase tracking-wider">
                    {isArabic ? "الدروس" : "Active"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isArabic ? "طور مهاراتك اللغوية من خلال دروس تفاعلية مخصصة" : "Build your vocabulary, grammar, and fluency dynamically"}
                </p>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {student ? (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-700">
                      {isArabic ? `المستوى ${student.level || "A1"}` : `Level ${student.level || "A1"}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] font-black text-amber-700">
                      {isArabic ? `${student.points || 0} نقطة` : `${student.points || 0} pts`}
                    </span>
                  </div>
                </>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-extrabold px-4 py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-100 shadow-sm"
                >
                  {isArabic ? "سجّل الدخول لحفظ التقدم" : "Login to Save Progress"}
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4">
            {/* Level display (no selection) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {isArabic ? "المستوى الحالي:" : "Current Level:"}
              </span>
              <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-black">
                {selectedLevel}
              </span>
            </div>

            <div className="border-t border-slate-100 my-2" />

            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 rtl:ml-2">
                {isArabic ? "المهارة:" : "Skill:"}
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {isArabic ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Grid */}
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => {
                const isCompleted = student?.completedLessons.includes(lesson.id);
                const isCorrectLevel = student ? lesson.level === student.level : true;

                return (
                  <div
                    key={lesson.id}
                    className={`bg-white rounded-2xl border ${
                      isCompleted 
                        ? "border-emerald-200 shadow-emerald-50/50" 
                        : "border-slate-200 hover:border-indigo-200 hover:shadow-indigo-50/50"
                    } p-5 transition-all hover:shadow-xl flex flex-col justify-between group relative`}
                  >
                    {/* Badge Completed */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100 z-10">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{isArabic ? "مكتمل" : "Completed"}</span>
                      </div>
                    )}

                    {lesson.imageUrl && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-4 relative bg-slate-50">
                        <img 
                          src={lesson.imageUrl} 
                          alt={isArabic ? lesson.titleAr : lesson.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Category Label and Level */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2.5 py-0.5 rounded-md uppercase">
                          {isArabic ? categories.find(c => c.id === lesson.category)?.ar : lesson.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          (lesson.level === "A1" || lesson.level === "A2") ? "bg-emerald-50 text-emerald-700" :
                          (lesson.level === "B1" || lesson.level === "B2") ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {isArabic ? `${isArabic ? "مستوى" : "Level"} ${lesson.level}` : `Level ${lesson.level}`}
                        </span>
                      </div>

                      {/* Lesson Title */}
                      <div className="space-y-1 text-left rtl:text-right">
                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base font-display">
                          {isArabic ? lesson.titleAr : lesson.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {isArabic ? lesson.title : lesson.titleAr}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {lesson.quiz.length} {isArabic ? "أسئلة" : "Questions"}
                      </span>

                      <button
                        onClick={() => handleOpenLesson(lesson)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isArabic ? "ابدأ الدرس" : "Start Lesson"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white text-center py-12 rounded-2xl border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                {isArabic
                  ? "لا توجد دروس تطابق هذه الفلاتر حالياً."
                  : "No lessons matched your selection."}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Active Lesson Detail View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Main Content Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header / Back Link */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <button
                onClick={() => setActiveLesson(null)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isArabic ? "الرجوع لجميع الدروس" : "Back to All Lessons"}</span>
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {isArabic ? categories.find(c => c.id === activeLesson.category)?.ar : activeLesson.category}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {activeLesson.level}
                </span>
              </div>
            </div>

            {/* Titles */}
            <div className="space-y-1 text-left rtl:text-right">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                {isArabic ? activeLesson.titleAr : activeLesson.title}
              </h1>
              <h2 className="text-sm text-slate-400 font-medium">
                {isArabic ? activeLesson.title : activeLesson.titleAr}
              </h2>
            </div>

            {activeLesson.imageUrl && (
              <div className="w-full max-h-80 rounded-2xl overflow-hidden shadow-sm border border-slate-100 my-4 bg-slate-50">
                <img
                  src={activeLesson.imageUrl}
                  alt={isArabic ? activeLesson.titleAr : activeLesson.title}
                  className="w-full h-full object-cover max-h-80"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {activeLesson.videoUrl && (
              <div className="space-y-2 my-4">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {isArabic ? "🎥 مشغل الفيديو الذكي" : "🎥 Pathway Smart Player"}
                </span>
                
                {activeLesson.videoUrl.includes("youtube.com") || activeLesson.videoUrl.includes("youtu.be") ? (
                  <div className="w-full rounded-2xl overflow-hidden aspect-video bg-black shadow-inner">
                    <iframe
                      className="w-full h-full"
                      src={activeLesson.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                      title="Tutorial Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 aspect-video group shadow-xl border border-slate-800">
                    <video
                      ref={videoRef}
                      src={activeLesson.videoUrl}
                      className="w-full h-full object-contain"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={() => {
                        if (videoRef.current) {
                          setCurrentTime(videoRef.current.currentTime);
                        }
                      }}
                      onDurationChange={() => {
                        if (videoRef.current) {
                          setDuration(videoRef.current.duration);
                        }
                      }}
                      autoPlay
                      onClick={() => {
                        if (videoRef.current) {
                          if (isPlaying) {
                            videoRef.current.pause();
                          } else {
                            videoRef.current.play().catch(() => {});
                          }
                        }
                      }}
                    />

                    {/* Custom Player Controls Bar (Overlay on hover/focus) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-10">
                      
                      {/* Timeline Slider */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white font-mono">
                          {Math.floor(currentTime / 60)}:{( "0" + Math.floor(currentTime % 60) ).slice(-2)}
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          value={currentTime}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setCurrentTime(val);
                            if (videoRef.current) {
                              videoRef.current.currentTime = val;
                            }
                          }}
                          className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-1.5 transition-all"
                        />
                        <span className="text-[10px] text-white/70 font-mono">
                          {Math.floor(duration / 60)}:{( "0" + Math.floor(duration % 60) ).slice(-2)}
                        </span>
                      </div>

                      {/* Controls Buttons Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Play / Pause */}
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                if (isPlaying) videoRef.current.pause();
                                else videoRef.current.play().catch(() => {});
                              }
                            }}
                            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all cursor-pointer"
                          >
                            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                          </button>

                          {/* Jump Back 10s */}
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                              }
                            }}
                            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all cursor-pointer"
                            title={isArabic ? "تراجع 10 ثوانٍ" : "Rewind 10s"}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          {/* Jump Forward 10s */}
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
                              }
                            }}
                            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all cursor-pointer"
                            title={isArabic ? "تقديم 10 ثوانٍ" : "Forward 10s"}
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Mute and Volume controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.muted = !isMuted;
                                setIsMuted(!isMuted);
                              }
                            }}
                            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all cursor-pointer"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Attached Links Section */}
            {activeLesson.attachedLinks && activeLesson.attachedLinks.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5 my-6">
                <h4 className="font-extrabold text-xs text-indigo-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-sm">🔗</span>
                  {isArabic ? "روابط ومصادر مرفقة بالدرس" : "Attached Resources & Links"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeLesson.attachedLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-indigo-400 hover:shadow-sm transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base text-slate-400 group-hover:text-indigo-500 transition-colors">🔗</span>
                        <span className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                          {link.title || link.url}
                        </span>
                      </div>
                      <span className="text-[10px] text-indigo-650 font-extrabold underline shrink-0 whitespace-nowrap">
                        {isArabic ? "زيارة الرابط" : "Visit Link"}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Explanations (Bilingual Markdown Display) */}
            <div className="p-1 space-y-6 text-slate-700 leading-relaxed text-sm text-left rtl:text-right">
              <div className="prose max-w-none prose-indigo">
                <div className="bg-indigo-50/45 p-4 rounded-2xl border border-indigo-100/50 mb-6">
                  <h4 className="font-bold text-xs text-indigo-800 uppercase tracking-wider mb-2 font-display">
                    {isArabic ? "💡 الشرح بالعربية" : "💡 Arabic Explanation"}
                  </h4>
                  {activeLesson.contentAr.split('\n').map((para, i) => (
                    <p key={i} className="mb-2 last:mb-0 text-slate-800">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="p-2">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3 font-display">
                    📖 Lesson Explanation (English)
                  </h4>
                  {activeLesson.content.split('\n').map((para, i) => (
                    <p key={i} className="mb-2 text-slate-800">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Quiz Sidebar */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 flex flex-col justify-between h-fit">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-800">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold font-display text-base">
                  {isArabic ? "اختبر فهمك" : "Lesson Quiz"}
                </h3>
              </div>

              {/* Login Warning if not logged in */}
              {!student && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-800 leading-normal">
                  <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">{isArabic ? "أنت غير مسجل" : "Not logged in"}</span>
                    <p className="mt-0.5">
                      {isArabic
                        ? "يمكنك حل الأسئلة، لكن لن يتم حفظ تقدمك أو نقاطك في ملفك الشخصي إلا بعد تسجيل الدخول."
                        : "You can solve this quiz, but login is required to save progress and earn Pathway Points."}
                    </p>
                    <button
                      onClick={onOpenAuth}
                      className="mt-1.5 text-indigo-700 underline font-bold"
                    >
                      {isArabic ? "سجل الدخول الآن" : "Sign In Now"}
                    </button>
                  </div>
                </div>
              )}

              {/* Quiz Body */}
              <div className="space-y-6">
                {activeLesson.quiz.map((q, qIdx) => {
                  const qType = q.type || "multiple";
                  const isMultiple = qType === "multiple";
                  const isTrueFalse = qType === "true_false";
                  const isFillBlank = qType === "fill_blank";

                  // Auto-generate or format options for True/False
                  const optionsList = isTrueFalse
                    ? (q.options && q.options.length > 0 ? q.options : [isArabic ? "صح" : "True", isArabic ? "خطأ" : "False"])
                    : (q.options || []);

                  return (
                    <div key={qIdx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3" id={`quiz-q-${qIdx}`}>
                      <div className="flex items-start gap-2 text-left rtl:text-right">
                        <span className="bg-slate-100 text-slate-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-mono mt-0.5">
                          {qIdx + 1}
                        </span>
                        <div className="flex-1">
                          <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider block mb-0.5">
                            {isMultiple && (isArabic ? "اختيار من متعدد" : "Multiple Choice")}
                            {isTrueFalse && (isArabic ? "صح أم خطأ" : "True or False")}
                            {isFillBlank && (isArabic ? "ملء الفراغات" : "Fill in the Blanks")}
                          </span>
                          <p className="text-xs font-bold text-slate-800 leading-relaxed">
                            {q.question}
                          </p>
                        </div>
                      </div>

                      {isFillBlank ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            disabled={quizSubmitted}
                            value={answers[qIdx] || ""}
                            onChange={(e) => {
                              setAnswers({
                                ...answers,
                                [qIdx]: e.target.value
                              });
                            }}
                            placeholder={isArabic ? "اكتب الإجابة الصحيحة هنا..." : "Type your answer here..."}
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all ${
                              quizSubmitted
                                ? String(answers[qIdx] || "").trim().toLowerCase() === String(q.correctAnswer || "").trim().toLowerCase()
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                                  : "bg-red-50 border-red-300 text-red-800"
                                : "border-slate-200"
                            }`}
                          />
                          {quizSubmitted && (
                            <div className="text-[10px] font-semibold mt-1">
                              {String(answers[qIdx] || "").trim().toLowerCase() === String(q.correctAnswer || "").trim().toLowerCase() ? (
                                <span className="text-emerald-600">✓ {isArabic ? "إجابة صحيحة!" : "Correct answer!"}</span>
                              ) : (
                                <span className="text-red-650">
                                  ❌ {isArabic ? "إجابة غير صحيحة. الإجابة هي: " : "Incorrect. The correct answer is: "}
                                  <span className="font-bold underline text-emerald-600">{q.correctAnswer}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {optionsList.map((opt, oIdx) => {
                            const isSelected = answers[qIdx] === oIdx;
                            const isCorrect = oIdx === Number(q.correctAnswer);
                            const isIncorrectAndSelected = isSelected && !isCorrect;

                            let buttonStyle = "bg-white hover:bg-slate-50 border-slate-200 text-slate-700";
                            if (quizSubmitted) {
                              if (isCorrect) {
                                buttonStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold";
                              } else if (isIncorrectAndSelected) {
                                buttonStyle = "bg-red-50 border-red-300 text-red-800";
                              } else {
                                buttonStyle = "bg-white border-slate-100 opacity-60 text-slate-400";
                              }
                            } else if (isSelected) {
                              buttonStyle = "bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold ring-2 ring-indigo-500/10";
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={quizSubmitted}
                                onClick={() => handleSelectOption(qIdx, oIdx)}
                                className={`w-full text-left rtl:text-right px-4 py-2.5 rounded-xl border text-xs transition-all flex justify-between items-center ${buttonStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrect && (
                                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                                    {isArabic ? "صحيح" : "Correct"}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-indigo-100"
                >
                  {isArabic ? "إرسال الإجابات والتحقق" : "Submit & Verify Answers"}
                </button>
              ) : (
                <div className="space-y-3">
                  {/* Score Card */}
                  <div className={`p-4 rounded-2xl border text-center ${
                    quizScore === activeLesson.quiz.length
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                      : "bg-amber-50 border-amber-100 text-amber-800"
                  }`}>
                    <span className="block text-2xl font-black font-display mb-1">
                      {quizScore} / {activeLesson.quiz.length}
                    </span>
                    <p className="text-xs">
                      {quizScore === activeLesson.quiz.length
                        ? (isArabic ? "أحسنت! إجابة كاملة صحيحة 🎉" : "Perfect! You solved all correctly 🎉")
                        : (isArabic ? "حاول مجدداً للوصول للإجابة الكاملة وكسب النقاط." : "Keep studying and try again to get perfect score.")}
                    </p>
                    {quizScore === activeLesson.quiz.length && (
                      <span className="inline-block mt-2 text-[10px] bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        +25 Points Awarded
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setAnswers({});
                      setQuizSubmitted(false);
                      setQuizScore(0);
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
                  >
                    {isArabic ? "إعادة محاولة الاختبار" : "Retry Quiz"}
                  </button>

                  <button
                    onClick={() => setActiveLesson(null)}
                    className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
                  >
                    {isArabic ? "العودة لقائمة الدروس" : "Go Back to Lessons"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
