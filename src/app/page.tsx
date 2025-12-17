"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Settings, X, CheckCircle, Globe, Check, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";
import ExternalBanner from "../components/ExternalBanner";
// Supabase 관련 기능 추가 (문지기)
// Supabase 관련 기능 추가 (문지기)
import { createClient, Session } from '@supabase/supabase-js';

// --- Types ---
type MoodType = "Happy" | "Calm" | "Tired" | "Sad" | "Angry";
type LangType = "en" | "ko";
interface Task { id: string; text: string; duration: string; }
interface HistoryItem { date: string; mood: MoodType; doneCount: number; }

// 로컬 음원 파일 연결
const SOUNDS: Record<MoodType, string> = {
  Happy: "/sounds/happy_bgm.mp3",
  Calm: "/sounds/calm_forest.mp3",
  Tired: "/sounds/tired_ocean.mp3",
  Sad: "/sounds/sad_rain.mp3",
  Angry: "/sounds/angry_river.mp3"
};

const INSIGHTS = {
  Happy: { en: ["Your joy is a melody today.", "Shine on, brilliant soul."], ko: ["당신의 기쁨은 오늘 세상이 듣고 싶은 노래예요.", "태양도 당신의 빛을 부러워하네요."] },
  Calm: { en: ["Stillness is full of answers.", "Breathe in the universe."], ko: ["고요함 속에 해답이 있습니다.", "우주를 들이마시고 걱정을 내뱉으세요."] },
  Tired: { en: ["Rest is productive too.", "Unplug and recharge."], ko: ["휴식도 소중한 생산입니다.", "잠시 멈춰도 괜찮아요."] },
  Sad: { en: ["Tears water the soul.", "It rains before the rainbow."], ko: ["눈물은 마음의 정원을 적셔줍니다.", "비 온 뒤에 무지개가 뜨니까요."] },
  Angry: { en: ["Protect your peace.", "Breathe out the fire."], ko: ["당신의 평화를 지키세요.", "뜨거운 숨을 천천히 내뱉어보세요."] }
};

const TASKS: Record<MoodType, Record<LangType, Task[]>> = {
  Happy: {
    en: [{ id: "h1", text: "Smile in mirror", duration: "1" }, { id: "h2", text: "Write gratitude", duration: "3" }, { id: "h3", text: "Listen to upbeat song", duration: "4" }, { id: "h4", text: "Compliment yourself", duration: "1" }, { id: "h5", text: "Light dance", duration: "2" }],
    ko: [{ id: "h1", text: "거울 보고 활짝 웃기", duration: "1" }, { id: "h2", text: "감사 일기 쓰기", duration: "3" }, { id: "h3", text: "신나는 노래 듣기", duration: "4" }, { id: "h4", text: "나에게 칭찬하기", duration: "1" }, { id: "h5", text: "가벼운 춤추기", duration: "2" }]
  },
  Calm: {
    en: [{ id: "c1", text: "Deep breathing", duration: "2" }, { id: "c2", text: "Drink warm tea", duration: "5" }, { id: "c3", text: "Look at sky", duration: "3" }, { id: "c4", text: "Neck stretch", duration: "1" }, { id: "c5", text: "Meditation", duration: "5" }],
    ko: [{ id: "c1", text: "깊은 심호흡 3번", duration: "2" }, { id: "c2", text: "따뜻한 차 마시기", duration: "5" }, { id: "c3", text: "창밖 바라보기", duration: "3" }, { id: "c4", text: "목 스트레칭", duration: "1" }, { id: "c5", text: "명상하기", duration: "5" }]
  },
  Tired: {
    en: [{ id: "t1", text: "Close eyes 5min", duration: "5" }, { id: "t2", text: "Drink water", duration: "1" }, { id: "t3", text: "Massage shoulders", duration: "2" }, { id: "t4", text: "Smell nice scent", duration: "1" }, { id: "t5", text: "Lie down & relax", duration: "10" }],
    ko: [{ id: "t1", text: "5분간 눈 감기", duration: "5" }, { id: "t2", text: "물 한 잔 마시기", duration: "1" }, { id: "t3", text: "어깨 주무르기", duration: "2" }, { id: "t4", text: "좋아하는 향기 맡기", duration: "1" }, { id: "t5", text: "누워서 멍 때리기", duration: "10" }]
  },
  Sad: {
    en: [{ id: "s1", text: "Hug yourself", duration: "1" }, { id: "s2", text: "Write feelings", duration: "5" }, { id: "s3", text: "Warm shower", duration: "10" }, { id: "s4", text: "Wrap in blanket", duration: "5" }, { id: "s5", text: "Drink warm milk", duration: "3" }],
    ko: [{ id: "s1", text: "나를 안아주기", duration: "1" }, { id: "s2", text: "감정 적어보기", duration: "5" }, { id: "s3", text: "따뜻한 샤워", duration: "10" }, { id: "s4", text: "부드러운 이불 덮기", duration: "5" }, { id: "s5", text: "따뜻한 우유 마시기", duration: "3" }]
  },
  Angry: {
    en: [{ id: "a1", text: "Count to 10", duration: "1" }, { id: "a2", text: "Wash face cold water", duration: "2" }, { id: "a3", text: "Scribble on paper", duration: "3" }, { id: "a4", text: "Listen fast music", duration: "4" }, { id: "a5", text: "Deep breaths", duration: "2" }],
    ko: [{ id: "a1", text: "숫자 10 세기", duration: "1" }, { id: "a2", text: "찬물로 세수하기", duration: "2" }, { id: "a3", text: "종이에 낙서하기", duration: "3" }, { id: "a4", text: "빠른 음악 듣기", duration: "4" }, { id: "a5", text: "크게 심호흡", duration: "2" }]
  }
};

