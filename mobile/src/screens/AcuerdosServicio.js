/**
 * HeldMe! — Pantalla 16 · Acuerdos del servicio
 * Mockup: App Móvil 3 de 11 · 6 - Acuerdos de materiales.
 * Preguntas predefinidas sobre compra/pago de materiales y gastos adicionales,
 * con confirmación explícita de ambas partes antes de iniciar (RF-32, RF-33).
 */
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { Badge, Card, Chip, Label, PrimaryButton, TopBar } from '../ui';

export default function AcuerdosServicio({ nav, params }) {
  const folio = params?.folio ?? 'HM-2044';
  const profesionista = params?.profesionista ?? 'Plomería Rivera';
  const titulo = params?.titulo;

  const [comprador, setComprador] = useState(params?.comprador || 'cliente');
  const [confirmadoCliente, setConfirmadoCliente] = useState(Boolean(params?.confirmado));
  const [cargando, setCargando] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const textoPago =
    comprador === 'cliente'
      ? 'Cliente, directamente en la tienda'
      : 'Profesionista, respaldado con comprobante de compra';

  const confirmar = () => {
    setCargando(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setConfirmadoCliente(true);
      setCargando(false);
    }, 650);
  };

  const abrirContratacion = () => {
    const destinoParams = {
      folio,
      profesionista,
      ...(titulo ? { titulo } : {}),
      comprador,
    };
    if (nav.irAContratacionDetalle) {
      nav.irAContratacionDetalle(destinoParams);
    } else {
      nav.push('contratacionDetalle', destinoParams);
    }
  };

  const pendienteAjuste = !confirmadoCliente && comprador === 'profesionista';

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
                disabled={confirmadoCliente || cargando}
                onPress={() => setComprador('cliente')}
              />
              <Chip
                label="Profesionista"
                active={comprador === 'profesionista'}
                disabled={confirmadoCliente || cargando}
                onPress={() => setComprador('profesionista')}
              />
            </View>
            {pendienteAjuste ? (
              <Text style={styles.notaCambio}>
                Al confirmar, compartiremos esta selección con {profesionista} para quedar registrada en el acuerdo.
              </Text>
            ) : null}
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
            <Text style={styles.parte} numberOfLines={1}>Tú</Text>
            <Badge
              label={confirmadoCliente ? 'Confirmaste' : 'Pendiente'}
              tone={confirmadoCliente ? 'teal' : 'warn'}
            />
          </View>
          <View style={[styles.confirmRow, styles.divisor]}>
            <Text style={styles.parte} numberOfLines={1}>{profesionista}</Text>
            <Badge
              label={pendienteAjuste ? 'Por confirmar' : 'Confirmó'}
              tone={pendienteAjuste ? 'warn' : 'mint'}
            />
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
              onPress={abrirContratacion}
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
    fontFamily: F.reg,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  acuerdosCard: { marginTop: spacing.lg, paddingVertical: 6 },
  preguntaBlock: { paddingVertical: 12 },
  divisor: { borderTopWidth: 1, borderTopColor: colors.border },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: 4 },
  notaCambio: {
    fontSize: 12,
    fontFamily: F.reg,
    color: colors.textSec,
    lineHeight: 17,
    marginTop: spacing.sm,
  },
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
  parte: {
    flex: 1,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.navy,
  },
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
