/**
 * HeldMe! — Pantalla 20 · Pago no autorizado
 * Mockup: App Móvil 4 de 11 · 4 - Pago no autorizado.
 * Manejo de rechazo de preautorización en Stripe Test Mode y reintento sin
 * confirmar la contratación hasta que la tarjeta sea aprobada (RN-08, RNF-09).
 */
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import {
  ErrorText,
  Field,
  PrimaryButton,
  SecondaryButton,
  TextInputBox,
  TextLink,
  TopBar,
} from '../ui';

const formatTarjeta = (valor) => {
  const digitos = valor.replace(/\D/g, '').slice(0, 16);
  return digitos.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export default function PagoNoAutorizado({ nav, params }) {
  const folio = params?.folio ?? 'HM-2044';
  const titulo = params?.titulo ?? 'Reparación de fuga';
  const profesionista = params?.profesionista ?? 'Plomería Rivera';
  const monto = params?.monto ?? '$700.00';

  const [tarjeta, setTarjeta] = useState('4000 0000 0000 0002');
  const [error, setError] = useState('');
  const [aprobado, setAprobado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const reintentar = () => {
    const digitos = tarjeta.replace(/\D/g, '');
    if (digitos.length < 16) {
      setError('Escribe los 16 dígitos de la tarjeta de prueba.');
      return;
    }
    setError('');
    setCargando(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCargando(false);
      if (digitos.endsWith('0002')) {
        setError('La tarjeta de prueba 0002 simula rechazo. Prueba con 4242 4242 4242 4242.');
        return;
      }
      if (digitos !== '4242424242424242') {
        setError(
          'Tarjeta de prueba no autorizada. Usa 4242 4242 4242 4242 para simular la aprobación.',
        );
        return;
      }
      setAprobado(true);
    }, 800);
  };

  const irAContratacion = () => {
    const destinoParams = { folio, titulo, profesionista };
    if (nav.irAContratacionDetalle) {
      nav.irAContratacionDetalle(destinoParams);
    } else {
      nav.replace('contratacionDetalle', destinoParams);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopBar onBack={() => { if (!cargando) nav.back(); }} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <Text style={styles.titulo}>
          {aprobado ? 'Preautorización aprobada' : 'Pago no autorizado'}
        </Text>
        <Text style={styles.sub}>{folio} · Tarjeta de prueba</Text>

        {aprobado ? (
          <View style={styles.okBox}>
            <View style={styles.bannerHeader}>
              <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
              <Text style={styles.okTitulo}>Preautorización aprobada por {monto}</Text>
            </View>
            <Text style={styles.okTexto}>
              Tu contratación quedó confirmada en Stripe Test Mode. El monto solo se captura al validar el código de finalización.
            </Text>
          </View>
        ) : (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitulo}>No se pudo preautorizar {monto}</Text>
            <Text style={styles.errorDetalle}>
              La contratación no se confirmó. No se realizó ningún cargo.
            </Text>
          </View>
        )}

        <Field label="TARJETA DE PRUEBA">
          <TextInputBox
            placeholder="4242 4242 4242 4242"
            value={tarjeta}
            onChangeText={(v) => {
              setTarjeta(formatTarjeta(v));
              setError('');
            }}
            keyboard="number-pad"
            maxLength={19}
            editable={!aprobado && !cargando}
            invalid={!!error}
            accessibilityLabel="Número de tarjeta de prueba"
          />
          <ErrorText>{error}</ErrorText>
        </Field>

        <Text style={styles.ayuda}>
          Simulación en Stripe Test Mode. Usa 4242 4242 4242 4242 para aprobar la retención de prueba.
        </Text>

        {!aprobado && !cargando ? (
          <TextLink
            onPress={() => {
              setTarjeta('4242 4242 4242 4242');
              setError('');
            }}
            style={{ marginTop: spacing.sm }}
          >
            Usar tarjeta de prueba aprobada (4242)
          </TextLink>
        ) : null}

        <View style={styles.acciones}>
          {aprobado ? (
            <PrimaryButton
              label="Ir a la contratación"
              onPress={irAContratacion}
            />
          ) : (
            <>
              <SecondaryButton label="Volver" onPress={nav.back} disabled={cargando} />
              <PrimaryButton
                label="Reintentar con otra tarjeta"
                loading={cargando}
                loadingLabel="Preautorizando..."
                onPress={reintentar}
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: {
    color: colors.textSec,
    fontSize: 13,
    fontFamily: F.reg,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  errorBox: {
    backgroundColor: '#FDF3F1',
    borderWidth: 1,
    borderColor: '#EBCAC4',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  errorTitulo: {
    fontSize: 14.5,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.error,
    fontVariant: ['tabular-nums'],
  },
  errorDetalle: {
    fontSize: 13,
    fontFamily: F.reg,
    color: colors.navy,
    lineHeight: 19,
    marginTop: 4,
  },
  okBox: {
    backgroundColor: '#EBF4F6',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  bannerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  okTitulo: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.teal,
    fontVariant: ['tabular-nums'],
  },
  okTexto: { fontSize: 13, fontFamily: F.reg, color: colors.navy, lineHeight: 19, marginTop: 6 },
  ayuda: {
    fontSize: 12,
    fontFamily: F.reg,
    color: colors.textSec,
    lineHeight: 17,
    fontVariant: ['tabular-nums'],
  },
  acciones: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
});
