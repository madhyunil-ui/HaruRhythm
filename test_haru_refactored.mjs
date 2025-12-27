
import { getHaruRoutine } from './src/utils/haru.js';

console.log("Test 1 (Depressed, ISTJ, ko):", JSON.stringify(getHaruRoutine('Depressed', 'ISTJ', 'ko'), null, 2));
console.log("Test 2 (Happy, ENFP, en):", JSON.stringify(getHaruRoutine('Happy', 'ENFP', 'en'), null, 2));
console.log("Test 3 (Tired, ENFP, es):", JSON.stringify(getHaruRoutine('Tired', 'ENFP', 'es'), null, 2));
console.log("Test 4 (Angry, ESTJ, fr):", JSON.stringify(getHaruRoutine('Angry', 'ESTJ', 'fr'), null, 2));
