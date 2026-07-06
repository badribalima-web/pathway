import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "motion/react";
import Navigation from "./components/Navigation";
import LessonsSection from "./components/LessonsSection";
import VocabularySection from "./components/VocabularySection";
import LiveClassesSection from "./components/LiveClassesSection";
import ProfileSection from "./components/ProfileSection";
import TeacherDashboard from "./components/TeacherDashboard";
import AuthModal from "./components/AuthModal";
import LoginPage from "./components/LoginPage";
import SidebarMenu from "./components/SidebarMenu";
import DailyTasksSection from "./components/DailyTasksSection";
import WeeklyTasksSection from "./components/WeeklyTasksSection";
import AboutUsSection from "./components/AboutUsSection";
import SkillDevelopmentSection from "./components/SkillDevelopmentSection";
import RecordedLessonsSection from "./components/RecordedLessonsSection";
import TrainingSection from "./components/TrainingSection";

import { Student, Teacher, Lesson, Vocabulary, DynamicVocabCategory, LiveSession, Announcement, ResourceOrTip } from "./types";
import { 
  getLessons, 
  getVocabulary, 
  getLiveSessions, 
  getStudentProfile, 
  saveStudentProfile,
  clearAllTeachers,
  updateTeacher,
  getAnnouncements,
  getTeachers,
  subscribeToTeachers,
  subscribeToStudentProfile,
  subscribeToResourcesAndTips,
  subscribeToLessons,
  subscribeToVocabulary,
  subscribeToVocabCategories,
  subscribeToLiveSessions,
  subscribeToAnnouncements,
  subscribeToChat
} from "./lib/dbService";

