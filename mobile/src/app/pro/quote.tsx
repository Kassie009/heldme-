import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  ActionButton,
  Card,
  InlineInput,
  MobileScreen,
  SectionLabel,
  palette,
} from '../../components/ui';

type PriceMode = 'fixed' | 'estimate';

export default function ProQuoteScreen() {
  const [mode, setMode] = useState<PriceMode>('fixed');

  return (
    <MobileScreen
      title="Nueva cotización"
      subtitle="Reparación de fuga · Aaron Félix · Col. Centro · SLRC"
      footer={<ActionButton label="Enviar cotización" />}
    >
      <Card title="MANO DE OBRA Y DIAGNÓSTICO">
        <View style={styles.row}>
          <Text style={styles.itemLabel}>Mano de obra</Text>
          <Text style={styles.itemValue}>$500.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemLabel}>Diagnóstico</Text>
          <Text style={styles.itemValue}>$200.00</Text>
        </View>
      </Card>

      <Card title="MATERIAL">
        <View style={styles.row}>
          <Text style={styles.itemLabel}>Tubería y conexiones · 1 pza</Text>
          <Text style={styles.itemValue}>$1,000.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemLabel}>Lo compra</Text>
          <Text style={styles.itemValue}>Cliente</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemLabel}>Cubre el costo</Text>
          <Text style={styles.itemValue}>Cliente</Text>
        </View>

        <ActionButton
          variant="outline"
          label="Adjuntar foto del ticket o factura"
          style={styles.uploadButton}
        />
      </Card>

      <View style={styles.segmentedRow}>
        <Pressable
          onPress={() => setMode('fixed')}
          style={[styles.modeChip, mode === 'fixed' ? styles.modeChipActive : null]}
        >
          <Text style={[styles.modeText, mode === 'fixed' ? styles.modeTextActive : null]}>
            Precio fijo
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode('estimate')}
          style={[styles.modeChip, mode === 'estimate' ? styles.modeChipActive : null]}
        >
          <Text style={[styles.modeText, mode === 'estimate' ? styles.modeTextActive : null]}>
            Estimado
          </Text>
        </Pressable>
      </View>

      <SectionLabel>CONDICIONES</SectionLabel>
      <InlineInput value="Condiciones de la cotización" />

      <Card>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total para el cliente</Text>
          <Text style={styles.totalValue}>$1,700.00</Text>
        </View>
        <Text style={styles.totalNote}>
          Cualquier trabajo adicional requiere una nueva versión que el cliente debe aceptar.
        </Text>
      </Card>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  itemLabel: {
    color: palette.body,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  itemValue: {
    color: palette.title,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
  },
  uploadButton: {
    marginTop: 8,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 2,
  },
  modeChip: {
    borderWidth: 1,
    borderColor: '#D8E8F4',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  modeChipActive: {
    backgroundColor: '#DFF3F7',
    borderColor: '#BFE4EC',
  },
  modeText: {
    color: palette.body,
    fontWeight: '700',
    fontSize: 14,
  },
  modeTextActive: {
    color: palette.primaryDark,
  },
  totalLabel: {
    color: palette.title,
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
  },
  totalValue: {
    color: palette.title,
    fontSize: 26,
    fontWeight: '900',
  },
  totalNote: {
    color: palette.body,
    fontSize: 14,
    lineHeight: 20,
  },
});

