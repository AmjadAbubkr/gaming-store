/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0e0e0e',
        surface: '#0e0e0e',
        'surface-container': '#1a1919',
        'surface-container-low': '#131313',
        'surface-container-high': '#201f1f',
        'surface-container-highest': '#262626',
        'surface-container-lowest': '#000000',
        primary: '#8ff5ff',
        'primary-container': '#00eefc',
        'primary-dim': '#00deec',
        'on-primary': '#005d63',
        'on-primary-container': '#005359',
        secondary: '#d575ff',
        'secondary-container': '#9800d0',
        'secondary-dim': '#b90afc',
        'on-secondary': '#390050',
        'on-secondary-container': '#fff5fc',
        tertiary: '#9dfaff',
        'tertiary-container': '#72eff5',
        error: '#ff716c',
        'error-container': '#9f0519',
        'on-error': '#490006',
        'on-background': '#ffffff',
        'on-surface': '#ffffff',
        'on-surface-variant': '#adaaaa',
        outline: '#777575',
        'outline-variant': '#494847',
        'whatsapp-green': '#25D366',
        'whatsapp-dark': '#128C7E',
      },
      fontFamily: {
        headline: ['SpaceGrotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['SpaceGrotesk', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(143, 245, 255, 0.3)',
        'purple-glow': '0 0 15px rgba(213, 117, 255, 0.4)',
        'whatsapp-glow': '0 0 20px rgba(37, 211, 102, 0.4)',
      }
    },
  },
  plugins: [],
}
