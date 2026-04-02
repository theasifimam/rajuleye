import { Tabs } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../constants/Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH = 260; 

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
          bottom: 20, // Lifted slightly for a modern floating feel
          backgroundColor: theme.card,
          borderRadius: 24,
          height: 64,
          borderWidth: 1,
          borderColor: theme.border,
          elevation: 0, // Android shadow removal
          paddingBottom: 0,
        },
        tabBarIconStyle: { marginTop: 0 },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconWrapper,
              focused && { backgroundColor: theme.primary }
            ]}>
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                size={20}
                color={focused ? "#FFF" : theme.subtext}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconWrapper,
              focused && { backgroundColor: theme.primary }
            ]}>
              <Ionicons
                name={focused ? "cube" : "cube-outline"}
                size={20}
                color={focused ? "#FFF" : theme.subtext}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconWrapper,
              focused && { backgroundColor: theme.primary }
            ]}>
              <Ionicons
                name={focused ? "receipt" : "receipt-outline"}
                size={20}
                color={focused ? "#FFF" : theme.subtext}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconWrapper,
              focused && { backgroundColor: theme.primary }
            ]}>
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={20}
                color={focused ? "#FFF" : theme.subtext}
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
    width: 40,
    height: 40,
    borderRadius: 12, // More squared-off minimal look
    justifyContent: 'center',
    alignItems: 'center',
  },
});
