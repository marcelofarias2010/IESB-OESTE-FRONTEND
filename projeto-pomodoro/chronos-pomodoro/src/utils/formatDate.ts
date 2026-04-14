import { format } from 'date-fns';

/**
 * Formats a millisecond timestamp into a fixed locale-style string (day/month/year and 24h time).
 *
 * Uses `date-fns` `format` with pattern `dd/MM/yyyy HH:mm` (two-digit day and month, four-digit year,
 * hour in 24h format, two-digit minutes). Note: in this pattern, `M` is month and `m` is minutes.
 *
 * @param timestamp - Unix time in milliseconds (e.g. `Date.now()` or stored `task.startDate`).
 * @returns Human-readable date string, e.g. `"25/03/2025 08:09"`.
 */
export function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return format(date, 'dd/MM/yyyy HH:mm');
}