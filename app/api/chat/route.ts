import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Using hardcoded key for reliability as per previous debugging
        const apiKey = "AIzaSyD-S4-PvCQt96mC_UuSt424HBbnm0gSk-0";

        if (!apiKey) {
            console.error("API Key missing");
            return NextResponse.json({ response: "API Key가 설정되지 않았습니다." });
        }

        const body = await req.json();
        const { message, context } = body;
        const { weather, mood, mbti, isNight } = context || {};

        const systemPrompt = `
        You are Haru, a warm and empathetic mental health coach.
        
        User Context:
        - MBTI: ${mbti || "Unknown"}
        - Current Mood: ${mood || "Unknown"}
        - Weather: ${weather || "Unknown"}
        - Time: ${isNight ? "Night" : "Day"}
        
        User Input: "${message}"
        
        Instructions:
        1. Analyze the user's input based on their context (MBTI, Mood, Weather, Time).
        2. Provide empathy first, acknowledging their feelings.
        3. Then, offer a small, actionable piece of advice or a comforting thought.
        4. Keep the response short (2-3 sentences max).
        5. Use emojis to be warm and expressive.
        6. Reply in Korean.

        Specific Scenarios (Guide only, adapt naturally):
        - If Weather is "Clear" AND Time is "Night": Mention the beautiful stars and wish them a restful night. (e.g., "밤하늘에 별이 예쁘네요 🌟. 편안한 밤 보내세요.")
        - If Weather is "Rain" AND Time is "Night": Mention the sound of rain and sleep well. (e.g., "비 내리는 밤이네요 🌧️. 빗소리 들으며 푹 주무세요.")
        
        CRITICAL SAFETY PROTOCOL:
        If the user expresses severe distress, suicidal thoughts, or self-harm:
        - IMMEDIATELY stop normal advice.
        - Provide a supportive message urging them to seek professional help.
        - Include this standard crisis info (in Korean): "혼자 힘들어하지 마세요. 당신은 소중한 사람입니다. 24시간 전문가의 도움을 받을 수 있어요: 자살예방상담전화 1393, 정신건강상담전화 1577-0199"
        `;

        // Using gemini-2.0-flash as identified in diagnostic
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", response.status, response.statusText, errorText);
            throw new Error(`Gemini API Error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("No response text found in API result");
        }

        return NextResponse.json({ response: text });

    } catch (error: any) {
        console.error("DEBUG API ERROR:", error);
        return NextResponse.json({ response: "Error Details: " + error.message });
    }
}
