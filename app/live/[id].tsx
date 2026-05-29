import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../constants/api';

// Kamus terjemahan statistik dari API-Sports ke Bahasa Indonesia
const statTranslator: any = {
  "Shots on Goal": "Tembakan ke arah gawang",
  "Total Shots": "Tembakan",
  "Ball Possession": "Penguasaan bola",
  "Fouls": "Pelanggaran",
  "Yellow Cards": "Kartu kuning",
  "Red Cards": "Kartu merah",
  "Offsides": "Offside",
  "Corner Kicks": "Tendangan sudut"
};

export default function LiveStatsScreen() {
  const { id, homeName, awayName, homeLogo, awayLogo } = useLocalSearchParams();
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/matches/stats/${id}`);
        setMatchData(response.data);
      } catch (err) {
        console.error("Gagal ambil stat:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStats();
  }, [id]);

  // Fungsi untuk merender satu baris statistik (kiri vs kanan)
  const renderStatRow = (statNameEn: string) => {
    if (!matchData || !matchData.statistics || matchData.statistics.length < 2) return null;

    const homeStats = matchData.statistics[0].statistics;
    const awayStats = matchData.statistics[1].statistics;

    const homeStatObj = homeStats.find((s: any) => s.type === statNameEn);
    const awayStatObj = awayStats.find((s: any) => s.type === statNameEn);

    if (!homeStatObj && !awayStatObj) return null; // Jika stat tidak ada di API

    let homeVal = homeStatObj?.value || 0;
    let awayVal = awayStatObj?.value || 0;
    
    const isPossession = statNameEn === "Ball Possession";
    
    // Parsing angka murni untuk perbandingan warna background (menghapus % jika ada)
    const homeNum = isPossession ? parseInt(String(homeVal).replace('%', '')) : Number(homeVal);
    const awayNum = isPossession ? parseInt(String(awayVal).replace('%', '')) : Number(awayVal);

    // Menentukan siapa yang lebih unggul untuk memberi background biru
    const homeBetter = homeNum > awayNum;
    const awayBetter = awayNum > homeNum;

    return (
      <View style={styles.statRow} key={statNameEn}>
        <View style={[styles.statValueBox, homeBetter && styles.statValueBoxHighlight]}>
          <Text style={styles.statValueText}>{homeVal}</Text>
        </View>
        <Text style={styles.statLabel}>{statTranslator[statNameEn] || statNameEn}</Text>
        <View style={[styles.statValueBox, awayBetter && styles.statValueBoxHighlight]}>
          <Text style={styles.statValueText}>{awayVal}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1c23" />
      
      {/* HEADER */}
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LIVE MATCH</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#4a9eff" /></View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* SCOREBOARD */}
          <View style={styles.scoreBoard}>
            <View style={styles.teamInfo}>
              <Image source={{ uri: homeLogo as string }} style={styles.logo} />
              <Text style={styles.teamNameText} numberOfLines={1}>{homeName}</Text>
            </View>
            <View style={styles.scoreCenter}>
              <Text style={styles.scoreText}>{matchData?.goals?.home ?? '-'} : {matchData?.goals?.away ?? '-'}</Text>
              <Text style={styles.minuteText}>{matchData?.fixture?.status?.elapsed}'</Text>
            </View>
            <View style={styles.teamInfo}>
              <Image source={{ uri: awayLogo as string }} style={styles.logo} />
              <Text style={styles.teamNameText} numberOfLines={1}>{awayName}</Text>
            </View>
          </View>

          {/* SECTION STATISTIK */}
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-half-outline" size={20} color="#4a9eff" />
            <Text style={styles.sectionTitle}>STATISTIK TIM</Text>
            <Ionicons name="shield-half-outline" size={20} color="#4a9eff" />
          </View>

          {/* === KODE BARU: CEK APAKAH DATA STATISTIK ADA DARI API === */}
          {matchData?.statistics && matchData.statistics.length > 0 ? (
            <View style={styles.statsContainer}>
              {renderStatRow("Total Shots")}
              {renderStatRow("Shots on Goal")}
              {renderStatRow("Ball Possession")}
              {renderStatRow("Fouls")}
              {renderStatRow("Yellow Cards")}
              {renderStatRow("Red Cards")}
              {renderStatRow("Offsides")}
              {renderStatRow("Corner Kicks")}
            </View>
          ) : (
            <View style={{ padding: 20, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
              <Ionicons name="hourglass-outline" size={30} color="#a0a5b1" style={{ marginBottom: 10 }} />
              <Text style={{ color: '#a0a5b1', fontStyle: 'italic', textAlign: 'center', fontSize: 13 }}>
                Data statistik belum tersedia dari lapangan. Menunggu pembaruan server...
              </Text>
            </View>
          )}

          {/* SECTION FORMASI (LINEUPS) */}
          {matchData?.lineups && matchData.lineups.length > 0 && (
            <View style={{marginTop: 30}}>
              <Text style={[styles.sectionTitle, {textAlign: 'center', marginBottom: 15}]}>FORMASI</Text>
              <View style={styles.formationRow}>
                <View style={styles.formationBox}>
                  <Text style={styles.formationTeam}>{homeName}</Text>
                  <Text style={styles.formationNum}>{matchData.lineups[0].formation}</Text>
                </View>
                <Text style={styles.formationVs}>VS</Text>
                <View style={styles.formationBox}>
                  <Text style={styles.formationTeam}>{awayName}</Text>
                  <Text style={styles.formationNum}>{matchData.lineups[1].formation}</Text>
                </View>
              </View>
            </View>
          )}

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1e2128' },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 60, backgroundColor: '#1a1c23' },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  
  scoreBoard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#262a34', padding: 20, borderRadius: 16, marginBottom: 30 },
  teamInfo: { flex: 1, alignItems: 'center' },
  logo: { width: 50, height: 50, resizeMode: 'contain', marginBottom: 10 },
  teamNameText: { color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  scoreCenter: { flex: 1, alignItems: 'center' },
  scoreText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  minuteText: { color: '#2ecc71', fontSize: 14, fontWeight: 'bold', marginTop: 5 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  sectionTitle: { color: '#a0a5b1', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  
  statsContainer: { gap: 15 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: '#e2e8f0', fontSize: 13, flex: 1, textAlign: 'center' },
  statValueBox: { backgroundColor: 'transparent', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, minWidth: 40, alignItems: 'center' },
  statValueBoxHighlight: { backgroundColor: '#3b82f6' }, // Warna biru saat unggul (seperti gambar)
  statValueText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  formationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#262a34', padding: 20, borderRadius: 16, marginBottom: 40 },
  formationBox: { flex: 1, alignItems: 'center' },
  formationTeam: { color: '#a0a5b1', fontSize: 10, marginBottom: 5 },
  formationNum: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  formationVs: { color: '#4a9eff', fontWeight: 'bold', marginHorizontal: 20 }
});