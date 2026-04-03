/**
 * Format PLN amount in Polish style: "7,3 mln zł", "234 tys. zł", "1 234 zł"
 */
export function formatPLN(amount: number | null): string {
  if (amount === null || amount === undefined) return 'brak danych';

  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000) {
    const mln = abs / 1_000_000;
    const formatted = mln >= 10
      ? Math.round(mln).toString()
      : mln.toFixed(1).replace('.', ',');
    return `${sign}${formatted} mln zł`;
  }

  if (abs >= 10_000) {
    const tys = Math.round(abs / 1_000);
    return `${sign}${tys} tys. zł`;
  }

  const rounded = Math.round(abs);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  return `${sign}${formatted} zł`;
}

/**
 * Format percentage in Polish style: "93,7%"
 */
export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) return 'brak danych';
  return `${value.toFixed(1).replace('.', ',')}%`;
}

/**
 * Format large number with spaces: "1 234 567"
 */
export function formatNumber(n: number | null): string {
  if (n === null || n === undefined) return 'brak danych';
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
}

/**
 * Compute percentage safely
 */
export function safePercent(part: number | null, total: number | null): number | null {
  if (part === null || total === null || total === 0) return null;
  return (part / total) * 100;
}

/**
 * Capitalize first letter
 */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Format voivodeship name from UPPERCASE to Title Case
 */
export function formatVoivodeship(v: string): string {
  return v
    .split(/[\s-]+/)
    .map(w => capitalize(w))
    .join(v.includes('-') ? '-' : ' ');
}
