// src/screens/inspecoes/PavimentosListScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateInspecaoPDF } from '../../services/pdfGenerator';

import { PavimentoCard } from '../../components/PavimentoCard';
import { api } from '../../services/api';
import { Inspecao, Pavimento } from '../../types';

export default function PavimentosListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const inspecaoId = id as string;

  const [inspecao, setInspecao] = useState<Inspecao | undefined>();
  const [pavimentos, setPavimentos] = useState<Pavimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [descricao, setDescricao] = useState('');
  const [fotoCapa, setFotoCapa] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [inspecaoId]);

  const loadData = async () => {
    try {
      const inspecaoData = await api.getInspecaoById(inspecaoId);
      if (inspecaoData) {
        setInspecao(inspecaoData);
        setDescricao(inspecaoData.descricao || '');
        setFotoCapa(inspecaoData.fotoCapa || null);
        const pavimentosData = await api.getPavimentosByObra(inspecaoData.obra_id);
        setPavimentos(pavimentosData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImageCapa = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [16, 9],
    });

    if (!result.canceled) {
      setFotoCapa(result.assets[0].uri);
    }
  };

  const HeaderComponent = useMemo(() => {
    return (
      <View style={styles.reportHeaderContainer}>
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Capa do Relatório (Opcional)</Text>
          <TouchableOpacity style={styles.coverImageContainer} onPress={pickImageCapa}>
            {fotoCapa ? (
              <>
                <Image source={{ uri: fotoCapa }} style={styles.coverImage} />
                <View style={styles.editIconBadge}>
                  <MaterialIcons name="edit" size={16} color="#fff" />
                </View>
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <FontAwesome5 name="images" size={24} color="#9ca3af" />
                <Text style={styles.placeholderText}>Escolher foto da galeria</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Introdução do Relatório</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              multiline
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Digite a introdução do relatório..."
              scrollEnabled={false}
            />
          </View>
        </View>

        <View style={styles.listTitleContainer}>
          <Text style={styles.listTitle}>LISTA DE PAVIMENTOS / LOCAIS</Text>
          <View style={styles.line} />
        </View>
      </View>
    );
  }, [descricao, fotoCapa]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1F5F38" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Inspeção</Text>
        <TouchableOpacity onPress={() => api.updateInspecao(inspecaoId, { descricao, fotoCapa: fotoCapa || undefined })}>
            <MaterialIcons name="save" size={28} color="#fff" /> 
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FlatList
          data={pavimentos}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={HeaderComponent}
          renderItem={({ item }) => (
            <PavimentoCard 
              pavimento={item} 
              onPress={() => router.push({
                pathname: "/pavimentos/[id]/itens",
                params: { id: item.id }
              } as Href)} 
            />
          )}
          ListFooterComponent={() => (
            <View style={styles.footerContainer}>
              <TouchableOpacity style={styles.addButton} onPress={() => console.log('Novo Pavimento')}>
                <FontAwesome5 name="plus" size={14} color="#dc2626" />
                <Text style={styles.addButtonText}>Adicionar Pavimento</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.pdfButton} 
                onPress={() => generateInspecaoPDF(inspecaoId)}
              >
                <FontAwesome5 name="file-pdf" size={18} color="#fff" />
                <Text style={styles.pdfButtonText}>Gerar Relatório PDF</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  backButton: { padding: 4 },
  content: { flex: 1, paddingHorizontal: 16 },
  reportHeaderContainer: { marginTop: 16, marginBottom: 8 },
  sectionBlock: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8, textTransform: 'uppercase' },
  coverImageContainer: {
    height: 160, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e5e7eb',
    borderWidth: 1, borderColor: '#d1d5db', borderStyle: 'dashed',
  },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  placeholderText: { fontSize: 14, color: '#6b7280' },
  editIconBadge: {
    position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6, borderRadius: 20,
  },
  textAreaContainer: {
    backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', padding: 12,
  },
  textArea: {
    fontSize: 14, color: '#374151', lineHeight: 20, minHeight: 100, textAlignVertical: 'top',
  },
  listTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  listTitle: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginRight: 8 },
  line: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  footerContainer: { marginTop: 8, gap: 12 },
  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 16, backgroundColor: '#fef2f2', 
    borderWidth: 1, borderColor: '#fca5a5', borderRadius: 12, borderStyle: 'dashed'
  },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#dc2626', marginLeft: 8 },
  pdfButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 16, backgroundColor: '#1F5F38', borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4,
  },
  pdfButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginLeft: 8 },
});
