import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  limit 
} from "./firebase";
import { Student, Teacher, Lesson, Vocabulary, DynamicVocabCategory, LiveSession, ChatMessage, Announcement, DailyTask, WeeklyTask, ResourceOrTip, TrainingTopic, TrainingQuestion, TypingSentence, RecordedLesson, LibraryBook, TrainingAttempt, TrainingLink, SkillLink } from "../types";
import { defaultLessons, defaultVocabulary, defaultLiveSessions } from "./defaultData";
import { getDefaultCategories } from "../data/vocabularyData";

// Local storage keys as backup/cache
const KEYS = {
  STUDENT: "ep_student_profile",
  TEACHERS: "ep_teachers_list",
  LESSONS: "ep_lessons_list",
  VOCAB: "ep_vocab_list",
  LIVES: "ep_live_sessions",
  CHATS: "ep_chats_history",
  CURRENT_TEACHER: "ep_current_teacher"
};

// HELPER: Get local or default
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Local storage set failed", e);
  }
}

// ================= RESOLVE TEACHER HELPERS =================
export async function resolveTeacherId(providedId?: string): Promise<string> {
  const tid = providedId || "teacher-sarah";
  if (tid !== "teacher-sarah") {
    return tid;
  }
  const teachers = await getTeachers();
  if (teachers.length > 0) {
    return teachers[0].uid;
  }
  return "teacher-sarah";
}

// ================= STUDENTS SERVICE =================
export async function saveStudentProfile(student: Student, teacherId?: string): Promise<void> {
  const tid = teacherId || student.selectedTeacherId || "";
  const updatedStudent = {
    ...student,
    selectedTeacherId: tid,
    lastActive: new Date().toISOString()
  };

  setLocal(KEYS.STUDENT, updatedStudent);
  setLocal(`ep_student_profile_${student.uid}`, updatedStudent);
  
  if (db) {
    try {
      const studentRef = doc(db, "students", student.uid);
      await setDoc(studentRef, updatedStudent, { merge: true });
    } catch (e) {
      console.warn("Firestore saveStudentProfile failed, using cache:", e);
    }
  }
}

export async function getStudentProfile(uid: string, defaultName?: string, defaultEmail?: string, teacherId?: string): Promise<Student> {
  const cached = getLocal<Student | null>(`ep_student_profile_${uid}`, null) || getLocal<Student | null>(KEYS.STUDENT, null);
  
  const defaultProfile: Student = {
    uid,
    name: defaultName || "Student",
    email: defaultEmail || "student@example.com",
    level: "A1",
    progress: 0,
    completedLessons: [],
    savedWords: [],
    dailyStreak: 1,
    lastActive: new Date().toISOString(),
    points: 0,
    selectedTeacherId: teacherId || "",
    isRegistrationComplete: false,
    registrationDate: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  if (db) {
    try {
      const studentRef = doc(db, "students", uid);
      const snap = await getDoc(studentRef);
      
      if (snap.exists()) {
        const data = {
          ...snap.data() as Student,
          lastLogin: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };
        // Keep the level consistent or fallback to default
        if (data.level === "Beginner" as any) {
          data.level = "A1";
        }
        try {
          await setDoc(studentRef, data, { merge: true });
        } catch {}
        setLocal(`ep_student_profile_${uid}`, data);
        setLocal(KEYS.STUDENT, data);
        return data;
      } else {
        await setDoc(studentRef, defaultProfile);
        setLocal(`ep_student_profile_${uid}`, defaultProfile);
        setLocal(KEYS.STUDENT, defaultProfile);
        return defaultProfile;
      }
    } catch (e) {
      console.warn("Firestore getStudentProfile failed, using default/cached:", e);
    }
  }

  if (cached && cached.uid === uid) {
    return cached;
  }
  setLocal(KEYS.STUDENT, defaultProfile);
  return defaultProfile;
}

export function subscribeToStudentProfile(uid: string, callback: (student: Student) => void): () => void {
  if (db) {
    try {
      const studentRef = doc(db, "students", uid);
      return onSnapshot(studentRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Student;
          setLocal(`ep_student_profile_${uid}`, data);
          setLocal(KEYS.STUDENT, data);
          callback(data);
        }
      });
    } catch (e) {
      console.warn("Firestore subscribeToStudentProfile failed:", e);
    }
  }
  return () => {};
}

export async function getAllStudents(teacherId?: string): Promise<Student[]> {
  const tid = teacherId || "all";
  const localKey = `ep_students_list_${tid}`;
  const cached = getLocal<Student[]>(localKey, []);

  if (db) {
    try {
      let q;
      if (teacherId) {
        q = query(collection(db, "students"), where("selectedTeacherId", "==", teacherId));
      } else {
        q = collection(db, "students");
      }
      const snap = await getDocs(q);
      const list: Student[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Student);
      });
      // Sort from newest to oldest based on registrationDate
      list.sort((a, b) => {
        const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
        const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
        return dateB - dateA;
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      }
    } catch (e) {
      console.warn("Firestore getAllStudents failed, fallback to local:", e);
    }
  }

  if (cached && cached.length > 0) {
    cached.sort((a, b) => {
      const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
      const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
      return dateB - dateA;
    });
    return cached;
  }

  return [];
}

export function subscribeToStudents(teacherId: string, callback: (students: Student[]) => void) {
  const localKey = `ep_students_list_${teacherId}`;
  if (db) {
    try {
      const q = query(collection(db, "students"), where("selectedTeacherId", "==", teacherId));
      return onSnapshot(q, (snap) => {
        const list: Student[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as Student);
        });
        // Sort from newest to oldest based on registrationDate
        list.sort((a, b) => {
          const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
          const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
          return dateB - dateA;
        });
        setLocal(localKey, list);
        callback(list);
      }, (err) => {
        console.warn("Firestore subscribeToStudents failed, using cache:", err);
        const cached = getLocal<Student[]>(localKey, []);
        cached.sort((a, b) => {
          const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
          const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
          return dateB - dateA;
        });
        callback(cached);
      });
    } catch (e) {
      console.warn("Firestore subscribeToStudents setup failed:", e);
    }
  }
  const cached = getLocal<Student[]>(localKey, []);
  cached.sort((a, b) => {
    const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
    const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
    return dateB - dateA;
  });
  callback(cached);
  return () => {};
}

export function subscribeToAllStudents(callback: (students: Student[]) => void): () => void {
  const localKey = "ep_students_list_all";
  if (db) {
    try {
      const q = collection(db, "students");
      return onSnapshot(q, (snap) => {
        const list: Student[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as Student);
        });
        // Sort from newest to oldest based on registrationDate
        list.sort((a, b) => {
          const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
          const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
          return dateB - dateA;
        });
        setLocal(localKey, list);
        callback(list);
      }, (err) => {
        console.warn("Firestore subscribeToAllStudents failed, using cache:", err);
        const cached = getLocal<Student[]>(localKey, []);
        cached.sort((a, b) => {
          const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
          const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
          return dateB - dateA;
        });
        callback(cached);
      });
    } catch (e) {
      console.warn("Firestore subscribeToAllStudents setup failed:", e);
    }
  }
  const cached = getLocal<Student[]>(localKey, []);
  cached.sort((a, b) => {
    const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
    const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
    return dateB - dateA;
  });
  callback(cached);
  return () => {};
}

export async function updateStudent(student: Student, teacherId?: string): Promise<void> {
  const tid = teacherId || student.selectedTeacherId || "teacher-sarah";
  const localKey = `ep_students_list_${tid}`;
  const current = getLocal<Student[]>(localKey, []);
  
  const updatedStudent = {
    ...student,
    selectedTeacherId: tid
  };

  const index = current.findIndex(s => s.uid === updatedStudent.uid);
  if (index > -1) {
    current[index] = updatedStudent;
  } else {
    current.push(updatedStudent);
  }
  setLocal(localKey, current);
  
  // Also update individual cached student
  setLocal(`ep_student_profile_${updatedStudent.uid}`, updatedStudent);
  setLocal(KEYS.STUDENT, updatedStudent);

  if (db) {
    try {
      const studentRef = doc(db, "students", updatedStudent.uid);
      await setDoc(studentRef, updatedStudent, { merge: true });
    } catch (e) {
      console.warn("Firestore updateStudent failed:", e);
    }
  }
}

