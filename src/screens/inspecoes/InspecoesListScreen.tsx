// src/screens/inspecoes/InspecoesListScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InspecaoCard } from '../../components/InspecaoCard';
import { INSPECOES_MOCK, OBRAS_MOCK } from '../../constants/mockData';

export default function InspecoesListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const obraId = id as string;

  const obraMock = OBRAS_MOCK.find(o => o.id === obraId);
  const inspecoes = INSPECOES_MOCK.filter(i => i.obraId === obraId);

  const [modalVisible, setModalVisible] = useState(false);
  
  const [obraNome, setObraNome] = useState(obraMock?.nome || '');
  const [obraEndereco, setObraEndereco] = useState(obraMock?.endereco || '');
  
  const [empresaNome, setEmpresaNome] = useState(obraMock?.empresaNome || '');
  const [empresaTel, setEmpresaTel] = useState(obraMock?.empresaTelefone || '');
  const [empresaEmail, setEmpresaEmail] = useState(obraMock?.empresaEmail || '');
  const [empresaLogo, setEmpresaLogo] = useState<string | null>(obraMock?.empresaLogo || null);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setEmpresaLogo(result.assets[0].uri);
    }
  };

  const handleSaveDados = () => {
    console.log("Dados atualizados:", { obraNome, empresaNome, empresaLogo });
    setModalVisible(false);
  };

  if (!obraMock) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Obra não encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Limpo (Sem o lápis) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspeções</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* NOVO: Card de Informações da Obra com Botão Editar Verde */}
      <View style={styles.obraCardContainer}>
        <View style={styles.obraCard}>
          
          {/* Cabeçalho do Card: Nome e Botão Editar */}
          <View style={styles.obraCardHeader}>
            <Text style={styles.obraNome}>{obraNome}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editBadge}>
              <FontAwesome5 name="pen" size={12} color="#1F5F38" />
              <Text style={styles.editBadgeText}>Editar</Text>
            </TouchableOpacity>
          </View>

          {/* Detalhes com Ícones */}
          <View style={styles.obraDetailsRow}>
            <View style={styles.obraDetailsTextContainer}>
              <View style={styles.detailItem}>
                <MaterialIcons name="location-on" size={16} color="#6b7280" />
                <Text style={styles.obraDetalhe}>{obraEndereco}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="business" size={16} color="#6b7280" />
                <Text style={styles.obraDetalhe}>Contratante: <Text style={{fontWeight: '600'}}>{empresaNome}</Text></Text>
              </View>
            </View>
            
            {/* Logo */}
            {empresaLogo && (
              <Image source={{ uri: empresaLogo }} style={styles.logoMiniatura} />
            )}
          </View>
        </View>
      </View>

      {/* Lista de Inspeções */}
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

      {/* MODAL DE EDIÇÃO (Mantido igual) */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Dados da Obra e Contratante</Text>
            <TouchableOpacity onPress={handleSaveDados}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.sectionLabel}>EMPRESA CONTRATANTE</Text>
            <View style={styles.cardInput}>
              <View style={styles.logoContainer}>
                <TouchableOpacity onPress={pickLogo} style={styles.logoButton}>
                  {empresaLogo ? (
                    <Image source={{ uri: empresaLogo }} style={styles.logoPreview} />
                  ) : (
                    <View style={styles.logoPlaceholder}>
                      <FontAwesome5 name="image" size={24} color="#9ca3af" />
                      <Text style={styles.logoText}>Adicionar Logo</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={styles.helperText}>Toque para alterar a logo</Text>
              </View>
              <Text style={styles.label}>Nome da Empresa</Text>
              <TextInput style={styles.input} value={empresaNome} onChangeText={setEmpresaNome} />
              <Text style={styles.label}>E-mail</Text>
              <TextInput style={styles.input} value={empresaEmail} onChangeText={setEmpresaEmail} keyboardType="email-address" />
              <Text style={styles.label}>Telefone</Text>
              <TextInput style={styles.input} value={empresaTel} onChangeText={setEmpresaTel} keyboardType="phone-pad" />
            </View>

            <Text style={styles.sectionLabel}>DADOS DA OBRA</Text>
            <View style={styles.cardInput}>
              <Text style={styles.label}>Nome da Obra</Text>
              <TextInput style={styles.input} value={obraNome} onChangeText={setObraNome} />
              <Text style={styles.label}>Endereço Completo</Text>
              <TextInput style={styles.input} value={obraEndereco} onChangeText={setObraEndereco} multiline />
            </View>
          </ScrollView>
        </SafeAreaView>
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
  
  // Novos Estilos do Card da Obra
  obraCardContainer: { padding: 16, paddingBottom: 8 },
  obraCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#e5e7eb',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  obraCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  obraNome: { fontSize: 18, fontWeight: 'bold', color: '#111827', flex: 1, marginRight: 8 },
  
  // Botão Editar Verde
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
  logoMiniatura: { width: 56, height: 56, borderRadius: 8, marginLeft: 12, resizeMode: 'contain', borderWidth: 1, borderColor: '#f3f4f6' },

  content: { flex: 1, paddingHorizontal: 16 },
  newButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 16, borderWidth: 2, borderColor: '#d1d5db', borderStyle: 'dashed',
    borderRadius: 12, marginTop: 8, gap: 8, backgroundColor: '#fff'
  },
  newButtonText: { fontSize: 16, fontWeight: '600', color: '#4b5563' },

  // Estilos do Modal (Mantidos)
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb'
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  saveText: { fontSize: 16, fontWeight: 'bold', color: '#1F5F38' },
  modalContent: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginBottom: 8, marginTop: 16 },
  cardInput: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4, marginTop: 12 },
  input: { 
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, 
    fontSize: 14, color: '#111827', backgroundColor: '#f9fafb' 
  },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  logoButton: {
    width: 100, height: 100, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db',
    borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
    backgroundColor: '#f9fafb'
  },
  logoPlaceholder: { alignItems: 'center', gap: 4 },
  logoText: { fontSize: 12, color: '#9ca3af' },
  logoPreview: { width: '100%', height: '100%', resizeMode: 'contain' },
  helperText: { fontSize: 12, color: '#6b7280', marginTop: 4 },
});