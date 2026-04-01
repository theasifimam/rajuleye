import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProductCard } from '../../components/ui/ProductCard';
import { MOCK_PRODUCTS } from '../../data/products';
import { SIZES, SHADOWS, useAppTheme, COLORS } from '../../constants/Theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WishlistScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { colors: theme } = useAppTheme();

  // Filter for liked products
  const wishlistProducts = MOCK_PRODUCTS.filter(p => p.isFavorite);

  const renderHeader = () => (
    <View style={styles.headerComponent}>

      {/* Top Navigation Row */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => router.push('/profile')}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.greetingText, { color: theme.subtext }]}>My Collection</Text>
            <Text style={[styles.nameText, { color: theme.text }]}>Alexa's Favorites</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.bellButton, { backgroundColor: theme.accent }]}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <Text style={[styles.heroText, { color: theme.text }]}>Your Wishlist</Text>
      <Text style={[styles.heroSubText, { color: theme.text }]}>Curated collection of your items.</Text>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search-outline" size={20} color={theme.subtext} style={styles.searchIcon} />
        <TextInput
          placeholder="Search in wishlist"
          style={[styles.searchInput, { color: theme.text }]}
          placeholderTextColor={theme.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.primarySoft, theme.background, theme.background, theme.primarySoft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top']}>
      <FlatList
        data={wishlistProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={theme.subtext} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Wishlist is empty</Text>
            <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>Start adding items you love!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            style={styles.cardWrapper}
            onLike={() => { }}
            onPress={() => {
              router.push(`/product/${item.id}`);
            }}
          />
        )}
      />
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
  },
  headerComponent: {
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingTop: 10,
    marginBottom: 20,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greetingText: {
    fontSize: 12,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  heroSubText: {
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: '300',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 56,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingHorizontal,
  },
  cardWrapper: {
    width: (width - SIZES.paddingHorizontal * 2 - 16) / 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.tertiary,
    marginTop: 8,
  },
});
