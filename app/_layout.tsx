import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import komponen & utils
import { ThemeProvider } from '../src/context/ThemeContext'; 
import { registerForPushNotificationsAsync } from '../src/utils/notifications';

const queryClient = new QueryClient();

export default function RootLayout() {

  // 🔥 LOGIKA AKTIVASI NOTIFIKASI SAAT APLIKASI PERTAMA KALI LOADING
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        console.log("Token notifikasi berhasil didapatkan:", token);
        // Nanti token ini kita simpan ke database/Vercel
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}