export async function deleteStudent(uid: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_students_list_${tid}`;
  const current = getLocal<Student[]>(localKey, []);
  const filtered = current.filter(s => s.uid !== uid);
  setLocal(localKey, filtered);
  
  // Clear local storage profiles for this student
  localStorage.removeItem(`ep_student_profile_${uid}`);
  const cachedStudent = getLocal<Student | null>(KEYS.STUDENT, null);
  if (cachedStudent && cachedStudent.uid === uid) {
    localStorage.removeItem(KEYS.STUDENT);
  }

  if (db) {
    try {
      await deleteDoc(doc(db, "students", uid));
    } catch (e) {
      console.warn("Firestore deleteStudent failed:", e);
    }
  }
}

// ================= TEACHERS SERVICE =================
export async function getTeachers(): Promise<Teacher[]> {
  const localList = getLocal<Teacher[]>(KEYS.TEACHERS, []);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers"));
      const list: Teacher[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Teacher);
      });
      
      setLocal(KEYS.TEACHERS, list);
      return list;
    } catch (e) {
      console.warn("Firestore getTeachers failed, using local list:", e);
    }
  }
  return localList;
}

export function subscribeToTeachers(callback: (teachers: Teacher[]) => void) {
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers"), (snap) => {
        const list: Teacher[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as Teacher);
        });
        setLocal(KEYS.TEACHERS, list);
        callback(list);
      }, (err) => {
        console.warn("Firestore subscribeToTeachers failed, using cache:", err);
        callback(getLocal<Teacher[]>(KEYS.TEACHERS, []));
      });
    } catch (e) {
      console.warn("Firestore subscribeToTeachers setup failed:", e);
    }
  }
  callback(getLocal<Teacher[]>(KEYS.TEACHERS, []));
  return () => {};
}

export async function addTeacher(teacher: Teacher): Promise<void> {
  const current = await getTeachers();
  const updated = [...current, teacher];
  setLocal(KEYS.TEACHERS, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", teacher.uid), teacher);
      // Automatically copy default curriculum data to the new teacher's subcollections so they start with full content!
      for (const l of defaultLessons) {
        await setDoc(doc(db, "teachers", teacher.uid, "lessons", l.id), l);
      }
      for (const v of defaultVocabulary) {
        await setDoc(doc(db, "teachers", teacher.uid, "vocabulary", v.id), v);
      }
      for (const s of defaultLiveSessions) {
        await setDoc(doc(db, "teachers", teacher.uid, "liveSessions", s.id), s);
      }
    } catch (e) {
      console.warn("Firestore addTeacher failed:", e);
    }
  }
}

export async function updateTeacher(teacher: Teacher): Promise<void> {
  const current = await getTeachers();
  const updated = current.map(t => t.uid === teacher.uid ? teacher : t);
  setLocal(KEYS.TEACHERS, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", teacher.uid), teacher, { merge: true });
    } catch (e) {
      console.warn("Firestore updateTeacher failed:", e);
    }
  }
}

export async function deleteTeacher(uid: string): Promise<void> {
  const current = await getTeachers();
  const updated = current.filter(t => t.uid !== uid);
  setLocal(KEYS.TEACHERS, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", uid));
    } catch (e) {
      console.warn("Firestore deleteTeacher failed:", e);
    }
  }
}

export async function clearAllTeachers(): Promise<void> {
  setLocal(KEYS.TEACHERS, []);
  localStorage.removeItem(KEYS.CURRENT_TEACHER);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers"));
      for (const d of snap.docs) {
        // Clear subcollections
        try {
          const lessonsSnap = await getDocs(collection(db, "teachers", d.id, "lessons"));
          for (const lDoc of lessonsSnap.docs) {
            await deleteDoc(doc(db, "teachers", d.id, "lessons", lDoc.id));
          }
          const vocabSnap = await getDocs(collection(db, "teachers", d.id, "vocabulary"));
          for (const vDoc of vocabSnap.docs) {
            await deleteDoc(doc(db, "teachers", d.id, "vocabulary", vDoc.id));
          }
          const liveSnap = await getDocs(collection(db, "teachers", d.id, "liveSessions"));
          for (const sDoc of liveSnap.docs) {
            await deleteDoc(doc(db, "teachers", d.id, "liveSessions", sDoc.id));
          }
          const studentsSnap = await getDocs(collection(db, "teachers", d.id, "students"));
          for (const sDoc of studentsSnap.docs) {
            await deleteDoc(doc(db, "teachers", d.id, "students", sDoc.id));
          }
        } catch {}
        await deleteDoc(doc(db, "teachers", d.id));
      }
    } catch (e) {
      console.error("Failed to clear teachers in Firestore", e);
    }
  }
}

export async function purgeEntireSystem(): Promise<void> {
  // Clear all LocalStorage keys
  try {
    localStorage.clear();
  } catch (e) {
    console.error("Failed to clear local storage:", e);
  }

  // Clear Firestore Collections
  if (db) {
    try {
      // 1. Clear Students
      const studentsSnap = await getDocs(collection(db, "students"));
      for (const d of studentsSnap.docs) {
        await deleteDoc(doc(db, "students", d.id));
      }

      // 2. Clear Teachers and subcollections
      await clearAllTeachers();

      // 3. Clear Announcements
      const annSnap = await getDocs(collection(db, "announcements"));
      for (const d of annSnap.docs) {
        await deleteDoc(doc(db, "announcements", d.id));
      }
    } catch (e) {
      console.error("Firestore global purge failed:", e);
    }
  }
}

// ================= LESSONS SERVICE =================
export async function getLessons(teacherId?: string): Promise<Lesson[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_lessons_list_${tid}`;
  const localList = getLocal<Lesson[]>(localKey, []);
  
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "lessons"));
      const list: Lesson[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Lesson);
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      } else {
        // Seed teacher collection
        for (const l of defaultLessons) {
          await setDoc(doc(db, "teachers", tid, "lessons", l.id), l);
        }
        setLocal(localKey, defaultLessons);
        return defaultLessons;
      }
    } catch (e) {
      console.warn(`Firestore getLessons failed for teacher ${tid}, using local:`, e);
    }
  }

  if (localList.length === 0) {
    setLocal(localKey, defaultLessons);
    return defaultLessons;
  }
  return localList;
}

export async function saveLesson(lesson: Lesson, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_lessons_list_${tid}`;
  const current = await getLessons(tid);
  const index = current.findIndex(l => l.id === lesson.id);
  if (index > -1) {
    current[index] = lesson;
  } else {
    current.push(lesson);
  }
  setLocal(localKey, current);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "lessons", lesson.id), lesson);
    } catch (e) {
      console.warn("Firestore saveLesson failed:", e);
    }
  }
}

export async function deleteLesson(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_lessons_list_${tid}`;
  const current = await getLessons(tid);
  const filtered = current.filter(l => l.id !== id);
  setLocal(localKey, filtered);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "lessons", id));
    } catch (e) {
      console.warn("Firestore deleteLesson failed:", e);
    }
  }
}


// ================= VOCABULARY SERVICE =================
export async function getVocabulary(teacherId?: string): Promise<Vocabulary[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_vocab_list_${tid}`;
  const localList = getLocal<Vocabulary[]>(localKey, []);
  
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "vocabulary"));
      const list: Vocabulary[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Vocabulary);
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      } else {
        // Seed teacher collection
        for (const v of defaultVocabulary) {
          await setDoc(doc(db, "teachers", tid, "vocabulary", v.id), v);
        }
        setLocal(localKey, defaultVocabulary);
        return defaultVocabulary;
      }
    } catch (e) {
      console.warn(`Firestore getVocabulary failed for teacher ${tid}, using local:`, e);
    }
  }

  if (localList.length === 0) {
    setLocal(localKey, defaultVocabulary);
    return defaultVocabulary;
  }
  return localList;
}

export async function saveVocabulary(word: Vocabulary, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_vocab_list_${tid}`;
  const current = await getVocabulary(tid);
  const index = current.findIndex(w => w.id === word.id);
  if (index > -1) {
    current[index] = word;
  } else {
    current.push(word);
  }
  setLocal(localKey, current);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "vocabulary", word.id), word);
    } catch (e) {
      console.warn("Firestore saveVocabulary failed:", e);
    }
  }
}

export async function deleteVocabulary(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_vocab_list_${tid}`;
  const current = await getVocabulary(tid);
  const filtered = current.filter(w => w.id !== id);
  setLocal(localKey, filtered);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "vocabulary", id));
    } catch (e) {
      console.warn("Firestore deleteVocabulary failed:", e);
    }
  }
}


// ================= LIVE SESSIONS SERVICE =================
export async function getLiveSessions(teacherId?: string): Promise<LiveSession[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_live_sessions_list_${tid}`;
  const localList = getLocal<LiveSession[]>(localKey, []);
  
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "liveSessions"));
      const list: LiveSession[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as LiveSession);
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      } else {
        // Seed teacher collection
        for (const s of defaultLiveSessions) {
          await setDoc(doc(db, "teachers", tid, "liveSessions", s.id), s);
        }
        setLocal(localKey, defaultLiveSessions);
        return defaultLiveSessions;
      }
    } catch (e) {
      console.warn(`Firestore getLiveSessions failed for teacher ${tid}, using local:`, e);
    }
  }

  if (localList.length === 0) {
    setLocal(localKey, defaultLiveSessions);
    return defaultLiveSessions;
  }
  return localList;
}

