/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#8B4513', // Warm brown (primary) - brown-700
        'primary-50': '#FDF8F6', // Very light brown (50-level shade) - brown-50
        'primary-100': '#F7E6D7', // Light brown (100-level shade) - brown-100
        'primary-200': '#EDCDB0', // Light brown (200-level shade) - brown-200
        'primary-300': '#E0B088', // Medium light brown (300-level shade) - brown-300
        'primary-400': '#D19660', // Medium brown (400-level shade) - brown-400
        'primary-500': '#B8763A', // Medium brown (500-level shade) - brown-500
        'primary-600': '#9F5A2A', // Medium dark brown (600-level shade) - brown-600
        'primary-700': '#8B4513', // Dark brown (primary) - brown-700
        'primary-800': '#6B3410', // Darker brown (800-level shade) - brown-800
        'primary-900': '#4A240B', // Very dark brown (900-level shade) - brown-900

        // Secondary Colors
        'secondary': '#D2B48C', // Complementary tan (secondary) - tan-400
        'secondary-50': '#FDFCFA', // Very light tan (50-level shade) - tan-50
        'secondary-100': '#F8F4ED', // Light tan (100-level shade) - tan-100
        'secondary-200': '#F0E6D2', // Light tan (200-level shade) - tan-200
        'secondary-300': '#E7D7B7', // Medium light tan (300-level shade) - tan-300
        'secondary-400': '#D2B48C', // Medium tan (secondary) - tan-400
        'secondary-500': '#C4A373', // Medium tan (500-level shade) - tan-500
        'secondary-600': '#B5925A', // Medium dark tan (600-level shade) - tan-600
        'secondary-700': '#9A7B4A', // Dark tan (700-level shade) - tan-700
        'secondary-800': '#7A613A', // Darker tan (800-level shade) - tan-800
        'secondary-900': '#5A472B', // Very dark tan (900-level shade) - tan-900

        // Accent Colors
        'accent': '#CD853F', // Rich gold (accent) - goldenrod-500
        'accent-50': '#FDF9F4', // Very light gold (50-level shade) - goldenrod-50
        'accent-100': '#F9F0E1', // Light gold (100-level shade) - goldenrod-100
        'accent-200': '#F2E0C3', // Light gold (200-level shade) - goldenrod-200
        'accent-300': '#EACFA5', // Medium light gold (300-level shade) - goldenrod-300
        'accent-400': '#E1BE87', // Medium gold (400-level shade) - goldenrod-400
        'accent-500': '#CD853F', // Rich gold (accent) - goldenrod-500
        'accent-600': '#B8732F', // Medium dark gold (600-level shade) - goldenrod-600
        'accent-700': '#A3611F', // Dark gold (700-level shade) - goldenrod-700
        'accent-800': '#8E4F0F', // Darker gold (800-level shade) - goldenrod-800
        'accent-900': '#6B3B0B', // Very dark gold (900-level shade) - goldenrod-900

        // Background Colors
        'background': '#FEFEFE', // Warm white (background) - neutral-50
        'surface': '#F8F6F3', // Subtle cream (surface) - stone-50

        // Text Colors
        'text-primary': '#2C1810', // Deep brown (text primary) - brown-900
        'text-secondary': '#6B4E3D', // Medium brown (text secondary) - brown-600

        // Status Colors
        'success': '#228B22', // Forest green (success) - green-700
        'success-50': '#F0FDF4', // Very light green (50-level shade) - green-50
        'success-100': '#DCFCE7', // Light green (100-level shade) - green-100
        'success-500': '#22C55E', // Medium green (500-level shade) - green-500

        'warning': '#DAA520', // Goldenrod (warning) - yellow-600
        'warning-50': '#FEFCE8', // Very light yellow (50-level shade) - yellow-50
        'warning-100': '#FEF3C7', // Light yellow (100-level shade) - yellow-100
        'warning-500': '#EAB308', // Medium yellow (500-level shade) - yellow-500

        'error': '#B22222', // Muted red (error) - red-700
        'error-50': '#FEF2F2', // Very light red (50-level shade) - red-50
        'error-100': '#FEE2E2', // Light red (100-level shade) - red-100
        'error-500': '#EF4444', // Medium red (500-level shade) - red-500

        // Border
        'border': 'rgba(44, 24, 16, 0.1)', // Primary border color
      },
      fontFamily: {
        'heading': ['Crimson Text', 'serif'], // Headings font
        'body': ['Inter', 'sans-serif'], // Body text font
        'caption': ['Source Sans Pro', 'sans-serif'], // Captions font
        'mono': ['JetBrains Mono', 'monospace'], // Data/code font
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(44, 24, 16, 0.1)',
        'modal': '0 4px 12px rgba(44, 24, 16, 0.15)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      zIndex: {
        '1000': '1000',
        '1010': '1010',
        '1020': '1020',
        '1030': '1030',
      },
    },
  },
  plugins: [],
}