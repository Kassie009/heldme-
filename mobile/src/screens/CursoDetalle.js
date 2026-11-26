/**
 * HeldMe! — Detalle de curso (cliente)
 * Port de la pantalla de Jeshua (mockup: Cursos · Detalle).
 * Pago de prueba con tarjeta demo; cupo visible (RF-25).
 */
import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, F } from '../theme';
import { TopBar, Card, InfoRow, PrimaryButton } from '../ui';

export default function CursoDetalle({ nav }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onBack={nav.back} />
      <Text style={styles.titulo}>Reparación y mantenimiento de boilers</Text>
      <Text style={styles.sub} numberOfLines={1}>Mónica Acosta · Plata · 4.8</Text>

      <Card style={styles.tarjeta}>
        <InfoRow label="Modalidad" value="Presencial" />
        <InfoRow label="Lugar" value="Centro de capacitación, Col. Centro" />
        <InfoRow label="Lugares disponibles" value="4 de 12" tone="teal" />
        <InfoRow label="Precio" value="$850.00" />
      </Card>

      <Card style={styles.tarjeta}>
        <Text style={styles.kicker}>TEMARIO</Text>
        <Text style={styles.parrafo}>1. Diagnóstico seguro · 2. Reparación · 3. Práctica y mantenimiento.</Text>
      </Card>

      <Card style={styles.tarjeta}>
        <Text style={styles.kicker}>TARJETA DE PRUEBA</Text>
        <Text style={styles.tarjetaNumero}>4242 4242 4242 4242</Text>
      </Card>

      <Text style={styles.nota}>
        Pago simulado, sin cargos reales. Baja con 48 h de anticipación y reembolso total.
      </Text>

      <PrimaryButton
        label="Inscribirme y pagar (prueba)"
        onPress={() => nav.push('inscripcion')}
        style={{ marginTop: spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 22, fontWeight: '800', fontFamily: F.extra, color: colors.navy, lineHeight: 29 },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4 },
  tarjeta: { marginTop: spacing.lg },
  kicker: { fontSize: 10.5, fontWeight: '700', fontFamily: F.bold, color: colors.textSec, letterSpacing: 0.8, marginBottom: 6 },
  parrafo: { color: colors.navy, fontSize: 14, fontWeight: '600', fontFamily: F.semi, lineHeight: 20 },
  tarjetaNumero: { color: colors.navy, fontSize: 20, letterSpacing: 1.2, fontWeight: '800', fontFamily: F.extra },
  nota: { color: colors.textSec, fontSize: 13, lineHeight: 18, marginTop: spacing.md },
});
