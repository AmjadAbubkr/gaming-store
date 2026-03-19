import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface PremiumInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  secureTextEntry?: boolean;
  className?: string;
}

/**
 * Minimalist transparent input field with thin borders.
 * Styled to match the premium gamer login reference.
 */
export const PremiumInput = ({ 
  label, 
  error, 
  icon, 
  secureTextEntry,
  className = '', 
  ...props 
}: PremiumInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // In the design, password field has an eye icon on the right
  const isPassword = secureTextEntry === true;

  return (
    <View className={`mb-4 w-full ${className}`}>
      {label && (
        <Text className="font-label text-xs font-bold uppercase tracking-widest text-[#adaaaa] mb-2 ml-1">
          {label}
        </Text>
      )}
      
      <View
        className={`flex-row items-center border-b rounded-lg px-2 py-3 bg-transparent 
          ${isFocused ? 'border-primary/60' : 'border-[#494847]'}
          ${error ? 'border-error' : ''}`}
      >
        {/* Left Icon (Optional) */}
        {icon && <View className="mr-3 opacity-60">{icon}</View>}
        
        <TextInput
          className="flex-1 font-body text-white text-base py-1"
          placeholderTextColor="#777575"
          selectionColor={COLORS.primary}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icon for Password Toggle or custom icon */}
        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2 opacity-60">
            <MaterialIcons 
              name={showPassword ? "visibility" : "visibility-off"} 
              size={20} 
              color="#adaaaa" 
            />
          </TouchableOpacity>
        ) : (
          /* Design has icons on the right for some fields like username */
          !isPassword && !error && (
            <View className="ml-2 opacity-50">
               {/* Could add specific icons here based on props if needed */}
            </View>
          )
        )}
      </View>

      {error ? (
        <Text className="font-body text-xs text-error mt-1 ml-1">{error}</Text>
      ) : null}
    </View>
  );
};
