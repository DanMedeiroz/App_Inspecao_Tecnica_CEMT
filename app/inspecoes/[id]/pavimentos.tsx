import { Stack } from 'expo-router';
import React from 'react';
import PavimentosListScreen from '../../../src/screens/inspecoes/PavimentosListScreen';

export default function PavimentosRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PavimentosListScreen />
    </>
  );
}