/**
 * HeldMe! — Pantalla 1 · Tipo de cuenta
 * Mockup: App Móvil 1 de 11 · 1 - Tipo de cuenta.
 * El usuario elige cómo usará HeldMe!; el tipo es exclusivo y no cambiable.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { PrimaryButton, SecondaryButton, LogoMark, Badge, Card } from '../ui';

const opciones = [
  {
    key: 'cliente',
    titulo: 'Cliente',
    desc: 'Busca y contrata servicios, compara cotizaciones e inscríbete a cursos.',
  },
  {
    key: 'profesionista',
    titulo: 'Profesionista',
    desc: 'Ofrece servicios y cotiza. Tu cuenta se habilita tras la verificación administrativa.',
  },
];

export default function TipoCuenta({ nav }) {
  const [sel, setSel] = useState('cliente');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <View style={styles.hero}>
        <LogoMark width={112} />
        <Text style={styles.tagline}>
          <Text style={styles.taglineNavy}>Todo HeldMe!,{'\n'}</Text>
          <Text style={styles.taglineTeal}>en buenas manos.</Text>
        </Text>
        <Text style={styles.pregunta}>Elige cómo vas a usar HeldMe!</Text>
      </View>

      {opciones.map((o) => {
        const activo = sel === o.key;
        return (
          <Pressable
            key={o.key}
            onPress={() => setSel(o.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: activo }}
          >
            <Card selected={activo} style={styles.opcion}>
              <View style={styles.opcionHeader}>
                <Text style={styles.opcionTitulo}>{o.titulo}</Text>
                {activo && <Badge label="Seleccionado" tone="teal" />}
              </View>
              <Text style={styles.opcionDesc}>{o.desc}</Text>
            </Card>
          </Pressable>
        );
      })}

      <Text style={styles.nota}>
        El tipo de cuenta no puede cambiarse después del registro. Para usar
        ambos, registra otra cuenta con otro correo.
      </Text>

      <PrimaryButton
        label={sel === 'cliente' ? 'Crear cuenta como cliente' : 'Crear cuenta como profesionista'}
        onPress={() => nav.push(sel === 'cliente' ? 'registroCliente' : 'registroProfesionista')}
        style={{ marginTop: spacing.lg }}
      />
      <SecondaryButton
        label="Ya tengo cuenta · Iniciar sesión"
        onPress={() => nav.push('iniciarSesion')}
        style={{ marginTop: spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.xl, paddingBottom: spacing.xl * 2 },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  tagline: { fontSize: 20, fontWeight: '800', fontFamily: F.extra, textAlign: 'center', lineHeight: 27, marginTop: spacing.md },
  taglineNavy: { color: colors.navy },
  taglineTeal: { color: colors.teal },
  pregunta: { marginTop: spacing.md, color: colors.textSec, fontSize: 13, fontWeight: '500', fontFamily: F.med },
  opcion: { marginBottom: spacing.md },
  opcionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opcionTitulo: { fontSize: 16, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  opcionDesc: { color: colors.textSec, fontSize: 13, lineHeight: 19, marginTop: 4 },
  nota: {
    color: colors.textSec,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
});
