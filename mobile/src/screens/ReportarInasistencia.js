/**
 * HeldMe! — Pantalla 24 · Reportar inasistencia
 * Mockup: App Móvil 5 de 11 · 4 - Reportar inasistencia.
 * Conserva explicación y evidencias para revisión administrativa previa a
 * confirmar cualquier falta o strike (RF-30, RN-09, RNF-12).
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, F } from '../theme';
import {
  Badge,
  Card,
  ErrorText,
  Field,
  Label,
  PrimaryButton,
  TextInputBox,
  TopBar,
} from '../ui';

function ListaFotosHorizontal({ fotos, alQuitar, bloqueado = false }) {
  if (fotos.length === 0) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.miniaturasRow}
    >
      {fotos.map((uri) =>
        bloqueado ? (
          <View key={uri}>
            <Image source={{ uri }} style={styles.miniatura} />
          </View>
        ) : (
          <Pressable
            key={uri}
            onPress={() => alQuitar(uri)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Quitar fotografía adjunta"
          >
            <Image source={{ uri }} style={styles.miniatura} />
            <View style={styles.miniaturaX}>
              <Ionicons name="close" size={12} color={colors.white} />
            </View>
          </Pressable>
        ),
      )}
    </ScrollView>
  );
}

export default function ReportarInasistencia({ nav, params }) {
  const folio = params?.folio ?? 'HM-2048';
  const profesionista = params?.profesionista ?? 'Marcos Ríos';

  const [explicacion, setExplicacion] = useState(
    'El profesionista no se presentó a la cita acordada.',
  );
  const [abiertaChat, setAbiertaChat] = useState(false);
  const [abiertaCita, setAbiertaCita] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [avisoArchivo, setAvisoArchivo] = useState('');
  const [errorTexto, setErrorTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const adjuntar = async () => {
    if (enviado || cargando || fotos.length >= 3) return;
    setAvisoArchivo('');
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permiso.granted) {
        setAvisoArchivo('Necesitas otorgar permiso a tu galería para adjuntar fotografías.');
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 3 - fotos.length,
        quality: 0.8,
      });
      if (resultado.canceled) return;

      const assets = resultado.assets || [];
      const nuevas = [];
      for (const asset of assets) {
        if (!asset?.uri) continue;
        const mimeOk = asset.mimeType ? /^image\/(jpeg|jpg|png|webp)$/i.test(asset.mimeType) : false;
        const nombreLimpio = (asset.fileName || asset.uri || '').split('?')[0];
        const extOk = /\.(jpe?g|png|webp)$/i.test(nombreLimpio);
        const tipoOk = asset.mimeType ? mimeOk : extOk;
        const megaBytes = (asset.fileSize || 0) / (1024 * 1024);

        if (!tipoOk) {
          setAvisoArchivo('Solo se permiten imágenes JPG, PNG o WebP.');
          continue;
        }
        if (megaBytes > 5) {
          setAvisoArchivo(`"${asset.fileName || 'Imagen'}" supera el máximo de 5 MB.`);
          continue;
        }
        if (!fotos.includes(asset.uri) && !nuevas.includes(asset.uri)) {
          nuevas.push(asset.uri);
        }
      }

      if (nuevas.length > 0) {
        setFotos((prev) => {
          const combinadas = [...prev];
          for (const uri of nuevas) {
            if (!combinadas.includes(uri) && combinadas.length < 3) {
              combinadas.push(uri);
            }
          }
          return combinadas;
        });
      }
    } catch {
      setAvisoArchivo('No se pudo abrir la galería. Inténtalo de nuevo.');
    }
  };

  const enviar = () => {
    if (!explicacion.trim()) {
      setErrorTexto('Describe lo ocurrido para enviarlo a revisión.');
      return;
    }
    setErrorTexto('');
    setCargando(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCargando(false);
      setEnviado(true);
    }, 700);
  };

  const totalEvidencias = 2 + fotos.length;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopBar
        onBack={
          enviado ? () => nav.resetConPadre('buscar', 'contrataciones') : nav.back
        }
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <Text style={styles.titulo}>Reportar inasistencia</Text>
        <Text style={styles.sub}>
          Servicio {folio} · {profesionista}
        </Text>

        <View style={{ marginTop: spacing.lg }}>
          <Field label="QUÉ OCURRIÓ">
            <TextInputBox
              placeholder="Explica lo sucedido"
              value={explicacion}
              onChangeText={(v) => {
                setExplicacion(v);
                setErrorTexto('');
              }}
              multiline
              editable={!enviado && !cargando}
              invalid={!!errorTexto}
              style={styles.textarea}
              accessibilityLabel="Descripción de la inasistencia"
            />
            <ErrorText>{errorTexto}</ErrorText>
          </Field>
        </View>

        {/* Evidencias adjuntas con vista previa */}
        <Card style={styles.evidenciasCard}>
          <View style={styles.evidenciasHeader}>
            <Label style={{ marginBottom: 0 }}>EVIDENCIAS</Label>
            <Badge label={`${totalEvidencias} adjuntas`} tone="mint" />
          </View>

          <View style={styles.evidenciaRow}>
            <Text style={styles.evidenciaNombre}>Conversación con hora acordada</Text>
            <Pressable
              onPress={() => setAbiertaChat((v) => !v)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                abiertaChat ? 'Ocultar evidencia de conversación' : 'Ver evidencia de conversación'
              }
              style={styles.verBtn}
            >
              <Text style={styles.verTexto}>{abiertaChat ? 'Ocultar' : 'Ver'}</Text>
            </Pressable>
          </View>
          {abiertaChat ? (
            <View style={styles.detalleEvidencia}>
              <Text style={styles.detalleTexto}>
                Último acuerdo en chat: &quot;Nos vemos el 22 nov a las 16:00 en Col. Centro&quot;.
              </Text>
            </View>
          ) : null}

          <View style={[styles.evidenciaRow, styles.divisor]}>
            <Text style={styles.evidenciaNombre}>Cita confirmada · 22 nov, 16:00</Text>
            <Pressable
              onPress={() => setAbiertaCita((v) => !v)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                abiertaCita ? 'Ocultar evidencia de cita confirmada' : 'Ver evidencia de cita confirmada'
              }
              style={styles.verBtn}
            >
              <Text style={styles.verTexto}>{abiertaCita ? 'Ocultar' : 'Ver'}</Text>
            </Pressable>
          </View>
          {abiertaCita ? (
            <View style={styles.detalleEvidencia}>
              <Text style={styles.detalleTexto}>
                Reserva {folio} · Sin validación de código de inicio tras la hora acordada.
              </Text>
            </View>
          ) : null}

          <ListaFotosHorizontal
            fotos={fotos}
            bloqueado={enviado || cargando}
            alQuitar={(uri) => setFotos((prev) => prev.filter((x) => x !== uri))}
          />

          {!enviado ? (
            <View style={styles.adjuntarWrap}>
              <Pressable
                onPress={adjuntar}
                disabled={cargando || fotos.length >= 3}
                accessibilityRole="button"
                accessibilityLabel="Adjuntar fotografía adicional"
                accessibilityState={{ disabled: cargando || fotos.length >= 3 }}
                style={({ pressed }) => [
                  styles.adjuntarBtn,
                  pressed && !cargando && fotos.length < 3 && { backgroundColor: colors.mint },
                  (cargando || fotos.length >= 3) && { opacity: 0.5 },
                ]}
              >
                <Ionicons name="image-outline" size={18} color={colors.teal} />
                <Text style={styles.adjuntarTexto}>
                  {fotos.length >= 3 ? 'Máximo 3 fotos adicionales' : 'Adjuntar foto adicional'}
                </Text>
              </Pressable>
              <Text style={styles.adjuntarAyuda}>JPG, PNG o WebP · máx. 5 MB</Text>
            </View>
          ) : null}
          {avisoArchivo ? <Text style={styles.avisoArchivo}>{avisoArchivo}</Text> : null}
        </Card>

        <Text style={styles.nota}>
          Administración revisará el reporte antes de confirmar cualquier falta.
        </Text>

        {enviado ? (
          <View style={styles.okBox}>
            <View style={styles.okHeader}>
              <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
              <Text style={styles.okTitulo}>Reporte enviado a revisión</Text>
            </View>
            <Text style={styles.okTexto}>
              Tu explicación y {totalEvidencias} evidencias quedaron registradas para análisis administrativo.
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
              label="Enviar reporte"
              loading={cargando}
              loadingLabel="Enviando reporte..."
              onPress={enviar}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontFamily: F.reg,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  textarea: { minHeight: 84, paddingVertical: 12 },
  evidenciasCard: { marginTop: spacing.xs, paddingVertical: 12 },
  evidenciasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  evidenciaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingVertical: 8,
    gap: 10,
  },
  divisor: { borderTopWidth: 1, borderTopColor: colors.border },
  evidenciaNombre: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: F.reg,
    color: colors.navy,
    fontVariant: ['tabular-nums'],
  },
  verBtn: { minWidth: 48, minHeight: 36, justifyContent: 'center', alignItems: 'flex-end' },
  verTexto: { fontSize: 13, fontWeight: '700', fontFamily: F.bold, color: colors.teal },
  detalleEvidencia: {
    backgroundColor: colors.panel,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  detalleTexto: { fontSize: 12, fontFamily: F.reg, color: colors.textSec, lineHeight: 17 },
  miniaturasRow: { gap: 8, paddingTop: spacing.sm, paddingBottom: 4, paddingRight: 8 },
  miniatura: { width: 58, height: 58, borderRadius: 10 },
  miniaturaX: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.navy,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjuntarWrap: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  adjuntarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  adjuntarTexto: {
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: F.bold,
    color: colors.navy,
  },
  adjuntarAyuda: {
    fontSize: 11.5,
    fontFamily: F.reg,
    color: colors.textSec,
    textAlign: 'center',
    marginTop: 6,
  },
  avisoArchivo: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: F.semi,
    marginTop: 6,
  },
  nota: { color: colors.textSec, fontSize: 12.5, fontFamily: F.reg, lineHeight: 18, marginTop: spacing.md },
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
  okTexto: { fontSize: 13, fontFamily: F.reg, color: colors.navy, lineHeight: 19, marginTop: 6 },
  acciones: { marginTop: 'auto', paddingTop: spacing.xl },
});
