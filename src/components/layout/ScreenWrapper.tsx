import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  withKeyboardAvoid?: boolean;
  padding?: boolean;
  className?: string;
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
}: ScreenWrapperProps) => {
  
  const content = scrollable ? (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, padding: padding ? 16 : 0 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${padding ? 'p-4' : ''}`}>
      {children}
    </View>
  );

  const AvoidBase = withKeyboardAvoid ? (
    <KeyboardAvoidingView 
      className="flex-1" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView className={`flex-1 bg-background ${className}`} edges={['top', 'left', 'right']}>
      {AvoidBase}
    </SafeAreaView>
  );
};
