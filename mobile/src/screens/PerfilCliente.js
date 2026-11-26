/**
 * HeldMe! — Perfil (cliente)
 * Port de la pantalla de Jeshua (mockup: Cuenta · Perfil).
 * Datos de la cuenta y pagos de prueba (RF-38).
 */
import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, F } from '../theme';
import { TopBar, Card, Badge, InfoRow, SecondaryButton } from '../ui';

export default function PerfilCliente({ nav, params }) {
  const nombre = params?.nombre ?? 'Aaron Félix';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onMenu={nav.openMenu} />
      <Text style={styles.titulo}>Perfil</Text>

      <Card style={styles.tarjeta}>
        <InfoRow label="Nombre" value={nombre} />
        <InfoRow label="Correo" value="kass@gmail.com" />
        <InfoRow label="Tipo de cuenta" value="Cliente" tone="teal" />
        <InfoRow label="Servicios contratados" value="3" />
      </Card>

      <Text style={styles.kicker}>PAGOS DE PRUEBA</Text>
      <Card style={styles.tarjeta}>
        <View style={styles.filaPago}>
          <Text style={styles.pagoTexto} numberOfLines={1}>Reparación de fuga · HM-2044</Text>
          <Badge label="Preautorizado" tone="warn" />
        </View>
        <View style={styles.filaPago}>
          <Text style={styles.pagoTexto} numberOfLines={1}>Reparación de boiler · HM-2041</Text>
          <Badge label="Capturado" tone="teal" />
        </View>
      </Card>

      <SecondaryButton
        label="Cerrar sesión"
        onPress={() => nav.reset('tipo')}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy, marginBottom: spacing.md },
  tarjeta: { marginBottom: spacing.md },
  kicker: { fontSize: 10.5, fontWeight: '700', fontFamily: F.bold, color: colors.textSec, letterSpacing: 0.8, marginBottom: 4 },
  filaPago: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 8,
  },
  pagoTexto: { flex: 1, fontSize: 13.5, color: colors.navy, fontWeight: '600', fontFamily: F.semi },
});
