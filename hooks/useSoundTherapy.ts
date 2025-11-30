// src/hooks/useSoundTherapy.ts
import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

// 💡 날씨별 음원 매핑 (파일 경로를 실제 파일명에 맞춰주세요)
const SOUND_MAP: Record<string, string> = {
    Rain: '/sounds/rain.mp3',       // 비 올 때
    Drizzle: '/sounds/rain.mp3',    // 이슬비
    Thunderstorm: '/sounds/rain.mp3', // 천둥번개
    Clear: '/sounds/forest.mp3',    // 맑을 땐 숲소리
    Clouds: '/sounds/wind.mp3',     // 흐릴 땐 바람소리
    Default: '/sounds/forest.mp3',  // 기본 소리
};

interface UseSoundTherapyProps {
    weatherMain: string; // OpenWeatherMap의 main 날씨 (예: 'Rain')
    isPlaying: boolean;  // 타이머 작동 여부
}

export const useSoundTherapy = ({ weatherMain, isPlaying }: UseSoundTherapyProps) => {
    const soundRef = useRef<Howl | null>(null);

    useEffect(() => {
        // 1. 상태가 바뀌면 기존 사운드 부드럽게 끄기 (Fade Out)
        if (soundRef.current) {
            soundRef.current.fade(0.5, 0, 1000); // 1초 동안 볼륨 0으로
            setTimeout(() => {
                soundRef.current?.stop();
                soundRef.current?.unload(); // 메모리 해제
            }, 1000);
        }

        // 타이머가 멈췄거나 꺼진 상태면 여기서 종료
        if (!isPlaying) return;

        // 2. 날씨에 맞는 음원 선택 (없으면 기본값)
        const soundFile = SOUND_MAP[weatherMain] || SOUND_MAP['Default'];

        // 3. 새 사운드 세팅 및 재생 (Fade In)
        soundRef.current = new Howl({
            src: [soundFile],
            loop: true,        // 무한 반복
            volume: 0,         // 0에서 시작해서
            html5: true,
        });

        soundRef.current.play();
        soundRef.current.fade(0, 0.5, 2000); // 2초 동안 볼륨 50%까지 올리기

        // 컴포넌트가 사라질 때 정리(Cleanup)
        return () => {
            soundRef.current?.stop();
            soundRef.current?.unload();
        };
    }, [weatherMain, isPlaying]);
};