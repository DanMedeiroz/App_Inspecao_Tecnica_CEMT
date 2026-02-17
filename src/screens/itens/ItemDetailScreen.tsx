// src/screens/itens/ItemDetailScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '../../services/api';
import { TEXTOS_PADRAO } from '../../constants/textosPadrao';
import { Foto, Item } from '../../types';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const itemId = id as string;

  const [item, setItem] = useState<Item | undefined>();
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [norma, setNorma] = useState('');
  const [planoAcao, setPlanoAcao] = useState('');
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaAberta, setCategoriaAberta] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [itemId]);

  const loadData = async () => {
    try {
      const data = await api.getItemById(itemId);
      if (data) {
        setItem(data);
        setTitulo(data.nome || '');
        setNorma(data.descricao || '');
        setFotos(data.fotos || []);
      }
    } catch (error) {
      console.error("Erro ao carregar item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!titulo.trim() || !norma.trim()) {
      Alert.alert("Campos Obrigatórios", "Por favor, preencha o Título e a Norma.");
      return;
    }
    
    try {
      await api.saveItem(itemId, { 
        nome: titulo, 
        descricao: norma, 
        fotos 
      });
      Alert.alert("Sucesso", "Inconformidade salva!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão negada", "Precisamos de acesso à câmera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });
    
    if (!result.canceled) {
      const novaFoto = { uri: result.assets[0].uri, data: new Date().toLocaleString('pt-BR') };
      setFotos([...fotos, novaFoto]);
      setModalVisible(false);
    }
  };

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
        <Text style={styles.headerTitle}>Registrar Inconformidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.label}>Título da Inconformidade *</Text>
            <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ex: Abertura de janela sem proteção..." />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Artigos da Norma *</Text>
            <TextInput style={[styles.input, styles.textArea]} value={norma} onChangeText={setNorma} placeholder="Artigos da norma relacionados..." multiline textAlignVertical="top" />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Fotos ({fotos.length})</Text>
            <View style={styles.photosGrid}>
              {fotos.map((foto, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: foto.uri }} style={styles.photoThumb} />
                  <View style={styles.watermarkContainer}><Text style={styles.watermarkText}>{foto.data}</Text></View>
                  <TouchableOpacity style={styles.deletePhotoButton} onPress={() => setFotos(fotos.filter((_, i) => i !== index))}>
                    <MaterialIcons name="close" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addPhotoButton} onPress={() => setModalVisible(true)}>
                <FontAwesome5 name="camera" size={24} color="#6b7280" />
                <Text style={styles.addPhotoText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <MaterialIcons name="save" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Salvar Inconformidade</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar Foto</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}><MaterialIcons name="close" size={24} color="#9ca3af" /></TouchableOpacity>
              </View>
              <View style={styles.modalOptionsContainer}>
                <TouchableOpacity style={styles.modalOption} onPress={pickFromCamera}>
                  <View style={[styles.iconCircle, { backgroundColor: '#dbeafe' }]}><FontAwesome5 name="camera" size={24} color="#2563eb" /></View>
                  <Text style={styles.modalOptionText}>Câmera</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#1F5F38' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  backButton: { padding: 4 },
  scrollContent: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 14, color: '#111827', backgroundColor: '#f9fafb' },
  textArea: { minHeight: 100 },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  photoWrapper: { width: 100, height: 100, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  photoThumb: { width: '100%', height: '100%' },
  watermarkContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 2 },
  watermarkText: { color: '#fff', fontSize: 8, textAlign: 'center' },
  deletePhotoButton: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 4 },
  addPhotoButton: { width: 100, height: 100, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  addPhotoText: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  saveButton: { backgroundColor: '#1F5F38', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, gap: 8 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  modalOptionsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 },
  modalOption: { alignItems: 'center' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  modalOptionText: { fontSize: 14, fontWeight: '600', color: '#374151' }
});
