import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme, SHADOWS, SIZES } from '../constants/Theme';

const { width } = Dimensions.get('window');

const NOTIFICATION_TABS = ['All', 'Orders', 'Offers'];

interface Notification {
  id: string;
  type: 'order' | 'offer' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { 
    id: '1', 
    type: 'order', 
    title: 'Order Shipped!', 
    message: 'Your Classic Aviators are on the way. Expected delivery Oct 15.', 
    time: '2h ago', 
    isRead: false,
    icon: 'airplane-outline'
  },
  { 
    id: '2', 
    type: 'offer', 
    title: 'Flash Sale Alert ⚡', 
    message: 'Get 30% off on all Blue Light frames for the next 4 hours!', 
    time: '5h ago', 
    isRead: false,
    icon: 'flash-outline' 
  },
  { 
    id: '3', 
    type: 'order', 
    title: 'Payment Successful', 
    message: 'Your payment for order ORD-7721 was received successfully.', 
    time: 'Yesterday', 
    isRead: true,
    icon: 'card-outline'
  },
  { 
    id: '4', 
    type: 'info', 
    title: 'Address Updated', 
    message: 'Your primary shipping address has been successfully updated.', 
    time: '2 days ago', 
    isRead: true,
    icon: 'location-outline'
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors: theme, isDark } = useAppTheme();
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filteredNotifications = activeTab === 'All' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab.toLowerCase().slice(0, -1)); // Maps 'Orders' -> 'order'

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notifCard, 
        { backgroundColor: theme.card, borderColor: theme.border },
        !item.isRead && { borderLeftWidth: 4, borderLeftColor: theme.primary }
      ]}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBox, { backgroundColor: item.isRead ? theme.accent : theme.primarySoft }]}>
        <Ionicons name={item.icon as any} size={22} color={item.isRead ? theme.subtext : theme.primary} />
      </View>
      <View style={styles.notifInfo}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.notifTime, { color: theme.subtext }]}>{item.time}</Text>
        </View>
        <Text style={[styles.notifMessage, { color: theme.subtext }]} numberOfLines={2}>{item.message}</Text>
      </View>
    </TouchableOpacity>
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
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.backBtn, { backgroundColor: theme.card }]} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
            <TouchableOpacity onPress={markAllAsRead}>
                <Text style={[styles.actionText, { color: theme.primary }]}>Read All</Text>
            </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
            {NOTIFICATION_TABS.map((tab) => (
                <TouchableOpacity 
                    key={tab} 
                    onPress={() => setActiveTab(tab)}
                    style={[
                        styles.tabBtn, 
                        activeTab === tab && { backgroundColor: theme.primary }
                    ]}
                >
                    <Text style={[
                        styles.tabText, 
                        { color: activeTab === tab ? theme.background : theme.subtext }
                    ]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {/* List Content */}
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <View style={[styles.emptyCircle, { backgroundColor: theme.accent }]}>
                    <Ionicons name="notifications-off-outline" size={60} color={theme.subtext} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>All Caught Up!</Text>
                <Text style={[styles.emptySub, { color: theme.subtext }]}>No new alerts at the moment. We'll keep you posted.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
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
    paddingTop: 10,
    marginBottom: 24,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    gap: 8,
    marginBottom: 24,
  },
  tabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notifInfo: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  notifMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  }
});
