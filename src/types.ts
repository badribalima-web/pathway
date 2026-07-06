export interface ErrorObstacleLog {
  id: string;
  errorCommitted: string;
  difficultyFaced: string;
  howResolved: string;
  createdAt: string;
}

export interface Student {
  uid: string;
  name: string;
  email: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  progress: number; // 0-100
  completedLessons: string[]; // array of lesson IDs
  savedWords: string[]; // array of word IDs
  dailyStreak: number;
  lastActive: string; // ISO date
  points: number;
  isDisabled?: boolean;
  selectedLanguage?: string;
  selectedLevelCode?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  selectedTeacherId?: string;
  selectedTeacherName?: string;
  allowTeacherChange?: boolean;
  isRegistrationComplete?: boolean;
  registrationDate?: string;
  lastLogin?: string;
  unlockedLevels?: ("A1" | "A2" | "B1" | "B2" | "C1" | "C2")[];
  studySecondsToday?: number;
  studySecondsThisWeek?: number;
  studySecondsTotal?: number;
  notes?: string;
  errorObstacles?: ErrorObstacleLog[];
  completedBooks?: string[];
  completedWeeklyTasks?: string[];
}

export interface ResourceOrTip {
  id: string;
  type: "resource" | "tip";
  title: string;
  url?: string;
  content: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "All";
  createdAt: string;
  isHidden?: boolean;
}

export interface Teacher {
  uid: string;
  name: string;
  email: string;
  photoUrl: string;
  loginCode?: string;
  secretCode?: string;
  isActivated?: boolean;
  createdAt: string; // ISO string
  isDisabled?: boolean;
  isHiddenFromSelection?: boolean;
  specialty?: string;
  specialtyAr?: string;
  customLogoUrl?: string;
  levels?: string[];
}

export interface QuizQuestion {
  question: string;
  type?: "multiple" | "true_false" | "fill_blank";
  options?: string[];
  correctAnswer: number | string; // index of correct option or string for fill-in-the-blanks
}

export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  category: "grammar" | "reading" | "writing" | "listening" | "speaking" | "shadowing";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  content: string; // Markdown English
  contentAr: string; // Markdown Arabic
  quiz: QuizQuestion[];
  createdAt: string;
  videoUrl?: string;
  imageUrl?: string;
  order?: number;
  attachedLinks?: { title: string; url: string; }[];
  isHidden?: boolean;
}

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  definition: string;
  definitionAr: string;
  example: string;
  category: string;
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  createdAt: string;
  partOfSpeech?: string;
  pronunciation?: string;
  exampleAr?: string;
  isHidden?: boolean;
}

export interface DynamicVocabCategory {
  id: string;
  en: string;
  ar: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  imageUrl?: string;
  order: number;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  date: string; // e.g. "2026-06-25"
  time: string; // e.g. "18:00"
  link: string;
  status: "upcoming" | "live" | "completed";
  teacherName: string;
  createdAt: string;
  targetLevel?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "teacher" | "ai";
  text: string;
  timestamp: string; // ISO date
}

export interface Announcement {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  content: string;
  targetStudentIds: string[]; // empty or ["all"] means all students, otherwise specific student uids
  createdAt: string; // ISO date
}

export interface DailyTask {
  id: string;
  studentId: string;
  title: string;
  titleAr: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface WeeklyTask {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  type?: string; // Type or Skill
  completed: boolean;
  day: "saturday" | "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
  order: number;
  createdAt: string;
}

export interface TrainingTopic {
  id: string;
  name: string; // Topic name, e.g., "Tenses"
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  language: "en" | "ar";
  order: number; // For priority ordering
  createdAt: string;
  type?: "speaking" | "writing" | "question";
  isHidden?: boolean;
}

export interface TrainingQuestion {
  id: string;
  topicId: string; // Matches TrainingTopic.id
  questionText: string;
  answerOptions: string[]; // List of options (usually 4 choices)
  correctAnswerIndex: number; // 0-based index of correct option
  createdAt: string;
}

export interface TypingSentence {
  id: string;
  sentence: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  language: "en" | "ar";
  createdAt: string;
}

export interface RecordedLesson {
  id: string;
  title: string;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  order: number;
  videoUrl: string;
  createdAt: string;
  isHidden?: boolean;
  quizzes?: any[];
  vocabWords?: any[];
}

export interface LibraryBook {
  id: string;
  teacherId?: string;
  bookNumber: number;
  coverColor: string; // e.g. 'bg-indigo-600' or similar CSS colors
  questionText: string;
  options: string[]; // exactly 4 options
  correctOptionIndex: number; // 0-3
  createdAt: string;
}

export interface TrainingAttempt {
  id: string;
  studentId: string;
  type: "writing" | "speaking";
  promptText: string;
  studentAnswer: string;
  score: number; // 0-100
  accuracyRate: number; // 0-100
  errorCount: number;
  mostFrequentErrors: string[];
  performanceLevel: string;
  createdAt: string; // ISO date
  report: any; // Entire structured feedback JSON
}

export interface TrainingLink {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  url: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "All";
  createdAt: string;
}export interface SkillLink {
  id: string;
  skillType: "listening" | "reading" | "writing" | "speaking";
  title: string;
  url: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  order: number;
  createdAt: string;
}

