/**
 * HeldMe! — Pantalla 18 · Contratación y códigos
 * Mockup: App Móvil 4 de 11 · 2 - Contratación y códigos.
 * Código de inicio (RF-29), estado del código de finalización (RF-20),
 * pago de prueba preautorizado (RF-36, RF-38) y acciones de la contratación.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, F } from '../theme';
import { Badge, Card, Label, TopBar } from '../ui';

export default function ContratacionDetalle({ nav, params }) {
  const folio = params?.folio ?? 'HM-2044';
  const titulo = params?.titulo ?? 'Reparación de fuga';
  const profesionista = params?.profesionista ?? 'Plomería Rivera';

  return (
    <View style={styles.screen}>
      <TopBar onBack={nav.back} />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <View style={styles.headerRow}>
          <Text style={styles.titulo} numberOfLines={1}>
            {titulo}
          </Text>
          <Badge label="Contratado" tone="mint" />
        </View>
        <Text style={styles.sub}>
          {folio} · {profesionista}
        </Text>

        {/* Código de inicio protagonista */}
        <Card style={styles.codigoCard}>
          <Label style={styles.codigoLabel}>CÓDIGO DE INICIO</Label>
          <Text
            style={styles.codigoDigitos}
            accessibilityLabel="Código de inicio 4 8 2 7"
          >
            4 8 2 7
          </Text>
          <Text style={styles.codigoAyuda}>
            Compártelo con el profesional para confirmar el inicio del servicio.
          </Text>
        </Card>

        {/* Código de finalización */}
        <Card style={styles.card}>
          <Label>CÓDIGO DE FINALIZACIÓN</Label>
          <Text style={styles.texto}>
            Se genera cuando el profesional marque el servicio como realizado. Vigencia de 24 horas, un solo uso.
          </Text>
          <Pressable
            onPress={() => nav.push('codigoFinalizacion', { folio, profesionista })}
            accessibilityRole="button"
            style={({ pressed }) => [styles.linkRow, pressed && styles.rowPressed]}
          >
            <Text style={styles.linkTexto}>Ver código de finalización</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.teal} />
          </Pressable>
        </Card>

        {/* Pago de prueba preautorizado */}
        <Card style={styles.card}>
          <View style={styles.pagoHeader}>
            <Label style={{ marginBottom: 0 }}>PAGO DE PRUEBA</Label>
            <Badge label="Preautorizado" tone="warn" />
          </View>

          <View style={styles.fila}>
            <Text style={styles.filaConcepto}>Total acordado</Text>
            <Text style={styles.filaValor}>$1,700.00</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaConcepto}>Materiales directos · fuera de HeldMe!</Text>
            <Text style={styles.filaValor}>$1,000.00</Text>
          </View>
          <View style={[styles.fila, styles.filaTotal]}>
            <Text style={styles.totalConcepto}>Monto en plataforma</Text>
            <Text style={styles.totalValor}>$700.00</Text>
          </View>

          <Text style={styles.pagoNota}>
            Se captura al validar el segundo código. Stripe Test Mode, sin dinero real.
          </Text>

          <Pressable
            onPress={() => nav.push('desglosePago', { folio })}
            accessibilityRole="button"
            style={({ pressed }) => [styles.linkRow, pressed && styles.rowPressed]}
          >
            <Text style={styles.linkTexto}>Ver desglose del pago</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.teal} />
          </Pressable>
        </Card>

        {/* Acuerdos */}
        <Pressable
          onPress={() => nav.push('acuerdosServicio', { folio, profesionista })}
          accessibilityRole="button"
          style={({ pressed }) => [pressed && { opacity: 0.85 }]}
        >
          <Card style={styles.acuerdosRow}>
            <Text style={styles.acuerdosLabel}>Acuerdos de materiales y costos</Text>
            <Badge label="Confirmados por ambos" tone="mint" />
          </Card>
        </Pressable>

        {/* Acciones operativas de la contratación en un solo grupo con divisores */}
        <Card style={styles.accionesCard}>
          <Pressable
            onPress={() => nav.push('trabajoAdicional', { folio, profesionista })}
            accessibilityRole="button"
            style={({ pressed }) => [styles.accionRow, pressed && styles.rowPressed]}
          >
            <Text style={styles.accionTexto}>Revisar trabajo adicional</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.textSec} />
          </Pressable>

          <Pressable
            onPress={() =>
              nav.push('chat', {
                nombre: profesionista,
                folio,
                servicio: titulo,
                estado: 'Contratado',
                tipoVinculo: 'contratacion',
              })
            }
            accessibilityRole="button"
            style={({ pressed }) => [styles.accionRow, styles.divisor, pressed && styles.rowPressed]}
          >
            <Text style={styles.accionTexto}>Abrir chat con {profesionista}</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.textSec} />
          </Pressable>

          <Pressable
            onPress={() => nav.push('reportarInasistencia', { folio: 'HM-2048' })}
            accessibilityRole="button"
            style={({ pressed }) => [styles.accionRow, styles.divisor, pressed && styles.rowPressed]}
          >
            <Text style={styles.accionTexto}>Reportar inasistencia</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.textSec} />
          </Pressable>

          <Pressable
            onPress={() => nav.push('cancelarContratacion', { folio, titulo })}
            accessibilityRole="button"
            style={({ pressed }) => [styles.accionRow, styles.divisor, pressed && styles.rowPressed]}
          >
            <Text style={[styles.accionTexto, { color: colors.error }]}>
              Cancelar contratación
            </Text>
            <Ionicons name="chevron-forward" size={17} color={colors.error} />
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  titulo: { flex: 1, fontSize: 22, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: {
    color: colors.textSec,
    fontSize: 13,
    marginTop: 3,
    fontVariant: ['tabular-nums'],
  },
  codigoCard: { marginTop: spacing.lg, alignItems: 'center', paddingVertical: spacing.xl },
  codigoLabel: { textAlign: 'center', marginBottom: 8 },
  codigoDigitos: {
    fontSize: 34,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.teal,
    letterSpacing: 10,
    fontVariant: ['tabular-nums'],
    marginVertical: 4,
  },
  codigoAyuda: {
    fontSize: 12.5,
    color: colors.textSec,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
  card: { marginTop: spacing.md },
  texto: { fontSize: 13, color: colors.textSec, lineHeight: 19 },
  pagoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  filaConcepto: { flex: 1, fontSize: 13, color: colors.navy },
  filaValor: {
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: F.semi,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  filaTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 6,
    paddingTop: 10,
  },
  totalConcepto: { fontSize: 14, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  totalValor: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  pagoNota: {
    fontSize: 12,
    color: colors.textSec,
    lineHeight: 17,
    marginTop: spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    minHeight: 44,
  },
  linkTexto: { fontSize: 13.5, fontWeight: '700', fontFamily: F.bold, color: colors.teal },
  acuerdosRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  acuerdosLabel: { flex: 1, fontSize: 13.5, fontWeight: '600', fontFamily: F.semi, color: colors.navy },
  accionesCard: { marginTop: spacing.md, paddingVertical: 4 },
  accionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: 10,
  },
  divisor: { borderTopWidth: 1, borderTopColor: colors.border },
  accionTexto: { fontSize: 14, fontWeight: '600', fontFamily: F.semi, color: colors.navy },
  rowPressed: { opacity: 0.7 },
});
