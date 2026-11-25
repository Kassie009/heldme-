/**
 * HeldMe! — Pantalla 25 · Cancelar contratación
 * Mockup: App Móvil 5 de 11 · 5 - Cancelar contratación.
 * Muestra anticipación frente al umbral de 48 h, cancelación de preautorización
 * sin cargo antes del inicio y motivo opcional (RN-09, RN-15).
 */
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { Card, Field, PrimaryButton, SecondaryButton, TextInputBox, TopBar } from '../ui';

export default function CancelarContratacion({ nav, params }) {
  const folio = params?.folio ?? 'HM-2044';
  const titulo = params?.titulo ?? 'Reparación de fuga';

  const [motivo, setMotivo] = useState('Cambio de planes');
  const [cargando, setCargando] = useState(false);
  const [cancelada, setCancelada] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const confirmarCancelacion = () => {
    setCargando(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCargando(false);
      setCancelada(true);
    }, 700);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopBar
        onBack={
          cancelada ? () => nav.resetConPadre('buscar', 'contrataciones') : nav.back
        }
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <Text style={styles.titulo}>Cancelar contratación</Text>
        <Text style={styles.sub}>
          {folio} · {titulo}
        </Text>

        {/* Datos de la cita */}
        <Card style={styles.citaCard}>
          <View style={styles.fila}>
            <Text style={styles.citaLabel}>Cita</Text>
            <Text style={styles.citaValor}>26 nov 2026 · 16:00</Text>
          </View>
          <View style={[styles.fila, styles.divisor]}>
            <Text style={styles.citaLabel}>Anticipación</Text>
            <Text style={styles.citaValor}>Más de 48 horas</Text>
          </View>
        </Card>

        {/* Estado justificado / liberación de preautorización */}
        <View style={styles.infoPanel}>
          <Text style={styles.infoTitulo}>Cancelación justificada</Text>
          <Text style={styles.infoTexto}>
            Como aún no inicia el servicio, se cancela la preautorización de $700.00 sin cargo.
          </Text>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <Field label="MOTIVO (OPCIONAL)">
            <TextInputBox
              placeholder="Escribe un motivo si lo deseas"
              value={motivo}
              onChangeText={setMotivo}
              editable={!cancelada && !cargando}
              accessibilityLabel="Motivo de cancelación opcional"
            />
          </Field>
        </View>

        <Text style={styles.nota}>
          Con menos de 48 horas de anticipación podría considerarse injustificada y no podrás solicitar nuevos trabajos durante 24 horas.
        </Text>

        {cancelada ? (
          <View style={styles.okBox}>
            <View style={styles.okHeader}>
              <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
              <Text style={styles.okTitulo}>Contratación cancelada</Text>
            </View>
            <Text style={styles.okTexto}>
              Se canceló la contratación {folio} y se liberó la preautorización de $700.00 en Stripe Test Mode sin cargos.
            </Text>
            <PrimaryButton
              label="Volver a contrataciones"
              onPress={() => nav.resetConPadre('buscar', 'contrataciones')}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : (
          <View style={styles.acciones}>
            <SecondaryButton label="Volver" onPress={nav.back} disabled={cargando} />
            <PrimaryButton
              label="Confirmar cancelación"
              loading={cargando}
              loadingLabel="Cancelando contratación..."
              onPress={confirmarCancelacion}
            />
          </View>
        )}
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
  citaCard: { marginTop: spacing.lg, paddingVertical: 6 },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 12,
  },
  divisor: { borderTopWidth: 1, borderTopColor: colors.border },
  citaLabel: { fontSize: 13.5, fontFamily: F.reg, color: colors.textSec },
  citaValor: {
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  infoPanel: {
    backgroundColor: '#EBF4F6',
    borderWidth: 1,
    borderColor: '#C5DDE2',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  infoTitulo: { fontSize: 14.5, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  infoTexto: {
    fontSize: 13,
    fontFamily: F.reg,
    color: colors.navy,
    lineHeight: 19,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  nota: {
    color: colors.textSec,
    fontSize: 12.5,
    fontFamily: F.reg,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  okBox: {
    marginTop: spacing.lg,
    backgroundColor: '#EBF4F6',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  okHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  okTitulo: { fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.teal },
  okTexto: {
    fontSize: 13,
    fontFamily: F.reg,
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
