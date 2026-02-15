// app/index.tsx
import React from 'react';
// Agora só um ponto-ponto funciona, pois estamos na raiz de 'app'
import ObrasListScreen from '../src/screens/obras/ObrasListScreen';

export default function Index() {
  return <ObrasListScreen />;
}