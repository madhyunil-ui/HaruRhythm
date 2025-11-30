"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Trophy, PlayCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface Task { id: string; text: string; duration: string; }

interface ChecklistCardProps {
    mood: string | null;
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
    externalCompleted?: string[]; // 👈 부모한테 받는 완료 목록
}

export default function ChecklistCard({ mood, tasks, onTaskClick, externalCompleted = [] }: ChecklistCardProps) {
    const [completed, setCompleted] = useState<string[]>([]);

    // 1. 부모가 "이거 완료됐어"라고 알려주면(externalCompleted), 내 장부(completed)도 업데이트!
    useEffect(() => {
        if (externalCompleted.length > 0) {
            // 새로 완료된 게 있는지 확인
            const isNewCompletion = externalCompleted.some(id => !completed.includes(id));

            setCompleted(prev => [...new Set([...prev, ...externalCompleted])]);

            // 새로 완료된 게 있다면 축포 발사! 🎉
            if (isNewCompletion) {
                triggerConfetti();
            }
        }
    }, [externalCompleted]);

    const handleInternalClick = (task: Task) => {
        if (completed.includes(task.id)) return; // 이미 완료된 건 무시
        if (onTaskClick) onTaskClick(task); // 타이머 켜달라고 요청
    };

    const triggerConfetti = () => {
        const duration = 2000;
        const end = Date.now() + duration;
        const frame = () => {
            confetti({ particleCount: 5, spread: 60, origin: { y: 0.6 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
    };

    const progress = tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0;

    if (!mood) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-8 mt-4 p-6 bg-white rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex justify-between items-end mb-4">
                <div><h3 className="text-lg font-serif font-medium text-gray-800">Micro-Habits</h3></div>
                <div className="text-right"><span className="text-2xl font-bold text-gray-800">{completed.length}</span>/{tasks.length}</div>
            </div>

            {/* 프로그래스 바 */}
            <div className="h-2 w-full bg-gray-100 rounded-full mb-6 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-blue-400 to-purple-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>

            <div className="space-y-3">
                {tasks.map((task) => {
                    const isChecked = completed.includes(task.id);
                    return (
                        <motion.button
                            key={task.id}
                            onClick={() => handleInternalClick(task)}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${isChecked ? "bg-gray-50 opacity-60" : "bg-white hover:shadow-sm hover:border-blue-200"}`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isChecked ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                                {isChecked ? <Check className="w-3.5 h-3.5 text-white" /> : <PlayCircle className="w-3.5 h-3.5 text-gray-300" />}
                            </div>
                            <span className={`text-sm font-medium flex-1 ${isChecked ? "line-through text-gray-400" : "text-gray-700"}`}>{task.text}</span>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{task.duration}</span>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}