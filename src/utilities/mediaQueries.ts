export const isMobile =
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 768px)').matches

export const isTablet =
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 1024px)').matches
