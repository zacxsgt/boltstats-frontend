import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. ATUR PERILAKU NOTIFIKASI SAAT APLIKASI TERBUKA
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true, // <-- Properti tambahan yang diminta Expo versi baru
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as Notifications.NotificationBehavior), // <-- Stempel paksa agar TypeScript tunduk
});

// 2. FUNGSI UNTUK MEMINTA IZIN & MENGAMBIL "KTP" HP (PUSH TOKEN)
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Boltstats Live',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#e10600',
    });
  }

  // Notifikasi hanya bisa jalan di HP asli, tidak bisa di Emulator
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Izin notifikasi ditolak oleh user!');
      return;
    }
    
    // Ambil Token Unik HP ini (Panjangnya seperti kode rahasia)
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Token HP Boss:", token);
  } else {
    console.log('Notifikasi Push harus menggunakan HP fisik');
  }

  return token;
}