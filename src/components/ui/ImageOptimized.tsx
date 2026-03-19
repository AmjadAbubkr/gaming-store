import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { COLORS } from '../../constants/theme';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageOptimizedProps {
  uri: string;
  style?: ImageStyle;
  className?: string; // For NativeWind
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Optimized image component using expo-image.
 * Provides caching, smooth transitions, and a loading skeleton/spinner.
 * Essential for Chad's low bandwidth environment.
 */
export const ImageOptimized = ({
  uri,
  style,
  className = '',
  contentFit = 'cover',
}: ImageOptimizedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // A subtle dark gradient placeholder
  const placeholderColor = COLORS.surfaceContainerHigh;

  return (
    <View className={`overflow-hidden bg-[${placeholderColor}] items-center justify-center ${className}`} style={[style]}>
      
      <Image
        source={uri}
        style={[StyleSheet.absoluteFill, style]} // ensures image fills the wrapper
        contentFit={contentFit}
        transition={300} // slight fade-in transition
        cachePolicy="disk" // force aggressive disk caching
        onLoadStart={() => {
          setIsLoading(true);
          setIsError(false);
        }}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setIsError(true);
        }}
      />

      {/* Show a subtle spinner while loading */}
      {isLoading && !isError && (
        <View style={StyleSheet.absoluteFill} className="items-center justify-center bg-black/20">
             <LoadingSpinner size={24} color={COLORS.primaryDim} />
        </View>
      )}

      {/* Basic error fallback (e.g. broken link / no internet without cache) */}
      {isError && (
        <View style={StyleSheet.absoluteFill} className="items-center justify-center bg-error-container/20">
           {/* If we had an icon set, we'd put a broken image icon here */}
           <View className="w-8 h-8 rounded bg-error/30" />
        </View>
      )}
    </View>
  );
};
