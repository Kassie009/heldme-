/**
 * HeldMe! — Pantalla 7 · Buscar (escribir y autocompletar)
 * Mockup: App Móvil 2 de 11 · 1 - Escribir y autocompletar.
 * Autocompletado del catálogo y detección de errores ortográficos
 * conservando el texto original.
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Label, Card, Chip, SecondaryButton, PrimaryButton } from '../ui';

const sugerencias = [
  { texto: 'Fuga de agua', categoria: 'Plomería' },
  { texto: 'Reparación de fugas', categoria: 'Plomería' },
  { texto: 'Instalación de calentador', categoria: 'Plomería' },
];

export default function Buscar({ nav, params }) {
  const [consulta, setConsulta] = useState('plomería fu');
  const [ortografiaVisible, setOrto] = useState(true);

  const normalizada = consulta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const hayErrorOrto = normalizada.includes('plomeri');
  const mostrarSugerencias = consulta.trim().length > 2;

  const buscar = () => nav.push('resultadosIA', { consulta: consulta.trim() });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} onBack={nav.puedeRetroceder ? nav.back : undefined} />
        <Text style={styles.titulo}>Buscar</Text>

        <View style={styles.inputWrap}>
          <Ionicons name="search" size={18} color={colors.textSec} />
          <TextInput
            placeholder="¿Qué necesitas?"
            placeholderTextColor={colors.textSec}
            value={consulta}
            onChangeText={setConsulta}
            onSubmitEditing={buscar}
            style={styles.input}
            returnKeyType="search"
          />
        </View>

        {/* Error ortográfico: conserva el texto original */}
        {hayErrorOrto && ortografiaVisible && (
          <Card style={styles.ortoCard}>
            <Label>POSIBLE ERROR DE ESCRITURA</Label>
            <Text style={styles.ortoTexto}>
              ¿Quisiste decir <Text style={styles.ortoBold}>"plomería"</Text>?
            </Text>
            <View style={styles.ortoBotones}>
              <SecondaryButton
                label={'Usar "plomería"'}
                onPress={() => {
                  setConsulta('plomería');
                  setOrto(false);
                }}
                style={styles.ortoBtn}
              />
              <SecondaryButton
                label="Continuar con mi texto"
                onPress={() => setOrto(false)}
                style={styles.ortoBtn}
              />
            </View>
          </Card>
        )}

        {/* Autocompletado del catálogo */}
        {mostrarSugerencias && (
          <>
            <Label style={{ marginTop: spacing.lg }}>SUGERENCIAS DEL CATÁLOGO</Label>
            <Card style={styles.sugCard}>
              {sugerencias.map((s, i) => (
                <Pressable
                  key={s.texto}
                  onPress={() => nav.push('resultadosIA', { consulta: s.texto })}
                  style={[
                    styles.sugRow,
                    i > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                  ]}
                >
                  <Text style={styles.sugTexto}>{s.texto}</Text>
                  <Text style={styles.sugCategoria}>{s.categoria}</Text>
                </Pressable>
              ))}
            </Card>
            <Text style={styles.nota}>
              Las sugerencias salen del catálogo de HeldMe!. Si la orientación
              de IA no está disponible, la búsqueda convencional sigue
              funcionando.
            </Text>
          </>
        )}

        {/* Acciones de demostración del flujo (frontend) */}
        <PrimaryButton label="Buscar" onPress={buscar} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy, marginBottom: spacing.md },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: { flex: 1, fontSize: 14, color: colors.navy },
  ortoCard: { marginTop: spacing.lg },
  ortoTexto: { fontSize: 14, color: colors.navy, marginTop: 4 },
  ortoBold: { fontWeight: '800', fontFamily: F.extra },
  ortoBotones: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  ortoBtn: { flex: 1, paddingVertical: 11 },
  sugCard: { paddingVertical: 2, paddingHorizontal: spacing.lg },
  sugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  sugTexto: { fontSize: 14, fontWeight: '600', fontFamily: F.semi, color: colors.navy },
  sugCategoria: { fontSize: 12, color: colors.teal, fontWeight: '700', fontFamily: F.bold },
  nota: { color: colors.textSec, fontSize: 12, lineHeight: 17, marginTop: spacing.sm },
});
