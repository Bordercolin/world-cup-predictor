import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "dark" | "light" | "outline" | "terracotta";
  size?: "sm" | "md";
};

type ButtonActionProps = {
  children: ReactNode;
  variant?: "dark" | "light" | "outline" | "terracotta";
  size?: "sm" | "md";
};

const variantStyles = {
  dark: "bg-ink text-surface shadow-button-dark",
  light: "bg-surface text-ink",
  outline: "border border-ink/20 bg-surface/60 text-ink hover:bg-surface",
  terracotta: "bg-terracotta text-surface shadow-button-accent",
};

const sizeStyles = {
  sm: "px-4 py-2",
  md: "px-7 py-4",
};

export function ButtonLink({ children, href, variant = "dark", size = "md" }: ButtonLinkProps) {
  const className = `rounded-full text-center text-sm font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 ${variantStyles[variant]} ${sizeStyles[size]}`;

  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}

export function ButtonAction({ children, variant = "dark", size = "md" }: ButtonActionProps) {
  return (
    <button
      className={`cursor-not-allowed rounded-full text-center text-sm font-bold opacity-75 ${variantStyles[variant]} ${sizeStyles[size]}`}
      disabled
      type="button"
    >
      {children}
    </button>
  );
}
