import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, Dimensions, StatusBar, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, SIZES } from '../../constants/Theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const OrdersScreen = () => {
  const { colors: theme, isDark } = useAppTheme();
  const [activeTab, setActiveTab] = useState('All');
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const TABS = ['All', 'Pending', 'Shipped', 'Delivered'];

  const ORDERS = [
    { id: '#8901', customer: 'Arjun Singh', status: 'Pending', amount: '₹2,400', date: 'Apr 2, 2026', items: 2 },
    { id: '#8900', customer: 'Priya Verma', status: 'Shipped', amount: '₹1,500', date: 'Apr 1, 2026', items: 1 },
    { id: '#8899', customer: 'Rahul Dev', status: 'Delivered', amount: '₹4,200', date: 'Mar 31, 2026', items: 3 },
    { id: '#8898', customer: 'Sonia Khan', status: 'Delivered', amount: '₹950', date: 'Mar 30, 2026', items: 1 },
    { id: '#8897', customer: 'Vikas Roy', status: 'Pending', amount: '₹3,100', date: 'Mar 29, 2026', items: 2 },
  ];

  const filteredOrders = activeTab === 'All' 
    ? ORDERS 
    : ORDERS.filter(o => o.status === activeTab);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.brand, { color: theme.text }]}>Orders</Text>
          <Text style={[styles.subBrand, { color: theme.subtext }]}>{ORDERS.length} Orders received</Text>
        </View>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="funnel-outline" size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs (Flat) */}
      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabPill,
                { 
                  backgroundColor: activeTab === tab ? theme.primary : theme.card,
                  borderColor: activeTab === tab ? theme.primary : theme.border,
                  borderWidth: 1,
                }
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab ? theme.background : theme.text }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim }}
      >
        <View style={styles.ordersList}>
          {filteredOrders.map((order) => (
            <TouchableOpacity 
              key={order.id} 
              style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={styles.orderTop}>
                <View style={[styles.statusBadge, { 
                  backgroundColor: order.status === 'Pending' ? '#FF950008' : order.status === 'Shipped' ? '#5856D608' : '#00D08408'
                }]}>
                  <View style={[styles.statusDot, { 
                    backgroundColor: order.status === 'Pending' ? '#FF9500' : order.status === 'Shipped' ? '#5856D6' : '#00D084'
                  }]} />
                  <Text style={[styles.statusText, { 
                    color: order.status === 'Pending' ? '#FF9500' : order.status === 'Shipped' ? '#5856D6' : '#00D084'
                  }]}>{order.status}</Text>
                </View>
                <Text style={[styles.orderDate, { color: theme.subtext }]}>{order.date}</Text>
              </View>
              
              <View style={styles.orderMiddle}>
                <View style={styles.orderInfo}>
                  <Text style={[styles.customerName, { color: theme.text }]}>{order.customer}</Text>
                  <Text style={[styles.orderId, { color: theme.subtext }]}>ID: {order.id} · {order.items} items</Text>
                </View>
                <Text style={[styles.orderAmount, { color: theme.text }]}>{order.amount}</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              
              <View style={styles.orderActions}>
                <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.border }]}>
                  <Text style={[styles.actionBtnText, { color: theme.subtext }]}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtnPrimary, { backgroundColor: theme.primarySoft }]}>
                  <Text style={[styles.actionBtnTextPrimary, { color: theme.primaryDark }]}>Manage</Text>
                </TouchableOpacity>
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
  filterBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  tabsContainer: { paddingHorizontal: 24, gap: 10, marginBottom: 24 },
  tabPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  tabText: { fontSize: 13, fontWeight: '700' },
  ordersList: { paddingHorizontal: 24, gap: 16 },
  orderCard: { padding: 16, borderRadius: 20, borderWidth: 1 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 5 },
  statusDot: { width: 5, height: 5, borderRadius: 2.5 },
  statusText: { fontSize: 10, fontWeight: '800' },
  orderDate: { fontSize: 12, fontWeight: '600' },
  orderMiddle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  orderInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  orderId: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  orderAmount: { fontSize: 16, fontWeight: '900' },
  divider: { height: 1, marginBottom: 16 },
  orderActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, height: 42, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { fontSize: 13, fontWeight: '700' },
  actionBtnPrimary: { flex: 1, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionBtnTextPrimary: { fontSize: 13, fontWeight: '800' },
});

export default OrdersScreen;
