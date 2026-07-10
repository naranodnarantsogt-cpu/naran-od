/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { getTopScoresFromFirestore, saveScoreToFirestore, getTopFootballScoresFromFirestore, saveFootballScoreToFirestore, FootballScoreEntry } from './lib/scores';
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

const favoriteMovies = [
  { 
    title: "Teach You A Lesson", 
    rating: "9.8", 
    genre: "Драма", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGMBDqKfk7q0JEuVEWPQjPuWvRCtKUugkmVLFCtWbN765LLm2_9d-RYE&s=10https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGMBDqKfk7q0JEuVEWPQjPuWvRCtKUugkmVLFCtWbN765LLm2_9d-RYE&s=10",
    desc: "Наран одын шимтэн үзэх хамгийн дуртай кино. Амьдралын үнэ цэнэ, нөхөрлөл болон зөв буруугийн ялгааг сургасан гайхалтай кинематик бүтээл."
  },
  { 
    title: "One Piece: Red", 
    rating: "9.5", 
    genre: "Аниме", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXO4Mq-lKqnwo6X4CIR6pMqZBYcRBw1-EwgGFrtWEITg&s=10",
    desc: "Далайн дээрэмчдийн хаан болох хүсэлтэй Луффи болон Ута нарын гайхалтай дуу хөгжим, адал явдлаар дүүрэн аниме кино."
  },
  { 
    title: "Demon Slayer Movie", 
    rating: "9.7", 
    genre: "Тулаант", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_EFHvFzN5TbUNghJL41fvEpSgjA09RnPnke7vPYg2zg&s=10",
    desc: "Танжиро болон Хашира нарын үлэмж хүчтэй харгис демончуудтай хийх ширүүн тулаан, гайхалтай дүрслэл бүхий кино."
  },
  { 
    title: "Stranger Things", 
    rating: "9.9", 
    genre: "Sci-Fi", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1nSfSCBM-PqaZg0zZZRUHYshewy69EMFdWjJhmmeBJw&s",
    desc: "Хокинс хотод өрнөх нууцлаг 80-аад оны шинжлэх ухааны уран зөгнөлт, аймшиг болон адал явдлаар дүүрэн гайхалтай цуврал кино."
  }
];

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
    category: "My Games",
    navTitle: "Миний тоглоомууд",
    rating: "10/10 Game",
    duration: "Хязгааргүй",
    date: "Тоглоом",
    title: "Миний тоглоомууд",
    subtitle: "Аниме ба Эможи таах тоглоом",
    description: "Наран одын бүтээсэн хөгжилтэй аниме болон баатрын дүр таах тоглоом. Энд дарж шууд тоглоорой!",
    tag: "Тоглоом",
    icon: <Play className="w-4 h-4 text-red-400 inline mr-1.5" />
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
    category: "emoji",
    emojis: "🏴‍☠️👒🍖⚔️",
    answer: "One Piece",
    options: ["One Piece", "Naruto", "Bleach", "Fairy Tail"],
    answers: ["one piece", "onepiece", "ван пис", "хэрэмт далайн дээрэмчид", "хэрэмт далай", "luffy", "луффи"],
    image: "https://i.redd.it/0u2aefrzacmc1.jpeg",
    video: "https://www.youtube.com/embed/S8_YwFLCh4U"
  },
  {
    id: 2,
    category: "emoji",
    emojis: "🦊🍥🍜⚡",
    answer: "Naruto",
    options: ["Naruto", "Boruto", "Dragon Ball Z", "My Hero Academia"],
    answers: ["naruto", "наруто", "naruto shippuden", "шиппүдэн", "наруто шиппудэн"],
    image: "https://m.media-amazon.com/images/M/MV5BZTNjOWI0ZTAtOGY1OS00ZGU0LWEyOWYtMjhkYjdlYmVjMDk2XkEyXkFqcGc@._V1_.jpg",
    video: "https://www.youtube.com/embed/Q6_6S_Q_v9Q"
  },
  {
    id: 3,
    category: "emoji",
    emojis: "⚔️👹👺🌊",
    answer: "Demon Slayer",
    options: ["Demon Slayer", "Jujutsu Kaisen", "Attack on Titan", "Tokyo Ghoul"],
    answers: ["demon slayer", "kimetsu no yaiba", "демон слейер", "хараал идэгчдийг устгагч", "чөтгөрийн ангууч", "nezuko", "tanjiro"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0fMxjRck-hY6tdV_nW-SnIWjFEvO3SGjYc77oCHjPUg&s=10",
    video: "https://www.youtube.com/embed/VQGCKyVZIM4"
  },
  {
    id: 4,
    category: "emoji",
    emojis: "🧱🦖⚔️🩸",
    answer: "Attack on Titan",
    options: ["Attack on Titan", "Neon Genesis Evangelion", "Death Note", "Fullmetal Alchemist"],
    answers: ["attack on titan", "shingeki no kyojin", "титан руу дайралт", "attackontitan", "титануудын дайралт", "eren", "эрэн"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQigobSp1b1DRmp6xeC4hcycUCRnUXcP3XQTxdkHxd14w&s=10",
    video: "https://www.youtube.com/embed/LHtdkW5__9E"
  },
  {
    id: 5,
    category: "emoji",
    emojis: "📓🍎💀✍️",
    answer: "Death Note",
    options: ["Death Note", "Code Geass", "Monster", "Steins;Gate"],
    answers: ["death note", "deathnote", "үхлийн тэмдэглэл", "light yagami", "l"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE-s9JscbcqNhv5TVEvqhf3-mJDkX7FZ3YJTgMSjT-pg&s",
    video: "https://www.youtube.com/embed/N3iF0UIsgV4"
  },
  {
    id: 6,
    category: "emoji",
    emojis: "🤞😈🔴👁️",
    answer: "Jujutsu Kaisen",
    options: ["Jujutsu Kaisen", "Chainsaw Man", "Bleach", "Hunter x Hunter"],
    answers: ["jujutsu kaisen", "jjk", "жужуцу кайсен", "хараал тулаан", "gojo", "гожо", "itadori"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh3hSw1X2eKkBBNgd3rEtwENN-wnk38NLfJMpUoPiNlw&s=10",
    video: "https://www.youtube.com/embed/pm9VxG0X1u4"
  },
  {
    id: 7,
    category: "emoji",
    emojis: "🐉🟠🦍⚡",
    answer: "Dragon Ball Z",
    options: ["Dragon Ball Z", "One Punch Man", "My Hero Academia", "Naruto"],
    answers: ["dragon ball", "dragon ball z", "dragonball", "луут бөмбөг", "goku", "гоку"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPOw2RvQ2PL8hInBAMTx3eK3imEGUefhgkxOJjfvHRCw&s=10",
    video: "https://www.youtube.com/embed/zghyYV_a29c"
  },
  {
    id: 8,
    category: "emoji",
    emojis: "🏫🥦💥🥦",
    answer: "My Hero Academia",
    options: ["My Hero Academia", "Assassination Classroom", "Mob Psycho 100", "Black Clover"],
    answers: ["my hero academia", "boku no hero academia", "mha", "миний баатарлаг академи", "deku", "деку", "all might"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ5m7Cz3MqjUYlYZAH2r2pw1M0wLlZAIZaSw_XsUDAjQ&s=10",
    video: "https://www.youtube.com/embed/EP7_gSIn1u4"
  },
  {
    id: 9,
    category: "emoji",
    emojis: "👨‍🦲🥊🦸‍♂️💥",
    answer: "One Punch Man",
    options: ["One Punch Man", "Dragon Ball", "Hunter x Hunter", "Mob Psycho 100"],
    answers: ["one punch man", "onepunchman", "нэг цохилтын хүн", "opm", "saitama", "сайтама"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Ep_Y6ZrX2R2m3daKOOxoQpOSVKM-plRydTGrDnG32g&s=10",
    video: "https://www.youtube.com/embed/2JAEl3LDYkM"
  },
  {
    id: 10,
    category: "emoji",
    emojis: "🎣🕷️🃏⚡",
    answer: "Hunter x Hunter",
    options: ["Hunter x Hunter", "Yu Yu Hakusho", "Fullmetal Alchemist", "Bleach"],
    answers: ["hunter x hunter", "hunterxhunter", "hxh", "ангуучдын ангууч", "gon", "гон", "killua", "киллуа"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLYwY12mnQ4o2D51taXncJf2LGQ-SX4Y63cStG5aZHyA&s=10",
    video: "https://www.youtube.com/embed/d6kBeJjQF08"
  },
  {
    id: 11,
    category: "character",
    emojis: "👒🍖🏴‍☠️⚔️",
    answer: "Luffy",
    options: ["Luffy", "Zoro", "Sanji", "Usopp"],
    answers: ["luffy", "monkey d luffy", "луффи", "monkey d. luffy"],
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/S8_YwFLCh4U"
  },
  {
    id: 12,
    category: "character",
    emojis: "🦊🍥🍜⚡",
    answer: "Naruto",
    options: ["Naruto", "Sasuke", "Kakashi", "Gaara"],
    answers: ["naruto", "naruto uzumaki", "наруто", "наруто узумаки"],
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/Q6_6S_Q_v9Q"
  },
  {
    id: 13,
    category: "character",
    emojis: "⚔️🌊👹🐗",
    answer: "Tanjiro",
    options: ["Tanjiro", "Zenitsu", "Inosuke", "Muzan"],
    answers: ["tanjiro", "tanjiro kamado", "танжиро", "танжиро камадо"],
    image: "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?w=600&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/VQGCKyVZIM4"
  },
  {
    id: 14,
    category: "character",
    emojis: "🐉🦍💥🥋",
    answer: "Goku",
    options: ["Goku", "Vegeta", "Gohan", "Piccolo"],
    answers: ["goku", "son goku", "гоку", "сон гоку"],
    image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600&auto=format&fit=crop&q=80",
    video: "https://www.youtube.com/embed/zghyYV_a29c"
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





// Football Game Component (vs AI)
function FootballGame({ teamSize, onBack }: { teamSize: 1 | 2 | 6; onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scoreUser, setScoreUser] = useState(0);
  const [scoreAi, setScoreAi] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [goalBanner, setGoalBanner] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    if (gameOver && !scoreSaved) {
      setScoreSaved(true);
      saveFootballScoreToFirestore("Наран Од", scoreUser, scoreAi, teamSize).catch(console.error);
    }
  }, [gameOver, scoreSaved, scoreUser, scoreAi, teamSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let timerInterval: any;

    const ball = { x: 300, y: 175, vx: 0, vy: 0, radius: 8 };
    const userPlayers = teamSize === 1 
      ? [{ x: 150, y: 175 }] 
      : teamSize === 2 
      ? [{ x: 150, y: 120 }, { x: 150, y: 230 }]
      : [
          { x: 80, y: 175 },
          { x: 120, y: 110 },
          { x: 120, y: 240 },
          { x: 160, y: 70 },
          { x: 160, y: 280 },
          { x: 200, y: 175 },
        ];

    const aiPlayers = teamSize === 1 
      ? [{ x: 450, y: 175, vx: (Math.random() - 0.5) * 3.8, vy: (Math.random() - 0.5) * 3.8 }] 
      : teamSize === 2 
      ? [{ x: 450, y: 120, vx: (Math.random() - 0.5) * 3.8, vy: (Math.random() - 0.5) * 3.8 }, { x: 450, y: 230, vx: (Math.random() - 0.5) * 3.8, vy: (Math.random() - 0.5) * 3.8 }]
      : [
          { x: 520, y: 175, vx: (Math.random() - 0.5) * 3.8, vy: (Math.random() - 0.5) * 3.8 },
          { x: 480, y: 110, vx: (Math.random() - 0.5) * 3.8, vy: (Math.random() - 0.5) * 3.8 },
          { x: 480, y: 240, vx: (Math.random() - 0.5) * 3.8, vy: (Math.random() - 0.5) * 3.8 },
          { x: 440, y: 70, vx: (Math.random() - 0.5) * 3.8, vy: (Math.random() - 0.5) * 3.8 },
          { x: 440, y: 280, vx: (Math.random() - 0.5) * 3.8, vy: (Math.random() - 0.5) * 3.8 },
          { x: 400, y: 175, vx: (Math.random() - 0.5) * 3.8, vy: (Math.random() - 0.5) * 3.8 },
        ];
    const referee = { x: 300, y: 220, vx: 1.2, vy: 0.8 };

    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const resetPositions = () => {
      ball.x = 300;
      ball.y = 175;
      ball.vx = 0;
      ball.vy = 0;
      if (teamSize === 1) {
        userPlayers[0].x = 150; userPlayers[0].y = 175;
        aiPlayers[0].x = 450; aiPlayers[0].y = 175;
      } else if (teamSize === 2) {
        userPlayers[0].x = 150; userPlayers[0].y = 120;
        userPlayers[1].x = 150; userPlayers[1].y = 230;
        aiPlayers[0].x = 450; aiPlayers[0].y = 120;
        aiPlayers[1].x = 450; aiPlayers[1].y = 230;
      } else {
        const uPos = [{ x: 80, y: 175 }, { x: 120, y: 110 }, { x: 120, y: 240 }, { x: 160, y: 70 }, { x: 160, y: 280 }, { x: 200, y: 175 }];
        uPos.forEach((p, i) => { if (userPlayers[i]) { userPlayers[i].x = p.x; userPlayers[i].y = p.y; } });
        const aPos = [{ x: 520, y: 175 }, { x: 480, y: 110 }, { x: 480, y: 240 }, { x: 440, y: 70 }, { x: 440, y: 280 }, { x: 400, y: 175 }];
        aPos.forEach((p, i) => { if (aiPlayers[i]) { aiPlayers[i].x = p.x; aiPlayers[i].y = p.y; aiPlayers[i].vx = (Math.random() - 0.5) * 3.8; aiPlayers[i].vy = (Math.random() - 0.5) * 3.8; } });
      }
      referee.x = 300; referee.y = 220;
    };

    let localScoreUser = 0;
    let localScoreAi = 0;

    const update = () => {
      const speed = 4.8;
      
      // All user players move freely with controls or smooth wandering across the pitch
      userPlayers.forEach((p, idx) => {
        if (idx === 0) {
          if (keys['ArrowUp'] || keys['w'] || keys['W']) p.y -= speed;
          if (keys['ArrowDown'] || keys['s'] || keys['S']) p.y += speed;
          if (keys['ArrowLeft'] || keys['a'] || keys['A']) p.x -= speed;
          if (keys['ArrowRight'] || keys['d'] || keys['D']) p.x += speed;
        } else {
          // Teammates move freely towards ball or roam around dynamically
          const targetX = ball.x + (Math.random() - 0.5) * 50;
          const targetY = ball.y + (Math.random() - 0.5) * 50;
          if (p.x < targetX) p.x += 2.8;
          if (p.x > targetX) p.x -= 2.8;
          if (p.y < targetY) p.y += 2.8;
          if (p.y > targetY) p.y -= 2.8;
        }
        p.x = Math.max(25, Math.min(575, p.x));
        p.y = Math.max(30, Math.min(320, p.y));
      });

      // AI players move freely across the pitch (not stuck)
      aiPlayers.forEach((ai) => {
        if (Math.random() < 0.08) {
          ai.vx = (Math.random() - 0.5) * 3.5;
          ai.vy = (Math.random() - 0.5) * 3.5;
        }
        ai.x += ai.vx;
        ai.y += ai.vy;
        if (ai.x < 25 || ai.x > 575) ai.vx *= -1;
        if (ai.y < 30 || ai.y > 320) ai.vy *= -1;
        ai.x = Math.max(25, Math.min(575, ai.x));
        ai.y = Math.max(30, Math.min(320, ai.y));
      });

      // Referee patrolling movement
      referee.x += referee.vx;
      referee.y += referee.vy;
      if (referee.x < 100 || referee.x > 500) referee.vx *= -1;
      if (referee.y < 50 || referee.y > 300) referee.vy *= -1;

      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vx *= 0.98;
      ball.vy *= 0.98;

      if (ball.y < 28 || ball.y > 322) {
        ball.vy *= -1;
        ball.y = Math.max(28, Math.min(322, ball.y));
      }

      if (ball.x <= 20) {
        if (ball.y >= 125 && ball.y <= 225) {
          localScoreAi += 1;
          setScoreAi(localScoreAi);
          setGoalBanner("🤖 AI ГООЛ ХИЙЛЭЭ! ⚽");
          setTimeout(() => setGoalBanner(""), 2000);
          resetPositions();
        } else {
          ball.vx *= -1;
          ball.x = 20;
        }
      }
      if (ball.x >= 580) {
        if (ball.y >= 125 && ball.y <= 225) {
          localScoreUser += 1;
          setScoreUser(localScoreUser);
          setGoalBanner("🎉 ТА ГООЛ ХИЙЛЭЭ! ⚽🔥");
          setTimeout(() => setGoalBanner(""), 2000);
          resetPositions();
        } else {
          ball.vx *= -1;
          ball.x = 580;
        }
      }

      [...userPlayers, ...aiPlayers].forEach(p => {
        const dx = ball.x - p.x;
        const dy = ball.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 24) {
          const angle = Math.atan2(dy, dx);
          const kickPower = keys[' '] ? 8.0 : 4.8;
          ball.vx = Math.cos(angle) * kickPower;
          ball.vy = Math.sin(angle) * kickPower;
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, 600, 350);

      // Pitch background (Green grass stripes)
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, 600, 350);

      for (let x = 0; x < 600; x += 40) {
        ctx.fillStyle = (x / 40) % 2 === 0 ? 'rgba(255, 255, 255, 0.04)' : 'transparent';
        ctx.fillRect(x, 24, 40, 302);
      }

      // Stadium Stands & Cheerleaders / Spectators (Top & Bottom)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 600, 24);
      ctx.fillRect(0, 326, 600, 24);

      // Crowd dots / cheering flags
      for (let i = 15; i < 590; i += 20) {
        const colors = ['#f43f5e', '#3b82f6', '#eab308', '#a855f7', '#10b981'];
        ctx.fillStyle = colors[(i / 20) % colors.length];
        ctx.beginPath();
        ctx.arc(i, 12, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(i + 8, 338, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🏟️ ANIME STADIUM - ҮЗЭГЧИД & ХӨГЖӨӨН ДЭМЖИГЧИД', 16, 16);

      // Pitch lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(20, 28, 560, 294);

      ctx.beginPath();
      ctx.moveTo(300, 28);
      ctx.lineTo(300, 322);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(300, 175, 55, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(300, 175, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Goal boxes
      ctx.strokeRect(20, 115, 55, 120);
      ctx.strokeRect(525, 115, 55, 120);

      // Goal nets
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(8, 135, 12, 80);
      ctx.fillRect(580, 135, 12, 80);

      // Scoreboard Banner on Canvas
      ctx.fillStyle = '#09090b';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(205, 32, 190, 26, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`🔴 ${scoreUser}  VS  ${scoreAi} 🔵 | ⏱️ ${timeLeft}s`, 300, 48);

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Human-like Player helper
      const drawHumanPlayer = (px: number, py: number, kitColor: string, label: string, isUser: boolean) => {
        // Shadow
        ctx.beginPath();
        ctx.arc(px, py + 4, 11, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fill();

        // Cleats
        ctx.fillStyle = '#111827';
        ctx.fillRect(px - 6, py + 6, 4, 4);
        ctx.fillRect(px + 2, py + 6, 4, 4);

        // Shorts
        ctx.fillStyle = isUser ? '#1e3a8a' : '#1f2937';
        ctx.fillRect(px - 7, py, 14, 8);

        // Jersey / Body
        ctx.beginPath();
        ctx.arc(px, py - 2, 12, 0, Math.PI * 2);
        ctx.fillStyle = kitColor;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.arc(px, py - 13, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffedd5';
        ctx.fill();
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Hair
        ctx.fillStyle = isUser ? '#b91c1c' : '#2563eb';
        ctx.beginPath();
        ctx.arc(px, py - 15, 6, Math.PI, Math.PI * 2);
        ctx.fill();

        // Number / Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, px, py + 2);
      };

      // Referee helper
      const drawReferee = (rx: number, ry: number) => {
        // Shadow
        ctx.beginPath();
        ctx.arc(rx, ry + 4, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fill();

        // Shorts
        ctx.fillStyle = '#000000';
        ctx.fillRect(rx - 6, ry, 12, 7);

        // Yellow Jersey
        ctx.beginPath();
        ctx.arc(rx, ry - 2, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#eab308';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        // Head & Whistle
        ctx.beginPath();
        ctx.arc(rx, ry - 12, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#fed7aa';
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rx - 2, ry - 8, 4, 3);

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('REF', rx, ry + 2);
      };

      // Draw User Players
      userPlayers.forEach((p, i) => {
        drawHumanPlayer(p.x, p.y, '#ef4444', `P${i+1}`, true);
      });

      // Draw AI Players
      aiPlayers.forEach((p, i) => {
        drawHumanPlayer(p.x, p.y, '#3b82f6', `AI${i+1}`, false);
      });

      // Draw Referee
      drawReferee(referee.x, referee.y);
    };

    const loop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(timerInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [teamSize]);

  return (
    <div className="relative w-full max-w-2xl bg-gray-950/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col backdrop-blur-xl">
      {goalBanner && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-red-600 to-amber-500 text-white px-6 py-2 rounded-full font-black text-sm shadow-2xl animate-bounce">
          {goalBanner}
        </div>
      )}

      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-red-600/30 text-red-400 font-bold px-3 py-1 rounded-xl text-xs border border-red-500/30">
            🔴 Танай баг
          </span>
          <span className="text-2xl font-black text-white">{scoreUser}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Цаг</span>
          <span className={`text-lg font-mono font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}>
            0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-white">{scoreAi}</span>
          <span className="bg-blue-600/30 text-blue-400 font-bold px-3 py-1 rounded-xl text-xs border border-blue-500/30">
            🔵 AI Баг
          </span>
        </div>
      </div>

      {gameOver ? (
        <div className="flex flex-col items-center text-center py-8 animate-blur-fade-up">
          <span className="text-5xl mb-3">🏆</span>
          <h2 className="text-3xl font-black text-white mb-2">Тоглолт өндөрлөөрөө!</h2>
          <p className="text-gray-400 text-sm mb-4">
            {scoreUser > scoreAi ? "🎉 БАЯР ХҮРГЭЕ! Та яллаа!" : scoreUser < scoreAi ? "😢 AI яллаа! Дахин оролцоно уу." : "🤝 Тэнцлээ!"}
          </p>
          <div className="bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 flex items-center gap-1.5 animate-pulse">
            <span>💾 Оноо Firestore "football_scores" collection-д хадгалагдлаа!</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-sm mb-6 flex justify-around text-lg font-bold">
            <div>Та: <span className="text-red-500">{scoreUser}</span></div>
            <div>AI: <span className="text-blue-500">{scoreAi}</span></div>
          </div>
          <button
            onClick={onBack}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all cursor-pointer shadow-lg shadow-red-600/30"
          >
            Цэс рүү буцах ➔
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-green-900 mb-4">
            <canvas ref={canvasRef} width={600} height={350} className="w-full h-auto block" />
          </div>

          <div className="flex items-center justify-between w-full text-xs text-gray-400 px-2">
            <span>⌨️ Удирдах: WASD / Сумтай товчлуурууд + Space (Цохих)</span>
            <button
              onClick={onBack}
              className="text-red-400 hover:underline font-semibold cursor-pointer"
            >
              Тоглоом болих ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMoviePopup, setSelectedMoviePopup] = useState<any | null>(null);
  const [isSonicPlaying, setIsSonicPlaying] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMoveMain = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 35;
    const y = (clientY / window.innerHeight - 0.5) * 35;
    setMousePos({ x, y });
  };

  // Game state
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [questionsRaw, setQuestionsRaw] = useState<any[]>(fallbackQuestions);
  const [selectedCategory, setSelectedCategory] = useState<'emoji' | 'character' | 'football' | null>(null);
  const [fbTeamSize, setFbTeamSize] = useState<1 | 2 | 6>(1);
  const [questions, setQuestions] = useState<any[]>([]);
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

  // Leaderboard states
  const [leaderboard, setLeaderboard] = useState<{ id: string; name: string; score: number; date?: string; playMode: string; category?: string }[]>(() => {
    const saved = localStorage.getItem('anime_guess_leaderboard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultScores = [
      { id: 'd1', name: 'Наран Од 👑', score: 250, date: '2026-06-30', playMode: 'type', category: 'emoji' },
      { id: 'd2', name: 'Gojo Satoru 🤞', score: 180, date: '2026-06-29', playMode: 'type', category: 'emoji' },
      { id: 'd3', name: 'Tanjiro Kamado 🌊', score: 140, date: '2026-06-28', playMode: 'options', category: 'emoji' },
      { id: 'd4', name: 'Eren Yeager 🧱', score: 110, date: '2026-06-27', playMode: 'options', category: 'emoji' },
      { id: 'd5', name: 'Luffy 👒', score: 90, date: '2026-06-26', playMode: 'type', category: 'character' }
    ];
    localStorage.setItem('anime_guess_leaderboard', JSON.stringify(defaultScores));
    return defaultScores;
  });

  const [playerName, setPlayerName] = useState("Наран Од");
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [leaderboardCategoryFilter, setLeaderboardCategoryFilter] = useState<'all' | 'emoji' | 'character'>('all');
  const [footballLeaderboard, setFootballLeaderboard] = useState<FootballScoreEntry[]>([]);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'anime' | 'football'>('anime');

  const submitScoreToLeaderboard = async () => {
    if (scoreSubmitted || isSubmittingScore) return;
    setIsSubmittingScore(true);
    
    let firestoreId: string | null = null;
    try {
      // Save to Firestore!
      firestoreId = await saveScoreToFirestore(
        playerName.trim() || "Тоглогч",
        score,
        playMode,
        selectedCategory || 'emoji'
      );
    } catch (err) {
      console.error("Failed to save score to Firestore:", err);
    }
    
    // Refresh leaderboard
    setIsLoadingLeaderboard(true);
    let topScores: any[] = [];
    try {
      topScores = await getTopScoresFromFirestore();
    } catch (err) {
      console.error("Failed to load top scores from Firestore:", err);
    }

    if (topScores && topScores.length > 0) {
      setLeaderboard(topScores);
    } else {
      // Local fallback if Firestore is temporarily offline/empty
      const newEntry = {
        id: firestoreId || Date.now().toString(),
        name: playerName.trim() || "Тоглогч",
        score,
        date: new Date().toISOString().split('T')[0],
        playMode,
        category: selectedCategory || 'emoji'
      };
      const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score);
      setLeaderboard(updated);
      localStorage.setItem('anime_guess_leaderboard', JSON.stringify(updated));
    }
    
    setIsLoadingLeaderboard(false);
    setScoreSubmitted(true);
    setIsSubmittingScore(false);
  };

  const current = slides[activeSlide];

  // Fetch questions from data.json on mount with robust absolute/relative fallbacks
  useEffect(() => {
    fetch('data.json')
      .then((res) => {
        if (!res.ok) return fetch('/data.json');
        return res;
      })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setQuestionsRaw(data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch data.json, using high-quality local fallback questions.", err);
      });
  }, []);

  // Fetch top scores from Firestore on mount
  useEffect(() => {
    const fetchScores = async () => {
      setIsLoadingLeaderboard(true);
      try {
        const topScores = await getTopScoresFromFirestore();
        if (topScores && topScores.length > 0) {
          setLeaderboard(topScores);
        }
        const topFootballScores = await getTopFootballScoresFromFirestore();
        if (topFootballScores && topFootballScores.length > 0) {
          setFootballLeaderboard(topFootballScores);
        }
      } catch (err) {
        console.error("Failed to load scores on mount:", err);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };
    fetchScores();
  }, []);

  // Listen for 'M' or 'm' key to toggle Sonic theme song playback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        // Prevent default only if not typing in an input
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
          return;
        }
        setIsSonicPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sonic Theme Song Player Effect using Web Audio API (16-bit Genesis Chiptune)
  useEffect(() => {
    if (!isSonicPlaying) return;

    let audioCtx: AudioContext | null = null;
    let timer: number | null = null;
    let isCancelled = false;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioCtx();

      // Green Hill Zone Act 1 melody notes & timings
      const tempo = 165;
      const beatSec = 60 / tempo;
      
      const melody = [
        { f: 369.99, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 493.88, d: 0.5 }, { f: 554.37, d: 0.5 },
        { f: 587.33, d: 1.0 }, { f: 659.25, d: 0.5 }, { f: 587.33, d: 0.5 }, { f: 554.37, d: 1.0 },
        { f: 493.88, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 369.99, d: 1.0 }, { f: 440.00, d: 1.0 },
        { f: 493.88, d: 0.5 }, { f: 554.37, d: 0.5 }, { f: 659.25, d: 1.0 }, { f: 554.37, d: 1.0 },
        { f: 493.88, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 369.99, d: 1.0 }, { f: 293.66, d: 1.0 },
        { f: 369.99, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 493.88, d: 0.5 }, { f: 554.37, d: 0.5 },
        { f: 740.00, d: 1.0 }, { f: 659.25, d: 1.0 }, { f: 587.33, d: 1.0 }, { f: 554.37, d: 1.0 },
      ];

      let noteIndex = 0;

      const playNextNote = () => {
        if (isCancelled || !audioCtx) return;
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const note = melody[noteIndex % melody.length];
        noteIndex++;

        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'square'; // Classic Sega Genesis FM/Chiptune square wave
          osc.frequency.setValueAtTime(note.f, audioCtx.currentTime);

          gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + note.d * beatSec * 0.85);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + note.d * beatSec);
        } catch (e) {
          console.error("Audio note error:", e);
        }

        timer = window.setTimeout(playNextNote, note.d * beatSec * 1000);
      };

      playNextNote();
    } catch (err) {
      console.error("Sonic AudioContext error:", err);
    }

    return () => {
      isCancelled = true;
      if (timer) window.clearTimeout(timer);
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {});
      }
    };
  }, [isSonicPlaying]);

  // Fetch scores when leaderboard is opened
  useEffect(() => {
    if (isLeaderboardOpen) {
      const fetchScores = async () => {
        setIsLoadingLeaderboard(true);
        try {
          const topScores = await getTopScoresFromFirestore();
          if (topScores && topScores.length > 0) {
            setLeaderboard(topScores);
          }
          const topFootballScores = await getTopFootballScoresFromFirestore();
          if (topFootballScores && topFootballScores.length > 0) {
            setFootballLeaderboard(topFootballScores);
          }
        } catch (err) {
          console.error("Failed to load scores when opening leaderboard:", err);
        } finally {
          setIsLoadingLeaderboard(false);
        }
      };
      fetchScores();
    }
  }, [isLeaderboardOpen]);

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
    setTimeLeft(playMode === 'type' ? 20 : 15);
    setCurrentQuestionIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= questions.length) {
        playSound('win');
      }
      return nextIndex;
    });
  };

  const resetGame = () => {
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setHasAnswered(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setTypedAnswer("");
    setTimeLeft(playMode === 'type' ? 20 : 15);
    setConsecutiveCorrect(0);
    setLives(3);
    setScore(0);
    setShowBonus(false);
    setScoreSubmitted(false);
    setPlayerName("Наран Од");
    setQuestions([]);
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

        {/* Center Desktop Links (Two Rows) */}
        <div className="hidden lg:flex flex-col items-center gap-1.5">
          {/* Row 1: First 4 items */}
          <div className="flex items-center gap-6 xl:gap-8">
            {slides.slice(0, 4).map((slide, idx) => {
              const isActive = activeSlide === idx;
              return (
                <button
                  key={slide.category}
                  onClick={() => handleNavClick(idx)}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 relative py-0.5 ${
                    isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-200'
                  }`}
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

          {/* Row 2: Last 2 items + Typeracer link */}
          <div className="flex items-center gap-6 xl:gap-8">
            {slides.slice(4).map((slide, i) => {
              const idx = i + 4;
              const isActive = activeSlide === idx;
              return (
                <button
                  key={slide.category}
                  onClick={() => handleNavClick(idx)}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 relative py-0.5 ${
                    isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-200'
                  }`}
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

            {/* Typeracer link tab */}
            <a
              href="https://narantsogt-naran-od.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium tracking-wide transition-all duration-300 relative py-0.5 text-gray-400 hover:text-gray-200 flex items-center gap-1.5 cursor-pointer"
            >
              <span>⌨️ Typeracer</span>
            </a>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">


          {/* Search Button (sm and up) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-full liquid-glass px-3.5 md:px-5 py-2 text-sm font-medium text-white hover:text-gray-200 hover:scale-105 transition-all animate-blur-fade-up active:scale-95 cursor-pointer"
            style={{ animationDelay: '350ms' }}
          >
            <Search size={16} className="text-gray-300" />
            <span className="hidden md:inline">Search</span>
          </button>

          {/* User / Profile Button (sm and up) */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="hidden sm:flex items-center gap-2.5 rounded-full liquid-glass px-3.5 py-1.5 text-white hover:scale-105 transition-all animate-blur-fade-up active:scale-95 group cursor-pointer"
            style={{ animationDelay: '400ms' }}
            title="Миний профайл"
          >
            <div className="w-7 h-7 rounded-full bg-red-600/30 flex items-center justify-center text-red-400 group-hover:bg-red-600/50 transition-colors">
              <User size={14} />
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold leading-tight text-white">Наран Од</div>
              <div className="text-[10px] text-gray-400 leading-tight">10 настай</div>
            </div>
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

          {/* Typeracer link tab (Mobile) */}
          <a
            href="https://narantsogt-naran-od.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between py-3 px-3 rounded-xl text-left transition-colors text-gray-300 hover:bg-gray-800/50 border border-transparent cursor-pointer"
            style={{
              transitionDelay: isMobileMenuOpen ? `${slides.length * 50}ms` : '0ms'
            }}
          >
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-white/5 text-sm flex items-center justify-center">⌨️</span>
              <div>
                <div className="text-sm">⌨️ Typeracer</div>
                <div className="text-xs text-gray-400">Шивэх хурдны тоглоом</div>
              </div>
            </div>
          </a>

          {/* Search, Leaderboard & Profile inside Mobile Menu (visible below sm) */}
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-800 grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gray-800/80 py-2 px-1 text-xs font-medium text-white"
            >
              <Search size={16} className="text-gray-300" />
              <span>Хайх</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsProfileOpen(true);
              }}
              className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gray-800/80 py-2 px-1 text-xs font-medium text-white"
            >
              <User size={16} className="text-gray-300" />
              <span>Профайл</span>
            </button>
          </div>
        </div>
      </div>

      {/* HERO CONTENT (bottom of viewport, z-index 10) */}
      <div className="flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16 z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 w-full max-w-7xl">
          {/* Left Side Content - Keyed by activeSlide for re-triggering stagger animations */}
          <div key={`hero-left-${activeSlide}`} className="flex-1 w-full max-w-3xl">
            {activeSlide === 1 ? (
              /* DIRECT EMBEDDED GAME INTERFACE FOR "МИНИЙ ТОГЛООМУУД" */
              <div className="relative w-full max-w-5xl bg-gray-950/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col backdrop-blur-xl">
                {/* STREAK BONUS ANIMATED BANNER */}
                {showBonus && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-amber-500 to-red-600 text-white px-6 py-2 rounded-full font-black tracking-widest text-sm shadow-2xl shadow-red-500/50 flex items-center gap-2 animate-bounce">
                    🔥 ДАРААЛАН 3 ЗӨВ! БОНУС +20 ОНОО! 🔥
                  </div>
                )}

                {/* GAME SELECTION / STATE ROUTING */}
                {selectedCategory === 'football' ? (
                  <FootballGame teamSize={fbTeamSize} onBack={() => setSelectedCategory(null)} />
                ) : selectedCategory === null ? (
                  /* CATEGORY SELECTOR MENU + PROMINENT LEADERBOARD SIDE-BY-SIDE */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-2 animate-blur-fade-up w-full">
                    {/* Left: Games Menu */}
                    <div className="flex flex-col items-center text-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-3 relative">
                        <div className="absolute inset-0 rounded-full bg-red-600/30 blur-lg" />
                        <Play size={28} className="fill-red-500 ml-1 relative z-10" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mb-1">Миний тоглоомууд</h2>
                      <p className="text-gray-400 text-xs mb-4 font-medium">Тоглох төрлөө сонгоно уу!</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
                        {/* Category: Emoji */}
                        <button
                          onClick={() => {
                            const filtered = questionsRaw.filter(q => q.category === 'emoji');
                            const processed = filtered.map((q: any) => ({
                              ...q,
                              options: shuffleArray(q.options || [])
                            }));
                            setQuestions(shuffleArray(processed));
                            setCurrentQuestionIndex(0);
                            setSelectedCategory('emoji');
                            setTimeLeft(playMode === 'type' ? 20 : 15);
                            setIsGameOpen(true);
                          }}
                          className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/50 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                        >
                          <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🎬</span>
                          <h3 className="font-bold text-white text-xs">Аниме Таах (Эможи)</h3>
                          <p className="text-[10px] text-gray-500 mt-0.5">Эможи хараад таана</p>
                        </button>

                        {/* Category: Character */}
                        <button
                          onClick={() => {
                            const filtered = questionsRaw.filter(q => q.category === 'character');
                            const processed = filtered.map((q: any) => ({
                              ...q,
                              options: shuffleArray(q.options || [])
                            }));
                            setQuestions(shuffleArray(processed));
                            setCurrentQuestionIndex(0);
                            setSelectedCategory('character');
                            setTimeLeft(playMode === 'type' ? 20 : 15);
                            setIsGameOpen(true);
                          }}
                          className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/50 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                        >
                          <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🏆</span>
                          <h3 className="font-bold text-white text-xs">Баатрын дүр таах</h3>
                          <p className="text-[10px] text-gray-500 mt-0.5">Luffy, Naruto, Goku</p>
                        </button>
                      </div>

                      {/* Category: Football Game vs AI */}
                      <div className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center">
                        <span className="text-2xl mb-1.5">⚽</span>
                        <h3 className="font-bold text-white text-xs mb-0.5">Хөлбөмбөг (vs AI)</h3>
                        <p className="text-[10px] text-gray-400 mb-2">Тоглогчийн тоог сонгоно уу</p>
                        <div className="flex items-center gap-2 mb-3">
                          <button
                            onClick={() => setFbTeamSize(1)}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                              fbTeamSize === 1 ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            1 vs 1
                          </button>
                          <button
                            onClick={() => setFbTeamSize(2)}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                              fbTeamSize === 2 ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            2 vs 2
                          </button>
                          <button
                            onClick={() => setFbTeamSize(6)}
                            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                              fbTeamSize === 6 ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            6 vs 6
                          </button>
                        </div>
                        <button
                          onClick={() => setSelectedCategory('football')}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-full text-xs transition-all shadow-lg shadow-red-600/30 cursor-pointer"
                        >
                          Хөлбөмбөг эхлүүлэх ⚽
                        </button>
                      </div>


                    </div>

                    {/* Right: Prominent Leaderboard */}
                    <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-4 max-h-[460px] overflow-hidden">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Trophy size={18} className="text-amber-400" />
                          <h3 className="font-extrabold text-white text-sm">Топ 10 Шилдэг Жагсаалт</h3>
                        </div>
                        <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/10 text-[10px]">
                          <button
                            onClick={() => setActiveLeaderboardTab('anime')}
                            className={`px-2.5 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                              activeLeaderboardTab === 'anime' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            🎌 Аниме
                          </button>
                          <button
                            onClick={() => setActiveLeaderboardTab('football')}
                            className={`px-2.5 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                              activeLeaderboardTab === 'football' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            ⚽ Хөлбөмбөг
                          </button>
                        </div>
                      </div>

                      {activeLeaderboardTab === 'anime' ? (
                        <>
                          <div className="flex bg-white/5 p-0.5 rounded-xl mb-3 border border-white/5 text-[10px]">
                            <button
                              onClick={() => setLeaderboardCategoryFilter('all')}
                              className={`flex-1 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                leaderboardCategoryFilter === 'all' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              Бүгд
                            </button>
                            <button
                              onClick={() => setLeaderboardCategoryFilter('emoji')}
                              className={`flex-1 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                leaderboardCategoryFilter === 'emoji' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              Эможи
                            </button>
                            <button
                              onClick={() => setLeaderboardCategoryFilter('character')}
                              className={`flex-1 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                leaderboardCategoryFilter === 'character' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              Дүр
                            </button>
                          </div>

                          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
                            {leaderboard.filter(entry => leaderboardCategoryFilter === 'all' || entry.category === leaderboardCategoryFilter).length === 0 ? (
                              <div className="text-center py-6 text-gray-500 text-xs">Одоогоор оноо байхгүй байна. 🚀</div>
                            ) : (
                              leaderboard
                                .filter(entry => leaderboardCategoryFilter === 'all' || entry.category === leaderboardCategoryFilter)
                                .slice(0, 10)
                                .map((entry, idx) => {
                                  const isTop3 = idx < 3;
                                  const medalColors = ['from-yellow-400 to-amber-500 text-black', 'from-slate-300 to-slate-400 text-black', 'from-amber-600 to-amber-800 text-white'];
                                  return (
                                    <div
                                      key={entry.id}
                                      className="flex items-center justify-between p-2.5 rounded-xl border bg-white/5 border-white/5 text-xs"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        {isTop3 ? (
                                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${medalColors[idx]} font-black text-[10px] flex items-center justify-center shrink-0`}>
                                            {idx + 1}
                                          </div>
                                        ) : (
                                          <div className="w-5 h-5 font-bold text-[10px] text-gray-500 flex items-center justify-center shrink-0">
                                            {idx + 1}
                                          </div>
                                        )}
                                        <span className="font-bold text-white truncate text-xs">
                                          {entry.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-[9px] bg-red-500/10 px-1 py-0.5 rounded text-red-400">
                                          {entry.category === 'character' ? 'Дүр' : 'Эможи'}
                                        </span>
                                        <span className="font-mono text-xs font-black text-amber-400">
                                          {entry.score}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
                          {footballLeaderboard.length === 0 ? (
                            <div className="text-center py-6 text-gray-500 text-xs">Хөлбөмбөгийн оноо одоогоор алга. ⚽</div>
                          ) : (
                            footballLeaderboard.slice(0, 10).map((entry, idx) => {
                              const isTop3 = idx < 3;
                              const medalColors = ['from-yellow-400 to-amber-500 text-black', 'from-slate-300 to-slate-400 text-black', 'from-amber-600 to-amber-800 text-white'];
                              return (
                                <div
                                  key={entry.id}
                                  className="flex items-center justify-between p-2.5 rounded-xl border bg-white/5 border-white/5 text-xs"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {isTop3 ? (
                                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${medalColors[idx]} font-black text-[10px] flex items-center justify-center shrink-0`}>
                                        {idx + 1}
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 font-bold text-[10px] text-gray-500 flex items-center justify-center shrink-0">
                                        {idx + 1}
                                      </div>
                                    )}
                                    <span className="font-bold text-white truncate text-xs">
                                      {entry.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0 text-[11px]">
                                    <span className="text-[9px] bg-green-500/10 px-1 py-0.5 rounded text-green-400">
                                      {entry.teamSize}v{entry.teamSize}
                                    </span>
                                    <span className="font-mono text-amber-400 font-bold">
                                      {entry.score}-{entry.aiScore}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : lives <= 0 ? (
                  <div className="flex flex-col items-center text-center py-6 animate-blur-fade-up max-h-[80vh] overflow-y-auto">
                    <div className="w-20 h-20 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-4 relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-red-600 blur-xl opacity-30 animate-pulse" />
                      <span className="text-4xl">💀</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-1">see your score's!</h2>
                    <p className="text-gray-400 text-sm mb-4">Тоглоом дууслаа! Таны 3 амь дууслаа. Илүү их аниме үзээрэй! 🍿</p>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-sm mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium text-sm">Нийт оноо:</span>
                        <span className="text-2xl font-black text-amber-400">{score}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400 font-medium text-sm">Хариулсан асуулт:</span>
                        <span className="text-base font-bold text-white">{currentQuestionIndex} / {questions.length}</span>
                      </div>
                    </div>

                    {/* Score Submission */}
                    {!scoreSubmitted ? (
                      <div className="bg-white/5 border border-red-500/20 rounded-2xl p-4 w-full max-w-sm mb-4">
                        <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2 text-left">
                          Таны оноо шилдэг жагсаалтад ороход бэлэн байна!
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Нэрээ оруулна уу"
                            maxLength={15}
                            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                          />
                          <button
                            onClick={submitScoreToLeaderboard}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                          >
                            Оруулах 🏆
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-3 w-full max-w-sm mb-4 text-green-400 text-xs font-semibold text-center">
                        ✓ Таны оноо амжилттай хадгалагдлаа!
                      </div>
                    )}

                    <div className="flex gap-3 w-full max-w-sm justify-center">
                      <button
                        onClick={resetGame}
                        className="flex-1 bg-red-600 text-white font-bold rounded-full py-3 hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/30 cursor-pointer text-sm"
                      >
                        Дахин эхлүүлэх 🔄
                      </button>
                    </div>
                  </div>
                ) : currentQuestionIndex >= questions.length ? (
                  <div className="flex flex-col items-center text-center py-6 animate-blur-fade-up max-h-[80vh] overflow-y-auto">
                    <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-4 relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-amber-500 blur-xl opacity-30 animate-pulse" />
                      <Trophy size={40} className="animate-bounce" />
                    </div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 mb-1 animate-pulse">
                      see your score's! 🎉
                    </h2>
                    <p className="text-red-400 font-bold text-sm mb-4">БАЯР ХҮРГЭЕ! Та жинхэнэ Аниме Отаку байна! 👑</p>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-sm mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium text-sm">Эцсийн оноо:</span>
                        <span className="text-2xl font-black text-amber-400">{score}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400 font-medium text-sm">Үлдсэн амь:</span>
                        <span className="text-base font-bold text-red-500">
                          {"❤️".repeat(lives)}
                        </span>
                      </div>
                    </div>

                    {/* Score Submission */}
                    {!scoreSubmitted ? (
                      <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-4 w-full max-w-sm mb-4">
                        <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 text-left">
                          Таны оноо шилдэг жагсаалтад ороход бэлэн байна!
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Нэрээ оруулна уу"
                            maxLength={15}
                            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                          />
                          <button
                            onClick={submitScoreToLeaderboard}
                            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-sm font-black px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                          >
                            Оруулах 🏆
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-3 w-full max-w-sm mb-4 text-green-400 text-xs font-semibold text-center">
                        ✓ Таны оноо амжилттай хадгалагдлаа!
                      </div>
                    )}

                    <div className="flex gap-3 w-full max-w-sm justify-center">
                      <button
                        onClick={resetGame}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black rounded-full py-3 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-amber-500/30 cursor-pointer text-sm"
                      >
                        Дахин тоглох 🔄
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={`question-${currentQuestionIndex}`} className="flex flex-col animate-blur-fade-up max-h-[80vh] overflow-y-auto">
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

                      {!hasAnswered && (
                        <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs">
                          <button
                            onClick={() => {
                              setPlayMode('options');
                              setTimeLeft(15);
                            }}
                            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                              playMode === 'options' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            Сонгох 🎯
                          </button>
                          <button
                            onClick={() => {
                              setPlayMode('type');
                              setTimeLeft(20);
                            }}
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
                            style={{ width: `${(timeLeft / (playMode === 'type' ? 20 : 15)) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Question Display */}
                    {selectedCategory === 'character' ? (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 mb-4 bg-gray-900">
                          <img
                            src={questions[currentQuestionIndex].image}
                            alt="Guess the character"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain bg-black/40"
                          />
                        </div>
                        <div className="text-xs text-amber-400 uppercase tracking-widest mb-1 font-bold">Энэ баатрын нэрийг таана уу?</div>
                        <span className="text-2xl tracking-widest drop-shadow-md font-sans">{questions[currentQuestionIndex].emojis}</span>
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-600/10 to-amber-500/10 blur-sm pointer-events-none" />
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">Дараах эможи аль аниме вэ?</div>
                        <span className="text-5xl sm:text-6xl tracking-widest drop-shadow-md select-all font-sans">{questions[currentQuestionIndex].emojis}</span>
                      </div>
                    )}

                    {/* GAME INPUTS */}
                    {!hasAnswered ? (
                      playMode === 'options' ? (
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
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 animate-blur-fade-up">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 mb-5 group">
                          <img
                            src={questions[currentQuestionIndex].image}
                            alt={questions[currentQuestionIndex].answer}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain bg-black/40 transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-4">
                            <span className="text-xl font-black text-white drop-shadow">
                              {questions[currentQuestionIndex].answer}
                            </span>
                          </div>
                        </div>

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

                        <div className="mt-4">
                          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Аниме Трейлер:</div>
                          <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                            <iframe
                              className="w-full h-full"
                              src={`${questions[currentQuestionIndex].video}?autoplay=1&mute=0`}
                              title={`${questions[currentQuestionIndex].answer} Trailer`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>

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
            ) : (
              <>
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
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-2 rounded-full font-medium liquid-glass px-6 sm:px-8 py-2.5 sm:py-3 text-white hover:text-gray-200 hover:scale-105 active:scale-95 transition-all animate-blur-fade-up cursor-pointer"
                    style={{ animationDelay: '700ms' }}
                  >
                    <Info size={18} className="text-gray-300" />
                    <span>Learn More</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Side - Navigation Arrows & Favorite Movies on Movies Tab */}
          <div className="flex flex-col items-end gap-3 md:w-auto self-end md:self-end">


            <div className="flex items-center gap-3">
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

            {/* GAME SELECTION / STATE ROUTING */}
            {selectedCategory === null ? (
              /* CATEGORY SELECTOR MENU */
              <div className="flex flex-col items-center text-center py-6 animate-blur-fade-up">
                <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-4 relative">
                  <div className="absolute inset-0 rounded-full bg-red-600/30 blur-lg" />
                  <Play size={32} className="fill-red-500 ml-1 relative z-10" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Тоглоомын цэс</h2>
                <p className="text-gray-400 text-sm max-w-sm mb-8 font-medium">Таах горимоо сонгон аниме мэдлэгээ сориорой!</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-8">
                  {/* Category: Emoji */}
                  <button
                    onClick={() => {
                      const filtered = questionsRaw.filter(q => q.category === 'emoji');
                      const processed = filtered.map((q: any) => ({
                        ...q,
                        options: shuffleArray(q.options || [])
                      }));
                      setQuestions(shuffleArray(processed));
                      setCurrentQuestionIndex(0);
                      setSelectedCategory('emoji');
                      setTimeLeft(playMode === 'type' ? 20 : 15);
                    }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/50 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎬</span>
                    <h3 className="font-bold text-white text-base">Аниме Таах (Эможи)</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Эможи хараад анимэг таана</p>
                  </button>

                  {/* Category: Character */}
                  <button
                    onClick={() => {
                      const filtered = questionsRaw.filter(q => q.category === 'character');
                      const processed = filtered.map((q: any) => ({
                        ...q,
                        options: shuffleArray(q.options || [])
                      }));
                      setQuestions(shuffleArray(processed));
                      setCurrentQuestionIndex(0);
                      setSelectedCategory('character');
                      setTimeLeft(playMode === 'type' ? 20 : 15);
                    }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/50 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏆</span>
                    <h3 className="font-bold text-white text-base">Баатрын дүр таах</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Luffy, Naruto, Tanjiro, Goku-г таана</p>
                  </button>
                </div>

                <button
                  onClick={() => setIsGameOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Буцах
                </button>
              </div>
            ) : lives <= 0 ? (
              <div className="flex flex-col items-center text-center py-6 animate-blur-fade-up max-h-[80vh] overflow-y-auto">
                <div className="w-20 h-20 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-4 relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-red-600 blur-xl opacity-30 animate-pulse" />
                  <span className="text-4xl">💀</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-1">see your score's!</h2>
                <p className="text-gray-400 text-sm mb-4">Тоглоом дууслаа! Таны 3 амь дууслаа. Илүү их аниме үзээрэй! 🍿</p>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-sm mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium text-sm">Нийт оноо:</span>
                    <span className="text-2xl font-black text-amber-400">{score}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 font-medium text-sm">Хариулсан асуулт:</span>
                    <span className="text-base font-bold text-white">{currentQuestionIndex} / {questions.length}</span>
                  </div>
                </div>

                {/* Score Submission */}
                {!scoreSubmitted ? (
                  <div className="bg-white/5 border border-red-500/20 rounded-2xl p-4 w-full max-w-sm mb-4">
                    <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2 text-left">
                      Таны оноо шилдэг жагсаалтад ороход бэлэн байна!
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Нэрээ оруулна уу"
                        maxLength={15}
                        className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                      />
                      <button
                        onClick={submitScoreToLeaderboard}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                      >
                        Оруулах 🏆
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-3 w-full max-w-sm mb-4 text-green-400 text-xs font-semibold text-center">
                    ✓ Таны оноо амжилттай хадгалагдлаа!
                  </div>
                )}

                {/* Mini Leaderboard */}
                <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                    <span>🏆 Шилдэг тоглогчид</span>
                    <span>Оноо</span>
                  </div>

                  {/* Mini Filter Tabs */}
                  <div className="flex bg-white/5 p-1 rounded-xl mb-3 border border-white/5 text-[11px]">
                    <button
                      onClick={() => setLeaderboardCategoryFilter('all')}
                      className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                        leaderboardCategoryFilter === 'all'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Бүгд
                    </button>
                    <button
                      onClick={() => setLeaderboardCategoryFilter('emoji')}
                      className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                        leaderboardCategoryFilter === 'emoji'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Эможи
                    </button>
                    <button
                      onClick={() => setLeaderboardCategoryFilter('character')}
                      className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                        leaderboardCategoryFilter === 'character'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Дүр (Chapter)
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {leaderboard.filter(entry => leaderboardCategoryFilter === 'all' || entry.category === leaderboardCategoryFilter).length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-xs">Одоогоор оноо байхгүй байна.</div>
                    ) : (
                      leaderboard
                        .filter(entry => leaderboardCategoryFilter === 'all' || entry.category === leaderboardCategoryFilter)
                        .slice(0, 5)
                        .map((entry, idx) => (
                          <div
                            key={entry.id}
                            className={`flex justify-between items-center text-xs py-1.5 px-2 rounded-lg ${
                              entry.id === leaderboard.find(e => e.name === playerName && e.score === score)?.id
                                ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30 animate-pulse'
                                : 'text-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-gray-500 font-bold">{idx + 1}.</span>
                              <span className="truncate max-w-[120px]">{entry.name}</span>
                              <span className="text-[10px] bg-white/10 text-gray-400 px-1.5 py-0.2 rounded-full font-mono scale-90 shrink-0">
                                {entry.playMode === 'type' ? 'Бичих' : 'Сонгох'}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-amber-400 shrink-0">{entry.score}</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div className="flex gap-3 w-full max-w-sm justify-center">
                  <button
                    onClick={resetGame}
                    className="flex-1 bg-red-600 text-white font-bold rounded-full py-3 hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/30 cursor-pointer text-sm"
                  >
                    Дахин эхлүүлэх 🔄
                  </button>
                  <button
                    onClick={() => {
                      setIsGameOpen(false);
                      resetGame();
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-full py-3 transition-all cursor-pointer text-sm"
                  >
                    Буцах
                  </button>
                </div>
              </div>
            ) : currentQuestionIndex >= questions.length ? (
              /* GAME STATE: VICTORY */
              <div className="flex flex-col items-center text-center py-6 animate-blur-fade-up max-h-[80vh] overflow-y-auto">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-4 relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-amber-500 blur-xl opacity-30 animate-pulse" />
                  <Trophy size={40} className="animate-bounce" />
                </div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 mb-1 animate-pulse">
                  see your score's! 🎉
                </h2>
                <p className="text-red-400 font-bold text-sm mb-4">БАЯР ХҮРГЭЕ! Та жинхэнэ Аниме Отаку байна! 👑</p>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-sm mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium text-sm">Эцсийн оноо:</span>
                    <span className="text-2xl font-black text-amber-400">{score}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 font-medium text-sm">Үлдсэн амь:</span>
                    <span className="text-base font-bold text-red-500">
                      {"❤️".repeat(lives)}
                    </span>
                  </div>
                </div>

                {/* Score Submission */}
                {!scoreSubmitted ? (
                  <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-4 w-full max-w-sm mb-4">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 text-left">
                      Таны оноо шилдэг жагсаалтад ороход бэлэн байна!
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Нэрээ оруулна уу"
                        maxLength={15}
                        className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={submitScoreToLeaderboard}
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-sm font-black px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                      >
                        Оруулах 🏆
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-3 w-full max-w-sm mb-4 text-green-400 text-xs font-semibold text-center">
                    ✓ Таны оноо амжилттай хадгалагдлаа!
                  </div>
                )}

                {/* Mini Leaderboard */}
                <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                    <span>🏆 Шилдэг тоглогчид</span>
                    <span>Оноо</span>
                  </div>

                  {/* Mini Filter Tabs */}
                  <div className="flex bg-white/5 p-1 rounded-xl mb-3 border border-white/5 text-[11px]">
                    <button
                      onClick={() => setLeaderboardCategoryFilter('all')}
                      className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                        leaderboardCategoryFilter === 'all'
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Бүгд
                    </button>
                    <button
                      onClick={() => setLeaderboardCategoryFilter('emoji')}
                      className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                        leaderboardCategoryFilter === 'emoji'
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Эможи
                    </button>
                    <button
                      onClick={() => setLeaderboardCategoryFilter('character')}
                      className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                        leaderboardCategoryFilter === 'character'
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Дүр (Chapter)
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {leaderboard.filter(entry => leaderboardCategoryFilter === 'all' || entry.category === leaderboardCategoryFilter).length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-xs">Одоогоор оноо байхгүй байна.</div>
                    ) : (
                      leaderboard
                        .filter(entry => leaderboardCategoryFilter === 'all' || entry.category === leaderboardCategoryFilter)
                        .slice(0, 5)
                        .map((entry, idx) => (
                          <div
                            key={entry.id}
                            className={`flex justify-between items-center text-xs py-1.5 px-2 rounded-lg ${
                              entry.id === leaderboard.find(e => e.name === playerName && e.score === score)?.id
                                ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-500/30 animate-pulse'
                                : 'text-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-gray-500 font-bold">{idx + 1}.</span>
                              <span className="truncate max-w-[120px]">{entry.name}</span>
                              <span className="text-[10px] bg-white/10 text-gray-400 px-1.5 py-0.2 rounded-full font-mono scale-90 shrink-0">
                                {entry.playMode === 'type' ? 'Бичих' : 'Сонгох'}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-amber-400 shrink-0">{entry.score}</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div className="flex gap-3 w-full max-w-sm justify-center">
                  <button
                    onClick={resetGame}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black rounded-full py-3 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-amber-500/30 cursor-pointer text-sm"
                  >
                    Дахин тоглох 🔄
                  </button>
                  <button
                    onClick={() => {
                      setIsGameOpen(false);
                      resetGame();
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-full py-3 transition-all cursor-pointer text-sm"
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
                        onClick={() => {
                          setPlayMode('options');
                          setTimeLeft(15);
                        }}
                        className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                          playMode === 'options' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Сонгох 🎯
                      </button>
                      <button
                        onClick={() => {
                          setPlayMode('type');
                          setTimeLeft(20);
                        }}
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
                        style={{ width: `${(timeLeft / (playMode === 'type' ? 20 : 15)) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Question Display */}
                {selectedCategory === 'character' ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 mb-4 bg-gray-900">
                      <img
                        src={questions[currentQuestionIndex].image}
                        alt="Guess the character"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain bg-black/40"
                      />
                    </div>
                    <div className="text-xs text-amber-400 uppercase tracking-widest mb-1 font-bold">Энэ баатрын нэрийг таана уу?</div>
                    <span className="text-2xl tracking-widest drop-shadow-md font-sans">{questions[currentQuestionIndex].emojis}</span>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-600/10 to-amber-500/10 blur-sm pointer-events-none" />
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">Дараах эможи аль аниме вэ?</div>
                    <span className="text-5xl sm:text-6xl tracking-widest drop-shadow-md select-all font-sans">{questions[currentQuestionIndex].emojis}</span>
                  </div>
                )}

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
                    
                    {/* Anime Image (At the Top) */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 mb-5 group">
                      <img
                        src={questions[currentQuestionIndex].image}
                        alt={questions[currentQuestionIndex].answer}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain bg-black/40 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-4">
                        <span className="text-xl font-black text-white drop-shadow">
                          {questions[currentQuestionIndex].answer}
                        </span>
                      </div>
                    </div>

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

                    {/* YouTube Video Embed (Below Feedback, Full-Width) */}
                    <div className="mt-4">
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Аниме Трейлер:</div>
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black">
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

      {/* MOVIE IMAGE POPUP MODAL */}
      {selectedMoviePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in">
          <div className="relative w-full max-w-lg bg-gray-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 text-center animate-blur-fade-up">
            <button
              onClick={() => setSelectedMoviePopup(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white z-10 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-lg">
              <img
                src={selectedMoviePopup.image}
                alt={selectedMoviePopup.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="flex items-center justify-between w-full">
                  <span className="bg-red-600/90 text-white font-bold px-3 py-1 rounded-xl text-xs backdrop-blur-md">
                    {selectedMoviePopup.genre}
                  </span>
                  <span className="text-amber-400 font-mono font-black text-sm bg-black/60 px-3 py-1 rounded-xl backdrop-blur-md">
                    ★ {selectedMoviePopup.rating} IMDB
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-black text-white mb-2">{selectedMoviePopup.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
              {selectedMoviePopup.desc}
            </p>

            <button
              onClick={() => setSelectedMoviePopup(null)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-red-600/30 cursor-pointer"
            >
              Хаах (Буцах)
            </button>
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

      {/* LEADERBOARD MODAL */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in animate-blur-fade-up">
          <div className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col max-h-[85vh]">
            <button
              onClick={() => setIsLeaderboardOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-amber-500 blur-xl opacity-30 animate-pulse" />
                <Trophy size={32} className="animate-bounce" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Шилдэг Тоглогчдын Жагсаалт</h2>
              <p className="text-gray-400 text-sm mt-1">Отаку болон Хөлбөмбөгийн топ 10 жагсаалт</p>
            </div>

            {/* Main Leaderboard Tab (Anime vs Football) */}
            <div className="flex bg-white/5 p-1 rounded-2xl mb-4 border border-white/10">
              <button
                onClick={() => setActiveLeaderboardTab('anime')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeLeaderboardTab === 'anime'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                🎌 Аниме Таавар
              </button>
              <button
                onClick={() => setActiveLeaderboardTab('football')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeLeaderboardTab === 'football'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                ⚽ Хөлбөмбөг (Top 10)
              </button>
            </div>

            {activeLeaderboardTab === 'anime' ? (
              <>
                {/* Category Filter Tabs */}
                <div className="flex bg-white/5 p-1 rounded-2xl mb-4 border border-white/5">
                  <button
                    onClick={() => setLeaderboardCategoryFilter('all')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      leaderboardCategoryFilter === 'all'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Бүгд (All)
                  </button>
                  <button
                    onClick={() => setLeaderboardCategoryFilter('emoji')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      leaderboardCategoryFilter === 'emoji'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Эможи (Emoji)
                  </button>
                  <button
                    onClick={() => setLeaderboardCategoryFilter('character')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      leaderboardCategoryFilter === 'character'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Дүр (Character)
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-6">
                  {leaderboard.filter(entry => leaderboardCategoryFilter === 'all' || entry.category === leaderboardCategoryFilter).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">Одоогоор энэ ангилалд оноо байхгүй байна. 🚀</div>
                  ) : (
                    leaderboard
                      .filter(entry => leaderboardCategoryFilter === 'all' || entry.category === leaderboardCategoryFilter)
                      .slice(0, 10)
                      .map((entry, idx) => {
                        const isTop3 = idx < 3;
                        const medalColors = ['from-yellow-400 to-amber-500 text-black', 'from-slate-300 to-slate-400 text-black', 'from-amber-600 to-amber-800 text-white'];
                        return (
                          <div
                            key={entry.id}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                              entry.name.includes("Наран Од")
                                ? 'bg-red-600/10 border-red-500/30'
                                : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {isTop3 ? (
                                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${medalColors[idx]} font-black text-xs flex items-center justify-center shrink-0`}>
                                  {idx + 1}
                                </div>
                              ) : (
                                <div className="w-7 h-7 font-bold text-xs text-gray-500 flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </div>
                              )}
                              <span className="font-bold text-white truncate text-sm sm:text-base">
                                {entry.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                              <span className="text-[10px] bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full text-red-400 font-medium scale-90 shrink-0">
                                {entry.category === 'character' ? 'Дүр' : 'Эможи'}
                              </span>
                              <span className="text-[10px] sm:text-xs bg-white/5 border border-white/10 px-1.5 sm:px-2 py-0.5 rounded-full text-gray-400 font-mono">
                                {entry.playMode === 'type' ? 'Бичих ✍️' : 'Сонгох 🎯'}
                              </span>
                              <span className="font-mono text-sm sm:text-base font-black text-amber-400 ml-1">
                                {entry.score}
                              </span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-6">
                {footballLeaderboard.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">Хөлбөмбөгийн оноо одоогоор бүртгэгдээгүй байна. ⚽</div>
                ) : (
                  footballLeaderboard.slice(0, 10).map((entry, idx) => {
                    const isTop3 = idx < 3;
                    const medalColors = ['from-yellow-400 to-amber-500 text-black', 'from-slate-300 to-slate-400 text-black', 'from-amber-600 to-amber-800 text-white'];
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl border bg-white/5 border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isTop3 ? (
                            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${medalColors[idx]} font-black text-xs flex items-center justify-center shrink-0`}>
                              {idx + 1}
                            </div>
                          ) : (
                            <div className="w-7 h-7 font-bold text-xs text-gray-500 flex items-center justify-center shrink-0">
                              {idx + 1}
                            </div>
                          )}
                          <span className="font-bold text-white truncate text-sm sm:text-base">
                            {entry.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full text-green-400 font-medium">
                            {entry.teamSize} vs {entry.teamSize}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            Гоол: <strong className="text-white">{entry.score}</strong> - {entry.aiScore}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            <button
              onClick={() => setIsLeaderboardOpen(false)}
              className="w-full py-3.5 rounded-full bg-white text-black font-bold tracking-wide hover:bg-gray-200 active:scale-98 transition-all shadow-lg cursor-pointer shrink-0"
            >
              Хаах (Тоглоом руу буцах)
            </button>
          </div>
        </div>
      )}

      {/* Persistent Floating Widgets (Hidden when playing games for clean fullscreen experience) */}
      {!isGameOpen && selectedCategory === null && (
        <>
          <div className="fixed top-4 right-4 z-50 bg-gray-900/90 border border-blue-500/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-400 relative shrink-0">
              {isSonicPlaying && (
                <div className="absolute inset-0 rounded-xl bg-blue-500 animate-ping opacity-25" />
              )}
              <span className="text-lg">🦔</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                Sonic Green Hill <span className="text-[10px] text-blue-400 font-mono">([M])</span>
              </div>
              <div className="text-[10px] text-gray-400">
                {isSonicPlaying ? '🎵 Тоглож байна...' : '⏸️ Зогссон'}
              </div>
            </div>
            <button
              onClick={() => setIsSonicPlaying(!isSonicPlaying)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                isSonicPlaying 
                  ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/30' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
              }`}
            >
              {isSonicPlaying ? '⏸️ Зогсоох' : '▶️ Тоглуулах'}
            </button>
          </div>

          <div className="fixed bottom-4 right-4 z-40 bg-black/80 border border-amber-500/30 rounded-2xl p-3.5 backdrop-blur-xl shadow-2xl w-64 sm:w-72">
            <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs mb-2.5 pb-1.5 border-b border-white/10">
              <Film size={14} className="text-amber-400" />
              <span>Наран одын дуртай кинонууд 🍿</span>
            </div>
            <div className="space-y-1.5">
              {favoriteMovies.map((movie, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedMoviePopup(movie)}
                  className="flex items-center justify-between text-[11px] bg-white/5 hover:bg-white/15 p-2 rounded-xl transition-all border border-white/5 cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-gray-500 font-bold">{idx + 1}.</span>
                    <span className="font-bold text-white truncate max-w-[130px] group-hover:text-red-400 transition-colors">{movie.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] text-gray-400 bg-white/10 px-1.5 py-0.5 rounded font-medium">{movie.genre}</span>
                    <span className="text-amber-400 font-mono font-bold">★ {movie.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

