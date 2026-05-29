import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const NUM_PARTICLES = 15; // Jumlah debu kosmik putih melayang

export default function AnimatedBackground() {
  // === LOGIKA PARTIKEL TITIK PUTIH (TIDAK BERUBAH) ===
  const particles = useRef(
    Array.from({ length: NUM_PARTICLES }).map(() => ({
      x: Math.random() * width,
      yAnim: new Animated.Value(Math.random() * height),
      opacityAnim: new Animated.Value(Math.random()),
      size: Math.random() * 3 + 1.5,
      speed: Math.random() * 4000 + 5000,
    }))
  ).current;

  useEffect(() => {
    particles.forEach((p) => {
      Animated.loop(
        Animated.timing(p.yAnim, {
          toValue: -50,
          duration: p.speed * 2,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(p.opacityAnim, { toValue: 1, duration: p.speed / 2, useNativeDriver: true }),
          Animated.timing(p.opacityAnim, { toValue: 0.1, duration: p.speed / 2, useNativeDriver: true }),
        ])
      ).start();
    });
  }, [particles]);
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      {/* 1. Base Hitam Pekat */}
      <View style={styles.baseBackground} />

      {/* 2. GRADASI AMBIENT BLUR (Tanpa Bentuk, Sangat Tipis) */}
      <LinearGradient
        // === PERBAIKAN DI SINI: Warna dibuat sangat tipis & buram (Alpha diturunkan ekstrem ke 0.12) ===
        // Merah BoltStats cerah tapi sangat transparan agar tidak kaku/mencolok
        colors={['rgba(225, 6, 0, 0.12)', 'transparent']} 
        start={{ x: 1, y: 0.5 }} // Mulai dari mentok Tepi Kanan
        // === PERBAIKAN DI SINI: Jangkauan gradasi diperlebar ekstrem (fade out di 10% sisa layar) ===
        // Ini menciptakan efek pendaran cahaya yang sangat buram menyeberang layar
        end={{ x: 0.1, y: 0.5 }} 
        style={styles.rightGlow}
      />

      {/* Tambahan tipis dari Kiri Atas agar tidak terlalu gelap */}
      <LinearGradient
        // === PERBAIKAN DI SINI: Sangat tipis juga di kiri atas (Alpha diturunkan ke 0.08) ===
        colors={['rgba(225, 6, 0, 0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.8 }}
        style={styles.topLeftGlow}
      />

      {/* 3. Partikel Titik Putih Melayang (Ditaruh di atas blur agar tetap tajam) */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: p.x,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              opacity: p.opacityAnim,
              transform: [{ translateY: p.yAnim }]
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1, // Selalu di belakang konten
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0c0d10', // Hitam pekat BoltStats
  },
  
  // Style Gradasi Tepi Kanan (Ambient Glow)
  rightGlow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    // Kita buat gradasinya menyapu hampir seluruh layar agar buram maksimal
    width: width * 0.9, 
  },
  
  // Style Gradasi Kiri Atas (Sangat Tipis)
  topLeftGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
  },

  // Partikel debu kosmik putih
  particle: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  }
});