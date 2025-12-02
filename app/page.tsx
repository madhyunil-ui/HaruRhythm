"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import InsightCard from "@/components/InsightCard";
import ChecklistCard from "@/components/ChecklistCard";
import WeatherMate from "@/components/WeatherMate";
import FocusTimerModal from "@/components/FocusTimerModal";
import GrowthPlant from "@/components/GrowthPlant";
import SettingsModal from "@/components/SettingsModal";
import { useLanguage } from "@/context/LanguageContext";
import { getRecommendation, WeatherType, MoodType } from "@/lib/recommendation";

export default function Home() {
  const [mood, setMood] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<any>(null);
  const [mbti, setMbti] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<{ insight: string; tasks: any[] }>({ insight: "", tasks: [] });
  const [activeTask, setActiveTask] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedXP = localStorage.getItem("haru_rhythm_xp");
    if (savedXP) setTotalXP(parseInt(savedXP));
    const loadMbti = () => { const saved = localStorage.getItem("user_mbti"); if (saved) setMbti(saved); };
    loadMbti();
    window.addEventListener("mbtiChanged", loadMbti);
    return () => window.removeEventListener("mbtiChanged", loadMbti);
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const data = await res.json();
        if (res.ok) {
          const { dt, sys } = data;
          const isNight = dt < sys.sunrise || dt > sys.sunset;
          setWeather({ temp: Math.round(data.main.temp), city: data.name, icon: data.weather[0].icon, type: data.weather[0].main as WeatherType, isNight, });
        } else setDefaultWeather();
      } catch (error) { setDefaultWeather(); }
    };
    const setDefaultWeather = () => { setWeather({ temp: 30, city: "Manila", icon: "01d", type: "Clear", isNight: false }); };
    if ("geolocation" in navigator) { navigator.geolocation.getCurrentPosition((position) => fetchWeather(position.coords.latitude, position.coords.longitude), (error) => setDefaultWeather()); } else setDefaultWeather();
  }, []);

  useEffect(() => {
    if (mood && mbti) {
      const weatherType = weather ? weather.type : 'Clear';
      const rec = getRecommendation(weatherType, mood as MoodType, mbti, language, false);
      setRecommendation(rec);
    }
  }, [mood, weather, mbti, language]);

  const handleTaskComplete = () => {
    if (activeTask) {
      setCompletedTasks(prev => [...new Set([...prev, activeTask.id])]);
      const newXP = totalXP + 1;
      setTotalXP(newXP);
      localStorage.setItem("haru_rhythm_xp", newXP.toString());
      setActiveTask(null);
    }
  };

  const getMoodGradient = (currentMood: string | null) => {
    switch (currentMood) {
      case 'Happy': return "from-orange-400 via-pink-500 to-yellow-500";
      case 'Calm': return "from-teal-400 via-green-500 to-emerald-600";
      case 'Tired': return "from-indigo-400 via-purple-500 to-blue-600";
      case 'Sad': return "from-blue-400 via-slate-500 to-gray-600";
      case 'Angry': return "from-red-400 via-orange-500 to-rose-600";
      default: return "from-gray-100 via-gray-200 to-gray-100";
    }
  };

  return (
    <motion.main
      key={mood}
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ${getMoodGradient(mood)}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        backgroundSize: ["100% 100%", "200% 200%", "100% 100%"],
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border-4 border-white/50 overflow-hidden relative pb-10">
        <Header onSettingsClick={() => setIsSettingsOpen(true)} />
        <HeroSection selectedMood={mood} onMoodSelect={(m) => setMood(m)} weather={weather} mbti={mbti} />

        <div className="mt-6 space-y-6">
          <InsightCard mood={mood} insight={recommendation.insight} />
          <ChecklistCard mood={mood} tasks={recommendation.tasks} onTaskClick={(task) => setActiveTask(task)} externalCompleted={completedTasks} />
          {mood && <GrowthPlant xp={totalXP} />}
        </div>
        {!mood && <div className="mt-12 text-center text-gray-500 text-sm font-medium"><p>{t.home.selectMood}</p></div>}
      </div>

      {/* 👇 [수정] 여기가 문제였습니다. mbti={mbti} 라고 명확하게 적어야 합니다. */}
      <WeatherMate weather={weather} mood={mood} mbti={mbti} />

      {activeTask && (
        <FocusTimerModal isOpen={!!activeTask} onClose={() => setActiveTask(null)} onComplete={handleTaskComplete} task={activeTask} weatherMain={weather?.type} />
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <div className="hidden from-orange-400 via-pink-500 to-yellow-500 from-teal-400 via-green-500 to-emerald-600 from-indigo-400 via-purple-500 to-blue-600 from-blue-400 via-slate-500 to-gray-600 from-red-400 via-orange-500 to-rose-600"></div>
    </motion.main>
  );
}