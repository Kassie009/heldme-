/**
 * HeldMe! — Mis servicios (profesionista)
 * Port de la pantalla de Jeshua (mockup: Profesionista · Mis servicios).
 * Lista de servicios propios con estados y acciones.
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, spacing, F } from '../theme';
import { TopBar, Card, Badge, PrimaryButton, Chip } from '../ui';

const servicios = [
  {
    titulo: 'Reparación de fugas',
    estado: 'Publicado',
    tono: 'teal',
    sub: 'Plomería · Col. Jalisco · SLRC',
    acciones: ['Editar', 'Pausar', 'Retirar'],
  },
  {
    titulo: 'Mantenimiento de boilers',
    estado: 'Pausado',
    tono: 'warn',
    sub: 'Plomería · SLRC',
    acciones: ['Editar', 'Reactivar', 'Retirar'],
  },
];

export default function MisServiciosPro({ nav }) {
  const [filtro, setFiltro] = useState('publicados');
  const [avisos, setAvisos] = useState({});

  const accion = (titulo, accion) => {
    setAvisos((a) => ({ ...a, [titulo]: accion }));
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} />
        <Text style={styles.titulo}>Mis servicios</Text>

        <View style={styles.chips}>
          <Chip label="Publicados" active={filtro === 'publicados'} onPress={() => setFiltro('publicados')} />
          <Chip label="Pausados" active={filtro === 'pausados'} onPress={() => setFiltro('pausados')} />
        </View>

        {servicios.map((s) => (
          <Card key={s.titulo} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo} numberOfLines={1}>{s.titulo}</Text>
              <Badge label={s.estado} tone={s.tono} />
            </View>
            <Text style={styles.cardSub} numberOfLines={1}>{s.sub}</Text>
            <View style={styles.acciones}>
              {s.acciones.map((a) => (
                <Pressable
                  key={a}
                  onPress={() => accion(s.titulo, a)}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel={a + ' ' + s.titulo}
                >
                  <Text style={styles.accionTexto}>{a}</Text>
                </Pressable>
              ))}
            </View>
            {avisos[s.titulo] && (
              <Text style={styles.accionAviso}>
                Acción "{avisos[s.titulo]}" registrada (demostración).
              </Text>
            )}
          </Card>
        ))}

        <PrimaryButton label="Publicar servicio" onPress={() => nav.push('publicarServicio')} style={{ marginTop: spacing.md }} />
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  cardTitulo: { flex: 1, fontSize: 17, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  cardSub: { color: colors.textSec, fontSize: 13, fontWeight: '600', fontFamily: F.semi, marginTop: 3 },
  acciones: { flexDirection: 'row', gap: 18, marginTop: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  accionTexto: { color: colors.navy, fontSize: 13, fontWeight: '700', fontFamily: F.bold },
  accionAviso: { color: colors.textSec, fontSize: 11, marginTop: 8 },
});