import { 
  GraduationCap, 
  Star, 
  Flame, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle,
  HelpCircle,
  Megaphone,
  Calendar,
  MessageSquare,
  Play,
  Pause,
  Save,
  FileText,
  ExternalLink,
  Info,
  Plus,
  Edit,
  Trash2,
  PlayCircle,
  Square,
  CheckCircle2,
  Key,
  ShieldAlert,
  LayoutDashboard,
  Activity
} from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [isArabic, setIsArabic] = useState<boolean>(true); // Default to Arabic as requested in detailed spec
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState<boolean>(false);
  const [accessCodeInput, setAccessCodeInput] = useState<string>("");
  const [accessCodeError, setAccessCodeError] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Hidden 10 logo clicks helper states
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [logoClickTimer, setLogoClickTimer] = useState<NodeJS.Timeout | null>(null);

  // Active authenticated user states
  const [student, setStudent] = useState<Student | null>(null);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);

  // Ensure light mode is always active by removing dark class
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("ep_theme");
  }, []);

  // Countdown countdown state
  const [timeRemainingInDay, setTimeRemainingInDay] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Next midnight
      const diffMs = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      const pad = (num: number) => String(num).padStart(2, "0");
      setTimeRemainingInDay(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Streak Micro-interaction state & functions
  const [streakFireActive, setStreakFireActive] = useState(false);

  const handleIncrementStreak = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!student) return;
    const currentStreak = student.dailyStreak || 0;
    const newStreak = currentStreak + 1;
    
    // Set fire animation active
    setStreakFireActive(true);
    setTimeout(() => setStreakFireActive(false), 1200);

    // If multiple of 10, trigger confetti!
    if (newStreak > 0 && newStreak % 10 === 0) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    // Save student state
    const updatedStudent = {
      ...student,
      dailyStreak: newStreak
    };
    setStudent(updatedStudent);
    await saveStudentProfile(updatedStudent);
  };

  const handleResetStreak = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!student) return;
    
    if (confirm(isArabic ? "هل تريد إعادة تعيين العداد إلى صفر؟" : "Do you want to reset the consecutive days streak to 0?")) {
      const updatedStudent = {
        ...student,
        dailyStreak: 0
      };
      setStudent(updatedStudent);
      await saveStudentProfile(updatedStudent);
    }
  };

  // Core curriculum lists (Lessons, vocabulary words, live video links)
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [vocabCategories, setVocabCategories] = useState<DynamicVocabCategory[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resourcesAndTips, setResourcesAndTips] = useState<ResourceOrTip[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Subscribe to all teachers
  useEffect(() => {
    const unsub = subscribeToTeachers(setTeachers);
    return unsub;
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [currentTab]);

  // Subscriptions for student and resources
  useEffect(() => {
    if (student?.uid) {
      const unsubscribe = subscribeToStudentProfile(student.uid, (updatedProfile) => {
        if (updatedProfile.isDisabled) {
          setStudent(null);
          localStorage.removeItem("ep_student_profile");
          alert(isArabic ? "هذا الحساب معطل حالياً من قبل الأستاذ." : "This account is currently disabled by the teacher.");
        } else {
          setStudent(updatedProfile);
        }
      });
      return unsubscribe;
    }
  }, [student?.uid]);

  useEffect(() => {
    const activeTeacherId = currentTeacher ? currentTeacher.uid : (student?.selectedTeacherId || "teacher-sarah");

    const unsubResources = subscribeToResourcesAndTips((items) => {
      setResourcesAndTips(items);
    }, activeTeacherId);

    const unsubLessons = subscribeToLessons((list) => {
      setLessons(list);
    }, activeTeacherId);

    const unsubVocab = subscribeToVocabulary((list) => {
      setVocabulary(list);
    }, activeTeacherId);

    const unsubVocabCategories = subscribeToVocabCategories((list) => {
      setVocabCategories(list);
    }, activeTeacherId);

    const unsubLives = subscribeToLiveSessions((list) => {
      setLiveSessions(list);
    }, activeTeacherId);

    const unsubAnnouncements = subscribeToAnnouncements((list) => {
      setAnnouncements(list);
    }, activeTeacherId);

    return () => {
      unsubResources();
      unsubLessons();
      unsubVocab();
      unsubVocabCategories();
      unsubLives();
      unsubAnnouncements();
    };
  }, [student?.selectedTeacherId, currentTeacher?.uid]);

  // ================= STUDY SESSION & TIME REMAINING STATES =================
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeRemaining("00:00:00");
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const pad = (v: number) => String(v).padStart(2, "0");
      setTimeRemaining(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const [isStudying, setIsStudying] = useState<boolean>(false);
  const [isStudyPaused, setIsStudyPaused] = useState<boolean>(false);
  const [studyElapsedSeconds, setStudyElapsedSeconds] = useState<number>(0);
  const [saveNotesSuccess, setSaveNotesSuccess] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isStudying && !isStudyPaused) {
      interval = setInterval(() => {
        setStudyElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStudying, isStudyPaused]);

  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (v: number) => String(v).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const handleStartStudy = () => {
    setIsStudying(true);
    setIsStudyPaused(false);
    setStudyElapsedSeconds(0);
  };

  const handleStopStudy = async () => {
    if (!isStudying || !student) return;
    setIsStudying(false);
    setIsStudyPaused(false);
    const addedSeconds = studyElapsedSeconds;
    setStudyElapsedSeconds(0);

    const updatedStudent: Student = {
      ...student,
      studySecondsToday: (student.studySecondsToday || 0) + addedSeconds,
      studySecondsThisWeek: (student.studySecondsThisWeek || 0) + addedSeconds,
      studySecondsTotal: (student.studySecondsTotal || 0) + addedSeconds,
    };
    await handleUpdateStudent(updatedStudent);
  };

  const handleSaveStudySession = async () => {
    if (!student || studyElapsedSeconds === 0) return;
    setIsStudying(false);
    setIsStudyPaused(false);
    const addedSeconds = studyElapsedSeconds;
    setStudyElapsedSeconds(0);

    const updatedStudent: Student = {
      ...student,
      studySecondsToday: (student.studySecondsToday || 0) + addedSeconds,
      studySecondsThisWeek: (student.studySecondsThisWeek || 0) + addedSeconds,
      studySecondsTotal: (student.studySecondsTotal || 0) + addedSeconds,
    };
    await handleUpdateStudent(updatedStudent);
  };

  const [studentNotes, setStudentNotes] = useState<string>("");
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Real-time chat notification updates
  useEffect(() => {
    if (!student?.uid) {
      setUnreadCount(0);
      return;
    }

    const unsubscribe = subscribeToChat(student.uid, (messages) => {
      if (currentTab === "chat") {
        localStorage.setItem(`ep_last_read_chat_${student.uid}`, new Date().toISOString());
        setUnreadCount(0);
        return;
      }

      const lastRead = localStorage.getItem(`ep_last_read_chat_${student.uid}`) || "1970-01-01T00:00:00.000Z";
      const unreadMsgs = messages.filter(
        (m) => m.senderRole !== "student" && new Date(m.timestamp) > new Date(lastRead)
      );
      setUnreadCount(unreadMsgs.length);
    });

    return () => {
      unsubscribe();
    };
  }, [student?.uid, currentTab]);

  // Clear unread count when viewing the chat tab
  useEffect(() => {
    if (currentTab === "chat" && student?.uid) {
      localStorage.setItem(`ep_last_read_chat_${student.uid}`, new Date().toISOString());
      setUnreadCount(0);
    }
  }, [currentTab, student?.uid]);

  useEffect(() => {
    if (student) {
      setStudentNotes(student.notes || "");
    }
  }, [student?.uid]);

  const handleSaveNotes = async (customNotes?: string) => {
    if (!student) return;
    const finalNotes = customNotes !== undefined ? customNotes : studentNotes;
    const updatedStudent: Student = {
      ...student,
      notes: finalNotes
    };
    await handleUpdateStudent(updatedStudent);
    setSaveNotesSuccess(true);
    setTimeout(() => setSaveNotesSuccess(false), 2000);
  };

  // States for Errors & Obstacles
  const [showErrorObstacleForm, setShowErrorObstacleForm] = useState<boolean>(false);
  const [editingErrorObstacleId, setEditingErrorObstacleId] = useState<string | null>(null);
  const [formErrorCommitted, setFormErrorCommitted] = useState<string>("");
  const [formDifficultyFaced, setFormDifficultyFaced] = useState<string>("");
  const [formHowResolved, setFormHowResolved] = useState<string>("");

  const handleSaveErrorObstacle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    const currentList = student.errorObstacles || [];
    let updatedList: any[] = [];

    if (editingErrorObstacleId) {
      // Edit mode
      updatedList = currentList.map(item => {
        if (item.id === editingErrorObstacleId) {
          return {
            ...item,
            errorCommitted: formErrorCommitted,
            difficultyFaced: formDifficultyFaced,
            howResolved: formHowResolved,
          };
        }
        return item;
      });
    } else {
      // Create mode
      const newItem = {
        id: "err-obs-" + Date.now().toString(36),
        errorCommitted: formErrorCommitted,
        difficultyFaced: formDifficultyFaced,
        howResolved: formHowResolved,
        createdAt: new Date().toISOString()
      };
      updatedList = [newItem, ...currentList];
    }

    const updatedStudent: Student = {
      ...student,
      errorObstacles: updatedList
    };

    await handleUpdateStudent(updatedStudent);
    
    // Reset form
    setShowErrorObstacleForm(false);
    setEditingErrorObstacleId(null);
    setFormErrorCommitted("");
    setFormDifficultyFaced("");
    setFormHowResolved("");
  };

  const handleStartEditErrorObstacle = (item: any) => {
    setEditingErrorObstacleId(item.id);
    setFormErrorCommitted(item.errorCommitted);
    setFormDifficultyFaced(item.difficultyFaced);
    setFormHowResolved(item.howResolved);
    setShowErrorObstacleForm(true);
  };

  const handleDeleteErrorObstacle = async (id: string) => {
    if (!student) return;
    const currentList = student.errorObstacles || [];
    const updatedList = currentList.filter(item => item.id !== id);

    const updatedStudent: Student = {
      ...student,
      errorObstacles: updatedList
    };

    await handleUpdateStudent(updatedStudent);
  };

  // Load curriculum from database on start
  const fetchCurriculumData = async (teacherId?: string) => {
    const targetId = teacherId || currentTeacher?.uid || "teacher-sarah";
    const lList = await getLessons(targetId);
    const vList = await getVocabulary(targetId);
    const sList = await getLiveSessions(targetId);
    const aList = await getAnnouncements(targetId);
    setLessons(lList);
    setVocabulary(vList);
    setLiveSessions(sList);
    setAnnouncements(aList);
  };

  useEffect(() => {
    const initAuthAndSync = async () => {
      const teachersList = await getTeachers();
      let activeTeacherId = "teacher-sarah";
      let loggedInTeacher: Teacher | null = null;

      // 1. Check cached teacher first
      const cachedTeacher = localStorage.getItem("ep_current_teacher");
      if (cachedTeacher) {
        try {
          const parsed = JSON.parse(cachedTeacher);
          if (parsed && parsed.email) {
            const cleanEmail = parsed.email.trim().toLowerCase();
            const teacherMatch = teachersList.find(t => t.email.trim().toLowerCase() === cleanEmail && !t.isDisabled);
            const isSuperAdmin = cleanEmail === "bellimabachir33@gmail.com";

            if (teacherMatch || isSuperAdmin) {
              loggedInTeacher = teacherMatch || parsed;
              setCurrentTeacher(loggedInTeacher);
              activeTeacherId = loggedInTeacher.uid;
            } else {
              localStorage.removeItem("ep_current_teacher");
            }
          }
        } catch {}
      }

      // 2. Check cached student next
      const cachedUser = localStorage.getItem("ep_student_profile");
      if (cachedUser) {
        try {
          const parsed = JSON.parse(cachedUser);
          if (parsed && parsed.uid && parsed.email) {
            const cleanEmail = parsed.email.trim().toLowerCase();
            const teacherMatch = teachersList.find(t => t.email.trim().toLowerCase() === cleanEmail && !t.isDisabled);
            const isSuperAdmin = cleanEmail === "bellimabachir33@gmail.com";

            if (teacherMatch || isSuperAdmin) {
              // Stale cache! Email is actually a teacher or admin now. Let's log them in as teacher
              const teacherProfile: Teacher = teacherMatch || {
                uid: "super-admin",
                name: parsed.name || "المدير (bellimabachir33)",
                email: cleanEmail,
                photoUrl: "https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff&bold=true",
                createdAt: new Date().toISOString()
              };
              setCurrentTeacher(teacherProfile);
              localStorage.setItem("ep_current_teacher", JSON.stringify(teacherProfile));
              setStudent(null);
              localStorage.removeItem("ep_student_profile");
              setCurrentTab("teacher");
              fetchCurriculumData(teacherProfile.uid);
              return;
            } else {
              // Normal student
              const studentTeacherId = parsed.selectedTeacherId || activeTeacherId;
              const profile = await getStudentProfile(parsed.uid, parsed.name, parsed.email, studentTeacherId);
              if (profile.isDisabled) {
                setStudent(null);
                localStorage.removeItem("ep_student_profile");
                alert(isArabic ? "هذا الحساب معطل حالياً من قبل الأستاذ." : "This account is currently disabled by the teacher.");
              } else {
                setStudent(profile);
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse cached student profile", e);
        }
      }

      if (loggedInTeacher) {
        setCurrentTab("teacher");
      }
      fetchCurriculumData(activeTeacherId);
    };

    initAuthAndSync();
  }, []);

  // Update Student state and sync to database
  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudent(updatedStudent);
    const targetId = updatedStudent.selectedTeacherId || currentTeacher?.uid || "teacher-sarah";
    await saveStudentProfile(updatedStudent, targetId);
  };

  // Google/Sandbox Auth success
  const handleAuthSuccess = async (uid: string, name: string, email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if they are in the approved teachers list or if they are the super admin (bellimabachir33@gmail.com)
    const teachersList = await getTeachers();
    const teacherMatch = teachersList.find(t => t.email.trim().toLowerCase() === cleanEmail && !t.isDisabled);
    const isSuperAdmin = cleanEmail === "bellimabachir33@gmail.com";

    if (teacherMatch || isSuperAdmin) {
      // Log them in as a Teacher!
      const teacherProfile: Teacher = teacherMatch || {
        uid: "super-admin",
        name: name || "المدير (bellimabachir33)",
        email: cleanEmail,
        photoUrl: "https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff&bold=true",
        createdAt: new Date().toISOString()
      };

      setCurrentTeacher(teacherProfile);
      localStorage.setItem("ep_current_teacher", JSON.stringify(teacherProfile));
      
      // Clear student state since they are logged in as a teacher/admin
      setStudent(null);
      localStorage.removeItem("ep_student_profile");

      // Auto redirect to teacher dashboard
      setCurrentTab("teacher");
      fetchCurriculumData(teacherProfile.uid);
      return;
    }

    // Normal student flow
    const profile = await getStudentProfile(uid, name, cleanEmail, "");
    if (profile.isDisabled) {
      alert(isArabic ? "هذا الحساب معطل حالياً من قبل الأستاذ." : "This account is currently disabled by the teacher.");
      return;
    }
    setStudent(profile);
    localStorage.setItem("ep_student_profile", JSON.stringify(profile));
    setCurrentTeacher(null);
    localStorage.removeItem("ep_current_teacher");
  };

  // Logout both Student and Teacher
  const handleLogout = () => {
    setStudent(null);
    setCurrentTeacher(null);
    localStorage.removeItem("ep_student_profile");
    localStorage.removeItem("ep_current_teacher");
    setCurrentTab("home");
  };

  // Handle Logo Clicks: 10 consecutive silent clicks bypass directly to teacher dashboard
  const handleLogoClick = () => {
    if (logoClickTimer) {
      clearTimeout(logoClickTimer);
    }

    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);

    if (nextClicks >= 10) {
      setLogoClicks(0);
      setCurrentTab("teacher");
      setShowAccessCodeModal(false);
    } else {
      const timer = setTimeout(() => {
        setLogoClicks(0);
      }, 1500);
      setLogoClickTimer(timer);
    }
  };

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCodeInput === "0908070605") {
      setCurrentTab("teacher");
      setShowAccessCodeModal(false);
      setAccessCodeInput("");
      setAccessCodeError(false);
    } else {
      setAccessCodeError(true);
    }
  };

  const handleSelectTeacher = (teacher: Teacher | null) => {
    setCurrentTeacher(teacher);
    if (teacher) {
      localStorage.setItem("ep_current_teacher", JSON.stringify(teacher));
      fetchCurriculumData(teacher.uid);
      // Auto redirect to administrative dashboard
      setCurrentTab("teacher");
    } else {
      localStorage.removeItem("ep_current_teacher");
      fetchCurriculumData("teacher-sarah");
    }
  };

  const showLoginAndOnboarding = currentTab !== "teacher" && (
    !student || 
    !student.selectedLanguage || 
    !student.selectedLevelCode || 
    !student.selectedTeacherId ||
    !student.isRegistrationComplete
  );

  if (showLoginAndOnboarding) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="applet-root">
        <LoginPage
          isArabic={isArabic}
          onAuthSuccess={handleAuthSuccess}
          student={student}
          onUpdateStudent={handleUpdateStudent}
          onLogoClick={handleLogoClick}
        />
      </div>
    );
  }

  // Daily Study Goal calculations (Goal: 1 hour = 3600 seconds)
  const dailyGoalSeconds = 3600;
  const currentTotalToday = (student?.studySecondsToday || 0) + (isStudying ? studyElapsedSeconds : 0);
  const remainingSeconds = Math.max(0, dailyGoalSeconds - currentTotalToday);

  const activeTeacherId = currentTeacher ? currentTeacher.uid : (student?.selectedTeacherId || "teacher-sarah");
  const activeTeacher = teachers.find(t => t.uid === activeTeacherId) || currentTeacher;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300" id="applet-root">
      
      {/* Top Navigation Panel */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isArabic={isArabic}
        setIsArabic={setIsArabic}
        student={student}
        teacher={currentTeacher}
        activeTeacher={activeTeacher}
        onLogout={handleLogout}
        onLogoClick={handleLogoClick}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenMenu={() => setIsSidebarOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Modern Slide-out Sidebar Drawer Menu */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isArabic={isArabic}
        onOpenAuth={() => setShowAuthModal(true)}
        isLoggedIn={!!student || !!currentTeacher}
        unreadCount={unreadCount}
      />

      {/* Main Page Layout Wrapper */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-8">
        
        {/* TAB 1: THE GENERAL HERO & PROGRESS DASHBOARD (HOME) */}
        {currentTab === "home" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-12"
            id="home-view-container"
          >
            
            {/* Header & Stats Banner - HOME */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-indigo-500/10">
              <div className="relative z-10 max-w-2xl text-left rtl:text-right space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  {isArabic ? "لوحة التحكم الرئيسية" : "Main Dashboard"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight">
                  {isArabic ? "الرئيسية" : "Home"}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                  {isArabic
                    ? "تعرض آخر الأنشطة، الإعلانات، والتقدم العام."
                    : "View latest activities, announcements, and overall progress."}
                </p>
              </div>
              {/* Background design accents */}
              <div className="absolute right-0 bottom-0 opacity-15 rtl:left-0 rtl:right-auto pointer-events-none">
                <LayoutDashboard className="w-72 h-72 -mr-12 -mb-12 text-indigo-400" />
              </div>
            </div>

            {/* Quick Student Dashboard (Synced Stats Panel) */}
            {student && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                  <div className="text-center sm:text-left rtl:sm:text-right relative z-10">
                    <span className="text-[9px] bg-white/20 text-white font-extrabold uppercase tracking-widest font-mono px-2.5 py-0.5 rounded-full border border-white/10">
                      {isArabic ? "الملف التعلمي النشط" : "Personal Learning Dashboard"}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1.5">
                      {isArabic ? `أهلاً بك مجدداً، ${student.name} 👋` : `Welcome Back, ${student.name} 👋`}
                    </h3>
                  </div>

                  <span className="text-xs bg-white/15 backdrop-blur-sm border border-white/20 text-white font-extrabold px-3.5 py-2 rounded-xl relative z-10">
                    {isArabic ? "المستوى اللغوي:" : "Active level:"} {student.level}
                  </span>
                </div>

                {/* Progressive stats bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
                  {/* 1. Consecutive Days (Streak) */}
                  <div className="relative bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800/80 hover:bg-orange-50/50 dark:hover:bg-orange-950/10 transition-all select-none overflow-hidden group flex flex-col items-center justify-center">
                    <button
                      onClick={handleIncrementStreak}
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer focus:outline-none"
                      title={isArabic ? "اضغط لزيادة الأيام المتتالية بنسبة يوم واحد" : "Click to increment consecutive days by 1"}
                    >
                      <div className="flex items-center justify-center gap-1.5 relative">
                        <Flame 
                          className={`w-6 h-6 text-orange-500 fill-current transition-all duration-300 ${
                            streakFireActive ? "scale-150 animate-bounce text-red-500" : "group-hover:scale-115"
                          }`} 
                        />
                        <span className="text-2xl font-black font-display text-orange-600 dark:text-orange-400 font-mono">
                          {student.dailyStreak || 0}
                        </span>
                        
                        {/* Animated floating fire micro-interaction */}
                        <AnimatePresence>
                          {streakFireActive && (
                            <motion.span
                              initial={{ opacity: 0, y: 10, scale: 0.5 }}
                              animate={{ opacity: 1, y: -25, scale: 1.5 }}
                              exit={{ opacity: 0 }}
                              className="absolute text-lg pointer-events-none"
                            >
                              🔥
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                        {isArabic ? "الأيام المتتالية" : "Consecutive Days"}
                      </p>
                    </button>
                    
                    {/* Small Reset Button on hover */}
                    <button
                      onClick={handleResetStreak}
                      className="absolute bottom-1 right-2 text-[8px] text-slate-400 dark:text-slate-500 hover:text-red-500 font-bold underline opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      {isArabic ? "تصفير" : "Reset"}
                    </button>
                  </div>

                  {/* 2. Completed Lessons */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black font-display text-slate-800 dark:text-slate-100 font-mono">
                      {student.completedLessons.length}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                      {isArabic ? "الدروس المكتملة" : "Completed Lessons"}
                    </p>
                  </div>

                  {/* 3. Study Log */}
                  <div className="flex flex-col justify-between">
                    <button
                      onClick={isStudying ? handleStopStudy : handleStartStudy}
                      className={`w-full h-full rounded-2xl p-4 text-center border transition-all flex flex-col items-center justify-center relative overflow-hidden cursor-pointer ${
                        isStudying 
                          ? "bg-indigo-600 hover:bg-indigo-700 border-indigo-700 text-white shadow-md animate-pulse" 
                          : "bg-slate-50 dark:bg-slate-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/15 border-slate-150 dark:border-slate-800/80 text-slate-800 dark:text-slate-100"
                      }`}
                      title={isArabic ? (isStudying ? "اضغط لإنهاء وحفظ جلسة المذاكرة" : "اضغط لبدء احتساب وقت المذاكرة اليومي") : (isStudying ? "Click to Save study session" : "Click to Start studying timer")}
                    >
                      <div className="flex items-center gap-1.5 justify-center">
                        <Clock className={`w-4.5 h-4.5 ${isStudying ? "animate-spin-slow text-white" : "text-indigo-600 dark:text-indigo-400"}`} />
                        <span className="text-2xl font-black font-display font-mono">
                          {isStudying 
                            ? formatDuration(studyElapsedSeconds) 
                            : formatDuration(student.studySecondsToday || 0)}
                        </span>
                      </div>
                      
                      <p className={`text-[11px] font-black uppercase tracking-wider mt-1 ${isStudying ? "text-indigo-150" : "text-slate-500 dark:text-slate-400"}`}>
                        {isStudying 
                          ? (isArabic ? "مذاكرة نشطة (حفظ)" : "Active Study (Save)") 
                          : (isArabic ? "سجل المذاكرة" : "Study Log")}
                      </p>
                    </button>
                    
                    {/* Remaining goal text below the button */}
                    <div className="text-center mt-1">
                      <p className="text-[9px] font-extrabold text-slate-400 leading-tight">
                        {remainingSeconds > 0 ? (
                          isArabic 
                            ? `المتبقي للهدف: ${formatDuration(remainingSeconds)}` 
                            : `Left for Goal: ${formatDuration(remainingSeconds)}`
                        ) : (
                          isArabic 
                            ? "تم تحقيق الهدف! 🎉" 
                            : "Goal Achieved! 🎉"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* 4. Saved Words */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black font-display text-slate-800 dark:text-slate-100 font-mono">
                      {student.savedWords.length}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                      {isArabic ? "الكلمات المحفوظة" : "Saved Words"}
                    </p>
                  </div>

                  {/* 5. Time Remaining in Day (Countdown) */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-2.5xl font-black font-display text-indigo-600 dark:text-indigo-400 font-mono tracking-wider">
                      {timeRemainingInDay || "00:00:00"}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                      {isArabic ? "متبقي في اليوم" : "Time Left in Day"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* DAILY TASKS EMBEDDED DIRECTLY BELOW WELCOME STATS BANNER */}
            {student && (
              <DailyTasksSection
                student={student}
                isArabic={isArabic}
                onOpenAuth={() => setShowAuthModal(true)}
                onUpdateStudent={handleUpdateStudent}
              />
            )}



            {/* ERRORS & OBSTACLES REGISTER CARD */}
            {student && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="errors-obstacles-card">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-100 text-rose-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-800 font-display">
                        {isArabic ? "تسجيل الأخطاء والمعيقات" : "Errors & Obstacles Log"}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isArabic 
                          ? "سجّل أخطاءك، الصعوبات التي واجهتك، وكيفية معالجتها لترسيخ التعلم." 
                          : "Record your errors, difficulties faced, and how you resolved them to solidify learning."}
                      </p>
                    </div>
                  </div>

                  {!showErrorObstacleForm && (
                    <button
                      onClick={() => {
                        setEditingErrorObstacleId(null);
                        setFormErrorCommitted("");
                        setFormDifficultyFaced("");
                        setFormHowResolved("");
                        setShowErrorObstacleForm(true);
                      }}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-indigo-100 cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isArabic ? "تسجيل سجل جديد" : "Record New Entry"}</span>
                    </button>
                  )}
                </div>

                {/* Dynamic Inline Form */}
                {showErrorObstacleForm && (
                  <form onSubmit={handleSaveErrorObstacle} className="bg-slate-50/50 border border-slate-100 p-5 sm:p-6 rounded-2xl space-y-4 animate-fade-in" id="error-obstacle-form">
                    <h4 className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-2">
                      {editingErrorObstacleId 
                        ? (isArabic ? "تعديل سجل الأخطاء والمعيقات" : "Edit Log Entry") 
                        : (isArabic ? "إضافة سجل أخطاء ومعيقات جديد" : "New Log Entry")}
                    </h4>

                    <div className="space-y-4">
                      {/* Unified single input field */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {isArabic ? "سجل الأخطاء والمعيقات وطريقة حلها:" : "Errors, Obstacles, and Resolution Details:"}
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={formErrorCommitted}
                          onChange={(e) => setFormErrorCommitted(e.target.value)}
                          placeholder={isArabic 
                            ? "اكتب هنا الأخطاء التي ارتكبتها أو الصعوبات التي واجهتك وكيف قمت بحلها ومعالجتها لترسيخ التعلم..." 
                            : "Write here the errors you made, obstacles faced, and how you resolved or practiced them..."}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowErrorObstacleForm(false);
                          setEditingErrorObstacleId(null);
                        }}
                        className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                      >
                        {isArabic ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                      >
                        {isArabic ? "حفظ السجل" : "Save Entry"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Entries List */}
                <div className="space-y-4">
                  {(!student.errorObstacles || student.errorObstacles.length === 0) ? (
                    <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400">
                        {isArabic 
                          ? "لم تقم بتسجيل أي أخطاء أو معيقات بعد. ابدأ الآن لمتابعة إنجازاتك ومعالجتها!" 
                          : "No errors or obstacles logged yet. Start now to track your fixes!"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {student.errorObstacles.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4 relative">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                {new Date(item.createdAt).toLocaleDateString(isArabic ? 'ar-EG-u-nu-latn' : 'en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleStartEditErrorObstacle(item)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title={isArabic ? "تعديل" : "Edit"}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteErrorObstacle(item.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                  title={isArabic ? "حذف" : "Delete"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Unified description content */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md inline-block">
                                {isArabic ? "سجل الخطأ أو العائق والعلاج" : "Error, Obstacle & Resolution"}
                              </span>
                              <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                {item.errorCommitted}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom spacer / aesthetic margin */}
            <div className="h-4" />
          </motion.div>
        )}

        {/* TAB 2: LESSONS & QUIZZES */}
        {currentTab === "lessons" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <LessonsSection
              lessons={lessons}
              student={student}
              onUpdateStudent={handleUpdateStudent}
              onOpenAuth={() => setShowAuthModal(true)}
              isArabic={isArabic}
            />
          </motion.div>
        )}

        {/* TAB 3: VOCABULARY BANK & WORD QUIZ */}
        {currentTab === "vocab" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <VocabularySection
              vocabulary={vocabulary}
              vocabCategories={vocabCategories}
              student={student}
              onUpdateStudent={handleUpdateStudent}
              onOpenAuth={() => setShowAuthModal(true)}
              isArabic={isArabic}
            />
          </motion.div>
        )}

        {/* TAB 4: LIVE CLASSROOM SCHEDULER */}
        {currentTab === "live" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <LiveClassesSection
              sessions={liveSessions}
              student={student}
              isArabic={isArabic}
            />
          </motion.div>
        )}

        {/* TAB 5.5: INTERACTIVE LINGUISTIC TRAINING LABORATORY */}
        {currentTab === "training" && student && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <TrainingSection
              student={student}
              isArabic={isArabic}
              onUpdateStudent={handleUpdateStudent}
            />
          </motion.div>
        )}

        {/* TAB 6: STUDENT PROFILE */}
        {currentTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <ProfileSection
              student={student}
              onUpdateStudent={handleUpdateStudent}
              lessons={lessons}
              vocabulary={vocabulary}
              isArabic={isArabic}
              onOpenAuth={() => setShowAuthModal(true)}
              isStudying={isStudying}
              setIsStudying={setIsStudying}
              studyElapsedSeconds={studyElapsedSeconds}
              setStudyElapsedSeconds={setStudyElapsedSeconds}
              formatDuration={formatDuration}
            />
          </motion.div>
        )}

        {/* TAB 7: HIDDEN TEACHER & PORTAL PANEL */}
        {currentTab === "teacher" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <TeacherDashboard
              currentTeacher={currentTeacher}
              onSelectTeacher={handleSelectTeacher}
              lessons={lessons}
              vocabulary={vocabulary}
              vocabCategories={vocabCategories}
              liveSessions={liveSessions}
              onRefreshData={fetchCurriculumData}
              isArabic={isArabic}
            />
          </motion.div>
        )}

        {/* TAB 9: WEEKLY TASKS */}
        {currentTab === "tasks_weekly" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <WeeklyTasksSection
              student={student}
              isArabic={isArabic}
              onOpenAuth={() => setShowAuthModal(true)}
              onUpdateStudent={handleUpdateStudent}
            />
          </motion.div>
        )}

        {/* TAB: SKILL DEVELOPMENT */}
        {currentTab === "skills_development" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <SkillDevelopmentSection
              isArabic={isArabic}
              student={student}
              teacherId={currentTeacher?.uid || activeTeacherId}
            />
          </motion.div>
        )}


        {/* TAB: RECORDED LESSONS */}
        {currentTab === "recorded_lessons" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <RecordedLessonsSection
              student={student}
              isArabic={isArabic}
              vocabulary={vocabulary}
              onUpdateStudent={handleUpdateStudent}
              teacherId={currentTeacher?.uid || activeTeacherId}
              isTeacherMode={!!currentTeacher}
            />
          </motion.div>
        )}

        {/* TAB 10: ABOUT US */}
        {currentTab === "about" && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -35 : 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <AboutUsSection
              isArabic={isArabic}
            />
          </motion.div>
        )}

      </main>

      {/* Persistent Beautiful Footer (Creation Date & Copyright) */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 text-center text-xs shrink-0 select-none pb-28 md:pb-8" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-semibold text-slate-200">
            {isArabic ? "منصة Pathway Languages لتعليم اللغات" : "Pathway Languages Learning Platform"}
          </p>
          <p className="text-[11px] text-slate-500 font-mono leading-normal">
            &copy; 2026 - {isArabic ? "جميع الحقوق محفوظة. تأسست المنصة في يونيو 2026 م." : "All Rights Reserved. Created in June 2026."}
          </p>
        </div>
      </footer>

      {/* Student Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isArabic={isArabic}
        onSuccess={handleAuthSuccess}
      />

      {/* Hidden Teacher Access Code Modal */}
      {showAccessCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full mx-4 relative">
            <button
              onClick={() => setShowAccessCodeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-lg font-bold cursor-pointer"
            >
              &times;
            </button>
            <form onSubmit={handleAccessCodeSubmit} className="space-y-4 pt-2">
              <div>
                <input
                  type="password"
                  required
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  placeholder={isArabic ? "أدخل كود الوصول" : "Enter access code"}
                  className="w-full px-4 py-3 border border-slate-250 rounded-2xl text-center text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 font-mono"
                  autoFocus
                />
              </div>

              {accessCodeError && (
                <p className="text-center text-xs text-rose-600 font-bold">
                  {isArabic ? "الرمز المدخل غير صحيح!" : "Invalid access code!"}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md shadow-indigo-100 cursor-pointer"
              >
                {isArabic ? "دخول" : "Enter"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
