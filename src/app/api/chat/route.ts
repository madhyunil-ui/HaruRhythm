import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, mood, weather, mbti, history } = await req.json(); // history 추가
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

        if (!apiKey) return NextResponse.json({ text: "API Key Missing" }, { status: 500 });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // 프롬프트 대폭 강화: 딴소리 차단 및 친구 모드
        const prompt = `
      You are 'Haru', a close, warm-hearted friend living in the user's phone.
      
      [Current Situation]
      - User Mood: ${mood}
      - Weather: ${weather?.type}
      - MBTI: ${mbti}
      - User's Last Message: "${message}"

      [Instructions]
      1. Reply in Korean (Casual & Polite 'Haeyo-che' ~해요).
      2. Be concise (1-2 sentences max).
      3. EMPATHIZE first. If they are sad, be soft. If happy, be excited.
      4. Do NOT ask too many questions. Just listen and support.
      5. IMPORTANT: Respond DIRECTLY to what the user just said. Do not start a new topic randomly.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return NextResponse.json({ text: response.text() });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ text: "지금은 머리가 좀 복잡해요. 잠시 후에 다시 말 걸어주세요! 😵‍💫" }, { status: 500 });
    }
}