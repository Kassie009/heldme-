/**
 * HeldMe! — Pantalla 14 · Conversaciones
 * Mockup: App Móvil 3 de 11 · 4 - Conversaciones.
 * Lista de conversaciones vinculadas a una solicitud, cotización o contratación.
 */
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { Badge, Card, Chip, TopBar } from '../ui';

const conversacionesIniciales = [
  {
    id: 'hm-2044',
    nombre: 'Plomería Rivera',
    tipo: 'contratacion',
    etiqueta: 'Contratación · HM-2044',
    estadoChat: 'Contratado',
    folio: 'HM-2044',
    servicio: 'Reparación de fuga',
    ultimoMensaje: 'Llevo diagnóstico y te envío la cotización final.',
    hora: '15:42',
  },
  {
    id: 'cot-molina',
    nombre: 'Diego Molina',
    tipo: 'cotizacion',
    etiqueta: 'Cotización',
    estadoChat: 'En cotización',
    folio: 'SOL-109',
    servicio: 'Instalación de calentador de paso',
    ultimoMensaje: '¿La cotización incluye el diagnóstico?',
    hora: 'Ayer',
  },
];

const filtros = [
  { key: 'todas', label: 'Todas' },
  { key: 'contratacion', label: 'Contrataciones' },
  { key: 'cotizacion', label: 'Cotizaciones' },
];

export default function Conversaciones({ nav }) {
  const [filtro, setFiltro] = useState('todas');

  const visibles = useMemo(() => {
    if (filtro === 'todas') return conversacionesIniciales;
    return conversacionesIniciales.filter((c) => c.tipo === filtro);
  }, [filtro]);

  const abrirChat = (item) =>
    nav.push('chat', {
      nombre: item.nombre,
      folio: item.folio,
      servicio: item.servicio,
      estado: item.estadoChat,
      tipoVinculo: item.tipo,
    });

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
            <Text style={styles.titulo}>Chat</Text>
            <Text style={styles.sub}>
              Cada conversación está vinculada a una solicitud, cotización o contratación.
            </Text>
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
        renderItem={({ item }) => (
          <Pressable
            onPress={() => abrirChat(item)}
            accessibilityRole="button"
            accessibilityLabel={`Abrir conversación con ${item.nombre}`}
            style={({ pressed }) => [styles.itemPress, pressed && styles.itemPressed]}
          >
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.nombre} numberOfLines={1}>
                  {item.nombre}
                </Text>
                <View style={styles.badgeWrap}>
                  <Badge label={item.etiqueta} tone="mint" />
                </View>
              </View>
              <View style={styles.mensajeRow}>
                <Text style={styles.ultimoMensaje} numberOfLines={2}>
                  {item.ultimoMensaje}
                </Text>
                <Text style={styles.hora}>{item.hora}</Text>
              </View>
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={
          <Card style={styles.vacioCard}>
            <Text style={styles.vacioTitulo}>Sin conversaciones aquí</Text>
            <Text style={styles.vacioTexto}>
              No tienes conversaciones activas bajo este filtro.
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
  headerWrap: { marginBottom: spacing.md },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, fontFamily: F.reg, lineHeight: 19, marginTop: 4 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  itemPress: { marginBottom: spacing.md, borderRadius: radius.lg },
  itemPressed: { opacity: 0.85 },
  card: { paddingVertical: 14 },
  cardHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nombre: {
    flex: 1,
    minWidth: 110,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
  },
  badgeWrap: { flexShrink: 1, maxWidth: '100%' },
  mensajeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  ultimoMensaje: { flex: 1, fontSize: 13, fontFamily: F.reg, color: colors.textSec, lineHeight: 18 },
  hora: {
    fontSize: 11.5,
    color: colors.textSec,
    fontFamily: F.med,
    fontVariant: ['tabular-nums'],
  },
  vacioCard: { alignItems: 'center', paddingVertical: spacing.xl },
  vacioTitulo: { fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  vacioTexto: { fontSize: 13, fontFamily: F.reg, color: colors.textSec, marginTop: 4, textAlign: 'center' },
});
