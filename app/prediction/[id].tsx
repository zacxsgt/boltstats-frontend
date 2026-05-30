import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Rect, Line } from 'react-native-svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../constants/api';

const GlassCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.glassCard, style]}>{children}</View>
);

export default function PredictionScreen() {
  const { id } = useLocalSearchParams();
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>({});

  useEffect(() => {
    if (!id) return;
    let isMounted = true; 

    const loadData = async () => {
      setLoading(true);
      setPrediction(null);
      setError(null);
      setMeta({});

      try {
        const savedMeta = await AsyncStorage.getItem('currentMatchMeta');
        if (savedMeta && isMounted) {
          setMeta(JSON.parse(savedMeta));
        }

        const response = await axios.get(`${API_URL}/api/prediction/${id}`);
        if (isMounted) {
          setPrediction(response.data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response ? `Server Error: ${err.response.status}` : `Network Error: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const getShortName = (name: any) => name ? String(name).substring(0, 3).toUpperCase() : 'TBD';

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#121414" />
      
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#e10600" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DEEP TACTICAL</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#e10600" />
          <Text style={styles.loadingText}>Menganalisis Taktik AI...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>
      ) : prediction ? (
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <GlassCard style={styles.heroCard}>
            <View style={styles.heroTop}><Text style={styles.leagueTag}>{meta.leagueName || 'MATCH PREVIEW'}</Text></View>
            <Text style={styles.matchTitle}>
              {String(meta.homeName || 'HOME').toUpperCase()} <Text style={styles.vsText}>V</Text> {String(meta.awayName || 'AWAY').toUpperCase()}
            </Text>
            
            <View style={styles.logoRow}>
              {meta.homeLogo ? (
                <Image source={{ uri: meta.homeLogo }} style={styles.teamLogo} />
              ) : (
                <View style={styles.fallbackLogo}><Text style={styles.fallbackText}>{getShortName(meta.homeName)}</Text></View>
              )}
              <Text style={styles.vsTextSmall}>VS</Text>
              {meta.awayLogo ? (
                <Image source={{ uri: meta.awayLogo }} style={styles.teamLogo} />
              ) : (
                <View style={styles.fallbackLogo}><Text style={styles.fallbackText}>{getShortName(meta.awayName)}</Text></View>
              )}
            </View>
          </GlassCard>

          <GlassCard style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>TINJAUAN SINGKAT</Text>
            <View style={styles.tinjauanItem}>
              <View style={styles.tinjauanHeader}>
                <View style={[styles.indicator, { backgroundColor: '#e10600' }]} />
                <Text style={styles.teamNameLabel}>{meta.homeName || 'Tim Tuan Rumah'}</Text>
              </View>
              <Text style={styles.bodyText}>{prediction.tinjauan_singkat?.home}</Text>
            </View>
            <View style={[styles.tinjauanItem, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 }]}>
              <View style={styles.tinjauanHeader}>
                <View style={[styles.indicator, { backgroundColor: '#717070' }]} />
                <Text style={styles.teamNameLabel}>{meta.awayName || 'Tim Tamu'}</Text>
              </View>
              <Text style={styles.bodyText}>{prediction.tinjauan_singkat?.away}</Text>
            </View>
          </GlassCard>

          <GlassCard style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <Ionicons name="analytics" size={18} color="#e10600" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>ANALISIS TAKTIK & SKEMA</Text>
            </View>

            <View style={styles.formationBox}>
              <Text style={styles.formationLabel}>PREDIKSI FORMASI</Text>
              <View style={styles.formationRow}>
                <Text style={styles.formationText}>{prediction.analisis_taktik?.formasi_home || '4-3-3'}</Text>
                <Text style={styles.formationVs}>vs</Text>
                <Text style={styles.formationText}>{prediction.analisis_taktik?.formasi_away || '4-2-3-1'}</Text>
              </View>
            </View>

            <View style={styles.pitchContainer}>
              <Svg height="140" width="100%" viewBox="0 0 300 140">
                <Rect x="0" y="0" width="300" height="140" fill="#1b2a1a" rx="8" />
                <Line x1="150" y1="0" x2="150" y2="140" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <Circle cx="150" cy="70" r="30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                <Rect x="0" y="30" width="45" height="80" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                <Rect x="255" y="30" width="45" height="80" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                <Circle cx="20" cy="70" r="6" fill="#e10600" />
                <Circle cx="50" cy="30" r="6" fill="#e10600" />
                <Circle cx="50" cy="70" r="6" fill="#e10600" />
                <Circle cx="50" cy="110" r="6" fill="#e10600" />
                <Circle cx="90" cy="50" r="6" fill="#e10600" />
                <Circle cx="90" cy="90" r="6" fill="#e10600" />
                <Circle cx="280" cy="70" r="6" fill="#e2e2e2" />
                <Circle cx="250" cy="30" r="6" fill="#e2e2e2" />
                <Circle cx="250" cy="70" r="6" fill="#e2e2e2" />
                <Circle cx="250" cy="110" r="6" fill="#e2e2e2" />
                <Circle cx="210" cy="50" r="6" fill="#e2e2e2" />
                <Circle cx="210" cy="90" r="6" fill="#e2e2e2" />
              </Svg>
            </View>

            <Text style={[styles.bodyText, {marginBottom: 10}]}><Text style={{fontWeight: 'bold', color: '#e2e2e2'}}>Skema Permainan:</Text> {prediction.analisis_taktik?.skema_permainan}</Text>
            <Text style={styles.bodyText}><Text style={{fontWeight: 'bold', color: '#e2e2e2'}}>Faktor Kunci:</Text> {prediction.analisis_taktik?.kunci_pertandingan}</Text>
          </GlassCard>

          <View style={styles.gridContainer}>
            <GlassCard style={[styles.gridBox, { borderBottomColor: '#e10600', borderBottomWidth: 2 }]}>
              <Text style={styles.gridLabel}>SKOR AKHIR</Text>
              <Text style={[styles.gridValue, { color: '#e10600' }]}>{prediction.prediksi_skor?.skor_akhir}</Text>
            </GlassCard>
            <GlassCard style={styles.gridBox}>
              <Text style={styles.gridLabel}>TOTAL CORNER</Text>
              <Text style={styles.gridValue}>{prediction.prediksi_corner?.total_corner || "10.5+"}</Text>
            </GlassCard>
            <GlassCard style={[styles.gridBox, { borderBottomColor: '#e10600', borderBottomWidth: 2 }]}>
              <Text style={styles.gridLabel}>BTTS</Text>
              <Text style={[styles.gridValue, { color: '#e10600', fontSize: 20 }]}>{prediction.prediksi_btts?.kedua_tim_cetak_gol}</Text>
            </GlassCard>
            <GlassCard style={styles.gridBox}>
              <Text style={styles.gridLabel}>FIRST SCORER</Text>
              <Text style={[styles.gridValue, { fontSize: 14 }]} numberOfLines={2}>{prediction.prediksi_skor?.pencetak_gol_pertama}</Text>
            </GlassCard>
          </View>

          <GlassCard style={[styles.fullGridBox, { borderBottomColor: '#e10600', borderBottomWidth: 2 }]}>
            <Text style={styles.gridLabel}>HT RESULT</Text>
            <Text style={[styles.gridValue, { color: '#e10600', fontSize: 18 }]}>{prediction.prediksi_skor?.pemenang_babak_pertama}</Text>
          </GlassCard>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <GlassCard style={{ width: '48%', alignItems: 'center', padding: 15 }}>
              <Text style={[styles.gridLabel, {marginBottom: 15}]}>WIN PROBABILITY</Text>
              <View style={styles.chartContainer}>
                <Svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: [{ rotate: '-90deg' }] }}>
                  <Circle cx="50" cy="50" r="40" stroke="#333535" strokeWidth="12" fill="transparent" />
                  <Circle cx="50" cy="50" r="40" stroke="#e10600" strokeWidth="12" fill="transparent"
                    strokeDasharray={`${(prediction.grafik_probabilitas?.home_persen || 33) * 2.512} 251.2`} 
                    strokeDashoffset="0" />
                  <Circle cx="50" cy="50" r="40" stroke="#717070" strokeWidth="12" fill="transparent"
                    strokeDasharray={`${(prediction.grafik_probabilitas?.draw_persen || 33) * 2.512} 251.2`} 
                    strokeDashoffset={`-${(prediction.grafik_probabilitas?.home_persen || 33) * 2.512}`} />
                  <Circle cx="50" cy="50" r="40" stroke="#e2e2e2" strokeWidth="12" fill="transparent"
                    strokeDasharray={`${(prediction.grafik_probabilitas?.away_persen || 34) * 2.512} 251.2`} 
                    strokeDashoffset={`-${((prediction.grafik_probabilitas?.home_persen || 33) + (prediction.grafik_probabilitas?.draw_persen || 33)) * 2.512}`} />
                </Svg>
                <View style={styles.chartCenterText}>
                  <Text style={styles.chartCenterTeam}>{getShortName(meta.homeName)}</Text>
                  <Text style={styles.chartCenterPct}>{prediction.grafik_probabilitas?.home_persen || 0}%</Text>
                </View>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#e10600'}]}/><Text style={styles.legendText}>H</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#717070'}]}/><Text style={styles.legendText}>D</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#e2e2e2'}]}/><Text style={styles.legendText}>A</Text></View>
              </View>
            </GlassCard>

            <GlassCard style={{ width: '48%', padding: 15, justifyContent: 'center' }}>
              <Text style={[styles.gridLabel, {marginBottom: 15, textAlign: 'center'}]}>ATTACK INTENSITY</Text>
              <View style={styles.barChartWrapper}>
                {(prediction.grafik_intensitas || [10,20,30,40,50,60,70,80,90,100]).map((val: number, index: number) => (
                  <View key={index} style={[styles.barItem, { height: `${val}%`, backgroundColor: val > 75 ? '#e10600' : 'rgba(225,6,0,0.3)' }]} />
                ))}
              </View>
              <View style={styles.barLabels}>
                <Text style={styles.barLabelText}>Kick-off</Text>
                <Text style={styles.barLabelText}>90'</Text>
              </View>
            </GlassCard>
          </View>

          <GlassCard style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <Ionicons name="medical" size={18} color="#e10600" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>KABAR TIM TERKINI</Text>
            </View>

            <Text style={[styles.gridLabel, { color: '#e10600', marginBottom: 8 }]}>DAFTAR CEDERA / ABSEN</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
              <View style={{ width: '48%' }}>
                <Text style={[styles.teamNameLabel, { fontSize: 10, color: '#e10600' }]}>{getShortName(meta.homeName)}</Text>
                <Text style={[styles.bodyText, { fontSize: 11 }]}>{prediction.info_tambahan_ui?.daftar_cedera?.home || "Aman"}</Text>
              </View>
              <View style={{ width: '48%' }}>
                <Text style={[styles.teamNameLabel, { fontSize: 10, color: '#e2e2e2', textAlign: 'right' }]}>{getShortName(meta.awayName)}</Text>
                <Text style={[styles.bodyText, { fontSize: 11, textAlign: 'right' }]}>{prediction.info_tambahan_ui?.daftar_cedera?.away || "Aman"}</Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 15 }} />

            <Text style={[styles.gridLabel, { color: '#e10600', marginBottom: 8 }]}>TOP SKOR TIM (MUSIM INI)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '48%' }}>
                <Text style={[styles.teamNameLabel, { fontSize: 10, color: '#e10600' }]}>{getShortName(meta.homeName)}</Text>
                <Text style={[styles.bodyText, { fontSize: 11, fontWeight: 'bold' }]}>{prediction.info_tambahan_ui?.top_skor_tim?.home || "Data N/A"}</Text>
              </View>
              <View style={{ width: '48%' }}>
                <Text style={[styles.teamNameLabel, { fontSize: 10, color: '#e2e2e2', textAlign: 'right' }]}>{getShortName(meta.awayName)}</Text>
                <Text style={[styles.bodyText, { fontSize: 11, fontWeight: 'bold', textAlign: 'right' }]}>{prediction.info_tambahan_ui?.top_skor_tim?.away || "Data N/A"}</Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>SARAN BETTING</Text>
            <View style={styles.betRow}>
              <View style={styles.betIcon}><Ionicons name="trending-up" size={20} color="#e10600" /></View>
              <View style={{flex: 1}}>
                <Text style={styles.betLabel}>HANDICAP</Text>
                <Text style={styles.betValue}>{prediction.rekomendasi_pasar?.handicap?.saran}</Text>
              </View>
            </View>
            <View style={styles.betRow}>
              <View style={styles.betIcon}><Ionicons name="add-circle-outline" size={20} color="#e10600" /></View>
              <View style={{flex: 1}}>
                <Text style={styles.betLabel}>OVER/UNDER GOL</Text>
                <Text style={styles.betValue}>{prediction.rekomendasi_pasar?.over_under_gol?.saran}</Text>
              </View>
            </View>
            <View style={[styles.betRow, {marginBottom: 0}]}>
              <View style={styles.betIcon}><Ionicons name="flag" size={20} color="#e10600" /></View>
              <View style={{flex: 1}}>
                <Text style={styles.betLabel}>PREDIKSI CORNER</Text>
                <Text style={styles.betValue}>{prediction.rekomendasi_pasar?.over_under_corner?.saran || "Data Corner Belum Tersedia"}</Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={{ marginTop: 20, borderTopWidth: 2, borderTopColor: '#e10600' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <View style={styles.aiIconBadge}><Ionicons name="hardware-chip" size={20} color="#fff" /></View>
              <Text style={[styles.sectionTitle, { marginBottom: 0, marginLeft: 10 }]}>KESIMPULAN AI</Text>
            </View>
            <Text style={styles.bodyText}>{prediction.kesimpulan?.ringkasan}</Text>
            <View style={styles.confidenceRow}>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>RISIKO: {String(prediction.kesimpulan?.tingkat_risiko).toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.pickBox}>
              <Text style={styles.pickLabel}>BEST PICK:</Text>
              <Text style={styles.pickValue}>{prediction.kesimpulan?.pick_terbaik}</Text>
            </View>
          </GlassCard>

        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#121414', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 60, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#e10600', fontStyle: 'italic', letterSpacing: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: '#e10600', marginTop: 16, fontStyle: 'italic', fontWeight: 'bold' },
  errorText: { color: '#e10600', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  glassCard: { backgroundColor: 'rgba(30, 32, 32, 0.6)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', padding: 20, overflow: 'hidden' },
  heroCard: { borderLeftWidth: 4, borderLeftColor: '#e10600', alignItems: 'center' },
  heroTop: { backgroundColor: '#e10600', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, marginBottom: 12 },
  leagueTag: { color: '#fff2f0', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  matchTitle: { fontSize: 24, fontWeight: '900', fontStyle: 'italic', color: '#e2e2e2', textAlign: 'center', marginBottom: 20 },
  vsText: { color: '#e10600' },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  teamLogo: { width: 60, height: 60, resizeMode: 'contain' },
  vsTextSmall: { fontSize: 20, fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' },
  fallbackLogo: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#333535', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  fallbackText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', fontStyle: 'italic', color: '#e10600', marginBottom: 15, letterSpacing: 1 },
  tinjauanItem: { marginBottom: 15 },
  tinjauanHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  indicator: { width: 4, height: 16, marginRight: 8 },
  teamNameLabel: { color: '#e2e2e2', fontWeight: 'bold', textTransform: 'uppercase' },
  bodyText: { color: '#e9bcb5', fontSize: 13, lineHeight: 22 },
  formationBox: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  formationLabel: { fontSize: 10, color: '#e10600', fontWeight: 'bold', letterSpacing: 1, marginBottom: 5 },
  formationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  formationText: { fontSize: 20, fontStyle: 'italic', fontWeight: 'bold', color: '#e2e2e2' },
  formationVs: { fontSize: 12, fontStyle: 'italic', color: '#717070' },
  pitchContainer: { marginBottom: 15, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  gridBox: { width: '48%', alignItems: 'center', justifyContent: 'center', padding: 15, marginBottom: 15 },
  fullGridBox: { width: '100%', alignItems: 'center', justifyContent: 'center', padding: 15, marginTop: 5 },
  gridLabel: { fontSize: 10, color: '#e9bcb5', fontWeight: 'bold', letterSpacing: 1, marginBottom: 5 },
  gridValue: { fontSize: 22, fontWeight: 'bold', fontStyle: 'italic', color: '#e2e2e2', textAlign: 'center' },
  chartContainer: { width: 100, height: 100, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  chartCenterText: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  chartCenterTeam: { fontSize: 16, fontStyle: 'italic', color: '#e2e2e2', fontWeight: 'bold' },
  chartCenterPct: { fontSize: 10, color: '#e10600', fontWeight: 'bold' },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 15, width: '100%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: '#e9bcb5', fontWeight: 'bold' },
  barChartWrapper: { height: 80, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.2)', padding: 5, borderRadius: 6, gap: 2 },
  barItem: { flex: 1, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  barLabelText: { fontSize: 9, color: '#717070', fontStyle: 'italic', textTransform: 'uppercase' },
  betRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  betIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#1a1c1c', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  betLabel: { fontSize: 10, color: '#e9bcb5', fontWeight: 'bold', letterSpacing: 1, marginBottom: 2 },
  betValue: { fontSize: 14, fontWeight: 'bold', color: '#e2e2e2' },
  aiIconBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e10600', alignItems: 'center', justifyContent: 'center' },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 10 },
  confidenceBadge: { backgroundColor: '#e10600', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  confidenceText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  pickBox: { backgroundColor: '#1a1c1c', padding: 12, borderRadius: 8, marginTop: 5, borderWidth: 1, borderColor: 'rgba(225,6,0,0.2)' },
  pickLabel: { color: '#e10600', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  pickValue: { color: '#fff', fontSize: 13, fontStyle: 'italic', fontWeight: 'bold' }
});