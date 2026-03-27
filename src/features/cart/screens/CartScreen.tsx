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
import { useI18n } from '../../../localization/LocalizationProvider';

export const CartScreen = ({ navigation }: any) => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user, isGuest } = useAuthStore();
  const { createOrder } = useOrdersStore();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (isGuest || !user) {
      Alert.alert(
        t('cart.loginRequired'),
        t('cart.loginRequiredBody'),
        [{ text: t('cart.cancel'), style: 'cancel' }, { text: t('auth.login') }]
      );
      return;
    }

    setIsProcessing(true);

    try {
      await createOrder(user.id, items, total, user.name, user.phone);

      const message = generateOrderMessage(items, total, user.name, user.phone);
      const launched = await openWhatsApp(message);

      if (launched) {
        clearCart();
        Alert.alert(t('cart.orderSent'), t('cart.orderSentBody'));
      } else {
        throw new Error('WhatsApp failed to launch');
      }
    } catch {
      Alert.alert(t('cart.actionFailed'), t('cart.actionFailedBody'), [{ text: 'OK' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <ScreenWrapper className="bg-black">
        <View className="flex-1 justify-center items-center px-6">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-surface-container">
            <MaterialIcons name="remove-shopping-cart" size={48} color={COLORS.outline} />
          </View>
          <Text className="mb-2 text-center font-headline text-xl font-bold uppercase tracking-wider text-on-surface">
            {t('cart.emptyLoadout')}
          </Text>
          <Text className="mb-8 text-center font-body text-on-surface-variant">
            {t('cart.emptyBody')}
          </Text>
          <Button
            title={t('cart.returnToHQ')}
            onPress={() => navigation.navigate('HomeTab')}
            variant="secondary"
            className="w-full"
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={false} edges={['top', 'left', 'right', 'bottom']} className="bg-black">
      <LinearGradient colors={['#171717', '#0b0b0b']} className="px-4 pb-5 pt-4">
        <View className="mb-5 flex-row items-start justify-between">
          <View>
            <Text className="font-label text-[10px] uppercase tracking-[3px] text-outline">{t('cart.cartOverview')}</Text>
            <Text className="font-headline text-2xl font-bold text-on-surface">{t('cart.activeLoadout')}</Text>
            <Text className="mt-2 max-w-[260px] text-xs leading-5 text-on-surface-variant">
              {t('cart.cartSubtitle')}
            </Text>
          </View>
          <TouchableOpacity onPress={clearCart} className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3">
            <Text className="font-body text-xs uppercase text-error">{t('cart.clearAll')}</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-white/10 bg-surface-container-high/80 px-4 py-4">
            <Text className="text-[10px] uppercase tracking-[3px] text-outline">{t('home.items')}</Text>
            <Text className="mt-2 font-headline text-2xl font-bold text-on-surface">{itemCount}</Text>
          </View>
          <View className="flex-1 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-4">
            <Text className="text-[10px] uppercase tracking-[3px] text-primary">{t('cart.total')}</Text>
            <Text className="mt-2 font-headline text-xl font-bold text-primary">{formatPrice(total)}</Text>
          </View>
        </View>
      </LinearGradient>

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
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 18,
          paddingBottom: 250 + Math.max(insets.bottom, 18),
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListHeaderComponent={
          <View className="mb-4 rounded-[24px] border border-white/10 bg-surface-container-high/65 px-5 py-4">
            <Text className="font-label text-[10px] uppercase tracking-[3px] text-primary">{t('cart.missionBrief')}</Text>
            <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
              {t('cart.missionBody')}
            </Text>
          </View>
        }
        className="bg-black"
      />

      <View
        className="absolute left-4 right-4 rounded-[28px] border border-white/10 bg-surface-container px-5 pt-5"
        style={{ bottom: Math.max(insets.bottom, 14) + 84, paddingBottom: 16 }}
      >
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="font-label text-[10px] uppercase tracking-[3px] text-outline">{t('cart.checkout')}</Text>
            <Text className="mt-1 max-w-[220px] font-body text-sm leading-5 text-on-surface-variant">
              {t('cart.checkoutBody')}
            </Text>
          </View>
          <Text className="font-headline text-2xl font-bold tracking-wider text-whatsapp-green">
            {formatPrice(total)}
          </Text>
        </View>

        <Button
          title={t('cart.checkoutWhatsapp')}
          variant="whatsapp"
          onPress={handleCheckout}
          loading={isProcessing}
          icon={<FontAwesome name="whatsapp" size={20} color="black" />}
        />
      </View>
    </ScreenWrapper>
  );
};
