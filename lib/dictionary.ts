export type Locale = "en" | "ko";

export const dictionary = {
    en: {
        header: {
            title: "Haru Rhythm",
        },
        hero: {
            today: "Today",
            greeting: "How are you feeling?",
            moods: {
                Happy: "Happy",
                Calm: "Calm",
                Tired: "Tired",
                Sad: "Sad",
                Angry: "Angry",
            },
        },
        insight: {
            title: "Daily Insight",
            placeholder: "Select a mood to see your insight.",
            messages: {
                Happy: "Your positive energy is contagious today! Spread it around.",
                Calm: "A peaceful mind is a powerful mind. Enjoy this serenity.",
                Tired: "It's okay to rest. Your body knows what it needs.",
                Sad: "Rainy days are perfect for your soul. Be gentle with yourself.",
                Angry: "Channel this energy into something creative or physical.",
            },
        },
        action: {
            recommended: "Recommended",
            start: "Start Routine",
            tasks: {
                Happy: "Write 3 Gratitude Notes",
                Calm: "10-min Meditation",
                Tired: "Deep Breathing",
                Sad: "Comfort Walk",
                Angry: "Box Breathing",
            },
        },
        home: {
            selectMood: "Select a mood to begin your rhythm.",
        },
        settings: {
            title: "Lite Personality Check",
            guidance: "Your vibe changes like the weather. Feel free to update this anytime!",
            questions: {
                energy: {
                    question: "Where is your energy today?",
                    options: { E: "With People", I: "Alone Time" },
                },
                mind: {
                    question: "What's on your mind?",
                    options: { S: "Real Tasks", N: "Dreamy Ideas" },
                },
                heart: {
                    question: "What do you need right now?",
                    options: { T: "Logical Solution", F: "Warm Comfort" },
                },
                life: {
                    question: "How's your plan today?",
                    options: { J: "Strict Schedule", P: "Go with the Flow" },
                },
            },
            save: "Save Result",
            result: "Your Vibe",
        },
        timer: {
            title: "Focus Time",
            start: "Start",
            pause: "Pause",
            complete: "I did it!",
            remaining: "Time remaining",
            alert: "Time's up! Click 'I did it!' to finish.",
            message: "You can do it!",
        },
        stats: {
            title: "Monthly Mood Stats",
            empty: "No history yet. Start tracking today!",
            back: "Back",
            summary: "Summary",
            days: "days",
            insightTitle: "Monthly Emotional Report",
            badgesTitle: "My Badges",
            badges: {
                sunshine: { name: "Sunshine Soul", desc: "Logged 'Happy' 5+ times" },
                routine: { name: "Routine Master", desc: "Completed 10+ routines" },
                zen: { name: "Zen Master", desc: "Logged 'Calm' 3 days in a row" },
            },
            insight: {
                prefix: "You felt",
                suffix: "most often this month.",
                consistent: "You were consistent for",
                daysSuffix: "days!",
            },
            weatherMate: {
                Rain: "It's raining outside ☔️. Hope you're not feeling too down! How about some warm tea?",
                Clear: "The sun is shining! ☀️ Don't forget to get some Vitamin D today!",
                Clouds: "It's a bit cloudy ☁️. Perfect mood for some cozy focus time.",
                Default: "How is your rhythm today? I'm rooting for you! ✨",
            },
        },
    },
    ko: {
        header: {
            title: "Haru Rhythm",
        },
        hero: {
            today: "오늘",
            greeting: "오늘 기분은 어떠신가요?",
            moods: {
                Happy: "행복",
                Calm: "평온",
                Tired: "피곤",
                Sad: "우울",
                Angry: "화남",
            },
        },
        insight: {
            title: "오늘의 한마디",
            placeholder: "기분을 선택하여 오늘의 한마디를 확인하세요.",
            messages: {
                Happy: "긍정적인 에너지가 넘치네요! 주변에도 나눠주세요.",
                Calm: "평온한 마음이 가장 큰 힘입니다. 이 고요함을 즐기세요.",
                Tired: "쉬어가도 괜찮아요. 몸이 원하는 소리를 들어주세요.",
                Sad: "비 오는 날은 감성에 젖기 딱 좋은 날이죠. 자신을 다독여주세요.",
                Angry: "이 에너지를 창작이나 운동으로 승화시켜보세요.",
            },
        },
        action: {
            recommended: "추천 루틴",
            start: "시작하기",
            tasks: {
                Happy: "감사 일기 3줄 쓰기",
                Calm: "10분 명상하기",
                Tired: "깊은 호흡하기",
                Sad: "가벼운 산책하기",
                Angry: "박스 호흡법 하기",
            },
        },
        home: {
            selectMood: "기분을 선택하여 하루의 리듬을 시작하세요.",
        },
        settings: {
            title: "가벼운 성향 체크",
            guidance: "기분처럼 성향도 바뀔 수 있어요. 편하게 선택해보세요!",
            questions: {
                energy: {
                    question: "오늘 에너지는 어디서?",
                    options: { E: "사람들과 함께", I: "혼자만의 시간" },
                },
                mind: {
                    question: "지금 머릿속은?",
                    options: { S: "현실적인 생각", N: "엉뚱한 상상" },
                },
                heart: {
                    question: "지금 필요한 것은?",
                    options: { T: "명확한 해결책", F: "따뜻한 위로" },
                },
                life: {
                    question: "오늘의 계획은?",
                    options: { J: "계획대로 착착", P: "흐름가는 대로" },
                },
            },
            save: "저장하기",
            result: "나의 바이브",
        },
        timer: {
            title: "집중 시간",
            start: "시작",
            pause: "일시정지",
            complete: "완료!",
            remaining: "남은 시간",
            alert: "시간이 다 되었습니다! '완료' 버튼을 눌러 루틴을 끝내세요.",
            message: "잠시 집중해 보세요!",
        },
        stats: {
            title: "월별 기분 통계",
            empty: "아직 기록이 없어요. 오늘부터 시작해보세요!",
            back: "뒤로",
            summary: "요약",
            days: "일",
            insightTitle: "월간 감정 리포트",
            badgesTitle: "나의 뱃지",
            badges: {
                sunshine: { name: "햇살 영혼", desc: "행복 5회 이상 기록" },
                routine: { name: "루틴 마스터", desc: "루틴 10회 이상 완료" },
                zen: { name: "젠 마스터", desc: "3일 연속 평온 기록" },
            },
            insight: {
                prefix: "이번 달은",
                suffix: "감정을 가장 많이 느꼈어요.",
                consistent: "연속",
                daysSuffix: "일 동안 기록했어요!",
            },
            weatherMate: {
                Rain: "비가 오네요 ☔️. 기분이 처지지 않게 따뜻한 차 한 잔 어때요?",
                Clear: "햇살이 좋아요! ☀️ 잠깐 나가서 광합성 좀 하고 오세요!",
                Clouds: "구름이 꼈네요 ☁️. 차분하게 집중하기 딱 좋은 날씨예요.",
                Default: "오늘 하루도 당신의 리듬을 응원해요! ✨",
            },
        },
    },
};
