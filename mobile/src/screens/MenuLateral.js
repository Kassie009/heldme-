/**
 * HeldMe! — Pantalla 6 · Menú lateral (drawer)
 * Mockup: App Móvil 2 de 11 · Menú lateral.
 * Apartados exclusivos del tipo de cuenta (en estos flujos: cliente).
 */
import React, { useRef } from 'react';
import { Text, View, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from '../theme';
import { MenuItem, DrawerSection } from '../ui';

export default function MenuLateral({ nav, params }) {
  const tipo = params?.tipo ?? 'cliente';
  const nombre = params?.nombre ?? 'Aaron Félix';

  // Deslizar el dedo a la izquierda cierra el menú (como en el mockup).
  const toqueInicial = useRef(null);
  const manejoSwipe = {
    onTouchStart: (e) => {
      toqueInicial.current = e.nativeEvent.clientX;
    },
    onTouchMove: (e) => {
      if (toqueInicial.current != null && e.nativeEvent.clientX - toqueInicial.current < -55) {
        toqueInicial.current = null;
        nav.back();
      }
    },
  };

  return (
    <View style={styles.overlay}>
      {/* Fondo oscurecido: tocar cierra el menú */}
      <Pressable
        style={styles.backdrop}
        onPress={nav.back}
        accessibilityLabel="Cerrar menú"
      />
      <View style={styles.panel} {...manejoSwipe}>
        <View style={styles.panelHeader}>
          <Image
            source={require('../../assets/logo-escudo.png')}
            style={{ width: 34, height: 37 }}
            resizeMode="contain"
          />
          <Text style={styles.logoTexto}>
            <Text style={styles.logoHeld}>Held</Text>
            <Text style={styles.logoMe}>Me!</Text>
          </Text>
        </View>

        <ScrollView style={styles.panelScroll} contentContainerStyle={styles.panelContent} bounces={false}>
          {/* Apartados exclusivos por tipo de cuenta (RF-02) */}
          {tipo === 'profesionista' ? (
            <>
              <DrawerSection>Servicios</DrawerSection>
              <MenuItem icon="construct" label="Mis servicios" onPress={nav.back} />
              <MenuItem icon="document-text" label="Solicitudes recibidas" onPress={nav.back} />
              <MenuItem icon="receipt" label="Cotizaciones" onPress={nav.back} />
              <MenuItem icon="calendar" label="Calendario" onPress={nav.back} />
              <MenuItem icon="key" label="Códigos de servicio" onPress={nav.back} />
              <MenuItem icon="chatbubbles" label="Chat" onPress={nav.back} />

              <DrawerSection>Aprendizaje</DrawerSection>
              <MenuItem icon="school" label="Cursos autorizados" onPress={nav.back} />

              <DrawerSection>Cuenta</DrawerSection>
              <MenuItem icon="person" label="Perfil y verificación" onPress={nav.back} />
            </>
          ) : (
            <>
              <DrawerSection>Servicios</DrawerSection>
              <MenuItem icon="search" label="Buscar" active onPress={() => nav.reset('buscar', { tipo, nombre })} />
              <MenuItem icon="document-text" label="Mis solicitudes" onPress={() => nav.resetConPadre('buscar', 'misSolicitudes', { tipo, nombre })} />
              <MenuItem icon="receipt" label="Cotizaciones recibidas" onPress={() => nav.resetConPadre('buscar', 'cotizaciones', { tipo, nombre })} />
              <MenuItem icon="reader" label="Contrataciones" onPress={nav.back} />
              <MenuItem icon="chatbubbles" label="Chat" onPress={nav.back} />

              <DrawerSection>Aprendizaje</DrawerSection>
              <MenuItem icon="school" label="Cursos" onPress={nav.back} />

              <DrawerSection>Cuenta</DrawerSection>
              <MenuItem icon="person" label="Perfil" onPress={nav.back} />
            </>
          )}
        </ScrollView>

        <View style={styles.panelFooter}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {nombre.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.usuario}>{nombre}</Text>
            <Text style={styles.usuarioTipo}>
              Cuenta de {tipo === 'profesionista' ? 'profesionista' : 'cliente'}
            </Text>
          </View>
          <Pressable
            onPress={() => nav.reset('tipo')}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            hitSlop={8}
          >
            <Ionicons name="log-out" size={20} color={colors.textSec} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 10,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 32, 68, 0.45)',
  },
  panel: {
    width: '78%',
    height: '100%',
    maxWidth: 320,
    backgroundColor: colors.white,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  logoTexto: { fontSize: 20, fontWeight: '800', fontFamily: F.extra },
  logoHeld: { color: colors.navy },
  logoMe: { color: colors.teal },
  panelScroll: { flex: 1 },
  panelContent: { paddingHorizontal: spacing.md },
  panelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  avatar: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '800', fontFamily: F.extra, color: colors.navy, fontSize: 13 },
  usuario: { fontWeight: '800', fontFamily: F.extra, color: colors.navy, fontSize: 13 },
  usuarioTipo: { color: colors.textSec, fontSize: 11 },
});
