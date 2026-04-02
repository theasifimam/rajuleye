import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppTheme } from '../constants/Theme';
import { View } from 'react-native';
import Toast from '../components/ui/Toast';

const queryClient = new QueryClient();

function LayoutContent() {
  const { colors: theme } = useAppTheme();

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false, title: 'Notifications' }} />
        <Stack.Screen name="product" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <Toast />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LayoutContent />
      </QueryClientProvider>
    </Provider>
  );
}
