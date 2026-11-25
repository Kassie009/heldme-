import { StyleSheet, Text, View } from 'react-native';

import {
  ActionButton,
  Card,
  InfoRow,
  MobileScreen,
  SectionLabel,
  StatusBadge,
  palette,
} from '../../components/ui';

export default function VerificationRequiresInfoScreen() {
  return (
    <MobileScreen
      title={'Verificación\nprofesional'}
      subtitle="Jóvenes · Carpintería · Búsqueda · SLRC"
      footer={
        <View style={styles.footerStack}>
          <ActionButton variant="outline" label="Adjuntar fotografía" />
          <ActionButton label="Corregir y reenviar solicitud" />
        </View>
      }
    >
      <Card>
        <StatusBadge label="Requiere información" tone="warning" />
        <Text style={styles.message}>Se solicita fotografía adicional del trabajo.</Text>
        <Text style={styles.helper}>12 nov 2026 · Administración</Text>
      </Card>

      <Card>
        <SectionLabel>TU SOLICITUD</SectionLabel>
        <InfoRow label="Perfil y experiencia" value="Enviado" />
        <InfoRow label="Identificación oficial" value="Enviado" />
        <InfoRow label="Evidencia obligatoria" value="Enviada" />
        <InfoRow label="Fotografía final" value="Pendiente" />
        <InfoRow label="Certificados (opcional)" value="Sin adjuntar" />
      </Card>

      <Text style={styles.note}>
        Cuentas con tiempo abierto para completar tu perfil y enviar la evidencia en JPG, PNG
        o WebP (hasta 5 MB).
      </Text>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  footerStack: {
    gap: 8,
  },
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

