/**
 * HeldMe! — Solicitudes recibidas (profesionista)
 * Port de la pantalla de Jeshua (mockup: Solicitudes recibidas).
 */
import React from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, spacing, F } from '../theme';
import { TopBar, Card, Badge, PrimaryButton } from '../ui';

const solicitudes = [
  {
    titulo: 'Reparación de fuga',
    badge: 'Nueva',
    tono: 'teal',
    sub: 'Aaron Félix · Plomería · Col. Centro · SLRC',
    cotizable: true,
  },
  {
    titulo: 'Cambio de tubería de cocina',
    badge: 'Cotizada',
    tono: 'warn',
    sub: 'Sofía Luna · Plomería · Col. Jalisco · SLRC',
    cotizable: false,
  },
];

export default function SolicitudesRecibidasPro({ nav }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} />
        <Text style={styles.titulo}>Solicitudes recibidas</Text>
        <Text style={styles.sub}>Últimas por categoría y zona</Text>

        {solicitudes.map((s) => (
          <Card key={s.titulo} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo} numberOfLines={1}>{s.titulo}</Text>
              <Badge label={s.badge} tone={s.tono} />
            </View>
            <Text style={styles.cardSub} numberOfLines={1}>{s.sub}</Text>
            {s.cotizable && (
              <PrimaryButton
                label="Cotizar"
                onPress={() => nav.push('cotizarPro')}
                style={styles.boton}
              />
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  cardTitulo: { flex: 1, fontSize: 16, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  cardSub: { color: colors.textSec, fontSize: 13, fontWeight: '500', fontFamily: F.med, marginTop: 3 },
  boton: { marginTop: spacing.md },
});
