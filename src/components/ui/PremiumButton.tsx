import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

/**
 * Premium gradient button matching the gamer aesthetic.
 * Cyber-cyan to vibrant-purple gradient.
 */
export const PremiumButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  className = '',
  style,
}: PremiumButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      className={`overflow-hidden rounded-xl shadow-lg ${className}`}
      style={style}
    >
      <LinearGradient
        // Bright cyan to vibrant purple gradient
        colors={['#00E5FF', '#8B5CF6']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        className="px-6 py-4 flex-row justify-center items-center"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            {icon && <View className="mr-3">{icon}</View>}
            <Text className="text-white font-headline font-bold text-base tracking-widest uppercase">
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};
