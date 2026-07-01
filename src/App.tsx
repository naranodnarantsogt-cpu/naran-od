/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  Menu,
  X,
  Star,
  Clock,
  Calendar,
  Play,
  ChevronLeft,
  ChevronRight,
  Info,
  Film,
  Tv,
  Trophy,
  Sparkles,
  Heart
} from 'lucide-react';

interface SlideData {
  category: string;
  navTitle: string;
  rating: string;
  duration: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
}

const slides: SlideData[] = [
  {
    category: "Movies",
    navTitle: "Movies",
    rating: "9.8/10 IMDB",
    duration: "118 min",
    date: "2026 • Дуртай Кино",
    title: "Teach You A Lesson",
    subtitle: "Шударга ёс ба Амьдралын том сургамж",
    description: "10 настай Наран од хүүгийн шимтэн үзэх хамгийн дуртай кино. Амьдралын үнэ цэнэ, нөхөрлөл болон зөв буруугийн ялгааг сургасан гайхалтай кинематик бүтээл.",
    tag: "Топ Сонголт",
    icon: <Film className="w-4 h-4 text-amber-400 inline mr-1.5" />
  },
  {
    category: "TV Series",
    navTitle: "TV Series",
    rating: "9.9/10 Crunchyroll",
    duration: "24 Анги",
    date: "MAPPA Studio",
    title: "Jujutsu Kaisen",
    subtitle: "Хараал ба Шидтэнүүдийн Ертөнц",
    description: "Итадори Юүжи болон Гожо Сатору нарын супер тулаан. Наран одын хамгийн их догдолж үздэг, онцгой шид ба эрч хүчээр дүүрэн алдарт аниме цуврал.",
    tag: "Дуртай Аниме",
    icon: <Tv className="w-4 h-4 text-purple-400 inline mr-1.5" />
  },
  {
    category: "Editor's Pick",
    navTitle: "Editor's Pick",
    rating: "10/10 Хобби",
    duration: "90 минут",
    date: "Аварга Лиг",
    title: "Football: Ногоон Талбай",
    subtitle: "Хурд, Хүч ба Багийн Сүнс",
    description: "Хөлбөмбөг бол зүгээр нэг тоглоом биш, энэ бол хүсэл тэмүүлэл! Наран од хүү чөлөөт цагаараа бөмбөг хөөж, найзуудтайгаа тоглох хамгийн дуртай хобби.",
    tag: "Спорт Хобби",
    icon: <Trophy className="w-4 h-4 text-emerald-400 inline mr-1.5" />
  },
  {
    category: "Interviews",
    navTitle: "Interviews",
    rating: "100% VIP Баатар",
    duration: "10 Настай",
    date: "Улаанбаатар, Монгол",
    title: "Наран Од • 10 Настай",
    subtitle: "Ирээдүйн Топ Бүтээгч",
    description: "Сайн байна уу! Намайг Наран од гэдэг. Би 10 настай. Сонирхолтой кино үзэж, гоё аниме судалж, хөлбөмбөгөөр хичээллэх дуртай цоглог хүү байна.",
    tag: "Миний Тухай",
    icon: <Sparkles className="w-4 h-4 text-cyan-400 inline mr-1.5" />
  },
  {
    category: "User Reviews",
    navTitle: "User Reviews",
    rating: "5.0 ★★★★★",
    duration: "100+ Сэтгэгдэл",
    date: "Өнөөдөр",
    title: "Шилдэг Үнэлгээ",
    subtitle: "Үзэгчдийн ба Шүтэн бишрэгчдийн булан",
    description: "'Teach you a lesson' кино болон 'JJK' анимег үзсэн хүүхдүүдийн сэтгэгдэл. Наран одын санал болгож буй контентууд үргэлж 10-аас 10 оноо авдаг!",
    tag: "Сэтгэгдэл",
    icon: <Heart className="w-4 h-4 text-rose-400 inline mr-1.5" />
  }
];

