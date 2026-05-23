import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { COLORS } from '../../constants/theme';
import { LoadingSpinner } from './LoadingSpinner';
import { getProductImageUri, isEmbeddedProductImage } from '../../utils/productImages';

interface ImageOptimizedProps {
  uri?: string | null;
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
  const safeUri = getProductImageUri(uri);
  const isEmbeddedImage = isEmbeddedProductImage(safeUri);

  // A subtle dark gradient placeholder
  const placeholderColor = COLORS.surfaceContainerHigh;

  return (
    <View className={`overflow-hidden items-center justify-center ${className}`} style={[{ backgroundColor: placeholderColor }, style]}>
      
      <Image
        source={{ uri: safeUri }}
        style={[StyleSheet.absoluteFill, style]} // ensures image fills the wrapper
        contentFit={contentFit}
        transition={isEmbeddedImage ? 0 : 300}
        cachePolicy={isEmbeddedImage ? 'none' : 'disk'}
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
