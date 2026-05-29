import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Tentukan tipe data
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    subText: string;
    border: string;
  };
};

// 2. Buat Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Buat Provider (Pembungkus)
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default Dark Mode

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.log("Gagal memuat tema:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(newTheme));
  };

  // Palet Warna Pintar
  const colors = {
    background: isDarkMode ? '#0d0d0f' : '#f5f7fa',
    card: isDarkMode ? '#161618' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    subText: isDarkMode ? '#888888' : '#666666',
    border: isDarkMode ? '#1e1e22' : '#eeeeee',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Custom Hook agar mudah dipanggil di file lain
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme harus digunakan di dalam ThemeProvider");
  }
  return context;
};