export async function saveLiveSession(session: LiveSession, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_live_sessions_list_${tid}`;
  const current = await getLiveSessions(tid);
  const index = current.findIndex(s => s.id === session.id);
  if (index > -1) {
    current[index] = session;
  } else {
    current.push(session);
  }
  setLocal(localKey, current);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "liveSessions", session.id), session);
    } catch (e) {
      console.warn("Firestore saveLiveSession failed:", e);
    }
  }
}

export async function deleteLiveSession(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_live_sessions_list_${tid}`;
  const current = await getLiveSessions(tid);
  const filtered = current.filter(s => s.id !== id);
  setLocal(localKey, filtered);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "liveSessions", id));
    } catch (e) {
      console.warn("Firestore deleteLiveSession failed:", e);
    }
  }
}


// ================= CHAT MESSAGES SERVICE =================
export async function getChatHistory(chatId: string): Promise<ChatMessage[]> {
  const localKey = `${KEYS.CHATS}_${chatId}`;
  const localList = getLocal<ChatMessage[]>(localKey, []);

  if (db) {
    try {
      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      );
      const snap = await getDocs(q);
      const list: ChatMessage[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as ChatMessage);
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      }
    } catch (e) {
      console.warn("Firestore getChatHistory failed, using local:", e);
    }
  }

  return localList;
}

export async function addChatMessage(chatId: string, msg: ChatMessage): Promise<void> {
  const localKey = `${KEYS.CHATS}_${chatId}`;
  let current = getLocal<ChatMessage[]>(localKey, []);
  
  // Prevent duplicate message IDs in cache
  const exists = current.some((m) => m.id === msg.id);
  if (!exists) {
    current.push(msg);
  } else {
    current = current.map((m) => (m.id === msg.id ? msg : m));
  }
  setLocal(localKey, current);

  if (db) {
    try {
      const msgRef = doc(db, "chats", chatId, "messages", msg.id);
      await setDoc(msgRef, msg);
    } catch (e) {
      console.warn("Firestore addChatMessage failed:", e);
    }
  }
}

export function subscribeToChat(chatId: string, callback: (msgs: ChatMessage[]) => void) {
  const localKey = `${KEYS.CHATS}_${chatId}`;
  if (db) {
    try {
      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      );
      return onSnapshot(q, (snap) => {
        const list: ChatMessage[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as ChatMessage);
        });
        if (list.length > 0) {
          setLocal(localKey, list);
          callback(list);
        }
      }, (err) => {
        console.warn("Firestore subscription error, using local polling:", err);
        callback(getLocal<ChatMessage[]>(localKey, []));
      });
    } catch (e) {
      console.warn("Firestore subscribeToChat failed:", e);
    }
  }
  
  // Fallback direct execution
  callback(getLocal<ChatMessage[]>(localKey, []));
  return () => {};
}

// ================= ANNOUNCEMENTS SERVICE =================
export async function getAnnouncements(teacherId?: string): Promise<Announcement[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_announcements_list_${tid}`;
  const localList = getLocal<Announcement[]>(localKey, []);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "announcements"));
      const list: Announcement[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Announcement);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setLocal(localKey, list);
      return list;
    } catch (e) {
      console.warn(`Firestore getAnnouncements failed for teacher ${tid}, using local list:`, e);
    }
  }
  return localList;
}

export async function saveAnnouncement(announcement: Announcement, teacherId?: string): Promise<void> {
  const tid = teacherId || announcement.teacherId || "teacher-sarah";
  const localKey = `ep_announcements_list_${tid}`;
  const current = getLocal<Announcement[]>(localKey, []);
  const updated = [announcement, ...current.filter(a => a.id !== announcement.id)];
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "announcements", announcement.id), announcement);
    } catch (e) {
      console.warn("Firestore saveAnnouncement failed:", e);
    }
  }
}

export async function deleteAnnouncement(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_announcements_list_${tid}`;
  const current = getLocal<Announcement[]>(localKey, []);
  const updated = current.filter(a => a.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "announcements", id));
    } catch (e) {
      console.warn("Firestore deleteAnnouncement failed:", e);
    }
  }
}

// ================= SEED DEFAULTS FOR TASKS =================
const defaultDailyTasks = (studentId: string): DailyTask[] => [
  {
    id: `dt_vocab_${studentId}`,
    studentId,
    title: "Complete today's vocabulary quiz",
    titleAr: "أكمل اختبار المفردات اليومي",
    completed: false,
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString()
  },
  {
    id: `dt_lesson_${studentId}`,
    studentId,
    title: "Read a lesson explanation",
    titleAr: "اقرأ شرح أحد الدروس للتأسيس",
    completed: false,
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString()
  },
  {
    id: `dt_chat_${studentId}`,
    studentId,
    title: "Practice writing with your academic instructor",
    titleAr: "تدرب على الكتابة بالتحدث مع المعلم المشرف",
    completed: false,
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString()
  }
];

export const defaultStudentWeeklyTasks = (studentId: string = "guest"): WeeklyTask[] => [
  {
    id: `swt_sat_${studentId}`,
    studentId,
    title: "مراجعة قواعد المضارع البسيط والماضي البسيط",
    description: "مراجعة القواعد الأساسية وحل الأسئلة التفاعلية عليها.",
    type: "Grammar",
    completed: false,
    day: "saturday",
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: `swt_sun_${studentId}`,
    studentId,
    title: "حفظ 5 مفردات جديدة باللغة الإنجليزية",
    description: "إضافة الكلمات الجديدة إلى قائمة المفردات ومراجعة ترجمتها ونطقها.",
    type: "Vocabulary",
    completed: false,
    day: "sunday",
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: `swt_mon_${studentId}`,
    studentId,
    title: "ممارسة المحادثة مع الذكاء الاصطناعي",
    description: "إجراء محادثة لمدة 10 دقائق لتطبيق ما تعلمته.",
    type: "Speaking",
    completed: false,
    day: "monday",
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: `swt_tue_${studentId}`,
    studentId,
    title: "قراءة مقال قصير واستخراج الكلمات الصعبة",
    description: "قراءة صفحتين من كتاب أو مقال والبحث عن معاني الكلمات.",
    type: "Reading",
    completed: false,
    day: "tuesday",
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: `swt_wed_${studentId}`,
    studentId,
    title: "كتابة فقرة من 50 كلمة",
    description: "كتابة فقرة قصيرة عن يومي أو هوايتي المفضلة وتصحيحها.",
    type: "Writing",
    completed: false,
    day: "wednesday",
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: `swt_thu_${studentId}`,
    studentId,
    title: "الاستماع إلى محادثة أو بودكاست بالإنجليزية",
    description: "الاستماع ومحاولة فهم الفكرة العامة وتدوين الملاحظات.",
    type: "Listening",
    completed: false,
    day: "thursday",
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: `swt_fri_${studentId}`,
    studentId,
    title: "اختبار وتقييم ذاتي لنهاية الأسبوع",
    description: "مراجعة جميع مهام الأسبوع والتأكد من إنجازها.",
    type: "Evaluation",
    completed: false,
    day: "friday",
    order: 1,
    createdAt: new Date().toISOString()
  }
];

// ================= DAILY TASKS SERVICE =================
export async function getDailyTasks(studentId: string): Promise<DailyTask[]> {
  const localKey = `ep_daily_tasks_${studentId}`;
  const todayStr = new Date().toISOString().split("T")[0];
  let localList = getLocal<DailyTask[]>(localKey, []);

  // Filter or initialize for today
  if (localList.length === 0 || localList[0].date !== todayStr) {
    localList = defaultDailyTasks(studentId);
    setLocal(localKey, localList);
  }

  if (db) {
    try {
      const q = query(
        collection(db, "students", studentId, "daily_tasks")
      );
      const snap = await getDocs(q);
      const list: DailyTask[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as DailyTask);
      });
      
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      } else {
        // Seed to firestore if empty
        for (const t of localList) {
          await setDoc(doc(db, "students", studentId, "daily_tasks", t.id), t);
        }
      }
    } catch (e) {
      console.warn("Firestore getDailyTasks failed, using local:", e);
    }
  }
  return localList;
}

export async function saveDailyTask(studentId: string, task: DailyTask): Promise<void> {
  const localKey = `ep_daily_tasks_${studentId}`;
  const current = getLocal<DailyTask[]>(localKey, []);
  const updated = current.some(t => t.id === task.id) 
    ? current.map(t => t.id === task.id ? task : t)
    : [...current, task];
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "students", studentId, "daily_tasks", task.id), task);
    } catch (e) {
      console.warn("Firestore saveDailyTask failed:", e);
    }
  }
}

export async function deleteDailyTask(studentId: string, taskId: string): Promise<void> {
  const localKey = `ep_daily_tasks_${studentId}`;
  const current = getLocal<DailyTask[]>(localKey, []);
  const updated = current.filter(t => t.id !== taskId);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "students", studentId, "daily_tasks", taskId));
    } catch (e) {
      console.warn("Firestore deleteDailyTask failed:", e);
    }
  }
}

