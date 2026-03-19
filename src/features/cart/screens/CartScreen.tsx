import React, { useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
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
      const order = await createOrder(
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
    <ScreenWrapper padding={false}>
      {/* Header */}
      <View className="px-4 py-4 border-b border-surface-container-high bg-surface-container-low flex-row justify-between items-center">
        <Text className="font-headline font-bold text-lg text-on-surface uppercase tracking-wider">
          Active Loadout ({itemCount})
        </Text>
        <TouchableOpacity onPress={clearCart}>
          <Text className="font-body text-xs text-error uppercase">Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
            onDecrease={() => {
              if (item.quantity > 1) updateQuantity(item.productId, item.quantity - 1);
              else removeItem(item.productId); // Drop to 0 removes it
            }}
            onRemove={() => removeItem(item.productId)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 150 }}
      />

      {/* Checkout Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-container px-4 py-4 border-t border-outline-variant/30">
        <View className="flex-row justify-between items-end mb-4">
          <Text className="font-label text-sm uppercase text-outline">Total Value</Text>
          <Text className="font-headline font-bold text-2xl text-whatsapp-green tracking-wider">
            {formatPrice(total)}
          </Text>
        </View>

        <Button
          title="TRANSMIT TO HQ VIA WHATSAPP"
          variant="whatsapp"
          onPress={handleCheckout}
          loading={isProcessing}
          icon={<FontAwesome name="whatsapp" size={20} color="black" />}
        />
      </View>
    </ScreenWrapper>
  );
};
