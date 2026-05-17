import type { ReactNode } from "react";

type SectionEyebrowProps = {
  children: ReactNode;
  tone?: "green" | "terracotta" | "cream" | "navy";
  size?: "sm" | "xs";
};

const toneStyles = {
  green: "text-green",
  terracotta: "text-terracotta",
  cream: "text-sage",
  navy: "text-navy",
};

export function SectionEyebrow({
  children,
  tone = "terracotta",
  size = "sm",
}: SectionEyebrowProps) {
  return (
    <p
      className={`font-mono font-black uppercase ${
        size === "xs" ? "text-xs tracking-eyebrow" : "text-sm tracking-eyebrow"
      } ${toneStyles[tone]}`}
    >
      {children}
    </p>
  );
}