// ================= STUDENT WEEKLY TASKS SERVICE =================
export function subscribeToStudentWeeklyTasks(
  studentId: string,
  callback: (tasks: WeeklyTask[]) => void
): () => void {
  const localKey = `ep_student_weekly_tasks_${studentId}`;
  const localList = getLocal<WeeklyTask[]>(localKey, []);

  if (localList.length === 0) {
    const defaults = defaultStudentWeeklyTasks(studentId);
    setLocal(localKey, defaults);
    callback(defaults);
  } else {
    callback(localList);
  }

  if (db && studentId && studentId !== "guest") {
    try {
      const colRef = collection(db, "student_weekly_tasks");
      const q = query(colRef, where("studentId", "==", studentId));
      return onSnapshot(q, async (snap) => {
        const list: WeeklyTask[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as WeeklyTask);
        });

        if (list.length === 0) {
          const defaults = defaultStudentWeeklyTasks(studentId);
          for (const t of defaults) {
            await setDoc(doc(db, "student_weekly_tasks", t.id), t);
          }
          setLocal(localKey, defaults);
          callback(defaults);
        } else {
          const sorted = list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setLocal(localKey, sorted);
          callback(sorted);
        }
      }, (err) => {
        console.warn("Firestore subscribeToStudentWeeklyTasks failed:", err);
      });
    } catch (e) {
      console.warn("Firestore subscribeToStudentWeeklyTasks setup failed:", e);
    }
  }

  return () => {};
}

export async function saveStudentWeeklyTask(task: WeeklyTask): Promise<void> {
  const studentId = task.studentId || "guest";
  const localKey = `ep_student_weekly_tasks_${studentId}`;
  const current = getLocal<WeeklyTask[]>(localKey, []);
  const updated = current.some(t => t.id === task.id)
    ? current.map(t => t.id === task.id ? task : t)
    : [...current, task];
  const sorted = updated.sort((a, b) => (a.order || 0) - (b.order || 0));
  setLocal(localKey, sorted);

  if (db && studentId && studentId !== "guest") {
    try {
      await setDoc(doc(db, "student_weekly_tasks", task.id), task);
    } catch (e) {
      console.warn("Firestore saveStudentWeeklyTask failed:", e);
    }
  }
}

export async function deleteStudentWeeklyTask(studentId: string, taskId: string): Promise<void> {
  const localKey = `ep_student_weekly_tasks_${studentId}`;
  const current = getLocal<WeeklyTask[]>(localKey, []);
  const updated = current.filter(t => t.id !== taskId);
  setLocal(localKey, updated);

  if (db && studentId && studentId !== "guest") {
    try {
      await deleteDoc(doc(db, "student_weekly_tasks", taskId));
    } catch (e) {
      console.warn("Firestore deleteStudentWeeklyTask failed:", e);
    }
  }
}

// ================= RESOURCES & TIPS SERVICE =================
const RESOURCES_TIPS_KEY = "ep_resources_tips";

const defaultResourcesAndTips: ResourceOrTip[] = [];

export async function getResourcesAndTips(teacherId?: string): Promise<ResourceOrTip[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_resources_tips_${tid}`;
  const cached = getLocal<ResourceOrTip[]>(localKey, []);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "resources_tips"));
      const list: ResourceOrTip[] = [];
      snap.forEach((dSnap) => {
        list.push(dSnap.data() as ResourceOrTip);
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      } else {
        // Seed default
        for (const item of defaultResourcesAndTips) {
          await setDoc(doc(db, "teachers", tid, "resources_tips", item.id), item);
        }
        setLocal(localKey, defaultResourcesAndTips);
        return defaultResourcesAndTips;
      }
    } catch (e) {
      console.warn(`Firestore getResourcesAndTips failed for teacher ${tid}, using cache:`, e);
    }
  }
  return cached.length > 0 ? cached : defaultResourcesAndTips;
}

export function subscribeToResourcesAndTips(callback: (items: ResourceOrTip[]) => void, teacherId?: string) {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_resources_tips_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "resources_tips"), (snap) => {
        const list: ResourceOrTip[] = [];
        snap.forEach((dSnap) => {
          list.push(dSnap.data() as ResourceOrTip);
        });
        if (list.length > 0) {
          setLocal(localKey, list);
          callback(list);
        } else {
          callback(defaultResourcesAndTips);
        }
      }, (err) => {
        console.warn("Firestore subscribeToResourcesAndTips failed, using cache:", err);
        callback(getLocal<ResourceOrTip[]>(localKey, defaultResourcesAndTips));
      });
    } catch (e) {
      console.warn("Firestore subscribeToResourcesAndTips setup failed:", e);
    }
  }
  callback(getLocal<ResourceOrTip[]>(localKey, defaultResourcesAndTips));
  return () => {};
}

export function subscribeToLessons(callback: (lessons: Lesson[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_lessons_list_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "lessons"), (snap) => {
        const list: Lesson[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as Lesson);
        });
        if (list.length > 0) {
          setLocal(localKey, list);
          callback(list);
        } else {
          callback(defaultLessons);
        }
      }, (err) => {
        console.warn("Firestore subscribeToLessons failed, using cache:", err);
        callback(getLocal<Lesson[]>(localKey, defaultLessons));
      });
    } catch (e) {
      console.warn("Firestore subscribeToLessons setup failed:", e);
    }
  }
  callback(getLocal<Lesson[]>(localKey, defaultLessons));
  return () => {};
}

export function subscribeToVocabulary(callback: (vocab: Vocabulary[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_vocab_list_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "vocabulary"), (snap) => {
        const list: Vocabulary[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as Vocabulary);
        });
        if (list.length > 0) {
          setLocal(localKey, list);
          callback(list);
        } else {
          callback(defaultVocabulary);
        }
      }, (err) => {
        console.warn("Firestore subscribeToVocabulary failed, using cache:", err);
        callback(getLocal<Vocabulary[]>(localKey, defaultVocabulary));
      });
    } catch (e) {
      console.warn("Firestore subscribeToVocabulary setup failed:", e);
    }
  }
  callback(getLocal<Vocabulary[]>(localKey, defaultVocabulary));
  return () => {};
}

export function subscribeToTrainingTopics(callback: (topics: TrainingTopic[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_topics_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "training_topics"), (snap) => {
        const list: TrainingTopic[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as TrainingTopic);
        });
        if (list.length > 0) {
          setLocal(localKey, list);
          callback(list);
        } else {
          callback(defaultTrainingTopics);
        }
      }, (err) => {
        console.warn("Firestore subscribeToTrainingTopics failed, using cache:", err);
        callback(getLocal<TrainingTopic[]>(localKey, defaultTrainingTopics));
      });
    } catch (e) {
      console.warn("Firestore subscribeToTrainingTopics setup failed:", e);
    }
  }
  callback(getLocal<TrainingTopic[]>(localKey, defaultTrainingTopics));
  return () => {};
}

export function subscribeToTrainingQuestions(callback: (questions: TrainingQuestion[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_questions_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "training_questions"), (snap) => {
        const list: TrainingQuestion[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as TrainingQuestion);
        });
        setLocal(localKey, list);
        callback(list);
      }, (err) => {
        console.warn("Firestore subscribeToTrainingQuestions failed, using cache:", err);
        callback(getLocal<TrainingQuestion[]>(localKey, []));
      });
    } catch (e) {
      console.warn("Firestore subscribeToTrainingQuestions setup failed:", e);
    }
  }
  callback(getLocal<TrainingQuestion[]>(localKey, []));
  return () => {};
}

export async function getVocabCategories(teacherId?: string): Promise<DynamicVocabCategory[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_vocab_categories_list_${tid}`;
  const fallback = getDefaultCategories();
  const cached = getLocal<DynamicVocabCategory[]>(localKey, []);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "vocabCategories"));
      const list: DynamicVocabCategory[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as DynamicVocabCategory);
      });
      if (list.length > 0) {
        list.sort((a, b) => a.order - b.order);
        setLocal(localKey, list);
        return list;
      } else {
        for (const cat of fallback) {
          await setDoc(doc(db, "teachers", tid, "vocabCategories", cat.id), cat);
        }
        setLocal(localKey, fallback);
        return fallback;
      }
    } catch (e) {
      console.warn(`Firestore getVocabCategories failed for ${tid}, using cache:`, e);
    }
  }
  return cached.length > 0 ? cached : fallback;
}

