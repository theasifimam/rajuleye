import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProductCard } from '../../components/ui/ProductCard';
import { MOCK_PRODUCTS, CATEGORIES } from '../../data/products';
import { COLORS, SIZES, SHADOWS, useAppTheme } from '../../constants/Theme';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { showToast } from '../../store/slices/toastSlice';
import { useRouter } from 'expo-router';
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');


const PROMO_BANNERS = [
  {
    id: '1',
    title: 'New Season',
    subtitle: 'Get 20% Off on all sunglasses.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    color: '#FFE8EE'
  },
  {
    id: '2',
    title: 'Winter Sale',
    subtitle: 'Premium frames starting at ₹49.',
    image: 'https://images.unsplash.com/photo-1511499767390-90342f5b89a7?auto=format&fit=crop&q=80&w=600',
    color: '#E8F6FF'
  },
  {
    id: '3',
    title: 'Exclusive',
    subtitle: 'Limited edition collaboration.',
    image: 'https://images.unsplash.com/photo-1508296684628-25c176465301?auto=format&fit=crop&q=80&w=600',
    color: '#F0FFE8'
  },
];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<FlatList>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { colors: theme } = useAppTheme();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      let nextSlide = (activeSlide + 1) % PROMO_BANNERS.length;
      sliderRef.current?.scrollToIndex({
        index: nextSlide,
        animated: true,
      });
      setActiveSlide(nextSlide);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeSlide]);

  const handleToggleWishlist = (item: any) => {
    const isFavorite = wishlistItems.some(i => i.id === item.id);
    dispatch(toggleWishlist(item));
    dispatch(showToast({
      message: isFavorite ? "Removed from wishlist" : "Added to wishlist",
      type: isFavorite ? 'info' : 'success'
    }));
  };

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
            <Text style={[styles.greetingText, { color: theme.subtext }]}>Hello!</Text>
            <Text style={[styles.nameText, { color: theme.primaryDark }]}>Alexa</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bellButton, { backgroundColor: theme.accent }]}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Hero Typography */}
      <Text style={[styles.heroText, { color: theme.text }]}>Tailored Trends,</Text>
      <Text style={[styles.heroSubText, { color: theme.text }]}>Handpicked for you.</Text>

      {/* Search & Filter Bar */}
      <TouchableOpacity
        style={styles.searchFilterRow}
        activeOpacity={0.9}
        onPress={() => router.push('/search')}
      >
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.primaryMedium, borderWidth: 1 }]}>
          <Ionicons name="search-outline" size={20} color={theme.primaryDark} style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            style={[styles.searchInput, { color: theme.text }]}
            placeholderTextColor={theme.subtext}
            editable={false} // Make it a button that navigates
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="options-outline" size={20} color={theme.background} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Promo Slider */}
      <View style={styles.sliderContainer}>
        <FlatList
          ref={sliderRef}
          data={PROMO_BANNERS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / (width - SIZES.paddingHorizontal * 2));
            setActiveSlide(index);
          }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { backgroundColor: item.color }]}>
              <View style={styles.slideInfo}>
                <Text style={[styles.slideTitle, { color: COLORS.text }]}>{item.title}</Text>
                <Text style={[styles.slideSub, { color: COLORS.subtext }]}>{item.subtitle}</Text>
                <TouchableOpacity style={[styles.shopNowBtn, { backgroundColor: COLORS.primary }]}>
                  <Text style={[styles.shopNowText, { color: COLORS.background }]}>Shop Now</Text>
                </TouchableOpacity>
              </View>
              <Image source={{ uri: item.image }} style={styles.slideImage} resizeMode="contain" />
            </View>
          )}
        />
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {PROMO_BANNERS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: activeSlide === i ? COLORS.primary : 'rgba(0,0,0,0.1)' },
                activeSlide === i && { width: 24 }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Categories Scroll */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={(item) => item}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryPill,
              { backgroundColor: activeCategory === item ? theme.primary : theme.card }
            ]}
            onPress={() => setActiveCategory(item)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryText,
                { color: activeCategory === item ? theme.background : theme.subtext },
                activeCategory === item && styles.categoryTextActive
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
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
          data={activeCategory === 'All' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter(p => p.category === activeCategory)}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              style={styles.cardWrapper}
              onLike={() => handleToggleWishlist(item)}
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
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 56,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  slide: {
    width: width - SIZES.paddingHorizontal * 2,
    height: 180,
    borderRadius: 32,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 24,
  },
  slideInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slideSub: {
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
    maxWidth: '90%',
  },
  slideImage: {
    width: 120,
    height: '100%',
  },
  shopNowBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  shopNowText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  categoriesList: {
    flexGrow: 0,
    marginBottom: 10,
  },
  categoriesContent: {
    gap: 8,
    paddingRight: SIZES.paddingHorizontal,
  },
  categoryPill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    fontWeight: '600',
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingHorizontal,
  },
  cardWrapper: {
    width: (width - SIZES.paddingHorizontal * 2 - 16) / 2,
  },
});
