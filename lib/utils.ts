import { type ClassValue, clsx } from 'clsx'
import qs from 'query-string'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getQueryParams(param: string) {
  if (typeof window === 'undefined') return undefined
  const parser = qs.parse(window.location.search)
  return parser[param] as string | undefined
}
