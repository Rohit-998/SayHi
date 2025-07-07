import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "../assets/a.json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712dc5a5] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ff6602aa] text-[#ff660a] border-[1px] border-[#ff660aab]",
  "bg-[#00660a2a] text-[#00660a] border-[1px] border-[#00660aab]",
  "bg-[#4cc9702a] text-[#4cc970] border-[1px] border-[#4cc970bb]",
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Fallback to the first color if out of range
};

export const animationOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,

};
