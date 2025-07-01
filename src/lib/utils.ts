import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}


// utils.ts
export function formatDate(dateString: string | Date | undefined | null) {
  if (!dateString) return 'Date inconnue'; // or empty string or any default
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Date invalide'; // catch invalid dates
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}


export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateRandomId() {
  return Math.random().toString(36).substring(2, 15);
}

export function isYouTubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

export function getYouTubeVideoId(url: string) {
  if (!isYouTubeUrl(url)) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}