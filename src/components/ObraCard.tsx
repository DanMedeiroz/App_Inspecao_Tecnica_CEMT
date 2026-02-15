// src/components/ObraCard.tsx
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Obra } from '../types';

interface ObraCardProps {
  obra: Obra;
  docsVencendo: number;
  onPressInspecoes: () => void;
  onPressDocumentosObra: () => void;
}

export function ObraCard({ obra, docsVencendo, onPressInspecoes, onPressDocumentosObra }: ObraCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Ícone do Prédio */}
        <View style={styles.iconContainer}>
          <FontAwesome5 name="building" size={24} color="#ea580c" />
        </View>

        {/* Informações */}
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{obra.nome}</Text>
          <Text style={styles.endereco}>{obra.endereco}</Text>
          <Text style={styles.responsavel}>Responsável: {obra.tecnico}</Text>

          {docsVencendo > 0 && (
            <View style={styles.alertContainer}>
              <MaterialCommunityIcons name="alert" size={14} color="#dc2626" />
              <Text style={styles.alertText}>
                {docsVencendo} documento{docsVencendo > 1 ? 's' : ''} vencendo
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={onPressInspecoes}>
          <FontAwesome5 name="clipboard-check" size={16} color="#1f673a" />
          <Text style={styles.buttonTextGreen}>Inspeções</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={onPressDocumentosObra}>
          <FontAwesome5 name="users" size={16} color="#ce2222" />
          <Text style={styles.buttonTextRed}>Documentos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    // Sombra (Shadow) estilo card do seu print
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#ffedd5', // Laranja bem claro
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  endereco: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 2,
  },
  responsavel: {
    fontSize: 13,
    color: '#6b7280',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  alertText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  buttonGreen: {
    backgroundColor: '#daebde',
  },
  buttonRed: {
    backgroundColor: '#ffe8e8',
  },
  buttonTextGreen: {
    color: '#1f673a',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonTextRed: {
    color: '#ce2222',
    fontWeight: '600',
    fontSize: 14,
  },
});