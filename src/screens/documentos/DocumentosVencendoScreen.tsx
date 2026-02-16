// src/screens/documentos/DocumentosVencendoScreen.tsx
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FUNCIONARIOS_MOCK, OBRAS_MOCK } from '../../constants/mockData';
import { Documento } from '../../types';

interface DocumentoVencendoInfo {
  funcionarioNome: string;
  funcionarioCargo: string;
  obraNome: string;
  obraId: string;
  documento: Documento;
}

export default function DocumentosVencendoScreen() {
  const router = useRouter();

  // Lógica de Processamento dos Dados
  const getDocumentosVencendo = (): DocumentoVencendoInfo[] => {
    const docs: DocumentoVencendoInfo[] = [];

    FUNCIONARIOS_MOCK.forEach((funcionario) => {
      const obra = OBRAS_MOCK.find(o => o.id === funcionario.obraId);
      
      funcionario.documentos.forEach((doc) => {
        if (doc.status === 'vencido' || doc.status === 'vence-30-dias') {
          docs.push({
            funcionarioNome: funcionario.nome,
            funcionarioCargo: funcionario.cargo,
            obraNome: obra?.nome || 'Obra não encontrada',
            obraId: funcionario.obraId,
            documento: doc
          });
        }
      });
    });

    // Ordenar: Vencidos primeiro, depois os que vão vencer
    return docs.sort((a, b) => {
      return new Date(a.documento.dataVencimento).getTime() - new Date(b.documento.dataVencimento).getTime();
    });
  };

  const documentosVencendo = getDocumentosVencendo();

  // Agrupar por obra
  const documentosPorObra = documentosVencendo.reduce((acc, doc) => {
    if (!acc[doc.obraId]) {
      acc[doc.obraId] = {
        obraNome: doc.obraNome,
        documentos: []
      };
    }
    acc[doc.obraId].documentos.push(doc);
    return acc;
  }, {} as Record<string, { obraNome: string; documentos: DocumentoVencendoInfo[] }>);

  // Utilitários de Data e UI
  const formatDate = (dateStr: string) => {
    // Truque para evitar problemas de fuso horário ao criar data de string YYYY-MM-DD
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDaysDiff = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera hora atual
    const vencimento = new Date(dateStr + 'T00:00:00'); // Garante hora zerada local
    
    const diffTime = vencimento.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documentos Vencendo</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Banner de Resumo */}
        <View style={styles.summaryBanner}>
          <View style={styles.summaryRow}>
            <MaterialIcons name="warning" size={24} color="#dc2626" />
            <Text style={styles.summaryTitle}>
              {documentosVencendo.length} documentos requerem atenção
            </Text>
          </View>
          <Text style={styles.summarySubtitle}>
            Documentos vencidos ou que vencem nos próximos 30 dias
          </Text>
        </View>

        {/* Lista Agrupada por Obra */}
        {Object.entries(documentosPorObra).map(([obraId, { obraNome, documentos }]) => (
          <View key={obraId} style={styles.section}>
            
            {/* Cabeçalho da Obra */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{obraNome}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {documentos.length} {documentos.length === 1 ? 'doc' : 'docs'}
                </Text>
              </View>
            </View>

            {/* Lista de Cards de Funcionários */}
            {documentos.map((info, index) => {
              const diffDays = getDaysDiff(info.documento.dataVencimento);
              const isVencido = info.documento.status === 'vencido';

              return (
                <View key={`${info.funcionarioNome}-${index}`} style={[
                  styles.card,
                  isVencido ? styles.cardBorderRed : styles.cardBorderYellow
                ]}>
                  <View style={styles.cardHeader}>
                    {isVencido ? (
                      <MaterialIcons name="error" size={24} color="#dc2626" />
                    ) : (
                      <MaterialIcons name="access-time" size={24} color="#ca8a04" />
                    )}
                    <View style={styles.cardHeaderText}>
                      <Text style={styles.funcName}>{info.funcionarioNome}</Text>
                      <Text style={styles.funcRole}>{info.funcionarioCargo}</Text>
                    </View>
                  </View>

                  {/* Detalhe do Documento (Box interno) */}
                  <View style={styles.docBox}>
                    <View style={styles.docInfoRow}>
                      <FontAwesome5 name="file-alt" size={14} color="#4b5563" />
                      <Text style={styles.docType}>{info.documento.tipo}</Text>
                    </View>
                    
                    <Text style={styles.docDate}>
                      Vencimento: {formatDate(info.documento.dataVencimento)}
                    </Text>

                    {/* Mensagem de Status */}
                    {isVencido ? (
                      <Text style={styles.statusTextRed}>
                        🚨 Vencido há {Math.abs(diffDays)} dias
                      </Text>
                    ) : (
                      <Text style={styles.statusTextYellow}>
                        ⚠️ Vence em {diffDays} dias
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {/* Empty State */}
        {documentosVencendo.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <FontAwesome5 name="check" size={32} color="#16a34a" />
            </View>
            <Text style={styles.emptyTitle}>Tudo em dia!</Text>
            <Text style={styles.emptyText}>Não há documentos vencendo.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  scrollContent: { paddingBottom: 20 },
  
  // Banner
  summaryBanner: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#dc2626' },
  summarySubtitle: { fontSize: 14, color: '#6b7280' },

  // Seção de Obra
  section: { marginBottom: 24, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  badge: { backgroundColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  badgeText: { fontSize: 12, color: '#374151', fontWeight: '500' },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12,
    borderLeftWidth: 4, // A cor da borda vem da lógica inline
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  cardBorderRed: { borderLeftColor: '#dc2626' },
  cardBorderYellow: { borderLeftColor: '#ca8a04' },
  
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  cardHeaderText: { flex: 1 },
  funcName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  funcRole: { fontSize: 14, color: '#6b7280' },

  // Box do Documento
  docBox: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  docInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  docType: { fontSize: 14, fontWeight: '600', color: '#374151' },
  docDate: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  statusTextRed: { fontSize: 12, fontWeight: 'bold', color: '#dc2626' },
  statusTextYellow: { fontSize: 12, fontWeight: 'bold', color: '#b45309' },

  // Empty State
  emptyContainer: { alignItems: 'center', marginTop: 60, padding: 20 },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  emptyText: { color: '#6b7280', marginTop: 4 },
});