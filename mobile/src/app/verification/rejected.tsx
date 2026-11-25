import { StyleSheet, Text } from 'react-native';

import { ActionButton, Card, MobileScreen, StatusBadge, palette } from '../../components/ui';

export default function VerificationRejectedScreen() {
  return (
    <MobileScreen
      title={'Verificación\nprofesional'}
      subtitle="Laura Cota · Plomería · Col. Jaliscillo · SLRC"
      footer={<ActionButton label="Volver a solicitar revisión" />}
    >
      <Card>
        <StatusBadge label="Rechazada" tone="danger" />
        <Text style={styles.message}>La evidencia no pudo asociarse al servicio declarado.</Text>
        <Text style={styles.helper}>Decisión de administración · 18 nov 2026.</Text>
        <Text style={styles.helper}>
          Puedes consultar la decisión y, cuando se permita, volver a solicitar la revisión con
          nueva evidencia.
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

