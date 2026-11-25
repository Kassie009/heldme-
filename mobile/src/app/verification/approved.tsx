import { StyleSheet, Text } from 'react-native';

import {
  ActionButton,
  Card,
  InfoRow,
  MobileScreen,
  StatusBadge,
  palette,
} from '../../components/ui';

export default function VerificationApprovedScreen() {
  return (
    <MobileScreen
      title={'Verificación\nprofesional'}
      subtitle="Laura Cota · Plomería · Cd. Juárez · SLRC"
      footer={<ActionButton label="Ir a mi panel" />}
    >
      <Card>
        <StatusBadge label="Aprobada" tone="success" />
        <Text style={styles.message}>Tu cuenta profesional ya está habilitada.</Text>
        <Text style={styles.helper}>Aprobada el 20 nov 2026. Ya puedes publicar servicios y cotizar.</Text>
      </Card>

      <Card>
        <InfoRow label="Rango inicial" value="Plata" />
        <Text style={styles.helper}>
          Asignado por verificación aprobada. Se reevalúa al completar cinco servicios en HeldMe.
        </Text>
      </Card>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  message: {
    color: palette.title,
    fontSize: 20,
    fontWeight: '800',
  },
  helper: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});

