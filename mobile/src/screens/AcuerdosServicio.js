/**
 * HeldMe! — Pantalla 16 · Acuerdos del servicio
 * Mockup: App Móvil 3 de 11 · 6 - Acuerdos de materiales.
 * Preguntas predefinidas sobre compra/pago de materiales y gastos adicionales,
 * con confirmación explícita de ambas partes antes de iniciar (RF-32, RF-33).
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { Badge, Card, Chip, Label, PrimaryButton, TopBar } from '../ui';

export default function AcuerdosServicio({ nav, params }) {
  const folio = params?.folio ?? 'HM-2044';
  const profesionista = params?.profesionista ?? 'Plomería Rivera';

  const [comprador, setComprador] = useState('cliente');
  const [confirmadoCliente, setConfirmadoCliente] = useState(false);
  const [cargando, setCargando] = useState(false);

  const textoPago =
    comprador === 'cliente'
      ? 'Cliente, directamente en la tienda'
      : 'Profesionista, respaldado con comprobante de compra';

  const confirmar = () => {
    setCargando(true);
    setTimeout(() => {
      setConfirmadoCliente(true);
      setCargando(false);
    }, 650);
  };

  return (
    <View style={styles.screen}>
      <TopBar onBack={nav.back} />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <Text style={styles.titulo}>Acuerdos del servicio</Text>
        <Text style={styles.sub}>{folio} · Antes de confirmar el trabajo</Text>

        {/* Preguntas predefinidas agrupadas en una superficie con divisores finos */}
        <Card style={styles.acuerdosCard}>
          <View style={styles.preguntaBlock}>
            <Label>¿QUIÉN COMPRA LOS MATERIALES?</Label>
            <View style={styles.chips}>
              <Chip
                label="Cliente"
                active={comprador === 'cliente'}
                disabled={confirmadoCliente}
                onPress={() => setComprador('cliente')}
              />
              <Chip
                label="Profesionista"
                active={comprador === 'profesionista'}
                disabled={confirmadoCliente}
                onPress={() => setComprador('profesionista')}
              />
            </View>
          </View>

          <View style={[styles.preguntaBlock, styles.divisor]}>
            <Label>¿QUIÉN PAGA SUS COSTOS?</Label>
            <Text style={styles.respuesta}>{textoPago}</Text>
          </View>

          <View style={[styles.preguntaBlock, styles.divisor]}>
            <Label>¿CÓMO SE TRATAN LOS GASTOS ADICIONALES?</Label>
            <Text style={styles.respuesta}>
              Nueva versión de cotización con tu aceptación
            </Text>
          </View>
        </Card>

        {/* Estado de confirmación de ambas partes */}
        <Card style={styles.confirmCard}>
          <View style={styles.confirmRow}>
            <Text style={styles.parte}>Tú</Text>
            <Badge
              label={confirmadoCliente ? 'Confirmó' : 'Pendiente'}
              tone={confirmadoCliente ? 'teal' : 'warn'}
            />
          </View>
          <View style={[styles.confirmRow, styles.divisor]}>
            <Text style={styles.parte}>{profesionista}</Text>
            <Badge label="Confirmó" tone="mint" />
          </View>
        </Card>

        {confirmadoCliente ? (
          <>
            <View style={styles.avisoOk}>
              <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
              <Text style={styles.avisoOkTexto}>
                Acuerdos confirmados por ambas partes. Ya puedes consultar el código de inicio de tu contratación.
              </Text>
            </View>
            <PrimaryButton
              label="Ver contratación y código de inicio"
              onPress={() => nav.push('contratacionDetalle', { folio, profesionista })}
              style={{ marginTop: spacing.lg }}
            />
          </>
        ) : (
          <PrimaryButton
            label="Confirmar acuerdos"
            loading={cargando}
            loadingLabel="Confirmando acuerdos..."
            onPress={confirmar}
            style={{ marginTop: spacing.xl }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: {
    color: colors.textSec,
    fontSize: 13,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  acuerdosCard: { marginTop: spacing.lg, paddingVertical: 6 },
  preguntaBlock: { paddingVertical: 12 },
  divisor: { borderTopWidth: 1, borderTopColor: colors.border },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: 4 },
  respuesta: {
    fontSize: 14.5,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.navy,
    lineHeight: 20,
  },
  confirmCard: { marginTop: spacing.md, paddingVertical: 4 },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  parte: { fontSize: 14, fontWeight: '700', fontFamily: F.bold, color: colors.navy },
  avisoOk: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EBF4F6',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  avisoOkTexto: {
    flex: 1,
    fontSize: 13,
    color: colors.navy,
    lineHeight: 19,
    fontFamily: F.med,
  },
});
