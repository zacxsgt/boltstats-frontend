import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import MatchCard from '../../src/components/MatchCard'; 
import { API_URL } from '../../constants/api'; 
import { useTheme } from '../../src/context/ThemeContext';
import AnimatedBackground from '../../src/components/AnimatedBackground';

// === GABUNGAN ID LIGA KLUB & NEGARA ===
const TOP_LEAGUES = [39, 140, 135, 78, 88, 61, 94, 71, 253, 307];
const INT_LEAGUES = [1, 4, 9, 10, 11, 12]; 
const ALLOWED_IDS = [...TOP_LEAGUES, ...INT_LEAGUES];

export default function JadwalScreen() {
  const { colors } = useTheme();

  // 🔥 1. STATE UNTUK FILTER LIGA & INDIKATOR OFFLINE
  const [activeLeague, setActiveLeague] = useState<number | 'all'>('all');
  const [isOffline, setIsOffline] = useState(false);

  // 🔥 2. DAFTAR KAPSUL LIGA
  const LEAGUES: { id: number | 'all'; name: string }[] = [
    { id: 'all', name: 'Semua' },
    { id: 39, name: 'Premier League' },
    { id: 140, name: 'La Liga' },
    { id: 135, name: 'Serie A' },
    { id: 78, name: 'Bundesliga' },
    { id: 61, name: 'Ligue 1' },
    { id: 88, name: 'Eredivisie' },
    { id: 94, name: 'Liga Portugal' },
    { id: 71, name: 'Brasileirão' },
    { id: 253, name: 'MLS' },
    { id: 307, name: 'Saudi Pro' },
    { id: 1, name: 'Piala Dunia' }, 
    { id: 4, name: 'Euro' },
    { id: 9, name: 'Copa America' },
    { id: 10, name: 'Friendlies' },
    { id: 11, name: 'Kualifikasi' }, 
    { id: 12, name: 'Turnamen Int.' }, 
  ];

  // 🔥 3. FUNGSI FILTER LIGA
  const filterMatchesData = (matchesData: any[]) => {
    const now = new Date().getTime(); 
    return matchesData.filter((match: any) => {
      const leagueId = match?.league?.id;
      const status = match?.fixture?.status?.short;
      const matchDateStr = match?.fixture?.date;

      if (!leagueId || !ALLOWED_IDS.includes(leagueId)) return false;

      const isFinished = ['FT', 'AET', 'PEN'].includes(status);
      if (isFinished && matchDateStr) {
        const matchTime = new Date(matchDateStr).getTime();
        if (!isNaN(matchTime)) {
          const hoursSinceKickoff = (now - matchTime) / (1000 * 60 * 60);
          if (hoursSinceKickoff > 3) return false; 
        }
      }
      return true;
    });
  };

  // === IMPLEMENTASI REACT QUERY + ASYNC STORAGE ===
  const { 
    data: matches = [], 
    isLoading, 
    isError,
    error // Tambahan untuk memunculkan pesan error asli jika gagal
  } = useQuery({
    queryKey: ['matches', 'today'], 
    queryFn: async () => {
      try {
        // Baris simulasi error sudah saya hapus agar aplikasi bisa menarik data normal.
        // Tambahan timeout 10 detik agar tidak stuck loading.
        const response = await axios.get(`${API_URL}/api/matches/today`, { timeout: 10000 });
        const allMatches = response.data.data; 
        
        // Proteksi jika server Vercel merespon tapi datanya kosong/salah format
        if (!allMatches || !Array.isArray(allMatches)) {
            throw new Error("Data kosong atau format salah dari server");
        }

        // Simpan ke brankas
        await AsyncStorage.setItem('@boltstats_backup', JSON.stringify(allMatches));
        setIsOffline(false); 

        return filterMatchesData(allMatches);

      } catch (err) {
        console.log("Sinyal terputus atau server lambat! Membuka brankas cadangan...");
        setIsOffline(true); 

        const backupData = await AsyncStorage.getItem('@boltstats_backup');
        if (backupData) {
          const parsedData = JSON.parse(backupData);
          return filterMatchesData(parsedData); 
        }
        
        // Lempar error hanya jika internet mati DAN brankas benar-benar kosong
        throw new Error('Tidak ada koneksi dan brankas data cadangan masih kosong');
      }
    },
    staleTime: 1000 * 60 * 5, 
    retry: 1, 
  });

  // 🔥 4. PENYARINGAN DATA BERDASARKAN KAPSUL LIGA
  const filteredMatches = activeLeague === 'all' 
    ? matches 
    : matches.filter((match: any) => match?.league?.id === activeLeague);

  return (
    <SafeAreaView style={styles.root}>
      <AnimatedBackground />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerSubtitle}>LIVE & UPCOMING</Text>
          {isOffline && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineText}>⚡ MODE OFFLINE</Text>
            </View>
          )}
        </View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Jadwal Top Elite</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {LEAGUES.map((league) => {
            const isActive = activeLeague === league.id;
            return (
              <TouchableOpacity
                key={league.id}
                style={[styles.pillButton, isActive && styles.pillActive]}
                onPress={() => setActiveLeague(league.id)}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {league.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#e10600" />
          <Text style={[styles.loadingText, { color: colors.subText }]}>Menarik Data Liga...</Text>
        </View>
      ) : isError && matches.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={[styles.emptyText, { color: colors.text }]}>Gagal memuat data dari server.</Text>
          {/* Menampilkan pesan error spesifik agar lebih mudah dicek */}
          <Text style={{ color: colors.subText, fontSize: 12, marginTop: 8, textAlign: 'center', paddingHorizontal: 20 }}>
            {(error as Error)?.message}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMatches} 
          keyExtractor={(item: any) => item?.fixture?.id?.toString() || Math.random().toString()}
          renderItem={({ item }: { item: any }) => <MatchCard match={item} />} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.subText }]}>Tidak ada pertandingan aktif untuk turnamen ini.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 5, backgroundColor: 'transparent', borderBottomWidth: 0 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerSubtitle: { color: '#e10600', fontSize: 11, fontWeight: '900', fontStyle: 'italic', letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle: { fontSize: 28, fontWeight: '900', marginTop: 4, letterSpacing: 0.5 },
  
  offlineBadge: {
    backgroundColor: 'rgba(232, 64, 28, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(232, 64, 28, 0.5)',
  },
  offlineText: {
    color: '#e8401c',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  filterContainer: {
    marginVertical: 10,
    height: 40,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  pillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)', 
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: '#e8401c', 
    borderColor: '#e8401c',
  },
  pillText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },

  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, fontStyle: 'italic', paddingHorizontal: 20 }
});