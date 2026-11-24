/**
 * HeldMe! — Pantalla 13 · Cotizaciones recibidas (comparar cotizaciones)
 * Mockup: App Móvil 3 de 11 · 3 - Comparar cotizaciones.
 * El cliente compara propuestas desglosadas; al seleccionar una, las demás
 * dejan de estar disponibles para esa solicitud.
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import {
  TopBar, Card, Badge, PrimaryButton, SecondaryButton, TextLink,
} from '../ui';

const cotizaciones = [
  {
    id: 'rivera',
    nombre: 'Plomería Rivera',
    badge: 'Oro · 4.9',
    tipoPrecio: 'PRECIO FIJO',
    filas: [
      ['Mano de obra', '$500.00'],
      ['Diagnóstico', '$200.00'],
      ['Materiales (compra directa)', '$1,000.00'],
    ],
    total: 'Total',
    totalTexto: '$1,700.00',
    accion: 'seleccionar',
  },
  {
    id: 'molina',
    nombre: 'Diego Molina',
    badge: 'Plata · 4.7',
    tipoPrecio: 'PRECIO ESTIMADO',
    filas: [
      ['Mano de obra', '$450.00'],
      ['Diagnóstico', '$150.00'],
      ['Materiales (compra directa)', '$900.00'],
    ],
    total: 'Total estimado',
    totalTexto: '$1,500.00',
    accion: 'chatear',
  },
];

export default function CotizacionesRecibidas({ nav }) {
  const [seleccionada, setSeleccionada] = useState(null);
  const [cargandoChat, setCargandoChat] = useState(false);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onBack={nav.back} />
      <Text style={styles.titulo}>Cotizaciones recibidas</Text>
      <Text style={styles.sub} numberOfLines={1}>
        Reparación de fuga · Col. Centro · SLRC
      </Text>

      {cotizaciones.map((c) => {
        const elegida = seleccionada === c.id;
        const bloqueada = seleccionada !== null && !elegida;
        return (
          <Card key={c.id} selected={elegida} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.nombre} numberOfLines={1}>{c.nombre}</Text>
              <Badge label={c.badge} />
            </View>
            <Text style={styles.tipoPrecio}>{c.tipoPrecio}</Text>

            {c.filas.map(([concepto, monto]) => (
              <View key={concepto} style={styles.fila}>
                <Text style={styles.concepto} numberOfLines={1}>{concepto}</Text>
                <Text style={styles.monto}>{monto}</Text>
              </View>
            ))}
            <View style={[styles.fila, styles.filaTotal]}>
              <Text style={styles.totalLabel}>{c.total}</Text>
              <Text style={styles.totalValor}>{c.totalTexto}</Text>
            </View>

            {c.accion === 'seleccionar' ? (
              <>
                <PrimaryButton
                  label={elegida ? 'Cotización seleccionada' : 'Seleccionar cotización'}
                  disabled={bloqueada || elegida}
                  onPress={() => setSeleccionada(c.id)}
                  style={{ marginTop: spacing.md }}
                />
                {elegida && (
                  <SecondaryButton
                    label="Chatear con el profesionista"
                    onPress={() => nav.push('chat')}
                    style={{ marginTop: spacing.sm }}
                  />
                )}
              </>
            ) : (
              <PrimaryButton
                label={bloqueada ? 'No disponible' : 'Ver detalle y chatear'}
                disabled={bloqueada}
                loading={cargandoChat}
                loadingLabel="Abriendo chat..."
                onPress={() => {
                  setCargandoChat(true);
                  setTimeout(() => {
                    nav.push('chat');
                    setCargandoChat(false);
                  }, 700);
                }}
                style={{ marginTop: spacing.md }}
              />
            )}
          </Card>
        );
      })}

      <Text style={styles.nota}>
        Al seleccionar una propuesta, las demás dejan de estar disponibles para
        esta solicitud.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4 },
  card: { marginTop: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  nombre: { flex: 1, fontSize: 16, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  tipoPrecio: {
    fontSize: 10.5,
    fontWeight: '700', fontFamily: F.bold,
    color: colors.textSec,
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 6,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  concepto: { flex: 1, fontSize: 13.5, color: colors.navy },
  monto: { fontSize: 13.5, fontWeight: '600', fontFamily: F.semi, color: colors.navy, marginLeft: 12 },
  filaTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 6,
    paddingTop: 10,
  },
  totalLabel: { fontSize: 14, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  totalValor: { fontSize: 16, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  nota: {
    color: colors.textSec,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
