import type { ReactNode } from "react";

type SectionEyebrowProps = {
  children: ReactNode;
  tone?: "green" | "terracotta" | "cream" | "navy";
  size?: "sm" | "xs";
};

const toneStyles = {
  green: "text-[#165d4a]",
  terracotta: "text-[#d24a2a]",
  cream: "text-[#cdddbb]",
  navy: "text-[#1d345e]",
};

export function SectionEyebrow({
  children,
  tone = "terracotta",
  size = "sm",
}: SectionEyebrowProps) {
  return (
    <p
      className={`font-mono font-black uppercase ${
        size === "xs" ? "text-xs tracking-[0.22em]" : "text-sm tracking-[0.24em]"
      } ${toneStyles[tone]}`}
    >
      {children}
    </p>
  );
}
