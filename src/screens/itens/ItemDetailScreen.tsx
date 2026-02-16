// src/screens/itens/ItemDetailScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ITENS_MOCK } from '../../constants/mockData';
import { TEXTOS_PADRAO } from '../../constants/textosPadrao';
import { Foto } from '../../types'; // Importe o tipo oficial

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const itemId = id as string;

  const itemMock = ITENS_MOCK.find(i => i.id === itemId);

  const [titulo, setTitulo] = useState(itemMock?.tituloInconformidade || '');
  const [norma, setNorma] = useState(itemMock?.artigosNorma || '');
  const [planoAcao, setPlanoAcao] = useState(itemMock?.observacoes || '');
  
  const [fotos, setFotos] = useState<Foto[]>(itemMock?.fotos || []);

  const [categoriaAberta, setCategoriaAberta] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Função auxiliar para formatar data atual
  const getCurrentDate = () => {
    return new Date().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
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
      allowsEditing: true, // <--- Habilita edição (recorte) nativa
    });
    
    if (!result.canceled) {
      const novaFoto = { uri: result.assets[0].uri, data: getCurrentDate() };
      setFotos([...fotos, novaFoto]);
      setModalVisible(false);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true, // <--- Habilita edição (recorte) nativa
    });
    
    if (!result.canceled) {
      const novaFoto = { uri: result.assets[0].uri, data: getCurrentDate() };
      setFotos([...fotos, novaFoto]);
      setModalVisible(false);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setFotos(fotos.filter((_, index) => index !== indexToRemove));
  };

  const handleSelectTextoPadrao = (novoTitulo: string, novaNorma: string) => {
    setTitulo(novoTitulo);
    setNorma(novaNorma);
    setCategoriaAberta(null);
  };

  const handleSave = () => {
    if (!titulo.trim() || !norma.trim()) {
      Alert.alert("Campos Obrigatórios", "Por favor, preencha o Título e a Norma.");
      return;
    }
    
    // NÃO fazemos mais o map(f => f.uri). Salvamos o objeto completo!
    // O PDF vai ler item.fotos[0].data e escrever na imagem.
    console.log("Salvando no Banco...", { 
      id: itemId,
      titulo, 
      norma, 
      planoAcao, 
      fotos // <--- AGORA VAI COM DATA E TUDO
    });
    
    Alert.alert("Sucesso", "Inconformidade salva!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Inconformidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Título */}
          <View style={styles.card}>
            <Text style={styles.label}>Título da Inconformidade *</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Abertura de janela sem proteção..."
            />
          </View>

          {/* Textos Padrão */}
          <View style={styles.card}>
            <Text style={styles.label}>Selecione um texto padrão</Text>
            <View style={styles.accordionContainer}>
              {Object.entries(TEXTOS_PADRAO).map(([categoria, textos]) => (
                <View key={categoria} style={styles.accordionItem}>
                  <TouchableOpacity 
                    style={styles.accordionHeader}
                    onPress={() => setCategoriaAberta(categoriaAberta === categoria ? null : categoria)}
                  >
                    <Text style={styles.accordionTitle}>{categoria} ({textos.length})</Text>
                    <MaterialIcons 
                      name={categoriaAberta === categoria ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={24} color="#4b5563" 
                    />
                  </TouchableOpacity>

                  {categoriaAberta === categoria && (
                    <View style={styles.accordionBody}>
                      {textos.map((texto, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.textoPadraoButton}
                          onPress={() => handleSelectTextoPadrao(texto.titulo, texto.artigos)}
                        >
                          <Text style={styles.textoPadraoTitulo}>{texto.titulo}</Text>
                          <Text style={styles.textoPadraoNorma} numberOfLines={2}>
                            {texto.artigos}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Norma */}
          <View style={styles.card}>
            <Text style={styles.label}>Artigos da Norma *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={norma}
              onChangeText={setNorma}
              placeholder="Artigos da norma relacionados..."
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Plano de Ação */}
          <View style={styles.card}>
            <Text style={styles.label}>Plano de Ação (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={planoAcao}
              onChangeText={setPlanoAcao}
              placeholder="O que deve ser feito para corrigir?"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Fotos com Marca d'água Visual */}
          <View style={styles.card}>
            <Text style={styles.label}>Fotos ({fotos.length})</Text>
            
            <View style={styles.photosGrid}>
              {fotos.map((foto, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: foto.uri }} style={styles.photoThumb} />
                  
                  {/* Overlay de Data/Hora (Marca d'água Visual) */}
                  <View style={styles.watermarkContainer}>
                    <Text style={styles.watermarkText}>{foto.data}</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.deletePhotoButton}
                    onPress={() => handleRemovePhoto(index)}
                  >
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

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <MaterialIcons name="save" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Salvar Inconformidade</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL DE FOTO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Adicionar Foto</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <MaterialIcons name="close" size={24} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalOptionsContainer}>
                  <TouchableOpacity style={styles.modalOption} onPress={pickFromCamera}>
                    <View style={[styles.iconCircle, { backgroundColor: '#dbeafe' }]}>
                      <FontAwesome5 name="camera" size={24} color="#2563eb" />
                    </View>
                    <Text style={styles.modalOptionText}>Câmera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.modalOption} onPress={pickFromGallery}>
                    <View style={[styles.iconCircle, { backgroundColor: '#f3e8ff' }]}>
                      <FontAwesome5 name="images" size={24} color="#9333ea" />
                    </View>
                    <Text style={styles.modalOptionText}>Galeria</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  backButton: { padding: 4 },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#e5e7eb',
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12,
    fontSize: 14, color: '#111827', backgroundColor: '#fff',
  },
  textArea: { minHeight: 100 },
  accordionContainer: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden' },
  accordionItem: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  accordionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, backgroundColor: '#f9fafb',
  },
  accordionTitle: { fontSize: 14, fontWeight: '500', color: '#111827' },
  accordionBody: { backgroundColor: '#fff' },
  textoPadraoButton: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  textoPadraoTitulo: { fontSize: 14, fontWeight: '600', color: '#1F5F38', marginBottom: 2 },
  textoPadraoNorma: { fontSize: 12, color: '#6b7280' },
  
  // Grid de Fotos
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoWrapper: { width: 100, height: 100, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  photoThumb: { width: '100%', height: '100%' },
  
  // Estilo da Marca d'água Visual
  watermarkContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 2, alignItems: 'center'
  },
  watermarkText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  deletePhotoButton: {
    position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(220, 38, 38, 0.9)',
    width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  addPhotoButton: {
    width: 100, height: 100, borderRadius: 8, borderWidth: 2, borderColor: '#d1d5db',
    borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb',
  },
  addPhotoText: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  saveButton: {
    backgroundColor: '#2563eb', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 8, gap: 8,
  },
  saveButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 340, padding: 20,
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  modalOptionsContainer: { flexDirection: 'row', justifyContent: 'space-around', gap: 16 },
  modalOption: {
    alignItems: 'center', justifyContent: 'center', padding: 12, flex: 1, borderRadius: 12,
    backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#f3f4f6',
  },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  modalOptionText: { fontSize: 14, fontWeight: '600', color: '#4b5563' },
});