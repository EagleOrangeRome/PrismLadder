/**
 * PrismLadder Design Tokens
 * Generated deterministically from seed: SHA256("PrismLadder" + "Sepolia" + "202411" + "PrismLadderCompensation")
 * 
 * Design System: Modern Glassmorphism + Data-Driven
 * Color Philosophy: Trust (Violet) + Fairness (Emerald) + Insight (Amber)
 */

export type DensityMode = 'comfortable' | 'compact';
export type ColorMode = 'light' | 'dark';

export const designTokens = {
  // Color Palette - Light Mode
  colors: {
    light: {
      primary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1', // Main primary
        600: '#4F46E5',
        700: '#4338CA',
        800: '#3730A3',
        900: '#312E81',
      },
      secondary: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981', // Main secondary
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
      },
      accent: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B', // Main accent
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
      },
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      neutral: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
      },
      background: {
        primary: '#FFFFFF',
        secondary: '#F8FAFC',
        tertiary: '#F1F5F9',
      },
      text: {
        primary: '#0F172A',
        secondary: '#475569',
        tertiary: '#94A3B8',
        inverse: '#FFFFFF',
      },
      border: {
        default: '#E2E8F0',
        light: '#F1F5F9',
        medium: '#CBD5E1',
        dark: '#94A3B8',
      },
    },
    // Color Palette - Dark Mode
    dark: {
      primary: {
        50: '#312E81',
        100: '#3730A3',
        200: '#4338CA',
        300: '#4F46E5',
        400: '#6366F1',
        500: '#818CF8', // Main primary (lighter in dark mode)
        600: '#A5B4FC',
        700: '#C7D2FE',
        800: '#E0E7FF',
        900: '#EEF2FF',
      },
      secondary: {
        50: '#064E3B',
        100: '#065F46',
        200: '#047857',
        300: '#059669',
        400: '#10B981',
        500: '#34D399', // Main secondary (lighter in dark mode)
        600: '#6EE7B7',
        700: '#A7F3D0',
        800: '#D1FAE5',
        900: '#ECFDF5',
      },
      accent: {
        50: '#78350F',
        100: '#92400E',
        200: '#B45309',
        300: '#D97706',
        400: '#F59E0B',
        500: '#FBBF24', // Main accent (lighter in dark mode)
        600: '#FCD34D',
        700: '#FDE68A',
        800: '#FEF3C7',
        900: '#FFFBEB',
      },
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
      neutral: {
        50: '#0F172A',
        100: '#1E293B',
        200: '#334155',
        300: '#475569',
        400: '#64748B',
        500: '#94A3B8',
        600: '#CBD5E1',
        700: '#E2E8F0',
        800: '#F1F5F9',
        900: '#F8FAFC',
      },
      background: {
        primary: '#0F172A',
        secondary: '#1E293B',
        tertiary: '#334155',
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#CBD5E1',
        tertiary: '#94A3B8',
        inverse: '#0F172A',
      },
      border: {
        default: '#334155',
        light: '#1E293B',
        medium: '#475569',
        dark: '#64748B',
      },
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
  },

  // Spacing - 4px base unit
  spacing: {
    comfortable: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '32px',
      '3xl': '48px',
      '4xl': '64px',
    },
    compact: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '48px',
    },
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows - Elevation system
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
    // Glassmorphism shadows
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  // Breakpoints (Responsive)
  breakpoints: {
    mobile: '640px',
    tablet: '1024px',
    desktop: '1280px',
  },

  // Z-Index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
    toast: 1500,
  },

  // Glassmorphism effects
  glassmorphism: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    dark: {
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(10px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
} as const;

// Helper function to get color based on mode
export function getColor(
  colorPath: string,
  mode: ColorMode = 'light'
): string {
  const parts = colorPath.split('.');
  let current: any = designTokens.colors[mode];
  
  for (const part of parts) {
    if (current[part] === undefined) {
      console.warn(`Color path "${colorPath}" not found in ${mode} mode`);
      return mode === 'light' ? '#000000' : '#FFFFFF';
    }
    current = current[part];
  }
  
  return current;
}

// Helper function to get spacing based on density
export function getSpacing(
  size: keyof typeof designTokens.spacing.comfortable,
  density: DensityMode = 'comfortable'
): string {
  return designTokens.spacing[density][size];
}

// Export for Tailwind CSS configuration
export const tailwindColors = {
  primary: designTokens.colors.light.primary,
  secondary: designTokens.colors.light.secondary,
  accent: designTokens.colors.light.accent,
  neutral: designTokens.colors.light.neutral,
};

export default designTokens;

