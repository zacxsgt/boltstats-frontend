import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView, StatusBar, Platform, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../constants/api'; // <--- Import terpusat

export default function StatsScreen() {
  const { id } = useLocalSearchParams();
  const [stats, setStats] = useState<any>(null);
  const [lineups, setLineups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchStats();
  }, [id]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Menggunakan API_URL yang konsisten
      const response = await axios.get(`${API_URL}/api/matches/${id}`);
      const matchData = response.data.response[0];
      setStats(matchData.statistics);
      setLineups(matchData.lineups);
    } catch (error) {
      console.error("Gagal memuat data statistik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#e8401c" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0f" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        <Text style={styles.title}>Analisis Taktis</Text>

        {/* --- BAGIAN STATISTIK --- */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Statistik Pertandingan</Text>
          {stats && stats.length > 0 ? (
            stats[0].statistics.map((item: any, index: number) => (
              <View key={index} style={styles.statRow}>
                <Text style={styles.statLabel}>{item.type}</Text>
                <Text style={styles.statValue}>{item.value || 0}</Text>
              </View>
            ))
          ) : <Text style={styles.noData}>Statistik tidak tersedia.</Text>}
        </View>

        {/* --- BAGIAN FORMASI (LINEUP) --- */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Formasi Pemain</Text>
          {lineups.map((team, index) => (
            <View key={index} style={styles.lineupCard}>
              <View style={styles.teamHeader}>
                <Image source={{ uri: team.team.logo }} style={styles.teamLogo} />
                <Text style={styles.teamTitle}>{team.team.name} ({team.formation})</Text>
              </View>
              {team.startXI.map((p: any, pIndex: number) => (
                <Text key={pIndex} style={styles.playerText}>
                  {p.player.number}. {p.player.name} <Text style={{color:'#666'}}>({p.player.pos})</Text>
                </Text>
              ))}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0d0d0f',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0d0f' },
  scroll: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  card: { backgroundColor: '#161618', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#1e1e22', marginBottom: 20 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#e8401c', marginBottom: 15, letterSpacing: 1 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e1e22' },
  statLabel: { color: '#888', fontSize: 13 },
  statValue: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  lineupCard: { marginBottom: 20 },
  teamHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  teamLogo: { width: 30, height: 30, marginRight: 10 },
  teamTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  playerText: { color: '#ccc', fontSize: 13, marginVertical: 2, paddingLeft: 40 },
  noData: { color: '#555', textAlign: 'center', marginTop: 10 }
});