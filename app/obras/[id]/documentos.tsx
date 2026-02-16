import { Stack } from 'expo-router';
import React from 'react';
import DocumentosObraScreen from '../../../src/screens/documentos/DocumentosObraScreen';

export default function DocumentosObraRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <DocumentosObraScreen />
    </>
  );
}