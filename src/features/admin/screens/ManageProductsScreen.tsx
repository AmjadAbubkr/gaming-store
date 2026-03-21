import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AdminStackParamList } from '../../../navigation/types';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { ImageOptimized } from '../../../components/ui/ImageOptimized';
import { Input } from '../../../components/ui/Input';
import { useProductsStore } from '../../../store/productsStore';
import { formatPrice } from '../../../utils/formatting';
import { COLORS } from '../../../constants/theme';
import * as firestoreService from '../../../services/firebase/firestore';
import { useI18n } from '../../../localization/LocalizationProvider';

type ManageProductsProps = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'ManageProducts'>;
};

export const ManageProductsScreen = ({ navigation }: ManageProductsProps) => {
  const { productsList, fetchProducts, isLoading, removeProductLocally } = useProductsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { t, textAlign, rowDirection, isRTL } = useI18n();

  useEffect(() => {
    // Ensure we have all products loaded
    fetchProducts('all', true);
  }, []);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      t('admin.deleteInit'),
      t('admin.deleteConfirmBody', { name }),
      [
        { text: t('cart.cancel'), style: 'cancel' },
        { 
          text: t('admin.delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Delete from Firestore
              await firestoreService.deleteProduct(id);
              // 2. Remove locally (Optimistic update)
              removeProductLocally(id);
              // Note: We skip deleting the images from Storage to keep it simple, 
              // but ideally we'd map over images array and delete them too.
            } catch (error) {
              Alert.alert(t('cart.actionFailed'), t('admin.deleteFailed'));
            }
          }
        }
      ]
    );
  };

  // Local filtering by search
  const filteredProducts = productsList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenWrapper padding={false} className="bg-black">
      <View className="mx-4 mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-high px-5 py-5">
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`${isRTL ? 'ml-4' : 'mr-4'} h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/25`}
          >
            <MaterialIcons name="arrow-back" size={22} color={COLORS.onSurface} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-label text-[10px] uppercase tracking-[3px] text-primary" style={{ textAlign }}>{t('admin.studio')}</Text>
            <Text className="mt-2 font-headline text-2xl font-bold text-on-surface" style={{ textAlign }}>{t('admin.manageProducts')}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddEditProduct', {})}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15"
          >
            <MaterialIcons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <Text className="mb-4 text-sm leading-6 text-on-surface-variant" style={{ textAlign }}>
          {t('admin.manageProductsSubtitle')}
        </Text>

        <Input
          label=""
          placeholder={t('admin.searchCatalog')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<MaterialIcons name="search" size={20} color={COLORS.outline} />}
          className="mb-0" // override default margin
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshing={isLoading}
        onRefresh={() => fetchProducts('all', true)}
        renderItem={({ item }) => (
          <View className="relative mb-4 overflow-hidden rounded-[24px] border border-white/10 bg-surface-container-high/80 p-4" style={{ flexDirection: rowDirection, alignItems: 'center' }}>
            
            <View className={`${isRTL ? 'ml-4' : 'mr-4'} h-20 w-20 overflow-hidden rounded-2xl bg-surface-container-low`}>
               <ImageOptimized 
                 uri={item.images?.[0] || 'https://via.placeholder.com/100'} 
                 style={{ width: '100%', height: '100%' }}
                 contentFit="cover"
               />
            </View>

            <View className="flex-1 justify-center">
              <Text className="mb-1 font-headline text-base font-bold text-on-surface" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="mb-2 font-body text-xs text-primary">
                {formatPrice(item.price)}
              </Text>
              <View style={{ flexDirection: rowDirection, alignItems: 'center' }}>
                <View className={`${isRTL ? 'ml-2' : 'mr-2'} rounded-full border border-white/10 bg-black/25 px-2 py-1`}>
                  <Text className="font-label text-[10px] uppercase text-outline">{item.category}</Text>
                </View>
                <Text className={`font-label text-[10px] uppercase font-bold tracking-wider ${item.stock <= 0 ? 'text-error' : 'text-whatsapp-green'}`}>
                  {t('admin.stock')}: {item.stock}
                </Text>
              </View>
            </View>

            <View className={`${isRTL ? 'mr-2' : 'ml-2'} flex-col items-center justify-between py-1`}>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddEditProduct', { productId: item.id })}
                className="mb-2 rounded-full bg-secondary/20 p-2.5"
              >
                <MaterialIcons name="edit" size={16} color={COLORS.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.name)}
                className="p-2 rounded-full bg-error/20"
              >
                <MaterialIcons name="delete-outline" size={16} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
           <View className="mt-10 items-center justify-center p-8">
              <Text className="font-headline text-lg uppercase tracking-wider text-outline" style={{ textAlign }}>{t('admin.noProductsFound')}</Text>
              <Text className="mt-3 text-center text-sm leading-6 text-on-surface-variant" style={{ textAlign }}>
                {t('admin.noProductsFoundBody')}
              </Text>
           </View>
        )}
      />
    </ScreenWrapper>
  );
};
