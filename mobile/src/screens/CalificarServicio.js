/**
 * HeldMe! — Pantalla 23 · Calificar servicio
 * Mockup: App Móvil 5 de 11 · 3 - Calificar.
 * Calificación de 1 a 5 estrellas tras validar el código de finalización y
 * capturar el monto de prueba en Stripe Test Mode (RF-20, RF-21, RN-04).
 */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { Card, PrimaryButton, TopBar } from '../ui';

const etiquetas = {
  1: '1 de 5 estrellas · Muy deficiente',
  2: '2 de 5 estrellas · Regular',
  3: '3 de 5 estrellas · Aceptable',
  4: '4 de 5 estrellas · Muy bueno',
  5: '5 de 5 estrellas · Excelente',
};

function SelectorEstrellas({ valor, alCambiar, deshabilitado }) {
  return (
    <View style={styles.estrellasRow} accessibilityRole="radiogroup">
      {[1, 2, 3, 4, 5].map((n) => {
        const activa = n <= valor;
        return (
          <Pressable
            key={n}
            onPress={() => !deshabilitado && alCambiar(n)}
            disabled={deshabilitado}
            accessibilityRole="radio"
            accessibilityState={{ selected: valor === n, disabled: deshabilitado }}
            accessibilityLabel={`${n} de 5 estrellas`}
            style={({ pressed }) => [
              styles.estrellaBtn,
              pressed && !deshabilitado && { opacity: 0.7 },
            ]}
          >
            <Ionicons
              name={activa ? 'star' : 'star-outline'}
              size={32}
              color={activa ? colors.teal : colors.borderStrong}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function CalificarServicio({ nav, params }) {
  const folio = params?.folio ?? 'HM-2044';
  const profesionista = params?.profesionista ?? 'Plomería Rivera';

  const [estrellas, setEstrellas] = useState(5);
  const [cargando, setCargando] = useState(false);
  const [enviada, setEnviada] = useState(false);

  const enviar = () => {
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      setEnviada(true);
    }, 650);
  };

  return (
    <View style={styles.screen}>
      <TopBar onBack={nav.back} />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <Text style={styles.titulo}>¿Cómo fue el servicio?</Text>
        <Text style={styles.sub}>Código de finalización validado · {folio}</Text>

        {/* Tarjeta de estrellas interactivas */}
        <Card style={styles.califCard}>
          <Text style={styles.profesionista}>{profesionista}</Text>
          <SelectorEstrellas
            valor={estrellas}
            alCambiar={setEstrellas}
            deshabilitado={enviada}
          />
          <Text style={styles.califEstado}>{etiquetas[estrellas]}</Text>
          <Text style={styles.califAyuda}>Califica de 1 a 5 estrellas</Text>
        </Card>

        {/* Monto capturado */}
        <Card style={styles.montoCard}>
          <View style={styles.montoRow}>
            <Text style={styles.montoLabel}>Monto capturado</Text>
            <Text style={styles.montoValor}>$700.00</Text>
          </View>
          <Text style={styles.montoSub}>Pago de prueba · Stripe Test Mode</Text>
        </Card>

        {enviada ? (
          <View style={styles.okBox}>
            <View style={styles.okHeader}>
              <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
              <Text style={styles.okTitulo}>Calificación registrada</Text>
            </View>
            <Text style={styles.okTexto}>
              Gracias por calificar con {estrellas} {estrellas === 1 ? 'estrella' : 'estrellas'} a {profesionista}. Sus métricas y rango se actualizaron.
            </Text>
            <PrimaryButton
              label="Volver a contrataciones"
              onPress={() => nav.resetConPadre('buscar', 'contrataciones')}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : (
          <View style={styles.acciones}>
            <PrimaryButton
              label="Enviar calificación"
              loading={cargando}
              loadingLabel="Enviando calificación..."
              onPress={enviar}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: {
    color: colors.textSec,
    fontSize: 13,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  califCard: { marginTop: spacing.lg, alignItems: 'center', paddingVertical: spacing.xl },
  profesionista: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
  },
  estrellasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.md,
  },
  estrellaBtn: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  califEstado: {
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.teal,
    marginTop: spacing.sm,
    fontVariant: ['tabular-nums'],
  },
  califAyuda: { fontSize: 12, color: colors.textSec, marginTop: 4 },
  montoCard: { marginTop: spacing.md },
  montoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  montoLabel: { fontSize: 14, color: colors.navy, fontFamily: F.med },
  montoValor: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  montoSub: { fontSize: 12, color: colors.textSec, marginTop: 4 },
  okBox: {
    marginTop: spacing.lg,
    backgroundColor: '#EBF4F6',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  okHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  okTitulo: { fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.teal },
  okTexto: { fontSize: 13, color: colors.navy, lineHeight: 19, marginTop: 6 },
  acciones: { marginTop: 'auto', paddingTop: spacing.xl },
});
