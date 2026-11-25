import { StyleSheet, Text, View } from 'react-native';

import {
  ActionButton,
  Card,
  InfoRow,
  MobileScreen,
  StatusBadge,
  palette,
} from '../../components/ui';

export default function EnrollmentScreen() {
  return (
    <MobileScreen
      title="Mi inscripción"
      subtitle="Instalación eléctrica básica · Samuel Ortega"
      footer={<ActionButton label="Darme de baja" />}
    >
      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>ESTADO</Text>
          <StatusBadge label="Inscrito" tone="info" />
        </View>
        <InfoRow label="Modalidad" value="En línea en vivo" />
        <InfoRow label="Inicio" value="5 dic 2026 · 10:00" />
        <InfoRow label="Pagado (prueba)" value="$620.00" />
      </Card>

      <Card title="ENLACE DE LA SESIÓN">
        <Text style={styles.link}>Abrir enlace vivo</Text>
        <Text style={styles.helpText}>Solo lo ven los alumnos inscritos.</Text>
      </Card>

      <Text style={styles.note}>
        Si te das de baja con al menos 48 horas de anticipación se reembolsa el total (simulado).
        Después de ese plazo no hay reembolso.
      </Text>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  link: {
    color: palette.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  helpText: {
    color: palette.body,
    fontSize: 14,
    fontWeight: '600',
  },
  note: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});

