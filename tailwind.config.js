/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    // 👇 Vercel에게 색상을 강제로 남기라고 명령하는 부분
    safelist: [
        { pattern: /from-(red|orange|yellow|green|teal|blue|indigo|purple|slate|gray|rose)-(400|500|600)/, },
        { pattern: /via-(red|orange|yellow|green|teal|blue|indigo|purple|slate|gray|rose)-(400|500|600)/, },
        { pattern: /to-(red|orange|yellow|green|teal|blue|indigo|purple|slate|gray|rose)-(400|500|600)/, },
    ],
}