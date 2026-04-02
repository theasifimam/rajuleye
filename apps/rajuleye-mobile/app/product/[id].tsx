import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  Dimensions, StatusBar, TextInput, Switch, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme, SIZES, SHADOWS } from '../../constants/Theme';
import { MOCK_PRODUCTS } from '../../data/products';
import { useAppDispatch } from '../../store';
import { showToast } from '../../store/slices/toastSlice';

const { width } = Dimensions.get('window');

const ProductEditScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors: theme, isDark } = useAppTheme();
  const dispatch = useAppDispatch();

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(String(product?.price || ''));
  const [description, setDescription] = useState(product?.description || '');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const stock = product ? (parseInt(product.id, 10) * 7 + 13) % 60 + 5 : 0;
  const isLowStock = stock < 15;

  if (!product) return null;

  const handleSave = () => {
    dispatch(showToast({ message: 'Product updated successfully', type: 'success' }));
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(showToast({ message: 'Product deleted', type: 'success' }));
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <SafeAreaView style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.circleBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Product</Text>
        <TouchableOpacity onPress={handleDelete} style={[styles.circleBtn, { backgroundColor: '#FF3B3015', borderColor: '#FF3B3030' }]}>
          <Ionicons name="trash-outline" size={20} color={theme.destructive} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Product Image / Visual */}
        <View style={[styles.imageSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.primary + '12' }]}>
            <Ionicons name="glasses-outline" size={80} color={theme.primary} />
          </View>
          <TouchableOpacity style={[styles.changeImageBtn, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <Ionicons name="camera-outline" size={18} color={theme.subtext} />
            <Text style={[styles.changeImageText, { color: theme.subtext }]}>Change Image</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statChip, { backgroundColor: isLowStock ? '#FF950015' : '#00D08415' }]}>
            <Ionicons name={isLowStock ? 'warning' : 'cube'} size={16} color={isLowStock ? '#FF9500' : '#00D084'} />
            <Text style={[styles.statChipText, { color: isLowStock ? '#FF9500' : '#00D084' }]}>{stock} In Stock</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: theme.primarySoft }]}>
            <Ionicons name="star" size={16} color={theme.primaryDark} />
            <Text style={[styles.statChipText, { color: theme.primaryDark }]}>{product.rating} Rating</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: '#5856D615' }]}>
            <Ionicons name="chatbubble-outline" size={16} color="#5856D6" />
            <Text style={[styles.statChipText, { color: '#5856D6' }]}>{product.reviews} Reviews</Text>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Product Info</Text>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: theme.subtext }]}>Product Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[styles.input, { color: theme.text }]}
                placeholderTextColor={theme.subtext}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: theme.subtext }]}>Price (₹)</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={[styles.input, { color: theme.text }]}
                placeholderTextColor={theme.subtext}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: theme.subtext }]}>Category</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.input, { color: theme.text, textTransform: 'capitalize' }]}>{product.category}</Text>
              <Ionicons name="chevron-down" size={18} color={theme.subtext} />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: theme.subtext }]}>Description</Text>
            <View style={[styles.textareaContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={[styles.textarea, { color: theme.text }]}
                placeholderTextColor={theme.subtext}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Features */}
        {product.features && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Features</Text>
            <View style={[styles.featuresList, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {product.features.map((feature, idx) => (
                <View key={idx} style={[styles.featureRow, idx > 0 && { borderTopWidth: 1, borderTopColor: theme.border }]}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
                  <Text style={[styles.featureText, { color: theme.text }]}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Toggles */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Visibility</Text>
          <View style={[styles.toggleList, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.toggleRow}>
              <View style={[styles.toggleIcon, { backgroundColor: '#00D08420' }]}>
                <Ionicons name="eye-outline" size={18} color="#00D084" />
              </View>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>Active Listing</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.background}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.toggleRow}>
              <View style={[styles.toggleIcon, { backgroundColor: '#FFD70020' }]}>
                <Ionicons name="star-outline" size={18} color="#FFD700" />
              </View>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>Featured Product</Text>
              <Switch
                value={isFeatured}
                onValueChange={setIsFeatured}
                trackColor={{ false: theme.border, true: '#FFD700' }}
                thumbColor={theme.background}
              />
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Save Button */}
      <SafeAreaView style={[styles.bottomBar, { backgroundColor: theme.background, borderTopColor: theme.border }]} edges={['bottom']}>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color={theme.background} />
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default ProductEditScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageSection: {
    marginHorizontal: SIZES.paddingHorizontal,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  imagePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.paddingHorizontal,
    marginTop: 16,
    gap: 10,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 5,
  },
  statChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: SIZES.paddingHorizontal,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  formField: {
    marginBottom: 14,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 2,
  },
  inputContainer: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  textareaContainer: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    minHeight: 110,
  },
  textarea: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  featuresList: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  toggleList: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  saveBtn: {
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
