/**
 * HeldMe! — Mi inscripción (cliente)
 * Port de la pantalla de Jeshua (mockup: Inscripción y pago).
 * Enlace de sesión visible solo para inscritos (RN-05); baja con reembolso (RN-15).
 */
import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, F } from '../theme';
import { TopBar, Card, Badge, InfoRow, PrimaryButton, TextLink } from '../ui';

export default function Inscripcion({ nav }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onBack={nav.back} />
      <Text style={styles.titulo}>Mi inscripción</Text>
      <Text style={styles.sub} numberOfLines={1}>Instalación eléctrica básica · Samuel Ortega</Text>

      <Card style={styles.tarjeta}>
        <View style={styles.filaEstado}>
          <Text style={styles.kicker}>ESTADO</Text>
          <Badge label="Inscrito" tone="teal" />
        </View>
        <InfoRow label="Modalidad" value="En línea en vivo" />
        <InfoRow label="Inicio" value="5 dic 2026 · 10:00" />
        <InfoRow label="Pagado (prueba)" value="$620.00" />
      </Card>

      <Card style={styles.tarjeta}>
        <Text style={styles.kicker}>ENLACE DE LA SESIÓN</Text>
        <TextLink style={{ marginTop: 2 }}>Abrir enlace vivo</TextLink>
        <Text style={styles.ayuda}>Solo lo ven los alumnos inscritos.</Text>
      </Card>

      <Text style={styles.nota}>
        Si te das de baja con al menos 48 horas de anticipación se reembolsa el total (simulado).
      </Text>

      <PrimaryButton
        label="Darme de baja"
        onPress={() => nav.back()}
        style={{ marginTop: spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4 },
  tarjeta: { marginTop: spacing.lg },
  filaEstado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  kicker: { fontSize: 10.5, fontWeight: '700', fontFamily: F.bold, color: colors.textSec, letterSpacing: 0.8 },
  ayuda: { color: colors.textSec, fontSize: 12, marginTop: 4 },
  nota: { color: colors.textSec, fontSize: 13, lineHeight: 18, marginTop: spacing.md },
});
