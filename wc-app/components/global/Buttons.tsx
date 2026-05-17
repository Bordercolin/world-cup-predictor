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
  dark: "bg-[#152016] text-[#fff8ec] shadow-[0_18px_46px_-24px_rgba(21,32,22,0.8)]",
  light: "bg-[#fff8ec] text-[#152016]",
  outline: "border border-[#152016]/20 bg-[#fff8ec]/60 text-[#152016] hover:bg-[#fff8ec]",
  terracotta:
    "bg-[#d24a2a] text-[#fff8ec] shadow-[0_12px_30px_-18px_rgba(210,74,42,0.9)]",
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
