import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Image, RefreshControl, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, router } from 'expo-router'; 
import { API_URL } from '../../constants/api';
import AnimatedBackground from '../../src/components/AnimatedBackground'; 

// === GABUNGAN ID LIGA KLUB & NEGARA ===
const TOP_LEAGUES = [39, 140, 135, 78, 88, 61, 94, 71, 253, 307];
const INT_LEAGUES = [1, 4, 9, 10, 11, 12]; 
const ALLOWED_IDS = [...TOP_LEAGUES, ...INT_LEAGUES]; 

export default function HomeScreen() {
  const [userName, setUserName] = useState('Boss');
  const [userPhoto, setUserPhoto] = useState<string | null>(null); 
  const [hotMatches, setHotMatches] = useState<any[]>([]);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [featuredMatch, setFeaturedMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // === 1. LOAD NAMA USER & FOTO PROFIL ===
  const loadUserData = async () => {
    try {
      const savedName = await AsyncStorage.getItem('userName');
      if (savedName) setUserName(savedName);

      // --- PERBAIKAN FOTO PROFIL (SISTEM PELACAK & ANTI-CACHE) ---
      // Kita coba cari semua kemungkinan nama kunci yang biasa Anda pakai di profil.tsx
      let savedPhoto = await AsyncStorage.getItem('userPhoto');
      if (!savedPhoto) savedPhoto = await AsyncStorage.getItem('profileImage');
      if (!savedPhoto) savedPhoto = await AsyncStorage.getItem('profilePic');
      if (!savedPhoto) savedPhoto = await AsyncStorage.getItem('avatar');
      if (!savedPhoto) savedPhoto = await AsyncStorage.getItem('profilePhoto');

      if (savedPhoto) {
        // Trik Anti-Cache: Memaksa React Native merefresh gambar jika URI-nya dari file lokal
        if (!savedPhoto.startsWith('data:image')) {
          setUserPhoto(`${savedPhoto.split('?')[0]}?t=${new Date().getTime()}`);
        } else {
          setUserPhoto(savedPhoto);
        }
      }

    } catch (error) { console.log("Gagal load user data:", error); }
  };

  useFocusEffect(useCallback(() => { loadUserData(); }, []));

  // === 2. FETCH DATA API ===
  useEffect(() => {
    fetchTodayData();
    const timer = setInterval(fetchTodayData, 180000); 
    return () => clearInterval(timer);
  }, []);

  const fetchTodayData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/matches/today`);
      const allMatches = response.data.data;

      if (allMatches && allMatches.length > 0) {
        const live = allMatches.filter((m: any) => 
          ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(m.fixture.status.short) &&
          ALLOWED_IDS.includes(m.league.id) 
        );
        setLiveMatches(live);

        const upcoming = allMatches.filter((m: any) => 
          ['NS', 'TBD'].includes(m.fixture.status.short) &&
          ALLOWED_IDS.includes(m.league.id)
        );

        setHotMatches(upcoming.slice(0, 8));
        setFeaturedMatch(upcoming.length > 0 ? upcoming[0] : null);
      }
    } catch (error) {
      console.error("Gagal mengambil data Home:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodayData();
    setRefreshing(false);
  };

  // === 3. NAVIGASI ===
  const handleMatchClick = async (matchData: any) => {
    try {
      await AsyncStorage.setItem('currentMatchMeta', JSON.stringify({
        homeName: matchData.teams.home.name,
        awayName: matchData.teams.away.name,
        homeLogo: matchData.teams.home.logo,
        awayLogo: matchData.teams.away.logo,
        leagueName: matchData.league.name
      }));
      router.push(`/prediction/${matchData.fixture.id}` as any);
    } catch (e) { console.log("Gagal Navigasi Prediksi:", e); }
  };

  const handleLiveMatchClick = async (matchData: any) => {
    try {
      await AsyncStorage.setItem('currentMatchMeta', JSON.stringify({
        homeName: matchData.teams.home.name,
        awayName: matchData.teams.away.name,
        homeLogo: matchData.teams.home.logo,
        awayLogo: matchData.teams.away.logo,
        leagueName: matchData.league.name
      }));
      router.push(`/live/${matchData.fixture.id}` as any);
    } catch (e) { console.log("Gagal Navigasi Live:", e); }
  };

  const todayDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={styles.root}>
      <AnimatedBackground />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e8401c" />}
      >
        
        {/* === HEADER === */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoWrap}>
              
              {/* PERBAIKAN LOGO: Kotak Oren Dihapus, Murni Logo Anda Saja */}
              <Image 
                source={require('../../assets/images/logo_apk.png')} 
                style={styles.mainLogo} 
              />
              
              <Text style={styles.logoText}>BOLT<Text style={styles.logoTextHighlight}>STATS</Text></Text>
            </View>
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profil')}>
              
              {/* Menampilkan Foto Profil */}
              {userPhoto ? (
                <Image 
                  source={{ uri: userPhoto }} 
                  style={{ width: '100%', height: '100%', borderRadius: 21, resizeMode: 'cover' }} 
                />
              ) : (
                <Ionicons name="person" size={20} color="#555" />
              )}
              
              <View style={styles.avatarOnline} />
            </TouchableOpacity>
          </View>
          <Text style={styles.greeting}>Halo, <Text style={styles.greetingBold}>{userName}!</Text> Siap prediksi hari ini?</Text>
          <Text style={styles.dateText}>{todayDate} · {hotMatches.length} Laga Mendatang</Text>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#e8401c" style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* === HOT MATCHES BANNER === */}
            {hotMatches.length > 0 && (
              <View style={styles.hotBanner}>
                <View style={styles.hotBannerTopLine} />
                <View style={styles.hotTop}>
                  <Text style={styles.hotTitle}>🔥 PERTANDINGAN PANAS</Text>
                  <Text style={styles.hotCount}>{hotMatches.length} match hari ini</Text>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hotScroll}>
                  {hotMatches.map((match, index) => (
                    <TouchableOpacity key={index} style={styles.hotItem} activeOpacity={0.7} onPress={() => handleMatchClick(match)}>
                      <Text style={styles.hotLeague} numberOfLines={1}>
                        {INT_LEAGUES.includes(match.league.id) ? '🌍 INTL' : `🏆 ${match.league.name}`}
                      </Text>
                      <View style={styles.hotTeams}>
                        <Text style={styles.hotTeamName} numberOfLines={1}>{match.teams.home.name}</Text>
                        <Text style={styles.hotVs}>vs</Text>
                        <Text style={styles.hotTeamName} numberOfLines={1}>{match.teams.away.name}</Text>
                      </View>
                      
                      <View style={styles.kickoffBlock}>
                        <Text style={styles.hotOddLabel}>WAKTU KICK-OFF</Text>
                        <Text style={[styles.hotOddVal, { color: '#e8401c' }]}>
                          {new Date(match.fixture.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* === FEATURED MATCH === */}
            {featuredMatch && (
              <>
                <Text style={styles.sectionTitle}>PREDIKSI UNGGULAN HARI INI</Text>
                <TouchableOpacity style={styles.featured} activeOpacity={0.9} onPress={() => handleMatchClick(featuredMatch)}>
                  <View style={styles.featuredTop}>
                    <Text style={styles.leagueTag}>⚽ {featuredMatch.league.name.toUpperCase()}</Text>
                    <View style={styles.hotBadge}><Text style={styles.hotBadgeText}>🔥 PANAS</Text></View>
                  </View>
                  
                  <View style={styles.matchArea}>
                    <View style={styles.teamBox}>
                      {featuredMatch.teams.home.logo ? (
                        <Image source={{ uri: featuredMatch.teams.home.logo }} style={styles.teamLogo} />
                      ) : (
                        <View style={[styles.teamLogo, styles.homeLogo]}><Text style={styles.homeLogoText}>H</Text></View>
                      )}
                      <Text style={styles.teamName} numberOfLines={1}>{featuredMatch.teams.home.name}</Text>
                    </View>
                    <View style={styles.vsArea}>
                      <Text style={styles.vsText}>VS</Text>
                      <Text style={styles.matchTime}>{new Date(featuredMatch.fixture.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                    </View>
                    <View style={styles.teamBox}>
                      {featuredMatch.teams.away.logo ? (
                        <Image source={{ uri: featuredMatch.teams.away.logo }} style={styles.teamLogo} />
                      ) : (
                        <View style={[styles.teamLogo, styles.awayLogo]}><Text style={styles.awayLogoText}>A</Text></View>
                      )}
                      <Text style={styles.teamName} numberOfLines={1}>{featuredMatch.teams.away.name}</Text>
                    </View>
                  </View>

                  <View style={styles.predBarArea}>
                    <View style={styles.predLabels}>
                      <Text style={styles.predLabelText}>{featuredMatch.teams.home.name} Menang</Text>
                      <Text style={styles.predLabelText}>Seri</Text>
                      <Text style={styles.predLabelText}>{featuredMatch.teams.away.name} Menang</Text>
                    </View>
                    <View style={styles.predTrack}>
                      <View style={[styles.predH, { width: '52%' }]} />
                      <View style={[styles.predD, { width: '22%' }]} />
                      <View style={[styles.predA, { width: '26%' }]} />
                    </View>
                    <View style={styles.predNums}>
                      <Text style={styles.predHVal}>52%</Text>
                      <Text style={styles.predDVal}>22%</Text>
                      <Text style={styles.predAVal}>26%</Text>
                    </View>
                    <View style={styles.aiPick}>
                      <View>
                        <Text style={styles.aiPickTitle}>Prediksi AI</Text>
                        <Text style={styles.aiPickSub}>Kepercayaan: Tinggi</Text>
                      </View>
                      <Text style={styles.aiPickVal}>{featuredMatch.teams.home.name} Menang</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* === QUICK PREDICTIONS === */}
            {hotMatches.length > 1 && (
              <>
                <Text style={styles.sectionTitle}>PREDIKSI CEPAT</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
                  {hotMatches.slice(1, 5).map((match, idx) => (
                    <TouchableOpacity key={idx} style={styles.predMini} onPress={() => handleMatchClick(match)}>
                      <Text style={styles.miniLeague} numberOfLines={1}>{match.league.name}</Text>
                      <Text style={styles.miniTeams} numberOfLines={2}>{match.teams.home.name}{'\n'}vs {match.teams.away.name}</Text>
                      <View style={[styles.miniBadge, { backgroundColor: 'rgba(74,158,255,0.15)' }]}>
                        <Text style={[styles.miniBadgeText, { color: '#4a9eff' }]}>Cek AI Prediksi</Text>
                      </View>
                      <Text style={styles.miniConf}><Text style={{ color: '#888', fontWeight: 'bold' }}>Analisa</Text> tersedia</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {/* === LIVE NOW === */}
            <Text style={styles.sectionTitle}>SEDANG BERLANGSUNG</Text>
            <View style={styles.liveCard}>
              {liveMatches.length > 0 ? (
                liveMatches.map((match, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.liveRow, { borderBottomWidth: index === liveMatches.length - 1 ? 0 : 1 }]}
                    onPress={() => handleLiveMatchClick(match)}
                  >
                    <View style={[styles.liveDot, { backgroundColor: '#e8401c' }]} />
                    <Text style={styles.liveMatch} numberOfLines={1}>{match.teams.home.name} vs {match.teams.away.name}</Text>
                    <Text style={styles.liveScore}>{match.goals.home} - {match.goals.away}</Text>
                    <Text style={[styles.liveMin, { backgroundColor: 'rgba(232,64,28,0.1)', color: '#e8401c' }]}>{match.fixture.status.elapsed}'</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: '#666', padding: 20, fontStyle: 'italic' }}>Tidak ada pertandingan live saat ini.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingBottom: 30 }, 
  
  header: { 
    padding: 20, 
    paddingTop: Platform.OS === 'android' ? 45 : 20, 
    paddingBottom: 16, 
    backgroundColor: 'transparent', 
    borderBottomWidth: 0 
  },
  
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  logoWrap: { flexDirection: 'row', alignItems: 'center' },
  
  // === STYLE LOGO BARU (Tanpa Background Oren) ===
  mainLogo: { width: 44, height: 44, resizeMode: 'contain', marginRight: 10 },
  
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#f5f5f5', letterSpacing: 1 },
  logoTextHighlight: { color: '#e8401c' },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: '#e8401c', backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  avatarOnline: { position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, backgroundColor: '#2ecc71', borderRadius: 6, borderWidth: 2, borderColor: '#121414', zIndex: 10 },
  greeting: { fontSize: 15, color: '#aaa', marginTop: 10 },
  greetingBold: { color: '#fff', fontWeight: 'bold' },
  dateText: { fontSize: 12, color: '#888', marginTop: 2 },

  sectionTitle: { fontSize: 12, fontWeight: 'bold', letterSpacing: 2.5, color: '#888', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },

  hotBanner: { marginHorizontal: 16, marginTop: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
  hotBannerTopLine: { height: 3, backgroundColor: '#e8401c', width: '100%' },
  hotTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, paddingHorizontal: 16 },
  hotTitle: { fontSize: 12, fontWeight: 'bold', color: '#e8401c', letterSpacing: 1.5 },
  hotCount: { fontSize: 11, color: '#888' },
  hotScroll: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  hotItem: { width: 170, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginRight: 10 },
  hotLeague: { fontSize: 10, color: '#888', letterSpacing: 1, marginBottom: 8, fontWeight: 'bold' },
  hotTeams: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  hotTeamName: { fontSize: 12, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' },
  hotVs: { fontSize: 10, color: '#666', paddingHorizontal: 4 },
  
  kickoffBlock: { 
    backgroundColor: 'rgba(232,64,28,0.15)', 
    borderColor: 'rgba(232,64,28,0.3)', 
    borderWidth: 1, 
    borderRadius: 5, 
    paddingVertical: 8, 
    alignItems: 'center',
    marginTop: 5
  },
  hotOddLabel: { fontSize: 9, color: '#888', marginBottom: 2 },
  hotOddVal: { fontSize: 14, fontWeight: 'bold' },

  featured: { marginHorizontal: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
  featuredTop: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  leagueTag: { fontSize: 10, fontWeight: 'bold', color: '#e8401c', letterSpacing: 1.5 },
  hotBadge: { backgroundColor: '#e8401c', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  hotBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  matchArea: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  teamBox: { flex: 1, alignItems: 'center' },
  teamLogo: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  homeLogo: { backgroundColor: 'rgba(74,158,255,0.1)', borderColor: 'rgba(74,158,255,0.3)' },
  homeLogoText: { color: '#4a9eff', fontSize: 13, fontWeight: 'bold' },
  awayLogo: { backgroundColor: 'rgba(255,107,53,0.1)', borderColor: 'rgba(255,107,53,0.3)' },
  awayLogoText: { color: '#ff6b35', fontSize: 13, fontWeight: 'bold' },
  teamName: { fontSize: 13, fontWeight: 'bold', color: '#fff' },
  teamForm: { fontSize: 11, color: '#aaa', marginTop: 3 },
  vsArea: { alignItems: 'center', width: 60 },
  vsText: { fontSize: 11, fontWeight: 'bold', color: '#888', letterSpacing: 1 },
  matchTime: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  
  predBarArea: { paddingHorizontal: 16, paddingBottom: 16 },
  predLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  predLabelText: { fontSize: 11, color: '#aaa' },
  predTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, flexDirection: 'row', overflow: 'hidden' },
  predH: { backgroundColor: '#4a9eff' },
  predD: { backgroundColor: '#888' },
  predA: { backgroundColor: '#e8401c' },
  predNums: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  predHVal: { fontSize: 12, fontWeight: 'bold', color: '#4a9eff' },
  predDVal: { fontSize: 12, fontWeight: 'bold', color: '#888' },
  predAVal: { fontSize: 12, fontWeight: 'bold', color: '#e8401c' },
  
  aiPick: { marginTop: 10, backgroundColor: 'rgba(74,158,255,0.1)', borderWidth: 1, borderColor: 'rgba(74,158,255,0.2)', borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aiPickTitle: { fontWeight: 'bold', color: '#fff', fontSize: 13 },
  aiPickSub: { fontSize: 11, color: '#aaa' },
  aiPickVal: { fontSize: 15, fontWeight: 'bold', color: '#4a9eff' },

  scrollRow: { paddingHorizontal: 16, gap: 10 },
  predMini: { width: 150, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', padding: 14, marginRight: 10 },
  miniLeague: { fontSize: 10, color: '#aaa', letterSpacing: 1, fontWeight: 'bold', marginBottom: 8 },
  miniTeams: { fontSize: 12, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  miniBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginBottom: 8 },
  miniBadgeText: { fontSize: 10, fontWeight: 'bold' },
  miniConf: { fontSize: 11, color: '#aaa' },

  liveCard: { marginHorizontal: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  liveRow: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  liveDot: { width: 7, height: 7, backgroundColor: '#e8401c', borderRadius: 4, marginRight: 10 },
  liveMatch: { flex: 1, fontSize: 13, fontWeight: 'bold', color: '#fff' },
  liveScore: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginRight: 10 },
  liveMin: { fontSize: 11, color: '#e8401c', backgroundColor: 'rgba(232,64,28,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold' }
});