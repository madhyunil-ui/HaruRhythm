"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Play, Pause, CheckCircle } from "lucide-react"; // 체크 아이콘 추가
import { useSoundTherapy } from "@/hooks/useSoundTherapy";

interface Task {
    id: string;
    text: string;
    duration: string;
}

interface FocusTimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    task: Task;
    weatherMain?: string;
}

export default function FocusTimerModal({ isOpen, onClose, onComplete, task, weatherMain }: FocusTimerModalProps) {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false); // 👈 완료 상태 추가

    // 소리 재생 (완료되면 소리 끔)
    useSoundTherapy({
        weatherMain: weatherMain || 'Default',
        isPlaying: isActive && isOpen && !isFinished,
    });

    useEffect(() => {
        if (isOpen && task) {
            const minutes = parseInt(task.duration) || 5;
            const seconds = minutes * 60;
            setTimeLeft(seconds);
            setTotalTime(seconds);
            setIsActive(false);
            setIsFinished(false);
        }
    }, [isOpen, task]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            // ⏰ 시간 끝! -> 완료 화면 보여주기
            setIsActive(false);
            setIsFinished(true);

            // 2초 뒤에 진짜 종료(모달 닫기)
            setTimeout(() => {
                onComplete();
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl overflow-hidden z-10"
            >
                {!isFinished && (
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* 👇 완료되었을 때 보여줄 화면 */}
                {isFinished ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.2, rotate: 360 }}
                            className="text-green-500"
                        >
                            <CheckCircle className="w-20 h-20" />
                        </motion.div>
                        <h3 className="text-2xl font-serif font-bold text-gray-800">Great Job!</h3>
                        <p className="text-gray-500">마음이 한결 편안해졌나요?</p>
                    </div>
                ) : (
                    /* 👇 기존 타이머 화면 */
                    <div className="text-center space-y-8">
                        <h3 className="text-xl font-serif font-medium text-gray-800">{task.text}</h3>

                        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                <motion.circle
                                    cx="96" cy="96" r="88" stroke="#3b82f6" strokeWidth="12" fill="none"
                                    strokeDasharray={2 * Math.PI * 88}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
                                />
                            </svg>
                            <div className="text-4xl font-bold text-gray-800 font-mono">{formatTime(timeLeft)}</div>
                        </div>

                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all ${isActive ? "bg-amber-100 text-amber-600" : "bg-blue-600 text-white"}`}
                        >
                            {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}