import { Lesson } from "../types";

export const grammarLessons: Lesson[] = [
  // A1 Lessons
  {
    id: "a1-1",
    title: "The English Alphabet",
    titleAr: "الحروف الأبجدية الإنجليزية",
    category: "grammar",
    level: "A1",
    content: "The English Alphabet consists of 26 letters: 5 vowels (A, E, I, O, U) and 21 consonants. Understanding these is the basis of pronunciation and spelling.",
    contentAr: "تتكون الأبجدية الإنجليزية من 26 حرفاً: 5 حروف متحركة (A, E, I, O, U) و21 حرفاً ساكناً. فهم هذه الحروف هو أساس النطق والهجاء.",
    quiz: [
      {
        question: "How many vowels are in the English Alphabet?",
        options: ["21", "26", "5", "10"],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-2",
    title: "Numbers",
    titleAr: "الأرقام",
    category: "grammar",
    level: "A1",
    content: "Numbers are split into Cardinal (1, 2, 3...) for counting and Ordinal (first, second, third...) for order or rank.",
    contentAr: "تنقسم الأرقام إلى أرقام أساسية (1, 2, 3...) للعد وأرقام ترتيبية (الأول، الثاني، الثالث...) للترتيب والمراكز.",
    quiz: [
      {
        question: "Which of the following is an ordinal number?",
        options: ["One", "Third", "Three", "Five"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-3",
    title: "Subject Pronouns",
    titleAr: "ضمائر الفاعل",
    category: "grammar",
    level: "A1",
    content: "Subject pronouns replace nouns as subjects: I, you, he, she, it, we, they.",
    contentAr: "ضمائر الفاعل تحل محل الأسماء التي تقع فاعلاً: أنا، أنت، هو، هي، هو/هي لغير العاقل، نحن، هم.",
    quiz: [
      {
        question: "Select the subject pronoun for a group of people including yourself:",
        options: ["They", "We", "You", "He"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-4",
    title: "Verb “To Be”",
    titleAr: "فعل الكينونة (To Be)",
    category: "grammar",
    level: "A1",
    content: "The verb 'To Be' has three present forms: am (I), is (he, she, it), and are (we, you, they). Used to describe state, identity, or location.",
    contentAr: "فعل الكينونة له ثلاث صيغ في المضارع: am (أنا)، is (هو، هي، هو/هي لغير العاقل)، are (نحن، أنت، هم). يستخدم لوصف الحالة أو الهوية أو الموقع.",
    quiz: [
      {
        question: "She ____ a brilliant teacher.",
        options: ["am", "are", "is", "be"],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-5",
    title: "Sentence Formation",
    titleAr: "تكوين الجملة",
    category: "grammar",
    level: "A1",
    content: "A basic English sentence follows the Subject + Verb + Object (SVO) pattern. Example: 'I read books.'",
    contentAr: "تتبع الجملة الإنجليزية الأساسية نمط: فاعل + فعل + مفعول به (SVO). مثال: 'أنا أقرأ الكتب.'",
    quiz: [
      {
        question: "Which sentence is structured correctly?",
        options: ["Apples like I.", "I apples like.", "I like apples.", "Like I apples."],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-6",
    title: "Demonstrative Pronouns",
    titleAr: "أسماء الإشارة",
    category: "grammar",
    level: "A1",
    content: "Demonstrative pronouns indicate objects in space and time: this/these (near), that/those (far).",
    contentAr: "أسماء الإشارة تشير إلى الأشياء في المكان والزمان: هذا/هؤلاء (للقريب)، ذلك/أولئك (للبعيد).",
    quiz: [
      {
        question: "Use ____ for a single object that is far away:",
        options: ["This", "These", "Those", "That"],
        correctAnswer: 3
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-7",
    title: "Countable and Uncountable Nouns",
    titleAr: "الأسماء المعدودة وغير المعدودة",
    category: "grammar",
    level: "A1",
    content: "Countable nouns can be counted (e.g., apple, cat). Uncountable nouns cannot be counted individually (e.g., water, milk, advice) and take singular verbs.",
    contentAr: "الأسماء المعدودة يمكن عدها (مثل تفاحة، قطة). الأسماء غير المعدودة لا يمكن عدها بشكل فردي (مثل الماء، الحليب، النصيحة) وتأخذ أفعالاً مفردة.",
    quiz: [
      {
        question: "Which of the following is an uncountable noun?",
        options: ["Book", "Sugar", "Car", "Student"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-8",
    title: "Singular and Plural Nouns",
    titleAr: "الأسماء المفردة والجمع",
    category: "grammar",
    level: "A1",
    content: "Most nouns become plural by adding -s (book -> books). Nouns ending in -ch, -sh, -x, -s, -z add -es (bus -> buses). Some are irregular (man -> men).",
    contentAr: "معظم الأسماء تصبح جمعاً بإضافة -s (كتاب -> كتب). الأسماء المنتهية بـ -ch, -sh, -x, -s, -z يضاف إليها -es (حافلة -> حافلات). بعضها سماعي شاذ (رجل -> رجال).",
    quiz: [
      {
        question: "What is the plural of 'box'?",
        options: ["boxs", "boxes", "boxies", "boxen"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-9",
    title: "A / An / The",
    titleAr: "أدوات التنكير والتعريف",
    category: "grammar",
    level: "A1",
    content: "Use 'a' before consonant sounds (a book) and 'an' before vowel sounds (an hour, an apple). Use 'the' for specific objects already known to the listener.",
    contentAr: "تستخدم 'a' قبل الأصوات الساكنة (a book) و 'an' قبل الأصوات المتحركة (an hour, an apple). تستخدم 'the' للتعريف والتحديد لأشياء معروفة للمستمع.",
    quiz: [
      {
        question: "I want to buy ____ orange.",
        options: ["a", "an", "the", "no article"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-10",
    title: "Possessive Adjectives",
    titleAr: "صفات الملكية",
    category: "grammar",
    level: "A1",
    content: "Possessive adjectives show ownership and come before nouns: my, your, his, her, its, our, their.",
    contentAr: "تبين صفات الملكية الملكية وتأتي قبل الأسماء: لي، لك، له، لها، له/لها لغير العاقل، لنا، لهم.",
    quiz: [
      {
        question: "That is ____ car. (belonging to me)",
        options: ["mine", "my", "me", "I"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-11",
    title: "Object Pronouns",
    titleAr: "ضمائر المفعول به",
    category: "grammar",
    level: "A1",
    content: "Object pronouns receive the action of verbs or come after prepositions: me, you, him, her, it, us, them.",
    contentAr: "تتلقى ضمائر المفعول به تأثير الفعل أو تأتي بعد حروف الجر: ياء المتكلم، كاف الخطاب، هاء الغائب، إلخ.",
    quiz: [
      {
        question: "She called ____ yesterday to ask for help.",
        options: ["I", "my", "me", "mine"],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-12",
    title: "Reflexive Pronouns",
    titleAr: "الضمائر الانعكاسية",
    category: "grammar",
    level: "A1",
    content: "Reflexive pronouns are used when the subject and object are the same: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves.",
    contentAr: "تستخدم الضمائر الانعكاسية عندما يكون الفاعل والمفعول به هما نفس الشخص أو الشيء: نفسي، نفسك، نفسه، نفسها، أنفسنا، إلخ.",
    quiz: [
      {
        question: "He cut ____ while cooking.",
        options: ["him", "his", "himself", "he"],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-13",
    title: "WH Questions",
    titleAr: "أدوات الاستفهام",
    category: "grammar",
    level: "A1",
    content: "WH questions ask for specific information: Who (person), What (thing), Where (place), When (time), Why (reason), How (manner).",
    contentAr: "تطلب أسئلة الاستفهام معلومات محددة: من (للشخص)، ماذا (للشيء)، أين (للمكان)، متى (للوقت)، لماذا (للسبب)، كيف (للطريقة).",
    quiz: [
      {
        question: "____ is your office located?",
        options: ["What", "Where", "When", "Who"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-14",
    title: "Prepositions of Place",
    titleAr: "حروف جر المكان",
    category: "grammar",
    level: "A1",
    content: "Prepositions of place show position: in (inside), on (surface), at (point), under, next to, between, behind.",
    contentAr: "حروف جر المكان توضح موضع الأشياء: في (الداخل)، على (السطح)، عند (نقطة)، تحت، بجانب، بين، خلف.",
    quiz: [
      {
        question: "The book is sitting ____ the table.",
        options: ["in", "on", "at", "underneath"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-15",
    title: "Prepositions of Time",
    titleAr: "حروف جر الزمان",
    category: "grammar",
    level: "A1",
    content: "Prepositions of time specify moments: in (months, years, centuries), on (days, dates), at (specific times, clock).",
    contentAr: "حروف جر الزمان تحدد الأوقات: in (للشهور والسنوات وفصول السنة)، on (للأيام والتواريخ المحددة)، at (للساعات والوجبات والأوقات المحددة).",
    quiz: [
      {
        question: "Our class starts ____ 9:00 AM.",
        options: ["in", "on", "at", "during"],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-16",
    title: "Relative Clauses",
    titleAr: "جمل الوصل",
    category: "grammar",
    level: "A1",
    content: "Relative clauses give information about nouns using relative pronouns: who (people), which (things), that (both), where (places).",
    contentAr: "تعطي جمل الوصل معلومات عن الأسماء باستخدام أسماء الموصول: who (للأشخاص)، which (للأشياء)، that (للاثنين)، where (للأماكن).",
    quiz: [
      {
        question: "This is the man ____ helped me yesterday.",
        options: ["which", "who", "where", "whom"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-17",
    title: "Present Simple",
    titleAr: "المضارع البسيط",
    category: "grammar",
    level: "A1",
    content: "Present Simple is used for routines, permanent facts, and habits. Add -s/-es for third person singular.",
    contentAr: "يستخدم المضارع البسيط للروتين اليومي، الحقائق الدائمة والعادات والتقاليد. يتم إضافة -s/-es مع المفرد الغائب.",
    quiz: [
      {
        question: "He ____ soccer every weekend.",
        options: ["plays", "play", "playing", "played"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-18",
    title: "Adding S / ES / IES",
    titleAr: "قواعد إضافة S / ES / IES للأفعال",
    category: "grammar",
    level: "A1",
    content: "Rules for third-person singular verbs in present simple: Add -es to verbs ending in -ch, -sh, -x, -ss, -o (watch -> watches). If verb ends in consonant + y, drop y and add -ies (study -> studies). Otherwise, add -s.",
    contentAr: "قواعد تصريف أفعال المفرد في المضارع البسيط: يضاف -es للأفعال المنتهية بـ -ch, -sh, -x, -ss, -o. وإذا كان ينتهي بـ حرف ساكن + y، تحذف الـ y ونضيف -ies. وفي بقية الأفعال نضيف -s فقط.",
    quiz: [
      {
        question: "What is the correct third-person form of 'fly'?",
        options: ["flys", "flies", "flyes", "flying"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-19",
    title: "Imperatives",
    titleAr: "صيغة الأمر",
    category: "grammar",
    level: "A1",
    content: "Imperative sentences give orders, instructions, or warnings using the base verb without a subject. Negative uses 'Don't'. Example: 'Close the door!' or 'Don't run!'",
    contentAr: "تعطي جمل الأمر تعليمات، أو تحذيرات، أو طلبات وتصاغ بالفعل في المصدر مباشرة بدون فاعل. ويستخدم Don't للنهي والنفي. مثال: 'أغلق الباب!'",
    quiz: [
      {
        question: "Choose the correct negative imperative sentence:",
        options: ["No run here.", "Don't run here.", "Not run here.", "You don't run."],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-20",
    title: "Can",
    titleAr: "الفعل المساعد Can (القدرة والاستطاعة)",
    category: "grammar",
    level: "A1",
    content: "The modal verb 'Can' expresses ability or permission. It is followed by the bare infinitive. Negative is 'cannot' or 'can't'.",
    contentAr: "يعبر الفعل الناقص 'Can' عن القدرة أو الإذن. يتبعه الفعل في المصدر مباشرة بدون to. النفي هو can't.",
    quiz: [
      {
        question: "She can ____ four languages fluently.",
        options: ["speaks", "speaking", "speak", "to speak"],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-21",
    title: "Must",
    titleAr: "الفعل المساعد Must (الالتزام والضرورة القصوى)",
    category: "grammar",
    level: "A1",
    content: "'Must' expresses a strong obligation or rule. Mustn't expresses prohibition (not allowed to). Followed by bare infinitive.",
    contentAr: "يعبر 'Must' عن الالتزام القوي أو القانون. وتعبر 'Mustn't' عن المنع والتحريم الكامل. يتبعه فعل مصدر.",
    quiz: [
      {
        question: "You ____ smoke inside the school building. It is strictly forbidden.",
        options: ["must", "mustn't", "can", "should"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-22",
    title: "Should",
    titleAr: "الفعل المساعد Should (النصيحة)",
    category: "grammar",
    level: "A1",
    content: "'Should' is used to give advice, suggestions, or recommendations. Followed by bare infinitive. Negative is 'shouldn't'.",
    contentAr: "يستخدم 'Should' لتقديم النصيحة، الاقتراحات والتوصيات. يتبعه فعل في المصدر. النفي هو shouldn't.",
    quiz: [
      {
        question: "If you feel sick, you ____ see a doctor.",
        options: ["should", "shouldn't", "can't", "mustn't"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-23",
    title: "Comparatives and Superlatives",
    titleAr: "صيغ المقارنة والتفضيل",
    category: "grammar",
    level: "A1",
    content: "Comparatives compare two things: shorter adjectives add -er (taller), longer use 'more' (more beautiful). Superlatives compare three or more: add -est (tallest) or 'most' (most beautiful).",
    contentAr: "المقارنة تقارن بين شيئين: الصفات القصيرة يضاف إليها -er، والصفات الطويلة يسبقها more. التفضيل يقارن بين ثلاثة أو أكثر: نضيف -est أو يسبقها most.",
    quiz: [
      {
        question: "Mount Everest is the ____ mountain in the world.",
        options: ["high", "higher", "highest", "most high"],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-24",
    title: "Telling Time",
    titleAr: "قول الوقت والتوقيت",
    category: "grammar",
    level: "A1",
    content: "Express time using 'past' and 'to'. E.g., 'quarter past five' (5:15) or 'ten to six' (5:50). Use 'half past' for 30 minutes and 'o'clock' for exact hours.",
    contentAr: "التعبير عن الوقت باستخدام 'past' (و) و 'to' (إلا). مثال: 'الخامسة والربع' أو 'العاشرة إلا خمس دقائق'. ونستخدم 'half past' للنصف.",
    quiz: [
      {
        question: "What is another way to say 4:30?",
        options: ["quarter past four", "half past four", "four to thirty", "half to five"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a1-25",
    title: "Past Simple of Verb To Be",
    titleAr: "الماضي البسيط لفعل الكينونة (Was / Were)",
    category: "grammar",
    level: "A1",
    content: "The past of 'am/is' is 'was' (I, he, she, it). The past of 'are' is 'were' (you, we, they). Used to indicate past status.",
    contentAr: "الماضي من 'am/is' هو 'was'، والماضي من 'are' هو 'were'. يستخدم للتعبير عن الحالة والهوية في الماضي.",
    quiz: [
      {
        question: "They ____ at home yesterday evening.",
        options: ["was", "were", "are", "been"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },

  // A2 Lessons
  {
    id: "a2-1",
    title: "ED and ING Adjectives",
    titleAr: "الصفات المنتهية بـ ED و ING",
    category: "grammar",
    level: "A2",
    content: "Adjectives ending in -ed describe feelings (I am bored). Adjectives ending in -ing describe the cause of the feeling (The class is boring).",
    contentAr: "الصفات المنتهية بـ -ed تصف المشاعر الداخلية للشخص (أنا شاعر بالملل). الصفات المنتهية بـ -ing تصف مسبب هذا الشعور (الدرس ممل).",
    quiz: [
      {
        question: "I was extremely ____ when I saw the movie.",
        options: ["excited", "exciting", "excite", "excitement"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-2",
    title: "Present Continuous",
    titleAr: "المضارع المستمر",
    category: "grammar",
    level: "A2",
    content: "Present Continuous represents actions happening right now or temporary states. Form: Subject + am/is/are + verb-ing.",
    contentAr: "يمثل المضارع المستمر الأفعال التي تحدث الآن في هذه اللحظة أو مواقف مؤقتة. الصيغة: فاعل + am/is/are + فعل ينتهي بـ ing.",
    quiz: [
      {
        question: "Listen! The baby ____ right now.",
        options: ["cries", "crying", "is crying", "cry"],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-3",
    title: "Possessive ’S",
    titleAr: "S الملكية",
    category: "grammar",
    level: "A2",
    content: "Add 's to singular nouns to show possession (Sarah's book). For plural nouns ending in -s, just add an apostrophe (the boys' school).",
    contentAr: "يضاف 's للأسماء المفردة للتعبير عن الملكية. وللأسماء الجمع المنتهية بـ s يضاف فقط الفاصلة العليا (') بدون s إضافية.",
    quiz: [
      {
        question: "Whose laptop is this? It's ____.",
        options: ["John's", "Johns'", "Johns", "John"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-4",
    title: "Have Got",
    titleAr: "الملكية باستخدام Have Got",
    category: "grammar",
    level: "A2",
    content: "'Have got' is common in British English to express possession, relationships, or illnesses. I/You/We/They have got; He/She/It has got.",
    contentAr: "تستخدم 'Have got' للتعبير عن الملكية أو العلاقات أو الأمراض. وتستخدم بشكل شائع في الإنجليزية البريطانية.",
    quiz: [
      {
        question: "She ____ a blue car.",
        options: ["have got", "has got", "got", "having got"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-5",
    title: "Frequency Adverbs",
    titleAr: "ظروف التكرار",
    category: "grammar",
    level: "A2",
    content: "Frequency adverbs indicate how often something happens: always, usually, often, sometimes, rarely, never. They go before main verbs but after verb 'to be'.",
    contentAr: "تبين ظروف التكرار عدد مرات حدوث الشيء: دائماً، عادة، غالباً، أحياناً، نادراً، أبداً. تأتي قبل الأفعال الرئيسية ولكن بعد فعل الكينونة.",
    quiz: [
      {
        question: "Which of the following sentences is in the correct order?",
        options: ["He is late always.", "He late always is.", "He always is late.", "He is always late."],
        correctAnswer: 3
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-6",
    title: "Adverbs of Manner",
    titleAr: "ظروف الطريقة والأسلوب",
    category: "grammar",
    level: "A2",
    content: "Adverbs of manner describe how an action is done. Formed by adding -ly to adjectives (quick -> quickly). Some are irregular (good -> well, fast -> fast).",
    contentAr: "تصف ظروف الطريقة كيفية أداء الفعل. تصاغ بإضافة -ly للصفات. بعضها شاذ لا يتغير أو يتغير كلياً.",
    quiz: [
      {
        question: "She sings really ____.",
        options: ["good", "well", "goodly", "beautiful"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-7",
    title: "Irregular Verbs",
    titleAr: "الأفعال الشاذة غير القياسية",
    category: "grammar",
    level: "A2",
    content: "Irregular verbs do not add -ed in past tense. They change completely (go -> went, buy -> bought, make -> made).",
    contentAr: "الأفعال الشاذة لا ينطبق عليها قاعدة إضافة -ed في الماضي البسيط. بل تتغير تماماً ويجب حفظها.",
    quiz: [
      {
        question: "What is the past tense form of 'write'?",
        options: ["writed", "wrote", "written", "writes"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-8",
    title: "Past Simple",
    titleAr: "الماضي البسيط",
    category: "grammar",
    level: "A2",
    content: "Used to describe completed actions in the past. Regular verbs add -ed, while irregular verbs change form. Negative is 'didn't + bare verb'.",
    contentAr: "يستخدم لوصف أفعال اكتملت وانتهت في الماضي. الأفعال القياسية ينتهي تصريفها بـ -ed بينما الشاذة تتغير صيغتها. النفي هو didn't + مصدر الفعل.",
    quiz: [
      {
        question: "They ____ a new house last month.",
        options: ["buy", "bought", "buys", "buying"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-9",
    title: "Doubling the Last Letter Before ED",
    titleAr: "مضاعفة الحرف الأخير قبل إضافة ED",
    category: "grammar",
    level: "A2",
    content: "If a regular verb ends in Consonant-Vowel-Consonant (CVC) with stress on that syllable, double the final consonant before adding -ed (stop -> stopped, plan -> planned).",
    contentAr: "إذا كان الفعل القياسي ينتهي بـ ساكن ثم متحرك ثم ساكن (CVC) وكانت النبرة على هذا المقطع، نضاعف الحرف الأخير قبل إضافة -ed.",
    quiz: [
      {
        question: "What is the correct spelling of the past form of 'commit'?",
        options: ["commited", "committed", "comited", "commit"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-10",
    title: "Future Simple",
    titleAr: "المستقبل البسيط (Will / Be going to)",
    category: "grammar",
    level: "A2",
    content: "Use 'will' for instant decisions and predictions. Use 'be going to' for planned actions and intentions. Example: 'I will help you.' vs. 'I am going to visit my family.'",
    contentAr: "نستخدم 'will' للقرارات السريعة والوعود والتنبؤ العام. ونستخدم 'be going to' للخطط والنيات والقرارات المدروسة مسبقاً.",
    quiz: [
      {
        question: "I have decided that I ____ learn Spanish next term.",
        options: ["will", "am going to", "would", "shall"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-11",
    title: "The Same As",
    titleAr: "التشابه والتساوي (The Same As / Similar To)",
    category: "grammar",
    level: "A2",
    content: "Use 'the same as' to indicate identical items or quality. E.g., 'My bag is the same as yours.'",
    contentAr: "يستخدم التعبير 'the same as' لبيان المطابقة التامة والتطابق الشامل بين شيئين في صفة أو جودة.",
    quiz: [
      {
        question: "Your opinion is the same ____ mine.",
        options: ["as", "with", "like", "to"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-12",
    title: "Enough and Too",
    titleAr: "القدر الكافي والزيادة المفرطة (Enough / Too)",
    category: "grammar",
    level: "A2",
    content: "'Too' indicates more than necessary and goes before adjectives (too cold). 'Enough' indicates sufficient amount and goes after adjectives (warm enough) but before nouns (enough water).",
    contentAr: "تأتي 'Too' قبل الصفة لتدل على الإفراط والزيادة السلبية. وتأتي 'Enough' لتفيد الكفاية، وتوضع بعد الصفة ولكن قبل الاسم.",
    quiz: [
      {
        question: "This coffee is ____ hot to drink.",
        options: ["enough", "too", "very much", "many"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-13",
    title: "Zero Conditional",
    titleAr: "الحالة الصفرية للشرط",
    category: "grammar",
    level: "A2",
    content: "Zero conditional represents facts and absolute truths. Form: If + Present Simple, Present Simple. Example: 'If you heat ice, it melts.'",
    contentAr: "تعبر الحالة الشرطية الصفرية عن الحقائق الثابتة والقوانين العلمية. صيغتها: If + مضارع بسيط، مضارع بسيط.",
    quiz: [
      {
        question: "If you boil water, it ____ steam.",
        options: ["becomes", "became", "becoming", "will become"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-14",
    title: "First Conditional",
    titleAr: "الحالة الشرطية الأولى",
    category: "grammar",
    level: "A2",
    content: "First conditional is used for real or highly probable future situations. Form: If + Present Simple, Will + Bare Verb. Example: 'If it rains, we will stay home.'",
    contentAr: "تستخدم الحالة الشرطية الأولى للتعبير عن مواقف مستقبلية حقيقية ومحتملة الوقوع جداً. صيغتها: If + مضارع بسيط، will + مصدر الفعل.",
    quiz: [
      {
        question: "If you study hard, you ____ pass the test.",
        options: ["pass", "will pass", "passed", "passes"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-15",
    title: "May / Might",
    titleAr: "الاحتمالية باستخدام May و Might",
    category: "grammar",
    level: "A2",
    content: "'May' and 'Might' express possibility in the present or future. 'May' usually represents a higher probability than 'might'. Followed by bare infinitive.",
    contentAr: "يعبر الفعلان 'May' و 'Might' عن الاحتمالية في الحاضر أو المستقبل. 'May' تشير عموماً إلى احتمال أكبر قليلاً من 'Might'.",
    quiz: [
      {
        question: "Take an umbrella. It ____ rain later.",
        options: ["must", "might", "can't", "shouldn't"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-16",
    title: "Shall",
    titleAr: "الفعل المساعد Shall",
    category: "grammar",
    level: "A2",
    content: "'Shall' is used for suggestions, offers, or requests for advice, mostly with 'I' or 'We'. Example: 'Shall we go?'",
    contentAr: "يستخدم 'Shall' لتقديم العروض، الاقتراحات أو طلب النصيحة، وغالباً ما يكون فاعله الضمير I أو We.",
    quiz: [
      {
        question: "____ I carry your bags for you?",
        options: ["Will", "Shall", "Would", "Must"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-17",
    title: "Need To",
    titleAr: "الحاجة والاضطرار باستخدام Need To",
    category: "grammar",
    level: "A2",
    content: "'Need to' expresses a necessity or required action. Form: Subject + need to + verb. Negative: 'don't/doesn't need to'.",
    contentAr: "يعبر التعبير 'Need to' عن الحاجة والضرورة للقيام بعمل ما. النفي هو don't/doesn't need to.",
    quiz: [
      {
        question: "You ____ buy tickets; entrance is completely free today.",
        options: ["need to", "must", "don't need to", "need"],
        correctAnswer: 2
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "a2-18",
    title: "Have To",
    titleAr: "الاضطرار والالتزام الخارجي Have To",
    category: "grammar",
    level: "A2",
    content: "'Have to' expresses external obligation (imposed by rules, laws, or situation). I/You/We/They have to; He/She/It has to.",
    contentAr: "يعبر التعبير 'Have to' عن الالتزام المفروض خارجياً بقوة القوانين أو الظروف. النفي هو don't/doesn't have to ويعني عدم الاضطرار.",
    quiz: [
      {
        question: "Teachers ____ arrive before 8:00 AM every day.",
        options: ["has to", "have to", "having to", "has"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },

  // B1 Lessons
  {
    id: "b1-1",
    title: "Verbs Followed by Gerunds or Base Form",
    titleAr: "الأفعال المتبوعة بـ Gerund أو المصدر",
    category: "grammar",
    level: "B1",
    content: "Some verbs are followed by gerund (-ing) like enjoy, avoid, suggest. Others are followed by infinitive (to + verb) like decide, plan, hope.",
    contentAr: "بعض الأفعال في اللغة الإنجليزية يتبعها اسم الفعل Gerund (ينتهي بـ ing) مثل enjoy، وبعضها يتبعها مصدر كامل (to + verb) مثل decide.",
    quiz: [
      {
        question: "She decided ____ a new laptop.",
        options: ["buying", "to buy", "buy", "bought"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-2",
    title: "Relative Clauses B1",
    titleAr: "جمل الوصل المتقدمة (Relative Clauses)",
    category: "grammar",
    level: "B1",
    content: "Relative clauses define or give extra info. Defining clauses are essential for meaning, while non-defining clauses give extra info enclosed in commas.",
    contentAr: "تحدد جمل الوصل أو تعطي معلومات إضافية. جمل الوصل المحددة تكون ضرورية لمعنى الجملة، بينما غير المحددة تعطي معلومات إضافية وتوضع بين فاصلتين.",
    quiz: [
      {
        question: "The museum, ____ was designed by a famous architect, opened yesterday.",
        options: ["that", "which", "where", "whom"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-3",
    title: "Quantifiers",
    titleAr: "محددات الكمية",
    category: "grammar",
    level: "B1",
    content: "Quantifiers express amounts: few/little (not enough), a few/a little (enough), much/many (large quantity), a lot of (both countable/uncountable).",
    contentAr: "تبين محددات الكمية مقدار الأشياء: few/little (غير كافٍ)، a few/a little (كافٍ)، many/much (كمية كبيرة)، a lot of (للاثنين).",
    quiz: [
      {
        question: "I have very ____ time, so please hurry up.",
        options: ["few", "little", "many", "a lot"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-4",
    title: "Would",
    titleAr: "استخدامات Would المتقدمة",
    category: "grammar",
    level: "B1",
    content: "'Would' is used for polite offers (would you like...), past habits (when I was young, I would play outside), and hypothetical situations.",
    contentAr: "يستخدم الفعل 'Would' لتقديم العروض والطلبات المهذبة، وللتحدث عن عادات تكررت في الماضي، أو لافتراض مواقف خيالية غير حقيقية.",
    quiz: [
      {
        question: "When we were kids, we ____ go fishing every Sunday.",
        options: ["will", "would", "shall", "must"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-5",
    title: "Past Continuous",
    titleAr: "الماضي المستمر",
    category: "grammar",
    level: "B1",
    content: "Past continuous describes an action in progress at a specific time in the past. Often interrupted by past simple. Form: was/were + verb-ing.",
    contentAr: "يصف الماضي المستمر فعلاً كان مستمراً في لحظة معينة في الماضي. وغالباً ما يقطعه حدث آخر في الماضي البسيط. صيغته: was/were + verb-ing.",
    quiz: [
      {
        question: "I ____ a shower when the phone rang.",
        options: ["was having", "had", "have", "am having"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-6",
    title: "Future Continuous",
    titleAr: "المستقبل المستمر",
    category: "grammar",
    level: "B1",
    content: "Future continuous represents an action in progress at a specific point in the future. Form: Will be + Verb-ing.",
    contentAr: "يمثل المستقبل المستمر فعلاً سيكون مستمراً في الحدوث في وقت محدد بالمستقبل. الصيغة: Will be + Verb-ing.",
    quiz: [
      {
        question: "This time tomorrow, I ____ on a beach in Spain.",
        options: ["will sit", "will be sitting", "sit", "am sitting"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-7",
    title: "Present Perfect",
    titleAr: "المضارع التام",
    category: "grammar",
    level: "B1",
    content: "Present Perfect links past to present (experiences, unfinished actions, or past actions with present result). Form: has/have + past participle.",
    contentAr: "يربط المضارع التام الماضي بالحاضر (تجارب الحياة، أفعال لم تنتهِ بعد، أو أفعال حدثت بالماضي ونتيجتها تهمنا الآن). الصيغة: has/have + التصريف الثالث للفعل.",
    quiz: [
      {
        question: "I ____ that movie three times already.",
        options: ["saw", "have seen", "see", "am seeing"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-8",
    title: "Used To / Get Used To / Would",
    titleAr: "الاعتياد على شيء (Used to / Get used to / Would)",
    category: "grammar",
    level: "B1",
    content: "'Used to' describes past habits/states that no longer exist. 'Get used to' means the process of becoming familiar with something new. 'Would' only describes repeated past actions, not past states.",
    contentAr: "تعبر 'Used to' عن عادات أو حالات قديمة لم تعد موجودة. وتعبر 'Get used to' عن التكيف والاعتياد التدريجي على شيء جديد ومختلف.",
    quiz: [
      {
        question: "I slowly got used to ____ on the left side of the road.",
        options: ["drive", "driving", "drove", "drives"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-9",
    title: "Passive Voice (Past Simple)",
    titleAr: "المبني للمجهول في الماضي البسيط",
    category: "grammar",
    level: "B1",
    content: "Used when the object is more important than the agent in the past. Form: Object + was/were + past participle.",
    contentAr: "يستخدم عندما يكون المفعول به أكثر أهمية من فاعل الحدث في الماضي. الصيغة: المفعول به + was/were + التصريف الثالث للفعل.",
    quiz: [
      {
        question: "This school ____ built in 1995.",
        options: ["was", "were", "is", "been"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-10",
    title: "Passive Voice (Present Simple)",
    titleAr: "المبني للمجهول في المضارع البسيط",
    category: "grammar",
    level: "B1",
    content: "Used for general facts, processes, or actions in present. Form: Object + am/is/are + past participle.",
    contentAr: "يستخدم للحقائق العامة، العمليات الصناعية أو الأفعال الدورية في المضارع البسيط. الصيغة: المفعول به + am/is/are + التصريف الثالث.",
    quiz: [
      {
        question: "Spanish ____ spoken in many Latin American countries.",
        options: ["is", "are", "was", "has"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b1-11",
    title: "Passive Voice (Present Continuous)",
    titleAr: "المبني للمجهول في المضارع المستمر",
    category: "grammar",
    level: "B1",
    content: "Used for actions in progress right now where agent is omitted/unimportant. Form: Object + am/is/are + being + past participle.",
    contentAr: "يستخدم للأحداث المستمرة حالياً مع إغفال الفاعل لعدم أهميته أو لجهله. الصيغة: المفعول به + am/is/are + being + التصريف الثالث.",
    quiz: [
      {
        question: "My car ____ repaired at the garage right now.",
        options: ["is being", "is", "was being", "has been"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },

  // B2 Lessons
  {
    id: "b2-1",
    title: "Passive Voice (Past Continuous)",
    titleAr: "المبني للمجهول في الماضي المستمر",
    category: "grammar",
    level: "B2",
    content: "Expresses a past action in progress that was happening to the subject. Form: Object + was/were + being + past participle.",
    contentAr: "يعبر عن فعل كان مستمراً في الماضي ويقع تأثيره على المفعول به. الصيغة: المفعول به + was/were + being + التصريف الثالث للفعل.",
    quiz: [
      {
        question: "When I arrived, the house ____ painted.",
        options: ["was being", "is being", "was", "had been"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-2",
    title: "Passive Voice (Present Perfect)",
    titleAr: "المبني للمجهول في المضارع التام",
    category: "grammar",
    level: "B2",
    content: "Focuses on the present result of a completed passive action. Form: Object + have/has + been + past participle.",
    contentAr: "يركز على النتيجة الحالية لفعل مبني للمجهول تم واكتمل. الصيغة: المفعول به + have/has + been + التصريف الثالث.",
    quiz: [
      {
        question: "All the reports ____ completed already.",
        options: ["have been", "has been", "were being", "are"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-3",
    title: "Passive Voice (Past Perfect)",
    titleAr: "المبني للمجهول في الماضي التام",
    category: "grammar",
    level: "B2",
    content: "Indicates a passive action completed before another past action. Form: Object + had + been + past participle.",
    contentAr: "يبين أن الفعل المبني للمجهول قد اكتمل بالكامل قبل وقوع حدث آخر في الماضي. الصيغة: المفعول به + had + been + التصريف الثالث.",
    quiz: [
      {
        question: "The documents ____ signed before the manager left.",
        options: ["had been", "have been", "was", "were being"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-4",
    title: "Passive Voice (Future Perfect)",
    titleAr: "المبني للمجهول في المستقبل التام",
    category: "grammar",
    level: "B2",
    content: "Indicates a passive action that will have been completed by a specific future point. Form: Object + will + have + been + past participle.",
    contentAr: "يوضح أن فعلاً مبنياً للمجهول سيكون قد اكتمل تماماً بحلول نقطة زمنية محددة في المستقبل. الصيغة: المفعول به + will have been + التصريف الثالث.",
    quiz: [
      {
        question: "The new bridge ____ finished by next year.",
        options: ["will have been", "will be", "is going to be", "has been"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-5",
    title: "Adverbs of Degree",
    titleAr: "ظروف الدرجة والشدة",
    category: "grammar",
    level: "B2",
    content: "Adverbs of degree show the intensity of an adjective, adverb, or verb. E.g., absolutely, completely, extremely, highly, slightly, quite.",
    contentAr: "تبين ظروف الدرجة قوة وشدة الصفة أو الظرف أو الفعل. مثال: absolutely (مطلقاً)، extremely (للغاية)، slightly (قليلاً).",
    quiz: [
      {
        question: "His presentation was ____ impressive; everyone stood up to applaud.",
        options: ["highly", "slightly", "somewhat", "not"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-6",
    title: "Certainty Adverbs",
    titleAr: "ظروف اليقين والتأكيد",
    category: "grammar",
    level: "B2",
    content: "Certainty adverbs show how sure we are about an event: definitely, certainly, probably, possibly, perhaps.",
    contentAr: "تعبر ظروف اليقين عن مدى تأكدنا وثقتنا بحدوث الأمر: definitely (بكل تأكيد)، probably (على الأرجح)، possibly (ممكن).",
    quiz: [
      {
        question: "She will ____ pass the exam; she got 100% in all mock tests.",
        options: ["definitely", "possibly", "perhaps", "hardly"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-7",
    title: "Second Conditional",
    titleAr: "الحالة الشرطية الثانية",
    category: "grammar",
    level: "B2",
    content: "Used for hypothetical, unreal, or imaginary present/future situations. Form: If + Past Simple, Would + Bare Verb. Example: 'If I won the lottery, I would buy a yacht.'",
    contentAr: "تستخدم للمواقف الافتراضية، غير الحقيقية أو الخيالية في الوقت الحالي أو المستقبل. الصيغة: If + ماضي بسيط، would + المصدر.",
    quiz: [
      {
        question: "If I ____ more money, I would travel around the world.",
        options: ["have", "had", "would have", "had had"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-8",
    title: "Third Conditional",
    titleAr: "الحالة الشرطية الثالثة",
    category: "grammar",
    level: "B2",
    content: "Used for hypothetical past situations and regrets. Form: If + Past Perfect, Would have + Past Participle. Example: 'If I had studied, I would have passed.'",
    contentAr: "تستخدم للتحدث عن مواقف خيالية وافتراضية تماماً في الماضي والندم عليها. الصيغة: If + ماضي تام، would have + تصريف ثالث.",
    quiz: [
      {
        question: "If she ____ earlier, she wouldn't have missed the flight.",
        options: ["left", "had left", "has left", "would leave"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-9",
    title: "Must Have",
    titleAr: "الاستنتاج اليقيني في الماضي (Must Have)",
    category: "grammar",
    level: "B2",
    content: "Used to make a near-certain past deduction. Meaning: 'I am sure that did happen.' Form: Must + have + past participle.",
    contentAr: "يستخدم للاستنتاج شبه المؤكد بالماضي (أنا متأكد أن هذا حدث). الصيغة: Must + have + التصريف الثالث.",
    quiz: [
      {
        question: "The ground is very wet. It ____ rained last night.",
        options: ["must have", "should have", "might", "can't have"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-10",
    title: "Should Have",
    titleAr: "لوم الذات والندم بالماضي (Should Have)",
    category: "grammar",
    level: "B2",
    content: "Expresses regret or criticism about a past action that didn't happen as desired. Form: Should + have + past participle.",
    contentAr: "يعبر عن الندم أو النقد لشيء كان ينبغي القيام به في الماضي ولكنه لم يحدث. الصيغة: Should + have + تصريف ثالث.",
    quiz: [
      {
        question: "I failed the test. I ____ studied harder.",
        options: ["should have", "must have", "could", "would have"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-11",
    title: "May / Might Have",
    titleAr: "الاحتمالية في الماضي (May / Might Have)",
    category: "grammar",
    level: "B2",
    content: "Expresses a possibility about a past event. Form: May/Might + have + past participle.",
    contentAr: "يعبر عن احتمال ضعيف أو متوسط لوقوع حدث ما بالماضي. الصيغة: May/Might + have + التصريف الثالث.",
    quiz: [
      {
        question: "I can't find my keys. I ____ left them in the car.",
        options: ["might have", "should have", "must", "can't"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-12",
    title: "Could Have",
    titleAr: "القدرة الضائعة بالماضي (Could Have)",
    category: "grammar",
    level: "B2",
    content: "Indicates that someone had the ability or opportunity to do something in past, but didn't do it. Form: Could + have + past participle.",
    contentAr: "يبين أن الشخص كان لديه القدرة والفرصة للقيام بشيء بالماضي، ولكنه اختار ألا يفعله. الصيغة: Could + have + تصريف ثالث.",
    quiz: [
      {
        question: "You ____ stayed with us! Why did you pay for a hotel?",
        options: ["could have", "must have", "should", "would"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-13",
    title: "Would Have",
    titleAr: "الافتراض المشروط بالماضي (Would Have)",
    category: "grammar",
    level: "B2",
    content: "Expresses intention to do something in the past that was prevented. Form: Would + have + past participle.",
    contentAr: "يعبر عن رغبة ونيّة للقيام بأمر ما في الماضي لولا وجود مانع حال دون ذلك. الصيغة: Would + have + تصريف ثالث.",
    quiz: [
      {
        question: "I ____ called you, but I didn't have my phone on me.",
        options: ["would have", "could", "should", "must have"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-14",
    title: "Wish",
    titleAr: "التمني والندم باستخدام Wish / If only",
    category: "grammar",
    level: "B2",
    content: "Use 'wish + past simple' to regret present situation. Use 'wish + past perfect' to regret past event. Use 'wish + would' to complain about behavior.",
    contentAr: "تستخدم 'wish + ماضي بسيط' للتمني بالوقت الحالي وعكس الواقع. وتستخدم 'wish + ماضي تام' للندم على الماضي.",
    quiz: [
      {
        question: "I wish I ____ more Spanish when I was living in Madrid.",
        options: ["spoke", "had spoken", "speak", "would speak"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-15",
    title: "Mixed Conditionals",
    titleAr: "الحالات الشرطية المختلطة (Mixed Conditionals)",
    category: "grammar",
    level: "B2",
    content: "Mixed conditionals link a hypothetical past situation to a present result (or vice versa). E.g., 'If I had studied medicine, I would be a doctor now.'",
    contentAr: "تربط الحالة الشرطية المختلطة فرضية بالماضي وتأثيرها بالحاضر (أو العكس). مثال: 'لو أني درست الطب في الماضي، لكنت طبيباً الآن'.",
    quiz: [
      {
        question: "If I ____ born rich, I wouldn't have to work so hard today.",
        options: ["was", "had been", "were", "would be"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "b2-16",
    title: "Reported Speech",
    titleAr: "الكلام المنقول غير المباشر (Reported Speech)",
    category: "grammar",
    level: "B2",
    content: "When reporting what someone said, shift tenses back: present simple -> past simple, present continuous -> past continuous, will -> would, etc.",
    contentAr: "عند نقل كلام قيل، نرجع بالأزمنة خطوة للماضي: من مضارع بسيط لماضي بسيط، ومن مستمر لماضي مستمر، ومن will إلى would.",
    quiz: [
      {
        question: "She said, 'I am working.' reported as: She said that she ____.",
        options: ["is working", "was working", "has worked", "worked"],
        correctAnswer: 1
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },

  // C1 Lessons
  {
    id: "c1-1",
    title: "Passive Voice (Present Perfect Continuous)",
    titleAr: "المبني للمجهول في المضارع التام المستمر",
    category: "grammar",
    level: "C1",
    content: "Rare but grammatically possible. Highlights ongoing duration of a passive action from past up to now. Form: Object + have/has + been + being + past participle.",
    contentAr: "صيغة نادرة لكنها صحيحة نحوياً. تسلط الضوء على استمرارية فعل مبني للمجهول بدأ بالماضي ومستمر حتى الآن. الصيغة: المفعول به + have/has been being + التصريف الثالث.",
    quiz: [
      {
        question: "Choose the correct present perfect continuous passive sentence:",
        options: [
          "The house has been being renovated for months.",
          "The house is being renovated.",
          "The house had been renovating.",
          "The house was being renovated."
        ],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "c1-2",
    title: "Passive Voice (Past Perfect Continuous)",
    titleAr: "المبني للمجهول في الماضي التام المستمر",
    category: "grammar",
    level: "C1",
    content: "Represents a continuous passive action that was happening prior to another past moment. Form: Object + had + been + being + past participle.",
    contentAr: "يمثل حدثاً مستمراً مبنياً للمجهول كان جارياً ومستمراً قبل وقوع حدث آخر في الماضي. الصيغة: المفعول به + had been being + التصريف الثالث.",
    quiz: [
      {
        question: "Select the past perfect continuous passive structure:",
        options: [
          "The road had been being repaired when the storm hit.",
          "The road has been repairing.",
          "The road had been repaired.",
          "The road was being repaired."
        ],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "c1-3",
    title: "Passive Voice (Future Perfect Continuous)",
    titleAr: "المبني للمجهول في المستقبل التام المستمر",
    category: "grammar",
    level: "C1",
    content: "Extremely complex tense indicating passive action that will have been continuously occurring up to a future point. Form: Object + will + have + been + being + past participle.",
    contentAr: "صيغة معقدة للغاية تفيد بأن حدثاً مبنياً للمجهول سيكون مستمراً في الوقوع حتى نقطة في المستقبل. الصيغة: المفعول به + will have been being + التصريف الثالث.",
    quiz: [
      {
        question: "By next Tuesday, the draft ____ review by the board for a full month.",
        options: [
          "will have been being reviewed",
          "will be reviewed",
          "has been being reviewed",
          "will have been reviewing"
        ],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "c1-4",
    title: "Future Perfect Continuous",
    titleAr: "المستقبل التام المستمر",
    category: "grammar",
    level: "C1",
    content: "Shows the duration of an action up to a certain point in the future. Form: Will + have + been + verb-ing. Example: 'By 2027, I will have been learning English for five years.'",
    contentAr: "يوضح مدة استمرارية حدث ما قبل نقطة زمنية محددة في المستقبل. الصيغة: Will have been + verb-ing.",
    quiz: [
      {
        question: "By next winter, we ____ here for a decade.",
        options: ["will have been living", "will be living", "will live", "have been living"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "c1-5",
    title: "Past Perfect Continuous",
    titleAr: "الماضي التام المستمر",
    category: "grammar",
    level: "C1",
    content: "Represents an ongoing past action that happened before another past action. Form: Had + been + verb-ing.",
    contentAr: "يمثل حدثاً كان مستمراً بالماضي وانتهى قبل وقوع حدث آخر بالماضي. الصيغة: Had + been + verb-ing.",
    quiz: [
      {
        question: "She was exhausted because she ____ for hours.",
        options: ["had been working", "has been working", "was working", "had worked"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "c1-6",
    title: "Present Perfect Continuous",
    titleAr: "المضارع التام المستمر",
    category: "grammar",
    level: "C1",
    content: "Used for actions that started in the past and are still continuing, or have just finished with strong present results. Form: have/has been + verb-ing.",
    contentAr: "يستخدم لوصف أفعال بدأت في الماضي وما زالت مستمرة حتى الآن، أو انتهت للتو وتأثيرها قوي وواضح بالوقت الحالي. الصيغة: have/has been + verb-ing.",
    quiz: [
      {
        question: "I ____ English since this morning.",
        options: ["have been studying", "am studying", "have studied", "studied"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "c1-7",
    title: "Have / Get Something Done",
    titleAr: "السببية (Causative - Have / Get something done)",
    category: "grammar",
    level: "C1",
    content: "Used when we arrange for someone else to do something for us. Form: Subject + have/get + object + past participle. Example: 'I had my hair cut.'",
    contentAr: "صيغة السببية تستخدم للتعبير عن ترتيب قيام شخص آخر بعمل ما لصالحنا. الصيغة: فاعل + have/get + المفعول به + التصريف الثالث.",
    quiz: [
      {
        question: "We need to have our roof ____ before the heavy rain starts.",
        options: ["repaired", "repairing", "to repair", "repair"],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  },
  {
    id: "c1-8",
    title: "Idioms",
    titleAr: "التعبيرات الاصطلاحية الراقية (Idioms & Phrasal Nuances)",
    category: "grammar",
    level: "C1",
    content: "Idioms are expressions whose meaning is not predictable from the literal meanings of its words. Crucial for C1 fluency. E.g., 'To hit the nail on the head' (describe exactly), 'Spill the beans' (reveal secret).",
    contentAr: "التعبيرات الاصطلاحية هي عبارات لا يُفهم معناها من الكلمات الحرفية المكونة لها بل تفهم كوحدة لغوية مجازية كاملة. هامة لطلاقة المستوى C1.",
    quiz: [
      {
        question: "She hit the nail on the head. This means:",
        options: [
          "She said something exactly correct.",
          "She physically hit a tool.",
          "She made a terrible mistake.",
          "She was very angry."
        ],
        correctAnswer: 0
      }
    ],
    createdAt: "2026-06-25T00:00:00Z"
  }
];
