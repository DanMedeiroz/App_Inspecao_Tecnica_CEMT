// src/screens/inspecoes/InspecoesListScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InspecaoCard } from '../../components/InspecaoCard';
import { api } from '../../services/api';
import { Obra, Inspecao } from '../../types';

export default function InspecoesListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const obraId = id as string;

  const [obra, setObra] = useState<Obra | undefined>();
  const [inspecoes, setInspecoes] = useState<Inspecao[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [obraId]);

  const loadData = async () => {
    try {
      const [obraData, inspecoesData] = await Promise.all([
        api.getObraById(obraId),
        api.getInspecoesByObra(obraId)
      ]);
      setObra(obraData);
      setInspecoes(inspecoesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1F5F38" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

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

      <View style={styles.obraCardContainer}>
        <View style={styles.obraCard}>
          <View style={styles.obraCardHeader}>
            <Text style={styles.obraNome}>{obra.nome}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editBadge}>
              <FontAwesome5 name="pen" size={12} color="#1F5F38" />
              <Text style={styles.editBadgeText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.obraDetailsRow}>
            <View style={styles.obraDetailsTextContainer}>
              <View style={styles.detailItem}>
                <MaterialIcons name="location-on" size={16} color="#6b7280" />
                <Text style={styles.obraDetalhe}>{obra.endereco}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="business" size={16} color="#6b7280" />
                <Text style={styles.obraDetalhe}>Contratante: <Text style={{fontWeight: '600'}}>{obra.empresaNome || 'N/A'}</Text></Text>
              </View>
            </View>
          </View>
        </View>
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
              } as Href)}
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
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#1F5F38',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  backButton: { padding: 4 },
  obraCardContainer: { padding: 16, paddingBottom: 8 },
  obraCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#e5e7eb',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  obraCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  obraNome: { fontSize: 18, fontWeight: 'bold', color: '#111827', flex: 1, marginRight: 8 },
  editBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', 
    paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20,
    borderWidth: 1, borderColor: '#bbf7d0', gap: 6
  },
  editBadgeText: { fontSize: 12, fontWeight: '600', color: '#1F5F38' },
  obraDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  obraDetailsTextContainer: { flex: 1, gap: 6 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  obraDetalhe: { fontSize: 14, color: '#4b5563', flex: 1 },
  content: { flex: 1, paddingHorizontal: 16 },
  newButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 16, borderWidth: 2, borderColor: '#d1d5db', borderStyle: 'dashed',
    borderRadius: 12, marginTop: 8, gap: 8, backgroundColor: '#fff'
  },
  newButtonText: { fontSize: 16, fontWeight: '600', color: '#4b5563' },
});
