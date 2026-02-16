import { Stack } from 'expo-router';
import React from 'react';
import DocumentosVencendoScreen from '../../src/screens/documentos/DocumentosVencendoScreen';

export default function DocumentosRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <DocumentosVencendoScreen />
    </>
  );
}