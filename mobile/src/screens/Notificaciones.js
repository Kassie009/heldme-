/**
 * HeldMe! — Notificaciones (cliente y profesionista)
 * Mockup: App Móvil 2 de 12 · 1 - Notificaciones (cliente) y 8 de 12 (profesionista).
 * Notificaciones dentro del sistema (RF-13): no leídas vs leídas, marcar todas.
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Badge, TextLink } from '../ui';


const notificacionesPorRol = {
  cliente: [
    { id: 1, titulo: 'Nueva cotización recibida', detalle: 'Plomería Rivera · Reparación de fuga', cuando: 'Hace 12 min', leida: false },
    { id: 2, titulo: 'El profesional marcó el servicio como realizado', detalle: 'HM-2044 · Comparte tu código de finalización', cuando: 'Hace 1 h', leida: false },
    { id: 3, titulo: 'Tu servicio cambió a En proceso', detalle: 'HM-2047 · Cambio de tubería de cocina', cuando: 'Ayer', leida: true },
    { id: 4, titulo: 'Pago de prueba preautorizado', detalle: 'HM-2044 · $700.00', cuando: 'Ayer', leida: true },
  ],
  profesionista: [
    { id: 1, titulo: 'Nueva solicitud en tu zona', detalle: 'Plomería · Col. Centro · SLRC', cuando: 'Hace 8 min', leida: false },
    { id: 2, titulo: 'Tu cotización fue aceptada', detalle: 'HM-2044 · Aaron Félix', cuando: 'Hace 2 h', leida: false },
    { id: 3, titulo: 'Nueva solicitud en tu zona', detalle: 'Plomería · Col. Jalisco · SLRC', cuando: 'Ayer', leida: true },
    { id: 4, titulo: 'Cita agendada', detalle: 'HM-2047 · 26 nov · 11:00', cuando: 'Ayer', leida: true },
  ],
};

export default function Notificaciones({ nav, params }) {
  const tipo = params?.tipo ?? 'cliente';
  const [notas, setNotas] = useState(notificacionesPorRol[tipo] || notificacionesPorRol.cliente);

  const sinLeer = notas.filter((n) => !n.leida).length;

  const marcarTodas = () => setNotas((n) => n.map((x) => ({ ...x, leida: true })));
  const marcarUna = (id) => setNotas((n) => n.map((x) => (x.id === id ? { ...x, leida: true } : x)));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} onBack={nav.puedeRetroceder ? nav.back : undefined} />
        <View style={styles.header}>
          <Text style={styles.titulo}>Notificaciones</Text>
          {sinLeer > 0 && <Badge label={sinLeer + ' sin leer'} tone="teal" />}
        </View>
        <View style={styles.acciones}>
          <Text />
          {sinLeer > 0 && (
            <TextLink onPress={marcarTodas}>Marcar todas como leídas</TextLink>
          )}
        </View>

        {notas.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => marcarUna(n.id)}
            style={({ pressed }) => [
              styles.item,
              !n.leida && styles.itemSinLeer,
              pressed && styles.itemPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={'Notificación' + (n.leida ? '' : ' sin leer') + ': ' + n.titulo}
          >
            <View style={styles.itemHeader}>
              {!n.leida && <View style={styles.punto} />}
              <Text style={[styles.itemTitulo, !n.leida && { fontWeight: '800', fontFamily: F.extra }]} numberOfLines={1}>
                {n.titulo}
              </Text>
            </View>
            <Text style={styles.itemDetalle} numberOfLines={1}>{n.detalle}</Text>
            <Text style={styles.itemCuando}>{n.cuando}</Text>
          </Pressable>
        ))}

        {sinLeer === 0 && (
          <Text style={styles.todoLeido}>No tienes notificaciones sin leer.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  acciones: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  item: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  itemSinLeer: { backgroundColor: colors.mint, borderColor: colors.mint },
  itemPressed: { backgroundColor: colors.panel },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  punto: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal },
  itemTitulo: { flex: 1, fontSize: 14, fontWeight: '600', fontFamily: F.semi, color: colors.navy },
  itemDetalle: { color: colors.textSec, fontSize: 12.5, marginTop: 3 },
  itemCuando: { color: colors.textSec, fontSize: 11, marginTop: 5, fontWeight: '500', fontFamily: F.med },
  todoLeido: { color: colors.textSec, fontSize: 13, textAlign: 'center', marginTop: spacing.lg },
});
