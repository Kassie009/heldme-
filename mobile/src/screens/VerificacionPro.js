/**
 * HeldMe! — Verificación profesional (profesionista, 4 estados)
 * Port de las pantallas de Jeshua (mockup: Verificación profesional).
 * Estados: pendiente · requiere información · rechazada · aprobada (RF-03/RF-04).
 */
import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, F } from '../theme';
import { TopBar, Card, Badge, InfoRow, PrimaryButton, SecondaryButton } from '../ui';

const contenido = {
  pendiente: {
    badge: ['Pendiente', 'warn'],
    titulo: 'Estamos revisando tu evidencia.',
    ayuda: 'Enviado el 23 nov 2026 · Administración la revisará pronto.',
    solicitud: [
      ['Perfil y experiencia', 'Enviado'],
      ['Identificación oficial', 'Enviado'],
      ['Evidencia obligatoria', '2 archivos'],
      ['Certificados (opcional)', '1 archivo'],
    ],
    nota: 'Mientras tu cuenta no esté aprobada solo puedes editar tu perfil y consultar el estado.',
    boton: ['Editar perfil', 'iniciarSesion'],
  },
  requiereInfo: {
    badge: ['Requiere información', 'warn'],
    titulo: 'Se solicita fotografía adicional del trabajo.',
    ayuda: '12 nov 2026 · Administración',
    solicitud: [
      ['Perfil y experiencia', 'Enviado'],
      ['Identificación oficial', 'Enviado'],
      ['Evidencia obligatoria', 'Enviada'],
      ['Fotografía adicional', 'Pendiente'],
      ['Certificados (opcional)', 'Sin adjuntar'],
    ],
    nota: 'Cuentas con tiempo abierto para completar tu perfil y enviar la evidencia en JPG, PNG o WebP (hasta 5 MB).',
    boton: ['Corregir y reenviar solicitud', 'iniciarSesion'],
  },
  rechazada: {
    badge: ['Rechazada', 'danger'],
    titulo: 'La evidencia no pudo asociarse al servicio declarado.',
    ayuda: 'Decisión de administración · 18 nov 2026. Puedes consultar la decisión y, cuando se permita, volver a solicitar la revisión con nueva evidencia.',
    solicitud: [],
    nota: '',
    boton: ['Volver a solicitar revisión', 'iniciarSesion'],
  },
  aprobada: {
    badge: ['Aprobada', 'teal'],
    titulo: 'Tu cuenta profesional ya está habilitada.',
    ayuda: 'Aprobada el 20 nov 2026. Ya puedes publicar servicios y cotizar.',
    rango: ['Plata', 'Asignado por certificados aprobados. No equivale a cinco servicios completados en HeldMe!.'],
    solicitud: [],
    nota: '',
    boton: ['Ir a mi panel', 'misServiciosPro'],
  },
};

export default function VerificacionPro({ nav, params }) {
  const estado = contenido[params?.estado] || contenido.pendiente;
  const subtitulo = params?.subtitulo ?? 'Laura Cota · Plomería · Col. Jalisco · SLRC';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onBack={nav.back} />
      <Text style={styles.titulo}>Verificación profesional</Text>
      <Text style={styles.sub} numberOfLines={1}>{subtitulo}</Text>

      <Card style={styles.tarjeta}>
        <Badge label={estado.badge[0]} tone={estado.badge[1]} />
        <Text style={styles.mensaje}>{estado.titulo}</Text>
        <Text style={styles.ayuda}>{estado.ayuda}</Text>
      </Card>

      {estado.rango && (
        <Card style={styles.tarjeta}>
          <InfoRow label="Rango inicial" value={estado.rango[0]} />
          <Text style={styles.ayuda}>{estado.rango[1]}</Text>
        </Card>
      )}

      {estado.solicitud.length > 0 && (
        <Card style={styles.tarjeta}>
          <Text style={styles.kicker}>TU SOLICITUD</Text>
          {estado.solicitud.map(([label, value]) => (
            <InfoRow key={label} label={label} value={value} tone={value === 'Pendiente' ? 'warn' : undefined} />
          ))}
        </Card>
      )}

      {estado.nota ? <Text style={styles.nota}>{estado.nota}</Text> : null}

      {estado.boton[1] === 'iniciarSesion' ? (
        <PrimaryButton label={estado.boton[0]} onPress={() => nav.reset(estado.boton[1])} style={{ marginTop: spacing.md }} />
      ) : (
        <PrimaryButton label={estado.boton[0]} onPress={() => nav.reset(estado.boton[1])} style={{ marginTop: spacing.md }} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4 },
  tarjeta: { marginTop: spacing.lg },
  mensaje: { color: colors.navy, fontSize: 18, fontWeight: '800', fontFamily: F.extra, lineHeight: 25, marginTop: 8 },
  ayuda: { color: colors.textSec, fontSize: 13, lineHeight: 18, marginTop: 4 },
  kicker: { fontSize: 10.5, fontWeight: '700', fontFamily: F.bold, color: colors.textSec, letterSpacing: 0.8, marginBottom: 4 },
  nota: { color: colors.textSec, fontSize: 13, lineHeight: 18, marginTop: spacing.md },
});
