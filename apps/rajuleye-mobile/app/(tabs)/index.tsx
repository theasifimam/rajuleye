import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, Dimensions, StatusBar, Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../constants/Theme';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TICKER_DATA = [
  { label: 'Avg Sale', val: '₹3,420', trend: 'up' },
  { label: 'Active', val: '1.2k', trend: 'up' },
  { label: 'Risk', val: '0.4%', trend: 'down' },
];

const QUICK_ACTIONS = [
  { label: 'Inventory', icon: 'cube-outline', color: '#00D084', route: '/inventory' },
  { label: 'Orders', icon: 'receipt-outline', color: '#5856D6', route: '/orders' },
  { label: 'Insights', icon: 'flash-outline', color: '#FF9500', route: '/' },
  { label: 'Settings', icon: 'settings-outline', color: '#FF2D55', route: '/profile' },
];

const VELOCITY_DATA = [30, 45, 25, 60, 40, 90, 65, 80, 50, 75, 45, 85];

const DashboardScreen = () => {
  const { colors: theme, isDark } = useAppTheme();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 40, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'long' });

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Dynamic Background Glows */}
      <View style={[styles.glow, { backgroundColor: theme.primary + '03', top: -100, right: -100, width: 400, height: 400 }]} />
      <View style={[styles.glow, { backgroundColor: '#5856D603', bottom: -50, left: -50, width: 300, height: 300 }]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── HEADER: MINIMAL & CLEAN ── */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={[styles.dateText, { color: theme.subtext }]}>{today}</Text>
            <Text style={[styles.greeting, { color: theme.text }]}>Hello, {user?.name?.split(' ')[0] || 'Admin'}</Text>
          </View>
          <TouchableOpacity 
             onPress={() => router.push('/notifications')}
             style={[styles.bellBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="notifications-outline" size={20} color={theme.text} />
            <View style={[styles.bellDot, { backgroundColor: theme.primary }]} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── BENTO GRID: REFINED ── */}
        <Animated.View style={[styles.bentoContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
           
           {/* MAIN CARD: HIGH-END GRADIENT ── */}
           <View style={[styles.mainCard, { borderColor: theme.border }]}>
             <LinearGradient
                colors={isDark ? ['#0A251B', '#0D1A16'] : ['#00B87C', '#009665']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainCardInner}
             >
                <View style={styles.mainCardHeader}>
                   <View style={styles.labelGroup}>
                      <Text style={styles.mainLabel}>DASHBOARD TOTAL</Text>
                      <Text style={styles.mainSub}>Estimated Net Earnings</Text>
                   </View>
                   <View style={styles.trendBadge}>
                      <Ionicons name="trending-up" size={12} color="#FFF" />
                      <Text style={styles.trendText}>+12.4%</Text>
                   </View>
                </View>

                <Text style={styles.mainValue}>₹1,45,230</Text>

                <View style={styles.tickerRow}>
                   {TICKER_DATA.map((t, i) => (
                      <View key={i} style={styles.tickerItem}>
                         <Text style={styles.tickerLabel}>{t.label.toUpperCase()}</Text>
                         <Text style={styles.tickerVal}>{t.val}</Text>
                      </View>
                   ))}
                </View>
             </LinearGradient>
           </View>

           {/* SECOND ROW: TWO TILES ── */}
           <View style={styles.bentoRow}>
              {/* Tile 1: Velocity Snapshot */}
              <View style={[styles.tile, { backgroundColor: theme.card, borderColor: theme.border }]}>
                 <Text style={[styles.tileLabel, { color: theme.subtext }]}>VELOCITY</Text>
                 <View style={styles.velocityGrid}>
                    {VELOCITY_DATA.map((v, i) => (
                       <View key={i} style={[styles.velocityBar, { 
                          height: (v * 0.4), 
                          backgroundColor: i === 5 || i === 10 ? theme.primary : (isDark ? '#2D3631' : '#EDF5F1'),
                          borderRadius: 2,
                       }]} />
                    ))}
                 </View>
                 <Text style={[styles.tileSub, { color: theme.subtext }]}>Healthy Sales Rhythms</Text>
              </View>

              {/* Tile 2: Efficiency Track */}
              <View style={[styles.tile, { backgroundColor: theme.card, borderColor: theme.border }]}>
                 <Text style={[styles.tileLabel, { color: theme.subtext }]}>EFFICIENCY</Text>
                 <View style={styles.efficiencyCircle}>
                    <Text style={[styles.efficiencyText, { color: theme.text }]}>84%</Text>
                    <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                       <View style={[styles.progressBar, { backgroundColor: theme.primary, width: '84%' }]} />
                    </View>
                 </View>
                 <Text style={[styles.tileSub, { color: theme.subtext }]}>+2.1% from yesterday</Text>
              </View>
           </View>

           {/* THIRD ROW: ACTIONS ── */}
           <View style={styles.actionSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Access</Text>
              <View style={styles.actionGrid}>
                 {QUICK_ACTIONS.map((a, i) => (
                    <TouchableOpacity 
                       key={i} 
                       style={[styles.actionCell, { backgroundColor: theme.card, borderColor: theme.border }]}
                       onPress={() => router.push(a.route as any)}
                    >
                       <View style={[styles.iconBox, { backgroundColor: a.color + '08' }]}>
                          <Ionicons name={a.icon as any} size={20} color={a.color} />
                       </View>
                       <Text style={[styles.actionLabel, { color: theme.text }]}>{a.label}</Text>
                    </TouchableOpacity>
                 ))}
              </View>
           </View>

           {/* FOURTH ROW: RECENT LOGS ── */}
           <View style={styles.logSection}>
              <View style={styles.logHeader}>
                 <Text style={[styles.sectionTitle, { color: theme.text }]}>Realtime Activity</Text>
                 <TouchableOpacity onPress={() => router.push('/orders')}>
                    <Text style={[styles.viewAll, { color: theme.primary }]}>View Reports →</Text>
                 </TouchableOpacity>
              </View>
              
              <View style={[styles.logList, { backgroundColor: theme.card, borderColor: theme.border }]}>
                 {[
                   { id: '#8901', user: 'Arjun S.', price: '₹2.4k', time: '10m ago' },
                   { id: '#8900', user: 'Priya V.', price: '₹1.5k', time: '1h ago' },
                 ].map((log, i) => (
                    <View key={i} style={[styles.logItem, i !== 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
                       <View style={[styles.statusPip, { backgroundColor: i === 0 ? '#FF9500' : theme.primary }]} />
                       <View style={styles.logContent}>
                          <Text style={[styles.logUser, { color: theme.text }]}>{log.user}</Text>
                          <Text style={[styles.logId, { color: theme.subtext }]}>{log.id} · {log.time}</Text>
                       </View>
                       <Text style={[styles.logPrice, { color: theme.text }]}>{log.price}</Text>
                    </View>
                 ))}
              </View>
           </View>

        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 20 },
  glow: { position: 'absolute', borderRadius: 200 },

  // Header
  header: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  greeting: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  bellBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  bellDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: '#FFF' },

  // Bento Layout
  bentoContainer: { paddingHorizontal: 24, gap: 16 },
  
  // Main Card
  mainCard: { borderRadius: 30, borderWidth: 1, overflow: 'hidden' },
  mainCardInner: { padding: 28, minHeight: 220 },
  mainCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  labelGroup: { gap: 2 },
  mainLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  mainSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' },
  mainValue: { color: '#FFF', fontSize: 48, fontWeight: '900', letterSpacing: -2.5, marginVertical: 20 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 4 },
  trendText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  tickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  tickerItem: { gap: 4 },
  tickerLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  tickerVal: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  // Second Row
  bentoRow: { flexDirection: 'row', gap: 16 },
  tile: { flex: 1, borderRadius: 28, borderWidth: 1, padding: 20, minHeight: 140 },
  tileLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 16 },
  tileSub: { fontSize: 10, fontWeight: '600', marginTop: 12 },
  
  // Velocity Map
  velocityGrid: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 40, gap: 3 },
  velocityBar: { flex: 1 },

  // Efficiency
  efficiencyCircle: { gap: 8 },
  efficiencyText: { fontSize: 32, fontWeight: '900', letterSpacing: -1.5 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 2 },

  // Actions
  actionSection: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5, marginBottom: 16 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCell: { width: (SCREEN_WIDTH - 48 - 12) / 2, borderRadius: 22, borderWidth: 1, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 13, fontWeight: '800' },

  // Logs
  logSection: { marginTop: 16 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  viewAll: { fontSize: 13, fontWeight: '700' },
  logList: { borderRadius: 26, borderWidth: 1, overflow: 'hidden' },
  logItem: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 12 },
  statusPip: { width: 6, height: 6, borderRadius: 3 },
  logContent: { flex: 1, gap: 2 },
  logUser: { fontSize: 14, fontWeight: '800' },
  logId: { fontSize: 12, fontWeight: '600' },
  logPrice: { fontSize: 14, fontWeight: '900' },
});

export default DashboardScreen;
