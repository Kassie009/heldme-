/**
 * HeldMe! — Pantalla 9 · Cambiar categoría
 * Mockup: App Móvil 2 de 11 · 3 - Cambiar categoría.
 * La IA sugiere una categoría y el usuario puede elegir otra; la búsqueda
 * se ejecuta con la categoría que el usuario eligió.
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Card, Badge, PrimaryButton, Label } from '../ui';

const categorias = ['Plomería', 'Electricidad', 'Climatización', 'Carpintería', 'Pintura'];

export default function CambiarCategoria({ nav, params }) {
  const consulta = params?.consulta ?? 'tengo una fuga de agua';
  const [sel, setSel] = useState('Plomería');

  const buscar = () => {
    if (sel === 'Plomería') {
      nav.replace('resultadosIA', { consulta });
    } else {
      // En la demo, las demás categorías no tienen resultados en la zona.
      nav.replace('sinResultados', { consulta, categoria: sel });
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onBack={nav.back} />
        <Text style={styles.titulo}>Cambiar categoría</Text>
        <Text style={styles.sub} numberOfLines={1}>
          Tu búsqueda: "{consulta}"
        </Text>

        <Card style={styles.lista}>
          {categorias.map((c, i) => {
            const activo = sel === c;
            return (
              <Pressable
                key={c}
                onPress={() => setSel(c)}
                accessibilityRole="radio"
                accessibilityState={{ selected: activo }}
                style={[
                  styles.fila,
                  i > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                ]}
              >
                <View style={[styles.radio, activo && styles.radioActivo]}>
                  {activo && <View style={styles.radioPunto} />}
                </View>
                <Text style={[styles.categoria, activo && { fontWeight: '800', fontFamily: F.extra }]}>{c}</Text>
                {c === 'Plomería' && <Badge label="Sugerida por IA" />}
              </Pressable>
            );
          })}
        </Card>

        <Text style={styles.nota}>
          La búsqueda se ejecuta con la categoría que elijas.
        </Text>

        <PrimaryButton label="Buscar en esta categoría" onPress={buscar} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4 },
  lista: { marginTop: spacing.lg, paddingVertical: 2, paddingHorizontal: spacing.lg },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActivo: { borderColor: colors.teal },
  radioPunto: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.teal },
  categoria: { flex: 1, fontSize: 14, color: colors.navy, fontWeight: '600', fontFamily: F.semi },
  nota: { color: colors.textSec, fontSize: 12, marginTop: spacing.md, textAlign: 'center' },
});
