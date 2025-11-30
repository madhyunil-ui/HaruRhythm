"use client";

import { useState, useEffect } from "react";

import { CloudSun } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface HeroSectionProps {
    selectedMood: string | null;
    onMoodSelect: (mood: string) => void;
    weather: { temp: number; city: string; icon: string; isNight: boolean; type: string } | null;
    mbti: string | null;
}

export default function HeroSection({ selectedMood, onMoodSelect, weather, mbti }: HeroSectionProps) {
    const { t } = useLanguage();



    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    const MOODS = [
        { label: "Happy", emoji: "😊", color: "bg-yellow-100", text: t.hero.moods.Happy },
        { label: "Calm", emoji: "😌", color: "bg-green-100", text: t.hero.moods.Calm },
        { label: "Tired", emoji: "😴", color: "bg-blue-100", text: t.hero.moods.Tired },
        { label: "Sad", emoji: "😢", color: "bg-indigo-100", text: t.hero.moods.Sad },
        { label: "Angry", emoji: "😠", color: "bg-red-100", text: t.hero.moods.Angry },
    ];

    // Determine icon to show
    const getWeatherIcon = () => {
        if (!weather) return "";
        // If it is night, force night icon for Clear weather, or generally replace 'd' with 'n'
        if (weather.isNight) {
            if (weather.type === 'Clear') return '01n';
            return weather.icon.replace('d', 'n');
        }
        return weather.icon;
    };

    const weatherIcon = getWeatherIcon();

    return (
        <section className="px-8 py-2 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t.hero.today}</p>
                        {mbti && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-[10px] font-bold text-blue-800 rounded-full border border-blue-200">
                                {mbti}
                            </span>
                        )}
                    </div>
                    <h2 className="text-3xl font-serif font-medium text-gray-800">{today}</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm">
                    {!weather ? (
                        <span className="text-sm font-semibold text-gray-700">Loading...</span>
                    ) : (
                        <>
                            {weatherIcon && (
                                <img
                                    src={`https://openweathermap.org/img/wn/${weatherIcon}.png`}
                                    alt="Weather Icon"
                                    className="w-8 h-8"
                                />
                            )}
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-semibold text-gray-700">{weather?.temp}°C</span>
                                <span className="text-[10px] font-medium text-gray-500">{weather?.city}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">{t.hero.greeting}</h3>
                <div className="flex justify-between gap-2">
                    {MOODS.map((mood) => (
                        <motion.button
                            key={mood.label}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onMoodSelect(mood.label)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all w-full ${selectedMood === mood.label
                                ? "bg-white shadow-md ring-1 ring-gray-200 scale-105"
                                : "hover:bg-white/40"
                                }`}
                        >
                            <span className="text-2xl filter grayscale-[20%]">{mood.emoji}</span>
                            <span className={`text-[10px] font-medium tracking-wide uppercase ${selectedMood === mood.label ? "text-gray-800" : "text-gray-400"
                                }`}>{mood.text}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
}
