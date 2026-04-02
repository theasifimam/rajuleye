import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, SIZES } from '../../constants/Theme';
import { Product } from '../../data/products';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SIZES.paddingHorizontal * 3) / 2;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { colors: theme, isDark } = useAppTheme();
  const router = useRouter();

  const stock = (parseInt(product.id, 10) * 7 + 13) % 60 + 5;
  const isLowStock = stock < 15;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } } as any)}
    >
      <View style={[styles.imageContainer, { backgroundColor: theme.primary + '03' }]}>
        <Ionicons name="glasses-outline" size={40} color={theme.primary} />
        {isLowStock && (
          <View style={[styles.lowStockTag, { backgroundColor: '#FF9500' }]}>
            <Text style={styles.lowStockText}>LOW STOCK</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.category, { color: theme.subtext }]} numberOfLines={1}>
          {product.category}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.text }]}>₹{product.price}</Text>
          <View style={[styles.stockBox, { backgroundColor: isLowStock ? '#FF950008' : '#00D08408' }]}>
            <Text style={[styles.stockText, { color: isLowStock ? '#FF9500' : '#00D084' }]}>{stock}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { width: CARD_WIDTH, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  imageContainer: { height: 120, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  lowStockTag: { position: 'absolute', top: 0, left: 0, paddingHorizontal: 8, paddingVertical: 4, borderBottomRightRadius: 8 },
  lowStockText: { color: '#FFF', fontSize: 8, fontWeight: '900' },
  infoContainer: { padding: 12 },
  name: { fontSize: 13, fontWeight: '800', marginBottom: 2 },
  category: { fontSize: 11, fontWeight: '500', marginBottom: 10, textTransform: 'capitalize' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 14, fontWeight: '900' },
  stockBox: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  stockText: { fontSize: 10, fontWeight: '800' },
});

export default ProductCard;
