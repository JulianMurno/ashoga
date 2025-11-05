import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formateDate = (date: Date): string => {
  const isoString = date.toISOString().split('T')[0];
  const aux = isoString.split('-');
  return `${aux[2]}/${aux[1]}/${aux[0]}`;
}

export const dateToYearMonthDay = (date: Date): `${number}-${number}-${number}` => {
  const isoString = date.toISOString().split('T')[0];
  return isoString as `${number}-${number}-${number}`;
}

export const darken = (hex: string, amount: number) => {
  const [r, g, b] = hex
    .replace("#", "")
    .match(/.{2}/g)!
    .map((v) => parseInt(v, 16));
  return `rgb(${r * (1 - amount)}, ${g * (1 - amount)}, ${b * (1 - amount)})`;
}