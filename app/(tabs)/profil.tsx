import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilScreen() {
  const [userName, setUserName] = useState('Boss');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [tempName, setTempName] = useState('');

  // === 1. LOAD DATA PERMANEN ===
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedName = await AsyncStorage.getItem('userName');
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedName) setUserName(savedName);
      if (savedImage) setProfileImage(savedImage);
    } catch (error) {
      console.log('Gagal memuat data:', error);
    }
  };

  // === 2. FUNGSI SIMPAN NAMA ===
  const saveName = async () => {
    if (tempName.trim() === '') {
      Alert.alert('Perhatian', 'Nama tidak boleh kosong!');
      return;
    }
    try {
      await AsyncStorage.setItem('userName', tempName);
      setUserName(tempName);
      setShowNameInput(false);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan nama');
    }
  };

  // === 3. FUNGSI FOTO PROFIL ===
  const handlePhotoClick = () => {
    Alert.alert("Atur Foto Profil", "Apa yang ingin Anda lakukan?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus Foto", style: "destructive", onPress: async () => { await AsyncStorage.removeItem('profileImage'); setProfileImage(null); } },
      { text: "Pilih dari Galeri", onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            await AsyncStorage.setItem('profileImage', result.assets[0].uri);
          }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* === AREA HEADER PROFIL === */}
        <View style={styles.headerProfile}>
          <TouchableOpacity onPress={handlePhotoClick} style={styles.imageContainer}>
            <Image 
              source={{ uri: profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} 
              style={styles.profileImage} 
            />
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* === AREA PREFERENSI === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENSI</Text>
          
          <TouchableOpacity 
            style={styles.row} 
            onPress={() => { setTempName(userName); setShowNameInput(!showNameInput); }}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="person" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.rowText}>Ubah Nama Profil</Text>
            </View>
            <Ionicons name={showNameInput ? "chevron-down" : "chevron-forward"} size={20} color="#666" />
          </TouchableOpacity>

          {showNameInput && (
            <View style={styles.inputArea}>
              <TextInput 
                style={styles.input}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Ketik nama baru..."
                placeholderTextColor="#666"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={saveName}>
                <Text style={styles.saveBtnText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* === AREA TENTANG APLIKASI === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TENTANG APLIKASI</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>Versi Boltstats</Text>
            <Text style={styles.versionText}>v1.0.0 (Beta)</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d0f' },
  content: { paddingBottom: 30 },
  headerProfile: { alignItems: 'center', paddingVertical: 40 },
  imageContainer: { position: 'relative', marginBottom: 15 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#161618' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#e8401c', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0d0d0f' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', letterSpacing: 1.5, marginLeft: 20, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, backgroundColor: '#161618' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 15 },
  rowText: { fontSize: 15, fontWeight: '500', color: '#fff' },
  versionText: { fontSize: 15, fontWeight: 'bold', color: '#e8401c' },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: '#111', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, color: '#fff' },
  saveBtn: { backgroundColor: '#e8401c', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' }
});