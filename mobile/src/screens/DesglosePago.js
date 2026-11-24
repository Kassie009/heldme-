/**
 * HeldMe! — Pantalla 19 · Desglose del pago
 * Mockup: App Móvil 4 de 11 · 3 - Desglose del pago.
 * Muestra el desglose de mano de obra, diagnóstico, material comprobado / sin
 * comprobante, materiales directos fuera de plataforma, comisión 10% y costo
 * absorbido por HeldMe! (RF-40, RF-41, RN-11).
 */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { Card, Label, SecondaryButton, TopBar } from '../ui';

export default function DesglosePago({ nav, params }) {
  const folio = params?.folio ?? 'HM-2044';
  const [verTicket, setVerTicket] = useState(false);

  return (
    <View style={styles.screen}>
      <TopBar onBack={nav.back} />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <Text style={styles.titulo}>Desglose del pago</Text>
        <Text style={styles.sub}>{folio} · Pago de prueba · Stripe Test Mode</Text>

        {/* Bloque único estructurado en 3 secciones con divisores finos */}
        <Card style={styles.card}>
          <View style={styles.seccion}>
            <Label>EN LA PLATAFORMA</Label>
            <View style={styles.fila}>
              <Text style={styles.concepto}>Mano de obra</Text>
              <Text style={styles.monto}>$500.00</Text>
            </View>
            <View style={styles.fila}>
              <Text style={styles.concepto}>Diagnóstico</Text>
              <Text style={styles.monto}>$200.00</Text>
            </View>
            <View style={styles.fila}>
              <Text style={styles.concepto}>Material comprobado</Text>
              <Text style={styles.monto}>$0.00</Text>
            </View>
            <View style={styles.fila}>
              <Text style={styles.concepto}>Material sin comprobante</Text>
              <Text style={styles.monto}>$0.00</Text>
            </View>
            <View style={[styles.fila, styles.filaTotal]}>
              <Text style={styles.totalLabel}>Monto en plataforma</Text>
              <Text style={styles.totalValor}>$700.00</Text>
            </View>
          </View>

          <View style={[styles.seccion, styles.divisor]}>
            <Label>FUERA DE HELDME!</Label>
            <View style={styles.fila}>
              <Text style={styles.concepto}>Materiales de compra directa</Text>
              <Text style={styles.monto}>$1,000.00</Text>
            </View>
            <View style={styles.fila}>
              <Text style={styles.concepto}>Comprobante: ticket de ferretería</Text>
              <Pressable
                onPress={() => setVerTicket((v) => !v)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={verTicket ? 'Ocultar comprobante' : 'Ver comprobante'}
                style={styles.verBtn}
              >
                <Text style={styles.verTexto}>{verTicket ? 'Ocultar' : 'Ver'}</Text>
              </Pressable>
            </View>

            {verTicket ? (
              <View style={styles.ticketPanel}>
                <Text style={styles.ticketTitulo}>Ferretería El Centro · Ticket #4192</Text>
                <Text style={styles.ticketDetalle}>
                  Tubería de cobre 1/2&quot;, codos y conexiones · 22 nov 2026
                </Text>
                <Text style={styles.ticketMonto}>Total en ticket: $1,000.00 (exento de comisión)</Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.seccion, styles.divisor]}>
            <View style={styles.fila}>
              <Text style={styles.concepto}>Comisión HeldMe! (10% de $700.00)</Text>
              <Text style={styles.monto}>$70.00</Text>
            </View>
            <View style={styles.fila}>
              <Text style={styles.concepto}>Costo de procesamiento simulado</Text>
              <Text style={styles.absorbe}>Lo absorbe HeldMe!</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.nota}>
          No pagas cargos adicionales al total de la cotización aceptada.
        </Text>

        <SecondaryButton
          label="Simular fallo de tarjeta de prueba"
          onPress={() => nav.push('pagoNoAutorizado', { folio })}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: {
    color: colors.textSec,
    fontSize: 13,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  card: { marginTop: spacing.lg, paddingVertical: 8 },
  seccion: { paddingVertical: spacing.md },
  divisor: { borderTopWidth: 1, borderTopColor: colors.border },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  concepto: { flex: 1, fontSize: 13.5, color: colors.navy, lineHeight: 19 },
  monto: {
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: F.semi,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  absorbe: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.navy,
    textAlign: 'right',
  },
  filaTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 6,
    paddingTop: 10,
  },
  totalLabel: { fontSize: 14, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  totalValor: {
    fontSize: 15.5,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  verBtn: { minHeight: 36, minWidth: 48, justifyContent: 'center', alignItems: 'flex-end' },
  verTexto: { fontSize: 13, fontWeight: '700', fontFamily: F.bold, color: colors.teal },
  ticketPanel: {
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  ticketTitulo: { fontSize: 13, fontWeight: '700', fontFamily: F.bold, color: colors.navy },
  ticketDetalle: { fontSize: 12, color: colors.textSec, marginTop: 3 },
  ticketMonto: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: F.semi,
    color: colors.teal,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  nota: {
    color: colors.textSec,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: spacing.lg,
  },
});
