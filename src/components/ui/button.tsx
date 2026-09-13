import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * RevisionDojo's Button, recovered from their shipped cva definition. Hover
 * rules are theirs: filled foreground darkens to /80, muted goes to muted-hover,
 * ghost tints with foreground/10. Transitions are `transition-all` at 150ms.
 */
export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center rounded-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 group",
  {
    variants: {
      variant: { primary: "", secondary: "", outline: "ring-2 ring-foreground/10 ring-inset", ghost: "" },
      color: { default: "", fuchsia: "", purple: "", foreground: "", destructive: "" },
      size: {
        default: "w-fit px-4 py-2",
        sm: "w-fit px-3 py-1 text-sm",
        md: "w-fit px-3.5 py-1.5 text-sm",
        lg: "w-fit px-5 py-3 text-lg",
        icon: "h-10 w-10 shrink-0 text-2xl",
        "icon-sm": "h-8 w-8 shrink-0 text-2xl",
      },
      rounded: { md: "rounded-xl", lg: "rounded-2xl", full: "rounded-full" },
    },
    compoundVariants: [
      { variant: "primary", color: "default", class: "bg-accent-primary-foreground text-background hover:bg-accent-primary-foreground/90 focus-visible:ring-accent-primary-foreground/50" },
      { variant: "primary", color: "fuchsia", class: "bg-accent-fuchsia-foreground text-accent-fuchsia hover:bg-accent-fuchsia-foreground/90 focus-visible:ring-accent-fuchsia-foreground/50" },
      { variant: "primary", color: "purple", class: "bg-accent-purple-foreground text-accent-purple hover:bg-accent-purple-foreground/90 focus-visible:ring-accent-purple-foreground/50" },
      { variant: "primary", color: "foreground", class: "bg-foreground text-background hover:bg-foreground/80 focus-visible:ring-foreground/50" },
      { variant: "primary", color: "destructive", class: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500/50" },
      { variant: "secondary", color: "default", class: "bg-muted text-muted-foreground hover:bg-muted-hover hover:text-foreground focus-visible:ring-muted-foreground/50" },
      { variant: "secondary", color: "fuchsia", class: "bg-accent-fuchsia text-accent-fuchsia-foreground hover:bg-accent-fuchsia-foreground hover:text-accent-fuchsia focus-visible:ring-accent-fuchsia-foreground/50" },
      { variant: "secondary", color: "purple", class: "bg-accent-purple text-accent-purple-foreground hover:bg-accent-purple-foreground hover:text-accent-purple focus-visible:ring-accent-purple-foreground/50" },
      { variant: "secondary", color: "foreground", class: "bg-foreground/10 text-foreground hover:bg-foreground/20 focus-visible:ring-foreground/50" },
      { variant: "secondary", color: "destructive", class: "bg-red-100 text-red-600 hover:bg-red-200 focus-visible:ring-red-500/50 dark:bg-red-600/10 dark:text-red-400 dark:hover:bg-red-600/20" },
      { variant: "outline", color: "default", class: "text-muted-foreground ring-foreground/10 hover:bg-foreground/10 hover:text-foreground" },
      { variant: "outline", color: "foreground", class: "text-foreground hover:bg-foreground/10" },
      { variant: "ghost", color: "default", class: "text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus-visible:ring-foreground/50" },
      { variant: "ghost", color: "foreground", class: "text-foreground hover:bg-foreground/10" },
      { variant: "ghost", color: "destructive", class: "text-red-600 hover:bg-red-100 focus-visible:ring-red-500/50 dark:text-red-400 dark:hover:bg-red-600/20" },
    ],
    defaultVariants: { variant: "primary", color: "default", size: "default" },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> &
  ButtonVariants & { href?: string; chevron?: "left" | "right" };

function Chevron({ side }: { side: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none size-5 shrink-0 opacity-60 transition-transform duration-200 ease-out",
        side === "left" ? "-ml-1 group-hover:-translate-x-0.5" : "-mr-1 group-hover:translate-x-0.5",
      )}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      {side === "left" ? (
        <path fillRule="evenodd" clipRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
      ) : (
        <path fillRule="evenodd" clipRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
      )}
    </svg>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, rounded, href, chevron, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, color, size, rounded }), className);
    const content = (
      <>
        {chevron === "left" ? <Chevron side="left" /> : null}
        {children}
        {chevron === "right" ? <Chevron side="right" /> : null}
      </>
    );
    if (href) {
      return (
        <Link href={href} className={classes} aria-disabled={props.disabled} tabIndex={props.disabled ? -1 : undefined}>
          {content}
        </Link>
      );
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {content}
      </button>
    );
  },
);
Button.displayName = "Button";
