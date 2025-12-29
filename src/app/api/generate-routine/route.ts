import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { mood, personality, weather } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error("API Key missing. Checked: GEMINI_API_KEY, NEXT_PUBLIC_GEMINI_API_KEY, OPENAI_API_KEY");
            return NextResponse.json({ error: "Server API Key Missing" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Role: You are a warm, empathetic Psychological Care Expert and Routine Coach.
[User Context]
- Personality Type: ${personality || "Unknown"}
- Current Mood: ${mood}
- Weather: ${weather || "Normal"}

[Task]
1. Analyze the user's context.
2. Generate a Response in strictly JSON format.
3. "message": A warm, comforting 1-sentence message in Korean (Haeyo-che, ~해요).
4. "routines": A list of exactly 3 simple, immediately actionable, small routines (micro-habits).

[Output Requirements]
- Language: Korean
- Format: valid JSON object
- No Markdown formatting (e.g. no \`\`\`json). Just the raw JSON string.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Cleanup markdown if present
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        let data;
        try {
            data = JSON.parse(cleanedText);
        } catch (e) {
            console.error("JSON Parse Error", e);
            // Fallback if JSON parsing fails
            data = {
                message: "오늘 하루도 정말 고생 많으셨어요. 편안한 휴식 되세요.",
                routines: ["따뜻한 물 한 잔 마시기", "깊게 심호흡 3번 하기", "좋아하는 음악 듣기"]
            };
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate routine" },
            { status: 500 }
        );
    }
}
