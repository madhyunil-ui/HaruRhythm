import { TRANSLATIONS } from '../context/translations.js';

/**
 * Haru Mood Elevator (Behavioral Psychology AI Logic)
 * 
 * Logic:
 * 1. NEGATIVE (Depressed/Tired/Anxious/Angry) -> Strategy: "Boost Up" (Micro-achievement)
 *    - Introvert (I): Solitary healing (e.g., "Write 3 lines of diary")
 *    - Extrovert (E): Social connection (e.g., "Send a heart emoji to a friend")
 * 
 * 2. POSITIVE (Happy) -> Strategy: "Amplify" (Expansion)
 *    - Action: Prolong and record feeling (e.g., "Take a photo", "Dance")
 */

/**
 * Generates a mood-optimizing routine based on emotion and personality.
 * 
 * @param {string} emotion - User Emotion [Depressed, Angry, Anxious, Tired, Happy]
 * @param {string} mbti - User MBTI (e.g., "ENFP", "ISTJ")
 * @param {string} language - Target User Language Code (e.g., "en", "ko")
 * @returns {object} JSON object with routine_title, routine_desc, cheering_message, estimated_time
 */
export function getHaruRoutine(emotion, mbti, language) {
    // Default to 'en' if language not supported
    const lang = TRANSLATIONS[language] ? language : 'en';
    const content = TRANSLATIONS[lang].haru || TRANSLATIONS['en'].haru;

    // Normalize inputs
    const emot = emotion ? emotion.toLowerCase() : 'tired';
    const mbtiType = mbti ? mbti.toUpperCase() : 'ISTJ';
    const isExtrovert = mbtiType.startsWith('E');

    // Logic Algorithm
    const negativeEmotions = ['depressed', 'tired', 'anxious', 'angry'];
    const isNegative = negativeEmotions.includes(emot);

    let result = {};

    if (isNegative) {
        // Strategy: "Boost Up" (Micro-achievement)
        if (isExtrovert) {
            // Extrovert: Social connection
            result = {
                routine_title: content.negative_e_title,
                routine_desc: content.negative_e_desc,
                cheering_message: content.negative_e_cheer,
                estimated_time: content.time_5m
            };
        } else {
            // Introvert: Solitary healing
            result = {
                routine_title: content.negative_i_title,
                routine_desc: content.negative_i_desc,
                cheering_message: content.negative_i_cheer,
                estimated_time: content.time_5m
            };
        }
    } else {
        // Positive (Happy/Joy)
        // Strategy: "Amplify"
        result = {
            routine_title: content.positive_title,
            routine_desc: content.positive_desc,
            cheering_message: content.positive_cheer,
            estimated_time: content.time_5m // Taking a photo is quick
        };
    }

    return result;
}
