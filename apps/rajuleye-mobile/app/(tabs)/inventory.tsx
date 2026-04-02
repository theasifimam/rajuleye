import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TextInput, 
  TouchableOpacity, Dimensions, StatusBar, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, SIZES } from '../../constants/Theme';
import { MOCK_PRODUCTS } from '../../data/products';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const InventoryScreen = () => {
  const { colors: theme, isDark } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header (Minimal) */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.brand, { color: theme.text }]}>Inventory</Text>
          <Text style={[styles.subBrand, { color: theme.subtext }]}>{filteredProducts.length} Products listed</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => {}}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Search (Flat) */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.subtext} />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={theme.subtext}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="options-outline" size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim }}
      >
        <View style={styles.productList}>
          {filteredProducts.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } } as any)}
            >
              <View style={[styles.imagePlaceholder, { backgroundColor: theme.primary + '08' }]}>
                <Ionicons name="glasses-outline" size={26} color={theme.primary} />
              </View>
              <View style={styles.productDetails}>
                <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>{product.name}</Text>
                <Text style={[styles.productCategory, { color: theme.subtext }]}>{product.category}</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.productPrice, { color: theme.text }]}>₹{product.price}</Text>
                  <View style={[styles.stockBadge, { backgroundColor: isDark ? 'rgba(0,208,132,0.1)' : '#E6FBF3' }]}>
                    <Text style={[styles.stockText, { color: '#00D084' }]}>42 in stock</Text>
                  </View>
                </View>
              </View>
              <View style={styles.editBtn}>
                <Ionicons name="chevron-forward-outline" size={16} color={theme.subtext} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={{ height: 120 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  brand: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  subBrand: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 20, gap: 10 },
  searchBar: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600' },
  filterBtn: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  productList: { paddingHorizontal: 24, gap: 12 },
  productCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18, borderWidth: 1 },
  imagePlaceholder: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  productDetails: { flex: 1, marginLeft: 16 },
  productName: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  productCategory: { fontSize: 12, fontWeight: '500', marginTop: 2, textTransform: 'capitalize' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
  productPrice: { fontSize: 15, fontWeight: '900' },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  stockText: { fontSize: 10, fontWeight: '800' },
  editBtn: { marginLeft: 8 },
});

export default InventoryScreen;
