import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTimestamp() {
  return Math.round(Date.now() / 1000)
}

export function formatDate(dateString: string | number, locale?: string) {
  if (!locale) {
    locale = 'en-US';
  }

  // 处理 10 位时间戳（秒级时间戳）
  let date: Date;
  if (typeof dateString === 'number' && String(dateString).length === 10) {
    // 如果是 10 位数字时间戳（秒），转换为毫秒
    date = new Date(dateString * 1000);
  } else {
    date = new Date(dateString);
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  return date.toLocaleDateString(locale, options);
}

export function formatDateOnlyMonth(dateString: string, locale?: string) {
  if (!locale) {
    locale = 'en-US';
  }

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long'};
  return date.toLocaleDateString(locale, options);
}