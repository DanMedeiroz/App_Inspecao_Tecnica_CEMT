// src/screens/obras/ObrasListScreen.tsx
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ObraCard } from '../../components/ObraCard';
import { api } from '../../services/api';
import { Obra } from '../../types';

export default function ObrasListScreen() {
  const router = useRouter();
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadObras();
  }, []);

  const loadObras = async () => {
    try {
      const data = await api.getObras();
      setObras(data);
    } catch (error) {
      console.error("Erro ao carregar obras:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Obras</Text>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.logoImage}
          />
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#1F5F38" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={obras}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <ObraCard 
                obra={item}
                docsVencendo={0} // Pode ser carregado via serviço também
                onPressInspecoes={() => router.push({
                  pathname: "/obras/[id]/inspecoes",
                  params: { id: item.id }
                })}
                onPressDocumentosObra={() => router.push({
                  pathname: "/obras/[id]/documentos",
                  params: { id: item.id }
                } as any)}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#1F5F38',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  logoContainer: {
    backgroundColor: 'white', padding: 6, borderRadius: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2.5, elevation: 4,
  },
  logoImage: { width: 36, height: 36, resizeMode: 'contain' },
  content: { flex: 1, padding: 16 },
});
