import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/theme';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  fullScreen?: boolean;
}

/**
 * A custom animated loading spinner.
 * Uses a cyber-themed spinning aesthetic instead of standard ActivityIndicator.
 */
export const LoadingSpinner = ({
  size = 40,
  color = COLORS.primary,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    // Continuous rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.linear }),
      -1
    );

    // Subtle pulsing glow
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
      opacity: pulse.value,
    };
  });

  const spinner = (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: color,
            shadowColor: color,
            shadowOpacity: 0.8,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 0 },
            elevation: 5,
          },
        ]}
      />
      {/* Inner core */}
      <View
        style={{
          position: 'absolute',
          width: size / 4,
          height: size / 4,
          borderRadius: size / 8,
          backgroundColor: color,
          opacity: 0.8,
        }}
      />
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        {spinner}
      </View>
    );
  }

  return spinner;
};
