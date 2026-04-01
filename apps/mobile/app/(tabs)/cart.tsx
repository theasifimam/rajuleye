import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store'; // Adjust import if needed, assuming standard store structure
import { incrementQuantity, decrementQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { CartItem } from '../../components/ui/CartItem';
import { COLORS, SIZES, SHADOWS, useAppTheme } from '../../constants/Theme';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const { colors: theme } = useAppTheme();

  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subTotal > 0 ? 15 : 0;
  const total = subTotal + shipping;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Dynamic Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Selection</Text>
          <View style={[styles.itemBadge, { backgroundColor: theme.accent }]}>
            <Text style={[styles.itemBadgeText, { color: theme.subtext }]}>{cartItems.length} ITEMS</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.clearBtn, { backgroundColor: theme.accent }]}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.accent }]}>
              <Ionicons name="basket-outline" size={48} color={theme.text} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Empty Selection</Text>
            <Text style={[styles.emptySub, { color: theme.subtext }]}>Your curated basket is waiting.</Text>
            <TouchableOpacity style={[styles.shopNowBtn, { backgroundColor: theme.text }]} onPress={() => router.replace('/')}>
              <Text style={[styles.shopNowText, { color: theme.background }]}>Continue Exploring</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <CartItem
            id={item.id}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            image={item.image}
            onIncrement={() => dispatch(incrementQuantity(item.id))}
            onDecrement={() => dispatch(decrementQuantity(item.id))}
            onRemove={() => dispatch(removeFromCart(item.id))}
          />
        )}
      />

      {cartItems.length > 0 && (
        <View style={styles.floatingSummary}>
          <View style={[styles.summaryBento, { backgroundColor: theme.accent }]}>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: theme.subtext }]}>Sub-total</Text>
              <Text style={[styles.summaryPrice, { color: theme.text }]}>${subTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: theme.subtext }]}>Shipping</Text>
              <Text style={[styles.summaryPrice, { color: theme.text }]}>${shipping.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.checkoutPill, { backgroundColor: theme.text }]}
            activeOpacity={0.9}
            onPress={() => router.push('/checkout')}
          >
            <View style={styles.checkoutMain}>
              <Text style={[styles.checkoutLabel, { color: theme.background, opacity: 0.6 }]}>Total</Text>
              <Text style={[styles.checkoutTotal, { color: theme.background }]}>${total.toFixed(2)}</Text>
            </View>
            <View style={[styles.checkoutBtnBox, { backgroundColor: theme.background }]}>
              <Ionicons name="arrow-forward" size={24} color={theme.text} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: -1.5,
    fontStyle: 'italic',
  },
  itemBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  itemBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  clearBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 320, // Increased space for the floating pill and summary
  },
  emptyContainer: {
    flex: 1,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 16,
    marginBottom: 32,
  },
  shopNowBtn: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
  },
  shopNowText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingSummary: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  summaryBento: {
    flexDirection: 'row',
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
    gap: 32,
  },
  summaryCol: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutPill: {
    height: 84,
    borderRadius: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    ...SHADOWS.deep,
  },
  checkoutMain: {
    flex: 1,
  },
  checkoutLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  checkoutTotal: {
    fontSize: 24,
    fontWeight: '900',
  },
  checkoutBtnBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
