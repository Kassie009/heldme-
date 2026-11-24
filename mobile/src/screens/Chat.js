/**
 * HeldMe! — Chat de negociación (funcional en frontend)
 * Mockup: App Móvil 3 de 11 · 5 - Negociar por chat.
 * Se llega desde "Ver detalle y chatear" en las cotizaciones recibidas.
 * Enviar mensajes funciona en la interfaz (simulación, sin backend).
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Badge, Card } from '../ui';

const mensajesIniciales = [
  { de: 'otro', texto: 'Confirmo la visita para hoy a las cuatro.' },
  { de: 'yo', texto: 'De acuerdo, llego a esa hora.' },
];

export default function Chat({ nav }) {
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [borrador, setBorrador] = useState('');

  const enviar = () => {
    if (!borrador.trim()) return;
    setMensajes((m) => [...m, { de: 'yo', texto: borrador.trim() }]);
    setBorrador('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onBack={nav.back} />
        <View style={styles.header}>
          <Text style={styles.nombre}>Plomería Rivera</Text>
          <Badge label="Contratado" tone="teal" />
        </View>
        <Text style={styles.sub} numberOfLines={1}>HM-2044 · Reparación de fuga</Text>

        {mensajes.map((m, i) => (
          <View key={i} style={[styles.bubbleRow, m.de === 'yo' && styles.bubbleRowYo]}>
            <View style={[styles.bubble, m.de === 'yo' ? styles.bubbleYo : styles.bubbleOtro]}>
              <Text style={[styles.bubbleTexto, m.de === 'yo' && styles.bubbleTextoYo]}>
                {m.texto}
              </Text>
            </View>
          </View>
        ))}

        {/* Resumen de la cotización aceptada, como en el mockup */}
        <Card style={styles.cotCard}>
          <Text style={styles.cotKicker}>COTIZACIÓN V1 · ACEPTADA</Text>
          <View style={styles.cotFila}>
            <Text style={styles.cotLabel}>Total</Text>
            <Text style={styles.cotValor}>$1,700.00</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Escribe un mensaje"
          placeholderTextColor={colors.textSec}
          value={borrador}
          onChangeText={setBorrador}
          onSubmitEditing={enviar}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={enviar}
          style={({ pressed }) => [styles.enviar, pressed && { backgroundColor: colors.tealDeep }]}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensaje"
        >
          <Text style={styles.enviarTexto}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  nombre: { fontSize: 17, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 12, marginBottom: spacing.lg },
  bubbleRow: { flexDirection: 'row', marginBottom: spacing.sm, justifyContent: 'flex-start' },
  bubbleRowYo: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '78%', borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14 },
  bubbleOtro: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  bubbleYo: { backgroundColor: colors.teal },
  bubbleTexto: { fontSize: 13.5, color: colors.navy, lineHeight: 19 },
  bubbleTextoYo: { color: colors.white },
  cotCard: { marginTop: spacing.md },
  cotKicker: { fontSize: 10.5, fontWeight: '700', fontFamily: F.bold, color: colors.textSec, letterSpacing: 0.8 },
  cotFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  cotLabel: { fontSize: 14, fontWeight: '700', fontFamily: F.bold, color: colors.navy },
  cotValor: { fontSize: 16, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 46,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    color: colors.navy,
    maxHeight: 110,
  },
  enviar: {
    backgroundColor: colors.teal,
    borderRadius: radius.pill,
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  enviarTexto: { color: colors.white, fontWeight: '700', fontFamily: F.bold, fontSize: 14 },
});
