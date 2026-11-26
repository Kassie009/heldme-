/**
 * HeldMe! — Nueva cotización (profesionista)
 * Port de la pantalla de Jeshua (mockup: Profesionista · Cotizar).
 * Desglose por concepto, material, tipo de precio y condiciones (RN-06).
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Card, Field, TextInputBox, Chip, Badge, PrimaryButton } from '../ui';

export default function CotizarPro({ nav }) {
  const [modo, setModo] = useState('fijo');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onBack={nav.back} />
      <Text style={styles.titulo}>Nueva cotización</Text>
      <Text style={styles.sub} numberOfLines={1}>
        Reparación de fuga · Aaron Félix · Col. Centro · SLRC
      </Text>

      <Card style={styles.card}>
        <Text style={styles.cardKicker}>MANO DE OBRA Y DIAGNÓSTICO</Text>
        <View style={styles.fila}>
          <Text style={styles.concepto}>Mano de obra</Text>
          <Text style={styles.monto}>$500.00</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.concepto}>Diagnóstico</Text>
          <Text style={styles.monto}>$200.00</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardKicker}>MATERIAL</Text>
        <View style={styles.fila}>
          <Text style={styles.concepto} numberOfLines={1}>Tubería y conexiones · 1 pza</Text>
          <Text style={styles.monto}>$1,000.00</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.concepto}>Lo compra</Text>
          <Text style={[styles.monto, { color: colors.teal }]}>Cliente</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.concepto}>Cubre el costo</Text>
          <Text style={[styles.monto, { color: colors.teal }]}>Cliente</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.adjuntar, pressed && { backgroundColor: colors.panel }]}
          accessibilityRole="button" accessibilityLabel="Adjuntar foto del ticket">
          <Text style={styles.adjuntarTexto}>Adjuntar foto del ticket o factura</Text>
        </Pressable>
      </Card>

      <View style={styles.chips}>
        <Chip label="Precio fijo" active={modo === 'fijo'} onPress={() => setModo('fijo')} />
        <Chip label="Estimado" active={modo === 'estimado'} onPress={() => setModo('estimado')} />
      </View>

      <Field label="CONDICIONES">
        <TextInputBox
          placeholder="Condiciones de la cotización"
          style={{ minHeight: 64, alignItems: 'flex-start', paddingVertical: 12 }}
        />
      </Field>

      <Card style={styles.totalCard}>
        <View style={styles.fila}>
          <Text style={styles.totalLabel}>Total para el cliente</Text>
          <Text style={styles.totalValor}>$1,700.00</Text>
        </View>
        <Text style={styles.nota}>
          Cualquier trabajo adicional requiere una nueva versión que el cliente debe aceptar.
        </Text>
      </Card>

      <PrimaryButton
        label="Enviar cotización"
        onPress={() => nav.replace('solicitudesPro')}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4 },
  card: { marginTop: spacing.md },
  cardKicker: { fontSize: 10.5, fontWeight: '700', fontFamily: F.bold, color: colors.textSec, letterSpacing: 0.8, marginBottom: 6 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  concepto: { flex: 1, fontSize: 14, color: colors.navy, fontWeight: '600', fontFamily: F.semi },
  monto: { fontSize: 14, color: colors.navy, fontWeight: '700', fontFamily: F.bold, marginLeft: 12 },
  adjuntar: {
    backgroundColor: colors.mint,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  adjuntarTexto: { color: colors.teal, fontWeight: '700', fontFamily: F.bold, fontSize: 13 },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  totalCard: { marginTop: spacing.md, backgroundColor: colors.mint, borderColor: colors.mint },
  totalLabel: { fontSize: 15, fontWeight: '700', fontFamily: F.bold, color: colors.navy },
  totalValor: { fontSize: 18, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  nota: { color: colors.textSec, fontSize: 12, lineHeight: 17, marginTop: 6 },
});
