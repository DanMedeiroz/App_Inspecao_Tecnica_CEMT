// src/screens/itens/ItensListScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert, FlatList,
  Modal,
  ScrollView,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ItemCard } from '../../components/ItemCard';
import { ITENS_MOCK, PAVIMENTOS_MOCK } from '../../constants/mockData';

export default function ItensListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const pavimentoId = id as string;

  // Busca dados do Banco (Mock)
  const pavimentoMock = PAVIMENTOS_MOCK.find(p => p.id === pavimentoId);
  const itens = ITENS_MOCK.filter(i => i.pavimentoId === pavimentoId);

  // Calcula total de pavimentos nesta inspeção para gerar a lista de ordens (1º, 2º, 3º...)
  const totalPavimentos = PAVIMENTOS_MOCK.filter(p => p.inspecaoId === pavimentoMock?.inspecaoId).length;
  const opcoesOrdem = Array.from({ length: totalPavimentos }, (_, i) => (i + 1).toString());

  // Estados para Edição
  const [modalVisible, setModalVisible] = useState(false);
  const [showOrdemPicker, setShowOrdemPicker] = useState(false); // Controla o dropdown
  
  const [nome, setNome] = useState('');
  const [ordem, setOrdem] = useState('1');

  // Carrega os dados para edição quando o modal abre ou os dados mudam
  useEffect(() => {
    if (pavimentoMock) {
      setNome(pavimentoMock.nome);
      // Converte do banco (0-based) para humano (1-based)
      setOrdem((pavimentoMock.ordem + 1).toString());
    }
  }, [pavimentoMock]);

  const handleSave = () => {
    // Aqui atualizaria no banco de dados real
    // Convertemos de volta para 0-based ao salvar (ex: 1 vira 0)
    console.log("Pavimento atualizado:", { 
      id: pavimentoId, 
      nome, 
      ordemBanco: parseInt(ordem) - 1 
    });
    setModalVisible(false);
    setShowOrdemPicker(false);
  };

  if (!pavimentoMock) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Pavimento não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Verde */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inconformidades</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Info do Pavimento (Com Botão de Editar) */}
      <View style={styles.infoBar}>
        <View style={styles.infoHeaderRow}>
          <Text style={styles.infoTitle}>{pavimentoMock.nome}</Text>
          
          {/* Badge de Editar */}
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editBadge}>
            <FontAwesome5 name="pen" size={12} color="#1F5F38" />
            <Text style={styles.editBadgeText}>Editar</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.infoSubtitle}>
          {itens.length} inconformidade{itens.length !== 1 ? 's' : ''} encontrada{itens.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista de Itens */}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="check-circle-outline" size={48} color="#16a34a" />
              <Text style={styles.emptyTitle}>Tudo certo por aqui!</Text>
              <Text style={styles.emptyText}>Nenhuma inconformidade registrada neste pavimento.</Text>
            </View>
          }
        />
      </View>

      {/* MODAL DE EDIÇÃO DO PAVIMENTO */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Pavimento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Input Nome */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome do Pavimento / Local</Text>
              <TextInput 
                style={styles.input} 
                value={nome} 
                onChangeText={setNome}
                placeholder="Ex: Térreo, 1º Andar..." 
              />
            </View>

            {/* Input Ordem (Com Menu Dropdown) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ordem no Relatório</Text>
              
              <TouchableOpacity 
                style={styles.selectButton} 
                onPress={() => setShowOrdemPicker(!showOrdemPicker)}
              >
                <Text style={styles.selectButtonText}>{ordem}º Posição</Text>
                <MaterialIcons 
                  name={showOrdemPicker ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={24} color="#6b7280" 
                />
              </TouchableOpacity>

              {/* Lista Suspensa (Dropdown) */}
              {showOrdemPicker && (
                <View style={styles.dropdownContainer}>
                  <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                    {opcoesOrdem.map((numero) => (
                      <TouchableOpacity 
                        key={numero} 
                        style={[
                          styles.dropdownItem, 
                          ordem === numero && styles.dropdownItemSelected
                        ]}
                        onPress={() => {
                          setOrdem(numero);
                          setShowOrdemPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          ordem === numero && { color: '#1F5F38', fontWeight: 'bold' }
                        ]}>
                          {numero}º Posição
                        </Text>
                        {ordem === numero && <MaterialIcons name="check" size={16} color="#1F5F38" />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              
              <Text style={styles.helperText}>Define a sequência de exibição das páginas no PDF.</Text>
            </View>

            {/* Botão Salvar */}
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
  
  // Info Bar
  infoBar: {
    backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  infoHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', flex: 1, marginRight: 8 },
  infoSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },

  // Botão Editar Badge
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
  
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 16 },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 8, paddingHorizontal: 32 },

  // Estilos do Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16
  },
  modalContent: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { 
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, 
    fontSize: 14, color: '#111827', backgroundColor: '#f9fafb' 
  },
  helperText: { fontSize: 12, color: '#6b7280', marginTop: 4 },

  // Dropdown / Select Button
  selectButton: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12,
    backgroundColor: '#f9fafb'
  },
  selectButtonText: { fontSize: 16, color: '#111827', fontWeight: '500' },
  
  dropdownContainer: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, marginTop: 4,
    backgroundColor: '#fff', elevation: 2, overflow: 'hidden'
  },
  dropdownItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6'
  },
  dropdownItemSelected: { backgroundColor: '#f0fdf4' },
  dropdownItemText: { fontSize: 14, color: '#374151' },

  saveModalButton: {
    backgroundColor: '#1F5F38', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8
  },
  saveModalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});