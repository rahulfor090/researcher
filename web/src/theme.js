export const colors = {
  primaryText: '#1F2937',
  secondaryBackground: '#F5F5DC',
  highlight: '#F97316',
  link: '#0D9488',
  backgroundAlt: '#FAFAF9',
  dark: '#111827',
  cardBackground: '#FFFFFF',
  border: '#E5E7EB',
  mutedText: '#6B7280'
};

export const motion = {
  fast: '150ms ease',
  normal: '220ms ease',
  slow: '350ms ease'
};

export const shadows = {
  soft: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  medium: '0 10px 20px -10px rgba(0,0,0,0.25)'
};

export const radii = {
  md: '12px',
  lg: '16px'
};

export const gradients = {
  app: `linear-gradient(180deg, ${colors.backgroundAlt} 0%, ${colors.secondaryBackground} 100%)`,
  sidebar: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)'
};

export const cardStyle = {
  backgroundColor: 'rgba(255,255,255,0.85)',
  padding: '24px',
  borderRadius: radii.md,
  boxShadow: shadows.soft,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.35)',
  transition: `box-shadow ${motion.normal}, transform ${motion.normal}`
};

export const primaryButtonStyle = {
  padding: '10px 16px',
  backgroundColor: colors.highlight,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  transition: `transform ${motion.fast}, box-shadow ${motion.fast}, background-color ${motion.fast}`
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

