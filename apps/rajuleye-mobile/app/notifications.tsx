import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, SIZES, SHADOWS } from '../constants/Theme';
import { useRouter } from 'expo-router';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #8901 from Arjun Singh — ₹2,400 — needs processing.',
    time: '5 min ago',
    read: false,
    icon: 'receipt-outline',
    color: '#5856D6',
  },
  {
    id: '2',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Titanium Aviator Pro is running low — only 4 units remaining.',
    time: '22 min ago',
    read: false,
    icon: 'warning-outline',
    color: '#FF9500',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Confirmed',
    message: 'Order #8900 from Priya Verma — ₹1,500 payment verified.',
    time: '1 hr ago',
    read: true,
    icon: 'card-outline',
    color: '#00D084',
  },
  {
    id: '4',
    type: 'review',
    title: 'New Customer Review',
    message: 'Rahul Dev left a 5★ review on Classic Tortoise Shell.',
    time: '3 hrs ago',
    read: true,
    icon: 'star-outline',
    color: '#FFD700',
  },
  {
    id: '5',
    type: 'order',
    title: 'Order Shipped',
    message: 'Order #8899 has been shipped via BlueDart — tracking active.',
    time: '5 hrs ago',
    read: true,
    icon: 'airplane-outline',
    color: '#5856D6',
  },
  {
    id: '6',
    type: 'stock',
    title: 'Restock Reminder',
    message: 'Designer Cat-Eye Gold has been out of stock for 3 days.',
    time: 'Yesterday',
    read: true,
    icon: 'cube-outline',
    color: '#FF3B30',
  },
];

const NotificationsScreen = () => {
  const { colors: theme, isDark } = useAppTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: theme.text }]}>Alerts</Text>
          {unreadCount > 0 && (
            <View style={[styles.countBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.countText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={[styles.markAll, { color: theme.primary }]}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {notifications.map((notif, index) => (
          <TouchableOpacity
            key={notif.id}
            onPress={() => markRead(notif.id)}
            style={[
              styles.notifCard,
              {
                backgroundColor: notif.read ? theme.card : theme.primarySoft,
                borderColor: notif.read ? theme.border : theme.primaryMedium,
              },
              SHADOWS.soft,
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: notif.color + '20' }]}>
              <Ionicons name={notif.icon as any} size={22} color={notif.color} />
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifTopRow}>
                <Text style={[styles.notifTitle, { color: theme.text }]}>{notif.title}</Text>
                {!notif.read && (
                  <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
                )}
              </View>
              <Text style={[styles.notifMessage, { color: theme.subtext }]} numberOfLines={2}>
                {notif.message}
              </Text>
              <Text style={[styles.notifTime, { color: theme.subtext }]}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  markAll: {
    fontSize: 13,
    fontWeight: '700',
    width: 80,
    textAlign: 'right',
  },
  scrollContent: {
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingTop: 8,
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
  },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  notifMessage: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '600',
  },
});
