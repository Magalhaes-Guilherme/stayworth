"use client";

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

type Props = {
  value: number;
  format: (n: number) => string;
  className?: string;
};

/**
 * Visually counts up/down to `value`. Screen readers get the final value
 * only, so they aren't flooded with intermediate frames.
 */
export function AnimatedNumber({ value, format, className }: Props) {
  const display = useAnimatedNumber(value);
  return (
    <span className={className}>
      <span aria-hidden="true" className="tabular">
        {format(display)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
