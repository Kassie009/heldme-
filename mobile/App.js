/**
 * HeldMe! — App móvil (solo frontend)
 * Pantallas 1-13 del mockup (App Móvil · 11 de 11 páginas):
 *   1  Tipo de cuenta                → src/screens/TipoCuenta.js
 *   2  Iniciar sesión                → src/screens/IniciarSesion.js
 *   3  Registro de cliente           → src/screens/RegistroCliente.js
 *   4  Cuenta de profesionista (1)   → src/screens/RegistroProfesionista.js
 *   5  Perfil y evidencia (2)        → src/screens/PerfilProfesional.js
 *   6  Menú lateral                  → src/screens/MenuLateral.js (drawer)
 *   7  Buscar + autocompletado       → src/screens/Buscar.js
 *   8  Resultados con orientación IA → src/screens/ResultadosIA.js
 *   9  Cambiar categoría             → src/screens/CambiarCategoria.js
 *   10 Sin resultados / convencional → src/screens/SinResultados.js
 *   11 Publicar necesidad            → src/screens/PublicarNecesidad.js
 *   12 Mis solicitudes               → src/screens/MisSolicitudes.js
 *   13 Cotizaciones recibidas        → src/screens/CotizacionesRecibidas.js
 *
 * Navegación: pila simple con push/back/reset (useState), sin react-navigation.
 * El menú lateral se renderiza como overlay sobre la pantalla anterior.
 * Los botones de atrás funcionan y regresan a la pantalla anterior real.
 */
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import TipoCuenta from './src/screens/TipoCuenta';
import IniciarSesion from './src/screens/IniciarSesion';
import RegistroCliente from './src/screens/RegistroCliente';
import RegistroProfesionista from './src/screens/RegistroProfesionista';
import PerfilProfesional from './src/screens/PerfilProfesional';
import MenuLateral from './src/screens/MenuLateral';
import PanelProfesionista from './src/screens/PanelProfesionista';
import Buscar from './src/screens/Buscar';
import ResultadosIA from './src/screens/ResultadosIA';
import CambiarCategoria from './src/screens/CambiarCategoria';
import SinResultados from './src/screens/SinResultados';
import PublicarNecesidad from './src/screens/PublicarNecesidad';
import MisSolicitudes from './src/screens/MisSolicitudes';
import CotizacionesRecibidas from './src/screens/CotizacionesRecibidas';
import Chat from './src/screens/Chat';
import { colors, F } from './src/theme';

const pantallas = {
  tipo: TipoCuenta,
  iniciarSesion: IniciarSesion,
  registroCliente: RegistroCliente,
  registroProfesionista: RegistroProfesionista,
  perfilProfesional: PerfilProfesional,
  buscar: Buscar,
  panelProfe: PanelProfesionista,
  resultadosIA: ResultadosIA,
  cambiarCategoria: CambiarCategoria,
  sinResultados: SinResultados,
  publicar: PublicarNecesidad,
  misSolicitudes: MisSolicitudes,
  cotizaciones: CotizacionesRecibidas,
  chat: Chat,
};

export default function App() {
  const [fuentes] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const [pila, setPila] = useState([{ s: 'tipo', params: {} }]);

  if (!fuentes) return null; // Espera a que cargue Plus Jakarta Sans

  const nav = {
    push: (s, params = {}) => setPila((p) => [...p, { s, params }]),
    back: () => setPila((p) => (p.length > 1 ? p.slice(0, -1) : p)),
    reset: (s, params = {}) => setPila([{ s, params }]),
    replace: (s, params = {}) =>
      setPila((p) => [...p.slice(0, -1), { s, params }]),
    openMenu: () =>
      setPila((p) => {
        // Si el menú ya está abierto, no se vuelve a abrir (evita menú sobre menú).
        if (p[p.length - 1].s === 'menu') return p;
        return [...p, { s: 'menu', params: p[p.length - 1].params }];
      }),
    // Abre una pantalla con un padre debajo para que el botón atrás funcione.
    resetConPadre: (padre, destino, params = {}) =>
      setPila([{ s: padre, params }, { s: destino, params }]),
  };

  const actual = pila[pila.length - 1];

  // El menú lateral se dibuja sobre la pantalla que lo abrió.
  const fondo = actual.s === 'menu' ? pila[pila.length - 2] : actual;
  const PantallaFondo = pantallas[fondo.s] || pantallas.tipo;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <View style={styles.contenedor}>
          <PantallaFondo nav={nav} params={fondo.params} />
          {actual.s === 'menu' && <MenuLateral nav={nav} params={actual.params} />}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  contenedor: { flex: 1, overflow: 'hidden' },
});
