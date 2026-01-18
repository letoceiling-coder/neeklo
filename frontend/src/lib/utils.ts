import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Scroll to element with offset for fixed navigation
 * @param elementId - ID of the element to scroll to
 * @param offset - Offset in pixels (default: 100px for fixed header)
 * @param behavior - Scroll behavior (default: 'smooth')
 */
export function scrollToElement(
  elementId: string,
  offset: number = 100,
  behavior: ScrollBehavior = 'smooth'
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior,
  });
}
