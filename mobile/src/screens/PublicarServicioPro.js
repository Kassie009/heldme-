/**
 * HeldMe! — Publicar servicio (profesionista)
 * Port de la pantalla de Jeshua (mockup: Publicar servicio).
 */
import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, F } from '../theme';
import { TopBar, PrimaryButton, Field, TextInputBox, SelectBox, Card, ErrorText } from '../ui';

export default function PublicarServicioPro({ nav }) {
  const [d, setD] = useState({
    titulo: 'Reparación de fugas',
    categoria: 'Plomería',
    zona: 'Col. Jalisco · SLRC',
  });
  const [errores, setErrores] = useState({});

  const publicar = () => {
    const e = {};
    if (!d.titulo.trim()) e.titulo = 'Escribe el título del servicio.';
    if (!d.zona.trim()) e.zona = 'Escribe tu zona de atención.';
    setErrores(e);
    if (Object.keys(e).length === 0) {
      nav.replace('misServiciosPro');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onBack={nav.back} />
      <Text style={styles.titulo}>Publicar servicio</Text>

      <Field label="TÍTULO" style={{ marginTop: spacing.lg }}>
        <TextInputBox
          placeholder="Ej. Reparación de fugas"
          value={d.titulo}
          onChangeText={(v) => setD((p) => ({ ...p, titulo: v }))}
          invalid={!!errores.titulo}
        />
      </Field>
      <ErrorText>{errores.titulo}</ErrorText>

      <Field label="CATEGORÍA">
        <SelectBox value={d.categoria} placeholder="Elige una categoría" />
      </Field>

      <Field label="DESCRIPCIÓN">
        <Card><Text style={styles.parrafo}>Detección y reparación de fugas.</Text></Card>
      </Field>

      <Field label="ZONA DE ATENCIÓN">
        <TextInputBox
          placeholder="Colonia · Ciudad"
          value={d.zona}
          onChangeText={(v) => setD((p) => ({ ...p, zona: v }))}
          invalid={!!errores.zona}
        />
      </Field>
      <ErrorText>{errores.zona}</ErrorText>

      <PrimaryButton label="Publicar" onPress={publicar} style={{ marginTop: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  parrafo: { color: colors.navy, fontSize: 14, fontWeight: '600', fontFamily: F.semi, lineHeight: 20 },
});
