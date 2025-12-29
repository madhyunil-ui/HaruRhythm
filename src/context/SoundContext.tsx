"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { App } from '@capacitor/app';

export type SoundId = 'rain' | 'forest' | 'river' | 'ocean' | 'bgm';

interface Sound {
    id: SoundId;
    name: string;
    path: string;
    icon: string;
}

interface SoundState {
    id: SoundId;
    volume: number;
    isPlaying: boolean;
}

interface SoundContextType {
    sounds: Sound[];
    soundStates: Record<SoundId, SoundState>;
    play: (id: SoundId) => void;
    stop: (id: SoundId) => void;
    setVolume: (id: SoundId, volume: number) => void;
    toggleMuteAll: () => void;
    isMuted: boolean;
}

const SOUNDS: Sound[] = [
    { id: 'rain', name: 'Rain', path: '/sounds/sad_rain.mp3', icon: '🌧️' },
    { id: 'forest', name: 'Forest', path: '/sounds/calm_forest.mp3', icon: '🌲' },
    { id: 'river', name: 'River', path: '/sounds/angry_river.mp3', icon: '🌊' },
    { id: 'ocean', name: 'Ocean', path: '/sounds/tired_ocean.mp3', icon: '🏖️' },
    { id: 'bgm', name: 'Joy', path: '/sounds/happy_bgm.mp3', icon: '🎵' },
];

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
    const howls = useRef<Record<SoundId, Howl | null>>({
        rain: null, forest: null, river: null, ocean: null, bgm: null
    });

    const [soundStates, setSoundStates] = useState<Record<SoundId, SoundState>>({
        rain: { id: 'rain', volume: 0, isPlaying: false },
        forest: { id: 'forest', volume: 0, isPlaying: false },
        river: { id: 'river', volume: 0, isPlaying: false },
        ocean: { id: 'ocean', volume: 0, isPlaying: false },
        bgm: { id: 'bgm', volume: 0, isPlaying: false },
    });

    const [isMuted, setIsMuted] = useState(false);
    const isMutedRef = useRef(false);

    // Sync ref with state for listener access
    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    // App Lifecycle Listener for Audio
    useEffect(() => {
        const listener = App.addListener('appStateChange', ({ isActive }) => {
            if (!isActive) {
                // Background: Pause all currently playing sounds
                Object.values(howls.current).forEach(howl => {
                    if (howl && howl.playing()) {
                        howl.pause();
                        // Mark as paused by system so we can resume later
                        (howl as any)._systemPaused = true;
                    }
                });
                setSoundStates(prev => {
                    const next = { ...prev };
                    Object.keys(next).forEach(key => {
                        const k = key as SoundId;
                        if (next[k].isPlaying) {
                            next[k] = { ...next[k], isPlaying: false };
                        }
                    });
                    return next;
                });
            } else {
                // Foreground: Resume sounds that were paused by system
                const playingUpdates: Record<string, boolean> = {};

                Object.entries(howls.current).forEach(([key, howl]) => {
                    if (howl && (howl as any)._systemPaused) {
                        howl.play();
                        // Restore fade/volume if needed, though pause/play usually keeps it
                        howl.fade(0, soundStates[key as SoundId].volume || 0.5, 1000);
                        (howl as any)._systemPaused = false;
                        playingUpdates[key] = true;
                    }
                });

                setSoundStates(prev => {
                    const next = { ...prev };
                    Object.keys(playingUpdates).forEach(key => {
                        const k = key as SoundId;
                        next[k] = { ...next[k], isPlaying: true };
                    });
                    return next;
                });
            }
        });

        return () => {
            listener.then(handler => handler.remove());
        };
    }, []);

    useEffect(() => {
        // Initialize Howls
        SOUNDS.forEach(s => {
            howls.current[s.id] = new Howl({
                src: [s.path],
                loop: true,
                volume: 0,
                preload: true,
            });
        });

        return () => {
            Object.values(howls.current).forEach(h => h?.unload());
        };
    }, []);

    const play = (id: SoundId) => {
        const howl = howls.current[id];
        if (howl && !howl.playing()) {
            howl.play();
            howl.fade(0, soundStates[id].volume || 0.5, 1000);
            setSoundStates(prev => ({ ...prev, [id]: { ...prev[id], isPlaying: true, volume: prev[id].volume || 0.5 } }));
        }
    };

    const stop = (id: SoundId) => {
        const howl = howls.current[id];
        if (howl) {
            howl.fade(howl.volume(), 0, 500);
            setTimeout(() => {
                howl.stop();
            }, 500);
            setSoundStates(prev => ({ ...prev, [id]: { ...prev[id], isPlaying: false, volume: 0 } }));
        }
    };

    const setVolume = (id: SoundId, volume: number) => {
        const howl = howls.current[id];
        if (howl) {
            if (volume > 0 && !howl.playing()) {
                howl.play();
                howl.fade(0, volume, 500);
            } else if (volume === 0 && howl.playing()) {
                stop(id);
                return;
            }
            howl.volume(volume);
            setSoundStates(prev => ({ ...prev, [id]: { ...prev[id], isPlaying: volume > 0, volume } }));
        }
    };

    const toggleMuteAll = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        Howler.mute(newMuted);
    };

    return (
        <SoundContext.Provider value={{ sounds: SOUNDS, soundStates, play, stop, setVolume, toggleMuteAll, isMuted }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
