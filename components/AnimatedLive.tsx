import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function AnimatedLive() {
  // 1. Buat nilai memori untuk animasi (Opacity awal = 1)
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 2. Buat efek detak jantung (redup-terang) yang berulang tanpa henti
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.1, // Meredup sampai nyaris hilang
          duration: 800, // Kecepatan redup (800 milidetik)
          useNativeDriver: true, // Biarkan HP yang proses agar tidak lag
        }),
        Animated.timing(fadeAnim, {
          toValue: 1, // Menyala terang kembali
          duration: 800, // Kecepatan terang
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.badgeContainer}>
      {/* Titik merah yang berkedip */}
      <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
      {/* Teks LIVE */}
      <Text style={styles.liveText}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225, 6, 0, 0.15)', // Latar merah gelap/transparan khas video
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e10600', // Merah menyala
    marginRight: 6,
  },
  liveText: {
    color: '#e10600',
    fontWeight: '900',
    fontSize: 11,
    fontStyle: 'italic',
    letterSpacing: 1,
  }
});