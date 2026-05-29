import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../constants/api'; // <--- Import terpusat

export default function MatchDetailScreen({ matchId }: { matchId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getPrediction();
  }, [matchId]);

  const getPrediction = async () => {
    try {
      setLoading(true);
      // Menggunakan API_URL yang konsisten
      const response = await axios.get(`${API_URL}/api/prediction/${matchId}`);
      setData(response.data);
    } catch (error) {
      console.error("Gagal ambil prediksi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a1a1a" />
        <Text style={styles.loadingText}>Gemini AI sedang menganalisis taktik...</Text>
      </View>
    );
  }

  const pred = data?.prediction;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Navigasi */}
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Boltstats AI Analysis</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Info Pertandingan Utama */}
      <View style={styles.matchHeader}>
        <Text style={styles.matchTitle}>{data?.match.home} vs {data?.match.away}</Text>
        <View style={styles.predictionBadge}>
          <Text style={styles.predictionScoreText}>Prediksi Skor: {pred?.prediksi_skor.skor_akhir}</Text>
        </View>
      </View>

      {/* Section 1: Tinjauan Tim */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Tinjauan Kondisi</Text>
        <View style={styles.row}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamLabel}>Home</Text>
            <Text style={styles.teamDesc}>{pred?.tinjauan_singkat.home}</Text>
          </View>
          <View style={styles.teamInfo}>
            <Text style={styles.teamLabel}>Away</Text>
            <Text style={styles.teamDesc}>{pred?.tinjauan_singkat.away}</Text>
          </View>
        </View>
      </View>

      {/* Section 2: Analisis Taktik */}
      <View style={[styles.sectionCard, { backgroundColor: '#1a1a1a' }]}>
        <Text style={[styles.sectionTitle, { color: '#fff' }]}>Analisis Taktik</Text>
        <Text style={styles.tacticText}><Text style={{fontWeight:'bold', color: '#00ff88'}}>Home:</Text> {pred?.analisis_taktik.home_taktik}</Text>
        <Text style={styles.tacticText}><Text style={{fontWeight:'bold', color: '#00ff88'}}>Away:</Text> {pred?.analisis_taktik.away_taktik}</Text>
        <View style={styles.keyFactorBox}>
           <Text style={styles.keyFactorTitle}>Kunci Pertandingan</Text>
           <Text style={styles.keyFactorText}>{pred?.analisis_taktik.kunci_pertandingan}</Text>
        </View>
      </View>

      {/* Section 3: Pasar & Rekomendasi */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Rekomendasi Pasar</Text>
        
        <View style={styles.marketItem}>
          <Text style={styles.marketLabel}>Handicap</Text>
          <Text style={styles.marketSaran}>{pred?.rekomendasi_pasar.handicap.saran}</Text>
        </View>

        <View style={styles.marketItem}>
          <Text style={styles.marketLabel}>Total Gol (O/U)</Text>
          <Text style={styles.marketSaran}>{pred?.rekomendasi_pasar.over_under_gol.saran}</Text>
        </View>

        <View style={styles.marketItem}>
          <Text style={styles.marketLabel}>BTTS (Kedua Tim Cetak Gol)</Text>
          <Text style={styles.marketSaran}>{pred?.prediksi_btts.kedua_tim_cetak_gol}</Text>
        </View>
      </View>

      {/* Section 4: Kesimpulan AI */}
      <View style={styles.conclusionCard}>
        <Ionicons name="bulb" size={24} color="#e67e22" />
        <Text style={styles.conclusionText}>{pred?.kesimpulan.ringkasan}</Text>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 15, color: '#666', fontSize: 14 },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  matchHeader: { padding: 30, alignItems: 'center' },
  matchTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' },
  predictionBadge: { backgroundColor: '#e67e22', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginTop: 15 },
  predictionScoreText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 15, padding: 20, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1a1a1a' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  teamInfo: { width: '48%' },
  teamLabel: { fontSize: 14, fontWeight: 'bold', color: '#e67e22', marginBottom: 5 },
  teamDesc: { fontSize: 12, color: '#555', lineHeight: 18 },
  tacticText: { color: '#ddd', fontSize: 13, lineHeight: 20, marginBottom: 10 },
  keyFactorBox: { backgroundColor: '#333', padding: 15, borderRadius: 10, marginTop: 10 },
  keyFactorTitle: { color: '#00ff88', fontWeight: 'bold', fontSize: 14, marginBottom: 5 },
  keyFactorText: { color: '#fff', fontSize: 12, lineHeight: 18 },
  marketItem: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 12 },
  marketLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  marketSaran: { fontSize: 15, fontWeight: 'bold', color: '#2c3e50' },
  conclusionCard: { backgroundColor: '#fffbe6', marginHorizontal: 20, padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'flex-start', borderLeftWidth: 5, borderLeftColor: '#e67e22' },
  conclusionText: { flex: 1, marginLeft: 10, fontSize: 14, color: '#8a6d3b', lineHeight: 22, fontStyle: 'italic' }
});