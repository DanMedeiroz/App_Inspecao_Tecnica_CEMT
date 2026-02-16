import { Stack } from 'expo-router';
import React from 'react';
import ItemDetailScreen from '../../src/screens/itens/ItemDetailScreen';

export default function ItemDetailRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ItemDetailScreen />
    </>
  );
}