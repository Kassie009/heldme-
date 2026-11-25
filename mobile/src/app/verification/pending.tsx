import { StyleSheet, Text } from 'react-native';

import {
  ActionButton,
  Card,
  InfoRow,
  MobileScreen,
  SectionLabel,
  StatusBadge,
  palette,
} from '../../components/ui';

export default function VerificationPendingScreen() {
  return (
    <MobileScreen
      title={'Verificación\nprofesional'}
      subtitle="Laura Cota · Plomería · Cd. Juárez · SLRC"
      footer={<ActionButton label="Editar perfil" />}
    >
      <Card>
        <StatusBadge label="Pendiente" tone="warning" />
        <Text style={styles.message}>Estamos revisando tu evidencia.</Text>
        <Text style={styles.helper}>Enviado el 23 nov 2026 · Administración la revisará pronto.</Text>
      </Card>

      <Card>
        <SectionLabel>TU SOLICITUD</SectionLabel>
        <InfoRow label="Perfil y experiencia" value="Enviado" />
        <InfoRow label="Identificación oficial" value="Enviado" />
        <InfoRow label="Evidencia obligatoria" value="2 archivos" />
        <InfoRow label="Certificados (opcional)" value="1 archivo" />
      </Card>

      <Text style={styles.note}>
        Mientras tu cuenta no esté aprobada sí puedes editar tu perfil y consultar el estado.
      </Text>
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
  note: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});

