export const normalizeColor = (color?: string): string | undefined => {
    if (!color) return undefined;
    return color.startsWith('#') ? color : `#${color}`;
  };
  