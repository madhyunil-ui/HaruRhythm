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

  // 🎨 [수정 1] 색상을 더 진하고 깊이 있게 변경
  const getMoodGradient = (currentMood: string | null) => {
    switch (currentMood) {
      case 'Happy': return "from-orange-200 via-pink-200 to-yellow-200"; // 더 따뜻하게
      case 'Calm': return "from-teal-200 via-green-200 to-emerald-200"; // 더 싱그럽게
      case 'Tired': return "from-indigo-200 via-purple-200 to-blue-200"; // 더 깊은 휴식
      case 'Sad': return "from-blue-300 via-gray-300 to-slate-300";     // 더 차분하게 가라앉도록
      case 'Angry': return "from-red-200 via-rose-200 to-orange-200";   // 감정을 받아주는 붉은색
      default: return "from-gray-100 via-gray-200 to-gray-100";         // 기본
    }
  };

  return (
    // ✨ [수정 2] 애니메이션 속도를 15초 -> 8초로 줄여서 움직임을 더 잘 보이게 함
    <motion.main
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ${getMoodGradient(mood)} transition-colors duration-700`}
      animate={{
        backgroundSize: ["100% 100%", "200% 200%", "100% 100%"],
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{
        duration: 8, // 속도 UP!
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      {/* ✨ [수정 3] 카드에 강력한 그림자와 테두리를 줘서 '둥둥 떠있는' 느낌 강조 */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-2 border-white/80 overflow-hidden relative pb-10 transition-all">
        <Header />
        <HeroSection selectedMood={mood} onMoodSelect={(m) => setMood(m)} weather={weather} mbti={mbti} />

        <div className="mt-6 space-y-6">
          <InsightCard mood={mood} insight={recommendation.insight} />

          <ChecklistCard
            mood={mood}
            tasks={recommendation.tasks}
            onTaskClick={(task) => setActiveTask(task)}
            externalCompleted={completedTasks}
          />

          {mood && <GrowthPlant xp={totalXP} />}
        </div>

        {!mood && <div className="mt-12 text-center text-gray-500 text-sm font-medium"><p>{t.home.selectMood}</p></div>}
      </div>

      <WeatherMate weather={weather} mood={mood} mbti={mbti} />

      {activeTask && (
        <FocusTimerModal
          isOpen={!!activeTask}
          onClose={() => setActiveTask(null)}
          onComplete={handleTaskComplete}
          task={activeTask}
          weatherMain={weather?.type}
        />
      )}
    </motion.main>
  );
}