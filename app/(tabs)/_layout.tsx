import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Dimensions, Animated, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

// === SISTEM WARNA ===
const COLORS = {
  active: '#e10600',
  inactive: '#555555',
  barBackground: '#1C1C1E',
  textOnActive: '#FFFFFF',
};

// === KOMPONEN IKON KUSTOM ===
interface CustomTabItemProps {
  icon: any;
  focusedIcon: any;
  label: string;
  focused: boolean;
}

function CustomTabItem({ icon, focusedIcon, label, focused }: CustomTabItemProps) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconCircle, focused && styles.iconCircleActive]}>
        <Ionicons
          name={focused ? focusedIcon : icon}
          size={20}
          color={focused ? COLORS.textOnActive : COLORS.inactive}
        />
      </View>
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const BAR_HEIGHT = 68;
const { width: W } = Dimensions.get('window');

export default function TabLayout() {
  // === STATE & ANIMASI SPLASH SCREEN ===
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const scaleAnim = useRef(new Animated.Value(0.3)).current; 

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsSplashVisible(false);
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#111113' }}>
      
      {/* === NAVIGASI UTAMA (KAPSUL KACA) === */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          safeAreaInsets: { bottom: 0, top: 0 },
          tabBarStyle: styles.tabBarOuter,
          tabBarItemStyle: styles.tabBarItem,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarBackground: () => (
            <View style={styles.tabBarInner}>
              <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabItem icon="home-outline" focusedIcon="home" label="Home" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="jadwal"
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabItem icon="calendar-outline" focusedIcon="calendar" label="Jadwal" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="klasemen"
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabItem icon="trophy-outline" focusedIcon="trophy" label="Klasemen" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabItem icon="person-outline" focusedIcon="person" label="Profil" focused={focused} />
            ),
          }}
        />
      </Tabs>

      {/* === ANIMASI OPENING (SPLASH SCREEN) === */}
      {isSplashVisible && (
        <Animated.View style={[
          styles.splashContainer,
          { opacity: fadeAnim } 
        ]}>
          <Animated.Image
            source={require('../../assets/images/logo_apk.png')} 
            style={[
              styles.splashLogo,
              { transform: [{ scale: scaleAnim }] } 
            ]}
          />
          <Text style={styles.splashText}>
            BOLT<Text style={styles.splashTextHighlight}>STATS</Text>
          </Text>
        </Animated.View>
      )}

    </View>
  );
}

// === GABUNGAN STYLE KAPSUL DAN SPLASH SCREEN ===
const styles = StyleSheet.create({
  // --- Style Navigasi Kapsul ---
  tabBarOuter: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    width: W,           
    height: BAR_HEIGHT,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingHorizontal: 30, 
  },
  tabBarInner: {
    position: 'absolute',
    left: 30,           
    right: 30,          
    top: 0,
    bottom: 0,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden', 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  tabBarItem: {
    flex: 1,
    height: BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  tabBarIcon: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    gap: 2,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: COLORS.active,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.inactive,
    textAlign: 'center',
  },
  labelActive: {
    color: COLORS.active,
  },

  // --- Style Splash Screen ---
  splashContainer: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: '#121414', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, 
    elevation: 9999,
  },
  splashLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  splashText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f5f5f5',
    letterSpacing: 2,
  },
  splashTextHighlight: {
    color: '#e10600',
  }
});