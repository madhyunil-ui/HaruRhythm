export type WeatherType = "Clear" | "Clouds" | "Rain" | "Snow" | "Drizzle" | "Thunderstorm" | "Mist" | "Smoke" | "Haze" | "Dust" | "Fog" | "Sand" | "Ash" | "Squall" | "Tornado" | "Unknown";
export type MoodType = "Happy" | "Calm" | "Tired" | "Sad" | "Angry";
export type MBTIType = string; // e.g., "INTJ"

interface Task {
    id: string;
    text: string;
    duration: string;
}

interface Recommendation {
    insight: string;
    tasks: Task[];
}

export function getRecommendation(
    weather: WeatherType,
    mood: MoodType,
    mbti: MBTIType,
    language: "en" | "ko",
    isNight: boolean = false
): Recommendation {
    const isE = mbti.includes("E");
    const isI = mbti.includes("I");
    const isS = mbti.includes("S");
    const isN = mbti.includes("N");
    const isT = mbti.includes("T");
    const isF = mbti.includes("F");
    const isJ = mbti.includes("J");
    const isP = mbti.includes("P");

    let options: Recommendation[] = [];

    // --- Specific Scenarios ---

    // 1. Rainy & Sad & Introvert -> Cozy & Recharge
    if ((weather === "Rain" || weather === "Drizzle") && mood === "Sad" && isI) {
        options = [
            {
                insight: language === "en"
                    ? "Raindrops are nature's lullaby. Let them wash away your worries while you stay warm inside."
                    : "빗소리는 자연이 부르는 자장가예요. 따뜻한 실내에서 걱정을 씻어내세요.",
                tasks: [
                    { id: "rs1", text: language === "en" ? "Make a hot drink (tea/cocoa)" : "따뜻한 음료 만들기 (차/코코아)", duration: "5 min" },
                    { id: "rs2", text: language === "en" ? "Find a cozy reading spot" : "아늑한 독서 공간 찾기", duration: "2 min" },
                    { id: "rs3", text: language === "en" ? "Read 10 pages of a book" : "책 10페이지 읽기", duration: "15 min" },
                    { id: "rs4", text: language === "en" ? "Listen to rain sounds" : "빗소리 감상하기", duration: "5 min" },
                    { id: "rs5", text: language === "en" ? "Write down 3 feelings" : "감정 3가지 적어보기", duration: "5 min" },
                ]
            },
            {
                insight: language === "en"
                    ? "The sky is crying so you don't have to. Embrace the comfort of solitude."
                    : "하늘이 대신 울어주고 있어요. 고요한 혼자만의 시간을 즐기세요.",
                tasks: [
                    { id: "rs6", text: language === "en" ? "Put on comfortable pajamas" : "편안한 잠옷 입기", duration: "2 min" },
                    { id: "rs7", text: language === "en" ? "Light a scented candle" : "향초 켜기", duration: "1 min" },
                    { id: "rs8", text: language === "en" ? "Play soft acoustic music" : "부드러운 어쿠스틱 음악 틀기", duration: "1 min" },
                    { id: "rs9", text: language === "en" ? "Journal freely for 10 mins" : "10분간 자유롭게 일기 쓰기", duration: "10 min" },
                    { id: "rs10", text: language === "en" ? "Lie down and close eyes" : "누워서 눈 감고 있기", duration: "5 min" },
                ]
            },
        ];
    }
    // 2. Clear & Happy & Extrovert -> Active & Social
    else if (weather === "Clear" && mood === "Happy" && isE) {
        if (isNight) {
            options = [
                {
                    insight: language === "en"
                        ? "The moon is spotlighting your energy! Shine bright like a star."
                        : "달님이 당신의 에너지를 비추고 있어요! 별처럼 반짝이세요.",
                    tasks: [
                        { id: "chn1", text: language === "en" ? "Put on running shoes" : "러닝화 신기", duration: "2 min" },
                        { id: "chn2", text: language === "en" ? "Create a night vibe playlist" : "밤 감성 플레이리스트 만들기", duration: "3 min" },
                        { id: "chn3", text: language === "en" ? "Go for a night walk/run" : "밤 산책/달리기", duration: "20 min" },
                        { id: "chn4", text: language === "en" ? "Take a selfie with the moon" : "달과 함께 셀카 찍기", duration: "1 min" },
                        { id: "chn5", text: language === "en" ? "Share night vibes on social media" : "SNS에 밤 감성 공유하기", duration: "5 min" },
                    ]
                },
                {
                    insight: language === "en"
                        ? "A beautiful night for a beautiful soul. Gather friends under the stars."
                        : "아름다운 영혼을 위한 아름다운 밤이에요. 별빛 아래 친구들과 모이세요.",
                    tasks: [
                        { id: "chn6", text: language === "en" ? "Text a friend" : "친구에게 문자하기", duration: "2 min" },
                        { id: "chn7", text: language === "en" ? "Look up a late-night cafe/bar" : "심야 카페/바 검색하기", duration: "3 min" },
                        { id: "chn8", text: language === "en" ? "Get ready to go out" : "외출 준비하기", duration: "15 min" },
                        { id: "chn9", text: language === "en" ? "Walk to the meeting spot" : "약속 장소로 걸어가기", duration: "10 min" },
                        { id: "chn10", text: language === "en" ? "Enjoy deep conversations" : "깊은 대화 나누기", duration: "30 min" },
                    ]
                },
            ];
        } else {
            options = [
                {
                    insight: language === "en"
                        ? "The sun is applauding your energy! Go out and share your light with the world."
                        : "태양이 당신의 에너지를 응원하고 있어요! 밖으로 나가 세상과 빛을 나누세요.",
                    tasks: [
                        { id: "ch1", text: language === "en" ? "Put on running shoes" : "러닝화 신기", duration: "2 min" },
                        { id: "ch2", text: language === "en" ? "Create an upbeat playlist" : "신나는 플레이리스트 만들기", duration: "3 min" },
                        { id: "ch3", text: language === "en" ? "Go for a 20-min run/walk" : "20분간 달리기/걷기", duration: "20 min" },
                        { id: "ch4", text: language === "en" ? "Take a sunny selfie" : "햇살 아래 셀카 찍기", duration: "1 min" },
                        { id: "ch5", text: language === "en" ? "Share vibes on social media" : "SNS에 기분 공유하기", duration: "5 min" },
                    ]
                },
                {
                    insight: language === "en"
                        ? "Perfect weather for a perfect mood. Call a friend and make a memory."
                        : "완벽한 기분에 어울리는 완벽한 날씨네요. 친구에게 연락해 추억을 만드세요.",
                    tasks: [
                        { id: "ch6", text: language === "en" ? "Text a friend to meet up" : "친구에게 만남 문자 보내기", duration: "2 min" },
                        { id: "ch7", text: language === "en" ? "Look up a nice cafe nearby" : "근처 예쁜 카페 검색하기", duration: "3 min" },
                        { id: "ch8", text: language === "en" ? "Get ready to go out" : "외출 준비하기", duration: "15 min" },
                        { id: "ch9", text: language === "en" ? "Walk to the meeting spot" : "약속 장소로 걸어가기", duration: "10 min" },
                        { id: "ch10", text: language === "en" ? "Enjoy a conversation" : "즐거운 대화 나누기", duration: "30 min" },
                    ]
                },
            ];
        }
    }

    // --- Fallback to Mood-Based Variety ---

    if (options.length === 0) {
        switch (mood) {
            case "Happy":
                options = [
                    {
                        insight: language === "en" ? "Your smile is your superpower today." : "오늘 당신의 미소는 슈퍼파워입니다.",
                        tasks: [
                            { id: "h1", text: language === "en" ? "Smile in the mirror" : "거울 보고 미소 짓기", duration: "1 min" },
                            { id: "h2", text: language === "en" ? "Write 3 gratitude notes" : "감사 일기 3줄 쓰기", duration: "5 min" },
                            { id: "h3", text: language === "en" ? "Send a compliment text" : "칭찬 문자 보내기", duration: "2 min" },
                            { id: "h4", text: language === "en" ? "Listen to your favorite song" : "최애곡 듣기", duration: "4 min" },
                            { id: "h5", text: language === "en" ? "High-five yourself (literally)" : "자신에게 하이파이브 하기", duration: "1 min" },
                        ]
                    },
                    {
                        insight: language === "en" ? "Ride this wave of positivity!" : "이 긍정의 파도를 타세요!",
                        tasks: [
                            { id: "h6", text: language === "en" ? "Brainstorm a new idea" : "새로운 아이디어 구상하기", duration: "5 min" },
                            { id: "h7", text: language === "en" ? "Organize your workspace" : "책상 정리하기", duration: "5 min" },
                            { id: "h8", text: language === "en" ? "Start a small project" : "작은 프로젝트 시작하기", duration: "15 min" },
                            { id: "h9", text: language === "en" ? "Share your plan with someone" : "계획 공유하기", duration: "5 min" },
                            { id: "h10", text: language === "en" ? "Celebrate starting!" : "시작을 자축하기!", duration: "1 min" },
                        ]
                    },
                ];
                break;
            case "Calm":
                options = [
                    {
                        insight: language === "en" ? "Peace comes from within. Stay centered." : "평화는 내면에서 옵니다. 중심을 잡으세요.",
                        tasks: [
                            { id: "c1", text: language === "en" ? "Take 5 deep breaths" : "깊게 5번 호흡하기", duration: "2 min" },
                            { id: "c2", text: language === "en" ? "Stretch your neck slowly" : "천천히 목 스트레칭", duration: "2 min" },
                            { id: "c3", text: language === "en" ? "Drink a glass of water" : "물 한 잔 마시기", duration: "1 min" },
                            { id: "c4", text: language === "en" ? "Observe your surroundings" : "주변 관찰하기", duration: "3 min" },
                            { id: "c5", text: language === "en" ? "Close eyes for 1 minute" : "1분간 눈 감기", duration: "1 min" },
                        ]
                    },
                ];
                break;
            case "Tired":
                options = [
                    {
                        insight: language === "en" ? "Rest is not a reward, it's a necessity." : "휴식은 보상이 아니라 필수입니다.",
                        tasks: [
                            { id: "t1", text: language === "en" ? "Put phone away" : "핸드폰 멀리 두기", duration: "1 min" },
                            { id: "t2", text: language === "en" ? "Lie down comfortably" : "편안하게 눕기", duration: "1 min" },
                            { id: "t3", text: language === "en" ? "Close your eyes" : "눈 감기", duration: "1 min" },
                            { id: "t4", text: language === "en" ? "Focus on your breath" : "호흡에 집중하기", duration: "5 min" },
                            { id: "t5", text: language === "en" ? "Slowly get up" : "천천히 일어나기", duration: "1 min" },
                        ]
                    },
                ];
                break;
            case "Sad":
                options = [
                    {
                        insight: language === "en" ? "It's okay not to be okay. Feelings are visitors." : "괜찮지 않아도 괜찮아요. 감정은 잠시 머무는 손님입니다.",
                        tasks: [
                            { id: "s1", text: language === "en" ? "Wrap yourself in a blanket" : "담요로 몸 감싸기", duration: "1 min" },
                            { id: "s2", text: language === "en" ? "Make a warm tea" : "따뜻한 차 만들기", duration: "5 min" },
                            { id: "s3", text: language === "en" ? "Watch a funny cat video" : "재미있는 고양이 영상 보기", duration: "3 min" },
                            { id: "s4", text: language === "en" ? "Hug a pillow (or pet)" : "베개(또는 반려동물) 안기", duration: "1 min" },
                            { id: "s5", text: language === "en" ? "Take a deep sigh" : "깊은 한숨 쉬기", duration: "1 min" },
                        ]
                    },
                ];
                break;
            case "Angry":
                options = [
                    {
                        insight: language === "en" ? "Anger is energy. Transform it." : "분노도 에너지입니다. 긍정적으로 바꿔보세요.",
                        tasks: [
                            { id: "a1", text: language === "en" ? "Do 10 jumping jacks" : "팔벌려뛰기 10회", duration: "2 min" },
                            { id: "a2", text: language === "en" ? "Splash cold water on face" : "찬물로 세수하기", duration: "2 min" },
                            { id: "a3", text: language === "en" ? "Squeeze a stress ball" : "스트레스 볼 쥐어짜기", duration: "1 min" },
                            { id: "a4", text: language === "en" ? "Write down what made you mad" : "화난 이유 적어보기", duration: "3 min" },
                            { id: "a5", text: language === "en" ? "Tear up the paper" : "종이 찢어버리기", duration: "1 min" },
                        ]
                    },
                ];
                break;
        }
    }

    // Fallback
    if (options.length === 0) {
        return {
            insight: language === "en" ? "Listen to your heart." : "마음의 소리를 들으세요.",
            tasks: [
                { id: "f1", text: language === "en" ? "Breathe in" : "숨 들이마시기", duration: "1 min" },
                { id: "f2", text: language === "en" ? "Breathe out" : "숨 내뱉기", duration: "1 min" },
                { id: "f3", text: language === "en" ? "Stretch arms" : "팔 스트레칭", duration: "1 min" },
                { id: "f4", text: language === "en" ? "Smile" : "미소 짓기", duration: "1 min" },
                { id: "f5", text: language === "en" ? "Say 'I am okay'" : "'나는 괜찮아'라고 말하기", duration: "1 min" },
            ]
        };
    }

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}
