/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Headlines: Poppins
        'headline': ['Poppins', 'system-ui', 'sans-serif'],
        // Body text: Nunito Sans
        'body': ['Nunito Sans', 'system-ui', 'sans-serif'],
        // Default sans fallback
        'sans': ['Nunito Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary Colors - Enhanced for therapeutic calm
        'primary': {
          // Background: Enhanced therapeutic gradient
          bg: '#F8FAFA',
          // CTA Buttons: #A8DADC
          cta: '#A8DADC',
          'cta-hover': '#97C7CA', // 10% darker
        },
        // Supporting Colors
        'text': {
          // Text: #34495E
          primary: '#34495E',
          secondary: '#5A6C7D', // Lighter variant for secondary text
        },
        'accent': {
          // Accent: #FAD4C0
          primary: '#FAD4C0',
          light: '#FCE4D6', // Lighter variant
          dark: '#F8C4A6', // Darker variant
        },
        // Therapeutic Background Colors
        'therapeutic': {
          mint: '#F0FDFA',
          sage: '#F6F9F7', 
          lavender: '#F8F7FF',
          pearl: '#FEFEFE',
          cloud: '#F9FAFB',
          whisper: '#FBFCFC',
          serenity: '#F0F8FF',
          tranquil: '#F5FFFA',
          peaceful: '#FFFAF0',
          gentle: '#F8F8FF',
        },
        // Enhanced color system for better design flexibility
        'neutral': {
          50: '#F8FAFA',
          100: '#F0F4F4',
          200: '#E2E8E8',
          300: '#CBD5D5',
          400: '#9EABAB',
          500: '#6B7878',
          600: '#34495E',
          700: '#2C3E50',
          800: '#1A252F',
          900: '#0F1419',
        },
        // Keep existing therapy colors for backward compatibility
        'therapy-gray': {
          50: '#F8FAFA',
          100: '#F0F2F5',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#34495E',
          700: '#374151',
          800: '#1f2937',
        },
        // Enhanced soft-blue and muted-teal with therapeutic variants
        'soft-blue': {
          50: '#F0F8FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#A8DADC',
          500: '#B3CDE0',
          600: '#0284C7',
          700: '#0369A1',
        },
        'muted-teal': {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#77BFA3',
          500: '#81C3B0',
          600: '#0D9488',
          700: '#0F766E',
        },
        // Calming color variants
        'sage': {
          50: '#F6F9F7',
          100: '#ECFDF5',
          200: '#D1FAE5',
          300: '#A7F3D0',
          400: '#6EE7B7',
          500: '#34D399',
          600: '#10B981',
          700: '#059669',
        },
        'lavender': {
          50: '#F8F7FF',
          100: '#FAF5FF',
          200: '#F3E8FF',
          300: '#E9D5FF',
          400: '#D8B4FE',
          500: '#C084FC',
          600: '#A855F7',
          700: '#9333EA',
        },
      },
      lineHeight: {
        'body': '1.6', // Specified line height for body text
      },
      fontSize: {
        // Responsive typography scale
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        // Enhanced spacing scale for better layouts
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        // Modern border radius values
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        // Harmonious shadow system
        'gentle': '0 1px 3px 0 rgba(52, 73, 94, 0.1), 0 1px 2px 0 rgba(52, 73, 94, 0.06)',
        'calm': '0 4px 6px -1px rgba(52, 73, 94, 0.1), 0 2px 4px -1px rgba(52, 73, 94, 0.06)',
        'serene': '0 10px 15px -3px rgba(52, 73, 94, 0.1), 0 4px 6px -2px rgba(52, 73, 94, 0.05)',
        'peaceful': '0 20px 25px -5px rgba(52, 73, 94, 0.1), 0 10px 10px -5px rgba(52, 73, 94, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'gentle-bounce': 'gentleBounce 4s ease-in-out infinite',
        'breathing': 'breathing 3s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
      },
      backgroundImage: {
        'therapeutic-gradient': 'linear-gradient(135deg, #F8FAFA 0%, #F0FDFA 50%, #F6F9F7 100%)',
        'therapeutic-mint': 'linear-gradient(135deg, #F0FDFA 0%, #ECFDF5 100%)',
        'therapeutic-sage': 'linear-gradient(135deg, #F6F9F7 0%, #F0FDF4 100%)',
        'therapeutic-lavender': 'linear-gradient(135deg, #F8F7FF 0%, #FAF5FF 100%)',
        'therapeutic-pearl': 'linear-gradient(135deg, #FEFEFE 0%, #F9FAFB 100%)',
        'therapeutic-cloud': 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
      },
    },
  },
  plugins: [],
};