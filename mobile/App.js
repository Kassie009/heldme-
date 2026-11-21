/**
 * HeldMe! — App móvil (solo frontend, pantallas no funcionales)
 * Mockups implementados (MÓVIL 01–04):
 *   01 · Acceso y registro        → src/screens/AccesoRegistro.js
 *   02 · Explorar servicios       → src/screens/ExplorarServicios.js
 *   03 · Resultados inteligentes  → src/screens/ResultadosBusqueda.js
 *   04 · Publicar una necesidad   → src/screens/PublicarNecesidad.js
 *
 * Navegación: useState simple, sin react-navigation (se integrará después).
 * La identidad visual sigue el Manual de identidad (src/theme.js).
 */
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AccesoRegistro from './src/screens/AccesoRegistro';
import ExplorarServicios from './src/screens/ExplorarServicios';
import ResultadosBusqueda from './src/screens/ResultadosBusqueda';
import PublicarNecesidad from './src/screens/PublicarNecesidad';
import { colors } from './src/theme';

export default function App() {
  const [screen, setScreen] = useState('acceso');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top']}>
        <StatusBar style="dark" />
        {screen === 'acceso' && (
          <AccesoRegistro onEntrar={() => setScreen('explorar')} />
        )}
        {screen === 'explorar' && (
          <ExplorarServicios
            onBuscar={() => setScreen('resultados')}
            onPublicar={() => setScreen('publicar')}
          />
        )}
        {screen === 'resultados' && (
          <ResultadosBusqueda onBack={() => setScreen('explorar')} />
        )}
        {screen === 'publicar' && (
          <PublicarNecesidad onBack={() => setScreen('explorar')} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
});
