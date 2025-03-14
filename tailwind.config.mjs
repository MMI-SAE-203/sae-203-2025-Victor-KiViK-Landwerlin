/**@type {import('tailwindcss').Config}*/
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                lexend: ['Lexend', 'sans-serif'],
            },
        },
    },
    plugins: [],
};