/**
 * HeldMe! — Pantalla 03 / Resultados de búsqueda inteligente (RF-09..RF-11, RF-35)
 * Mockup: MÓVIL PANTALLA 03/19 · Resultados inteligentes / Corrección y respaldo.
 * Solo frontend: el botón "Simular Fallback" alterna entre modo IA y convencional.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { Card, TabBar } from '../ui';

const resultados = [
  {
    nombre: 'Plomería Rivera',
    rango: 'Oro',
    rangoColor: '#8A6D1F',
    zona: 'Col. Centro · Diagnóstico y reparación',
    estrellas: '4.8',
    trabajos: '27 trabajos',
    destacado: true,
  },
  {
    nombre: 'Hidro Servicios',
    rango: 'Plata',
    rangoColor: colors.textSec,
    zona: 'Col. Bellavista · Fugas y calentadores',
    estrellas: '4.5',
    trabajos: '9 trabajos',
  },
  {
    nombre: 'Fontanería MX',
    rango: 'Bronce',
    rangoColor: '#8A5A2B',
    zona: 'Zona Norte · Mantenimiento general',
    estrellas: '4.4',
    trabajos: '3 trabajos',
  },
];

export default function ResultadosBusqueda({ onBack }) {
  const [modoIA, setModoIA] = useState(true);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Barra superior con la consulta */}
        <View style={styles.topbar}>
          <Pressable
            onPress={onBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Regresar"
          >
            <Ionicons name="arrow-back" size={20} color={colors.navy} />
          </Pressable>
          <View style={styles.queryPill}>
            <Text style={styles.queryText} numberOfLines={1}>
              "tengo una fuga de agua"
            </Text>
            <Pressable onPress={() => setModoIA(!modoIA)}>
              <Text style={styles.link}>
                {modoIA ? 'Simular Fallback' : 'Reintentar IA'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Sugerencia de ortografía (RF-08): conserva el texto original */}
        {modoIA && (
          <Card style={styles.ortoCard}>
            <Text style={styles.ortoText}>
              ¿Buscabas <Text style={styles.ortoBold}>plomería urgente</Text>?
            </Text>
            <Text style={styles.ortoConservar}>Conservar original</Text>
          </Card>
        )}

        {/* Orientación IA (RF-10): solo registros reales de HeldMe! */}
        {modoIA ? (
          <Card style={styles.iaCard}>
            <View style={styles.iaHeader}>
              <Ionicons name="sparkles" size={16} color={colors.teal} />
              <Text style={styles.iaTitle}>Orientación IA · HeldMe!</Text>
              <View style={styles.iaChip}>
                <Text style={styles.iaChipText}>Solo registros reales</Text>
              </View>
            </View>
            <Text style={styles.iaText}>
              Detectamos una necesidad de reparación hidráulica. Te mostramos{' '}
              <Text style={styles.iaBold}>3 profesionistas con perfil aprobado</Text>{' '}
              en tu zona.
            </Text>
            <View style={styles.iaFooter}>
              <Text style={styles.iaCategoriaLabel}>Categoría inferida:</Text>
              <View style={styles.iaCategoriaChip}>
                <Text style={styles.iaCategoriaText}>Plomería</Text>
              </View>
              <Pressable style={{ marginLeft: 'auto' }}>
                <Text style={styles.link}>Corregir categoría</Text>
              </Pressable>
            </View>
          </Card>
        ) : (
          // Búsqueda convencional de respaldo (RF-11): disponible ante fallo/cuota
          <Card style={styles.iaCard}>
            <View style={styles.iaHeader}>
              <Ionicons name="search" size={16} color={colors.teal} />
              <Text style={styles.iaTitle}>Búsqueda convencional</Text>
            </View>
            <Text style={styles.iaText}>
              La orientación con IA no está disponible en este momento; los
              resultados provienen directamente del catálogo de HeldMe!.
            </Text>
          </Card>
        )}

        {/* Resumen de coincidencias */}
        <View style={styles.resumenRow}>
          <Text style={styles.resumen}>
            3 coincidencias en zona aproximada · Col. Centro
          </Text>
          <Text style={styles.orden} numberOfLines={1}>
            Orden: Mejor rango
          </Text>
        </View>

        {/* Tarjetas de resultados */}
        {resultados.map((r) => (
          <Card
            key={r.nombre}
            style={[styles.resultCard, r.destacado && styles.resultCardDestacado]}
          >
            <View style={styles.resultRow}>
              <View style={{ flex: 1, flexShrink: 1 }}>
                <View style={styles.resultTitleRow}>
                  <Text style={styles.resultNombre} numberOfLines={1}>
                    {r.nombre}
                  </Text>
                  <View style={styles.rangoChip}>
                    <Text style={[styles.rangoText, { color: r.rangoColor }]}>
                      {r.rango}
                    </Text>
                  </View>
                </View>
                <Text style={styles.resultZona}>{r.zona}</Text>
              </View>
              <View style={styles.resultScore}>
                <View style={styles.scoreRow}>
                  <Ionicons name="star" size={14} color="#F5B301" />
                  <Text style={styles.scoreValor}>{r.estrellas}</Text>
                </View>
                <Text style={styles.scoreTrabajos}>{r.trabajos}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
      <TabBar active="Explorar" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xl,
  },
  backBtn: {
    backgroundColor: colors.mint,
    borderRadius: radius.md,
    padding: 10,
  },
  queryPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  queryText: { flex: 1, color: colors.navy, fontWeight: '600', fontSize: 13 },
  link: { color: colors.teal, fontWeight: '700', fontSize: 12 },
  ortoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  ortoText: { color: colors.textSec, fontSize: 13 },
  ortoBold: { color: colors.teal, fontWeight: '700', textDecorationLine: 'underline' },
  ortoConservar: { color: colors.navy, fontWeight: '600', fontSize: 12 },
  iaCard: { gap: spacing.md, backgroundColor: colors.panel, borderColor: colors.border },
  iaHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  iaTitle: { fontWeight: '800', color: colors.navy, fontSize: 14 },
  iaChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginLeft: 'auto',
  },
  iaChipText: { fontSize: 10, fontWeight: '600', color: colors.textSec },
  iaText: { color: colors.textSec, fontSize: 13, lineHeight: 19 },
  iabold: { fontWeight: '700' },
  iaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  iaCategoriaLabel: { color: colors.textSec, fontSize: 12 },
  iaCategoriaChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iaCategoriaText: { fontWeight: '800', color: colors.navy, fontSize: 12 },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  resumen: { flex: 1, fontWeight: '700', color: colors.navy, fontSize: 14, lineHeight: 19 },
  orden: { color: colors.textSec, fontSize: 11, fontWeight: '500', textAlign: 'right' },
  resultCard: { padding: spacing.md },
  resultCardDestacado: { borderColor: colors.teal, borderWidth: 1.5 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultNombre: { fontSize: 16, fontWeight: '800', color: colors.navy },
  rangoChip: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  rangoText: { fontSize: 11, fontWeight: '700' },
  resultZona: { color: colors.textSec, fontSize: 12, marginTop: 3 },
  resultScore: { alignItems: 'flex-end', gap: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  scoreValor: { fontWeight: '800', color: colors.navy, fontSize: 14 },
  scoreTrabajos: { color: colors.textSec, fontSize: 11 },
  iabold: { fontWeight: '700', color: colors.navy },
});
