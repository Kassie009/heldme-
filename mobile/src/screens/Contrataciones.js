/**
 * HeldMe! — Pantalla 17 · Contrataciones
 * Mockup: App Móvil 4 de 11 · 1 - Contrataciones.
 * Lista de contrataciones del cliente filtradas por estado (RF-17, RF-38).
 */
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { Badge, Card, Chip, SecondaryButton, TopBar } from '../ui';

const contratacionesMock = [
  {
    id: 'HM-2044',
    tab: 'activas',
    titulo: 'Reparación de fuga',
    estado: 'Contratado',
    estadoTono: 'mint',
    detalle: 'HM-2044 · Plomería Rivera · Cita 16:00',
    pagoEstado: 'Preautorizado',
    pagoTono: 'warn',
    destacada: true,
    destino: 'contratacionDetalle',
  },
  {
    id: 'HM-2047',
    tab: 'activas',
    titulo: 'Cambio de tubería de cocina',
    estado: 'En proceso',
    estadoTono: 'teal',
    detalle: 'HM-2047 · Plomería Rivera',
    nota: 'Versión adicional pendiente de revisión',
    destino: 'trabajoAdicional',
  },
  {
    id: 'HM-2041',
    tab: 'activas',
    titulo: 'Reparación de boiler',
    estado: 'Pendiente de confirmación',
    estadoTono: 'warn',
    detalle: 'HM-2041 · Plomería Rivera',
    destino: 'codigoFinalizacion',
  },
  {
    id: 'HM-1990',
    tab: 'canceladas',
    titulo: 'Instalación de ventilador',
    estado: 'Cancelado',
    estadoTono: 'danger',
    detalle: 'HM-1990 · Electricidad · Pago cancelado',
    destino: 'pagoNoAutorizado',
  },
];

const tabs = [
  { key: 'activas', label: 'Activas' },
  { key: 'finalizadas', label: 'Finalizadas' },
  { key: 'canceladas', label: 'Canceladas' },
];

export default function Contrataciones({ nav }) {
  const [tab, setTab] = useState('activas');

  const visibles = useMemo(
    () => contratacionesMock.filter((item) => item.tab === tab),
    [tab],
  );

  const mensajeVacio =
    tab === 'finalizadas'
      ? 'Aún no tienes contrataciones finalizadas.'
      : 'No hay contrataciones en esta sección.';

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
            <Text style={styles.titulo}>Contrataciones</Text>
            <View style={styles.chips}>
              {tabs.map((t) => (
                <Chip
                  key={t.key}
                  label={t.label}
                  active={tab === t.key}
                  onPress={() => setTab(t.key)}
                />
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => nav.push(item.destino, { folio: item.id, titulo: item.titulo })}
            accessibilityRole="button"
            accessibilityLabel={`Abrir contratación ${item.titulo}`}
            style={({ pressed }) => [styles.itemPress, pressed && styles.itemPressed]}
          >
            <Card selected={!!item.destacada} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo} numberOfLines={2}>
                  {item.titulo}
                </Text>
                <Badge label={item.estado} tone={item.estadoTono} />
              </View>
              <Text style={styles.cardDetalle} numberOfLines={1}>
                {item.detalle}
              </Text>
              {item.pagoEstado ? (
                <View style={styles.pagoRow}>
                  <Text style={styles.pagoLabel}>Pago de prueba</Text>
                  <Badge label={item.pagoEstado} tone={item.pagoTono} />
                </View>
              ) : null}
              {item.nota ? <Text style={styles.notaAccion}>{item.nota}</Text> : null}
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={
          <Card style={styles.vacioCard}>
            <Text style={styles.vacioTitulo}>{mensajeVacio}</Text>
            <Text style={styles.vacioTexto}>
              Cuando valides un código de finalización y califiques un servicio, aparecerá aquí.
            </Text>
            <SecondaryButton
              label="Explorar servicios"
              onPress={() => nav.reset('buscar')}
              style={{ marginTop: spacing.md }}
            />
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
  itemPress: { marginBottom: spacing.md, borderRadius: radius.lg },
  itemPressed: { opacity: 0.85 },
  card: { paddingVertical: 15 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitulo: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
    lineHeight: 20,
  },
  cardDetalle: {
    color: colors.textSec,
    fontSize: 12.5,
    marginTop: 5,
    fontVariant: ['tabular-nums'],
  },
  pagoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pagoLabel: { fontSize: 12.5, color: colors.textSec, fontFamily: F.med },
  notaAccion: {
    fontSize: 12,
    color: colors.teal,
    fontWeight: '700',
    fontFamily: F.bold,
    marginTop: 8,
  },
  vacioCard: { alignItems: 'center', paddingVertical: spacing.xl },
  vacioTitulo: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
    textAlign: 'center',
  },
  vacioTexto: {
    fontSize: 13,
    color: colors.textSec,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
  },
});
