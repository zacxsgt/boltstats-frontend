import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AnimatedBackground from '../../src/components/AnimatedBackground'; // <-- IMPORT ANIMASI DITAMBAHKAN

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.root}>
      {/* === ANIMASI KOSMIK DITAMBAHKAN DI SINI === */}
      <AnimatedBackground />

      {/* === STATUS BAR DIBUAT TRANSPARAN === */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* === HEADER === */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoWrap}>
              <View style={styles.logoIcon}>
                <Ionicons name="flash" size={20} color="#fff" />
              </View>
              <Text style={styles.logoText}>BOLT<Text style={styles.logoTextHighlight}>STATS</Text></Text>
            </View>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color="#555" />
              <View style={styles.avatarOnline} />
            </View>
          </View>
          <Text style={styles.greeting}>Halo, <Text style={styles.greetingBold}>Boss!</Text> Siap prediksi hari ini?</Text>
          <Text style={styles.dateText}>Sabtu, 24 Mei 2026 · 8 liga aktif</Text>
        </View>

        {/* === HOT MATCHES BANNER === */}
        <View style={styles.hotBanner}>
          <View style={styles.hotBannerTopLine} />
          <View style={styles.hotTop}>
            <Text style={styles.hotTitle}>🔥 PERTANDINGAN PANAS</Text>
            <Text style={styles.hotCount}>12 match hari ini</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hotScroll}>
            {/* Hot Item 1 */}
            <TouchableOpacity style={styles.hotItem} activeOpacity={0.7}>
              <Text style={styles.hotLeague}>⚽ PREMIER LEAGUE</Text>
              <View style={styles.hotTeams}>
                <Text style={styles.hotTeamName}>Man City</Text>
                <Text style={styles.hotVs}>vs</Text>
                <Text style={styles.hotTeamName}>Arsenal</Text>
              </View>
              <View style={styles.hotOdds}>
                <View style={[styles.hotOdd, styles.hotOddHighlight]}>
                  <Text style={styles.hotOddLabel}>1</Text>
                  <Text style={[styles.hotOddVal, { color: '#e8401c' }]}>1.85</Text>
                </View>
                <View style={styles.hotOdd}>
                  <Text style={styles.hotOddLabel}>X</Text>
                  <Text style={styles.hotOddVal}>3.40</Text>
                </View>
                <View style={styles.hotOdd}>
                  <Text style={styles.hotOddLabel}>2</Text>
                  <Text style={styles.hotOddVal}>4.10</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Hot Item 2 */}
            <TouchableOpacity style={styles.hotItem} activeOpacity={0.7}>
              <Text style={styles.hotLeague}>🏆 LA LIGA</Text>
              <View style={styles.hotTeams}>
                <Text style={styles.hotTeamName}>Real Madrid</Text>
                <Text style={styles.hotVs}>vs</Text>
                <Text style={styles.hotTeamName}>Barcelona</Text>
              </View>
              <View style={styles.hotOdds}>
                <View style={styles.hotOdd}><Text style={styles.hotOddLabel}>1</Text><Text style={styles.hotOddVal}>2.20</Text></View>
                <View style={styles.hotOdd}><Text style={styles.hotOddLabel}>X</Text><Text style={styles.hotOddVal}>3.10</Text></View>
                <View style={[styles.hotOdd, styles.hotOddHighlight]}><Text style={styles.hotOddLabel}>2</Text><Text style={[styles.hotOddVal, { color: '#e8401c' }]}>3.25</Text></View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* === FEATURED MATCH === */}
        <Text style={styles.sectionTitle}>PREDIKSI UNGGULAN HARI INI</Text>
        <View style={styles.featured}>
          <View style={styles.featuredTop}>
            <Text style={styles.leagueTag}>⚽ PREMIER LEAGUE</Text>
            <View style={styles.hotBadge}><Text style={styles.hotBadgeText}>🔥 PANAS</Text></View>
          </View>
          
          <View style={styles.matchArea}>
            <View style={styles.teamBox}>
              <View style={[styles.teamLogo, styles.homeLogo]}><Text style={styles.homeLogoText}>MCI</Text></View>
              <Text style={styles.teamName}>Man City</Text>
              <Text style={styles.teamForm}>WDWWW</Text>
            </View>
            <View style={styles.vsArea}>
              <Text style={styles.vsText}>VS</Text>
              <Text style={styles.matchTime}>21:00</Text>
            </View>
            <View style={styles.teamBox}>
              <View style={[styles.teamLogo, styles.awayLogo]}><Text style={styles.awayLogoText}>ARS</Text></View>
              <Text style={styles.teamName}>Arsenal</Text>
              <Text style={styles.teamForm}>WWDLW</Text>
            </View>
          </View>

          <View style={styles.predBarArea}>
            <View style={styles.predLabels}>
              <Text style={styles.predLabelText}>Man City Menang</Text>
              <Text style={styles.predLabelText}>Seri</Text>
              <Text style={styles.predLabelText}>Arsenal Menang</Text>
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
              <Text style={styles.aiPickVal}>Man City Menang</Text>
            </View>
          </View>
        </View>

        {/* === QUICK PREDICTIONS === */}
        <Text style={styles.sectionTitle}>PREDIKSI CEPAT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
          <TouchableOpacity style={styles.predMini}>
            <Text style={styles.miniLeague}>LA LIGA</Text>
            <Text style={styles.miniTeams}>Real Madrid{'\n'}vs Barcelona</Text>
            <View style={[styles.miniBadge, { backgroundColor: 'rgba(74,158,255,0.15)' }]}><Text style={[styles.miniBadgeText, { color: '#4a9eff' }]}>Home Menang</Text></View>
            <Text style={styles.miniConf}><Text style={{ color: '#888', fontWeight: 'bold' }}>67%</Text> kepercayaan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.predMini}>
            <Text style={styles.miniLeague}>SERIE A</Text>
            <Text style={styles.miniTeams}>Juventus{'\n'}vs Inter</Text>
            <View style={[styles.miniBadge, { backgroundColor: 'rgba(136,136,136,0.15)' }]}><Text style={[styles.miniBadgeText, { color: '#888' }]}>Seri</Text></View>
            <Text style={styles.miniConf}><Text style={{ color: '#888', fontWeight: 'bold' }}>54%</Text> kepercayaan</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* === LIVE NOW === */}
        <Text style={styles.sectionTitle}>SEDANG BERLANGSUNG</Text>
        <View style={styles.liveCard}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveMatch}>Liverpool vs Chelsea</Text>
            <Text style={styles.liveScore}>2 - 1</Text>
            <Text style={styles.liveMin}>67'</Text>
          </View>
          <View style={[styles.liveRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.liveDot, { backgroundColor: '#e8401c' }]} />
            <Text style={styles.liveMatch}>Milan vs Napoli</Text>
            <Text style={styles.liveScore}>1 - 3</Text>
            <Text style={[styles.liveMin, { backgroundColor: 'rgba(232,64,28,0.1)', color: '#e8401c' }]}>FT</Text>
          </View>
        </View>

      </ScrollView>

      {/* === BOTTOM NAV === */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={22} color="#e8401c" />
          <Text style={[styles.navLabel, { color: '#e8401c' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={22} color="#444" />
          <Text style={styles.navLabel}>Jadwal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart-outline" size={22} color="#444" />
          <Text style={styles.navLabel}>Statistik</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="trophy-outline" size={22} color="#444" />
          <Text style={styles.navLabel}>Liga</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ROOT DIUBAH JADI TRANSPARAN
  root: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingBottom: 100 }, 
  
  // HEADER DIUBAH JADI TRANSPARAN, BORDER BAWAH DIHILANGKAN
  header: { padding: 20, paddingTop: 10, paddingBottom: 16, backgroundColor: 'transparent', borderBottomWidth: 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  logoWrap: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 38, height: 38, backgroundColor: '#e8401c', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#f5f5f5', letterSpacing: 1 },
  logoTextHighlight: { color: '#e8401c' },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: '#e8401c', backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  avatarOnline: { position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, backgroundColor: '#2ecc71', borderRadius: 5, borderWidth: 2, borderColor: '#000' },
  greeting: { fontSize: 15, color: '#aaa', marginTop: 10 },
  greetingBold: { color: '#fff', fontWeight: 'bold' },
  dateText: { fontSize: 12, color: '#888', marginTop: 2 },

  // SECTION TITLE
  sectionTitle: { fontSize: 12, fontWeight: 'bold', letterSpacing: 2.5, color: '#888', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },

  // HOT BANNER (Glassmorphism Effect)
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
  hotOdds: { flexDirection: 'row', gap: 4 },
  hotOdd: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 5, paddingVertical: 4, alignItems: 'center' },
  hotOddHighlight: { backgroundColor: 'rgba(232,64,28,0.15)', borderColor: 'rgba(232,64,28,0.3)', borderWidth: 1 },
  hotOddLabel: { fontSize: 9, color: '#888' },
  hotOddVal: { fontSize: 13, fontWeight: 'bold', color: '#fff' },

  // FEATURED MATCH (Glassmorphism Effect)
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

  // QUICK PREDS
  scrollRow: { paddingHorizontal: 16, gap: 10 },
  predMini: { width: 150, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', padding: 14, marginRight: 10 },
  miniLeague: { fontSize: 10, color: '#aaa', letterSpacing: 1, fontWeight: 'bold', marginBottom: 8 },
  miniTeams: { fontSize: 12, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  miniBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginBottom: 8 },
  miniBadgeText: { fontSize: 10, fontWeight: 'bold' },
  miniConf: { fontSize: 11, color: '#aaa' },

  // LIVE NOW
  liveCard: { marginHorizontal: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  liveRow: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  liveDot: { width: 7, height: 7, backgroundColor: '#2ecc71', borderRadius: 4, marginRight: 10 },
  liveMatch: { flex: 1, fontSize: 13, fontWeight: 'bold', color: '#fff' },
  liveScore: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginRight: 10 },
  liveMin: { fontSize: 11, color: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold' },

  // BOTTOM NAV (Blur/Transparan)
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(10,10,12,0.85)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', paddingVertical: 10, paddingBottom: 20 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 10, fontWeight: 'bold', color: '#666', marginTop: 4 }
});