// --- Components ---

const CalendarModal = ({ isOpen, onClose, history }: { isOpen: boolean; onClose: () => void; history: HistoryItem[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen) return null;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay, year, month };
  };

  const { days, firstDay, year, month } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDayContent = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = history.find(h => h.date === dateStr);

    if (!record) return null;

    if (record.doneCount >= 5) return <span className="text-xl">🍎</span>;
    if (record.doneCount >= 1) return <span className="text-xl">🌱</span>;

    // Mood only
    const colors: Record<MoodType, string> = {
      Happy: "bg-yellow-400", Calm: "bg-green-400", Tired: "bg-purple-400", Sad: "bg-blue-400", Angry: "bg-red-400"
    };
    return <div className={`w-3 h-3 rounded-full ${colors[record.mood]}`} />;
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#FDFBF7] w-full max-w-sm p-6 rounded-3xl shadow-2xl relative border-4 border-[#EBE9E1]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>

        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-[#556B2F]">이모지 정원 🌿</h3>
          <p className="text-xs text-gray-500 mt-1">꾸준히 심어서 숲을 만들어보세요!</p>
        </div>

        <div className="flex justify-between items-center mb-4 px-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} className="text-gray-600" /></button>
          <span className="font-bold text-gray-800 text-lg">{year}. {String(month + 1).padStart(2, '0')}</span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={20} className="text-gray-600" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-xs font-bold text-gray-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = history.find(h => h.date === dateStr);
            return (
              <div key={day} className="aspect-square flex items-center justify-center bg-white rounded-xl border border-gray-100 text-sm text-gray-600 relative">
                <span className="absolute top-1 left-1 text-[10px] text-gray-300">{day}</span>
                {getDayContent(day)}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

const FocusTimerModal = ({ isOpen, onClose, onComplete, task, mood }: any) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen && task) {
      setTimeLeft(parseInt(task.duration) * 60);
      setIsActive(false);
      if (mood && SOUNDS[mood as MoodType]) {
        audioRef.current = new Audio(SOUNDS[mood as MoodType]);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
      }
    }
    return () => { audioRef.current?.pause(); };
  }, [isOpen, task, mood]);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      audioRef.current?.play().catch(() => { });
    } else if (timeLeft === 0) {
      setIsActive(false);
      audioRef.current?.pause();
    } else {
      audioRef.current?.pause();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  if (!isOpen) return null;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-3xl text-center w-full max-w-sm relative shadow-2xl border-4 border-[#EBE9E1]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><X /></button>
        <h3 className="text-xl font-bold mb-4 text-gray-800">{task.text}</h3>
        <div className="text-7xl font-mono font-bold text-gray-700 mb-8">{formatTime(timeLeft)}</div>

        {timeLeft > 0 ? (
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsActive(!isActive)} className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-white text-3xl shadow-lg transition ${isActive ? "bg-amber-400" : "bg-[#D4E157]"}`}>
            {isActive ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
          </motion.button>
        ) : (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={onComplete} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg">
            <CheckCircle /> 완료! (Done)
          </motion.button>
        )}
        <p className="mt-6 text-sm text-gray-500 font-medium">{isActive ? "🎶 힐링 사운드 재생 중..." : "시작 버튼을 눌러주세요"}</p>
      </motion.div>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, onComplete }: any) => {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<string[]>([]);

  const qs = [
    // E vs I
    { l: "에너지 (Energy) 1/2", o: [{ t: "친구들과 수다떨며 충전", v: "E" }, { t: "혼자만의 시간으로 충전", v: "I" }] },
    { l: "에너지 (Energy) 2/2", o: [{ t: "생각나는 대로 바로 말함", v: "E" }, { t: "생각을 정리한 뒤 말함", v: "I" }] },
    // S vs N
    { l: "인식 (Mind) 1/2", o: [{ t: "오감과 실제 경험 의존", v: "S" }, { t: "직관과 영감에 의존", v: "N" }] },
    { l: "인식 (Mind) 2/2", o: [{ t: "현재와 현실에 집중", v: "S" }, { t: "미래와 가능성에 집중", v: "N" }] },
    // T vs F
    { l: "판단 (Heart) 1/2", o: [{ t: "논리와 사실 중심 판단", v: "T" }, { t: "사람과 관계 중심 판단", v: "F" }] },
    { l: "판단 (Heart) 2/2", o: [{ t: "친구가 우울하면 해결책 제시", v: "T" }, { t: "우선 공감하고 위로함", v: "F" }] },
    // J vs P
    { l: "생활 (Life) 1/2", o: [{ t: "여행은 철저하게 계획", v: "J" }, { t: "발길 닿는 대로 즉흥적", v: "P" }] },
    { l: "생활 (Life) 2/2", o: [{ t: "일은 미리미리 끝냄", v: "J" }, { t: "임박했을 때 스퍼트", v: "P" }] }
  ];

  const calculateMBTI = (answers: string[]) => {
    const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    answers.forEach(a => counts[a] = (counts[a] || 0) + 1);

    // Tie-breaker: defaults to E, S, T, J if counts are equal
    const m1 = counts['E'] >= counts['I'] ? 'E' : 'I';
    const m2 = counts['S'] >= counts['N'] ? 'S' : 'N';
    const m3 = counts['T'] >= counts['F'] ? 'T' : 'F';
    const m4 = counts['J'] >= counts['P'] ? 'J' : 'P';

    return m1 + m2 + m3 + m4;
  };

  const handleSelect = (val: string) => {
    const n = [...sel, val]; setSel(n);
    if (step < 7) {
      setStep(step + 1);
    } else {
      const result = calculateMBTI(n);
      onComplete(result);
      onClose();
      setStep(0);
      setSel([]);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl relative">
        <div className="flex justify-between mb-6">
          <h3 className="font-bold text-gray-800">성향 체크 ({step + 1}/{qs.length})</h3>
          <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
        </div>
        <h4 className="text-xl font-bold text-center mb-10 text-[#D4E157]">{qs[step].l}</h4>
        <div className="space-y-4">
          {qs[step].o.map(o => (
            <button key={o.v} onClick={() => handleSelect(o.v)} className="w-full p-5 border-2 border-gray-100 rounded-2xl hover:border-[#D4E157] hover:bg-[#F9FBE7] text-left font-bold text-gray-600 flex justify-between transition-all">
              <span className="text-sm">{o.t}</span><span className="text-gray-300 font-mono text-lg">{o.v}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const OnboardingModal = ({ isOpen, onComplete }: any) => {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<string[]>([]);
  const qs = [
    { l: "에너지 (Energy)", o: [{ t: "사람들과 함께", v: "E" }, { t: "혼자만의 시간", v: "I" }] },
    { l: "인식 (Mind)", o: [{ t: "현실적", v: "S" }, { t: "직관/상상", v: "N" }] },
    { l: "판단 (Heart)", o: [{ t: "논리적", v: "T" }, { t: "감정적", v: "F" }] },
    { l: "생활 (Life)", o: [{ t: "계획적", v: "J" }, { t: "즉흥적", v: "P" }] }
  ];
  const handleSelect = (val: string) => {
    const n = [...sel, val]; setSel(n);
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(n.join(""));
      setStep(0);
      setSel([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl relative">
        <div className="flex justify-between mb-6">
          <h3 className="font-bold text-gray-800">환영합니다! ({step + 1}/4)</h3>
          {/* No 'Close' button as this is mandatory */}
        </div>
        <h4 className="text-2xl font-bold text-center mb-10 text-[#D4E157]">{qs[step].l}</h4>
        <div className="space-y-4">
          {qs[step].o.map(o => (
            <button key={o.v} onClick={() => handleSelect(o.v)} className="w-full p-5 border-2 border-gray-100 rounded-2xl hover:border-[#D4E157] hover:bg-[#F9FBE7] text-left font-bold text-gray-600 flex justify-between transition-all">
              <span>{o.t}</span><span className="text-gray-300 font-mono text-lg">{o.v}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  // [1] 로그인 세션 상태 추가
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const [mood, setMood] = useState<MoodType | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [mbti, setMbti] = useState<string | null>(null);
  const [lang, setLang] = useState<LangType>("ko");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [doneTasks, setDoneTasks] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [insight, setInsight] = useState("오늘 기분은 어떠신가요?");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState<string | null>(null); // Toast message state
  useEffect(() => {
    // Auto-Onboarding: Check conditions
    // 1. Logged in (session exists)
    // 2. No MBTI state
    // 3. No MBTI in localStorage
    const localMbti = localStorage.getItem("mbti");
    if (session && !mbti && !localMbti) {
      setIsSettingsOpen(true);
    }
  }, [session, mbti]);

  useEffect(() => {
    // [2] 페이지 로드 시 로그인 여부 체크
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    checkSession();

    if (typeof window !== 'undefined') {
      const savedMbti = localStorage.getItem("mbti");
      if (savedMbti) setMbti(savedMbti);

      // Timezone Reset & Load Logic
      const todayStr = new Date().toISOString().split('T')[0];
      const lastVisitDate = localStorage.getItem("lastVisitDate");

      if (lastVisitDate !== todayStr) {
        // New Day: Reset doneTasks
        setDoneTasks([]);
        localStorage.removeItem("doneTasks");
        localStorage.setItem("lastVisitDate", todayStr);
      } else {
        // Same Day: Load doneTasks
        const savedDoneTasks = localStorage.getItem("doneTasks");
        if (savedDoneTasks) setDoneTasks(JSON.parse(savedDoneTasks));
      }

      // Load History
      const savedHistory = localStorage.getItem("history");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);

        const todayRecord = parsed.find((h: HistoryItem) => h.date === todayStr);
        if (todayRecord) {
          setMood(todayRecord.mood);
        }
      }

      navigator.geolocation?.getCurrentPosition(async p => {
        try {
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${p.coords.latitude}&lon=${p.coords.longitude}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`);
          const data = await res.json();
          setWeather({ temp: Math.round(data.main.temp), city: data.name, icon: data.weather[0].icon, type: data.weather[0].main });
        } catch (e) { console.error("Weather error", e); }
      });
    }
  }, []);

  useEffect(() => {
    if (mood) {
      const msgs = INSIGHTS[mood][lang];
      setInsight(msgs[Math.floor(Math.random() * msgs.length)]);
      setTasks(TASKS[mood][lang]);
    }
  }, [mood, lang]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const saveHistory = (newMood: MoodType, count: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newRecord: HistoryItem = { date: todayStr, mood: newMood, doneCount: count };

    setHistory(prev => {
      const filtered = prev.filter(h => h.date !== todayStr);
      const updated = [...filtered, newRecord];
      localStorage.setItem("history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleMoodSelect = (selectedMood: MoodType) => {
    setMood(selectedMood);
    saveHistory(selectedMood, doneTasks.length);
  };

  const handleComplete = () => {
    if (activeTask && mood) {
      const newDone = [...doneTasks, activeTask.id];
      setDoneTasks(newDone);
      setActiveTask(null);
      localStorage.setItem("doneTasks", JSON.stringify(newDone)); // Save doneTasks
      saveHistory(mood, newDone.length);

      // Reward Logic: Only 1 tree per day (at 5 tasks)
      if (newDone.length === 5) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } else if (newDone.length > 5) {
        setToast("대단해요! 숲이 울창해지고 있어요 🌳");
      }
    }
  };

  // 로그인 버튼 핸들러
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  // 기분에 따른 배경색 변경 로직 (더 확실한 색감)
  const getBgColor = () => {
    switch (mood) {
      case "Happy": return "bg-gradient-to-br from-[#FFF9C4] to-[#FFCC80]"; // 옐로우/오렌지
      case "Calm": return "bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7]"; // 세이지 그린
      case "Tired": return "bg-gradient-to-br from-[#F3E5F5] to-[#CE93D8]"; // 라벤더
      case "Sad": return "bg-gradient-to-br from-[#E3F2FD] to-[#90CAF9]"; // 소프트 블루
      case "Angry": return "bg-gradient-to-br from-[#E0F2F1] to-[#80CBC4]"; // 쿨 민트
      default: return "bg-[#DECDBE]"; // 진한 밀크커피색
    }
  };

  // [3] 로그인이 안 되어 있으면 => 로그인 화면(문)을 보여줌
  if (!session) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-[#EBE9E1]">
          <h1 className="text-3xl font-serif font-bold text-[#556B2F] mb-2">Haru Rhythm</h1>
          <p className="text-gray-500 mb-8">당신의 하루를 기록하고 치유하세요</p>
          <button
            onClick={handleLogin}
            className="flex items-center gap-3 bg-white border border-gray-300 px-6 py-4 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="google" />
            <span className="font-bold text-gray-700">Google로 시작하기</span>
          </button>
        </div>
      </main>
    );
  }

  // [4] 로그인이 되어 있으면 => 원래 앱(집 안)을 보여줌
  return (
    <main className={`min-h-screen w-full flex items-center justify-center transition-colors duration-1000 ${getBgColor()}`}>
      <div className="w-full max-w-md bg-[#FDFBF7]/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[850px] relative flex flex-col border border-white/60">
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCalendarOpen(true)} className="p-2 bg-white/50 rounded-full text-gray-600 hover:bg-white transition shadow-sm"><Calendar size={20} /></button>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#556B2F] tracking-tight absolute left-1/2 -translate-x-1/2">Haru Rhythm</h1>
          <div className="flex gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'ko' : 'en')} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 transition"><Globe size={14} /> {lang === 'ko' ? 'KR' : 'EN'}</button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition"><Settings size={18} /></button>
          </div>
        </header>

        <div className="px-6 pb-6 flex-1 flex flex-col">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-[#556B2F] text-white px-2 py-0.5 rounded-full">TODAY</span>
                {mbti && <span className="text-[10px] font-bold text-[#556B2F] border border-[#556B2F] px-2 py-0.5 rounded-full">{mbti}</span>}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h2>
            </div>
            <div className="bg-white/60 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm backdrop-blur-md">
              {weather ? <><img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} className="w-8 h-8" /><span className="text-lg font-bold text-gray-700">{weather.temp}°</span></> : <span className="text-xs text-gray-400">Loading...</span>}
            </div>
          </div>

          <div className="flex justify-between gap-2 mb-8">
            {["Happy", "Calm", "Tired", "Sad", "Angry"].map(m => (
              <motion.button whileTap={{ scale: 0.9 }} key={m} onClick={() => handleMoodSelect(m as MoodType)} className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${mood === m ? "bg-[#556B2F] text-white scale-110 shadow-lg ring-2 ring-offset-2 ring-[#556B2F]" : "bg-white/50 text-gray-400 hover:bg-white"}`}>
                <span className="text-3xl">{m === "Happy" ? "😊" : m === "Calm" ? "😌" : m === "Tired" ? "😴" : m === "Sad" ? "😢" : "😠"}</span>
                <span className="text-[9px] font-bold uppercase tracking-wide">{m}</span>
              </motion.button>
            ))}
          </div>

          <div className="p-8 bg-white/60 rounded-3xl border border-white/50 mb-8 shadow-sm backdrop-blur-md">
            <p className="text-[#556B2F] font-serif text-center italic text-lg leading-relaxed">"{insight}"</p>
          </div>

          {mood ? (
            <div className="space-y-3 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xs font-bold text-gray-500 uppercase ml-2 tracking-widest mb-2">Micro-Habits</h3>
              {(tasks || []).map((t: any) => {
                const done = doneTasks.includes(t.id);
                return (
                  <motion.button whileTap={{ scale: 0.98 }} key={t.id} disabled={done} onClick={() => setActiveTask(t)} className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all ${done ? "bg-green-100/50 border-transparent opacity-50" : "bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#556B2F]/30"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${done ? "bg-[#556B2F] border-[#556B2F]" : "border-gray-200"}`}>
                        {done ? <Check size={14} color="white" /> : <Play size={10} className="ml-0.5 text-gray-300" />}
                      </div>
                      <span className={`text-sm font-bold ${done ? "line-through text-gray-400" : "text-gray-700"}`}>{t.text}</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-500 font-medium">{t.duration}m</span>
                  </motion.button>
                )
              })}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-medium italic">
              {lang === 'ko' ? "오늘의 기분을 선택해주세요 🌿" : "Select your mood to begin 🌿"}
            </div>
          )}

          {mood && (
            <div className="mt-8 p-5 bg-[#F1F8E9] rounded-3xl flex items-center justify-between border border-[#DCEDC8] shadow-inner">
              <div>
                <p className="text-[10px] font-bold text-[#556B2F] uppercase tracking-widest mb-1">Your Garden</p>
                <p className="text-sm text-[#33691E] font-bold">{doneTasks.length === 0 ? "씨앗을 심어보세요 🌱" : doneTasks.length >= 5 ? "꽃이 만개했어요! 🎉" : "무럭무럭 자라는 중..."}</p>
              </div>
              <div className="text-5xl drop-shadow-md filter transition-all duration-500">{doneTasks.length === 0 ? "🌱" : doneTasks.length < 3 ? "🌿" : doneTasks.length < 5 ? "🌷" : "🌸"}</div>
            </div>
          )}

          <ExternalBanner />
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50">
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onComplete={(val: string) => { localStorage.setItem("mbti", val); setMbti(val); }} />

        <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} history={history} />
        <FocusTimerModal isOpen={!!activeTask} onClose={() => setActiveTask(null)} onComplete={handleComplete} task={activeTask} mood={mood} />
      </div>
    </main >
  );
}
//배포테스트