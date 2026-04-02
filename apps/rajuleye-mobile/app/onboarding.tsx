import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme, SIZES, SHADOWS } from '../constants/Theme';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const { colors: theme, isDark } = useAppTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={styles.imageSection}>
        <View style={[styles.glow, { backgroundColor: theme.primary + '10' }]} />
        <Ionicons name="glasses" size={150} color={theme.primary} />
      </View>

      <View style={styles.contentSection}>
        <Text style={[styles.title, { color: theme.text }]}>
          Manage your{"\n"}
          <Text style={{ color: theme.primary }}>Empire.</Text>
        </Text>
        <Text style={[styles.description, { color: theme.subtext }]}>
          The complete admin suite for Rajul Eye Care. Track inventory, manage orders, and analyze performance with ease.
        </Text>

        <View style={styles.features}>
           <View style={styles.featureItem}>
              <View style={[styles.iconBox, { backgroundColor: theme.card }]}>
                 <Ionicons name="stats-chart-outline" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.featureText, { color: theme.text }]}>Realtime Analytics</Text>
           </View>
           <View style={styles.featureItem}>
              <View style={[styles.iconBox, { backgroundColor: theme.card }]}>
                 <Ionicons name="cube-outline" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.featureText, { color: theme.text }]}>Smart Inventory</Text>
           </View>
        </View>

        <TouchableOpacity 
          style={[styles.mainBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.mainBtnText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color={theme.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 48,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 35,
  },
  features: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 45,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainBtn: {
    height: 64,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  mainBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
