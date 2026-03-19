import React, { useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useOrdersStore } from '../../../store/ordersStore';
import { openWhatsApp, generateOrderMessage } from '../../../services/whatsapp';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { CartItemCard } from '../components/CartItem';
import { formatPrice } from '../../../utils/formatting';
import { COLORS } from '../../../constants/theme';

export const CartScreen = ({ navigation }: any) => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user, isGuest } = useAuthStore();
  const { createOrder } = useOrdersStore();
  const insets = useSafeAreaInsets();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    // 1. Guard against empty cart
    if (items.length === 0) return;

    // 2. Guard against unauthenticated checkout (required for order history)
    if (isGuest || !user) {
      Alert.alert(
        'Login Required',
        'Please create an account to place an order and track your history.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => {
              // We'll let them login. But since the cart is persisted via Zustand, 
              // it won't be lost when they leave to login!
              // For a real app, you'd navigate out of the CustomerTabs here:
              // Since they are technically in the root Guest state.
          } },
        ]
      );
      return;
    }

    setIsProcessing(true);

    try {
      // 3. Save Order to Firestore (Important! Do this BEFORE WhatsApp redirect)
      await createOrder(
        user.id,
        items,
        total,
        user.name,
        user.phone
      );

      // 4. Generate WhatsApp Message
      const message = generateOrderMessage(items, total, user.name, user.phone);

      // 5. Open WhatsApp
      const launched = await openWhatsApp(message);

      if (launched) {
        // 6. Clear Cart on Success
        clearCart();
        Alert.alert('Order Sent', 'Your order was saved and WhatsApp opened successfully.');
        navigation.navigate('HomeTab', { screen: 'Home' });
      } else {
        throw new Error('WhatsApp failed to launch');
      }
    } catch (error) {
      Alert.alert(
        'Action Failed',
        'We could not open WhatsApp. Your order has been saved to your history — you can try again from there.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <ScreenWrapper className="justify-center items-center px-6">
        <View className="w-24 h-24 rounded-full bg-surface-container items-center justify-center mb-6">
          <MaterialIcons name="remove-shopping-cart" size={48} color={COLORS.outline} />
        </View>
        <Text className="font-headline font-bold text-xl text-on-surface uppercase mb-2 text-center tracking-wider">
          Empty Loadout
        </Text>
        <Text className="font-body text-on-surface-variant text-center mb-8">
          Your inventory is currently empty. Visit the store to gear up.
        </Text>
        <Button 
          title="RETURN TO HQ" 
          onPress={() => navigation.navigate('HomeTab', { screen: 'Home' })} 
          variant="secondary"
          className="w-full"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={false} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <LinearGradient
        colors={['#151515', '#0c0c0c']}
        className="px-4 pb-4 pt-4"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-label text-[10px] uppercase tracking-[3px] text-outline">
              Cart Overview
            </Text>
            <Text className="font-headline font-bold text-2xl text-on-surface">
              Active Loadout
            </Text>
          </View>
          <TouchableOpacity onPress={clearCart} className="rounded-full border border-error/30 bg-error/10 px-4 py-2">
            <Text className="font-body text-xs text-error uppercase">Clear All</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-white/10 bg-surface-container-high/80 px-4 py-4">
            <Text className="text-[10px] uppercase tracking-[3px] text-outline">Items</Text>
            <Text className="mt-2 font-headline text-2xl font-bold text-on-surface">{itemCount}</Text>
          </View>
          <View className="flex-1 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-4">
            <Text className="text-[10px] uppercase tracking-[3px] text-primary">Total</Text>
            <Text className="mt-2 font-headline text-xl font-bold text-primary">{formatPrice(total)}</Text>
          </View>
        </View>
      </LinearGradient>

      <View className="flex-1">
        <FlatList
          data={items}
          keyExtractor={(item) => item.productId}
          renderItem={({ item }) => (
            <CartItemCard
              item={item}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
              onDecrease={() => {
                if (item.quantity > 1) updateQuantity(item.productId, item.quantity - 1);
                else removeItem(item.productId);
              }}
              onRemove={() => removeItem(item.productId)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 190 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          className="px-4 pt-4"
        />
      </View>

      {/* Checkout Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-outline-variant/30 bg-surface-container px-4 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 14) }}
      >
        <View className="mb-4 flex-row items-end justify-between">
          <View>
            <Text className="font-label text-[10px] uppercase tracking-[3px] text-outline">Checkout</Text>
            <Text className="font-body text-sm text-on-surface-variant">Secure your loadout and send the order to HQ.</Text>
          </View>
          <Text className="font-headline font-bold text-2xl text-whatsapp-green tracking-wider">
            {formatPrice(total)}
          </Text>
        </View>

        <Button
          title="Transmit To HQ Via WhatsApp"
          variant="whatsapp"
          onPress={handleCheckout}
          loading={isProcessing}
          icon={<FontAwesome name="whatsapp" size={20} color="black" />}
        />
      </View>
    </ScreenWrapper>
  );
};
