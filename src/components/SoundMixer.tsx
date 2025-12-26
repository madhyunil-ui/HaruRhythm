"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Sliders } from 'lucide-react';
import { useSound, SoundId } from '../context/SoundContext';

const SoundMixer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { sounds, soundStates, setVolume, toggleMuteAll, isMuted } = useSound();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-white/50 max-h-[85vh] overflow-hidden"
                >
                    {/* Handle bar for visual cue */}
                    <div className="w-full h-6 flex items-center justify-center cursor-pointer" onClick={onClose}>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                    </div>

                    <div className="p-6 pb-10 max-w-md mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-serif font-bold text-[#556B2F] flex items-center gap-2">
                                <Sliders size={20} />
                                Sound Mixer
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={toggleMuteAll}
                                    className={`p-3 rounded-full transition-all ${isMuted ? 'bg-red-100 text-red-500' : 'bg-[#F1F8E9] text-[#556B2F]'}`}
                                >
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>
                                <button onClick={onClose} className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                            {sounds.map((sound) => {
                                const state = soundStates[sound.id];
                                const isPlaying = state?.volume > 0;

                                return (
                                    <div key={sound.id} className={`p-4 rounded-2xl transition-all border ${isPlaying ? 'bg-[#F1F8E9]/50 border-[#DCEDC8] shadow-sm' : 'bg-gray-50 border-transparent'}`}>
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isPlaying ? 'bg-white shadow-md scale-110' : 'bg-white/50 grayscale'}`}>
                                                {sound.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`font-bold text-sm ${isPlaying ? 'text-gray-800' : 'text-gray-500'}`}>{sound.name}</span>
                                                    <span className="text-xs font-mono text-gray-400">{Math.round((state?.volume || 0) * 100)}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={state?.volume || 0}
                                            onChange={(e) => setVolume(sound.id, parseFloat(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#556B2F]"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SoundMixer;
