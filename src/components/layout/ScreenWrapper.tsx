import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useI18n } from '../../localization/LocalizationProvider';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  withKeyboardAvoid?: boolean;
  padding?: boolean;
  className?: string;
  keyboardVerticalOffset?: number;
  edges?: Edge[];
}

/**
 * Standard layout wrapper for all screens.
 * Handles safe area padding, optional scrolling, and keyboard avoiding logic.
 * Ensures the dark cyber-nexus background is applied consistently.
 */
export const ScreenWrapper = ({
  children,
  scrollable = false,
  withKeyboardAvoid = true,
  padding = true,
  className = '',
  keyboardVerticalOffset = 0,
  edges = ['top', 'left', 'right'],
}: ScreenWrapperProps) => {
  const { isRTL } = useI18n();
  
  const content = scrollable ? (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, padding: padding ? 16 : 0 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={{ direction: isRTL ? 'rtl' : 'ltr' } as any}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${padding ? 'p-4' : ''}`} style={{ direction: isRTL ? 'rtl' : 'ltr' } as any}>
      {children}
    </View>
  );

  const AvoidBase = withKeyboardAvoid ? (
    <KeyboardAvoidingView 
      className="flex-1" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView className={`flex-1 bg-background ${className}`} edges={edges} style={{ direction: isRTL ? 'rtl' : 'ltr' } as any}>
      {AvoidBase}
    </SafeAreaView>
  );
};
