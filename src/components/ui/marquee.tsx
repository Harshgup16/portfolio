"use client";

import { cn } from "@/lib/utils";
import FastMarquee, { MarqueeProps } from "react-fast-marquee";
import { HTMLAttributes } from "react";

export const Marquee = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("relative w-full overflow-hidden", className)}
    {...props}
  />
);

export const MarqueeContent = ({
  loop = 0,
  autoFill = true,
  pauseOnHover = true,
  direction = "left",
  ...props
}: MarqueeProps) => (
  <FastMarquee
    loop={loop}
    autoFill={autoFill}
    pauseOnHover={pauseOnHover}
    direction={direction}
    {...props}
  />
);

export const MarqueeFade = ({ className, side, ...props }: HTMLAttributes<HTMLDivElement> & { side: "left" | "right" }) => (
  <div
    className={cn(
      "absolute top-0 bottom-0 z-10 h-full w-24 from-background to-transparent pointer-events-none",
      side === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l",
      className
    )}
    {...props}
  />
);

export const MarqueeItem = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mx-5 flex-shrink-0 object-contain flex items-center justify-center",
      className
    )}
    {...props}
  />
);