export function subscribeToVocabCategories(callback: (categories: DynamicVocabCategory[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_vocab_categories_list_${tid}`;
  const fallback = getDefaultCategories();
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "vocabCategories"), async (snap) => {
        const list: DynamicVocabCategory[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as DynamicVocabCategory);
        });
        if (list.length > 0) {
          list.sort((a, b) => a.order - b.order);
          setLocal(localKey, list);
          callback(list);
        } else {
          // Seed categories collection
          for (const cat of fallback) {
            await setDoc(doc(db, "teachers", tid, "vocabCategories", cat.id), cat);
          }
          setLocal(localKey, fallback);
          callback(fallback);
        }
      }, (err) => {
        console.warn("Firestore subscribeToVocabCategories failed, using cache:", err);
        callback(getLocal<DynamicVocabCategory[]>(localKey, fallback));
      });
    } catch (e) {
      console.warn("Firestore subscribeToVocabCategories setup failed:", e);
    }
  }
  callback(getLocal<DynamicVocabCategory[]>(localKey, fallback));
  return () => {};
}

export async function saveVocabCategory(category: DynamicVocabCategory, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_vocab_categories_list_${tid}`;
  const current = getLocal<DynamicVocabCategory[]>(localKey, getDefaultCategories());
  const idx = current.findIndex(c => c.id === category.id);
  if (idx > -1) {
    current[idx] = category;
  } else {
    current.push(category);
  }
  current.sort((a, b) => a.order - b.order);
  setLocal(localKey, current);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "vocabCategories", category.id), category);
    } catch (e) {
      console.warn("Firestore saveVocabCategory failed:", e);
    }
  }
}

export async function deleteVocabCategory(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_vocab_categories_list_${tid}`;
  const current = getLocal<DynamicVocabCategory[]>(localKey, getDefaultCategories());
  const updated = current.filter(c => c.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "vocabCategories", id));
    } catch (e) {
      console.warn("Firestore deleteVocabCategory failed:", e);
    }
  }
}

export function subscribeToLiveSessions(callback: (sessions: LiveSession[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_live_sessions_list_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "liveSessions"), (snap) => {
        const list: LiveSession[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as LiveSession);
        });
        if (list.length > 0) {
          setLocal(localKey, list);
          callback(list);
        } else {
          callback(defaultLiveSessions);
        }
      }, (err) => {
        console.warn("Firestore subscribeToLiveSessions failed, using cache:", err);
        callback(getLocal<LiveSession[]>(localKey, defaultLiveSessions));
      });
    } catch (e) {
      console.warn("Firestore subscribeToLiveSessions setup failed:", e);
    }
  }
  callback(getLocal<LiveSession[]>(localKey, defaultLiveSessions));
  return () => {};
}

export function subscribeToAnnouncements(callback: (announcements: Announcement[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_announcements_list_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "announcements"), (snap) => {
        const list: Announcement[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as Announcement);
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLocal(localKey, list);
        callback(list);
      }, (err) => {
        console.warn("Firestore subscribeToAnnouncements failed, using cache:", err);
        callback(getLocal<Announcement[]>(localKey, []));
      });
    } catch (e) {
      console.warn("Firestore subscribeToAnnouncements setup failed:", e);
    }
  }
  callback(getLocal<Announcement[]>(localKey, []));
  return () => {};
}

export async function saveResourceOrTip(item: ResourceOrTip, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_resources_tips_${tid}`;
  const current = getLocal<ResourceOrTip[]>(localKey, []);
  const updated = current.some(x => x.id === item.id)
    ? current.map(x => x.id === item.id ? item : x)
    : [...current, item];
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "resources_tips", item.id), item);
    } catch (e) {
      console.warn("Firestore saveResourceOrTip failed:", e);
    }
  }
}

export async function deleteResourceOrTip(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_resources_tips_${tid}`;
  const current = getLocal<ResourceOrTip[]>(localKey, []);
  const updated = current.filter(x => x.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "resources_tips", id));
    } catch (e) {
      console.warn("Firestore deleteResourceOrTip failed:", e);
    }
  }
}

// ================= SKILL DEVELOPMENT SERVICE =================

export function subscribeToSkillLinks(callback: (items: SkillLink[]) => void, teacherId?: string) {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_skill_links_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "skill_links"), (snap) => {
        const list: SkillLink[] = [];
        snap.forEach((dSnap) => {
          list.push(dSnap.data() as SkillLink);
        });
        setLocal(localKey, list);
        callback(list);
      }, (err) => {
        console.warn("Firestore subscribeToSkillLinks failed, using cache:", err);
        callback(getLocal<SkillLink[]>(localKey, []));
      });
    } catch (e) {
      console.warn("Firestore subscribeToSkillLinks setup failed:", e);
    }
  }
  callback(getLocal<SkillLink[]>(localKey, []));
  return () => {};
}

export async function saveSkillLink(item: SkillLink, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_skill_links_${tid}`;
  const current = getLocal<SkillLink[]>(localKey, []);
  const updated = current.some(x => x.id === item.id)
    ? current.map(x => x.id === item.id ? item : x)
    : [...current, item];
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "skill_links", item.id), item);
    } catch (e) {
      console.warn("Firestore saveSkillLink failed:", e);
    }
  }
}

