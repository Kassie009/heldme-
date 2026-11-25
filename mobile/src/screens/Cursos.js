/**
 * HeldMe! — Pantalla 26 · Cursos
 * Mockup: App Móvil 6 de 11 · 1 - Cursos.
 * Catálogo de cursos aprobados con filtros de modalidad (Todos, Presencial,
 * En línea), precio de prueba y control de cupo (RF-06, RF-24, RF-25).
 */
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { Badge, Card, Chip, TopBar } from '../ui';

const cursosCatalogo = [
  {
    id: 'cur-boilers',
    titulo: 'Reparación y mantenimiento de boilers',
    subtitulo: 'Mónica Acosta · Plata · 4.8 · Presencial · 12 lugares',
    modalidad: 'presencial',
    precio: '$850.00',
    cupoLleno: false,
    lugar: 'Centro de capacitación, Col. Centro · 12 dic 2026 · 10:00',
    disponibles: '4 de 12 lugares disponibles',
    temario: '1 Diagnóstico seguro · 2 Reparación · 3 Práctica y mantenimiento',
  },
  {
    id: 'cur-electrica',
    titulo: 'Instalación eléctrica básica',
    subtitulo: 'Samuel Ortega · Oro · 4.9 · En línea · 20 lugares',
    modalidad: 'linea',
    precio: '$620.00',
    cupoLleno: false,
    lugar: 'En línea en vivo · 5 dic 2026 · 10:00',
    disponibles: '14 de 20 lugares disponibles',
    temario: '1 Seguridad eléctrica · 2 Circuitos residenciales · 3 Práctica guiada',
  },
  {
    id: 'cur-plomeria',
    titulo: 'Introducción a la plomería',
    subtitulo: 'Plomería Rivera · Oro · 4.9 · Presencial',
    modalidad: 'presencial',
    precio: '$400.00',
    cupoLleno: true,
    lugar: 'Taller Col. Jalisco · SLRC',
    disponibles: '0 de 10 lugares disponibles',
    temario: '1 Herramienta básica · 2 Tubería PVC y cobre · 3 Reparación de fugas',
  },
];

const filtros = [
  { key: 'todos', label: 'Todos' },
  { key: 'presencial', label: 'Presencial' },
  { key: 'linea', label: 'En línea' },
];

export default function Cursos({ nav }) {
  const [filtro, setFiltro] = useState('todos');
  const [abiertoId, setAbiertoId] = useState(null);

  const visibles = useMemo(() => {
    if (filtro === 'todos') return cursosCatalogo;
    return cursosCatalogo.filter((c) => c.modalidad === filtro);
  }, [filtro]);

  const alternarDetalle = (id) =>
    setAbiertoId((prev) => (prev === id ? null : id));

  return (
    <View style={styles.screen}>
      <TopBar onMenu={nav.openMenu} />
      <FlatList
        data={visibles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <Text style={styles.titulo}>Cursos</Text>
            <View style={styles.chips}>
              {filtros.map((f) => (
                <Chip
                  key={f.key}
                  label={f.label}
                  active={filtro === f.key}
                  onPress={() => setFiltro(f.key)}
                />
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const abierto = abiertoId === item.id;
          return (
            <Card style={styles.card}>
              <Text style={styles.cursoTitulo}>{item.titulo}</Text>
              <Text style={styles.cursoSub}>{item.subtitulo}</Text>

              <View style={styles.pieRow}>
                <Text style={styles.precio}>{item.precio}</Text>
                <View style={styles.pieAcciones}>
                  {item.cupoLleno ? <Badge label="Cupo lleno" tone="warn" /> : null}
                  <Pressable
                    onPress={() => alternarDetalle(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={
                      abierto ? `Ocultar detalle de ${item.titulo}` : `Ver curso ${item.titulo}`
                    }
                    style={({ pressed }) => [
                      styles.verCursoBtn,
                      pressed && styles.verCursoPressed,
                    ]}
                  >
                    <Text style={styles.verCursoTexto}>
                      {abierto ? 'Ocultar' : 'Ver curso'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {abierto ? (
                <View style={styles.detallePanel}>
                  <Text style={styles.detalleLinea}>{item.lugar}</Text>
                  <Text
                    style={[
                      styles.detalleCupo,
                      item.cupoLleno && styles.detalleCupoLleno,
                    ]}
                  >
                    {item.disponibles}
                  </Text>
                  <Text style={styles.detalleTemario}>Temario: {item.temario}</Text>
                  <Text style={styles.detalleNota}>
                    {item.cupoLleno
                      ? 'Sin lugares disponibles para inscripción.'
                      : 'La inscripción y el pago de prueba estarán disponibles en el siguiente flujo.'}
                  </Text>
                </View>
              ) : null}
            </Card>
          );
        }}
        ListEmptyComponent={
          <Card style={styles.vacioCard}>
            <Text style={styles.vacioTitulo}>Sin cursos en esta modalidad</Text>
            <Text style={styles.vacioTexto}>
              Prueba seleccionando otra modalidad para ver el catálogo disponible.
            </Text>
          </Card>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  headerWrap: { marginBottom: spacing.lg },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  card: { marginBottom: spacing.md },
  cursoTitulo: {
    fontSize: 15.5,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
    lineHeight: 21,
  },
  cursoSub: {
    fontSize: 12.5,
    fontFamily: F.reg,
    color: colors.textSec,
    lineHeight: 18,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: 10,
  },
  pieAcciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  precio: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  verCursoBtn: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verCursoPressed: { backgroundColor: colors.border },
  verCursoTexto: {
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.navy,
  },
  detallePanel: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  detalleLinea: {
    fontSize: 12.5,
    color: colors.navy,
    fontFamily: F.med,
    fontVariant: ['tabular-nums'],
  },
  detalleCupo: {
    fontSize: 12.5,
    color: colors.teal,
    fontWeight: '700',
    fontFamily: F.bold,
    fontVariant: ['tabular-nums'],
  },
  detalleCupoLleno: { color: colors.warnText },
  detalleTemario: { fontSize: 12.5, fontFamily: F.reg, color: colors.textSec, lineHeight: 18, marginTop: 2 },
  detalleNota: { fontSize: 11.5, fontFamily: F.reg, color: colors.textSec, marginTop: 4 },
  vacioCard: { alignItems: 'center', paddingVertical: spacing.xl },
  vacioTitulo: { fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  vacioTexto: {
    fontSize: 13,
    fontFamily: F.reg,
    color: colors.textSec,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 4,
  },
});
