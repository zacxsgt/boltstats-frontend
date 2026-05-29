import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- TAMBAHAN WAJIB
import AnimatedLive from '../../components/AnimatedLive';

export default function MatchCard({ match }: { match: any }) {
  const router = useRouter();

  // 1. Memori posisi awal kilatan (mulai dari kiri luar tombol)
  const shimmerAnim = useRef(new Animated.Value(-150)).current;

  // 2. Mesin Animasi "Super Shine" (Sangat Cepat & Elegan)
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { 
          toValue: 350, // Bergerak menyeberang sampai kanan luar tombol
          duration: 350, // DURASI SUPER CEPAT (Hanya 350 milidetik!)
          easing: Easing.out(Easing.quad), // Efek natural melesat
          useNativeDriver: true 
        }),
        Animated.delay(3000) // Istirahat 3 detik sebelum kilatan berikutnya
      ])
    ).start();
  }, [shimmerAnim]);

  const homeTeam = match.teams.home;
  const awayTeam = match.teams.away;
  const homeScore = match.goals.home;
  const awayScore = match.goals.away;
  const statusShort = match.fixture.status.short;

  const matchTime = new Date(match.fixture.date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // --- LOGIKA STATUS PERTANDINGAN ---
  let displayStatus = statusShort;
  let isLive = false;
  let isFinished = false;

  if (['FT', 'AET', 'PEN'].includes(statusShort)) {
    displayStatus = 'FT'; 
    isFinished = true;
  } else if (statusShort === 'HT') {
    displayStatus = 'HT'; 
  } else if (['1H', '2H', 'ET', 'LIVE', 'P'].includes(statusShort)) {
    displayStatus = 'LIVE'; 
    isLive = true;
  } else if (['PST', 'CANC', 'ABD', 'TBD', 'SUSP'].includes(statusShort)) {
    displayStatus = 'PEND'; 
  } else if (statusShort === 'NS') {
    displayStatus = matchTime; 
  }

  // === SOLUSI ANTI-NYANGKUT: Simpan Memori sebelum pindah halaman ===
  const handlePredictClick = async () => {
    try {
      await AsyncStorage.setItem('currentMatchMeta', JSON.stringify({
        homeName: homeTeam.name,
        awayName: awayTeam.name,
        homeLogo: homeTeam.logo,
        awayLogo: awayTeam.logo,
        leagueName: match.league.name
      }));
      router.push(`/prediction/${match.fixture.id}` as any);
    } catch (e) {
      console.log("Gagal menyimpan memori tim:", e);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.cardContent}>
        <Text style={styles.league}>{match.league.name}</Text>

        <View style={styles.matchContainer}>
          <View style={styles.team}>
            <Image source={{ uri: homeTeam.logo }} style={styles.logo} />
            <Text style={styles.teamName} numberOfLines={1}>{homeTeam.name}</Text>
          </View>

          <View style={styles.scoreContainer}>
            {/* TAMPILKAN ANIMASI JIKA LIVE, JIKA TIDAK TAMPILKAN TEKS BIASA */}
            {isLive ? (
              <AnimatedLive />
            ) : (
              <Text style={styles.timeText}>{displayStatus}</Text>
            )}
            
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>
                {homeScore !== null ? homeScore : '-'} : {awayScore !== null ? awayScore : '-'}
              </Text>
            </View>
          </View>

          <View style={styles.team}>
            <Image source={{ uri: awayTeam.logo }} style={styles.logo} />
            <Text style={styles.teamName} numberOfLines={1}>{awayTeam.name}</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          {isFinished ? (
            <TouchableOpacity 
              style={styles.statsBtn}
              activeOpacity={0.8}
              onPress={() => router.push(`/stats/${match.fixture.id}` as any)}
            >
              <Text style={styles.statsBtnText}>[ VIEW STATS ]</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.predictBtn}
              activeOpacity={0.8}
              // PERBAIKAN: Gunakan fungsi handlePredictClick di sini
              onPress={handlePredictClick}
            >
              {/* ELEMEN KILATAN CAHAYA (SHINE) */}
              <Animated.View style={[
                styles.shimmerBeam,
                { transform: [{ translateX: shimmerAnim }, { skewX: '-25deg' }, { scaleX: 1.5 }] }
              ]} />
              <Text style={styles.btnText}>PREDICT NOW</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { 
    marginBottom: 15, 
    borderRadius: 16, 
    borderLeftWidth: 3, 
    borderLeftColor: '#e10600', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    overflow: 'hidden', 
    backgroundColor: 'rgba(0, 0, 0, 0.15)' 
  },
  cardContent: { padding: 15 },
  league: { textAlign: 'center', fontSize: 10, color: '#e9bcb5', marginBottom: 15, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1 },
  matchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  team: { flex: 1, alignItems: 'center' },
  logo: { width: 45, height: 45, marginBottom: 8 },
  teamName: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: '#e2e2e2' },
  scoreContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  timeText: { fontSize: 12, color: '#ffb4aa', fontWeight: 'bold', marginBottom: 6 },
  scoreBox: { backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(225, 6, 0, 0.3)' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#e10600' },
  actionContainer: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center' },
  
  predictBtn: {
    backgroundColor: '#e10600',
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden', 
    position: 'relative',
    shadowColor: '#e10600',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8, 
  },
  btnText: { color: '#ffffff', fontWeight: '900', fontSize: 15, letterSpacing: 1.5, fontStyle: 'italic', zIndex: 2 },
  
  statsBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  statsBtnText: { color: '#e9bcb5', fontWeight: 'bold', fontSize: 13, letterSpacing: 2 },

  shimmerBeam: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 25, 
    backgroundColor: 'rgba(255, 255, 255, 0.35)', 
    zIndex: 1,
  }
});