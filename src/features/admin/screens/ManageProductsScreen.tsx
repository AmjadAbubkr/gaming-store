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

type ManageProductsProps = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'ManageProducts'>;
};

export const ManageProductsScreen = ({ navigation }: ManageProductsProps) => {
  const { productsList, fetchProducts, isLoading, removeProductLocally } = useProductsStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Ensure we have all products loaded
    fetchProducts('all', true);
  }, []);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Initialize Deletion',
      `Are you sure you want to permanently delete "${name}" from the database?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
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
              Alert.alert('Error', 'Failed to delete product');
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
    <ScreenWrapper padding={false}>
      
      {/* Header & Search */}
      <View className="px-4 py-4 bg-surface-container-highest border-b border-surface-container-high/50">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-xl text-on-surface uppercase tracking-wider flex-1">
            Database Log
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddEditProduct', {})}
            className="w-10 h-10 bg-primary/20 rounded-lg justify-center items-center border border-primary/50 shadow-cyan-glow"
          >
            <MaterialIcons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <Input
          label=""
          placeholder="Search catalog..."
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
        contentContainerStyle={{ padding: 16 }}
        refreshing={isLoading}
        onRefresh={() => fetchProducts('all', true)}
        renderItem={({ item }) => (
          <View className="glass-panel p-3 rounded-lg mb-3 flex-row items-center relative">
            
            {/* Thumbnail */}
            <View className="w-16 h-16 bg-surface-container-low rounded mr-3">
               <ImageOptimized 
                 uri={item.images?.[0] || 'https://via.placeholder.com/100'} 
                 style={{ width: '100%', height: '100%' }}
               />
            </View>

            {/* Info */}
            <View className="flex-1 justify-center">
              <Text className="font-headline font-bold text-sm text-on-surface mb-1" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="font-body text-xs text-primary mb-1">
                {formatPrice(item.price)}
              </Text>
              <View className="flex-row">
                <Text className="font-label text-[10px] uppercase text-outline mr-2">{item.category}</Text>
                <Text className={`font-label text-[10px] uppercase font-bold tracking-wider ${item.stock <= 0 ? 'text-error' : 'text-whatsapp-green'}`}>
                  Stock: {item.stock}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View className="flex-col justify-between items-center ml-2 space-y-2 h-full py-1">
              <TouchableOpacity
                onPress={() => navigation.navigate('AddEditProduct', { productId: item.id })}
                className="p-2 rounded-full bg-secondary/20"
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
           <View className="items-center justify-center p-8 mt-10">
              <Text className="font-headline text-lg uppercase tracking-wider text-outline">No products found</Text>
           </View>
        )}
      />
    </ScreenWrapper>
  );
};
