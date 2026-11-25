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

export default function ProfileScreen() {
  return (
    <MobileScreen
      title="Perfil"
      footer={<ActionButton variant="outline" label="Cerrar sesión" />}
    >
      <Card>
        <InfoRow label="Nombre" value="Aaron Félix" />
        <InfoRow label="Correo" value="aaron.fl@correo.mx" />
        <InfoRow label="Tipo de cuenta" value="Cliente" />
        <InfoRow label="Servicios contratados" value="3" />
      </Card>

      <SectionLabel>PAGOS DE PRUEBA</SectionLabel>
      <Card>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentText}>Reparación de fuga · HM-2044</Text>
          <StatusBadge tone="warning" label="Preautorizado" />
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentText}>Reparación de boiler · HM-2041</Text>
          <StatusBadge tone="info" label="Capturado" />
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentText}>Instalación de ventilador</Text>
          <StatusBadge tone="warning" label="Cancelado" />
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentText}>Curso de electricidad · CUR-0382</Text>
          <StatusBadge tone="neutral" label="Reembolsado" />
        </View>
      </Card>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  paymentText: {
    flex: 1,
    color: palette.body,
    fontSize: 14,
    fontWeight: '700',
  },
});

