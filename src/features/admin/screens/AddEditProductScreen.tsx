import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { AdminStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { CornerHighlight } from '../../../components/layout/CornerHighlight';
import { COLORS } from '../../../constants/theme';
import { CATEGORIES } from '../../../constants/categories';
import { ProductCondition, ProductCategory } from '../../../types';
import { useProductsStore } from '../../../store/productsStore';
import * as storageService from '../../../services/firebase/storage';
import * as firestoreService from '../../../services/firebase/firestore';

type Props = NativeStackScreenProps<AdminStackParamList, 'AddEditProduct'>;

export const AddEditProductScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params;
  const isEditing = !!productId;
  
  const { getProductById, addProductLocally, updateProductLocally } = useProductsStore();

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState<ProductCategory>('playstation');
  const [condition, setCondition] = useState<ProductCondition>('new');
  
  // Image State (mix of existing URLs and local URIs to be uploaded)
  const [images, setImages] = useState<{ uri: string; isLocal: boolean }[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && productId) {
      loadExistingProduct(productId);
    }
  }, [productId]);

  const loadExistingProduct = async (id: string) => {
    const product = await getProductById(id);
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setCategory(product.category);
      setCondition(product.condition);
      setImages(product.images.map(url => ({ uri: url, isLocal: false })));
    }
  };

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert('Limit Reached', 'You can only upload up to 4 images per product.');
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission needed', 'You need to allow camera roll access to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square images look best in our cards
      quality: 0.6, // Compress for bandwidth
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, { uri: result.assets[0].uri, isLocal: true }]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async () => {
    // Basic validation
    if (!name || !description || !price || !stock) {
      Alert.alert('Incomplete', 'Please fill in all text fields.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. We need a product ID to upload images to the right folder
      // If new, generate a temporary ID or save first to get ID
      let currentProductId = productId;
      
      const productData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        condition,
        images: images.filter(img => !img.isLocal).map(img => img.uri), // Keep existing URLs
      };

      if (!currentProductId) {
        // Create product first to get ID
        const newProduct = await firestoreService.addProduct(productData);
        currentProductId = newProduct.id;
        addProductLocally(newProduct);
      }

      // 2. Upload any local images
      const localImages = images.filter(img => img.isLocal);
      const uploadedUrls: string[] = [];
      
      for (const img of localImages) {
        try {
          const url = await storageService.uploadProductImage(img.uri, currentProductId!);
          uploadedUrls.push(url);
        } catch (e) {
          console.warn('Failed to upload an image', e);
        }
      }

      // 3. Final update with all image URLs
      const finalImageUrls = [...productData.images, ...uploadedUrls];
      
      if (isEditing || uploadedUrls.length > 0) {
        await firestoreService.updateProduct(currentProductId!, { images: finalImageUrls, ...productData });
        
        // Update store locally
        const updatedDoc = await getProductById(currentProductId!);
        if (updatedDoc) updateProductLocally(updatedDoc);
      }

      Alert.alert('Success', 'Product catalog updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', 'Failed to save product. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenWrapper scrollable className="p-4 bg-background">
      <View className="mb-6 flex-row items-center border-b border-surface-container-high/50 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
        <Text className="font-headline font-bold text-xl text-on-surface uppercase tracking-wider flex-1">
          {isEditing ? 'Configure Item' : 'New Catalog Entry'}
        </Text>
      </View>

      <View className="glass-panel p-4 rounded-xl mb-6 relative">
        <CornerHighlight stroke={1} />
        <Text className="font-headline text-primary uppercase tracking-widest text-sm mb-4">
          Hardware Details
        </Text>

        <Input label="Product Name" value={name} onChangeText={setName} placeholder="e.g. DualSense Edge" />
        
        <Input 
          label="Description" 
          value={description} 
          onChangeText={setDescription} 
          placeholder="Specs and details..." 
          multiline 
          numberOfLines={4} 
        />
        
        <View className="flex-row justify-between">
          <Input 
            label="Price (FCFA)" 
            value={price} 
            onChangeText={setPrice} 
            keyboardType="numeric" 
            className="w-[48%]" 
          />
          <Input 
            label="Stock Amount" 
            value={stock} 
            onChangeText={setStock} 
            keyboardType="numeric" 
            className="w-[48%]" 
          />
        </View>

        {/* Custom Selectors for Category and Condition would go here, 
            using simple row of buttons for simplicity in React Native */}
        <Text className="font-label text-[10px] text-outline uppercase tracking-wider mb-2">Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              onPress={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-lg border mr-2 ${category === cat.id ? 'bg-primary/20 border-primary' : 'bg-surface-container border-outline/30'}`}
            >
              <Text className={`font-label uppercase text-xs ${category === cat.id ? 'text-primary' : 'text-on-surface'}`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="font-label text-[10px] text-outline uppercase tracking-wider mb-2">Condition</Text>
        <View className="flex-row mb-4">
          {['new', 'used'].map(c => (
            <TouchableOpacity 
              key={c} 
              onPress={() => setCondition(c as ProductCondition)}
              className={`px-6 py-2 rounded-lg border mr-4 ${condition === c ? 'bg-secondary/20 border-secondary' : 'bg-surface-container border-outline/30'}`}
            >
              <Text className={`font-label uppercase text-xs ${condition === c ? 'text-secondary' : 'text-on-surface'}`}>
                {c.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Image Upload Section */}
      <View className="glass-panel p-4 rounded-xl mb-6 relative">
         <CornerHighlight stroke={1} color="border-secondary" />
         <View className="flex-row justify-between items-center mb-4">
           <Text className="font-headline text-secondary uppercase tracking-widest text-sm">
             Visual Assets
           </Text>
           <Text className="font-body text-outline text-xs">{images.length}/4</Text>
         </View>

         <View className="flex-row flex-wrap">
           {images.map((img, idx) => (
             <View key={idx} className="w-[48%] aspect-square relative mb-2 mr-2">
               <Image source={{ uri: img.uri }} className="w-full h-full rounded border border-outline-variant/50" />
               <TouchableOpacity 
                 onPress={() => removeImage(idx)}
                 className="absolute top-1 right-1 bg-black/60 rounded-full p-1 border border-error/50"
               >
                 <MaterialIcons name="close" size={16} color={COLORS.error} />
               </TouchableOpacity>
             </View>
           ))}
           
           {images.length < 4 && (
             <TouchableOpacity 
               onPress={pickImage}
               className="w-[48%] aspect-square mb-2 bg-surface-container border border-dashed border-outline/50 rounded flex-col items-center justify-center pt-2"
             >
               <MaterialIcons name="add-photo-alternate" size={32} color={COLORS.outline} />
               <Text className="font-label text-xs uppercase text-outline mt-2">Upload</Text>
             </TouchableOpacity>
           )}
         </View>
      </View>

      <Button 
        title={isEditing ? 'COMMIT CHANGES' : 'DEPLOY PROTOTYPE'} 
        onPress={handleSave} 
        loading={isSaving} 
        className="mb-10 mt-2"
        icon={<MaterialIcons name="save" size={20} color={COLORS.primary} />}
      />

    </ScreenWrapper>
  );
};
