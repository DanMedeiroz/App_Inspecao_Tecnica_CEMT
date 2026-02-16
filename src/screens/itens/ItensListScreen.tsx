import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ItemCard } from '../../components/ItemCard';
import { ITENS_MOCK, PAVIMENTOS_MOCK } from '../../constants/mockData';

export default function ItensListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const pavimentoId = id as string;

  const pavimento = PAVIMENTOS_MOCK.find(p => p.id === pavimentoId);
  const itens = ITENS_MOCK.filter(i => i.pavimentoId === pavimentoId);

  if (!pavimento) {
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

      {/* Info do Pavimento */}
      <View style={styles.infoBar}>
        <Text style={styles.infoTitle}>{pavimento.nome}</Text>
        <Text style={styles.infoSubtitle}>
          {itens.length} inconformidades encontradas
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="check-circle-outline" size={48} color="#16a34a" />
              <Text style={styles.emptyTitle}>Tudo certo por aqui!</Text>
              <Text style={styles.emptyText}>Nenhuma inconformidade registrada neste pavimento.</Text>
            </View>
          }
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
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  infoSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },
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
});