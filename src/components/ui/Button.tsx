import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { COLORS } from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'whatsapp';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string; // For NativeWind override
  style?: ViewStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  className = '',
  style,
}: ButtonProps) => {
  // Determine styles based on variant
  let bgClass = '';
  let textClass = '';
  let borderClass = '';
  let glowStyle = {};

  switch (variant) {
    case 'primary':
      bgClass = 'bg-primary/20';
      borderClass = 'border border-primary/50';
      textClass = 'text-primary';
      glowStyle = { shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 };
      break;
    case 'secondary':
      bgClass = 'bg-secondary/20';
      borderClass = 'border border-secondary/50';
      textClass = 'text-secondary';
      glowStyle = { shadowColor: COLORS.secondary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 };
      break;
    case 'danger':
      bgClass = 'bg-error/20';
      borderClass = 'border border-error/50';
      textClass = 'text-error';
      glowStyle = { shadowColor: COLORS.error, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 };
      break;
    case 'whatsapp':
      bgClass = 'bg-whatsapp-green';
      borderClass = 'border border-whatsapp-green';
      textClass = 'text-black';
      glowStyle = { shadowColor: COLORS.whatsappGreen, shadowOpacity: 0.4, shadowRadius: 15, elevation: 8 };
      break;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`relative overflow-hidden rounded-lg px-6 py-4 flex-row justify-center items-center ${bgClass} ${borderClass} ${
        disabled && !loading ? 'opacity-50' : ''
      } ${className}`}
      style={[glowStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'whatsapp' ? 'black' : COLORS[variant] || COLORS.primary} />
      ) : (
        <>
          {icon && <View className="mr-3">{icon}</View>}
          <Text className={`font-headline font-bold text-sm tracking-widest uppercase ${textClass}`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
