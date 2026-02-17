// src/screens/itens/ItensListScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ItemCard } from '../../components/ItemCard';
import { api } from '../../services/api';
import { Pavimento, Item } from '../../types';

export default function ItensListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const pavimentoId = id as string;

  const [pavimento, setPavimento] = useState<Pavimento | undefined>();
  const [itens, setItens] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    loadData();
  }, [pavimentoId]);

  const loadData = async () => {
    try {
      const [pavimentoData, itensData] = await Promise.all([
        // Como não temos getPavimentoById na interface, usamos o mock por enquanto ou adaptamos
        api.getPavimentosByObra('1').then(list => list.find(p => p.id === pavimentoId)),
        api.getItensByPavimento(pavimentoId)
      ]);
      setPavimento(pavimentoData);
      setItens(itensData);
      if (pavimentoData) setNome(pavimentoData.nome);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.updatePavimento(pavimentoId, { nome });
      setModalVisible(false);
      loadData();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1F5F38" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!pavimento) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Pavimento não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inconformidades</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.infoBar}>
        <View style={styles.infoHeaderRow}>
          <Text style={styles.infoTitle}>{pavimento.nome}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editBadge}>
            <FontAwesome5 name="pen" size={12} color="#1F5F38" />
            <Text style={styles.editBadgeText}>Editar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.infoSubtitle}>
          {itens.length} inconformidade{itens.length !== 1 ? 's' : ''} encontrada{itens.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={itens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard 
              item={item} 
              onPress={() => router.push({
                pathname: "/itens/[id]",
                params: { id: item.id }
              } as Href)}
            />
          )}
          ListFooterComponent={() => (
            <TouchableOpacity 
              style={styles.newButton} 
              onPress={() => Alert.alert("Em breve", "Funcionalidade de criar item do zero será implementada na próxima fase.")}
            >
              <FontAwesome5 name="plus" size={16} color="#dc2626" />
              <Text style={styles.newButtonText}>Adicionar Inconformidade</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Pavimento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome do Pavimento / Local</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} />
            </View>
            <TouchableOpacity style={styles.saveModalButton} onPress={handleSave}>
              <Text style={styles.saveModalButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  infoBar: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  infoHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', flex: 1, marginRight: 8 },
  infoSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  editBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', 
    paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20,
    borderWidth: 1, borderColor: '#bbf7d0', gap: 6
  },
  editBadgeText: { fontSize: 12, fontWeight: '600', color: '#1F5F38' },
  content: { flex: 1, padding: 16 },
  newButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 16, borderWidth: 2, borderColor: '#fecaca', borderStyle: 'dashed',
    borderRadius: 12, marginTop: 8, gap: 8, backgroundColor: '#fef2f2'
  },
  newButtonText: { fontSize: 16, fontWeight: '600', color: '#dc2626' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 14, color: '#111827', backgroundColor: '#f9fafb' },
  saveModalButton: { backgroundColor: '#1F5F38', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  saveModalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
