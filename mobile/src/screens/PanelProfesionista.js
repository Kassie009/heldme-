/**
 * HeldMe! — Panel del profesionista (pantalla provisional)
 * Destino al iniciar sesión como profesionista mientras el equipo construye
 * las pantallas definitivas (mockup páginas 4-11, etapa 2 del plan de trabajo).
 * Lista los apartados exclusivos del profesionista (RF-02, ARQ-02).
 */
import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Card, Badge } from '../ui';

const apartados = [
  { icono: 'construct', titulo: 'Mis servicios', desc: 'Publicar, editar, pausar y retirar (pendiente de construcción)' },
  { icono: 'document-text', titulo: 'Solicitudes recibidas', desc: 'Solicitudes de clientes en tu zona (pendiente)' },
  { icono: 'receipt', titulo: 'Cotizaciones', desc: 'Elaborar y versionar cotizaciones (pendiente)' },
  { icono: 'calendar', titulo: 'Calendario', desc: 'Disponibilidad y reservas sin duplicados (pendiente)' },
  { icono: 'key', titulo: 'Códigos de servicio', desc: 'Códigos de inicio y finalización (pendiente)' },
  { icono: 'chatbubbles', titulo: 'Chat', desc: 'Negociación por conversación (pendiente)' },
  { icono: 'school', titulo: 'Cursos autorizados', desc: 'Crear y administrar cursos aprobados (pendiente)' },
];

export default function PanelProfesionista({ nav, params }) {
  const nombre = params?.nombre ?? 'Profesionista';

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} />
        <Text style={styles.titulo}>Hola, {nombre.split(' ')[0]}</Text>
        <Text style={styles.sub}>
          Panel del profesionista · Cuenta en verificación o aprobada por
          administración.
        </Text>

        <View style={styles.aviso}>
          <Ionicons name="construct" size={16} color={colors.warnText} />
          <Text style={styles.avisoTexto}>
            Pantallas internas en desarrollo — etapa 2 del plan de trabajo.
          </Text>
        </View>

        {apartados.map((a) => (
          <Card key={a.titulo} style={styles.card}>
            <View style={styles.icono}>
              <Ionicons name={a.icono} size={20} color={colors.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo}>{a.titulo}</Text>
                <Badge label="Pronto" tone="warn" />
              </View>
              <Text style={styles.cardDesc}>{a.desc}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4, lineHeight: 18 },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warnBg,
    borderColor: colors.warnBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: spacing.lg,
  },
  avisoTexto: { flex: 1, color: colors.warnText, fontSize: 12, fontWeight: '600', fontFamily: F.semi, lineHeight: 17 },
  card: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: spacing.md },
  icono: {
    backgroundColor: colors.mint,
    borderRadius: 12,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTitulo: { fontSize: 15, fontWeight: '700', fontFamily: F.bold, color: colors.navy },
  cardDesc: { color: colors.textSec, fontSize: 12, lineHeight: 17, marginTop: 2 },
});
