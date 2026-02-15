// src/screens/inspecoes/PavimentosListScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PavimentoCard } from '../../components/PavimentoCard';
import { INSPECOES_MOCK, PAVIMENTOS_MOCK } from '../../constants/mockData';

export default function PavimentosListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ID da Inspeção
  const inspecaoId = id as string;

  const inspecao = INSPECOES_MOCK.find(i => i.id === inspecaoId);
  const pavimentos = PAVIMENTOS_MOCK.filter(p => p.inspecaoId === inspecaoId);

  // Formatação de data segura
  const dataFormatada = inspecao ? new Date(inspecao.data).toLocaleDateString('pt-BR') : '';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Verde */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pavimentos</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Info da Inspeção */}
      <View style={styles.infoBar}>
        <Text style={styles.infoTitle}>Inspeção {dataFormatada}</Text>
        <Text style={styles.infoSubtitle}>Selecione um local para inspecionar</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={pavimentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PavimentoCard 
              pavimento={item} 
              onPress={() => console.log('Ir para itens do pavimento ' + item.id)} 
            />
          )}
          ListFooterComponent={() => (
            <TouchableOpacity style={styles.addButton} onPress={() => console.log('Novo Pavimento')}>
              <FontAwesome5 name="plus" size={14} color="#1F5F38" />
              <Text style={styles.addButtonText}>Adicionar Pavimento</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#1F5F38',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  backButton: { padding: 4 },
  infoBar: {
    backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  infoSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  content: { flex: 1, padding: 16 },
  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 16, marginTop: 8, gap: 8, backgroundColor: '#f0fdf4',
    borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 12, borderStyle: 'dashed'
  },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#166534' },
});