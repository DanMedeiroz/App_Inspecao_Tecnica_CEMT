// src/screens/documentos/DocumentosObraScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FUNCIONARIOS_MOCK, OBRAS_MOCK } from '../../constants/mockData';
import { Documento, Funcionario } from '../../types';

export default function DocumentosObraScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const obraId = id as string;

  const obra = OBRAS_MOCK.find(o => o.id === obraId);
  const funcionarios = FUNCIONARIOS_MOCK.filter(f => f.empresa_id === obraId); // Usando empresa_id como fallback no mock

  // Filtros e Cálculos
  const getDocumentosVencendo = (funcionario: Funcionario) => {
    return funcionario.documentos.filter(
      doc => doc.status === 'vencido' || doc.status === 'vence-30-dias'
    );
  };

  const totalVencendo = funcionarios.reduce((total, func) => {
    return total + getDocumentosVencendo(func).length;
  }, 0);

  // Helpers Visuais
  const getStatusColor = (status: Documento['status']) => {
    if (status === 'vencido') return { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', icon: 'error' as const };
    if (status === 'vence-30-dias') return { bg: '#fefce8', border: '#fde047', text: '#ca8a04', icon: 'access-time' as const };
    return { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', icon: 'check-circle' as const };
  };

  const getStatusText = (status: Documento['status']) => {
    if (status === 'vencido') return 'Vencido';
    if (status === 'vence-30-dias') return 'Vence ~ 30d';
    return 'Regular';
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDaysDiff = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const vencimento = new Date(dateStr + 'T00:00:00');
    const diffTime = vencimento.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (!obra) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Obra não encontrada</Text>
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
        <Text style={styles.headerTitle}>Documentos</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Info da Obra (Barra Branca) */}
      <View style={styles.infoBar}>
        <Text style={styles.obraTitle}>{obra.nome}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <FontAwesome5 name="users" size={14} color="#6b7280" />
            <Text style={styles.statText}>{funcionarios.length} funcionários</Text>
          </View>
          
          {totalVencendo > 0 && (
            <View style={styles.statItem}>
              <MaterialIcons name="warning" size={16} color="#dc2626" />
              <Text style={[styles.statText, { color: '#dc2626', fontWeight: '600' }]}>
                {totalVencendo} documentos vencendo
              </Text>
            </View>
          )}
        </View>
      </View>

      <FlatList 
        data={funcionarios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={({ item: funcionario }) => {
          const docsVencendo = getDocumentosVencendo(funcionario);

          return (
            <View style={styles.card}>
              {/* Cabeçalho do Card (Funcionário) */}
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.funcName}>{funcionario.nome}</Text>
                  <Text style={styles.funcRole}>{funcionario.cargo_id || 'N/A'}</Text>
                  {/* CPF fictício para layout */}
                  <Text style={styles.cpfText}>CPF: 000.000.000-00</Text>
                </View>

                {docsVencendo.length > 0 && (
                  <View style={styles.alertBadge}>
                    <Text style={styles.alertBadgeText}>
                      {docsVencendo.length} alerta{docsVencendo.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>

              {/* Lista de Documentos */}
              <View style={styles.docsContainer}>
                <Text style={styles.docsTitle}>DOCUMENTOS ({funcionario.documentos.length})</Text>
                
                {funcionario.documentos.map((doc) => {
                  const style = getStatusColor(doc.status);
                  const dias = getDaysDiff(doc.vence_em);

                  return (
                    <View key={doc.id} style={[styles.docItem, { backgroundColor: style.bg, borderColor: style.border }]}>
                      
                      <View style={styles.docRow}>
                        <View style={styles.docIconContainer}>
                          <MaterialIcons name={style.icon} size={20} color={style.text} />
                        </View>
                        
                        <View style={{ flex: 1 }}>
                          <Text style={styles.docType}>{doc.descricao}</Text>
                          <Text style={styles.docDate}>Vencimento: {formatDate(doc.vence_em)}</Text>
                          
                          {/* Mensagem de Dias */}
                          {doc.status === 'vencido' && (
                            <Text style={[styles.statusMsg, { color: style.text }]}>
                              Vencido há {Math.abs(dias)} dias
                            </Text>
                          )}
                          {doc.status === 'vence-30-dias' && (
                            <Text style={[styles.statusMsg, { color: style.text }]}>
                              Vence em {dias} dias
                            </Text>
                          )}
                        </View>

                        <View style={{ justifyContent: 'center' }}>
                          <Text style={[styles.statusTag, { color: style.text }]}>
                            {getStatusText(doc.status)}
                          </Text>
                        </View>
                      </View>

                    </View>
                  );
                })}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#6b7280' }}>
            Nenhum funcionário cadastrado nesta obra.
          </Text>
        }
      />
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
  
  infoBar: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  obraTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  statsRow: { flexDirection: 'row', gap: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 14, color: '#6b7280' },

  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  funcName: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  funcRole: { fontSize: 14, color: '#4b5563', marginTop: 2 },
  cpfText: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  
  alertBadge: { backgroundColor: '#fef2f2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  alertBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#dc2626' },

  docsContainer: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12 },
  docsTitle: { fontSize: 11, fontWeight: 'bold', color: '#6b7280', marginBottom: 8, letterSpacing: 0.5 },
  
  docItem: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 },
  docRow: { flexDirection: 'row', gap: 12 },
  docIconContainer: { marginTop: 2 },
  docType: { fontSize: 14, fontWeight: 'bold', color: '#374151' },
  docDate: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  statusMsg: { fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  statusTag: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
});