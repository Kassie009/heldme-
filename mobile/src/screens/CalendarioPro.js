/**
 * HeldMe! — Calendario (profesionista)
 * Port de la pantalla de Jeshua (mockup: Profesionista · Calendario).
 * Citas agendadas y disponibilidad (RF-18).
 */
import React from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Card, Badge, SecondaryButton } from '../ui';

const dias = ['23', '24', '25', '26', '27'];

export default function CalendarioPro({ nav }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} />
        <Text style={styles.titulo}>Calendario</Text>
        <Text style={styles.sub}>Noviembre 2026</Text>

        <View style={styles.dias}>
          {dias.map((d, i) => (
            <View key={d} style={[styles.dia, i === 1 && styles.diaActivo]}>
              <Text style={[styles.diaTexto, i === 1 && { color: colors.white, fontWeight: '800', fontFamily: F.extra }]}>{d}</Text>
            </View>
          ))}
        </View>

        <Card style={styles.card}>
          <View style={styles.fila}>
            <Text style={styles.precio}>$80</Text>
            <Text style={styles.servicio} numberOfLines={1}>Revisión de fuga</Text>
            <Badge label="HM-2044" />
          </View>
          <Text style={styles.meta}>Aaron Félix · Col. Centro</Text>
        </Card>

        <Card style={styles.card}>
          <Badge label="Disponible" />
          <Text style={styles.horario}>09:00 - 14:00</Text>
          <SecondaryButton
            label="Editar disponibilidad"
            onPress={() => {}}
            style={styles.botonEditar}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4, marginBottom: spacing.md },
  dias: { flexDirection: 'row', gap: 10, marginBottom: spacing.lg },
  dia: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaActivo: { backgroundColor: colors.teal, borderColor: colors.teal },
  diaTexto: { fontSize: 15, color: colors.navy, fontWeight: '700', fontFamily: F.bold },
  card: { marginBottom: spacing.md },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  precio: { fontSize: 17, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  servicio: { flex: 1, fontSize: 14, fontWeight: '600', fontFamily: F.semi, color: colors.navy },
  meta: { color: colors.textSec, fontSize: 13, fontWeight: '500', fontFamily: F.med, marginTop: 4 },
  horario: { fontSize: 18, fontWeight: '800', fontFamily: F.extra, color: colors.navy, marginTop: 6 },
  botonEditar: { marginTop: spacing.md },
});
