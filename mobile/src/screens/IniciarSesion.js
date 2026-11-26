/**
 * HeldMe! — Pantalla 2 · Iniciar sesión
 * Mockup: App Móvil 1 de 11 · 2 - Iniciar sesión.
 * Si la cuenta es de otro tipo, el sistema indicará con cuál debe entrar.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, F } from '../theme';
import {
  PrimaryButton, SecondaryButton, LogoMark, Chip, Field,
  TextInputBox, ErrorText, TextLink,
} from '../ui';
import { buscarCuenta, verificarCredenciales } from '../cuentas';

export default function IniciarSesion({ nav }) {
  const [tipo, setTipo] = useState('cliente');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const entrar = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())) {
      setError('Escribe el correo con el que registraste tu cuenta.');
      return;
    }
    const dominio = correo.trim().toLowerCase().split('@')[1];
    if (dominio.endsWith('.con') || dominio.endsWith('.cm') || dominio.endsWith('.cor')) {
      setError('¿Quisiste decir ".com"? Revisa tu correo.');
      return;
    }
    if (!clave) {
      setError('Escribe tu contraseña.');
      return;
    }
    // Cuenta registrada (simulación en memoria): credenciales y tipo (RF-01, RNF-01).
    const resultado = verificarCredenciales(correo, clave);
    if (resultado.error) {
      const cuenta = resultado.cuenta;
      if (cuenta && cuenta.tipo !== tipo) {
        // Rechaza el acceso e indica el tipo correcto.
        setTipo(cuenta.tipo);
        setError(
          `Esta cuenta es de tipo ${cuenta.tipo === 'cliente' ? 'Cliente' : 'Profesionista'}. Ya está seleccionado; presiona Entrar de nuevo.`
        );
      } else {
        setError(resultado.error);
      }
      return;
    }
    const cuenta = resultado.cuenta;
    if (cuenta.tipo !== tipo) {
      // Rechaza el acceso e indica el tipo correcto.
      setTipo(cuenta.tipo);
      setError(
        `Esta cuenta es de tipo ${cuenta.tipo === 'cliente' ? 'Cliente' : 'Profesionista'}. Ya está seleccionado; presiona Entrar de nuevo.`
      );
      return;
    }
    // Cada rol entra a su pantalla de inicio (RF-02).
    const destino = cuenta.tipo === 'profesionista' ? 'misServiciosPro' : 'buscar';
    setError('');
    // Simulación sin backend: breve carga y navegación.
    setCargando(true);
    setTimeout(() => {
      nav.reset(destino, { tipo: cuenta.tipo, nombre: cuenta.nombre });
      setCargando(false);
    }, 900);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <View style={styles.hero}>
        <LogoMark />
      </View>

      <Text style={styles.titulo}>Iniciar sesión</Text>
      <Text style={styles.sub}>Elige el tipo con el que creaste tu cuenta.</Text>

      <View style={styles.chips}>
        <Chip label="Cliente" active={tipo === 'cliente'} onPress={() => setTipo('cliente')} />
        <Chip label="Profesionista" active={tipo === 'profesionista'} onPress={() => setTipo('profesionista')} />
      </View>

      <Field label="CORREO" style={{ marginTop: spacing.md }}>
        <TextInputBox
          placeholder="tucorreo@correo.mx"
          value={correo}
          onChangeText={(v) => { setCorreo(v); setError(''); }}
          keyboard="email-address"
          invalid={!!error}
        />
      </Field>

      <Field label="CONTRASEÑA">
        <TextInputBox
          placeholder="••••••••"
          value={clave}
          onChangeText={(v) => { setClave(v); setError(''); }}
          secureTextEntry
          invalid={!!error}
        />
      </Field>

      <ErrorText>{error}</ErrorText>

      <Text style={styles.nota}>
        Si tu cuenta es de otro tipo, te indicaremos con cuál debes entrar.
      </Text>

      <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
        <SecondaryButton label="Crear cuenta" onPress={() => nav.reset('tipo')} />
        <PrimaryButton label="Entrar" loading={cargando} loadingLabel="Entrando..." onPress={entrar} />
      </View>

      <View style={styles.recuperar}>
        <TextLink>¿Olvidaste tu contraseña?</TextLink>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.xl, paddingBottom: spacing.xl * 2 },
  hero: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.lg },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy, textAlign: 'center' },
  sub: { color: colors.textSec, fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: spacing.lg },
  chips: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  nota: {
    color: colors.textSec,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  recuperar: { alignItems: 'center', marginTop: spacing.xl },
});
