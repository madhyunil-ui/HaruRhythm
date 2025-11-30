"use client";

import { motion } from "framer-motion";
import { Sprout, Flower2, Trees, Leaf } from "lucide-react"; // 아이콘 사용

interface GrowthPlantProps {
    xp: number; // 총 완료한 루틴 횟수
}

export default function GrowthPlant({ xp }: GrowthPlantProps) {
    // XP에 따라 단계 결정 (0~5: 씨앗, 6~15: 새싹, 16~30: 꽃봉오리, 31~: 만개)
    const getStage = (xp: number) => {
        if (xp < 5) return { icon: <Leaf className="w-8 h-8 text-green-300" />, label: "씨앗", scale: 0.5 };
        if (xp < 15) return { icon: <Sprout className="w-10 h-10 text-green-500" />, label: "새싹", scale: 0.8 };
        if (xp < 30) return { icon: <Flower2 className="w-12 h-12 text-pink-400" />, label: "꽃봉오리", scale: 1 };
        return { icon: <Trees className="w-14 h-14 text-green-600" />, label: "울창한 정원", scale: 1.2 };
    };

    const stage = getStage(xp);

    return (
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/50 shadow-sm mt-4">
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">My Mind Garden</h4>
                <p className="text-sm text-gray-700 font-medium">
                    현재 <span className="text-green-600 font-bold">LV.{Math.floor(xp / 5) + 1}</span> {stage.label} 단계
                </p>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-inner">
                <motion.div
                    key={stage.label} // 단계가 바뀌면 애니메이션 다시 실행
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: stage.scale, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    {stage.icon}
                </motion.div>

                {/* 경험치 게이지 (테두리) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                    <circle cx="32" cy="32" r="30" stroke="#f1f5f9" strokeWidth="4" fill="none" />
                    <motion.circle
                        cx="32" cy="32" r="30" stroke="#4ade80" strokeWidth="4" fill="none"
                        strokeDasharray={2 * Math.PI * 30}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - (xp % 10) / 10) }} // 10개 단위로 한 바퀴
                        transition={{ duration: 1 }}
                    />
                </svg>
            </div>
        </div>
    );
}