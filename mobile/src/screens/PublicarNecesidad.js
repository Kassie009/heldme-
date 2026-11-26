/**
 * HeldMe! — Pantalla 11 · Publicar necesidad
 * Mockup: App Móvil 3 de 11 · 1 - Publicar necesidad.
 * Descripción, categoría, imágenes opcionales y zona aproximada (sin GPS).
 */
import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Field, TextInputBox, SelectBox, Badge, PrimaryButton, ErrorText } from '../ui';

export default function PublicarNecesidad({ nav }) {
  const [d, setD] = useState({
    que: 'Fuga de agua bajo el fregadero',
    categoria: 'Plomería',
    zona: 'SLRC · Col. Centro · CP 83400',
  });
  const [fotos, setFotos] = useState([]);
  const [aviso, setAviso] = useState('');
  const [errores, setErrores] = useState({});

  const adjuntar = async () => {
    setAviso('');
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5 - fotos.length,
      quality: 0.8,
    });
    if (resultado.canceled) return;

    for (const asset of resultado.assets) {
      const tipoOk = /\/(jpeg|jpg|png|webp)$/.test(asset.mimeType || asset.uri.split('.').pop());
      const megaBytes = (asset.fileSize || 0) / (1024 * 1024);
      if (!tipoOk) {
        setAviso('Solo se permiten imágenes JPG, PNG o WebP.');
        continue;
      }
      if (megaBytes > 5) {
        setAviso(`"${asset.fileName || 'Imagen'}" supera el máximo de 5 MB.`);
        continue;
      }
      setFotos((f) => (f.length < 5 ? [...f, asset.uri] : f));
    }
  };

  const quitarFoto = (uri) => setFotos((f) => f.filter((x) => x !== uri));

  const publicar = () => {
    const e = {};
    if (!d.que.trim()) e.que = 'Describe lo que necesitas.';
    if (!d.zona.trim()) e.zona = 'Escribe tu zona aproximada (colonia, ciudad o CP).';
    setErrores(e);
    if (Object.keys(e).length === 0) nav.replace('misSolicitudes');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onBack={nav.back} />
      <Text style={styles.titulo}>Publicar necesidad</Text>
      <Text style={styles.sub}>Los profesionistas de tu zona recibirán la solicitud.</Text>

      <Field label="QUÉ NECESITAS" style={{ marginTop: spacing.lg }}>
        <TextInputBox
          placeholder="Describe tu problema o necesidad"
          value={d.que}
          onChangeText={(v) => setD((p) => ({ ...p, que: v }))}
          invalid={!!errores.que}
          style={{ minHeight: 72, alignItems: 'flex-start', paddingVertical: 12 }}
        />
      </Field>
      <ErrorText>{errores.que}</ErrorText>

      <Field label="CATEGORÍA">
        <SelectBox value={d.categoria} placeholder="Elige una categoría" />
      </Field>

      <Field label="ZONA APROXIMADA">
        <TextInputBox
          placeholder="Ciudad · Colonia · Código postal"
          value={d.zona}
          onChangeText={(v) => setD((p) => ({ ...p, zona: v }))}
          invalid={!!errores.zona}
        />
      </Field>
      <ErrorText>{errores.zona}</ErrorText>

      <Field
        label="IMÁGENES (OPCIONAL)"
        right={
          <View style={styles.fotosChip}>
            <Ionicons name="image" size={14} color={colors.teal} />
            <Text style={styles.fotosTexto}>{fotos.length} fotos</Text>
          </View>
        }
      >
        {fotos.length > 0 && (
          <View style={styles.miniaturas}>
            {fotos.map((uri) => (
              <Pressable key={uri} onPress={() => quitarFoto(uri)} hitSlop={6}>
                <Image source={{ uri }} style={styles.miniatura} />
                <View style={styles.miniaturaX}>
                  <Ionicons name="close" size={12} color={colors.white} />
                </View>
              </Pressable>
            ))}
          </View>
        )}
        <Pressable
          onPress={adjuntar}
          disabled={fotos.length >= 5}
          style={({ pressed }) => [styles.adjuntar, pressed && { backgroundColor: colors.mint }, fotos.length >= 5 && { opacity: 0.5 }]}
          accessibilityRole="button"
          accessibilityLabel="Adjuntar imágenes"
        >
          <Ionicons name="image" size={17} color={colors.teal} />
          <Text style={styles.adjuntarTexto}>
            {fotos.length >= 5 ? 'Máximo 5 imágenes' : 'Adjuntar imágenes JPG, PNG o WebP (máx 5 MB)'}
          </Text>
        </Pressable>
        {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}
      </Field>

      <PrimaryButton
        label="Publicar necesidad"
        onPress={publicar}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4 },
  fotosChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.mint,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  fotosTexto: { fontSize: 11, fontWeight: '700', fontFamily: F.bold, color: colors.teal },
  miniaturas: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  miniatura: { width: 62, height: 62, borderRadius: 10 },
  miniaturaX: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.navy,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjuntar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  adjuntarTexto: { flex: 1, color: colors.navy, fontSize: 12, fontWeight: '600', fontFamily: F.semi, lineHeight: 17 },
  aviso: { color: colors.error, fontSize: 12, fontWeight: '600', fontFamily: F.semi, marginTop: 6 },
});
