import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur'; 
import axios from 'axios';
import { API_URL } from '../../constants/api';
import { useTheme } from '../../src/context/ThemeContext';
import AnimatedBackground from '../../src/components/AnimatedBackground'; 

const LEAGUES = [
  { id: 39, name: 'Premier League' },
  { id: 140, name: 'La Liga' },
  { id: 135, name: 'Serie A' },
  { id: 78, name: 'Bundesliga' },
  { id: 61, name: 'Ligue 1' },
  { id: 94, name: 'Primeira Liga' },
  { id: 88, name: 'Eredivisie' },
  { id: 71, name: 'Serie A (Brazil)' },
  { id: 253, name: 'MLS' },
  { id: 307, name: 'Saudi Pro League' }
];

const SEASONS = ['2025', '2024', '2023'];

export default function KlasemenScreen() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [selectedLeague, setSelectedLeague] = useState(39);
  const [selectedSeason, setSelectedSeason] = useState('2025');

  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    fetchStandings();
  }, [selectedLeague, selectedSeason]);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const response = await axios.get(`${API_URL}/api/standings/${selectedLeague}/${selectedSeason}`);
      
      const data = response.data.response[0]?.league?.standings[0];
      if (data) {
        setStandings(data);
      } else {
        setStandings([]);
        setErrorMsg('Data kosong dari API.');
      }
    } catch (err: any) {
      setStandings([]);
      setErrorMsg(err.response?.data?.error || "Gagal mengambil data klasemen.");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = (formString: string) => {
    if (!formString) return null;
    return (
      <View style={styles.formContainer}>
        {formString.split('').slice(0, 5).map((char, index) => {
          let bgColor = '#95a5a6'; // Draw (Abu-abu)
          if (char === 'W') bgColor = '#2ecc71'; // Win (Hijau)
          if (char === 'L') bgColor = '#e10600'; // Lose (Merah khas BoltStats)
          
          return (
            <View key={index} style={[styles.formBadge, { backgroundColor: bgColor }]}>
              <Text style={styles.formText}>{char}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}> 
      {/* BACKGROUND ANIMASI KOSMIK (Otomatis tembus ke paling atas) */}
      <AnimatedBackground />
      
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent={true} />
      
      {/* HEADER MELAYANG (Tanpa background solid & tanpa border bawah) */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Klasemen Liga</Text>
        
        {/* Scroll Pilihan Musim */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          <Text style={[styles.label, { color: colors.subText }]}>Musim:</Text>
          {SEASONS.map(year => (
            <TouchableOpacity 
              key={year} 
              style={[
                styles.pill, 
                // Jika aktif jadi merah murni, jika tidak jadi kaca buram
                selectedSeason === year ? styles.pillActive : styles.pillInactive
              ]}
              onPress={() => setSelectedSeason(year)}
            >
              <Text style={[
                styles.pillText, 
                { color: selectedSeason === year ? '#ffffff' : colors.subText }
              ]}>
                {year}/{parseInt(year)+1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Scroll Pilihan Liga */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {LEAGUES.map(league => (
            <TouchableOpacity 
              key={league.id} 
              style={[
                styles.pill, 
                selectedLeague === league.id ? styles.pillActive : styles.pillInactive
              ]}
              onPress={() => setSelectedLeague(league.id)}
            >
              <Text style={[
                styles.pillText, 
                { color: selectedLeague === league.id ? '#ffffff' : colors.subText }
              ]}>
                {league.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* TABEL KLASEMEN DENGAN EFEK KACA */}
      <View style={styles.tableContainer}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.tableHeader}>
          <Text style={[styles.colRank, styles.headerText, { color: colors.subText }]}>#</Text>
          <Text style={[styles.colClub, styles.headerText, { color: colors.subText }]}>Klub</Text>
          <Text style={[styles.colStat, styles.headerText, { color: colors.subText }]}>M</Text>
          <Text style={[styles.colStat, styles.headerText, { color: colors.subText }]}>SG</Text>
          <Text style={[styles.colPts, styles.headerText, { color: colors.subText }]}>Pts</Text>
          <Text style={[styles.colForm, styles.headerText, { color: colors.subText }]}>Form</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#e10600" style={{ marginTop: 50 }} />
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <FlatList
            data={standings}
            keyExtractor={(item) => item.team.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={[styles.colRank, { color: colors.text }]}>{item.rank}</Text>
                
                <View style={styles.colClub}>
                  <Image source={{ uri: item.team.logo }} style={styles.logo} />
                  <Text style={[styles.clubName, { color: colors.text }]} numberOfLines={1}>{item.team.name}</Text>
                </View>
                
                <Text style={[styles.colStat, { color: colors.subText }]}>{item.all.played}</Text>
                <Text style={[styles.colStat, { color: colors.subText }]}>{item.goalsDiff}</Text>
                <Text style={[styles.colPts, styles.ptsText]}>{item.points}</Text>
                
                <View style={styles.colForm}>
                  {renderForm(item.form)}
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'transparent'
  },
  
  // === HEADER SUPER CLEAN ===
  header: { 
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: 'transparent', // Menyatukan header dengan background
    borderBottomWidth: 0, // Garis pembatas dihapus
    zIndex: 10,
  },
  headerTitle: { 
    fontSize: 26, // Dibuat sedikit lebih besar & elegan
    fontWeight: '900', 
    marginBottom: 15, 
    letterSpacing: 1 
  },
  
  selectorScroll: { flexDirection: 'row', marginBottom: 12 },
  label: { alignSelf: 'center', marginRight: 10, fontSize: 14, fontWeight: 'bold' },
  
  // === STYLE TOMBOL PILL BARU (Glassmorphism) ===
  pill: { 
    paddingHorizontal: 18, 
    paddingVertical: 8, 
    borderRadius: 25, // Dibuat lebih bulat kekinian
    marginRight: 10, 
    borderWidth: 1 
  },
  pillActive: {
    backgroundColor: '#e10600',
    borderColor: '#e10600',
    shadowColor: '#e10600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  pillInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Kaca buram tipis
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillText: { fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },
  
  // === TABEL CLEAN ===
  tableContainer: { 
    flex: 1, 
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // Warna dasar sangat tipis
  },
  tableHeader: { 
    flexDirection: 'row', 
    paddingVertical: 14, 
    paddingHorizontal: 10, 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Transparan
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  headerText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 14, 
    paddingHorizontal: 10, 
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)' // Garis antar baris sangat tipis
  },
  
  colRank: { width: 25, fontSize: 13, textAlign: 'center', fontWeight: 'bold' },
  colClub: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 5 },
  colStat: { width: 30, fontSize: 13, textAlign: 'center', fontWeight: '500' },
  colPts: { width: 35, fontSize: 15, textAlign: 'center' },
  colForm: { width: 70, alignItems: 'center' },
  
  logo: { width: 24, height: 24, marginRight: 10 },
  clubName: { fontSize: 14, flexShrink: 1, fontWeight: '700' },
  ptsText: { fontWeight: '900', color: '#e10600' },
  
  formContainer: { flexDirection: 'row', gap: 3 },
  formBadge: { width: 14, height: 14, borderRadius: 3, justifyContent: 'center', alignItems: 'center' },
  formText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  errorText: { color: '#e10600', textAlign: 'center', marginTop: 50, fontStyle: 'italic', fontWeight: 'bold' }
});