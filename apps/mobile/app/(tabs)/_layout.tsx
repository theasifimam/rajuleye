import { Tabs } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS, useAppTheme } from '../../constants/Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH = 220;

export default function TabLayout() {
  const { colors: theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.background,
        tabBarInactiveTintColor: theme.subtext,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2,
          right: (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2,
          backgroundColor: theme.card,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 72,
          borderTopWidth: 0,
          elevation: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          paddingTop: 0,
          paddingBottom: 0,
          overflow: 'visible',
        },
        tabBarShowLabel: false,
        tabBarLabelStyle: { display: 'none' },
        tabBarItemStyle: {
          height: 72,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          margin: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconWrapper,
              focused && { backgroundColor: theme.primary, ...SHADOWS.soft }
            ]}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? theme.background : theme.subtext}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlists"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconWrapper,
              focused && { backgroundColor: theme.primary, ...SHADOWS.soft }
            ]}>
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={24}
                color={focused ? theme.background : theme.subtext}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconWrapper,
              focused && { backgroundColor: theme.primary, ...SHADOWS.soft }
            ]}>
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={24}
                color={focused ? theme.background : theme.subtext}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconWrapper,
              focused && { backgroundColor: theme.primary, ...SHADOWS.soft }
            ]}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? theme.background : theme.subtext}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  activeIconWrapper: {
    ...SHADOWS.soft,
  },
});
