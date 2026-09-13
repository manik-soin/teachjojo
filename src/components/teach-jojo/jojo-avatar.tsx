import Image from "next/image";
import { cn } from "@/lib/utils";

/** Baby Jojo's tinted mode-card face, used as the chat avatar. */
export function JojoAvatar({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <span className={cn("relative inline-block shrink-0 overflow-hidden rounded-lg", className)} style={{ width: size, height: size }}>
      <Image src="/jojo/teach-jojo-light-tinted.svg" alt="" width={size} height={size} className="size-full object-cover dark:hidden" />
      <Image src="/jojo/teach-jojo-dark-tinted.svg" alt="" width={size} height={size} className="hidden size-full object-cover dark:block" />
    </span>
  );
}

/** The RevisionDojo logomark as an inline icon (nav rows, chips). */
export function JojoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("shrink-0", className)}>
      <rect width="64" height="64" rx="20" fill="currentColor" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M31.96 43.25c-.39.01-3.57.09-5.99.79-2.58.75-4.51.66-5.52.7-1 .04-5.55-.12-8.52-2.12-2.97-2-5.1-5.9-5-10.12.1-4.21 2.62-8.32 9.29-11.03 4.87-1.98 10.52-2.64 15.78-2.64 5.26 0 10.91.66 15.78 2.64 6.67 2.71 9.19 6.82 9.29 11.03.1 4.22-2.03 8.12-5 10.12-2.97 2-7.52 2.16-8.52 2.12-1-.04-2.94.05-5.52-.7-2.42-.7-5.6-.78-5.99-.79h-.08Z"
      />
      <ellipse cx="24" cy="31" rx="3.2" ry="4" fill="currentColor" />
      <ellipse cx="40" cy="31" rx="3.2" ry="4" fill="currentColor" />
    </svg>
  );
}
