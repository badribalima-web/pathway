import { Vocabulary, DynamicVocabCategory } from "../types";

export interface VocabCategory {
  id: string;
  en: string;
  ar: string;
}

export const A1_CATEGORIES: VocabCategory[] = [
  { id: "Greetings", en: "Greetings", ar: "التحيات والترحيب" },
  { id: "Introductions", en: "Introductions", ar: "التعارف والتقديم" },
  { id: "Family", en: "Family", ar: "العائلة" },
  { id: "Friends", en: "Friends", ar: "الأصدقاء والعلاقات" },
  { id: "Numbers", en: "Numbers", ar: "الأرقام والحساب" },
  { id: "Colors", en: "Colors", ar: "الألوان" },
  { id: "Days & Months", en: "Days & Months", ar: "الأيام والأشهر" },
  { id: "Time & Dates", en: "Time & Dates", ar: "الوقت والتواريخ" },
  { id: "Weather", en: "Weather", ar: "الطقس والأحوال الجوية" },
  { id: "Food & Drinks", en: "Food & Drinks", ar: "الطعام والشراب" },
  { id: "Fruits & Vegetables", en: "Fruits & Vegetables", ar: "الفواكه والخضروات" },
  { id: "Clothes", en: "Clothes", ar: "الملابس والأزياء" },
  { id: "Body Parts", en: "Body Parts", ar: "أعضاء الجسم" },
  { id: "Health", en: "Health", ar: "الصحة والطب" },
  { id: "Home & Furniture", en: "Home & Furniture", ar: "المنزل والأثاث" },
  { id: "School", en: "School", ar: "المدرسة والتعليم" },
  { id: "Jobs", en: "Jobs", ar: "الوظائف والمهن" },
  { id: "Places in Town", en: "Places in Town", ar: "الأماكن في المدينة" },
  { id: "Transportation", en: "Transportation", ar: "وسائل النقل والمواصلات" },
  { id: "Shopping", en: "Shopping", ar: "التسوق والمشتريات" },
  { id: "Money", en: "Money", ar: "المال والعملات" },
  { id: "Animals", en: "Animals", ar: "الحيوانات" },
  { id: "Nature", en: "Nature", ar: "الطبيعة والبيئة" },
  { id: "Hobbies", en: "Hobbies", ar: "الهوايات والاهتمامات" },
  { id: "Sports", en: "Sports", ar: "الرياضة والألعاب" },
  { id: "Technology Basics", en: "Technology Basics", ar: "أساسيات التكنولوجيا" },
  { id: "Daily Activities", en: "Daily Activities", ar: "الأنشطة اليومية" },
  { id: "Verbs", en: "Verbs", ar: "الأفعال الأساسية" },
  { id: "Adjectives", en: "Adjectives", ar: "الصفات الشائعة" },
  { id: "Prepositions", en: "Prepositions", ar: "حروف الجر" },
  { id: "Question Words", en: "Question Words", ar: "أدوات الاستفهام" },
  { id: "Common Expressions", en: "Common Expressions", ar: "تعبيرات شائعة" }
];

