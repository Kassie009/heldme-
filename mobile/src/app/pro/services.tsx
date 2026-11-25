import { StyleSheet, Text, View } from 'react-native';

import {
  ActionButton,
  Card,
  MobileScreen,
  StatusBadge,
  palette,
} from '../../components/ui';

export default function ProServicesScreen() {
  return (
    <MobileScreen title="Mis servicios" footer={<ActionButton label="Publicar servicio" />}>
      <View style={styles.filtersRow}>
        <StatusBadge label="Publicados" tone="success" />
        <StatusBadge label="Pausados" tone="warning" />
        <StatusBadge label="Tus envíos" tone="neutral" />
      </View>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.serviceTitle}>Reparación de fugas</Text>
          <StatusBadge label="Publicado" tone="info" />
        </View>
        <Text style={styles.meta}>Plomería · Col. Altas · 35%</Text>
        <View style={styles.actionsRow}>
          <Text style={styles.actionText}>Editar</Text>
          <Text style={styles.actionText}>Pausar</Text>
          <Text style={styles.actionText}>Retirar</Text>
        </View>
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.serviceTitle}>Mantenimiento de boilers</Text>
          <StatusBadge label="Pausado" tone="warning" />
        </View>
        <Text style={styles.meta}>Herrería · 8.5%</Text>
      </Card>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  serviceTitle: {
    color: palette.title,
    fontSize: 19,
    fontWeight: '800',
    flex: 1,
  },
  meta: {
    color: palette.muted,
    fontSize: 13,
    marginBottom: 2,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 18,
  },
  actionText: {
    color: palette.body,
    fontSize: 13,
    fontWeight: '700',
  },
});

