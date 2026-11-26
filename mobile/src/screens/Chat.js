/**
 * HeldMe! — Pantalla 15 · Negociar por chat
 * Mockup: App Móvil 3 de 11 · 5 - Negociar por chat.
 * Conversación vinculada a una solicitud, cotización o contratación (RF-19).
 * En vivo usará Supabase Realtime (RNF-13); por ahora simula envío local.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { Badge, Card, TextLink, TopBar } from '../ui';

const hilosBase = {
  contratacion: [
    { id: 'm1', de: 'yo', texto: 'Confirmo la visita para hoy a las cuatro.' },
    { id: 'm2', de: 'otro', texto: 'De acuerdo, llego a esa hora.' },
    { id: 'm3', de: 'otro', texto: 'Llevo diagnóstico y te envío la cotización final.' },
  ],
  cotizacion: [
    { id: 'c1', de: 'otro', texto: 'Hola, revisé tu solicitud del calentador de paso.' },
    { id: 'c2', de: 'yo', texto: '¿La cotización incluye el diagnóstico?' },
  ],
};

export default function Chat({ nav, params }) {
  const nombre = params?.nombre ?? 'Plomería Rivera';
  const folio = params?.folio ?? 'HM-2044';
  const servicio = params?.servicio ?? 'Reparación de fuga';
  const tipoVinculo = params?.tipoVinculo ?? 'contratacion';
  const estado = params?.estado ?? (tipoVinculo === 'contratacion' ? 'Contratado' : 'En cotización');

  const [mensajes, setMensajes] = useState(
    hilosBase[tipoVinculo] || hilosBase.contratacion,
  );
  const [borrador, setBorrador] = useState('');
  const listRef = useRef(null);
  const seqRef = useRef(0);
  const scrollTimerRef = useRef(null);

  useEffect(() => () => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
  }, []);

  const enviar = () => {
    const limpio = borrador.trim();
    if (!limpio) return;
    setMensajes((prev) => [
      ...prev,
      { id: `m-${Date.now()}-${++seqRef.current}`, de: 'yo', texto: limpio },
    ]);
    setBorrador('');
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      scrollTimerRef.current = null;
      listRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  const puedeEnviar = borrador.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopBar onBack={nav.back} />
      <View style={styles.encabezado}>
        <View style={styles.headerRow}>
          <Text style={styles.nombre} numberOfLines={1}>
            {nombre}
          </Text>
          <Badge label={estado} tone={estado === 'Contratado' ? 'teal' : 'mint'} />
        </View>
        <Text style={styles.sub} numberOfLines={1}>
          {folio} · {servicio}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.bubbleRow, item.de === 'yo' && styles.bubbleRowYo]}>
            <View style={[styles.bubble, item.de === 'yo' ? styles.bubbleYo : styles.bubbleOtro]}>
              <Text style={[styles.bubbleTexto, item.de === 'yo' && styles.bubbleTextoYo]}>
                {item.texto}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <Card style={styles.cotCard}>
            <Text style={styles.cotKicker}>
              {tipoVinculo === 'contratacion'
                ? 'COTIZACIÓN V1 · ACEPTADA'
                : 'COTIZACIÓN ESTIMADA · EN REVISIÓN'}
            </Text>
            <View style={styles.cotFila}>
              <Text style={styles.cotLabel}>
                {tipoVinculo === 'contratacion' ? 'Total' : 'Total estimado'}
              </Text>
              <Text style={styles.cotValor}>
                {tipoVinculo === 'contratacion' ? '$1,700.00' : '$1,500.00'}
              </Text>
            </View>
            <View style={styles.cotAccion}>
              {tipoVinculo === 'contratacion' ? (
                <TextLink
                  onPress={() =>
                    nav.push('acuerdosServicio', { folio, profesionista: nombre, titulo: servicio })
                  }
                >
                  Revisar acuerdos del servicio
                </TextLink>
              ) : (
                <TextLink
                  onPress={() =>
                    nav.irACotizaciones
                      ? nav.irACotizaciones({ servicio })
                      : nav.push('cotizaciones', { servicio })
                  }
                >
                  Comparar cotizaciones
                </TextLink>
              )}
            </View>
          </Card>
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Escribe un mensaje"
          placeholderTextColor={colors.textSec}
          value={borrador}
          onChangeText={setBorrador}
          onSubmitEditing={enviar}
          returnKeyType="send"
          submitBehavior="submit"
          accessibilityLabel="Escribir mensaje"
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={enviar}
          disabled={!puedeEnviar}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensaje"
          accessibilityState={{ disabled: !puedeEnviar }}
          style={({ pressed }) => [
            styles.enviar,
            !puedeEnviar && styles.enviarDisabled,
            pressed && puedeEnviar && { backgroundColor: colors.tealDeep },
          ]}
        >
          <Text style={styles.enviarTexto}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  encabezado: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  nombre: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
  },
  sub: { color: colors.textSec, fontSize: 12, fontFamily: F.reg, marginTop: 2, fontVariant: ['tabular-nums'] },
  listaContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  bubbleRow: { flexDirection: 'row', marginBottom: spacing.sm, justifyContent: 'flex-start' },
  bubbleRowYo: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingVertical: 11, paddingHorizontal: 14 },
  bubbleOtro: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  bubbleYo: { backgroundColor: colors.teal },
  bubbleTexto: { fontSize: 13.5, fontFamily: F.reg, color: colors.navy, lineHeight: 19 },
  bubbleTextoYo: { color: colors.white },
  cotCard: { marginTop: spacing.md },
  cotKicker: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.textSec,
    letterSpacing: 0.8,
  },
  cotFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  cotLabel: { fontSize: 14, fontWeight: '700', fontFamily: F.bold, color: colors.navy },
  cotValor: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: F.extra,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  cotAccion: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    minHeight: 36,
    justifyContent: 'center',
  },
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
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    fontFamily: F.reg,
    color: colors.navy,
    maxHeight: 110,
  },
  enviar: {
    backgroundColor: colors.teal,
    borderRadius: radius.pill,
    minHeight: 48,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enviarDisabled: { opacity: 0.45 },
  enviarTexto: { color: colors.white, fontWeight: '700', fontFamily: F.bold, fontSize: 14 },
});
