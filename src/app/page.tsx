"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { DataManager } from '@/lib/dataManager';

// --- 1. Types ---
type MoodType = 'angry' | 'sad' | 'neutral' | 'happy' | 'excited' | null;
type Task = { id: string; title: string; completed: boolean; duration?: number };

const FALLBACK_ROUTINES: Task[] = [
  { id: 'fb-1', title: "물 한 잔 마시고 5분 쉬기", completed: false, duration: 300 },
  { id: 'fb-2', title: "창문 열고 심호흡 하기", completed: false, duration: 180 },
  { id: 'fb-3', title: "눈 감고 좋아하는 음악 듣기", completed: false, duration: 600 }
];

// Routine Card Component
const RoutineCard = ({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) => {
  const [timeLeft, setTimeLeft] = useState(task.duration || 600); // Default 10 min if not specified
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Auto-complete or sound?
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white/70 rounded-2xl shadow-sm border border-white/50 overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-amber-200' : ''}`}
    >
      <div
        className="p-4 flex items-center gap-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(task.id);
          }}
          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs transition-colors shrink-0 ${task.completed ? 'bg-[#D6A66C]' : 'bg-stone-200 hover:bg-stone-300'}`}
        >
          {task.completed && '✓'}
        </button>
        <span className={`flex-1 text-stone-600 font-medium ${task.completed ? 'line-through opacity-50' : ''}`}>
          {task.title}
        </span>
        <span className="text-xs text-stone-400 font-mono bg-stone-100 px-2 py-1 rounded-md">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Expanded Player Controls */}
      <AnimatePresence>
        {isExpanded && !task.completed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 pt-0 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 mt-3 w-full justify-center">
              <button
                onClick={() => setTimeLeft(prev => Math.max(0, prev - 60))}
                className="w-8 h-8 rounded-full bg-white text-stone-400 shadow-sm hover:text-stone-600 font-bold"
              > - </button>

              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-2xl font-bold text-stone-700 font-mono tracking-wider">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Timer</span>
              </div>

              <button
                onClick={() => setTimeLeft(prev => prev + 60)}
                className="w-8 h-8 rounded-full bg-white text-stone-400 shadow-sm hover:text-stone-600 font-bold"
              > + </button>

              <div className="w-px h-8 bg-stone-200 mx-2" />

              <button
                onClick={() => setIsActive(!isActive)}
                className={`px-6 py-2 rounded-xl font-bold text-white shadow-md transition-all flex items-center gap-2 ${isActive ? 'bg-amber-300 hover:bg-amber-400' : 'bg-[#D6A66C] hover:bg-[#C2945B]'}`}
              >
                {isActive ? (
                  <><span>⏸</span> Pause</>
                ) : (
                  <><span>▶</span> Start</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

// Personality Questions (4-Step MBTI)
const PERSONALITY_QUESTIONS = [
  {
    id: 1, // Energy
    question: "휴식을 취할 때 어떤 방식이 편한가요?",
    answers: [
      { text: "혼자 조용히 시간을 보낸다", type: "I" },
      { text: "친구들을 만나 수다를 떤다", type: "E" }
    ]
  },
  {
    id: 2, // Perception
    question: "새로운 정보를 받아들일 때 나는?",
    answers: [
      { text: "현실적인 사실과 경험을 중시한다", type: "S" },
      { text: "미래의 가능성과 의미를 찾는다", type: "N" }
    ]
  },
  {
    id: 3, // Judgment
    question: "의사결정을 내릴 때 더 중요하게 생각하는 것은?",
    answers: [
      { text: "논리와 객관적인 사실", type: "T" },
      { text: "사람과의 관계와 감정", type: "F" }
    ]
  },
  {
    id: 4, // Lifestyle
    question: "여행 계획을 세울 때 나의 스타일은?",
    answers: [
      { text: "철저하게 계획하고 지킨다", type: "J" },
      { text: "상황에 따라 유연하게 즐긴다", type: "P" }
    ]
  }
];

// --- Sound Constants ---
const SOUND_MAP: Record<string, string> = {
  angry: '/sounds/angry_river.mp3',
  sad: '/sounds/sad_rain.mp3',
  neutral: '/sounds/tired_ocean.mp3',
  happy: '/sounds/happy_bgm.mp3',
  excited: '/sounds/calm_forest.mp3',
  default: '/sounds/asmr_morning1.mp3',
};

const SFX_MAP = {
  pop: '/sounds/sfx_pop.mp3',
  success: '/sounds/sfx_success.mp3',
};

// --- 2. Supabase Init ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  { auth: { persistSession: true } }
);

export default function HaruRoutine() {
  // --- 3. State Management ---
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Guest Mode State
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isGuestWarningOpen, setIsGuestWarningOpen] = useState(false);

  // User Data
  const [mood, setMood] = useState<MoodType>(null);
  const [personality, setPersonality] = useState<string | null>(null);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPersonalityOpen, setIsPersonalityOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // AI & Routine State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // --- Audio State & Refs ---
  const [volume, setVolume] = useState(50); // 0-100
  const [isMuted, setIsMuted] = useState(false);

  const bgmRef1 = useRef<HTMLAudioElement | null>(null);
  const bgmRef2 = useRef<HTMLAudioElement | null>(null);
  const activeBgmRef = useRef<1 | 2>(1); // 1 or 2
  const currentSoundUrl = useRef<string | null>(null);

  // Initialize Audio Objects
  useEffect(() => {
    bgmRef1.current = new Audio();
    bgmRef1.current.loop = true;
    bgmRef2.current = new Audio();
    bgmRef2.current.loop = true;

    // Start default bgm
    if (typeof window !== 'undefined') {
      playBgm('default');
    }

    return () => {
      bgmRef1.current?.pause();
      bgmRef2.current?.pause();
    };
  }, []);

  // Sync Volume
  useEffect(() => {
    const actualVol = isMuted ? 0 : volume / 100;
    if (bgmRef1.current) bgmRef1.current.volume = (activeBgmRef.current === 1) ? actualVol : 0;
    if (bgmRef2.current) bgmRef2.current.volume = (activeBgmRef.current === 2) ? actualVol : 0;
  }, [volume, isMuted]);

  // Audio Logic
  const playBgm = (moodKey: string) => {
    const targetUrl = SOUND_MAP[moodKey] || SOUND_MAP['default'];
    if (currentSoundUrl.current === targetUrl) return;

    currentSoundUrl.current = targetUrl;
    const fadeDuration = 1000;
    const steps = 20;
    const intervalTime = fadeDuration / steps;
    const targetVol = isMuted ? 0 : volume / 100;

    const incomingRef = activeBgmRef.current === 1 ? bgmRef2 : bgmRef1;
    const outgoingRef = activeBgmRef.current === 1 ? bgmRef1 : bgmRef2;
    const nextActiveId = activeBgmRef.current === 1 ? 2 : 1;

    if (incomingRef.current) {
      incomingRef.current.src = targetUrl;
      incomingRef.current.volume = 0;
      const playPromise = incomingRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented:", error);
        });
      }
    }

    let stepCount = 0;
    const fadeInterval = setInterval(() => {
      stepCount++;
      const ratio = stepCount / steps;

      if (incomingRef.current) incomingRef.current.volume = ratio * targetVol;
      if (outgoingRef.current) outgoingRef.current.volume = (1 - ratio) * targetVol;

      if (stepCount >= steps) {
        clearInterval(fadeInterval);
        if (outgoingRef.current) {
          outgoingRef.current.pause();
          outgoingRef.current.volume = 0;
        }
        activeBgmRef.current = nextActiveId;
      }
    }, intervalTime);
  };

  const playSfx = (type: 'pop' | 'success') => {
    if (isMuted) return;
    const sfx = new Audio(SFX_MAP[type]);
    sfx.volume = volume / 100;
    sfx.play().catch(() => { });
  };

  // --- 4. Initialization ---
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        const syncedCount = await DataManager.syncGuestData(data.session);
        if (syncedCount > 0) {
          showToast(`${syncedCount}개의 기록이 동기화되었습니다!`, 'success');
        }
      }

      const storedPersonality = localStorage.getItem('haru_personality');
      if (storedPersonality) setPersonality(storedPersonality);

      setLoading(false);
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        setIsGuestMode(false);
        const syncedCount = await DataManager.syncGuestData(session);
        if (syncedCount > 0) {
          showToast(`${syncedCount}개의 기록이 안전하게 동기화되었습니다!`, 'success');
        }
      }
    });

    const unlockAudio = () => {
      if (bgmRef1.current?.paused && bgmRef2.current?.paused && currentSoundUrl.current) {
        const activeRef = activeBgmRef.current === 1 ? bgmRef1 : bgmRef2;
        if (activeRef.current) activeRef.current.play().catch(() => { });
      }
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);

    return () => {
      authListener.subscription.unsubscribe();
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

  // --- 5. Handlers ---
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    });
  };

  const handleGuestStart = () => {
    setIsGuestWarningOpen(true);
  };

  const confirmGuestMode = () => {
    setIsGuestWarningOpen(false);
    setIsGuestMode(true);
    showToast('게스트 모드로 시작합니다 (데이터 로컬 저장)', 'success');
  };

  const handleLogout = async () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      await supabase.auth.signOut();
      setSession(null);
      setIsGuestMode(false);
      setIsSettingsOpen(false);
    }
  };

  // Personality Q&A Logic
  const handleAnswer = (type: string) => {
    playSfx('pop');
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQuestionIndex < PERSONALITY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const resultType = newAnswers.join(""); // e.g., "ISTJ"
      setPersonality(resultType);
      localStorage.setItem('haru_personality', resultType);
      setIsPersonalityOpen(false);
      showToast('나의 성향이 저장되었습니다!', 'success');
      setCurrentQuestionIndex(0);
      setAnswers([]);
    }
  };

  const saveHistory = async (selectedMood: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    setMood(selectedMood as MoodType);

    if (!session && !isGuestMode) {
      showToast('로그인을 하거나 게스트 모드로 시작해주세요!', 'error');
      return;
    }

    // Immediate Feedback
    setAiMessage("오늘 하루도 정말 고생 많으셨어요. 당신의 하루를 응원합니다.");
    setIsGenerating(true);
    setDoneTasks([]);

    const startTime = Date.now();

    try {
      const logData = {
        mood: selectedMood,
        date: new Date().toISOString(),
        description: "Mood Tracker Entry"
      };

      const storageType = await DataManager.saveLog(session, logData);
      if (storageType === 'LOCAL') {
        showToast('내 기기에 저장되었습니다', 'success');
      } else {
        showToast('오늘의 기분이 기록되었습니다 ☁️', 'success');
      }

      playSfx('success');
      playBgm(selectedMood);

      // Weather Logic
      let currentWeather = "Sunny";
      if ("geolocation" in navigator && process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
          }).catch(() => null);

          if (pos) {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric&lang=kr`);
            if (res.ok) {
              const d = await res.json();
              currentWeather = d.weather[0]?.main || "Clear";
            }
          }
        } catch (e) { /* Ignore */ }
      }

      // API Call
      const response = await fetch('/api/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          personality: personality || "Unknown",
          weather: currentWeather
        })
      });

      const data = await response.json();

      if (data.routines && Array.isArray(data.routines) && data.routines.length > 0) {
        const newTasks: Task[] = data.routines.map((r: string, i: number) => ({
          id: Date.now().toString() + i,
          title: r,
          completed: false,
          duration: 600 // Default 10 min for AI routines
        }));
        setDoneTasks(newTasks);
        setAiMessage(data.message);
      } else {
        throw new Error("No routines returned");
      }

    } catch (err) {
      console.warn("AI Generation Failed. Using Fallback.", err);
      // Fallback Logic
      setDoneTasks(FALLBACK_ROUTINES);
      setAiMessage("AI 연결이 원활하지 않아 기본 루틴을 준비했어요. 편안하게 시작해보세요.");
    } finally {
      // Ensure "Generating..." shows for at least 500ms
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
      }
      setIsGenerating(false);
    }
  };

  const toggleTask = (taskId: string) => {
    playSfx('pop');
    setDoneTasks(prev => {
      const next = prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      const allCompleted = next.length > 0 && next.every(t => t.completed);
      const prevCompleted = prev.length > 0 && prev.every(t => t.completed);

      if (allCompleted && !prevCompleted) {
        playSfx('success');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        showToast('모든 루틴을 완료했어요! 정말 멋져요 ✨', 'success');
      }
      return next;
    });
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- 6. Render ---
  if (loading) return <div className="min-h-[100dvh] flex items-center justify-center bg-amber-50 text-stone-400 font-medium">로딩중...</div>;

  return (
    <div className="min-h-[100dvh] font-sans relative flex items-center justify-center p-4 text-stone-900 overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "linear-gradient(to bottom right, #FFF8E1, #FFEBEE)",
            "linear-gradient(to bottom right, #FFE0B2, #FFCDD2)",
            "linear-gradient(to bottom right, #FFB74D, #E57373)",
            "linear-gradient(to bottom right, #FFE0B2, #FFCDD2)",
            "linear-gradient(to bottom right, #FFF8E1, #FFEBEE)",
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-0 left-1/2 px-6 py-3 rounded-full text-white shadow-xl z-[100] font-medium text-sm tracking-wide ${toast.type === 'success' ? 'bg-[#D6A66C]' : 'bg-red-400'}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <main id="capture-area" className="w-full max-w-md min-h-[85vh] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col relative overflow-hidden ring-1 ring-white/40 z-10 transition-all duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <header className="flex justify-between items-center mb-10 z-10 p-8 pb-0">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 tracking-tight">하루리듬</h1>
            <p className="text-sm text-stone-600 font-medium mt-1">{new Date().toLocaleDateString()}의 기록</p>
          </div>
          <div className="flex gap-3">
            {personality && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="px-3 py-1 bg-white/60 text-stone-600 rounded-full text-xs font-bold border border-stone-200 flex items-center shadow-sm"
              >
                {personality}
              </motion.span>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                playSfx('pop');
                setIsSettingsOpen(true);
              }}
              className="p-2 bg-white/60 hover:bg-white rounded-full text-stone-500 transition-all shadow-sm"
            >
              ⚙️
            </motion.button>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-8 pt-4 z-10">
          {!session && !isGuestMode ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="w-24 h-24 bg-[#FFF8E1] rounded-[2rem] flex items-center justify-center text-5xl mb-6 shadow-sm ring-4 ring-white/50"
              >
                🌇
              </motion.div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">환영합니다!</h2>
              <p className="text-stone-600 mb-10 leading-relaxed break-keep">
                가장 편안한 시간,<br />당신의 하루를 따뜻하게 기록해보세요.
              </p>
              <div className="w-full flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    playSfx('pop');
                    handleLogin();
                  }}
                  className="w-full bg-[#D6A66C] text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 bg-white rounded-full p-0.5" />
                  <span>Google로 시작하기 (안전)</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    playSfx('pop');
                    handleGuestStart();
                  }}
                  className="w-full bg-white/60 text-stone-500 py-4 rounded-2xl font-bold hover:bg-white transition-all shadow-sm border border-stone-100"
                >
                  <span>게스트로 시작하기</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 flex flex-col gap-8"
            >
              <section className="bg-white/40 p-6 rounded-3xl border border-white/60 shadow-sm relative overflow-hidden group hover:bg-white/50 transition-colors">
                <h2 className="text-lg font-bold mb-4 text-stone-800 flex items-center gap-2">
                  <span>💭</span> 지금 기분은 어때요?
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'angry', emoji: '😡', label: '화남', color: 'bg-red-50 text-red-700 border-red-200 ring-red-100' },
                    { id: 'sad', emoji: '😢', label: '우울', color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100' },
                    { id: 'neutral', emoji: '😐', label: '보통', color: 'bg-stone-50 text-stone-700 border-stone-200 ring-stone-100' },
                    { id: 'happy', emoji: '🙂', label: '좋음', color: 'bg-green-50 text-green-700 border-green-200 ring-green-100' },
                    { id: 'excited', emoji: '😆', label: '신남', color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100' }
                  ].map((item) => (
                    <div key={item.id} className="flex flex-col items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => saveHistory(item.id)}
                        className={`w-full aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all shadow-sm border-2 ${mood === item.id
                          ? `${item.color} shadow-md ring-4 ring-white/50 scale-110 -translate-y-1`
                          : 'bg-white/80 border-transparent text-gray-400 hover:bg-white'
                          }`}
                      >
                        {item.emoji}
                      </motion.button>
                      <span className={`text-[10px] font-bold tracking-wide transition-colors ${mood === item.id ? 'text-stone-800' : 'text-stone-400'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex-1">
                <h2 className="text-lg font-bold mb-4 text-stone-800 flex items-center gap-2">
                  <span>📝</span> 오늘의 루틴
                </h2>

                <AnimatePresence mode='wait'>
                  {aiMessage && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                      className="bg-[#FFF3E0] rounded-2xl p-4 mb-4 text-[#8D6E63] text-sm font-medium leading-relaxed shadow-sm border border-[#FFE0B2]"
                    >
                      <span className="text-lg mr-1">💌</span> {aiMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {isGenerating ? (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-white/40 rounded-2xl p-4 mb-4 flex items-center justify-center gap-2 text-stone-500 text-sm font-medium"
                  >
                    <div className="w-4 h-4 border-2 border-stone-300 border-t-amber-400 rounded-full animate-spin" />
                    <span>🌱 맞춤 루틴을 심고 있어요...</span>
                  </motion.div>
                ) : doneTasks.length > 0 ? (
                  <ul className="space-y-3">
                    {doneTasks.map(task => (
                      <RoutineCard key={task.id} task={task} onComplete={toggleTask} />
                    ))}
                  </ul>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center bg-white/40 rounded-3xl border border-dashed border-amber-200 text-stone-400">
                    <span className="text-3xl mb-3 opacity-50">🌾</span>
                    <p className="text-sm font-medium">
                      {isGuestMode ? "기록은 기기에만 저장됩니다." : "편안한 마음으로 시작해보세요"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isGuestWarningOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-6"
            onClick={() => setIsGuestWarningOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-amber-400" />
              <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">⚠️ 주의사항</h3>
              <p className="text-stone-600 mb-8 leading-relaxed text-sm">
                게스트 모드는 <b>기기에만 데이터가 저장</b>됩니다.<br />
                앱 삭제나 기기 변경 시 루틴 기록이 영구적으로 사라질 수 있습니다.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    playSfx('pop');
                    setIsGuestWarningOpen(false);
                    handleLogin();
                  }}
                  className="w-full py-4 bg-[#D6A66C] text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all"
                >
                  로그인하고 안전하게 저장
                </button>
                <button
                  onClick={confirmGuestMode}
                  className="w-full py-4 bg-stone-100 text-stone-400 rounded-2xl font-bold hover:bg-stone-200 transition-colors"
                >
                  위험을 감수하고 시작
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] w-full max-w-sm shadow-2xl ring-1 ring-white/50"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-8 text-center text-stone-800">설정</h3>
              <div className="mb-6 p-4 bg-stone-50 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-stone-600">배경음악 & 효과음</span>
                  <button onClick={() => { playSfx('pop'); setIsMuted(!isMuted); }} className="text-lg p-1 hover:bg-stone-200 rounded transition-colors">
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                </div>
                <input
                  type="range" min="0" max="100" value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  disabled={isMuted}
                  className="w-full accent-[#D6A66C] h-2 rounded-lg appearance-none cursor-pointer bg-stone-200"
                />
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    playSfx('pop');
                    setIsSettingsOpen(false);
                    setIsPersonalityOpen(true);
                  }}
                  className="w-full bg-[#FFF3E0] text-[#8D6E63] py-4 rounded-2xl font-bold hover:shadow-md transition-all flex items-center justify-between px-6 group"
                >
                  <span>🧠 나의 성향 알아보기</span>
                  <span className="text-amber-300 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <div className="h-px bg-stone-100 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full bg-stone-50 text-stone-500 py-4 rounded-2xl font-bold hover:bg-stone-100 transition-colors"
                >
                  로그아웃
                </button>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="mt-8 text-stone-400 text-sm font-bold w-full hover:text-stone-600 transition-colors"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}

        {isPersonalityOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] w-full max-w-sm shadow-2xl"
            >
              <header className="mb-6">
                <h3 className="text-xl font-bold text-stone-800 mb-1">나의 성향 파악하기</h3>
                <div className="flex gap-1 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-[#D6A66C]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / PERSONALITY_QUESTIONS.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-stone-400 text-right mt-1">{currentQuestionIndex + 1} / {PERSONALITY_QUESTIONS.length}</p>
              </header>
              <div className="mb-8">
                <h4 className="text-lg font-bold text-stone-700 leading-snug mb-6">
                  Q. {PERSONALITY_QUESTIONS[currentQuestionIndex].question}
                </h4>
                <div className="space-y-3">
                  {PERSONALITY_QUESTIONS[currentQuestionIndex].answers.map((ans, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(ans.type)}
                      className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-stone-600 font-medium hover:bg-[#FFF3E0] hover:border-[#FFE0B2] hover:text-[#8D6E63] transition-all"
                    >
                      {ans.text}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setIsPersonalityOpen(false); setCurrentQuestionIndex(0); setAnswers([]); }}
                className="w-full py-4 text-stone-400 text-sm font-bold hover:text-stone-600"
              >
                나중에 하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}