const fallbackQuestions = [
  {
    id: 1,
    emojis: "🏴‍☠️👒🍖⚔️",
    answer: "One Piece",
    options: ["One Piece", "Naruto", "Bleach", "Fairy Tail"],
    answers: ["one piece", "onepiece", "ван пис", "хэрэмт далайн дээрэмчид", "хэрэмт далай", "luffy", "луффи"],
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/S8_YwFLCh4U"
  },
  {
    id: 2,
    emojis: "🦊🍥🍜⚡",
    answer: "Naruto",
    options: ["Naruto", "Boruto", "Dragon Ball Z", "My Hero Academia"],
    answers: ["naruto", "наруто", "naruto shippuden", "шиппүдэн", "наруто шиппудэн"],
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/Q6_6S_Q_v9Q"
  },
  {
    id: 3,
    emojis: "⚔️👹👺🌊",
    answer: "Demon Slayer",
    options: ["Demon Slayer", "Jujutsu Kaisen", "Attack on Titan", "Tokyo Ghoul"],
    answers: ["demon slayer", "kimetsu no yaiba", "демон слейер", "хараал идэгчдийг устгагч", "чөтгөрийн ангууч", "nezuko", "tanjiro"],
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/VQGCKyVZIM4"
  },
  {
    id: 4,
    emojis: "🧱🦖⚔️🩸",
    answer: "Attack on Titan",
    options: ["Attack on Titan", "Neon Genesis Evangelion", "Death Note", "Fullmetal Alchemist"],
    answers: ["attack on titan", "shingeki no kyojin", "титан руу дайралт", "attackontitan", "титануудын дайралт", "eren", "эрэн"],
    image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/LHtdkW5__9E"
  },
  {
    id: 5,
    emojis: "📓🍎💀✍️",
    answer: "Death Note",
    options: ["Death Note", "Code Geass", "Monster", "Steins;Gate"],
    answers: ["death note", "deathnote", "үхлийн тэмдэглэл", "light yagami", "l"],
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/N3iF0UIsgV4"
  },
  {
    id: 6,
    emojis: "🤞😈🔴👁️",
    answer: "Jujutsu Kaisen",
    options: ["Jujutsu Kaisen", "Chainsaw Man", "Bleach", "Hunter x Hunter"],
    answers: ["jujutsu kaisen", "jjk", "жужуцу кайсен", "хараал тулаан", "gojo", "гожо", "itadori"],
    image: "https://images.unsplash.com/photo-162755658741d-bktW7d67f5da?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/pm9VxG0X1u4"
  },
  {
    id: 7,
    emojis: "🐉🟠🦍⚡",
    answer: "Dragon Ball Z",
    options: ["Dragon Ball Z", "One Punch Man", "My Hero Academia", "Naruto"],
    answers: ["dragon ball", "dragon ball z", "dragonball", "луут бөмбөг", "goku", "гоку"],
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/zghyYV_a29c"
  },
  {
    id: 8,
    emojis: "🏫🥦💥🥦",
    answer: "My Hero Academia",
    options: ["My Hero Academia", "Assassination Classroom", "Mob Psycho 100", "Black Clover"],
    answers: ["my hero academia", "boku no hero academia", "mha", "миний баатарлаг академи", "deku", "деку", "all might"],
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/EP7_gSIn1u4"
  },
  {
    id: 9,
    emojis: "👨‍🦲🥊🦸‍♂️💥",
    answer: "One Punch Man",
    options: ["One Punch Man", "Dragon Ball", "Hunter x Hunter", "Mob Psycho 100"],
    answers: ["one punch man", "onepunchman", "нэг цохилтын хүн", "opm", "saitama", "сайтама"],
    image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/2JAEl3LDYkM"
  },
  {
    id: 10,
    emojis: "🎣🕷️🃏⚡",
    answer: "Hunter x Hunter",
    options: ["Hunter x Hunter", "Yu Yu Hakusho", "Fullmetal Alchemist", "Bleach"],
    answers: ["hunter x hunter", "hunterxhunter", "hxh", "ангуучдын ангууч", "gon", "гон", "killua", "киллуа"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/d6kBeJjQF08"
  }
];

// Fisher-Yates Shuffle Algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Game state
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [questions, setQuestions] = useState<any[]>(() => {
    const shuffledFallback = fallbackQuestions.map((q: any) => ({
      ...q,
      options: shuffleArray(q.options || [])
    }));
    return shuffleArray(shuffledFallback);
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [playMode, setPlayMode] = useState<'options' | 'type'>('options');

  const current = slides[activeSlide];

  // Fetch questions from data.json on mount
  useEffect(() => {
    fetch('/data.json')
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const processed = data.map((q: any) => ({
            ...q,
            options: shuffleArray(q.options || [])
          }));
          setQuestions(shuffleArray(processed));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch data.json, using high-quality local fallback questions.", err);
      });
  }, []);

  // Play Sound Helper using Web Audio API synthesis
  const playSound = (type: 'correct' | 'incorrect' | 'win' | 'lose') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'incorrect') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'win') {
        // Upbeat victory tune: C4 -> E4 -> G4 -> C5
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + index * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.3);
          osc.start(ctx.currentTime + index * 0.12);
          osc.stop(ctx.currentTime + index * 0.12 + 0.3);
        });
      } else if (type === 'lose') {
        // Melodramatic descending defeat sound: G3 -> Eb3 -> C3
        const notes = [196.00, 155.56, 130.81];
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.18);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + index * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.18 + 0.4);
          osc.start(ctx.currentTime + index * 0.18);
          osc.stop(ctx.currentTime + index * 0.18 + 0.4);
        });
      }
    } catch (err) {
      console.warn('Audio play blocked or unsupported by browser.', err);
    }
  };

  // Check Answer Helper (Case and Space Insensitive)
  const checkAnswer = (selected: string, question: any) => {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    const normSelected = normalize(selected);

    // check direct answer or any aliases in answers array
    const matchesAnswer = normalize(question.answer) === normSelected;
    const matchesAlias = Array.isArray(question.answers) && question.answers.some((ans: string) => normalize(ans) === normSelected);

    return matchesAnswer || matchesAlias;
  };

  // Submit Answer Action
  const handleAnswer = (answerText: string | null, isTimeout: boolean = false) => {
    if (hasAnswered) return;

    const question = questions[currentQuestionIndex];
    if (!question) return;

    setHasAnswered(true);

    if (isTimeout) {
      setIsCorrect(false);
      setSelectedOption(null);
      const nextLives = lives - 1;
      setLives(nextLives);
      setConsecutiveCorrect(0);
      if (nextLives <= 0) {
        playSound('lose');
      } else {
        playSound('incorrect');
      }
      return;
    }

    const correct = checkAnswer(answerText || "", question);
    setIsCorrect(correct);
    setSelectedOption(answerText);

    if (correct) {
      playSound('correct');
      setScore((prev) => prev + 10);
      setConsecutiveCorrect((prev) => {
        const nextStreak = prev + 1;
        if (nextStreak === 3) {
          setScore((s) => s + 20); // +20 points bonus
          setShowBonus(true);
          setTimeout(() => setShowBonus(false), 2500);
          return 0; // Reset streak counter after award
        }
        return nextStreak;
      });
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      setConsecutiveCorrect(0);
      if (nextLives <= 0) {
        playSound('lose');
      } else {
        playSound('incorrect');
      }
    }
  };

  // Timer Effect
  useEffect(() => {
    if (!isGameOpen || hasAnswered || lives <= 0 || currentQuestionIndex >= questions.length) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(null, true); // Timeout trigger
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOpen, hasAnswered, currentQuestionIndex, lives, questions]);

  const handleNextQuestion = () => {
    setHasAnswered(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setTypedAnswer("");
    setTimeLeft(15);
    setCurrentQuestionIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= questions.length) {
        playSound('win');
      }
      return nextIndex;
    });
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setHasAnswered(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setTypedAnswer("");
    setTimeLeft(15);
    setConsecutiveCorrect(0);
    setLives(3);
    setScore(0);
    setShowBonus(false);

    // Reshuffle both questions and their multiple-choice options on restart
    setQuestions((prev) => {
      const reshuffled = prev.map((q: any) => ({
        ...q,
        options: shuffleArray(q.options || [])
      }));
      return shuffleArray(reshuffled);
    });
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNavClick = (index: number) => {
    setActiveSlide(index);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col bg-black text-white select-none">
      {/* BACKGROUND VIDEO (fixed z-index 0) */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4"
          type="video/mp4"
        />
        Таны хөтөч видео дэмжихгүй байна.
      </video>

      {/* BOTTOM BLUR OVERLAY (no gradient darkening, z-index 1) */}
      <div
        className="fixed inset-0 w-full h-full backdrop-blur-xl pointer-events-none z-[1]"
        style={{
          maskImage: 'linear-gradient(to top, black 0%, transparent 45%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 45%)',
        }}
      />

      {/* NAVBAR (z-index 50, relative positioned) */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-6">
        {/* Left Logo */}
        <div
          className="h-8 md:h-10 flex items-center animate-blur-fade-up cursor-pointer group"
          style={{ animationDelay: '0ms' }}
          onClick={() => setActiveSlide(0)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black tracking-tighter text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="font-extrabold tracking-widest text-lg md:text-2xl uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              НАРАН ОД <span className="text-red-500 font-light">•</span> 10
            </span>
          </div>
        </div>

        {/* Center Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {slides.map((slide, idx) => {
            const delays = ['100ms', '150ms', '200ms', '250ms', '300ms'];
            const isActive = activeSlide === idx;
            return (
              <button
                key={slide.category}
                onClick={() => handleNavClick(idx)}
                className={`text-sm font-medium tracking-wide transition-all duration-300 animate-blur-fade-up relative py-1 ${
                  isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-200'
                }`}
                style={{ animationDelay: delays[idx] || '200ms' }}
              >
                <span className="flex items-center">
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse" />}
                  {slide.navTitle}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 to-transparent rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          {/* Search Button (sm and up) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-full liquid-glass px-4 md:px-6 py-2 text-sm font-medium text-white hover:text-gray-200 hover:scale-105 transition-all animate-blur-fade-up active:scale-95"
            style={{ animationDelay: '350ms' }}
          >
            <Search size={18} className="text-gray-300" />
            <span>Search</span>
          </button>

          {/* User / Profile Button (sm and up) */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full liquid-glass text-white hover:scale-105 transition-all animate-blur-fade-up active:scale-95 group"
            style={{ animationDelay: '400ms' }}
            title="Миний профайл"
          >
            <User size={18} className="text-gray-300 group-hover:text-white transition-colors" />
          </button>

          {/* Hamburger Menu Button (below lg) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full liquid-glass text-white animate-blur-fade-up active:scale-95"
            style={{ animationDelay: '350ms' }}
            aria-label="Товч цэс"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Menu
                size={20}
                className={`absolute transition-all duration-500 ease-out ${
                  isMobileMenuOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
                }`}
              />
              <X
                size={20}
                className={`absolute transition-all duration-500 ease-out ${
                  isMobileMenuOpen ? 'rotate-0 opacity-100 scale-100 text-red-400' : '-rotate-180 opacity-0 scale-50'
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU (below lg breakpoint, z-index 40) */}
      <div
        className={`lg:hidden absolute top-[72px] left-0 right-0 z-40 px-4 transition-all duration-500 ease-out ${
          isMobileMenuOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gray-900/95 backdrop-blur-lg border-t border-b border-gray-800 shadow-2xl rounded-2xl p-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 py-1">
            Цэсний сонголт
          </div>
          {slides.map((slide, idx) => {
            const isActive = activeSlide === idx;
            return (
              <button
                key={slide.category}
                onClick={() => handleNavClick(idx)}
                className={`flex items-center justify-between py-3 px-3 rounded-xl text-left transition-colors ${
                  isActive ? 'bg-red-600/20 text-white font-bold border border-red-500/30' : 'text-gray-300 hover:bg-gray-800/50'
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${idx * 50}ms` : '0ms'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-white/5">{slide.icon}</span>
                  <div>
                    <div className="text-sm">{slide.navTitle}</div>
                    <div className="text-xs text-gray-400">{slide.title}</div>
                  </div>
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-red-500" />}
              </button>
            );
          })}

          {/* Search & Profile inside Mobile Menu (visible below sm) */}
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-800 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-800/80 py-2.5 px-3 text-sm font-medium text-white"
            >
              <Search size={16} className="text-gray-300" />
              <span>Хайх</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsProfileOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-800/80 py-2.5 px-3 text-sm font-medium text-white"
            >
              <User size={16} className="text-gray-300" />
              <span>Наран Од (10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* HERO CONTENT (bottom of viewport, z-index 10) */}
      <div className="flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16 z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 w-full max-w-7xl">
          {/* Left Side Content - Keyed by activeSlide for re-triggering stagger animations */}
          <div key={`hero-left-${activeSlide}`} className="flex-1 w-full max-w-3xl">
            {/* Category Tag Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-semibold mb-4 uppercase tracking-wider animate-blur-fade-up"
              style={{ animationDelay: '250ms' }}
            >
              {current.icon}
              <span>{current.tag}</span>
            </div>

            {/* Metadata Row */}
            <div
              className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 md:mb-8 text-xs sm:text-sm text-gray-300 animate-blur-fade-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-md">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">{current.rating}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{current.duration}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{current.date}</span>
              </div>
            </div>

            {/* Subtitle Accent */}
            <div
              className="text-sm sm:text-base md:text-lg font-medium text-red-400 tracking-wide mb-1 md:mb-2 animate-blur-fade-up"
              style={{ animationDelay: '350ms' }}
            >
              {current.subtitle}
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-4 md:mb-6 animate-blur-fade-up drop-shadow-md leading-[1.1]"
              style={{
                letterSpacing: '-0.04em',
                animationDelay: '400ms'
              }}
            >
              {current.title}
            </h1>

            {/* Description */}
            <p
              className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 md:mb-12 max-w-2xl animate-blur-fade-up leading-relaxed"
              style={{ animationDelay: '500ms' }}
            >
              {current.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  if (activeSlide === 1) {
                    setIsGameOpen(true);
                  } else {
                    setIsPlayingModalOpen(true);
                  }
                }}
                className="flex items-center gap-2.5 bg-white text-black rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 animate-blur-fade-up cursor-pointer"
                style={{ animationDelay: '600ms' }}
              >
                <Play size={18} className="fill-black text-black" />
                <span>Play Now</span>
              </button>

              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 rounded-full font-medium liquid-glass px-6 sm:px-8 py-2.5 sm:py-3 text-white hover:text-gray-200 hover:scale-105 active:scale-95 transition-all animate-blur-fade-up cursor-pointer"
                style={{ animationDelay: '700ms' }}
              >
                <Info size={18} className="text-gray-300" />
                <span>Learn More</span>
              </button>
            </div>
          </div>

          {/* Right Side - Navigation Arrows */}
          <div className="flex items-center gap-3 md:w-auto self-end md:self-end">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center gap-2 rounded-full liquid-glass px-4 sm:px-6 py-2.5 sm:py-3 text-white hover:scale-105 active:scale-95 transition-all animate-blur-fade-up cursor-pointer group"
              style={{ animationDelay: '800ms' }}
              title="Өмнөх"
            >
              <ChevronLeft size={20} className="text-gray-300 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
              <span className="text-xs sm:text-sm font-medium pr-1">Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 rounded-full liquid-glass px-4 sm:px-6 py-2.5 sm:py-3 text-white hover:scale-105 active:scale-95 transition-all animate-blur-fade-up cursor-pointer group"
              style={{ animationDelay: '900ms' }}
              title="Дараах"
            >
              <span className="text-xs sm:text-sm font-medium pl-1">Next</span>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 md:mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleNavClick(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Хуудас ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* --- MODALS & OVERLAYS --- */}

      {/* ANIME GUESSER GAME MODAL */}
      {isGameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-gray-950/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsGameOpen(false);
                resetGame();
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors text-white z-10"
              title="Хаах"
            >
              <X size={20} />
            </button>

            {/* STREAK BONUS ANIMATED BANNER */}
            {showBonus && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-amber-500 to-red-600 text-white px-6 py-2 rounded-full font-black tracking-widest text-sm shadow-2xl shadow-red-500/50 flex items-center gap-2 animate-bounce">
                🔥 ДАРААЛАН 3 ЗӨВ! БОНУС +20 ОНОО! 🔥
              </div>
            )}

            {/* GAME STATE: GAME OVER */}
            {lives <= 0 ? (
              <div className="flex flex-col items-center text-center py-8 animate-blur-fade-up">
                <div className="w-24 h-24 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-6 relative">
                  <div className="absolute inset-0 rounded-full bg-red-600 blur-xl opacity-30 animate-pulse" />
                  <span className="text-5xl">💀</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Тоглоом дууслаа!</h2>
                <p className="text-gray-400 text-lg mb-6">Таны 3 амь дууслаа. Илүү их аниме үзээрэй! 🍿</p>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-sm mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 font-medium">Нийт оноо:</span>
                    <span className="text-2xl font-black text-amber-400">{score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Асуулт:</span>
                    <span className="text-lg font-bold text-white">{currentQuestionIndex} / {questions.length}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetGame}
                    className="bg-red-600 text-white font-bold rounded-full px-8 py-3.5 hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/30 cursor-pointer"
                  >
                    Дахин эхлүүлэх 🔄
                  </button>
                  <button
                    onClick={() => {
                      setIsGameOpen(false);
                      resetGame();
                    }}
                    className="bg-white/10 hover:bg-white/15 text-white font-semibold rounded-full px-8 py-3.5 transition-all cursor-pointer"
                  >
                    Буцах
                  </button>
                </div>
              </div>
            ) : currentQuestionIndex >= questions.length ? (
              /* GAME STATE: VICTORY */
              <div className="flex flex-col items-center text-center py-8 animate-blur-fade-up">
                <div className="w-24 h-24 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-6 relative">
                  <div className="absolute inset-0 rounded-full bg-amber-500 blur-xl opacity-30 animate-pulse" />
                  <Trophy size={48} className="animate-bounce" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 mb-2">
                  БАЯР ХҮРГЭЕ! 🎉
                </h2>
                <p className="text-red-400 font-bold text-lg mb-6">Та жинхэнэ Аниме Отаку байна! 👑</p>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-sm mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 font-medium">Эцсийн оноо:</span>
                    <span className="text-3xl font-black text-amber-400">{score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Үлдсэн амь:</span>
                    <span className="text-lg font-bold text-red-500">
                      {"❤️".repeat(lives)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black rounded-full px-8 py-3.5 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-amber-500/30 cursor-pointer"
                  >
                    Дахин тоглох 🔄
                  </button>
                  <button
                    onClick={() => {
                      setIsGameOpen(false);
                      resetGame();
                    }}
                    className="bg-white/10 hover:bg-white/15 text-white font-semibold rounded-full px-8 py-3.5 transition-all cursor-pointer"
                  >
                    Хаах
                  </button>
                </div>
              </div>
            ) : (
              /* GAME STATE: PLAYING QUESTION */
              <div key={`question-${currentQuestionIndex}`} className="flex flex-col animate-blur-fade-up">
                
                {/* Game HUD (Score, Lives, Streak) */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Оноо</span>
                    <span className="text-xl font-black text-amber-400 flex items-center gap-1.5">
                      🏆 {score}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Амь</span>
                    <div className="flex gap-1 text-lg">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span
                          key={i}
                          className={`transition-all duration-300 ${
                            i < lives ? "opacity-100 scale-100 filter-none" : "opacity-30 scale-75 grayscale"
                          }`}
                        >
                          ❤️
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Дараалсан зөв</span>
                    <span className="text-lg font-extrabold text-red-500 flex items-center gap-1">
                      🔥 {consecutiveCorrect}/3
                    </span>
                  </div>
                </div>

                {/* Question Info & Modes */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold bg-red-600/30 text-red-300 px-3 py-1 rounded-full border border-red-500/30">
                    Асуулт {currentQuestionIndex + 1} / {questions.length}
                  </span>

                  {/* Mode Selector */}
                  {!hasAnswered && (
                    <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs">
                      <button
                        onClick={() => setPlayMode('options')}
                        className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                          playMode === 'options' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Сонгох 🎯
                      </button>
                      <button
                        onClick={() => setPlayMode('type')}
                        className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                          playMode === 'type' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Бичих ✍️
                      </button>
                    </div>
                  )}
                </div>

                {/* Timer Bar */}
                {!hasAnswered && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                      <span>Үлдсэн хугацаа:</span>
                      <span className={`font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse text-sm' : 'text-white'}`}>
                        {timeLeft} сек
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-red-600 to-amber-500'
                        }`}
                        style={{ width: `${(timeLeft / 15) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Question: EMOJIS */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-600/10 to-amber-500/10 blur-sm pointer-events-none" />
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">Дараах эможи аль аниме вэ?</div>
                  <span className="text-5xl sm:text-6xl tracking-widest drop-shadow-md select-all font-sans">{questions[currentQuestionIndex].emojis}</span>
                </div>

                {/* GAME INPUTS */}
                {!hasAnswered ? (
                  playMode === 'options' ? (
                    /* OPTION MODE BUTTONS */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {questions[currentQuestionIndex].options.map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(opt)}
                          className="w-full py-3.5 px-5 rounded-2xl border border-white/10 bg-white/5 hover:scale-[1.03] hover:bg-white/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] text-left font-bold text-base md:text-lg transition-all duration-300 text-white cursor-pointer"
                        >
                          🎯 {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* TYPING MODE INPUT */
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (typedAnswer.trim()) {
                          handleAnswer(typedAnswer);
                        }
                      }}
                      className="flex gap-2 w-full"
                    >
                      <input
                        type="text"
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                        placeholder="Аниме нэрийг англи эсвэл монголоор бичээд товшоорой..."
                        autoFocus
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-bold placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all text-sm sm:text-base"
                      />
                      <button
                        type="submit"
                        disabled={!typedAnswer.trim()}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm sm:text-base"
                      >
                        Таах 🚀
                      </button>
                    </form>
                  )
                ) : (
                  /* REVEAL STATE (Answer feedback + Anime Image + YouTube Iframe) */
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 animate-blur-fade-up">
                    
                    {/* Status Alert Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                        isCorrect ? "bg-emerald-600/20 text-emerald-400" : "bg-red-600/20 text-red-500"
                      }`}>
                        {isCorrect ? "✅" : "❌"}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white">
                          {isCorrect ? "Зөв хариуллаа! 🎉" : timeLeft === 0 ? "Хугацаа дууслаа! ⏰" : "Буруу байна! 😢"}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {isCorrect ? "Та +10 оноо авлаа." : "Таны 1 амь хасагдлаа."}
                        </p>
                      </div>
                    </div>

                    {/* Show Options Feedback (Highlight Correct / Incorrect) */}
                    {playMode === 'options' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {questions[currentQuestionIndex].options.map((opt: string) => {
                          const isThisCorrect = checkAnswer(opt, questions[currentQuestionIndex]);
                          const isSelected = selectedOption === opt;
                          
                          let cardStyle = "border-white/5 bg-white/5 text-gray-500 opacity-60";
                          if (isThisCorrect) {
                            cardStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                          } else if (isSelected && !isCorrect) {
                            cardStyle = "bg-red-600/30 border-red-500 text-red-300 animate-shake shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                          }

                          return (
                            <div
                              key={opt}
                              className={`py-2 px-4 rounded-xl border font-bold text-sm ${cardStyle}`}
                            >
                              {opt} {isThisCorrect && " (Зөв хариулт)"}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Revealing Answers for Typing Mode */}
                    {playMode === 'type' && (
                      <div className="bg-black/30 rounded-xl p-3 border border-white/5 mb-4 text-sm">
                        <span className="text-gray-400 font-medium">Таны бичсэн: </span>
                        <span className={`font-bold ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                          {selectedOption || "(Хоосон)"}
                        </span>
                        <div className="mt-1 text-gray-300">
                          <span className="text-gray-400 font-medium">Зөв хариулт: </span>
                          <span className="font-bold text-emerald-400">{questions[currentQuestionIndex].answer}</span>
                        </div>
                      </div>
                    )}

                    {/* REVEAL CONTENT: IMAGE & YOUTUBE VIDEO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Anime Image */}
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                        <img
                          src={questions[currentQuestionIndex].image}
                          alt={questions[currentQuestionIndex].answer}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-3">
                          <span className="text-sm font-black text-white drop-shadow">
                            {questions[currentQuestionIndex].answer}
                          </span>
                        </div>
                      </div>

                      {/* YouTube Video Embed */}
                      <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                        <iframe
                          className="w-full h-full"
                          src={`${questions[currentQuestionIndex].video}?autoplay=1&mute=0`}
                          title={`${questions[currentQuestionIndex].answer} Trailer`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>

                    {/* Next Question Control */}
                    <button
                      onClick={handleNextQuestion}
                      className="w-full mt-6 bg-white hover:bg-gray-200 text-black font-black py-3.5 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5 active:scale-98"
                    >
                      Дараагийн асуулт ({currentQuestionIndex + 1}/{questions.length}) ➔
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* WATCH NOW MODAL */}
      {isPlayingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
          <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col items-center text-center">
            <button
              onClick={() => setIsPlayingModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-6 animate-pulse">
              <Play size={32} className="fill-red-500 ml-1" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold mb-2 text-white">{current.title}</h2>
            <p className="text-red-400 font-medium text-sm sm:text-base mb-6">{current.subtitle}</p>

            <div className="bg-black/50 border border-white/10 rounded-xl p-6 w-full max-w-lg mb-8 text-left text-gray-300 text-sm leading-relaxed">
              <div className="font-semibold text-white mb-2 flex items-center justify-between">
                <span>Наран Одын Тэмдэглэл:</span>
                <span className="text-xs bg-red-600 px-2 py-0.5 rounded text-white font-bold">10 Настай VIP</span>
              </div>
              {current.description}
            </div>

            <button
              onClick={() => setIsPlayingModalOpen(false)}
              className="bg-white text-black font-semibold rounded-full px-8 py-3 hover:bg-gray-200 transition-transform active:scale-95"
            >
              Хаах (Үргэлжлүүлэн үзэх)
            </button>
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-2xl p-4 sm:p-12 animate-fade-in">
          <div className="max-w-3xl w-full mx-auto flex flex-col pt-12">
            <div className="flex items-center justify-between pb-6 border-b border-gray-800">
              <div className="flex items-center gap-3 flex-1 mr-4 bg-gray-900/80 border border-gray-700/60 rounded-full px-5 py-3">
                <Search className="text-gray-400 w-5 h-5 shrink-0" />
                <input
                  type="text"
                  placeholder="Кино, аниме эсвэл хобби хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent text-white placeholder-gray-500 text-base sm:text-lg focus:outline-none w-full"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-white hover:bg-white/10 shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mt-8">
              <div className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-4">
                Наран Одын онцгой санал болгох жагсаалт
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {slides
                  .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s) => {
                    const originalIdx = slides.findIndex(item => item.title === s.title);
                    return (
                      <div
                        key={s.title}
                        onClick={() => {
                          handleNavClick(originalIdx);
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-red-500/50 hover:bg-gray-800/80 cursor-pointer transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="text-xs text-red-400 font-semibold mb-1 flex items-center">
                            {s.icon}
                            <span>{s.category}</span>
                          </div>
                          <h3 className="font-bold text-white group-hover:text-red-400 transition-colors">{s.title}</h3>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{s.description}</p>
                        </div>
                        <div className="mt-4 text-xs font-medium text-gray-300 flex items-center justify-between">
                          <span>{s.rating}</span>
                          <span className="text-red-500 group-hover:translate-x-1 transition-transform">Үзэх →</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIP PROFILE MODAL */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl p-8 text-center">
            <button
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <X size={18} />
            </button>

            {/* Glowing VIP Badge Header */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-red-600 blur-xl opacity-50 animate-pulse" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-red-600 to-amber-500 p-[3px]">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <User size={44} className="text-white" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                PRO
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-1">Наран Од</h2>
            <p className="text-red-400 font-semibold text-sm mb-6 uppercase tracking-widest">
              10 Настай • Кинематик Бүтээгч
            </p>

            {/* Bio stats card */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <div className="text-xs text-gray-400 mb-1">Нас</div>
                <div className="text-lg font-bold text-white">10</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <div className="text-xs text-gray-400 mb-1">Кино</div>
                <div className="text-xs font-bold text-amber-300 truncate mt-1">Lesson</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <div className="text-xs text-gray-400 mb-1">Аниме</div>
                <div className="text-xs font-bold text-purple-300 truncate mt-1">JJK</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left text-sm text-gray-300 mb-8 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Дуртай Хобби:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Trophy size={14} /> Хөлбөмбөг (Football)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Топ Кино:</span>
                <span className="font-semibold text-white">Teach you a lesson</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Топ Аниме:</span>
                <span className="font-semibold text-purple-400">Jujutsu Kaisen</span>
              </div>
            </div>

            <button
              onClick={() => setIsProfileOpen(false)}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold tracking-wide hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-red-600/30"
            >
              Гайхалтай! (Буцах)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

