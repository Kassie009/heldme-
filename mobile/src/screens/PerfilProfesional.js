/**
 * HeldMe! — Pantalla 5 · Perfil profesional (paso 2 del registro profesionista)
 * Mockup: App Móvil 1 de 11 · 5 - Perfil y evidencia (paso 2).
 * Especialidad, zona, experiencia, identificación, evidencia obligatoria y
 * certificados opcionales. Sin evidencia no se puede enviar la solicitud.
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import {
  TopBar, PrimaryButton, Field, TextInputBox, Badge, Label, ErrorText,
} from '../ui';
import { registrarCuenta } from '../cuentas';

export default function PerfilProfesional({ nav, params }) {
  const [d, setD] = useState({ especialidad: '', zona: '', experiencia: '' });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const cambiar = (campo, valor) => setD((p) => ({ ...p, [campo]: valor }));

  const enviar = () => {
    const e = {};
    if (!d.especialidad.trim()) e.especialidad = 'Escribe tu especialidad u oficio.';
    if (!d.zona.trim()) e.zona = 'Escribe tu zona de atención (colonia y ciudad).';
    if (!d.experiencia.trim()) e.experiencia = 'Describe brevemente tus habilidades y experiencia.';
    setErrores(e);
    if (Object.keys(e).length === 0) {
      // Solicitud enviada: la cuenta queda en verificación; se vuelve al inicio.
      setCargando(true);
      setTimeout(() => {
        if (params?.correo) {
          registrarCuenta({ correo: params.correo, tipo: 'profesionista', nombre: params.nombre || 'Profesionista', clave: params.clave });
        }
        nav.reset('verificacion', { estado: 'pendiente' });
        setCargando(false);
      }, 900);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onBack={nav.back} />
      <Text style={styles.titulo}>Perfil profesional</Text>
      <Text style={styles.sub}>
        Paso 2 de 2 · Tu cuenta se revisará antes de habilitarse.
      </Text>

      <Field label="ESPECIALIDAD" style={{ marginTop: spacing.lg }}>
        <TextInputBox
          placeholder="Ej. Plomería, electricidad, carpintería..."
          value={d.especialidad}
          onChangeText={(v) => cambiar('especialidad', v)}
          invalid={!!errores.especialidad}
        />
      </Field>
      <ErrorText>{errores.especialidad}</ErrorText>

      <Field label="ZONA DE ATENCIÓN">
        <TextInputBox
          placeholder="Colonia · Ciudad"
          value={d.zona}
          onChangeText={(v) => cambiar('zona', v)}
          invalid={!!errores.zona}
        />
      </Field>
      <ErrorText>{errores.zona}</ErrorText>

      <Field label="HABILIDADES Y EXPERIENCIA">
        <TextInputBox
          placeholder="Describe qué sabes hacer y tu experiencia."
          value={d.experiencia}
          onChangeText={(v) => cambiar('experiencia', v)}
          style={styles.textarea}
          invalid={!!errores.experiencia}
        />
      </Field>
      <ErrorText>{errores.experiencia}</ErrorText>

      {/* Documentos: identificación, evidencia obligatoria y certificados */}
      <View style={styles.docsCard}>
        <View style={styles.docRow}>
          <Text style={styles.docTitulo}>IDENTIFICACIÓN OFICIAL</Text>
          <Badge label="Adjunta" />
        </View>
        <View style={styles.docRow}>
          <Text style={styles.docTitulo}>EVIDENCIA OBLIGATORIA</Text>
          <Badge label="2 fotos adjuntas" />
        </View>
        <View style={styles.docRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.docTitulo}>CERTIFICADOS (OPCIONAL)</Text>
            <Text style={styles.docSub}>Para un rango inicial superior</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Adjuntar certificados">
            <Badge label="Adjuntar" tone="teal" />
          </Pressable>
        </View>
      </View>

      <Text style={styles.ayuda}>
        Sin evidencia no puedes enviar la solicitud. Si aún no tienes trabajos
        previos, adjunta fotos de un trabajo de práctica o una carta de
        referencia. Si tu actividad está regulada, adjunta la licencia exigida.
        JPG, PNG o WebP hasta 5 MB · PDF hasta 10 MB.
      </Text>

      <PrimaryButton
        label="Enviar a verificación"
        loading={cargando}
        loadingLabel="Enviando solicitud..."
        onPress={enviar}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4, lineHeight: 18 },
  textarea: { minHeight: 88, alignItems: 'flex-start', paddingVertical: 12 },
  docsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14,
    marginTop: spacing.md,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  docTitulo: { fontSize: 10.5, fontWeight: '700', fontFamily: F.bold, color: colors.navy, letterSpacing: 0.6 },
  docSub: { fontSize: 11, color: colors.textSec, marginTop: 2 },
  ayuda: {
    color: colors.textSec,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.md,
  },
});
