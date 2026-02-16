// src/screens/obras/ObrasListScreen.tsx
import React from 'react';
// ADICIONEI: Image na importação
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ObraCard } from '../../components/ObraCard';
import { DOCUMENTOS_VENCENDO_MOCK, OBRAS_MOCK } from '../../constants/mockData';

export default function ObrasListScreen() {
  const router = useRouter();
  const totalAlertas = Object.values(DOCUMENTOS_VENCENDO_MOCK).reduce((a, b) => a + b, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Verde com Logo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Obras</Text>
        
        {/* Container branco arredondado para a logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.logoImage}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Card de Alerta Geral */}
        {totalAlertas > 0 && (
          <TouchableOpacity 
            style={styles.alertCard}
            onPress={() => router.push("/documentos/vencendo" as any)}
          >
            <View style={styles.alertIconBg}>
              <MaterialIcons name="warning" size={24} color="#dc2626" />
            </View>
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Documentos Vencendo</Text>
              <Text style={styles.alertSubtitle}>
                {totalAlertas} documentos requerem atenção
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#991b1b" />
          </TouchableOpacity>
        )}

        {/* Lista de Obras */}
        <FlatList
          data={OBRAS_MOCK}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <ObraCard 
              obra={item}
              docsVencendo={DOCUMENTOS_VENCENDO_MOCK[item.id] || 0}
              onPressInspecoes={() => router.push({
              pathname: "/obras/[id]/inspecoes", // O caminho exato do arquivo na pasta app
              params: { id: item.id } // O valor que substitui o [id]
            })}
              onPressDocumentosObra={() => console.log(`Abrir funcionários da obra ${item.id}`)}
            />
          )}
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
    // MUDANÇAS NO HEADER:
    flexDirection: 'row', // Itens lado a lado
    justifyContent: 'space-between', // Espaço entre título e logo
    alignItems: 'center', // Centralizar verticalmente
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1F5F38', // Verde do seu print
  },
  headerTitle: {
    fontSize: 24, // Aumentei um pouco para destacar
    fontWeight: 'bold',
    color: '#fff',
  },
  // ESTILOS NOVOS DA LOGO:
  logoContainer: {
    backgroundColor: 'white',
    padding: 6, // Espaço branco em volta da logo
    borderRadius: 20, // Arredondamento
    shadowColor: "#000", // Uma sombra leve para destacar do verde
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },
  logoImage: {
    width: 36, // Tamanho da imagem
    height: 36,
    resizeMode: 'contain', // Garante que a logo caiba sem distorcer
  },
  content: {
    flex: 1,
    padding: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  alertIconBg: {
    width: 40,
    height: 40,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f1d1d',
  },
  alertSubtitle: {
    fontSize: 14,
    color: '#991b1b',
    marginTop: 2,
  },
});