export const A2_CATEGORIES: VocabCategory[] = [
  { id: "Travel & Holidays", en: "Travel & Holidays", ar: "السفر والعطلات" },
  { id: "Airport", en: "Airport", ar: "المطار" },
  { id: "Hotel", en: "Hotel", ar: "الفنادق والإقامة" },
  { id: "Restaurant", en: "Restaurant", ar: "المطاعم والوجبات" },
  { id: "Directions", en: "Directions", ar: "الاتجاهات والإرشادات" },
  { id: "Education", en: "Education", ar: "التعليم والدراسة" },
  { id: "Work & Careers", en: "Work & Careers", ar: "العمل والمسارات المهنية" },
  { id: "Office Vocabulary", en: "Office Vocabulary", ar: "مفردات المكتب والعمل" },
  { id: "Communication", en: "Communication", ar: "الاتصالات والتواصل" },
  { id: "Internet & Social Media", en: "Internet & Social Media", ar: "الإنترنت ومواقع التواصل" },
  { id: "Environment", en: "Environment", ar: "البيئة والمناخ" },
  { id: "Culture", en: "Culture", ar: "الثقافة والفنون" },
  { id: "Entertainment", en: "Entertainment", ar: "الترفيه والتسلية" },
  { id: "Films & Music", en: "Films & Music", ar: "الأفلام والموسيقى" },
  { id: "Books", en: "Books", ar: "الكتب والقراءة" },
  { id: "News", en: "News", ar: "الأخبار والإعلام" },
  { id: "Feelings & Emotions", en: "Feelings & Emotions", ar: "المشاعر والعواطف" },
  { id: "Personality", en: "Personality", ar: "الصفات الشخصية" },
  { id: "Relationships", en: "Relationships", ar: "العلاقات الاجتماعية" },
  { id: "Crime & Safety", en: "Crime & Safety", ar: "الجريمة والأمن والسلامة" },
  { id: "Health & Lifestyle", en: "Health & Lifestyle", ar: "الصحة وأسلوب الحياة" },
  { id: "Fitness", en: "Fitness", ar: "الرشاقة واللياقة البدنية" },
  { id: "Shopping & Services", en: "Shopping & Services", ar: "التسوق والخدمات" },
  { id: "Banking", en: "Banking", ar: "الخدمات المصرفية والبنوك" },
  { id: "Technology", en: "Technology", ar: "التكنولوجيا والتقنيات" },
  { id: "Business Basics", en: "Business Basics", ar: "أساسيات الأعمال والتجارة" },
  { id: "Common Phrasal Verbs", en: "Common Phrasal Verbs", ar: "الأفعال المركبة الشائعة" },
  { id: "Academic Vocabulary (A2)", en: "Academic Vocabulary (A2)", ar: "المفردات الأكاديمية (A2)" },
  { id: "Idioms (Easy)", en: "Idioms (Easy)", ar: "تعبيرات اصطلاحية سهلة" },
  { id: "Collocations", en: "Collocations", ar: "التلازم اللفظي" },
  { id: "IELTS Foundation Vocabulary", en: "IELTS Foundation Vocabulary", ar: "مفردات التأسيس للأيلتس" }
];

export const B1_CATEGORIES: VocabCategory[] = [
  { id: "Education", en: "Education", ar: "التعليم والمدارس" },
  { id: "Work & Careers", en: "Work & Careers", ar: "العمل والمهن" },
  { id: "Business Basics", en: "Business Basics", ar: "أساسيات الأعمال والتجارة" },
  { id: "Technology", en: "Technology", ar: "التكنولوجيا والاتصالات" },
  { id: "Social Media", en: "Social Media", ar: "وسائل التواصل الاجتماعي" },
  { id: "Environment", en: "Environment", ar: "البيئة والطبيعة المحيطة" },
  { id: "Health & Medicine", en: "Health & Medicine", ar: "الصحة والعناية الطبية" },
  { id: "Fitness", en: "Fitness", ar: "اللياقة البدنية والصحة" },
  { id: "Food & Nutrition", en: "Food & Nutrition", ar: "الغذاء والتغذية السليمة" },
  { id: "Travel", en: "Travel", ar: "السفر والرحلات" },
  { id: "Tourism", en: "Tourism", ar: "السياحة والمعالم السياحية" },
  { id: "Transportation", en: "Transportation", ar: "وسائل النقل والمواصلات" },
  { id: "Accommodation", en: "Accommodation", ar: "السكن والإقامة في السفر" },
  { id: "Culture", en: "Culture", ar: "الثقافات المختلفة والتقاليد" },
  { id: "Traditions", en: "Traditions", ar: "العادات والتقاليد الاجتماعية" },
  { id: "Festivals", en: "Festivals", ar: "المهرجانات والمناسبات السعيدة" },
  { id: "Relationships", en: "Relationships", ar: "العلاقات والأصدقاء" },
  { id: "Personality", en: "Personality", ar: "الشخصية والصفات الفردية" },
  { id: "Feelings & Emotions", en: "Feelings & Emotions", ar: "المشاعر والعواطف والمزاج" },
  { id: "Crime & Law", en: "Crime & Law", ar: "الجريمة والقوانين الأساسية" },
  { id: "News & Media", en: "News & Media", ar: "الأخبار والجرائد والتلفزيون" },
  { id: "Politics Basics", en: "Politics Basics", ar: "أساسيات السياسة والدول" },
  { id: "Economy Basics", en: "Economy Basics", ar: "أساسيات الاقتصاد والمال" },
  { id: "Science", en: "Science", ar: "العلوم والاكتشافات البسيطة" },
  { id: "Communication", en: "Communication", ar: "التواصل والاتصالات اليومية" },
  { id: "Telephone Conversations", en: "Telephone Conversations", ar: "المحادثات الهاتفية اليومية" },
  { id: "Problem Solving", en: "Problem Solving", ar: "حل المشكلات والصعوبات" },
  { id: "Opinions & Discussions", en: "Opinions & Discussions", ar: "إبداء الآراء والمناقشة" },
  { id: "Common Phrasal Verbs", en: "Common Phrasal Verbs", ar: "الأفعال المركبة الشائعة" },
  { id: "Intermediate Idioms", en: "Intermediate Idioms", ar: "التعبيرات الاصطلاحية المتوسطة" },
  { id: "Collocations", en: "Collocations", ar: "التلازم اللفظي للمتوسطين" },
  { id: "Academic Vocabulary", en: "Academic Vocabulary", ar: "المفردات الأكاديمية للمتوسطين" },
  { id: "IELTS Vocabulary (B1)", en: "IELTS Vocabulary (B1)", ar: "مفردات الآيلتس لمستوى B1" }
];

