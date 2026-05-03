import React from "react";
import { View } from "react-native";

interface ProgressSegment {
  percent: number;
  color: string;
}

interface ProgressBarProps {
  segments: ProgressSegment[];
  height?: number;
  className?: string;
}

export function ProgressBar({ segments, height = 8, className }: ProgressBarProps) {
  return (
    <View className={`flex-row rounded-full overflow-hidden ${className || ''}`} style={{ height }}>
      {segments.map((segment, index) => (
        <View
          key={index}
          style={{
            flex: segment.percent,
            backgroundColor: segment.color,
          }}
        />
      ))}
    </View>
  );
}
