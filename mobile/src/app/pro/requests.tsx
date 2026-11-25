import { StyleSheet, Text, View } from 'react-native';

import {
  ActionButton,
  Card,
  MobileScreen,
  StatusBadge,
  palette,
} from '../../components/ui';

export default function ProRequestsScreen() {
  return (
    <MobileScreen title="Solicitudes recibidas" subtitle="Últimas por categoría y zona">
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.requestTitle}>Reparación de fuga</Text>
          <StatusBadge label="Nueva" tone="success" />
        </View>
        <Text style={styles.meta}>Aaron Félix · Plomería · Col. Centro · SLRC</Text>
        <ActionButton style={styles.buttonSpacing} label="Cotizar" />
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.requestTitle}>Cambio de tubería de cocina</Text>
          <StatusBadge label="Cotizada" tone="warning" />
        </View>
        <Text style={styles.meta}>Sofía Luna · Plomería · Col. Jaliscillo</Text>
      </Card>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  requestTitle: {
    flex: 1,
    color: palette.title,
    fontSize: 17,
    fontWeight: '800',
  },
  meta: {
    color: palette.muted,
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '600',
  },
  buttonSpacing: {
    marginTop: 4,
  },
});

