/**
 * Firebase Storage service for image uploads.
 * 
 * Used by admin to upload product images.
 * Images are compressed before upload to minimize bandwidth usage
 * (critical for users in Chad with low internet speeds).
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a product image to Firebase Storage.
 * 
 * HOW IT WORKS:
 * 1. Convert the local image URI to a blob (binary data)
 * 2. Upload to Firebase Storage under 'products/{productId}/{filename}'
 * 3. Return the public download URL
 * 
 * @param uri - Local file URI from the image picker
 * @param productId - Product ID (used as folder name in Storage)
 * @returns Download URL of the uploaded image
 */
export const uploadProductImage = async (
  uri: string,
  productId: string
): Promise<string> => {
  try {
    // Create a unique filename using timestamp
    const filename = `${Date.now()}.jpg`;
    const storageRef = ref(storage, `products/${productId}/${filename}`);

    // Fetch the local image file and convert to blob
    // This works with both file:// and content:// URIs from expo-image-picker
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload to Firebase Storage
    await uploadBytes(storageRef, blob);

    // Get the public download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image. Please check your connection and try again.');
  }
};

/**
 * Delete a product image from Firebase Storage.
 * Called when admin removes an image or deletes a product.
 * 
 * @param imageUrl - The download URL of the image to delete
 */
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Create a reference from the download URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error: any) {
    // Don't throw if image doesn't exist (it may have been manually deleted)
    console.warn('Failed to delete image:', error.message);
  }
};