export async function deleteSkillLink(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_skill_links_${tid}`;
  const current = getLocal<SkillLink[]>(localKey, []);
  const updated = current.filter(x => x.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "skill_links", id));
    } catch (e) {
      console.warn("Firestore deleteSkillLink failed:", e);
    }
  }
}


// ================= TRAINING & TYPING SERVICES =================

const TOPICS_KEY = "ep_training_topics";
const QUESTIONS_KEY = "ep_training_questions";
const TYPING_KEY = "ep_typing_sentences";

const defaultTrainingTopics: TrainingTopic[] = [
  // speaking topics
  { id: "sp-a1-1", name: "Introducing Yourself", level: "A1", language: "en", order: 1, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-a1-2", name: "My Favorite Hobbies", level: "A1", language: "en", order: 2, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-a2-1", name: "My Typical Daily Life", level: "A2", language: "en", order: 1, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-a2-2", name: "Shopping and Foods", level: "A2", language: "en", order: 2, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-b1-1", name: "Travel & Exploration", level: "B1", language: "en", order: 1, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-b1-2", name: "Future Career Goals", level: "B1", language: "en", order: 2, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-b2-1", name: "The Digital Age & Internet", level: "B2", language: "en", order: 1, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-b2-2", name: "Teamwork vs Solo Work", level: "B2", language: "en", order: 2, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-c1-1", name: "Solving Climate Change", level: "C1", language: "en", order: 1, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-c1-2", name: "The Purpose of Modern Art", level: "C1", language: "en", order: 2, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-c2-1", name: "Ethics of Artificial Intelligence", level: "C2", language: "en", order: 1, type: "speaking", createdAt: new Date().toISOString() },
  { id: "sp-c2-2", name: "Globalization and Identity", level: "C2", language: "en", order: 2, type: "speaking", createdAt: new Date().toISOString() },

  // writing topics
  { id: "wr-a1-1", name: "My Best Friend", level: "A1", language: "en", order: 1, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-a1-2", name: "My Favorite Season", level: "A1", language: "en", order: 2, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-a2-1", name: "A Perfect Weekend", level: "A2", language: "en", order: 1, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-a2-2", name: "My Dream Vacation House", level: "A2", language: "en", order: 2, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-b1-1", name: "Value of Education", level: "B1", language: "en", order: 1, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-b1-2", name: "Living a Healthy Lifestyle", level: "B1", language: "en", order: 2, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-b2-1", name: "Impact of AI on Jobs", level: "B2", language: "en", order: 1, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-b2-2", name: "City Life vs Countryside", level: "B2", language: "en", order: 2, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-c1-1", name: "Green Energy Transition", level: "C1", language: "en", order: 1, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-c1-2", name: "Media Power & Fake News", level: "C1", language: "en", order: 2, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-c2-1", name: "Tech Connectivity & Isolation", level: "C2", language: "en", order: 1, type: "writing", createdAt: new Date().toISOString() },
  { id: "wr-c2-2", name: "Concept of Global Citizenship", level: "C2", language: "en", order: 2, type: "writing", createdAt: new Date().toISOString() }
];

const defaultTrainingQuestions: TrainingQuestion[] = [
  // sp-a1-1 (Introducing Yourself)
  { id: "sp-q-a1-1-1", topicId: "sp-a1-1", questionText: "What is your name and where are you from? Talk about your hometown.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },
  { id: "sp-q-a1-1-2", topicId: "sp-a1-1", questionText: "Introduce your family members in English. Tell us their names and hobbies.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },
  
  // sp-a1-2 (My Favorite Hobbies)
  { id: "sp-q-a1-2-1", topicId: "sp-a1-2", questionText: "What sports or hobbies do you enjoy playing or watching? Why?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },
  { id: "sp-q-a1-2-2", topicId: "sp-a1-2", questionText: "Do you prefer reading books or watching movies in your free time?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-a2-1 (My Typical Daily Life)
  { id: "sp-q-a2-1-1", topicId: "sp-a2-1", questionText: "Describe your morning routine. What is the first thing you do?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },
  { id: "sp-q-a2-1-2", topicId: "sp-a2-1", questionText: "What time do you usually wake up and sleep? How do you feel about your schedule?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-a2-2 (Shopping and Foods)
  { id: "sp-q-a2-2-1", topicId: "sp-a2-2", questionText: "What is your favorite food and how is it made? Explain the main ingredients.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },
  { id: "sp-q-a2-2-2", topicId: "sp-a2-2", questionText: "Do you prefer eating at home or ordering from restaurants? Explain why.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-b1-1 (Travel & Exploration)
  { id: "sp-q-b1-1-1", topicId: "sp-b1-1", questionText: "Talk about a memorable trip you took. Where did you go and who was with you?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },
  { id: "sp-q-b1-1-2", topicId: "sp-b1-1", questionText: "Which country would you love to visit in the future and what would you do there?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-b1-2 (Future Career Goals)
  { id: "sp-q-b1-2-1", topicId: "sp-b1-2", questionText: "What are your big professional or learning goals for the next three years?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },
  { id: "sp-q-b1-2-2", topicId: "sp-b1-2", questionText: "Describe your dream house or ideal living space in detail.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-b2-1 (The Digital Age & Internet)
  { id: "sp-q-b2-1-1", topicId: "sp-b2-1", questionText: "How has the internet and social media changed our daily social relationships?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },
  { id: "sp-q-b2-1-2", topicId: "sp-b2-1", questionText: "Could you live without your smartphone or laptop for a whole week? Why or why not?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-b2-2 (Teamwork vs Solo Work)
  { id: "sp-q-b2-2-1", topicId: "sp-b2-2", questionText: "Is working in teams better than working individually? Discuss with examples.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-c1-1 (Solving Climate Change)
  { id: "sp-q-c1-1-1", topicId: "sp-c1-1", questionText: "How can individuals practically reduce their carbon footprint in their local communities?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-c1-2 (The Purpose of Modern Art)
  { id: "sp-q-c1-2-1", topicId: "sp-c1-2", questionText: "What is the primary role or purpose of art and museums in our high-tech modern society?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-c2-1 (Ethics of Artificial Intelligence)
  { id: "sp-q-c2-1-1", topicId: "sp-c2-1", questionText: "Is artificial intelligence a threat to human creativity, or does it enhance it? Detail your viewpoint.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // sp-c2-2 (Globalization and Identity)
  { id: "sp-q-c2-2-1", topicId: "sp-c2-2", questionText: "How does globalization affect and reshape local cultural heritage and personal identities?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // WRITING PROMPTS
  // wr-a1-1 (My Best Friend)
  { id: "wr-q-a1-1-1", topicId: "wr-a1-1", questionText: "Write a short paragraph about your best friend. What are their hobbies and how did you meet them?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },
  
  // wr-a1-2 (My Favorite Season)
  { id: "wr-q-a1-2-1", topicId: "wr-a1-2", questionText: "Explain why you love a particular season of the year. What activities do you do?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-a2-1 (A Perfect Weekend)
  { id: "wr-q-a2-1-1", topicId: "wr-a2-1", questionText: "Describe your idea of a perfect, relaxing weekend. Where would you go and what would you eat?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-a2-2 (My Dream Vacation House)
  { id: "wr-q-a2-2-1", topicId: "wr-a2-2", questionText: "Write about a dream vacation home. Where would it be located and what features would it have?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-b1-1 (Value of Education)
  { id: "wr-q-b1-1-1", topicId: "wr-b1-1", questionText: "Write a short composition explaining how education changes individual lives and opens opportunities.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-b1-2 (Living a Healthy Lifestyle)
  { id: "wr-q-b1-2-1", topicId: "wr-b1-2", questionText: "Give 3 to 5 practical tips for busy students to stay physically and mentally healthy during exams.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-b2-1 (Impact of AI on Jobs)
  { id: "wr-q-b2-1-1", topicId: "wr-b2-1", questionText: "Discuss the potential impacts of automated AI systems on human jobs. Will they create more than they destroy?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-b2-2 (City Life vs Countryside)
  { id: "wr-q-b2-2-1", topicId: "wr-b2-2", questionText: "Compare the benefits and challenges of raising children in a busy modern city versus a peaceful countryside.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-c1-1 (Green Energy Transition)
  { id: "wr-q-c1-1-1", topicId: "wr-c1-1", questionText: "Write a short essay discussing the primary challenges governments face when transitioning from fossil fuels to clean solar and wind energy.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-c1-2 (Media Power & Fake News)
  { id: "wr-q-c1-2-1", topicId: "wr-c1-2", questionText: "Analyze how digital fake news spreads online. What measures can online readers take to verify stories?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-c2-1 (Tech Connectivity & Isolation)
  { id: "wr-q-c2-1-1", topicId: "wr-c2-1", questionText: "Evaluate the claim that hyper-connectivity via smartphones is causing deep psychological isolation in young adults. Support with critical logic.", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() },

  // wr-c2-2 (Concept of Global Citizenship)
  { id: "wr-q-c2-2-1", topicId: "wr-c2-2", questionText: "Deconstruct the modern philosophy of 'global citizenship'. Is it a realistic framework for the 21st century or an idealistic concept?", answerOptions: [], correctAnswerIndex: 0, createdAt: new Date().toISOString() }
];

const defaultTypingSentences: TypingSentence[] = [
  // English sentences
  { id: "type-a1-1", sentence: "The cat is sleeping on the warm mat.", level: "A1", language: "en", createdAt: new Date().toISOString() },
  { id: "type-a1-2", sentence: "I like to drink hot tea in the morning.", level: "A1", language: "en", createdAt: new Date().toISOString() },
  { id: "type-a1-3", sentence: "They play soccer in the large green park.", level: "A1", language: "en", createdAt: new Date().toISOString() },
  { id: "type-a2-1", sentence: "She rides her modern bicycle to the university every single day.", level: "A2", language: "en", createdAt: new Date().toISOString() },
  { id: "type-a2-2", sentence: "We ordered a delicious pepperoni pizza and fresh orange juice.", level: "A2", language: "en", createdAt: new Date().toISOString() },
  { id: "type-b1-1", sentence: "If you want to achieve your career goals, you must stay incredibly consistent.", level: "B1", language: "en", createdAt: new Date().toISOString() },
  { id: "type-b1-2", sentence: "Have you ever visited the ancient pyramids located in Cairo, Egypt?", level: "B1", language: "en", createdAt: new Date().toISOString() },
  { id: "type-b2-1", sentence: "Despite the heavy rain, the enthusiastic spectators remained in the stadium.", level: "B2", language: "en", createdAt: new Date().toISOString() },
  { id: "type-b2-2", sentence: "The technological paradigm shift has completely revolutionized modern business.", level: "B2", language: "en", createdAt: new Date().toISOString() },
  { id: "type-c1-1", sentence: "Her impeccable speech left a profound, lasting impression on the distinguished audience.", level: "C1", language: "en", createdAt: new Date().toISOString() },
  { id: "type-c1-2", sentence: "An astronomical rise in global temperatures demands immediate and concerted international action.", level: "C1", language: "en", createdAt: new Date().toISOString() },
  { id: "type-c2-1", sentence: "The ephemeral nature of aesthetic perfection is a quintessential theme in classical philosophy.", level: "C2", language: "en", createdAt: new Date().toISOString() },
  { id: "type-c2-2", sentence: "An obfuscation of historical truths inevitably leads to systemic misinterpretation of modern events.", level: "C2", language: "en", createdAt: new Date().toISOString() },

  // Arabic sentences
  { id: "type-ar-a1-1", sentence: "الولد يقرأ كتابا مفيدا جدا في غرفته.", level: "A1", language: "ar", createdAt: new Date().toISOString() },
  { id: "type-ar-a2-1", sentence: "يستيقظ المعلم باكرا ليذهب إلى المدرسة بنشاط كبير.", level: "A2", language: "ar", createdAt: new Date().toISOString() },
  { id: "type-ar-b1-1", sentence: "إذا أردت النجاح في حياتك، يجب عليك المثابرة والعمل بجد يوميا.", level: "B1", language: "ar", createdAt: new Date().toISOString() },
  { id: "type-ar-b2-1", sentence: "على الرغم من صعوبة الامتحان، استطاع الطلاب المتميزون تحقيق درجات ممتازة.", level: "B2", language: "ar", createdAt: new Date().toISOString() },
  { id: "type-ar-c1-1", sentence: "إن ثورة الاتصالات الحديثة قد ساهمت بشكل جذري في تقارب الشعوب واختصار المسافات.", level: "C1", language: "ar", createdAt: new Date().toISOString() },
  { id: "type-ar-c2-1", sentence: "تتجلى عبقرية الفلسفة الكلاسيكية في تفكيك ثنائية الوجود والعدم وصياغة مفاهيم الميتافيزيقا.", level: "C2", language: "ar", createdAt: new Date().toISOString() }
];

export async function getTrainingTopics(teacherId?: string): Promise<TrainingTopic[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_topics_${tid}`;
  const cached = getLocal<TrainingTopic[]>(localKey, []);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "training_topics"));
      const list: TrainingTopic[] = [];
      snap.forEach((dSnap) => {
        list.push(dSnap.data() as TrainingTopic);
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      } else {
        // Seed
        for (const item of defaultTrainingTopics) {
          await setDoc(doc(db, "teachers", tid, "training_topics", item.id), item);
        }
        setLocal(localKey, defaultTrainingTopics);
        return defaultTrainingTopics;
      }
    } catch (e) {
      console.warn(`Firestore getTrainingTopics failed for teacher ${tid}, using cache:`, e);
    }
  }
  return cached.length > 0 ? cached : defaultTrainingTopics;
}

