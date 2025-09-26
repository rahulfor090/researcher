export const colors = {
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  secondaryBackground: '#F5F5DC',
  highlight: '#F97316',
  link: '#0D9488',
  backgroundAlt: '#FAFAF9',
  dark: '#111827',
  cardBackground: '#FFFFFF',
  background: '#FFFFFF',
  border: '#E5E7EB',
  mutedText: '#6B7280',
  primary: '#0f172a',
  secondary: '#1e293b',
  accent: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  hover: 'rgba(0,0,0,0.05)'
};

export const motion = {
  fast: '150ms ease',
  normal: '220ms ease',
  slow: '350ms ease'
};

export const shadows = {
  soft: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  medium: '0 10px 20px -10px rgba(0,0,0,0.25)',
  large: '0 20px 40px -15px rgba(0,0,0,0.3)',
  glow: '0 0 20px rgba(13, 148, 136, 0.3)',
  glowOrange: '0 0 20px rgba(249, 115, 22, 0.3)'
};

export const radii = {
  md: '12px',
  lg: '16px'
};

export const gradients = {
  app: `linear-gradient(180deg, ${colors.backgroundAlt} 0%, ${colors.secondaryBackground} 100%)`,
  sidebar: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
  auth: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
  primary: `linear-gradient(135deg, ${colors.link}, ${colors.highlight})`,
  accent: `linear-gradient(135deg, ${colors.highlight}, ${colors.link})`
};

export const cardStyle = {
  backgroundColor: 'rgba(255,255,255,0.95)',
  padding: '24px',
  borderRadius: radii.md,
  boxShadow: shadows.soft,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.2)',
  transition: `box-shadow ${motion.normal}, transform ${motion.normal}`
};

export const primaryButtonStyle = {
  padding: '10px 16px',
  background: colors.link,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  transition: `transform ${motion.fast}, box-shadow ${motion.fast}, background-color ${motion.fast}`,
  boxShadow: '0 2px 8px rgba(13, 148, 136, 0.2)'
};

export const secondaryButtonStyle = {
  padding: '8px 12px',
  backgroundColor: colors.primaryText,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  transition: `transform ${motion.fast}, box-shadow ${motion.fast}, background-color ${motion.fast}`
};

