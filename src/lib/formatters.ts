import dayjs from "dayjs";

/**
 * Format currency with Indian Rupee symbol
 */
export const formatCurrency = (
  amount: number,
  options?: {
    showSymbol?: boolean;
    precision?: number;
  }
): string => {
  const { showSymbol = true, precision = 2 } = options || {};
  const formatted = amount.toFixed(precision);
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Format date to display format
 */
export const formatDate = (
  date: string | Date,
  format: string = "MMM DD, YYYY"
): string => {
  return dayjs(date).format(format);
};

/**
 * Format date with time
 */
export const formatDateTime = (
  date: string | Date,
  format: string = "MMM DD, YYYY hh:mm A"
): string => {
  return dayjs(date).format(format);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = dayjs();
  const target = dayjs(date);
  const diffInMinutes = now.diff(target, "minute");

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;

  const diffInHours = now.diff(target, "hour");
  if (diffInHours < 24)
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;

  const diffInDays = now.diff(target, "day");
  if (diffInDays < 7)
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;

  return formatDate(date);
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  options?: {
    precision?: number;
    showSign?: boolean;
  }
): string => {
  const { precision = 1, showSign = false } = options || {};
  const formatted = value.toFixed(precision);
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${formatted}%`;
};

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
};

/**
 * Parse date range to API format
 */
export const parseDateRange = (range: {
  startDate?: string;
  endDate?: string;
}): { startDate?: string; endDate?: string } => {
  return {
    startDate: range.startDate
      ? dayjs(range.startDate).format("YYYY-MM-DD")
      : undefined,
    endDate: range.endDate
      ? dayjs(range.endDate).format("YYYY-MM-DD")
      : undefined,
  };
};

/**
 * Get date range presets
 */
export const getDateRangePresets = () => {
  const today = dayjs();

  return {
    today: {
      startDate: today.format("YYYY-MM-DD"),
      endDate: today.format("YYYY-MM-DD"),
    },
    yesterday: {
      startDate: today.subtract(1, "day").format("YYYY-MM-DD"),
      endDate: today.subtract(1, "day").format("YYYY-MM-DD"),
    },
    last7Days: {
      startDate: today.subtract(7, "day").format("YYYY-MM-DD"),
      endDate: today.format("YYYY-MM-DD"),
    },
    last30Days: {
      startDate: today.subtract(30, "day").format("YYYY-MM-DD"),
      endDate: today.format("YYYY-MM-DD"),
    },
    thisMonth: {
      startDate: today.startOf("month").format("YYYY-MM-DD"),
      endDate: today.format("YYYY-MM-DD"),
    },
    lastMonth: {
      startDate: today
        .subtract(1, "month")
        .startOf("month")
        .format("YYYY-MM-DD"),
      endDate: today.subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
    },
    thisYear: {
      startDate: today.startOf("year").format("YYYY-MM-DD"),
      endDate: today.format("YYYY-MM-DD"),
    },
  };
};
