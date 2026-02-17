import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        {/* Ícone de Alerta Padrão (Vermelho para Inconformidade) */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#dc2626" />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>
              {item.nome}
            </Text>
          </View>

          {/* Preview do Artigo */}
          {!!item.descricao && (
            <Text style={styles.articlePreview} numberOfLines={2}>
              {item.descricao}
            </Text>
          )}

          {/* Contador de Fotos */}
          {item.fotos && item.fotos.length > 0 && (
            <View style={styles.photoContainer}>
              <FontAwesome5 name="camera" size={12} color="#6b7280" />
              <Text style={styles.photoText}>
                {item.fotos.length} {item.fotos.length === 1 ? 'foto' : 'fotos'}
              </Text>
            </View>
          )}
        </View>

        <MaterialCommunityIcons name="chevron-right" size={24} color="#e5e7eb" />
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
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  articlePreview: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 2,
    lineHeight: 18,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  photoText: {
    fontSize: 12,
    color: '#6b7280',
  },
});