export const B2_CATEGORIES: VocabCategory[] = [
  { id: "Advanced Education", en: "Advanced Education", ar: "التعليم المتقدم والدراسة الجامعية" },
  { id: "University Life", en: "University Life", ar: "الحياة الجامعية والأنشطة الطلابية" },
  { id: "Professional Careers", en: "Professional Careers", ar: "المسارات المهنية والوظائف الاحترافية" },
  { id: "Business English", en: "Business English", ar: "إنجليزية الأعمال والشركات" },
  { id: "Finance", en: "Finance", ar: "المالية والاستثمار والتمويل" },
  { id: "Marketing", en: "Marketing", ar: "التسويق والإعلانات التجارية" },
  { id: "Entrepreneurship", en: "Entrepreneurship", ar: "ريادة الأعمال والمشاريع الناشئة" },
  { id: "Leadership", en: "Leadership", ar: "القيادة والتوجيه الإداري" },
  { id: "Artificial Intelligence", en: "Artificial Intelligence", ar: "الذكاء الاصطناعي والتقنية الذكية" },
  { id: "Innovation", en: "Innovation", ar: "الابتكار والحلول الإبداعية" },
  { id: "Climate Change", en: "Climate Change", ar: "التغير المناخي والبيئي العالمي" },
  { id: "Global Issues", en: "Global Issues", ar: "القضايا والمشكلات العالمية المشتركة" },
  { id: "Psychology", en: "Psychology", ar: "علم النفس والسلوك البشري" },
  { id: "Society", en: "Society", ar: "المجتمع والقضايا المجتمعية" },
  { id: "Politics", en: "Politics", ar: "السياسة والمؤسسات الحكومية" },
  { id: "Law", en: "Law", ar: "القانون والأنظمة والتشريعات" },
  { id: "International Relations", en: "International Relations", ar: "العلاقات الدولية والدبلوماسية والتعاون" },
  { id: "Media & Journalism", en: "Media & Journalism", ar: "الإعلام والصحافة ونقل الأخبار" },
  { id: "Literature", en: "Literature", ar: "الأدب والروايات والمسرحيات" },
  { id: "Arts", en: "Arts", ar: "الفنون والتمثيل والرسم" },
  { id: "History", en: "History", ar: "التاريخ والأحداث التاريخية الهامة" },
  { id: "Medicine", en: "Medicine", ar: "الطب والعلوم الطبية الرائدة" },
  { id: "Scientific Research", en: "Scientific Research", ar: "البحث العلمي والتجارب والعلوم" },
  { id: "Environment & Sustainability", en: "Environment & Sustainability", ar: "البيئة والاستدامة وحمايتها" },
  { id: "Debate Vocabulary", en: "Debate Vocabulary", ar: "مفردات المناظرة والمناقشة الحادة" },
  { id: "Formal English", en: "Formal English", ar: "الإنجليزية الرسمية والأكاديمية" },
  { id: "Advanced Phrasal Verbs", en: "Advanced Phrasal Verbs", ar: "الأفعال المركبة فوق المتوسطة" },
  { id: "Advanced Idioms", en: "Advanced Idioms", ar: "التعبيرات الاصطلاحية فوق المتوسطة" },
  { id: "Collocations", en: "Collocations", ar: "التلازم اللفظي لمستوى B2" },
  { id: "Academic Vocabulary", en: "Academic Vocabulary", ar: "المفردات الأكاديمية لمستوى B2" }
];

