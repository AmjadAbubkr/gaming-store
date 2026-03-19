import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CornerHighlightProps {
  color?: string; // e.g., 'primary', 'secondary'
  size?: number;  // pixel length of the corner line
  stroke?: number; // thickness
  className?: string;
  style?: ViewStyle;
}

/**
 * A purely decorative component that adds cyber/sci-fi corner brackets 
 * to its parent container. Matches the Cyber-Nexus design system.
 * 
 * Usage: Place this inside a View that has relative positioning.
 */
export const CornerHighlight = ({
  color = 'border-primary', // Tailwind class name
  size = 12,
  stroke = 2,
  className = '',
  style,
}: CornerHighlightProps) => {
  return (
    <View className={`absolute inset-0 pointer-events-none ${className}`} style={style}>
      {/* Top Left */}
      <View className={`absolute top-0 left-0 ${color}`} style={{ width: size, height: stroke, borderTopWidth: stroke }} />
      <View className={`absolute top-0 left-0 ${color}`} style={{ width: stroke, height: size, borderLeftWidth: stroke }} />
      
      {/* Top Right */}
      <View className={`absolute top-0 right-0 ${color}`} style={{ width: size, height: stroke, borderTopWidth: stroke }} />
      <View className={`absolute top-0 right-0 ${color}`} style={{ width: stroke, height: size, borderRightWidth: stroke }} />
      
      {/* Bottom Left */}
      <View className={`absolute bottom-0 left-0 ${color}`} style={{ width: size, height: stroke, borderBottomWidth: stroke }} />
      <View className={`absolute bottom-0 left-0 ${color}`} style={{ width: stroke, height: size, borderLeftWidth: stroke }} />
      
      {/* Bottom Right */}
      <View className={`absolute bottom-0 right-0 ${color}`} style={{ width: size, height: stroke, borderBottomWidth: stroke }} />
      <View className={`absolute bottom-0 right-0 ${color}`} style={{ width: stroke, height: size, borderRightWidth: stroke }} />
    </View>
  );
};
