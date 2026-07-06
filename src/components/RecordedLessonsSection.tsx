import React, { useState, useEffect, useMemo } from "react";
import { RecordedLesson, Student, Vocabulary } from "../types";
import { 
  getRecordedLessons, 
  subscribeToRecordedLessons, 
  saveVocabulary, 
  saveRecordedLesson, 
  deleteRecordedLesson 
} from "../lib/dbService";
import { 
  Play, 
  PlayCircle, 
  Eye, 
  Calendar, 
  Award, 
  Sparkles, 
  AlertCircle, 
  Film, 
  BookOpen, 
  Clock, 
  ArrowLeft, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Brain, 
  CheckCircle, 
  XCircle, 
  Tv, 
  Check, 
  HelpCircle,
  Volume1,
  Plus,
  Edit,
  Trash2,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RecordedLessonsSectionProps {
  student: Student | null;
  isArabic: boolean;
  vocabulary?: Vocabulary[];
  onUpdateStudent?: (updated: Student) => void;
  teacherId?: string;
  isTeacherMode?: boolean;
}

export default function RecordedLessonsSection({ 
  student, 
  isArabic,
  vocabulary = [],
  onUpdateStudent,
  teacherId,
  isTeacherMode = false
}: RecordedLessonsSectionProps) {
  const [lessons, setLessons] = useState<RecordedLesson[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>(student?.level || "A1");
  const [activeVideo, setActiveVideo] = useState<RecordedLesson | null>(null);

  // Form states for adding/editing recorded lessons
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    topic: "",
    level: "A1" as any,
    order: 1,
    videoUrl: ""
  });

  // Quiz interactive state for active lesson
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  useEffect(() => {
    // Subscribe to recorded lessons in real-time
    const unsubscribe = subscribeToRecordedLessons((list) => {
      setLessons(list);
    }, teacherId || student?.selectedTeacherId || "teacher-sarah");
    return () => unsubscribe();
  }, [teacherId, student?.selectedTeacherId]);

  // Sync selectedLevel with student profile level when profile changes
  useEffect(() => {
    if (student?.level) {
      setSelectedLevel(student.level);
    }
  }, [student?.level]);

  // Filter lessons by selected level and hide them if marked hidden by teacher
  const filteredLessons = lessons
    .filter((lesson) => lesson.level === selectedLevel && (isTeacherMode || !lesson.isHidden))
    .sort((a, b) => a.order - b.order);

  // Helper to convert typical YouTube/Vimeo links into embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let embedUrl = url;
    
    if (url.includes("youtube.com/watch")) {
      try {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get("v");
        if (v) {
          embedUrl = `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
        }
      } catch {}
    } 
    else if (url.includes("youtu.be/")) {
      try {
        const parts = url.split("youtu.be/");
        if (parts[1]) {
          const id = parts[1].split(/[?#]/)[0];
          embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        }
      } catch {}
    } 
    else if (url.includes("youtube.com/embed/")) {
      if (!url.includes("autoplay=")) {
        embedUrl = url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
      }
    }
    
    return embedUrl;
  };

  // TTS Speech synthesis pronunciation helper
  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  // Determine if a specific lesson word is saved in the student profile
  const isWordSaved = (wordText: string) => {
    if (!student) return false;
    // Match either by exact word string or custom ID
    return student.savedWords.some(savedId => {
      // Find in full vocabulary first
      const fullWord = vocabulary.find(v => v.id === savedId);
      if (fullWord) {
        return fullWord.word.toLowerCase() === wordText.toLowerCase();
      }
      return savedId.replace("vocab_rec_", "").toLowerCase() === wordText.toLowerCase();
    });
  };

  // Handle saving lesson word to the user's vocabulary list
  const handleToggleLessonWord = async (v: {
    word: string;
    translation: string;
    partOfSpeech: string;
    pronunciation: string;
    example: string;
  }) => {
    if (!student) {
      alert(isArabic 
        ? "يرجى تسجيل الدخول لحفظ الكلمات في ملفك الشخصي!" 
        : "Please sign in to save words to your profile!"
      );
      return;
    }

    const wordKey = `vocab_rec_${v.word.toLowerCase()}`;
    const alreadySaved = isWordSaved(v.word);

    let updatedSavedWords: string[];
    if (alreadySaved) {
      // Find saved ID(s) representing this word and remove
      const idsToRemove = student.savedWords.filter(savedId => {
        const fullWord = vocabulary.find(v => v.id === savedId);
        const matchesName = fullWord ? fullWord.word.toLowerCase() === v.word.toLowerCase() : false;
        const matchesKey = savedId === wordKey;
        return matchesName || matchesKey;
      });
      updatedSavedWords = student.savedWords.filter(id => !idsToRemove.includes(id) && id !== wordKey);
    } else {
      // Save word permanently to the database so it can be rendered anywhere
      const wordToSave: Vocabulary = {
        id: wordKey,
        word: v.word,
        translation: v.translation,
        definition: "",
        definitionAr: "",
        example: v.example,
        category: activeVideo ? `Lesson: ${activeVideo.title}` : "Lesson Words",
        level: activeVideo?.level || "A1",
        partOfSpeech: v.partOfSpeech,
        pronunciation: v.pronunciation,
        createdAt: new Date().toISOString()
      };
      await saveVocabulary(wordToSave, student.selectedTeacherId || "global");
      updatedSavedWords = [...student.savedWords, wordKey];
    }

    if (onUpdateStudent) {
      onUpdateStudent({
        ...student,
        savedWords: updatedSavedWords
      });
    }
  };

  // Dynamic Content Generator for active lesson details
  const activeLessonContent = useMemo(() => {
    if (!activeVideo) return null;
    const topicLower = (activeVideo.topic || "").toLowerCase();
    const titleLower = (activeVideo.title || "").toLowerCase();
    
    // Default Fallback
    let words = [
      {
        word: "Acquire",
        translation: isArabic ? "يكتسب / يتعلم" : "Acquire / Learn",
        partOfSpeech: "Verb",
        pronunciation: "/əˈkwaɪər/",
        example: "I managed to acquire new learning habits."
      },
      {
        word: "Comprehend",
        translation: isArabic ? "يفهم / يستوعب" : "Comprehend / Understand",
        partOfSpeech: "Verb",
        pronunciation: "/ˌkɒm.prɪˈhend/",
        example: "She could comprehend the complex grammar."
      },
      {
        word: "Diligent",
        translation: isArabic ? "مجتهد / مثابر" : "Diligent / Hardworking",
        partOfSpeech: "Adjective",
        pronunciation: "/ˈdɪl.ɪ.dʒənt/",
        example: "A diligent student always succeeds."
      },
      {
        word: "Evolve",
        translation: isArabic ? "يتطور" : "Evolve / Develop",
        partOfSpeech: "Verb",
        pronunciation: "/ɪˈvɒlv/",
        example: "Language continues to evolve over time."
      }
    ];

    let questions = [
      {
        question: isArabic ? "ما معنى كلمة 'Diligent'؟" : "What does 'Diligent' mean?",
        options: isArabic 
          ? ["كسول وغير مبالي", "مجتهد وحريص", "سريع كثير الأخطاء", "غاضب ومحبط"]
          : ["Lazy and unfocused", "Hardworking and careful", "Fast but full of errors", "Angry and frustrated"],
        correctAnswer: 1
      },
      {
        question: isArabic ? "أي الكلمات التالية تعني 'يفهم ويستوعب بالكامل'؟" : "Which word is a synonym for 'to understand fully'?",
        options: isArabic
          ? ["يتجاهل (Ignore)", "يستوعب (Comprehend)", "يربك (Confuse)", "ينسى (Forget)"]
          : ["Ignore", "Comprehend", "Confuse", "Forget"],
        correctAnswer: 1
      },
      {
        question: isArabic ? "أكمل الجملة: اللغة الإنجليزية لغة عالمية تستمر في _____" : "English is a global language that continues to _____",
        options: ["evolve", "evolves", "evolving", "evolved"],
        correctAnswer: 0
      }
    ];

    // Topic Grammar/Tenses
    if (topicLower.includes("tense") || topicLower.includes("grammar") || topicLower.includes("present") || titleLower.includes("tense") || titleLower.includes("grammar")) {
      words = [
        {
          word: "Always",
          translation: isArabic ? "دائماً" : "Always",
          partOfSpeech: "Adverb",
          pronunciation: "/ˈɔːl.weɪz/",
          example: "He always speaks the truth."
        },
        {
          word: "Usually",
          translation: isArabic ? "عادةً" : "Usually",
          partOfSpeech: "Adverb",
          pronunciation: "/ˈjuː.ʒu.ə.li/",
          example: "She usually goes for a walk in the evening."
        },
        {
          word: "Habit",
          translation: isArabic ? "عادة / سلوك مكرر" : "Habit",
          partOfSpeech: "Noun",
          pronunciation: "/ˈhæb.ɪt/",
          example: "Reading before bed is a good habit."
        },
        {
          word: "Routine",
          translation: isArabic ? "روتين / نمط متبع" : "Routine",
          partOfSpeech: "Noun",
          pronunciation: "/ruːˈtiːn/",
          example: "Morning routine keeps me focused."
        }
      ];

      questions = [
        {
          question: isArabic ? "أي جملة مكتوبة في زمن المضارع البسيط (Present Simple)؟" : "Which sentence is in the Present Simple tense?",
          options: isArabic
            ? ["إنها تغني الآن (She is singing).", "هي تغني كل يوم (She sings every day).", "لقد غنت للتو (She has sung).", "غنت أمس (She sang yesterday)."]
            : ["She is singing a song.", "She sings a song every day.", "She has sung a song.", "She sang a song yesterday."],
          correctAnswer: 1
        },
        {
          question: isArabic ? "اختر الشكل الصحيح للفعل: He _____ coffee in the morning." : "Choose the correct form: He _____ coffee in the morning.",
          options: ["drink", "drinks", "drinking", "drank"],
          correctAnswer: 1
        },
        {
          question: isArabic ? "أكمل النفي: We _____ cold weather." : "Choose the correct negation: We _____ cold weather.",
          options: ["not like", "don't like", "doesn't like", "isn't like"],
          correctAnswer: 1
        }
      ];
    } 
    // Topic Workplace/Business/Conversation
    else if (topicLower.includes("vocab") || topicLower.includes("conversation") || topicLower.includes("business") || topicLower.includes("work") || titleLower.includes("work") || titleLower.includes("business")) {
      words = [
        {
          word: "Negotiate",
          translation: isArabic ? "يتفاوض" : "Negotiate",
          partOfSpeech: "Verb",
          pronunciation: "/nəˈɡəʊ.ʃi.eɪt/",
          example: "They managed to negotiate a better deal."
        },
        {
          word: "Professional",
          translation: isArabic ? "مهني / محترف" : "Professional",
          partOfSpeech: "Adjective",
          pronunciation: "/prəˈfeʃ.ən.əl/",
          example: "We need to maintain a professional attitude."
        },
        {
          word: "Deadline",
          translation: isArabic ? "الموعد النهائي" : "Deadline",
          partOfSpeech: "Noun",
          pronunciation: "/ˈded.laɪn/",
          example: "The deadline for the report is Friday."
        },
        {
          word: "Collaborate",
          translation: isArabic ? "يتعاون / يعمل معاً" : "Collaborate",
          partOfSpeech: "Verb",
          pronunciation: "/kəˈlæb.ə.reɪt/",
          example: "Teams collaborate on creative tasks."
        }
      ];

      questions = [
        {
          question: isArabic ? "ما معنى كلمة 'Deadline' في بيئة العمل؟" : "What is the meaning of 'Deadline'?",
          options: isArabic
            ? ["خط مرسوم على الخريطة", "آخر موعد نهائي لإنجاز المهمة", "شكل من أشكال الأمان", "وقت الاستراحة"]
            : ["A line drawn on a map.", "The final date/time to finish a task.", "A form of security.", "A break time."],
          correctAnswer: 1
        },
        {
          question: isArabic ? "أي الكلمات تعني العمل المشترك والتعاون بين الزملاء؟" : "Which word means 'to work jointly with others'?",
          options: isArabic
            ? ["عزل (Isolate)", "تعاون (Collaborate)", "منافسة (Compete)", "إنهاء (Terminate)"]
            : ["Isolate", "Collaborate", "Compete", "Terminate"],
          correctAnswer: 1
        },
        {
          question: isArabic ? "أكمل: We must _____ the contract details." : "Complete: We must _____ the contract details with the client.",
          options: ["negotiate", "negotiating", "negotiated", "negotiates"],
          correctAnswer: 0
        }
      ];
    } 
    // Topic Pronunciation/Speaking/Shadowing
    else if (topicLower.includes("pronun") || topicLower.includes("speaking") || topicLower.includes("shadow") || titleLower.includes("speak") || titleLower.includes("pronun")) {
      words = [
        {
          word: "Fluency",
          translation: isArabic ? "الطلاقة" : "Fluency",
          partOfSpeech: "Noun",
          pronunciation: "/ˈfluː.ən.si/",
          example: "She speaks English with great fluency."
        },
        {
          word: "Intonation",
          translation: isArabic ? "التنغيم / نبرة الصوت" : "Intonation",
          partOfSpeech: "Noun",
          pronunciation: "/ˌɪn.təˈneɪ.ʃən/",
          example: "Intonation can change the meaning of a sentence."
        },
        {
          word: "Expression",
          translation: isArabic ? "التعبير / التوضيح" : "Expression",
          partOfSpeech: "Noun",
          pronunciation: "/ɪkˈspreʃ.ən/",
          example: "Use body language to support your expression."
        },
        {
          word: "Pronounce",
          translation: isArabic ? "ينطق" : "Pronounce",
          partOfSpeech: "Verb",
          pronunciation: "/prəˈnaʊns/",
          example: "He can pronounce difficult words easily."
        }
      ];

      questions = [
        {
          question: isArabic ? "ما الذي يشير إلى ارتفاع وانخفاض نبرة الصوت أثناء التحدث؟" : "What refers to the rise and fall of voice pitch in speaking?",
          options: isArabic
            ? ["اللهجة (Accent)", "التنغيم والنبرة (Intonation)", "السرعة (Speed)", "القواعد (Grammar)"]
            : ["Accent", "Intonation", "Speed", "Grammar"],
          correctAnswer: 1
        },
        {
          question: isArabic ? "التحدث باللغة بسهولة ويسر ودون تردد يسمى:" : "To speak a language easily, smoothly, and without hesitation is to have:",
          options: isArabic
            ? ["طلاقة (Fluency)", "تردد (Hesitation)", "ترجمة (Translation)", "حفظ (Memorization)"]
            : ["Fluency", "Hesitation", "Translation", "Memorization"],
          correctAnswer: 0
        },
        {
          question: isArabic ? "اختر الفعل المناسب: Can you please _____ this word?" : "Choose the correct verb: Can you please _____ this word for me?",
          options: ["pronounce", "pronunciation", "pronouncing", "pronounced"],
          correctAnswer: 0
        }
      ];
    }

    return { words, questions };
  }, [activeVideo, isArabic]);

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  // ==================== RENDERING DETAILED LESSON VIEW ====================
  if (activeVideo && activeLessonContent) {
    const { words, questions } = activeLessonContent;
    const score = questions.reduce((acc, q, idx) => {
      return acc + (quizAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);

    return (
      <div className="space-y-6 animate-fade-in" id="recorded-lesson-detail">
        {/* Back Button and Title bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <button
            onClick={() => {
              setActiveVideo(null);
              setQuizAnswers({});
              setSubmittedQuiz(false);
            }}
            className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-rose-700 transition-all cursor-pointer bg-slate-50 hover:bg-rose-50 px-4 py-2.5 rounded-xl border border-slate-200/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isArabic ? "العودة لقائمة الحصص" : "Back to All Classes"}</span>
          </button>

          <div className="text-left rtl:text-right space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-md uppercase font-mono border border-rose-100/40">
                {isArabic ? "الحصة" : "Lesson"} #{activeVideo.order}
              </span>
              <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-md font-mono uppercase">
                {activeVideo.level}
              </span>
              <span className="text-xs text-slate-400 font-semibold truncate">
                {activeVideo.topic}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 font-display">
              {activeVideo.title}
            </h2>
          </div>
        </div>

        {/* Two Column Layout: Video Player & Study Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column A: Video Screen Player (Left - 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm font-display flex items-center gap-2 border-b border-slate-100 pb-3">
                <Tv className="w-5 h-5 text-rose-600" />
                <span>{isArabic ? "الفيديو المسجل للشرح" : "Recorded Class Video"}</span>
              </h3>

              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner border border-slate-200">
                {getEmbedUrl(activeVideo.videoUrl) ? (
                  <iframe
                    src={getEmbedUrl(activeVideo.videoUrl)}
                    title={activeVideo.title}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 text-white">
                    <AlertCircle className="w-12 h-12 text-rose-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold">
                        {isArabic ? "رابط فيديو خارجي" : "External Video URL"}
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs">
                        {isArabic 
                          ? "رابط الفيديو المقدم من الأستاذ لا يدعم العرض المباشر هنا. يمكنك فتحه في نافذة جديدة." 
                          : "The video URL provided by the teacher does not support inline frame embeds."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Open Link */}
              <div className="flex justify-end pt-1">
                <a
                  href={activeVideo.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl transition-all border border-slate-200"
                >
                  <Play className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isArabic ? "مشاهدة في يوتيوب / رابط خارجي" : "Watch on YouTube / External Link"}</span>
                </a>
              </div>
            </div>

            {/* Column B-1: Interactive Lesson Quiz */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-800 text-sm font-display flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <span>{isArabic ? "أسئلة تدريبية وتطبيقية" : "Interactive Practice Quiz"}</span>
                </h3>
                {submittedQuiz && (
                  <span className={`text-xs font-black font-mono px-3 py-1 rounded-full ${
                    score === questions.length ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                  }`}>
                    {isArabic ? `النتيجة: ${score} / ${questions.length}` : `Score: ${score} / ${questions.length}`}
                  </span>
                )}
              </div>

              <div className="space-y-6 text-left rtl:text-right">
                {questions.map((q, qIdx) => {
                  return (
                    <div key={qIdx} className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 shrink-0 bg-indigo-50 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold font-mono">
                          {qIdx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                          {q.question}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-7 rtl:pl-0 rtl:pr-7">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[qIdx] === optIdx;
                          const isCorrect = q.correctAnswer === optIdx;
                          const showSuccess = submittedQuiz && isCorrect;
                          const showFail = submittedQuiz && isSelected && !isCorrect;

                          let btnStyle = "border-slate-200 bg-white hover:bg-slate-50/50 hover:border-indigo-300";
                          if (isSelected && !submittedQuiz) {
                            btnStyle = "border-indigo-600 bg-indigo-50 text-indigo-700 font-extrabold";
                          } else if (showSuccess) {
                            btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold";
                          } else if (showFail) {
                            btnStyle = "border-rose-500 bg-rose-50 text-rose-800 font-extrabold";
                          } else if (submittedQuiz) {
                            btnStyle = "border-slate-100 bg-slate-50/20 text-slate-400 cursor-not-allowed";
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={submittedQuiz}
                              onClick={() => {
                                setQuizAnswers(p => ({ ...p, [qIdx]: optIdx }));
                              }}
                              className={`p-3 rounded-xl border text-left rtl:text-right text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {showSuccess && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                              {showFail && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
                {submittedQuiz ? (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setSubmittedQuiz(false);
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    {isArabic ? "إعادة المحاولة" : "Try Again"}
                  </button>
                ) : (
                  <button
                    disabled={Object.keys(quizAnswers).length < questions.length}
                    onClick={() => setSubmittedQuiz(true)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-indigo-100 disabled:shadow-none cursor-pointer"
                  >
                    {isArabic ? "تصحيح الإجابات" : "Check Answers"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Column C: Lesson Words Vocabulary (Right - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-800 text-sm font-display flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-rose-600" />
                  <span>{isArabic ? "مفردات ومصطلحات الحصة" : "Lesson Vocabulary Words"}</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isArabic 
                    ? "استمع لنطق الكلمة، وتعرف على نوعها، ثم احفظها لمراجعتها لاحقاً."
                    : "Listen to word pronunciations, verify part of speech, and bookmark them."}
                </p>
              </div>

              <div className="space-y-4">
                {words.map((w, index) => {
                  const saved = isWordSaved(w.word);
                  return (
                    <div
                      key={index}
                      className="bg-slate-50/70 border border-slate-200/50 rounded-2xl p-4 space-y-3 relative hover:border-indigo-150 transition-all text-left rtl:text-right"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black bg-indigo-50 border border-indigo-100/30 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase font-mono tracking-widest">
                          {w.partOfSpeech}
                        </span>

                        {/* Save Lesson Word */}
                        <button
                          onClick={() => handleToggleLessonWord(w)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 cursor-pointer"
                          title={isArabic ? "حفظ الكلمة" : "Save Word"}
                        >
                          {saved ? (
                            <BookmarkCheck className="w-4 h-4 text-emerald-600 fill-current" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 justify-start">
                          <h4 className="text-sm sm:text-base font-black text-slate-800 font-display">
                            {w.word}
                          </h4>
                          <span className="text-slate-400 text-xs font-mono font-medium">
                            {w.pronunciation}
                          </span>
                          <button
                            onClick={() => handleSpeak(w.word)}
                            className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title={isArabic ? "استمع للنطق" : "Listen Pronunciation"}
                          >
                            <Volume1 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-indigo-600">
                          {w.translation}
                        </p>
                      </div>

                      {/* Optional example sentence inside card */}
                      {w.example && (
                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-[10px] text-slate-500 italic font-medium leading-relaxed font-sans">
                            "{w.example}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rId = editId || `rec_${Date.now()}`;
    const existing = lessons.find(l => l.id === rId);

    const lessonToSave: RecordedLesson = {
      id: rId,
      title: formState.title,
      topic: formState.topic,
      level: formState.level,
      order: Number(formState.order),
      videoUrl: formState.videoUrl,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      isHidden: existing ? existing.isHidden : false,
      quizzes: existing ? existing.quizzes || [] : [],
      vocabWords: existing ? existing.vocabWords || [] : []
    };

    await saveRecordedLesson(lessonToSave, teacherId || "teacher-sarah");
    setShowForm(false);
    setEditId(null);
    setFormState({ title: "", topic: "", level: "A1", order: 1, videoUrl: "" });
  };

  const handleEdit = (lesson: RecordedLesson) => {
    setEditId(lesson.id);
    setFormState({
      title: lesson.title,
      topic: lesson.topic,
      level: lesson.level,
      order: lesson.order,
      videoUrl: lesson.videoUrl
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm(isArabic ? "هل أنت متأكد من حذف هذه الحصة المسجلة؟" : "Are you sure you want to delete this recorded lesson?")) {
      await deleteRecordedLesson(id, teacherId || "teacher-sarah");
    }
  };

  const handleToggleVisibility = async (lesson: RecordedLesson) => {
    const updated: RecordedLesson = {
      ...lesson,
      isHidden: !lesson.isHidden
    };
    await saveRecordedLesson(updated, teacherId || "teacher-sarah");
  };

  // ==================== RENDERING LIST VIEW ====================
  return (
    <div className="space-y-8 animate-fade-in" id="recorded-lessons-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-rose-100">
        <div className="relative z-10 max-w-xl text-left rtl:text-right space-y-4">
          <span className="inline-block bg-rose-500/30 text-rose-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {isArabic ? "أرشيف الحصص المسجلة" : "Recorded Class Library"}
            {isTeacherMode && (
              <span className="ml-2 px-1.5 py-0.5 bg-rose-500 text-white rounded text-[8px] font-black uppercase">
                {isArabic ? "المعلم" : "Teacher"}
              </span>
            )}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
            {isArabic ? "شاهد وراجع الحصص في أي وقت" : "Watch & Review Classes Anytime"}
          </h2>
          <p className="text-neutral-200 text-xs leading-relaxed">
            {isArabic
              ? "مكتبة الحصص المسجلة تتيح لك العودة لأي درس فائت لمراجعته وتثبيت المفاهيم. رتب الحصص وشاهد الشرح مباشرةً بدقة عالية."
              : "Access the full archive of pre-recorded visual lectures structured for your language pathway. Catch up on grammar explanations, pronunciation tips, and study at your own pace."}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 rtl:left-0 rtl:right-auto">
          <Film className="w-72 h-72 -mr-12 -mb-12" />
        </div>
      </div>

      {/* Teacher Add/Edit Form */}
      {isTeacherMode && showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md shadow-rose-50 space-y-4"
        >
          <h3 className="font-extrabold text-sm text-rose-700 uppercase tracking-wider">
            {editId ? (isArabic ? "تعديل الحصة المسجلة" : "Edit Recorded Lesson") : (isArabic ? "إضافة حصة مسجلة جديدة" : "Add New Recorded Lesson")}
          </h3>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {isArabic ? "عنوان الحصة" : "Lesson Title"}
                </label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder={isArabic ? "مثال: مقدمة في تركيب الجملة" : "e.g. Introduction to Sentence Structure"}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {isArabic ? "الموضوع أو التصنيف" : "Topic or Classification"}
                </label>
                <input
                  type="text"
                  required
                  value={formState.topic}
                  onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
                  placeholder={isArabic ? "مثال: قواعد (Grammar)" : "e.g. Grammar, Vocabulary, Writing"}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {isArabic ? "رابط فيديو اليوتيوب" : "YouTube Video URL"}
                </label>
                <input
                  type="url"
                  required
                  value={formState.videoUrl}
                  onChange={(e) => setFormState({ ...formState, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500 font-mono text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isArabic ? "المستوى الدراسي" : "Target Level"}
                  </label>
                  <select
                    value={formState.level}
                    onChange={(e) => setFormState({ ...formState, level: e.target.value as any })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs bg-white outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isArabic ? "ترتيب الحصة (رقم)" : "Lesson Order (Number)"}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formState.order}
                    onChange={(e) => setFormState({ ...formState, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setFormState({ title: "", topic: "", level: "A1", order: 1, videoUrl: "" });
                }}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-50 cursor-pointer"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 cursor-pointer shadow-sm shadow-rose-150"
              >
                {isArabic ? "حفظ الحصة" : "Save Lesson"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Level Selector Tabs */}
      {!isTeacherMode ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-2.5 w-fit">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isArabic ? "المستوى الحالي:" : "Current Level:"}
          </span>
          <span className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-700 rounded-full text-xs font-black">
            {selectedLevel}
          </span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-extrabold text-slate-500 px-2">
              {isArabic ? "تصفية حسب المستوى الدراسي:" : "Filter by Proficiency Level:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => {
                const isStudentLvl = student?.level === lvl;
                const isSelected = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      setSelectedLevel(lvl);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-rose-600 text-white shadow-md shadow-rose-100"
                        : "bg-slate-50 hover:bg-slate-150 text-slate-700 border border-slate-100"
                    }`}
                  >
                    <span>{lvl}</span>
                    {isStudentLvl && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
                      }`}>
                        {isArabic ? "مستواك الحالي" : "Your Level"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {isTeacherMode && !showForm && (
            <button
              onClick={() => {
                setEditId(null);
                setFormState({ title: "", topic: "", level: selectedLevel as any, order: lessons.filter(l => l.level === selectedLevel).length + 1, videoUrl: "" });
                setShowForm(true);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md shadow-rose-100"
            >
              <Plus className="w-4 h-4" />
              <span>{isArabic ? "إضافة حصة مسجلة" : "Add Lesson"}</span>
            </button>
          )}
        </div>
      )}

      {/* Grid List of Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h3 className="font-bold text-slate-800 text-base font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-600" />
            <span>
              {isArabic 
                ? `الحصص المسجلة للمستوى (${selectedLevel})` 
                : `Recorded Lessons for Level (${selectedLevel})`}
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {filteredLessons.length} {isArabic ? "حصص متوفرة" : "Available lessons"}
          </span>
        </div>

        {filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson, idx) => {
              return (
                <div
                  key={lesson.id}
                  className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group ${
                    lesson.isHidden ? "opacity-75 border-slate-250 bg-slate-50/50" : "border-slate-200"
                  }`}
                  id={`recorded-lesson-card-${lesson.id}`}
                >
                  {/* Lesson Order Badge in top right/left */}
                  <div className="absolute top-0 right-0 bg-rose-50 text-rose-700 font-mono text-[10px] font-black px-3 py-1 rounded-bl-xl border-l border-b border-rose-100 uppercase">
                    {isArabic ? "الحصة" : "Lesson"} #{lesson.order}
                  </div>

                  {/* Teacher action overlay inside card */}
                  {isTeacherMode && (
                    <div className="absolute top-0 left-0 bg-slate-50 p-1.5 rounded-br-2xl border-r border-b border-slate-200/60 flex items-center gap-1.5 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(lesson);
                        }}
                        className="p-1 rounded-lg hover:bg-white transition-colors cursor-pointer text-slate-500"
                        title={lesson.isHidden ? (isArabic ? "إظهار للطلاب" : "Show to Students") : (isArabic ? "إخفاء عن الطلاب" : "Hide from Students")}
                      >
                        {lesson.isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-500" /> : <Eye className="w-3.5 h-3.5 text-indigo-500" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(lesson);
                        }}
                        className="p-1 rounded-lg hover:bg-white transition-colors cursor-pointer text-indigo-600"
                        title={isArabic ? "تعديل" : "Edit"}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(lesson.id);
                        }}
                        className="p-1 rounded-lg hover:bg-white transition-colors cursor-pointer text-rose-600"
                        title={isArabic ? "حذف" : "Delete"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    {/* Level and Topic Metadata */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded uppercase font-mono">
                        {lesson.level}
                      </span>
                      {lesson.isHidden && (
                        <span className="text-[9px] bg-rose-50 text-rose-600 font-black px-2 py-0.5 rounded uppercase font-mono">
                          {isArabic ? "مخفي" : "Hidden"}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[150px]">
                        {lesson.topic}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="text-left rtl:text-right space-y-1">
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base font-display group-hover:text-rose-700 transition-colors leading-snug">
                        {lesson.title}
                      </h4>
                    </div>
                  </div>

                  {/* Play Trigger Footer */}
                  <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between bg-white relative z-10">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-350" />
                      <span>{new Date(lesson.createdAt || Date.now()).toLocaleDateString(isArabic ? 'ar-EG-u-nu-latn' : 'en-US')}</span>
                    </span>

                    <button
                      onClick={() => {
                        setActiveVideo(lesson);
                      }}
                      className="flex items-center gap-1.5 text-xs font-extrabold px-4 py-2 rounded-xl transition-all cursor-pointer bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-150 hover:scale-[1.02]"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isArabic ? "عرض الدرس المسجل" : "View Lesson Details"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white text-center py-16 rounded-3xl border border-dashed border-slate-250">
            <PlayCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-extrabold text-slate-700 text-sm font-display">
              {isArabic ? "لا توجد حصص مسجلة متوفرة" : "No Recorded Lessons Found"}
            </h4>
            <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
              {isArabic
                ? "لم يقم الأستاذ بإضافة أي حصص مسجلة لهذا المستوى التعليمي بعد."
                : "The teacher has not uploaded any video lessons for this language category yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
