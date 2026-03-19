import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

/**
 * Standardized error message display.
 * Includes a retry button if an onRetry callback is provided.
 * Essential for apps in low-bandwidth areas where network errors are common.
 */
export const ErrorDisplay = ({ message, onRetry, fullScreen = false }: ErrorDisplayProps) => {
  const content = (
    <View className="items-center justify-center p-6 bg-error-container/10 border border-error/30 rounded-lg">
      <View className="w-12 h-12 rounded-full bg-error/20 items-center justify-center mb-4">
        {/* Placeholder for warning icon */}
        <Text className="text-error font-bold text-xl">!</Text>
      </View>
      
      <Text className="font-headline font-bold text-error mb-2 tracking-widest uppercase">
        System Error
      </Text>
      
      <Text className="font-body text-on-surface-variant text-center text-sm mb-6">
        {message}
      </Text>

      {onRetry && (
        <Button
          title="RETRY CONNECTION"
          variant="danger"
          onPress={onRetry}
          className="w-full"
        />
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        {content}
      </View>
    );
  }

  return content;
};
