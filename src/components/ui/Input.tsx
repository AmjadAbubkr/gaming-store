import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { COLORS } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = ({ label, error, icon, className = '', ...props }: InputProps) => {
  return (
    <View className={`mb-4 ${className}`}>
      <Text className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
        {label}
      </Text>
      
      <View
        className={`flex-row items-center border rounded-lg px-4 py-3 bg-surface-container-low/50 
          ${error ? 'border-error' : 'border-outline-variant/30 focus:border-primary/60'}`}
      >
        {icon && <View className="mr-3 opacity-70">{icon}</View>}
        
        <TextInput
          className="flex-1 font-body text-on-surface text-base"
          placeholderTextColor={COLORS.outline}
          selectionColor={COLORS.primary}
          {...props}
        />
      </View>

      {error ? (
        <Text className="font-body text-xs text-error mt-1 ml-1">{error}</Text>
      ) : null}
    </View>
  );
};
