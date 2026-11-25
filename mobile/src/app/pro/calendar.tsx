import { StyleSheet, Text, View } from 'react-native';

import { ActionButton, Card, MobileScreen, palette } from '../../components/ui';

const days = ['23', '24', '25', '26', '27'];

export default function ProCalendarScreen() {
  return (
    <MobileScreen title="Calendario" subtitle="Noviembre 2026">
      <View style={styles.daysRow}>
        {days.map((day) => (
          <View key={day} style={styles.dayPill}>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>

      <Card>
        <View style={styles.scheduleRow}>
          <Text style={styles.priceText}>$80</Text>
          <Text style={styles.serviceText}>Revisión de fuga</Text>
          <Text style={styles.codePill}>HM-2044</Text>
        </View>
        <Text style={styles.meta}>Aaron Félix · Col. Centro</Text>
      </Card>

      <Card>
        <Text style={styles.availableLabel}>Disponible</Text>
        <Text style={styles.availableTime}>09:00 - 14:00</Text>
        <ActionButton variant="outline" label="Editar disponibilidad" style={styles.editButton} />
      </Card>

      <Text style={styles.note}>No se confirman reservas al mismo horario.</Text>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  daysRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  dayPill: {
    borderWidth: 1,
    borderColor: '#D6E8F4',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 11,
    backgroundColor: '#FFFFFF',
  },
  dayText: {
    color: palette.title,
    fontWeight: '700',
    fontSize: 13,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  priceText: {
    color: palette.title,
    fontSize: 19,
    fontWeight: '900',
  },
  serviceText: {
    color: palette.body,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  codePill: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: '#DEF0F7',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  meta: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
  availableLabel: {
    color: palette.body,
    fontSize: 15,
    fontWeight: '700',
  },
  availableTime: {
    color: palette.title,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  editButton: {
    marginTop: 4,
  },
  note: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});

