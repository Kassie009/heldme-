/**
 * HeldMe! — Pantalla 22 · Código de finalización
 * Mockup: App Móvil 5 de 11 · 2 - Código de finalización.
 * Código único de un solo uso con vigencia de 24 horas para confirmar el
 * cierre del servicio y habilitar la calificación (RF-20, RN-08).
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { Card, Label, PrimaryButton, TextLink, TopBar } from '../ui';

export default function CodigoFinalizacion({ nav, params }) {
  const folio = params?.folio ?? 'HM-2044';
  const profesionista = params?.profesionista ?? 'Plomería Rivera';
  const [validando, setValidando] = useState(false);

  const continuarCalificacion = () => {
    setValidando(true);
    setTimeout(() => {
      setValidando(false);
      nav.push('calificar', { folio, profesionista });
    }, 650);
  };

  return (
    <View style={styles.screen}>
      <TopBar onBack={nav.back} />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <Text style={styles.titulo}>Código de finalización</Text>
        <Text style={styles.sub}>
          {folio} · El profesional marcó el servicio como realizado
        </Text>

        {/* Bloque protagonista con código de 4 dígitos y vigencia de 24 h */}
        <Card style={styles.codigoCard}>
          <Label style={styles.codigoLabel}>TU CÓDIGO DE FINALIZACIÓN</Label>
          <Text
            style={styles.codigoDigitos}
            accessibilityLabel="Código de finalización 7 3 9 1"
          >
            7 3 9 1
          </Text>
          <View style={styles.vigenciaPill}>
            <Ionicons name="time-outline" size={14} color={colors.warnText} />
            <Text style={styles.vigenciaTexto}>Vence en 23 h 41 min</Text>
          </View>
        </Card>

        <Text style={styles.texto}>
          Compártelo con {profesionista} para confirmar la finalización. Es de un solo uso. Al validarse se captura el monto de prueba y podrás calificar el servicio.
        </Text>
        <Text style={styles.textoSec}>
          Si el código vence, la contratación pasa a revisión administrativa.
        </Text>

        <View style={styles.acciones}>
          <PrimaryButton
            label="Continuar a calificación"
            loading={validando}
            loadingLabel="Validando código..."
            onPress={continuarCalificacion}
          />
          <TextLink
            onPress={() => nav.push('reportarInasistencia', { folio })}
            style={styles.enlaceProblema}
          >
            Reportar un problema o inasistencia
          </TextLink>
        </View>
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
  sub: {
    color: colors.textSec,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  codigoCard: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  codigoLabel: { textAlign: 'center', marginBottom: 8 },
  codigoDigitos: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.teal,
    letterSpacing: 10,
    fontVariant: ['tabular-nums'],
    marginVertical: 6,
  },
  vigenciaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.warnBg,
    borderWidth: 1,
    borderColor: colors.warnBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: spacing.sm,
  },
  vigenciaTexto: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.warnText,
    fontVariant: ['tabular-nums'],
  },
  texto: {
    color: colors.textSec,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: spacing.xl,
  },
  textoSec: {
    color: colors.textSec,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.md,
  },
  acciones: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  enlaceProblema: {
    alignSelf: 'center',
    paddingVertical: 6,
  },
});
