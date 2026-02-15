import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      {/* Aqui definimos as configurações globais das telas.
        headerShown: false esconde o cabeçalho padrão feio do Android, 
        pois criaremos nossos próprios headers nas telas.
      */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}