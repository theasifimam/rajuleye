import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, SIZES } from '../../constants/Theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { setThemePreference } from '../../store/slices/themeSlice';
import { logout } from '../../store/slices/authSlice';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const { colors: theme, isDark } = useAppTheme();
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleToggleTheme = () => {
    dispatch(setThemePreference(isDark ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  const profileOptions = [
    { id: '1', title: 'Store Settings', icon: 'settings-outline', color: '#00D084' },
    { id: '2', title: 'Team Management', icon: 'people-outline', color: '#FF9500' },
    { id: '3', title: 'Payment Gateways', icon: 'card-outline', color: '#5856D6' },
    { id: '4', title: 'Notifications', icon: 'notifications-outline', color: '#FF2D55' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>

        {/* Profile Card (Flat) */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.primary + '08' }]}>
               <Ionicons name="person-outline" size={32} color={theme.primary} />
            </View>
            <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.primary }]}>
                <Ionicons name="pencil" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Admin User'}</Text>
          <Text style={[styles.userEmail, { color: theme.subtext }]}>{user?.email || 'admin@rajuleye.com'}</Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.primary + '08' }]}>
            <Ionicons name="shield-checkmark" size={10} color={theme.primary} />
            <Text style={[styles.roleText, { color: theme.primary }]}>Super Admin</Text>
          </View>
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Store Management</Text>
          <View style={[styles.optionsList, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {profileOptions.map((opt, idx) => (
              <React.Fragment key={opt.id}>
                <TouchableOpacity style={styles.optionItem}>
                  <View style={[styles.iconContainer, { backgroundColor: opt.color + '08' }]}>
                    <Ionicons name={opt.icon as any} size={18} color={opt.color} />
                  </View>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>{opt.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.subtext} />
                </TouchableOpacity>
                {idx < profileOptions.length - 1 && <View style={[styles.separator, { backgroundColor: theme.border }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          <View style={[styles.optionsList, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.optionItem}>
              <View style={[styles.iconContainer, { backgroundColor: '#6C5CE708' }]}>
                <Ionicons name="moon-outline" size={18} color="#6C5CE7" />
              </View>
              <Text style={[styles.optionTitle, { color: theme.text }]}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={handleToggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          style={[styles.logoutBtn, { borderColor: theme.destructive + '20' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.destructive} />
          <Text style={[styles.logoutText, { color: theme.destructive }]}>Sign Out</Text>
        </TouchableOpacity>
        
        <View style={{ height: 120 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  profileCard: { marginHorizontal: 24, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, marginBottom: 24 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  editBtn: { position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  userName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  userEmail: { fontSize: 13, fontWeight: '500', marginBottom: 12 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  roleText: { fontSize: 11, fontWeight: '800' },
  section: { marginTop: 8, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12, marginLeft: 2 },
  optionsList: { borderRadius: 20, borderWidth: 1, paddingVertical: 4, marginBottom: 12 },
  optionItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  iconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  optionTitle: { flex: 1, fontSize: 14, fontWeight: '700' },
  separator: { height: 1, marginHorizontal: 16 },
  logoutBtn: { marginTop: 24, marginHorizontal: 24, height: 50, borderRadius: 16, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  logoutText: { fontSize: 14, fontWeight: '800' },
});

export default ProfileScreen;
