export const particleColor = (r: number, g: number, b: number, alpha: number) =>
  `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;

export const luminance = (r: number, g: number, b: number) =>
  0.2126 * r + 0.7152 * g + 0.0722 * b;
