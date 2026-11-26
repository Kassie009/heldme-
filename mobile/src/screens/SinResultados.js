/**
 * HeldMe! — Pantalla 10 · Sin resultados y búsqueda convencional
 * Mockup: App Móvil 2 de 11 · 4 - Sin resultados y búsqueda convencional.
 * Cuando la IA no está disponible o no hay coincidencias, la búsqueda
 * convencional permanece disponible y se ofrece publicar una necesidad.
 */
import React from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Card, Chip, Badge, PrimaryButton, SecondaryButton } from '../ui';

export default function SinResultados({ nav, params }) {
  const consulta = params?.consulta ?? 'reparación de alberca';

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} onBack={nav.puedeRetroceder ? nav.back : undefined} />
        <Text style={styles.titulo}>Buscar</Text>

        <View style={styles.inputWrap}>
          <Ionicons name="search" size={18} color={colors.textSec} />
          <Text style={styles.inputTexto} numberOfLines={1}>{consulta}</Text>
        </View>

        {/* Búsqueda convencional: respaldo cuando la IA no está disponible */}
        <View style={styles.aviso}>
          <Badge label="Búsqueda convencional" tone="warn" />
          <Text style={styles.avisoTexto}>
            La orientación de IA no está disponible en este momento. Puedes
            seguir buscando por texto, categoría y zona.
          </Text>
        </View>

        <View style={styles.chips}>
          <Chip label="Todas las categorías" />
          <Chip label="Col. Centro · SLRC" />
        </View>

        <Card style={styles.vacioCard}>
          <Text style={styles.vacioTitulo}>No encontramos coincidencias</Text>
          <Text style={styles.vacioTexto}>
            Prueba con otra categoría o zona, o publica una necesidad para
            recibir cotizaciones.
          </Text>
        </Card>

        <SecondaryButton
          label="Cambiar filtros"
          onPress={() => nav.replace('buscar')}
          style={{ marginTop: spacing.lg }}
        />
        <PrimaryButton
          label="Publicar una necesidad"
          onPress={() => nav.push('publicar')}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy, marginBottom: spacing.md },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputTexto: { flex: 1, fontSize: 14, color: colors.navy },
  aviso: {
    backgroundColor: colors.warnBg,
    borderColor: colors.warnBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: 8,
  },
  avisoTexto: { color: colors.navy, fontSize: 13, lineHeight: 19 },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, flexWrap: 'wrap' },
  vacioCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.lg,
  },
  vacioTitulo: { fontSize: 16, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  vacioTexto: {
    color: colors.textSec,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
  },
});
