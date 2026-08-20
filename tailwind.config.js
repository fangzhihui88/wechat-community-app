/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4757',
          light: '#FF6B81',
          bg: '#FFE4E1',
        },
        text: {
          primary: '#333333',
          secondary: '#666666',
          tertiary: '#999999',
        },
        bg: {
          page: '#F7F7F7',
          card: '#FFFFFF',
        },
      },
      spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '9999px',
      },
      fontSize: {
        xs: '24px',
        sm: '26px',
        md: '28px',
        lg: '32px',
        xl: '36px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 关闭 preflight，避免影响小程序组件样式
  },
}
