/**
 * HeldMe! — Pantalla 21 · Trabajo adicional
 * Mockup: App Móvil 5 de 11 · 1 - Trabajo adicional.
 * Muestra la versión 1 aceptada sin cambios (RNF-07) y solicita autorización
 * explícita del cliente antes de preautorizar y ejecutar el adicional (RF-16, RN-07).
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { Card, Label, PrimaryButton, SecondaryButton, TopBar } from '../ui';

export default function TrabajoAdicional({ nav, params }) {
  const profesionista = params?.profesionista ?? 'Plomería Rivera';
  const [decision, setDecision] = useState('pendiente'); // 'pendiente' | 'aceptado' | 'rechazado'
  const [cargando, setCargando] = useState(false);

  const decidir = (tipo) => {
    setCargando(true);
    setTimeout(() => {
      setDecision(tipo);
      setCargando(false);
    }, 700);
  };

  return (
    <View style={styles.screen}>
      <TopBar onBack={nav.back} />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <Text style={styles.titulo}>Trabajo adicional</Text>
        <Text style={styles.sub}>{profesionista} propone una nueva versión</Text>

        {/* Versión original conservada */}
        <Card style={styles.v1Card}>
          <Label>VERSIÓN 1 · ACEPTADA</Label>
          <View style={styles.fila}>
            <Text style={styles.concepto}>Total acordado</Text>
            <Text style={styles.monto}>$1,700.00</Text>
          </View>
          <Text style={styles.notaV1}>Se conserva sin cambios.</Text>
        </Card>

        {/* Propuesta adicional */}
        <Card selected={decision !== 'rechazado'} style={styles.v2Card}>
          <Label style={{ color: colors.navy }}>VERSIÓN 2 · ADICIONAL</Label>
          <View style={styles.fila}>
            <Text style={styles.concepto}>Cambio de llave de paso</Text>
            <Text style={styles.monto}>$150.00</Text>
          </View>
          <View style={[styles.fila, styles.filaTotal]}>
            <Text style={styles.totalLabel}>Total con adicional</Text>
            <Text style={styles.totalValor}>$1,850.00</Text>
          </View>
          <Text style={styles.notaV2}>
            El adicional no se ejecuta hasta que lo aceptes y se preautorice su monto.
          </Text>
        </Card>

        {decision === 'aceptado' ? (
          <View style={styles.estadoOk}>
            <View style={styles.estadoHeader}>
              <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
              <Text style={styles.estadoTitulo}>Adicional autorizado</Text>
            </View>
            <Text style={styles.estadoTexto}>
              Se preautorizó el adicional de $150.00 en Stripe Test Mode. El total actualizado del servicio es $1,850.00.
            </Text>
            <PrimaryButton
              label="Volver a la contratación"
              onPress={nav.back}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : decision === 'rechazado' ? (
          <View style={styles.estadoRechazo}>
            <Text style={styles.estadoTituloRechazo}>Adicional rechazado</Text>
            <Text style={styles.estadoTexto}>
              No se generó ningún cargo adicional. Se conserva la Versión 1 por $1,700.00 sin cambios.
            </Text>
            <PrimaryButton
              label="Volver a la contratación"
              onPress={nav.back}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : (
          <View style={styles.acciones}>
            <SecondaryButton
              label="Rechazar"
              disabled={cargando}
              onPress={() => decidir('rechazado')}
            />
            <PrimaryButton
              label="Aceptar adicional"
              loading={cargando}
              loadingLabel="Preautorizando adicional..."
              onPress={() => decidir('aceptado')}
            />
          </View>
        )}
      </ScrollView>
    </View>
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
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4 },
  v1Card: { marginTop: spacing.lg },
  v2Card: { marginTop: spacing.md },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 12,
  },
  concepto: { flex: 1, fontSize: 14, color: colors.navy },
  monto: {
    fontSize: 14.5,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  notaV1: { fontSize: 12.5, color: colors.textSec, marginTop: 6 },
  filaTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 10,
  },
  totalLabel: { fontSize: 14.5, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  totalValor: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  notaV2: { fontSize: 12.5, color: colors.textSec, lineHeight: 18, marginTop: 8 },
  estadoOk: {
    marginTop: spacing.lg,
    backgroundColor: '#EBF4F6',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  estadoRechazo: {
    marginTop: spacing.lg,
    backgroundColor: colors.warnBg,
    borderWidth: 1,
    borderColor: colors.warnBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  estadoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  estadoTitulo: { fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.teal },
  estadoTituloRechazo: { fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.warnText },
  estadoTexto: {
    fontSize: 13,
    color: colors.navy,
    lineHeight: 19,
    marginTop: 6,
    fontVariant: ['tabular-nums'],
  },
  acciones: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
});