export const C1_CATEGORIES: VocabCategory[] = [
  { id: "Advanced Academic Vocabulary", en: "Advanced Academic Vocabulary", ar: "المفردات الأكاديمية المتقدمة" },
  { id: "IELTS Advanced Vocabulary", en: "IELTS Advanced Vocabulary", ar: "مفردات الآيلتس المتقدمة (7.5+)" },
  { id: "Formal English", en: "Formal English", ar: "الإنجليزية الرسمية" },
  { id: "Business English", en: "Business English", ar: "إنجليزية الأعمال" },
  { id: "Finance & Economics", en: "Finance & Economics", ar: "المالية والاقتصاد" },
  { id: "Marketing", en: "Marketing", ar: "التسويق" },
  { id: "Entrepreneurship", en: "Entrepreneurship", ar: "ريادة الأعمال" },
  { id: "Leadership & Management", en: "Leadership & Management", ar: "القيادة والإدارة" },
  { id: "Artificial Intelligence", en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" },
  { id: "Technology", en: "Technology", ar: "التكنولوجيا والتقنية" },
  { id: "Cybersecurity", en: "Cybersecurity", ar: "الأمن السيبراني" },
  { id: "Data & Innovation", en: "Data & Innovation", ar: "البيانات والابتكار" },
  { id: "Medicine", en: "Medicine", ar: "الطب والجراحة" },
  { id: "Healthcare", en: "Healthcare", ar: "الرعاية الصحية" },
  { id: "Psychology", en: "Psychology", ar: "علم النفس والتحليل السلوكي" },
  { id: "Sociology", en: "Sociology", ar: "علم الاجتماع" },
  { id: "Philosophy", en: "Philosophy", ar: "الفلسفة والمنطق" },
  { id: "Politics", en: "Politics", ar: "السياسة والأنظمة" },
  { id: "International Relations", en: "International Relations", ar: "العلاقات الدولية" },
  { id: "Law & Justice", en: "Law & Justice", ar: "القانون والعدالة" },
  { id: "Crime", en: "Crime", ar: "الجريمة والتحقيق" },
  { id: "Environment", en: "Environment", ar: "البيئة والحياة الفطرية" },
  { id: "Climate Change", en: "Climate Change", ar: "التغير المناخي" },
  { id: "Sustainability", en: "Sustainability", ar: "الاستدامة والحفاظ على الموارد" },
  { id: "Science", en: "Science", ar: "العلوم العامة والفيزياء" },
  { id: "Engineering", en: "Engineering", ar: "الهندسة والتصنيع" },
  { id: "Research", en: "Research", ar: "البحث والأطروحات" },
  { id: "Media & Journalism", en: "Media & Journalism", ar: "الصحافة والإعلام" },
  { id: "Literature", en: "Literature", ar: "الأدب" },
  { id: "History", en: "History", ar: "التاريخ" },
  { id: "Arts & Culture", en: "Arts & Culture", ar: "الفنون والثقافة" },
  { id: "Education", en: "Education", ar: "التعليم" },
  { id: "Communication Skills", en: "Communication Skills", ar: "مهارات التواصل" },
  { id: "Public Speaking", en: "Public Speaking", ar: "الخطابة والإلقاء" },
  { id: "Debate & Argumentation", en: "Debate & Argumentation", ar: "المناظرة والحجج" },
  { id: "Negotiation", en: "Negotiation", ar: "التفاوض" },
  { id: "Advanced Phrasal Verbs", en: "Advanced Phrasal Verbs", ar: "الأفعال المركبة المتقدمة" },
  { id: "Advanced Idioms", en: "Advanced Idioms", ar: "التعبيرات الاصطلاحية المتقدمة" },
  { id: "Collocations", en: "Collocations", ar: "المتلازمات اللفظية المتقدمة" },
  { id: "Synonyms & Antonyms", en: "Synonyms & Antonyms", ar: "المترادفات والمتضادات" },
  { id: "Difficult Verbs", en: "Difficult Verbs", ar: "الأفعال الصعبة" },
  { id: "Difficult Adjectives", en: "Difficult Adjectives", ar: "الصفات الصعبة" },
  { id: "Difficult Nouns", en: "Difficult Nouns", ar: "الأسماء الصعبة" },
  { id: "Common IELTS C1 Expressions", en: "Common IELTS C1 Expressions", ar: "تعبيرات آيلتس شائعة لمستوى C1" }
];

export const C2_CATEGORIES: VocabCategory[] = [
  { id: "Nuances & Mastery", en: "Nuances & Mastery", ar: "الفروق الدقيقة والإتقان" },
  { id: "Advanced Rhetoric", en: "Advanced Rhetoric", ar: "البلاغة والخطابة المتقدمة" },
  { id: "Specialized Terminology", en: "Specialized Terminology", ar: "المصطلحات التخصصية" },
  { id: "Academic Research", en: "Academic Research", ar: "البحث الأكاديمي والأطروحات" },
  { id: "Metaphorical Expressions", en: "Metaphorical Expressions", ar: "التعبيرات المجازية العميقة" }
];

export function getCategoriesForLevel(level: string): VocabCategory[] {
  switch (level) {
    case "A1": return A1_CATEGORIES;
    case "A2": return A2_CATEGORIES;
    case "B1": return B1_CATEGORIES;
    case "B2": return B2_CATEGORIES;
    case "C1": return C1_CATEGORIES;
    case "C2": return C2_CATEGORIES;
    default: return [
      { id: "General", en: "General Vocabulary", ar: "المفردات العامة" },
      { id: "Academic", en: "Academic English", ar: "اللغة الإنجليزية الأكاديمية" }
    ];
  }
}

export function getDefaultCategories(): DynamicVocabCategory[] {
  const all: DynamicVocabCategory[] = [];
  const add = (list: VocabCategory[], level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2") => {
    list.forEach((item, index) => {
      all.push({
        id: `${level}_${item.id}`.replace(/\s+/g, '_').replace(/&/g, 'and').replace(/[()+]/g, ''),
        en: item.en,
        ar: item.ar,
        level,
        order: index + 1,
        imageUrl: ""
      });
    });
  };
  add(A1_CATEGORIES, "A1");
  add(A2_CATEGORIES, "A2");
  add(B1_CATEGORIES, "B1");
  add(B2_CATEGORIES, "B2");
  add(C1_CATEGORIES, "C1");
  add(C2_CATEGORIES, "C2");
  return all;
}

// Rich set of seed vocabulary words covering typical categories.
export const SEED_VOCABULARY: Omit<Vocabulary, 'id' | 'createdAt'>[] = [
  // Greetings (A1)
  {
    word: "Hello",
    translation: "مرحباً",
    definition: "Used as a greeting or to begin a phone conversation.",
    definitionAr: "يستخدم كتحية للترحيب بالآخرين أو لبدء مكالمة هاتفية.",
    example: "Hello! How are you doing today?",
    exampleAr: "مرحباً! كيف حالك اليوم؟",
    category: "Greetings",
    level: "A1",
    partOfSpeech: "Expression",
    pronunciation: "/həˈloʊ/"
  },
  {
    word: "Good morning",
    translation: "صباح الخير",
    definition: "Used to greet someone in the morning.",
    definitionAr: "عبارة ترحيبية تقال في الصباح الباكر.",
    example: "Good morning, class! Please open your books.",
    exampleAr: "صباح الخير يا طلاب! يرجى فتح كتبكم.",
    category: "Greetings",
    level: "A1",
    partOfSpeech: "Expression",
    pronunciation: "/ɡʊd ˈmɔːrnɪŋ/"
  },
  {
    word: "Nice to meet you",
    translation: "سررت بلقائك",
    definition: "A polite formula used when meeting someone for the first time.",
    definitionAr: "صيغة مهذبة تقال عند مقابلة شخص ما لأول مرة.",
    example: "My name is Thomas. Nice to meet you!",
    exampleAr: "اسمي توماس. سررت بلقائك!",
    category: "Greetings",
    level: "A1",
    partOfSpeech: "Expression",
    pronunciation: "/naɪs tu miːt ju/"
  },

  // Introductions (A1)
  {
    word: "Name",
    translation: "اسم",
    definition: "A word by which a person, place, or thing is known.",
    definitionAr: "الكلمة أو اللفظ الذي يعرف به الشخص أو المكان أو الشيء.",
    example: "What is your name?",
    exampleAr: "ما اسمك؟",
    category: "Introductions",
    level: "A1",
    partOfSpeech: "Noun",
    pronunciation: "/neɪm/"
  },
  {
    word: "Introduce",
    translation: "يُعرّف / يُقدّم",
    definition: "To present a person to another so as to make them acquainted.",
    definitionAr: "تقديم شخص لآخر بهدف التعارف وزيادة المعرفة.",
    example: "Let me introduce you to my colleague.",
    exampleAr: "اسمح لي أن أقدمك إلى زميلي.",
    category: "Introductions",
    level: "A1",
    partOfSpeech: "Verb",
    pronunciation: "/ˌɪntrəˈduːs/"
  },

  // Family (A1)
  {
    word: "Father",
    translation: "أب",
    definition: "A male parent.",
    definitionAr: "الوالد الذكر.",
    example: "My father works as an engineer.",
    exampleAr: "والدي يعمل كمهندس.",
    category: "Family",
    level: "A1",
    partOfSpeech: "Noun",
    pronunciation: "/ˈfɑːðər/"
  },
  {
    word: "Mother",
    translation: "أم",
    definition: "A female parent.",
    definitionAr: "الوالدة الأنثى.",
    example: "My mother cooks delicious meals.",
    exampleAr: "أمي تطبخ وجبات لذيذة.",
    category: "Family",
    level: "A1",
    partOfSpeech: "Noun",
    pronunciation: "/ˈmʌðər/"
  },
  {
    word: "Brother",
    translation: "أخ",
    definition: "A man or boy in relation to other children of his parents.",
    definitionAr: "شقيق أو أخ بالنسبة للأبناء الآخرين لنفس الوالدين.",
    example: "I have an older brother.",
    exampleAr: "لدي أخ أكبر سناً.",
    category: "Family",
    level: "A1",
    partOfSpeech: "Noun",
    pronunciation: "/ˈbrʌðər/"
  },
  {
    word: "Sister",
    translation: "أخت",
    definition: "A woman or girl in relation to other children of her parents.",
    definitionAr: "شقيقة أو أخت بالنسبة للأبناء الآخرين لنفس الوالدين.",
    example: "My sister studies at university.",
    exampleAr: "أختي تدرس في الجامعة.",
    category: "Family",
    level: "A1",
    partOfSpeech: "Noun",
    pronunciation: "/ˈsɪstər/"
  },

  // Food & Drinks (A1)
  {
    word: "Water",
    translation: "ماء",
    definition: "A colorless, transparent, odorless liquid essential for life.",
    definitionAr: "سائل شفاف عديم اللون والرائحة أساسي للحياة.",
    example: "I would like a glass of water, please.",
    exampleAr: "أود الحصول على كوب من الماء، من فضلك.",
    category: "Food & Drinks",
    level: "A1",
    partOfSpeech: "Noun",
    pronunciation: "/ˈwɔːtər/"
  },
  {
    word: "Bread",
    translation: "خبز",
    definition: "Food made of flour, water, and yeast mixed together and baked.",
    definitionAr: "طعام يُصنع من الدقيق والماء والخميرة يمزج معاً ويُخبز.",
    example: "She bought fresh bread from the bakery.",
    exampleAr: "اشترت خبزاً طازجاً من المخبز.",
    category: "Food & Drinks",
    level: "A1",
    partOfSpeech: "Noun",
    pronunciation: "/bred/"
  },
  {
    word: "Eat",
    translation: "يأكل",
    definition: "To put food into the mouth and chew and swallow it.",
    definitionAr: "وضع الطعام في الفم ومضغه ثم بلعه.",
    example: "What do you like to eat for dinner?",
    exampleAr: "ماذا تحب أن تأكل في وجبة العشاء؟",
    category: "Food & Drinks",
    level: "A1",
    partOfSpeech: "Verb",
    pronunciation: "/iːt/"
  },

  // Transportation (A1)
  {
    word: "Car",
    translation: "سيارة",
    definition: "A road vehicle, typically with four wheels, powered by an engine.",
    definitionAr: "مركبة طرق، تحتوي عادةً على أربع عجلات، وتعمل بمحرك.",
    example: "He drives a blue car to work.",
    exampleAr: "يقود سيارة زرقاء إلى العمل.",
    category: "Transportation",
    level: "A1",
    partOfSpeech: "Noun",
    pronunciation: "/kɑːr/"
  },
  {
    word: "Bus",
    translation: "حافلة",
    definition: "A large motor vehicle carrying passengers by road.",
    definitionAr: "مركبة بمحرك كبيرة تنقل الركاب عبر الطريق.",
    example: "I catch the bus every morning at 8 AM.",
    exampleAr: "أستقل الحافلة كل صباح في الثامنة صباحاً.",
    category: "Transportation",
    level: "A1",
    partOfSpeech: "Noun",
    pronunciation: "/bʌs/"
  },

  // Daily Activities (A1)
  {
    word: "Sleep",
    translation: "ينام / النوم",
    definition: "A condition of body and mind that typically recurs for several hours.",
    definitionAr: "حالة طبيعية من الراحة للجسد والعقل تحدث يومياً لعدة ساعات.",
    example: "I usually sleep eight hours a night.",
    exampleAr: "أنا عادةً أنام ثماني ساعات كل ليلة.",
    category: "Daily Activities",
    level: "A1",
    partOfSpeech: "Verb",
    pronunciation: "/sliːp/"
  },
  {
    word: "Wake up",
    translation: "يستيقظ",
    definition: "To emerge or cause to emerge from sleep.",
    definitionAr: "النهوض أو جعل شخص ما ينهض من النوم.",
    example: "I wake up early on weekdays.",
    exampleAr: "أستيقظ باكراً في أيام الأسبوع.",
    category: "Daily Activities",
    level: "A1",
    partOfSpeech: "Phrasal Verb",
    pronunciation: "/weɪk ʌp/"
  },

  // Airport (A2)
  {
    word: "Flight",
    translation: "رحلة جوية",
    definition: "An journey made through the air by a plane.",
    definitionAr: "رحلة سفر تتم عبر الجو بواسطة الطائرة.",
    example: "My flight to London is on schedule.",
    exampleAr: "رحلتي الجوية إلى لندن في موعدها المحدد.",
    category: "Airport",
    level: "A2",
    partOfSpeech: "Noun",
    pronunciation: "/flaɪt/"
  },
  {
    word: "Boarding pass",
    translation: "بطاقة صعود الطائرة",
    definition: "A document provided by an airline during check-in, giving permission to board.",
    definitionAr: "وثيقة توفرها شركة الطيران عند تسجيل الدخول، تمنح الإذن بالصعود للطائرة.",
    example: "Please show your boarding pass at gate number 5.",
    exampleAr: "يرجى إبراز بطاقة صعود الطائرة عند البوابة رقم 5.",
    category: "Airport",
    level: "A2",
    partOfSpeech: "Noun",
    pronunciation: "/ˈbɔːrdɪŋ pæs/"
  },
  {
    word: "Luggage",
    translation: "أمتعة السفر / حقائب",
    definition: "Suitcases and bags containing a traveler's belongings.",
    definitionAr: "الحقائب والحزم التي تحتوي على ممتلكات المسافر.",
    example: "We collected our luggage at the baggage claim.",
    exampleAr: "قمنا باستلام أمتعتنا من منطقة استلام الحقائب.",
    category: "Airport",
    level: "A2",
    partOfSpeech: "Noun",
    pronunciation: "/ˈlʌɡɪdʒ/"
  },

  // Hotel (A2)
  {
    word: "Reservation",
    translation: "حجز مسبق",
    definition: "An arrangement to secure a room or place in advance.",
    definitionAr: "ترتيب لتأمين غرفة أو مكان مسبقاً قبل الوصول.",
    example: "I made a reservation online for three nights.",
    exampleAr: "لقد أجريت حجزاً عبر الإنترنت لمدة ثلاث ليالٍ.",
    category: "Hotel",
    level: "A2",
    partOfSpeech: "Noun",
    pronunciation: "/ˌrezərˈveɪʃən/"
  },
  {
    word: "Check-in",
    translation: "تسجيل الدخول",
    definition: "The act of registering at a hotel or airport.",
    definitionAr: "عملية التسجيل وتأكيد الحضور عند الوصول للفندق أو المطار.",
    example: "Hotel check-in is starting from 2:00 PM.",
    exampleAr: "تسجيل الدخول في الفندق يبدأ من الساعة الثانية ظهراً.",
    category: "Hotel",
    level: "A2",
    partOfSpeech: "Noun",
    pronunciation: "/ˈtʃek ɪn/"
  },

  // Travel & Holidays (A2)
  {
    word: "Journey",
    translation: "رحلة / مسيرة سفر",
    definition: "An act of traveling from one place to another.",
    definitionAr: "عملية الانتقال والسفر من مكان إلى آخر.",
    example: "The train journey takes about four hours.",
    exampleAr: "رحلة القطار تستغرق حوالي أربع ساعات.",
    category: "Travel & Holidays",
    level: "A2",
    partOfSpeech: "Noun",
    pronunciation: "/ˈdʒɜːrni/"
  },
  {
    word: "Passport",
    translation: "جواز سفر",
    definition: "An official document certifying the holder's identity and citizenship for travel.",
    definitionAr: "وثيقة رسمية تثبت هوية حاملها وجنسيته لتسهيل السفر بين الدول.",
    example: "Do not forget to renew your passport before traveling.",
    exampleAr: "لا تنسَ تجديد جواز سفرك قبل السفر.",
    category: "Travel & Holidays",
    level: "A2",
    partOfSpeech: "Noun",
    pronunciation: "/ˈpæspɔːrt/"
  },

  // Common Phrasal Verbs (A2)
  {
    word: "Look for",
    translation: "يبحث عن",
    definition: "To search or seek for something or someone.",
    definitionAr: "البحث عن شيء ما مفقود أو عن شخص.",
    example: "I am looking for my keys, have you seen them?",
    exampleAr: "أنا أبحث عن مفاتيحي، هل رأيتها؟",
    category: "Common Phrasal Verbs",
    level: "A2",
    partOfSpeech: "Phrasal Verb",
    pronunciation: "/lʊk fɔːr/"
  },
  {
    word: "Give up",
    translation: "يستسلم / يقلع عن",
    definition: "To stop making an effort, or stop doing a regular habit.",
    definitionAr: "التوقف عن بذل الجهد أو الإقلاع عن عادة سيئة.",
    example: "Never give up learning English!",
    exampleAr: "لا تستسلم أبداً في تعلم اللغة الإنجليزية!",
    category: "Common Phrasal Verbs",
    level: "A2",
    partOfSpeech: "Phrasal Verb",
    pronunciation: "/ɡɪv ʌp/"
  },

  // IELTS Foundation Vocabulary (A2)
  {
    word: "Achieve",
    translation: "يحقق / ينجز",
    definition: "To successfully bring about or reach a goal by effort or skill.",
    definitionAr: "النجاح في الوصول إلى هدف معين عن طريق بذل الجهد أو المهارة.",
    example: "You can achieve high scores with consistent study.",
    exampleAr: "يمكنك تحقيق درجات عالية من خلال الدراسة المستمرة.",
    category: "IELTS Foundation Vocabulary",
    level: "A2",
    partOfSpeech: "Verb",
    pronunciation: "/əˈtʃiːv/"
  },
  {
    word: "Improve",
    translation: "يُحسّن / يتطور",
    definition: "To make or become better in quality or status.",
    definitionAr: "جعل الشيء أو حالته أفضل مما كان عليه.",
    example: "I want to improve my English listening skills.",
    exampleAr: "أريد تحسين مهارات الاستماع لدي في اللغة الإنجليزية.",
    category: "IELTS Foundation Vocabulary",
    level: "A2",
    partOfSpeech: "Verb",
    pronunciation: "/ɪmˈpruːv/"
  }
];
