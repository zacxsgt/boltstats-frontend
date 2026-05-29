import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../src/context/ThemeContext'; 
import { registerForPushNotificationsAsync } from '../src/utils/notifications';

const queryClient = new QueryClient();

export default function RootLayout() {

  useEffect(() => {
    async function setupNotifications() {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          // Hanya simpan token ke Markas Besar saat aplikasi dibuka
          await fetch('https://boltstats-backend.vercel.app/api/save-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pushToken: token }),
          });
          console.log("Token sukses diamankan di Markas Besar!");
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    }
    setupNotifications();
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