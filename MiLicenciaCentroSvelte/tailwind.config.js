/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        milicencia: {
          "primary": "#1565c0",
          "primary-content": "#ffffff",
          "secondary": "#0d47a1",
          "secondary-content": "#ffffff",
          "accent": "#f57c00",
          "accent-content": "#ffffff",
          "neutral": "#374151",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "base-content": "#111827",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        }
      },
      "light"
    ],
    defaultTheme: "milicencia",
  }
};
