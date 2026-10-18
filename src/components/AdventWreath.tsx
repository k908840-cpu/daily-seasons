import React from "react";
import Svg, { Circle, Line, Rect } from "react-native-svg";
import { View } from "react-native";
import { useApp } from "@/context/AppContext";

interface Props {
  candlesLit: number;
  size?: number;
}

export function AdventWreath({ candlesLit, size = 200 }: Props) {
  const { colors } = useApp();
  const w = size;
  const h = size * 0.85;
  const cx = w / 2;
  const cy = h * 0.55;
  const r = w * 0.32;

  const candlePositions = [
    { x: cx - r * 0.5, y: cy - r * 0.35 },
    { x: cx + r * 0.5, y: cy - r * 0.35 },
    { x: cx - r * 0.5, y: cy + r * 0.15 },
    { x: cx + r * 0.5, y: cy + r * 0.15 },
  ];

  return (
    <View accessibilityLabel={`Advent wreath, ${candlesLit} of 4 candles lit`}>
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={colors.accent}
          strokeWidth={10}
          fill="none"
        />
        {candlePositions.map((p, i) => {
          const lit = i < candlesLit;
          return (
            <React.Fragment key={i}>
              <Rect
                x={p.x - 8}
                y={p.y - 28}
                width={16}
                height={32}
                rx={3}
                fill={i === 2 ? "#c41e3a" : "#f5f0dc"}
                stroke={colors.border}
              />
              {lit && (
                <>
                  <Line
                    x1={p.x}
                    y1={p.y - 32}
                    x2={p.x}
                    y2={p.y - 40}
                    stroke="#4a4a4a"
                    strokeWidth={2}
                  />
                  <Circle cx={p.x} cy={p.y - 42} r={5} fill={colors.gold} />
                </>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
