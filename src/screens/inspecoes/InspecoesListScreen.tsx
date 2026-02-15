// src/screens/inspecoes/InspecoesListScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InspecaoCard } from '../../components/InspecaoCard';
import { INSPECOES_MOCK, OBRAS_MOCK } from '../../constants/mockData';

export default function InspecoesListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const obraId = id as string;

  const obra = OBRAS_MOCK.find(o => o.id === obraId);
  const inspecoes = INSPECOES_MOCK.filter(i => i.obraId === obraId);

  if (!obra) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Obra não encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspeções</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.obraInfo}>
        <Text style={styles.obraNome}>{obra.nome}</Text>
        <Text style={styles.obraDetalhe}>{obra.endereco}</Text>
        <Text style={styles.obraDetalhe}>Responsável: {obra.tecnico}</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={inspecoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InspecaoCard 
              inspecao={item}
              onPress={() => router.push({
                pathname: "/inspecoes/[id]/pavimentos",
                params: { id: item.id }
              })}
            />
          )}
          ListFooterComponent={() => (
            <TouchableOpacity style={styles.newButton} onPress={() => console.log('Nova Inspeção')}>
              <FontAwesome5 name="plus" size={16} color="#4b5563" />
              <Text style={styles.newButtonText}>Nova Inspeção</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1F5F38',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 4,
  },
  obraInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  obraNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  obraDetalhe: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  newButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
});