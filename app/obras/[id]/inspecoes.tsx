// app/obras/[id]/inspecoes.tsx
import { Stack } from 'expo-router';
import React from 'react';
import InspecoesListScreen from '../../../src/screens/inspecoes/InspecoesListScreen';

export default function InspecoesRoute() {
  return (
    <>
      {/* Isso esconde o cabeçalho padrão do Expo */}
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Renderiza sua tela com o cabeçalho verde */}
      <InspecoesListScreen />
    </>
  );
}