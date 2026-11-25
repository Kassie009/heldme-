import { StyleSheet, Text } from 'react-native';

import { ActionButton, Card, InfoRow, MobileScreen, palette } from '../../components/ui';

export default function CourseScreen() {
  return (
    <MobileScreen
      title={'Reparación y mantenimiento\nde boilers'}
      subtitle="Mónica Acosta · Plata · 4.8"
      footer={<ActionButton label="Inscribirme y pagar (prueba)" />}
    >
      <Card>
        <InfoRow label="Modalidad" value="Presencial" />
        <InfoRow label="Lugar" value="Centro de capacitación, Col. Centro" />
        <InfoRow label="Lugares disponibles" value="4 de 12" />
        <InfoRow label="Precio" value="$850.00" />
      </Card>

      <Card title="TEMARIO">
        <Text style={styles.paragraph}>
          1 Diagnóstico seguro · Reparación · Práctica y mantenimiento.
        </Text>
      </Card>

      <Card title="TARJETA DE PRUEBA">
        <Text style={styles.cardNumber}>4242 4242 4242 4242</Text>
      </Card>

      <Text style={styles.note}>
        Pago simulado, sin cargos reales. Baja con 48 h de anticipación y reembolso total.
      </Text>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    color: palette.body,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  cardNumber: {
    color: palette.title,
    fontSize: 21,
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  note: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
});

