import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModalHeaderText from '@/components/ModalHeaderText';
import Colors from '@/constants/Colors';

const client = new QueryClient();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      return;
    }
  }
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'poppins': require('../assets/fonts/Poppins-Regular.ttf'),
    'poppins-italic': require('../assets/fonts/Poppins-Italic.ttf'),
    'poppins-light': require('../assets/fonts/Poppins-Light.ttf'),
    'poppins-medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'poppins-bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'poppins-semi': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'poppins-thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <RootLayoutNav />
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/(modals)/login');
    }
  }, [isLoaded])

  return (
    <QueryClientProvider client={client}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/login" options={{
          title: 'Log in or sign up',
          headerTitleStyle: {
            fontFamily: 'poppins-semi'
          },
          presentation: 'modal',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name='close-outline' size={28} />
            </TouchableOpacity>
          )
        }} />
        <Stack.Screen name="listing/[id]" options={{
          headerTitle: '',
          headerTransparent: true
        }} />
        <Stack.Screen name="(modals)/booking" options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerTransparent: true,
          headerTitle: () => <ModalHeaderText />,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}
              style={{
                backgroundColor: '#fff',
                borderColor: Colors.grey,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4
              }}
            >
              <Ionicons name='close-outline' size={22} />
            </TouchableOpacity>
          )
        }} />
      </Stack>
    </QueryClientProvider>
  );
}
