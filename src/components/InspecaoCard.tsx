// src/components/InspecaoCard.tsx
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Inspecao } from '../types';

interface InspecaoCardProps {
  inspecao: Inspecao;
  onPress: () => void;
}

export function InspecaoCard({ inspecao, onPress }: InspecaoCardProps) {
  // Formatação de Data e Hora
  const dataObj = new Date(inspecao.data);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR');
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        {/* Ícone Azul */}
        <View style={styles.iconContainer}>
          <FontAwesome5 name="clipboard-list" size={24} color="#2563eb" />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            {/* Título Limpo */}
            <Text style={styles.title}>Relatório de Inspeção</Text>
            
            {/* Badge com Data e Hora (Cinza neutro) */}
            <View style={styles.dateBadge}>
              <MaterialCommunityIcons name="clock-outline" size={12} color="#4b5563" style={{ marginRight: 4 }} />
              <Text style={styles.dateText}>
                {dataFormatada} • {horaFormatada}
              </Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Inspetor: {inspecao.tecnico}</Text>
        </View>
        
        {/* Seta para direita */}
        <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#dbeafe', // Azul claro
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  headerRow: {
    flexDirection: 'column', // Mudei para coluna para a data ficar embaixo ou em cima se preferir, 
    // mas vamos manter row se quiser lado a lado. 
    // VOU MANTER COLUMN ALINHADA A ESQUERDA PARA FICAR MAIS ORGANIZADO COM A DATA
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // Cinza bem claro
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start', // Ocupa só o espaço necessário
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
});