export async function saveTrainingTopic(topic: TrainingTopic, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_topics_${tid}`;
  const current = await getTrainingTopics(tid);
  const updated = current.some(x => x.id === topic.id)
    ? current.map(x => x.id === topic.id ? topic : x)
    : [...current, topic];
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "training_topics", topic.id), topic);
    } catch (e) {
      console.warn("Firestore saveTrainingTopic failed:", e);
    }
  }
}

export async function deleteTrainingTopic(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_topics_${tid}`;
  const current = await getTrainingTopics(tid);
  const updated = current.filter(x => x.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "training_topics", id));
      // Also delete related questions
      const questionsSnap = await getDocs(query(collection(db, "teachers", tid, "training_questions"), where("topicId", "==", id)));
      for (const d of questionsSnap.docs) {
        await deleteDoc(doc(db, "teachers", tid, "training_questions", d.id));
      }
    } catch (e) {
      console.warn("Firestore deleteTrainingTopic failed:", e);
    }
  }
}

export async function getTrainingQuestions(teacherId?: string): Promise<TrainingQuestion[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_questions_${tid}`;
  const cached = getLocal<TrainingQuestion[]>(localKey, []);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "training_questions"));
      const list: TrainingQuestion[] = [];
      snap.forEach((dSnap) => {
        list.push(dSnap.data() as TrainingQuestion);
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      } else {
        // Seed
        for (const item of defaultTrainingQuestions) {
          await setDoc(doc(db, "teachers", tid, "training_questions", item.id), item);
        }
        setLocal(localKey, defaultTrainingQuestions);
        return defaultTrainingQuestions;
      }
    } catch (e) {
      console.warn(`Firestore getTrainingQuestions failed for teacher ${tid}, using cache:`, e);
    }
  }
  return cached.length > 0 ? cached : defaultTrainingQuestions;
}

export async function saveTrainingQuestion(question: TrainingQuestion, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_questions_${tid}`;
  const current = await getTrainingQuestions(tid);
  const updated = current.some(x => x.id === question.id)
    ? current.map(x => x.id === question.id ? question : x)
    : [...current, question];
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "training_questions", question.id), question);
    } catch (e) {
      console.warn("Firestore saveTrainingQuestion failed:", e);
    }
  }
}

export async function deleteTrainingQuestion(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_questions_${tid}`;
  const current = await getTrainingQuestions(tid);
  const updated = current.filter(x => x.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "training_questions", id));
    } catch (e) {
      console.warn("Firestore deleteTrainingQuestion failed:", e);
    }
  }
}

export async function getTypingSentences(teacherId?: string): Promise<TypingSentence[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_typing_sentences_${tid}`;
  const cached = getLocal<TypingSentence[]>(localKey, []);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "typing_sentences"));
      const list: TypingSentence[] = [];
      snap.forEach((dSnap) => {
        list.push(dSnap.data() as TypingSentence);
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      } else {
        // Seed
        for (const item of defaultTypingSentences) {
          await setDoc(doc(db, "teachers", tid, "typing_sentences", item.id), item);
        }
        setLocal(localKey, defaultTypingSentences);
        return defaultTypingSentences;
      }
    } catch (e) {
      console.warn(`Firestore getTypingSentences failed for teacher ${tid}, using cache:`, e);
    }
  }
  return cached.length > 0 ? cached : defaultTypingSentences;
}

export async function saveTypingSentence(sentence: TypingSentence, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_typing_sentences_${tid}`;
  const current = await getTypingSentences(tid);
  const updated = current.some(x => x.id === sentence.id)
    ? current.map(x => x.id === sentence.id ? sentence : x)
    : [...current, sentence];
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "typing_sentences", sentence.id), sentence);
    } catch (e) {
      console.warn("Firestore saveTypingSentence failed:", e);
    }
  }
}

export async function deleteTypingSentence(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_typing_sentences_${tid}`;
  const current = await getTypingSentences(tid);
  const updated = current.filter(x => x.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "typing_sentences", id));
    } catch (e) {
      console.warn("Firestore deleteTypingSentence failed:", e);
    }
  }
}

// ================= RECORDED LESSONS SERVICE =================

const RECORDED_KEY = "ep_recorded_lessons";

const defaultRecordedLessons: RecordedLesson[] = [];

export async function getRecordedLessons(teacherId?: string): Promise<RecordedLesson[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_recorded_lessons_${tid}`;
  const cached = getLocal<RecordedLesson[]>(localKey, []);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "recorded_lessons"));
      const list: RecordedLesson[] = [];
      snap.forEach((dSnap) => {
        list.push(dSnap.data() as RecordedLesson);
      });
      if (list.length > 0) {
        list.sort((a, b) => a.order - b.order);
        setLocal(localKey, list);
        return list;
      } else {
        // Seed
        for (const item of defaultRecordedLessons) {
          await setDoc(doc(db, "teachers", tid, "recorded_lessons", item.id), item);
        }
        setLocal(localKey, defaultRecordedLessons);
        return defaultRecordedLessons;
      }
    } catch (e) {
      console.warn(`Firestore getRecordedLessons failed for teacher ${tid}, using cache:`, e);
    }
  }
  return cached.length > 0 ? cached : defaultRecordedLessons;
}

export function subscribeToRecordedLessons(callback: (lessons: RecordedLesson[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_recorded_lessons_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "recorded_lessons"), (snap) => {
        const list: RecordedLesson[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as RecordedLesson);
        });
        list.sort((a, b) => a.order - b.order);
        setLocal(localKey, list);
        callback(list);
      }, (err) => {
        console.warn("Firestore subscribeToRecordedLessons failed, using cache:", err);
        callback(getLocal<RecordedLesson[]>(localKey, defaultRecordedLessons));
      });
    } catch (e) {
      console.warn("Firestore subscribeToRecordedLessons setup failed:", e);
    }
  }
  callback(getLocal<RecordedLesson[]>(localKey, defaultRecordedLessons));
  return () => {};
}

export async function saveRecordedLesson(lesson: RecordedLesson, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_recorded_lessons_${tid}`;
  const current = await getRecordedLessons(tid);
  const updated = current.some(x => x.id === lesson.id)
    ? current.map(x => x.id === lesson.id ? lesson : x)
    : [...current, lesson];
  updated.sort((a, b) => a.order - b.order);
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "recorded_lessons", lesson.id), lesson);
    } catch (e) {
      console.warn("Firestore saveRecordedLesson failed:", e);
    }
  }
}

