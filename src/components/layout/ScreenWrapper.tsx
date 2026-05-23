import React from 'react';
import { View, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, Edge, useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  withKeyboardAvoid?: boolean;
  padding?: boolean;
  className?: string;
  keyboardVerticalOffset?: number;
  edges?: Edge[];
  bottomPadding?: number;
}

/**
 * Standard layout wrapper for all screens.
 * Handles safe area padding, optional scrolling, and keyboard avoiding logic.
 * 
 * KEYBOARD HANDLING STRATEGY:
 * - iOS: Uses KeyboardAvoidingView with behavior="padding" to push content up.
 * - Android: Relies on the native `adjustResize` window mode (default in Expo).
 *   Android's native handling already resizes the window when the keyboard opens,
 *   so adding KeyboardAvoidingView on Android causes DOUBLE adjustment — the
 *   native resize + extra padding = a visible black block below the content.
 */
export const ScreenWrapper = ({
  children,
  scrollable = false,
  withKeyboardAvoid = true,
  padding = true,
  className = '',
  keyboardVerticalOffset = 0,
  edges = ['top', 'left', 'right'],
  bottomPadding = 0,
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();
  const contentBottomPadding = bottomPadding + (edges.includes('bottom') ? insets.bottom : 0);
  
  const content = scrollable ? (
    withKeyboardAvoid ? (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: padding ? 16 : 0,
          paddingHorizontal: padding ? 16 : 0,
          paddingBottom: (padding ? 16 : 0) + contentBottomPadding,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={keyboardVerticalOffset}
        keyboardOpeningTime={0}
      >
        {children}
      </KeyboardAwareScrollView>
    ) : (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: padding ? 16 : 0,
          paddingHorizontal: padding ? 16 : 0,
          paddingBottom: (padding ? 16 : 0) + contentBottomPadding,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        {children}
      </ScrollView>
    )
  ) : (
    <View
      className={`flex-1 ${padding ? 'p-4' : ''}`}
      style={{
        paddingBottom: (padding ? 16 : 0) + contentBottomPadding,
      }}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 bg-background ${className}`} edges={edges}>
      {content}
    </SafeAreaView>
  );
};
