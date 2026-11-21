/**
 * HeldMe! — Pantalla 04 / Publicar una necesidad (RF-12, ARQ-07, RNF-12)
 * Mockup: MÓVIL PANTALLA 04/19 · Publicar Necesidad del Cliente.
 * Solo frontend: formulario estático con datos de ejemplo; sin GPS (ARQ-07).
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { PrimaryButton, Card, FieldLabel, TabBar } from '../ui';

export default function PublicarNecesidad({ onBack }) {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Barra superior */}
        <View style={styles.topbar}>
          <Pressable
            onPress={onBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Regresar"
          >
            <Ionicons name="arrow-back" size={20} color={colors.navy} />
          </Pressable>
          <Text style={styles.titulo} numberOfLines={1}>
            Publicar necesidad
          </Text>
          <View style={styles.gratisChip}>
            <Text style={styles.gratisText}>Gratis</Text>
          </View>
        </View>

        {/* Categoría y descripción */}
        <Card style={styles.card}>
          <FieldLabel>Categoría del servicio</FieldLabel>
          <View style={styles.select}>
            <Text style={styles.selectText} numberOfLines={1}>
              Plomería
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.navy} />
          </View>

          <FieldLabel style={{ marginTop: spacing.lg }}>
            Describe tu problema o necesidad
          </FieldLabel>
          <View style={styles.textarea}>
            <Text style={styles.textareaText}>
              Fuga de agua constante debajo del fregadero de la cocina al abrir
              la llave mezcladora.
            </Text>
          </View>
        </Card>

        {/* Zona aproximada — sin GPS (ARQ-07) */}
        <Card style={styles.card}>
          <View style={styles.zonaHeader}>
            <View style={styles.zonaTitulo}>
              <Ionicons name="location-outline" size={15} color={colors.teal} />
              <Text style={styles.cardTitulo}>Zona aproximada</Text>
            </View>
            <Text style={styles.zonaNota}>
              Solo zona aproximada · sin GPS preciso
            </Text>
          </View>
          <View style={styles.zonaFields}>
            <View style={{ flex: 1 }}>
              <FieldLabel>Ciudad</FieldLabel>
              <View style={styles.select}>
                <Text style={styles.selectText} numberOfLines={1}>
                  San Luis Río Colorado
                </Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <FieldLabel>Colonia o C.P.</FieldLabel>
              <View style={styles.select}>
                <Text style={styles.selectText} numberOfLines={1}>
                  Col. Centro · 83400
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Fotografías opcionales — límite 5 MB (RNF-12) */}
        <Card style={styles.card}>
          <View style={styles.fotosHeader}>
            <Text style={styles.cardTitulo}>Fotografías de referencia (opcional)</Text>
            <Text style={styles.fotosMax}>Máx 5 MB</Text>
          </View>
          <View style={styles.dropzone}>
            <Ionicons name="image-outline" size={26} color={colors.teal} />
            <Text style={styles.dropzoneTitulo}>
              Adjuntar imágenes JPG, PNG o WebP
            </Text>
            <Text style={styles.dropzoneAyuda}>
              Ayuda a recibir cotizaciones más exactas
            </Text>
          </View>
        </Card>

        {/* Publicar */}
        <PrimaryButton label="Publicar y notificar profesionistas" />
      </ScrollView>
      <TabBar active="Explorar" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  backBtn: {
    backgroundColor: colors.mint,
    borderRadius: radius.md,
    padding: 10,
  },
  titulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: colors.navy,
  },
  gratisChip: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  gratisText: { color: colors.teal, fontWeight: '700', fontSize: 12 },
  card: { gap: spacing.md },
  cardTitulo: { fontWeight: '700', fontSize: 14, color: colors.navy },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  selectText: { color: colors.navy, fontSize: 14, fontWeight: '500' },
  textarea: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 110,
  },
  textareaText: { color: colors.navy, fontSize: 14, lineHeight: 20 },
  zonaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  zonaTitulo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  zonaNota: {
    color: colors.textSec,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    maxWidth: 130,
  },
  zonaFields: { flexDirection: 'row', gap: spacing.md },
  fotosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fotosMax: { color: colors.textSec, fontSize: 11, fontWeight: '600' },
  dropzone: {
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.mint,
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  dropzoneTitulo: { fontWeight: '700', color: colors.navy, fontSize: 13 },
  dropzoneAyuda: { color: colors.textSec, fontSize: 11 },
});
