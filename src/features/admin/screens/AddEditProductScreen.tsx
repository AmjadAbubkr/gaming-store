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
import { Product, ProductCondition, ProductCategory } from '../../../types';
import { useProductsStore } from '../../../store/productsStore';
import * as firestoreService from '../../../services/firebase/firestore';
import { isConsoleCategory, isGameCategory } from '../../../utils/productCategories';
import { useI18n } from '../../../localization/LocalizationProvider';

type Props = NativeStackScreenProps<AdminStackParamList, 'AddEditProduct'>;

export const AddEditProductScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params;
  const isEditing = !!productId;
  
  const { getProductById, addProductLocally, updateProductLocally } = useProductsStore();
  const { t, textAlign, rowDirection, isRTL } = useI18n();

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState<ProductCategory>('consoles');
  const [condition, setCondition] = useState<ProductCondition>('new');
  
  const [images, setImages] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<Date>(new Date());
  
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
      setCategory(isConsoleCategory(product.category) ? 'consoles' : isGameCategory(product.category) ? 'games' : 'games');
      setCondition(product.condition);
      setImages(product.images);
      setCreatedAt(product.createdAt);
    }
  };

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert(t('admin.limitReached'), t('admin.imageLimitBody'));
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(t('admin.permissionNeeded'), t('admin.permissionNeededBody'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square images look best in our cards
      quality: 0.35, // Compress harder to reduce Firestore payload size
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const imageUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      setImages([...images, imageUri]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async () => {
    // Basic validation
    if (!name || !description || !price || !stock) {
      Alert.alert(t('admin.incomplete'), t('admin.incompleteBody'));
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
        images,
      };

      if (!currentProductId) {
        const newProduct = await firestoreService.addProduct(productData);
        currentProductId = newProduct.id;
        addProductLocally(newProduct);
        navigation.goBack();
        return;
      }

      await firestoreService.updateProduct(currentProductId, productData);

      const updatedProduct: Product = {
        id: currentProductId,
        createdAt,
        ...productData,
      };

      updateProductLocally(updatedProduct);
      navigation.goBack();
      
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert(t('cart.actionFailed'), t('admin.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenWrapper scrollable className="bg-black px-4 py-4">
      <View className="mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-high px-5 py-5">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`${isRTL ? 'ml-4' : 'mr-4'} h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/25`}
          >
            <MaterialIcons name="arrow-back" size={22} color={COLORS.onSurface} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-label text-[10px] uppercase tracking-[3px] text-primary" style={{ textAlign }}>{t('admin.studio')}</Text>
            <Text className="mt-2 font-headline text-2xl font-bold text-on-surface" style={{ textAlign }}>
              {isEditing ? t('admin.editProduct') : t('admin.addProduct')}
            </Text>
          </View>
        </View>
        <Text className="mt-4 text-sm leading-6 text-on-surface-variant" style={{ textAlign }}>
          {t('admin.addEditSubtitle')}
        </Text>
      </View>

      <View className="mb-6 rounded-[28px] border border-white/10 bg-surface-container-high px-5 py-5 relative overflow-hidden">
        <CornerHighlight stroke={1} />
        <Text className="font-headline text-primary uppercase tracking-widest text-sm mb-4" style={{ textAlign }}>
          {t('admin.hardwareDetails')}
        </Text>

        <Input label={t('admin.productName')} value={name} onChangeText={setName} placeholder={t('admin.productNamePlaceholder')} />
        
        <Input 
          label={t('admin.description')} 
          value={description} 
          onChangeText={setDescription} 
          placeholder={t('admin.descriptionPlaceholder')} 
          multiline 
          numberOfLines={4} 
        />
        
        <View className="flex-row justify-between">
          <Input 
            label={t('admin.priceFcfa')} 
            value={price} 
            onChangeText={setPrice} 
            keyboardType="numeric" 
            className="w-[48%]" 
          />
          <Input 
            label={t('admin.stockAmount')} 
            value={stock} 
            onChangeText={setStock} 
            keyboardType="numeric" 
            className="w-[48%]" 
          />
        </View>

        {/* Custom Selectors for Category and Condition would go here, 
            using simple row of buttons for simplicity in React Native */}
        <Text className="font-label text-[10px] text-outline uppercase tracking-wider mb-2" style={{ textAlign }}>{t('admin.category')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              onPress={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-lg border ${isRTL ? 'ml-2' : 'mr-2'} ${category === cat.id ? 'bg-primary/20 border-primary' : 'bg-surface-container border-outline/30'}`}
            >
              <Text className={`font-label uppercase text-xs ${category === cat.id ? 'text-primary' : 'text-on-surface'}`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="font-label text-[10px] text-outline uppercase tracking-wider mb-2" style={{ textAlign }}>{t('admin.condition')}</Text>
        <View className="mb-4" style={{ flexDirection: rowDirection }}>
          {['new', 'used'].map(c => (
            <TouchableOpacity 
              key={c} 
              onPress={() => setCondition(c as ProductCondition)}
              className={`px-6 py-2 rounded-lg border ${isRTL ? 'ml-4' : 'mr-4'} ${condition === c ? 'bg-secondary/20 border-secondary' : 'bg-surface-container border-outline/30'}`}
            >
              <Text className={`font-label uppercase text-xs ${condition === c ? 'text-secondary' : 'text-on-surface'}`}>
                {c === 'new' ? t('admin.new') : t('admin.used')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Image Upload Section */}
      <View className="mb-6 rounded-[28px] border border-white/10 bg-surface-container-high p-4 relative overflow-hidden">
         <CornerHighlight stroke={1} color="border-secondary" />
         <View className="flex-row justify-between items-center mb-4">
           <Text className="font-headline text-secondary uppercase tracking-widest text-sm">
             {t('admin.visualAssets')}
           </Text>
           <Text className="font-body text-outline text-xs">{images.length}/4</Text>
         </View>

         <View className="flex-row flex-wrap" style={{ flexDirection: rowDirection, flexWrap: 'wrap' }}>
           {images.map((img, idx) => (
             <View key={idx} className={`w-[48%] aspect-square relative mb-2 ${isRTL ? 'ml-2' : 'mr-2'}`}>
               <Image source={{ uri: img }} className="w-full h-full rounded border border-outline-variant/50" />
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
               <Text className="font-label text-xs uppercase text-outline mt-2">{t('admin.addPhoto')}</Text>
             </TouchableOpacity>
           )}
         </View>
      </View>

      <Button 
        title={isSaving ? t('admin.saving') : t('admin.saveProduct')} 
        onPress={handleSave} 
        loading={isSaving} 
        className="mb-10 mt-2"
        icon={<MaterialIcons name="save" size={20} color={COLORS.primary} />}
      />

    </ScreenWrapper>
  );
};
