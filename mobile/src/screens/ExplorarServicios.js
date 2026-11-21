/**
 * HeldMe! — Pantalla 02 / Explorar servicios (RF-06, RF-07)
 * Mockup: MÓVIL PANTALLA 02/19 · 02 - Inicio / Búsqueda inteligente.
 * Solo frontend: datos estáticos de ejemplo.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { Card, Chip, PrimaryButton, FieldLabel, Input, TabBar } from '../ui';

const categorias = [
  { label: 'Todo', icon: null, active: true },
  { label: 'Plomería', icon: 'construct-outline' },
  { label: 'Electricidad', icon: 'flash-outline' },
  { label: 'Cursos', icon: 'book-outline' },
];

const perfiles = [
  {
    iniciales: 'PR',
    nombre: 'Plomería Rivera',
    rango: 'Oro',
    desc: 'Reparación de fugas y tuberías · Col. Centro',
    estrellas: '4.8',
    trabajos: '27 trabajos',
    extra: 'Cotizar',
  },
  {
    iniciales: 'EL',
    nombre: 'Electricidad López',
    rango: 'Plata',
    desc: 'Instalaciones residenciales · Zona Norte',
    estrellas: '4.6',
    trabajos: '14 trabajos',
    extra: 'Curso disponible',
  },
];

export default function ExplorarServicios({ onBuscar, onPublicar }) {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <View style={styles.headerZona}>
              <Ionicons name="location-outline" size={13} color={colors.teal} />
              <Text style={styles.zona} numberOfLines={1}>
                San Luis Río Colorado · Col. Centro
              </Text>
            </View>
            <Text style={styles.saludo}>Hola, Aaron</Text>
          </View>
          <View style={styles.bellWrap}>
            <Ionicons name="notifications-outline" size={22} color={colors.navy} />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>2</Text>
            </View>
          </View>
        </View>

        {/* Búsqueda inteligente */}
        <Card style={styles.searchCard}>
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={18} color={colors.textSec} />
            <Text style={styles.searchText} numberOfLines={1}>
              tengo una fuga de agua
            </Text>
            <PrimaryButton label="Buscar" onPress={onBuscar} style={styles.btnBuscar} />
          </View>
          <View style={styles.searchFooter}>
            <Text style={styles.searchMode}>Búsqueda inteligente activa</Text>
            <Text style={styles.link}>Modo convencional</Text>
          </View>
        </Card>

        {/* Publicar necesidad */}
        <Pressable onPress={onPublicar}>
          <Card style={styles.publishCard}>
            <View style={styles.publishIcon}>
              <Ionicons name="add-circle" size={44} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.publishKicker}>¿NO ENCUENTRAS HORARIO?</Text>
              <Text style={styles.publishTitle}>Publicar una necesidad</Text>
              <Text style={styles.publishDesc} numberOfLines={1}>
                Recibe cotizaciones con costos por concepto
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSec} />
          </Card>
        </Pressable>

        {/* Categorías */}
        <View style={styles.catsHeader}>
          <Text style={styles.catsTitle}>CATEGORÍAS</Text>
          <View style={styles.catsVerCursos}>
            <Ionicons name="school-outline" size={14} color={colors.teal} />
            <Text style={styles.link}>Ver Cursos</Text>
          </View>
        </View>
        <View style={styles.chips}>
          {categorias.map((c) => (
            <Chip key={c.label} label={c.label} icon={c.icon} active={c.active} />
          ))}
        </View>

        {/* Profesionistas disponibles */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Disponibles en tu zona</Text>
          <Text style={styles.listMeta}>3 perfiles aprobados</Text>
        </View>
        {perfiles.map((p) => (
          <Card key={p.nombre} style={styles.perfilCard}>
            <View style={styles.perfilRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{p.iniciales}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.perfilTitleRow}>
                  <Text style={styles.perfilNombre} numberOfLines={1}>
                  {p.nombre}
                </Text>
                  <View style={styles.rangoChip}>
                    <Ionicons name="ribbon-outline" size={12} color={colors.navy} />
                    <Text style={styles.rangoText}>{p.rango}</Text>
                  </View>
                </View>
                <Text style={styles.perfilDesc} numberOfLines={1}>
                  {p.desc}
                </Text>
              </View>
            </View>
            <View style={styles.perfilFooter}>
              <Ionicons name="star" size={14} color="#F5B301" />
              <Text style={styles.estrellas}>{p.estrellas}</Text>
              <Text style={styles.punto}>·</Text>
              <Text style={styles.trabajos}>{p.trabajos}</Text>
              <Text style={[styles.link, { marginLeft: 'auto', flexShrink: 0 }]}>
                {p.extra}
              </Text>
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
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
  },
  headerZona: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  zona: { color: colors.textSec, fontSize: 12, fontWeight: '500' },
  saludo: { fontSize: 26, fontWeight: '800', color: colors.navy, marginTop: 2 },
  bellWrap: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    padding: 10,
    marginTop: spacing.xs,
  },
  bellBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: colors.teal,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  searchCard: { padding: spacing.md, gap: spacing.md },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: colors.navy,
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  btnBuscar: { paddingVertical: 12, paddingHorizontal: 18 },
  searchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchMode: { color: colors.textSec, fontSize: 12 },
  link: { color: colors.teal, fontWeight: '700', fontSize: 12 },
  publishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  publishIcon: {
    backgroundColor: colors.teal,
    borderRadius: 40,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishKicker: { fontSize: 10, fontWeight: '700', color: colors.textSec, letterSpacing: 0.5 },
  publishTitle: { fontSize: 16, fontWeight: '800', color: colors.navy, marginVertical: 1 },
  publishDesc: { fontSize: 12, color: colors.textSec },
  catsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catsTitle: { fontSize: 13, fontWeight: '800', color: colors.navy, letterSpacing: 0.5 },
  catsVerCursos: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.navy },
  listMeta: { fontSize: 11, fontWeight: '500', color: colors.textSec },
  perfilCard: { gap: spacing.md },
  perfilRow: { flexDirection: 'row', gap: spacing.md },
  avatar: {
    backgroundColor: colors.mint,
    borderRadius: radius.md,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '800', color: colors.navy, fontSize: 15 },
  perfilTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  perfilNombre: { fontSize: 15, fontWeight: '700', color: colors.navy },
  rangoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rangoText: { fontSize: 11, fontWeight: '700', color: colors.navy },
  perfilDesc: { color: colors.textSec, fontSize: 12, marginTop: 2 },
  perfilFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  estrellas: { fontWeight: '700', color: colors.navy, fontSize: 13 },
  punto: { color: colors.textSec },
  trabajos: { color: colors.textSec, fontSize: 12 },
});
