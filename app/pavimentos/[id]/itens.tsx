import { Stack } from 'expo-router';
import React from 'react';
import ItensListScreen from '../../../src/screens/itens/ItensListScreen';

export default function ItensRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ItensListScreen />
    </>
  );
}