/**
 * HeldMe! — Pantalla 12 · Mis solicitudes
 * Mockup: App Móvil 3 de 11 · 2 - Mis solicitudes.
 * Lista de solicitudes del cliente con su estado y cotizaciones recibidas.
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Card, Chip, Badge, PrimaryButton } from '../ui';

const solicitudes = [
  {
    titulo: 'Reparación de fuga',
    badge: '2 cotizaciones',
    tono: 'teal',
    sub: 'Plomería · Col. Centro · SLRC',
    accion: 'cotizaciones',
  },
  {
    titulo: 'Pintura de recámara',
    badge: 'Publicada',
    tono: 'mint',
    sub: 'Pintura · Sin cotizaciones aún',
  },
  {
    titulo: 'Instalación de ventilador',
    badge: 'Cancelada',
    tono: 'danger',
    sub: 'Electricidad · Preautorización cancelada',
  },
];

export default function MisSolicitudes({ nav }) {
  const [tab, setTab] = useState('activas');

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} />
        <Text style={styles.titulo}>Mis solicitudes</Text>

        <View style={styles.chips}>
          <Chip label="Activas" active={tab === 'activas'} onPress={() => setTab('activas')} />
          <Chip label="Anteriores" active={tab === 'anteriores'} onPress={() => setTab('anteriores')} />
        </View>

        {solicitudes.map((s) => (
          <Pressable key={s.titulo} onPress={() => s.accion && nav.push(s.accion)}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo} numberOfLines={1}>{s.titulo}</Text>
                <Badge label={s.badge} tone={s.tono} />
              </View>
              <Text style={styles.cardSub} numberOfLines={1}>{s.sub}</Text>
            </Card>
          </Pressable>
        ))}

        <PrimaryButton label="Publicar necesidad" onPress={() => nav.push('publicar')} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy, marginBottom: spacing.md },
  chips: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitulo: { flex: 1, fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  cardSub: { color: colors.textSec, fontSize: 12, marginTop: 4 },
});
