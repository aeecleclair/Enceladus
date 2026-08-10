import React from "react";

export type Segment = {
  value: number;
  color?: string;
  label?: string;
};

type Props = {
  segments: Segment[];
  height?: number; // px
  showLabels?: boolean;
  rounded?: boolean;
  ariaLabel?: string;
};

export default function StackedBar({
  segments,
  height = 28,
  showLabels = true,
  rounded = true,
  ariaLabel,
}: Props) {
  const total = Math.max(segments.reduce((s, seg) => s + (seg.value || 0), 0), 1);

  return (
    <div
      role="group"
      aria-label={ariaLabel ?? "Stacked bar"}
      style={{
        width: "100%",
        background: "#e6e6e6",
        borderRadius: rounded ? Math.round(height / 2) : 4,
        overflow: "hidden",
        height,
      }}
    >
      <div style={{ display: "flex", height: "100%" }}>
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * 100;
          const showText = showLabels && pct > 8; // show text only if there's space
          return (
            <div
              key={i}
              role="progressbar"
              aria-valuenow={seg.value}
              aria-valuemin={0}
              aria-valuemax={total}
              title={seg.label ?? `${seg.value}`}
              style={{
                width: `${pct}%`,
                background: seg.color ?? (i % 2 ? "#4f46e5" : "#06b6d4"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "width 300ms ease",
              }}
            >
              {showText ? `${seg.label ? seg.label + " — " : ""}${seg.value}` : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}