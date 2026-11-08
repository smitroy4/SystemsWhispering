import { useTheme } from '../../utils/theme.ts';

interface ThemeAwareLogoProps {
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Logo that switches between dark/light variants based on current theme.
 * - Light theme: sw-logo-dark.png
 * - Dark theme: sw-logo.png
 */
export default function ThemeAwareLogo({
  alt = 'Systems Whispering',
  className = '',
  width = 28,
  height = 28,
}: ThemeAwareLogoProps) {
  const { resolved } = useTheme();
  const isDark = resolved === 'dark';
  const src = isDark ? '/sw-logo.png' : '/sw-logo-dark.png';

  return (
    <img
      src={src}
      alt={alt}
      className={`theme-aware-logo ${className}`}
      width={width}
      height={height}
    />
  );
}