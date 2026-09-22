import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "dark" | "outline" | "ghost";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  dark: "bg-ink text-white hover:bg-ink/90",
  outline: "border-2 border-ink text-ink bg-transparent hover:bg-ink/5",
  ghost: "text-ink bg-transparent hover:bg-ink/5",
};

const BASE_STYLES =
  "inline-flex min-h-11 items-center justify-center gap-2 px-[22px] py-3 text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  /** Pill radius for marketing pages (default). Set false for the 14px radius used in forms and admin. */
  pill?: boolean;
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href"> & { href?: undefined };

type ButtonAsLink = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  pill = true,
  className,
  href,
  ...rest
}: ButtonProps) {
  const classes = cn(
    BASE_STYLES,
    pill ? "rounded-full" : "rounded-[14px]",
    VARIANT_STYLES[variant],
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}
