// src/components/PavimentoCard.tsx
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pavimento } from '../types';

interface PavimentoCardProps {
  pavimento: Pavimento;
  onPress: () => void;
}

export function PavimentoCard({ pavimento, onPress }: PavimentoCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        {/* Ícone representando andares/camadas */}
        <View style={styles.iconContainer}>
          <FontAwesome5 name="layer-group" size={20} color="#1F5F38" />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{pavimento.nome}</Text>
          <Text style={styles.subtitle}>Toque para ver os itens</Text>
        </View>

        <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    // Removemos o overflow hidden pois não tem mais barra de progresso
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f0fdf4', // Verde bem clarinho
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
});