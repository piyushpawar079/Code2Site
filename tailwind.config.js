// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export const content = [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Add this if you use src folder
];
export const theme = {
    extend: {
        animation: {
            'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        },
        colors: {
            // Add custom colors if needed
            'blue': {
                400: '#60a5fa',
                500: '#3b82f6',
                600: '#2563eb',
                700: '#1d4ed8',
            },
            'purple': {
                400: '#a78bfa',
                500: '#8b5cf6',
                600: '#7c3aed',
                700: '#6d28d9',
            },
            'pink': {
                400: '#f472b6',
                500: '#ec4899',
                600: '#db2777',
            },
            'green': {
                400: '#4ade80',
            }
        }
    },
};
export const plugins = [];