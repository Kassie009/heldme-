import { StyleSheet, Text } from 'react-native';

import {
  ActionButton,
  Card,
  InlineInput,
  MobileScreen,
  SectionLabel,
  StatusBadge,
  palette,
} from '../../components/ui';

export default function ProPublishServiceScreen() {
  return (
    <MobileScreen title="Publicar servicio" footer={<ActionButton label="Publicar" />}>
      <SectionLabel>TÍTULO</SectionLabel>
      <InlineInput value="Reparación de fugas" />

      <SectionLabel>CATEGORÍA</SectionLabel>
      <InlineInput value="Plomería" />

      <SectionLabel>DESCRIPCIÓN</SectionLabel>
      <Card>
        <Text style={styles.paragraph}>Detección y reparación de fugas.</Text>
      </Card>

      <SectionLabel>ZONA DE ATENCIÓN</SectionLabel>
      <InlineInput value="Col. Jalisco · SLRC" />

      <SectionLabel>SLOTS DEL SERVICIO</SectionLabel>
      <StatusBadge label="1 hora" tone="info" />
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
});

