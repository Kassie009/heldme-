/**
 * HeldMe! — Pantalla 8 · Resultados con orientación de IA
 * Mockup: App Móvil 2 de 11 · 2 - Resultados con orientación de IA.
 * La IA orienta la categoría; los resultados provienen solo de registros
 * reales de HeldMe! y el usuario puede corregir la categoría.
 */
import React from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Card, Chip, Badge } from '../ui';

const resultados = [
  {
    titulo: 'Plomería Rivera',
    badge: 'Oro · 4.9',
    sub: '58 servicios · Plomería · Reparación de fugas',
  },
  {
    titulo: 'Instalación de calentador de paso',
    badge: 'Plata',
    sub: 'Diego Molina · Plomería',
  },
];

export default function ResultadosIA({ nav, params }) {
  const consulta = params?.consulta ?? 'tengo una fuga de agua';

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} />
        <Text style={styles.titulo}>Buscar</Text>

        <View style={styles.inputWrap}>
          <Ionicons name="search" size={18} color={colors.textSec} />
          <Text style={styles.inputTexto} numberOfLines={1}>{consulta}</Text>
        </View>

        {/* Orientación de IA (carácter orientativo, solo registros reales) */}
        <Card style={styles.iaCard}>
          <View style={styles.iaHeader}>
            <Badge label="Orientación de IA" tone="teal" />
            <Pressable onPress={() => nav.push('cambiarCategoria', { consulta })} hitSlop={8}>
              <Text style={styles.iaCambiar}>Cambiar categoría</Text>
            </Pressable>
          </View>
          <Text style={styles.iaTitulo}>Parece un tema de plomería</Text>
          <Text style={styles.iaTexto}>
            Es una orientación. Solo mostramos servicios y profesionales reales
            de HeldMe!.
          </Text>
          <View style={styles.chips}>
            <Chip label="Plomería" active />
            <Chip label="Col. Centro · SLRC" />
          </View>
        </Card>

        {/* Resultados reales del catálogo */}
        {resultados.map((r) => (
          <Card key={r.titulo} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitulo} numberOfLines={1}>{r.titulo}</Text>
              <Badge label={r.badge} />
            </View>
            <Text style={styles.resultSub} numberOfLines={1}>{r.sub}</Text>
          </Card>
        ))}

        <Pressable
          onPress={() => nav.push('publicar')}
          style={({ pressed }) => [styles.publicarBtn, pressed && styles.pressedSoft]}
        >
          <Text style={styles.publicarTexto}>
            ¿No encuentras lo que buscas?{'\n'}
            <Text style={styles.publicarBold}>Publicar una necesidad</Text>
          </Text>
        </Pressable>
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
    marginBottom: spacing.lg,
  },
  inputTexto: { flex: 1, fontSize: 14, color: colors.navy },
  iaCard: { marginBottom: spacing.lg },
  iaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iaCambiar: { color: colors.teal, fontWeight: '700', fontFamily: F.bold, fontSize: 13 },
  iaTitulo: { fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.navy, marginTop: 10 },
  iaTexto: { color: colors.textSec, fontSize: 13, lineHeight: 18, marginTop: 4 },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  resultCard: { marginBottom: spacing.md },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  resultTitulo: { flex: 1, fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  resultSub: { color: colors.textSec, fontSize: 12, marginTop: 4 },
  publicarBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  publicarTexto: { color: colors.textSec, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  publicarBold: { color: colors.teal, fontWeight: '800', fontFamily: F.extra, fontSize: 14 },
  pressedSoft: { backgroundColor: colors.panel },
});
