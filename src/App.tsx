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

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const current = slides[activeSlide];

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
                onClick={() => setIsPlayingModalOpen(true)}
                className="flex items-center gap-2.5 bg-white text-black rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 animate-blur-fade-up cursor-pointer"
                style={{ animationDelay: '600ms' }}
              >
                <Play size={18} className="fill-black text-black" />
                <span>Watch Now</span>
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