export async function deleteRecordedLesson(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_recorded_lessons_${tid}`;
  const current = await getRecordedLessons(tid);
  const updated = current.filter(x => x.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "recorded_lessons", id));
    } catch (e) {
      console.warn("Firestore deleteRecordedLesson failed:", e);
    }
  }
}

// ================= LIBRARY QUESTION GAME OPERATIONS =================

const defaultLibraryBooks: LibraryBook[] = [
  {
    id: "lib-book-1",
    teacherId: "teacher-sarah",
    bookNumber: 1,
    coverColor: "from-blue-600 to-indigo-700",
    questionText: "Which sentence is grammatically correct?",
    options: [
      "She do not like tea.",
      "She don't like tea.",
      "She doesn't likes tea.",
      "She doesn't like tea."
    ],
    correctOptionIndex: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: "lib-book-2",
    teacherId: "teacher-sarah",
    bookNumber: 2,
    coverColor: "from-rose-600 to-red-700",
    questionText: "What is the past participle of the verb 'go'?",
    options: [
      "Went",
      "Going",
      "Gone",
      "Goes"
    ],
    correctOptionIndex: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "lib-book-3",
    teacherId: "teacher-sarah",
    bookNumber: 3,
    coverColor: "from-emerald-600 to-teal-700",
    questionText: "Choose the correct spelling:",
    options: [
      "Necessary",
      "Neccessary",
      "Necassary",
      "Necessery"
    ],
    correctOptionIndex: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "lib-book-4",
    teacherId: "teacher-sarah",
    bookNumber: 4,
    coverColor: "from-amber-600 to-orange-700",
    questionText: "Which word is a synonym of 'furious'?",
    options: [
      "Calm",
      "Very angry",
      "Happy",
      "Tired"
    ],
    correctOptionIndex: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "lib-book-5",
    teacherId: "teacher-sarah",
    bookNumber: 5,
    coverColor: "from-purple-600 to-fuchsia-700",
    questionText: "Complete the conditional: 'If I ___ more time, I would learn French.'",
    options: [
      "have",
      "had",
      "would have",
      "will have"
    ],
    correctOptionIndex: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "lib-book-6",
    teacherId: "teacher-sarah",
    bookNumber: 6,
    coverColor: "from-cyan-600 to-blue-700",
    questionText: "Identify the noun in this sentence: 'The beautiful cat slept soundly.'",
    options: [
      "beautiful",
      "cat",
      "slept",
      "soundly"
    ],
    correctOptionIndex: 1,
    createdAt: new Date().toISOString()
  }
];

export async function getLibraryBooks(teacherId?: string): Promise<LibraryBook[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_library_books_${tid}`;
  const cached = getLocal<LibraryBook[]>(localKey, []);
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "library_books"));
      const list: LibraryBook[] = [];
      snap.forEach((dSnap) => {
        list.push(dSnap.data() as LibraryBook);
      });
      if (list.length > 0) {
        list.sort((a, b) => a.bookNumber - b.bookNumber);
        setLocal(localKey, list);
        return list;
      } else {
        // Seed
        for (const item of defaultLibraryBooks) {
          const seededItem = { ...item, teacherId: tid };
          await setDoc(doc(db, "teachers", tid, "library_books", seededItem.id), seededItem);
        }
        setLocal(localKey, defaultLibraryBooks);
        return defaultLibraryBooks;
      }
    } catch (e) {
      console.warn(`Firestore getLibraryBooks failed for teacher ${tid}, using cache:`, e);
    }
  }
  return cached.length > 0 ? cached : defaultLibraryBooks;
}

export function subscribeToLibraryBooks(callback: (books: LibraryBook[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_library_books_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "library_books"), (snap) => {
        const list: LibraryBook[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as LibraryBook);
        });
        list.sort((a, b) => a.bookNumber - b.bookNumber);
        setLocal(localKey, list);
        callback(list);
      }, (err) => {
        console.warn("Firestore subscribeToLibraryBooks failed, using cache:", err);
        callback(getLocal<LibraryBook[]>(localKey, defaultLibraryBooks));
      });
    } catch (e) {
      console.warn("Firestore subscribeToLibraryBooks setup failed:", e);
    }
  }
  callback(getLocal<LibraryBook[]>(localKey, defaultLibraryBooks));
  return () => {};
}

export async function saveLibraryBook(book: LibraryBook, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_library_books_${tid}`;
  const current = await getLibraryBooks(tid);
  const updated = current.some(x => x.id === book.id)
    ? current.map(x => x.id === book.id ? book : x)
    : [...current, book];
  updated.sort((a, b) => a.bookNumber - b.bookNumber);
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "library_books", book.id), book);
    } catch (e) {
      console.warn("Firestore saveLibraryBook failed:", e);
    }
  }
}

export async function deleteLibraryBook(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_library_books_${tid}`;
  const current = await getLibraryBooks(tid);
  const updated = current.filter(x => x.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "library_books", id));
    } catch (e) {
      console.warn("Firestore deleteLibraryBook failed:", e);
    }
  }
}

export async function saveTrainingAttempt(attempt: TrainingAttempt): Promise<void> {
  const localKey = `ep_training_attempts_${attempt.studentId}`;
  const current = getLocal<TrainingAttempt[]>(localKey, []);
  const updated = current.some(x => x.id === attempt.id)
    ? current.map(x => x.id === attempt.id ? attempt : x)
    : [...current, attempt];
  updated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "students", attempt.studentId, "training_attempts", attempt.id), attempt);
    } catch (e) {
      console.warn("Firestore saveTrainingAttempt failed:", e);
    }
  }
}

export function subscribeToTrainingAttempts(studentId: string, callback: (attempts: TrainingAttempt[]) => void): () => void {
  const localKey = `ep_training_attempts_${studentId}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "students", studentId, "training_attempts"), (snap) => {
        const list: TrainingAttempt[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as TrainingAttempt);
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLocal(localKey, list);
        callback(list);
      }, (err) => {
        console.warn("Firestore subscribeToTrainingAttempts failed, using cache:", err);
        callback(getLocal<TrainingAttempt[]>(localKey, []));
      });
    } catch (e) {
      console.warn("Firestore subscribeToTrainingAttempts setup failed:", e);
    }
  }
  callback(getLocal<TrainingAttempt[]>(localKey, []));
  return () => {};
}

const SEED_TRAINING_LINKS: TrainingLink[] = [
  {
    id: "seed-babadum",
    nameEn: "Babadum",
    nameAr: "بابادوم (Babadum)",
    descEn: "Learn and practice English vocabulary interactively with gorgeous illustrations, pronunciations, and multiple playful mini-games.",
    descAr: "تعلم المفردات الإنجليزية وحفظها بطريقة تفاعلية ممتعة ومميزة باستخدام الصور والرسومات والألعاب الصوتية المتعددة.",
    url: "https://babadum.com/",
    level: "All",
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "seed-gamestolearnenglish",
    nameEn: "Games to Learn English",
    nameAr: "ألعاب تعلم الإنجليزية (Games to Learn English)",
    descEn: "A massive suite of high-quality learning games designed to build grammar constructs, sentence structure, vocabulary, and listening comprehension.",
    descAr: "مجموعة ضخمة ومتكاملة من الألعاب التعليمية المبتكرة لتطوير القواعد النحوية، صياغة الجمل، والمفردات، وتحسين مهارة الاستماع.",
    url: "https://www.gamestolearnenglish.com/",
    level: "All",
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "seed-wordwall-speech",
    nameEn: "Impromptu Speech Wheel",
    nameAr: "عجلة التحدث المرتجل (Wordwall Impromptu)",
    descEn: "An interactive, randomized speech topics wheel designed to practice speaking on random prompts instantly, boosting fluency and conversational confidence.",
    descAr: "عجلة عشوائية تفاعلية ممتازة تولد مواضيعاً ممتعة ومحفزة للتحدث والخطابة المرتجلة باللغة الإنجليزية للتخلص من رهبة التحدث المباشر.",
    url: "https://wordwall.net/ar/resource/9953192/impromptu-speech-topics",
    level: "All",
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

export async function getTrainingLinks(teacherId?: string): Promise<TrainingLink[]> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_links_${tid}`;
  if (db) {
    try {
      const snap = await getDocs(collection(db, "teachers", tid, "training_links"));
      const list: TrainingLink[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as TrainingLink);
      });
      if (list.length > 0) {
        setLocal(localKey, list);
        return list;
      }
    } catch (e) {
      console.warn("Firestore getTrainingLinks failed:", e);
    }
  }
  return getLocal<TrainingLink[]>(localKey, SEED_TRAINING_LINKS);
}

export async function saveTrainingLink(link: TrainingLink, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_links_${tid}`;
  const current = await getTrainingLinks(tid);
  const updated = current.some(x => x.id === link.id)
    ? current.map(x => x.id === link.id ? link : x)
    : [...current, link];
  setLocal(localKey, updated);

  if (db) {
    try {
      await setDoc(doc(db, "teachers", tid, "training_links", link.id), link);
    } catch (e) {
      console.warn("Firestore saveTrainingLink failed:", e);
    }
  }
}

export async function deleteTrainingLink(id: string, teacherId?: string): Promise<void> {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_links_${tid}`;
  const current = await getTrainingLinks(tid);
  const updated = current.filter(x => x.id !== id);
  setLocal(localKey, updated);

  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", tid, "training_links", id));
    } catch (e) {
      console.warn("Firestore deleteTrainingLink failed:", e);
    }
  }
}

export function subscribeToTrainingLinks(callback: (links: TrainingLink[]) => void, teacherId?: string): () => void {
  const tid = teacherId || "teacher-sarah";
  const localKey = `ep_training_links_${tid}`;
  if (db) {
    try {
      return onSnapshot(collection(db, "teachers", tid, "training_links"), (snap) => {
        const list: TrainingLink[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as TrainingLink);
        });
        if (list.length === 0) {
          callback(SEED_TRAINING_LINKS);
          setLocal(localKey, SEED_TRAINING_LINKS);
        } else {
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLocal(localKey, list);
          callback(list);
        }
      }, (err) => {
        console.warn("Firestore subscribeToTrainingLinks failed, using cache:", err);
        callback(getLocal<TrainingLink[]>(localKey, SEED_TRAINING_LINKS));
      });
    } catch (e) {
      console.warn("Firestore subscribeToTrainingLinks setup failed:", e);
    }
  }
  callback(getLocal<TrainingLink[]>(localKey, SEED_TRAINING_LINKS));
  return () => {};
}




