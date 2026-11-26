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

export default function MenuLateral({ nav, params, sesion, pantallaActual = 'buscar' }) {
  const tipo = sesion?.tipo ?? params?.tipo ?? 'cliente';
  const nombre = sesion?.nombre ?? params?.nombre ?? 'Aaron Félix';

  // Deslizar el dedo a la izquierda cierra el menú (como en el mockup).
  const toqueInicial = useRef(null);
  const manejoSwipe = {
    onTouchStart: (e) => {
      const x = e.nativeEvent.pageX ?? e.nativeEvent.clientX;
      if (x != null) toqueInicial.current = x;
    },
    onTouchMove: (e) => {
      const x = e.nativeEvent.pageX ?? e.nativeEvent.clientX;
      if (toqueInicial.current != null && x != null && x - toqueInicial.current < -55) {
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
              <MenuItem
                icon="grid"
                label="Panel principal"
                active={pantallaActual === 'panelProfe'}
                onPress={() => nav.reset('panelProfe', { tipo, nombre })}
              />
              <MenuItem icon="construct" label="Mis servicios" onPress={() => nav.reset('misServiciosPro', { tipo, nombre })} />
              <MenuItem icon="document-text" label="Solicitudes recibidas" onPress={() => nav.reset('solicitudesPro', { tipo, nombre })} />
              <MenuItem
                icon="receipt"
                label="Mis cotizaciones"
                active={pantallaActual === 'proMisCotizaciones'}
                onPress={() => nav.resetConPadre('panelProfe', 'proMisCotizaciones', { tipo, nombre })}
              />
              <MenuItem icon="calendar" label="Calendario" onPress={() => nav.reset('calendarioPro', { tipo, nombre })} />
              <MenuItem
                icon="key"
                label="Iniciar servicio"
                active={pantallaActual === 'proIniciarServicio'}
                onPress={() => nav.resetConPadre('panelProfe', 'proIniciarServicio', { tipo, nombre })}
              />
              <MenuItem
                icon="checkmark-done"
                label="Finalizar servicio"
                active={pantallaActual === 'proFinalizarServicio' || pantallaActual === 'proSolicitarRevision'}
                onPress={() => nav.resetConPadre('panelProfe', 'proFinalizarServicio', { tipo, nombre })}
              />
              <MenuItem
                icon="cash"
                label="Desglose del pago"
                active={pantallaActual === 'proDesglosePago'}
                onPress={() => nav.resetConPadre('panelProfe', 'proDesglosePago', { tipo, nombre })}
              />
              <MenuItem
                icon="close-circle"
                label="Cancelar contratación"
                active={pantallaActual === 'proCancelarContratacion'}
                onPress={() => nav.resetConPadre('panelProfe', 'proCancelarContratacion', { tipo, nombre })}
              />
              <MenuItem
                icon="chatbubbles"
                label="Chat"
                active={pantallaActual === 'proConversaciones' || pantallaActual === 'proChat'}
                onPress={() => nav.resetConPadre('panelProfe', 'proConversaciones', { tipo, nombre })}
              />

              <DrawerSection>Aprendizaje</DrawerSection>
              <MenuItem
                icon="ribbon"
                label="Autorización de cursos"
                active={pantallaActual === 'proCursosAutorizacion'}
                onPress={() => nav.resetConPadre('panelProfe', 'proCursosAutorizacion', { tipo, nombre })}
              />
              <MenuItem
                icon="school"
                label="Mis cursos"
                active={pantallaActual === 'proMisCursos' || pantallaActual === 'proNuevoCurso'}
                onPress={() => nav.resetConPadre('panelProfe', 'proMisCursos', { tipo, nombre })}
              />

              <DrawerSection>Cuenta</DrawerSection>
              <MenuItem
                icon="person"
                label="Perfil y rango"
                active={pantallaActual === 'proPerfilProfesional'}
                onPress={() => nav.resetConPadre('panelProfe', 'proPerfilProfesional', { tipo, nombre })}
              />
              <MenuItem
                icon="alert-circle"
                label="Mis sanciones"
                active={pantallaActual === 'proPerfilConSancion'}
                onPress={() => nav.resetConPadre('panelProfe', 'proPerfilConSancion', { tipo, nombre })}
              />
            </>
          ) : (
            <>
              <DrawerSection>Servicios</DrawerSection>
              <MenuItem
                icon="search"
                label="Buscar"
                active={pantallaActual === 'buscar'}
                onPress={() => nav.reset('buscar', { tipo, nombre })}
              />
              <MenuItem
                icon="document-text"
                label="Mis solicitudes"
                active={pantallaActual === 'misSolicitudes'}
                onPress={() => nav.resetConPadre('buscar', 'misSolicitudes', { tipo, nombre })}
              />
              <MenuItem
                icon="receipt"
                label="Cotizaciones recibidas"
                active={pantallaActual === 'cotizaciones'}
                onPress={() => nav.resetConPadre('buscar', 'cotizaciones', { tipo, nombre })}
              />
              <MenuItem
                icon="reader"
                label="Contrataciones"
                active={pantallaActual === 'contrataciones'}
                onPress={() => nav.resetConPadre('buscar', 'contrataciones', { tipo, nombre })}
              />
              <MenuItem
                icon="chatbubbles"
                label="Chat"
                active={pantallaActual === 'conversaciones'}
                onPress={() => nav.resetConPadre('buscar', 'conversaciones', { tipo, nombre })}
              />

              <DrawerSection>Aprendizaje</DrawerSection>
              <MenuItem
                icon="school"
                label="Cursos"
                active={pantallaActual === 'cursos'}
                onPress={() => nav.resetConPadre('buscar', 'cursos', { tipo, nombre })}
              />

              <DrawerSection>Cuenta</DrawerSection>
              <MenuItem
                icon="person"
                label="Perfil"
                active={pantallaActual === 'perfilCliente'}
                onPress={() => nav.reset('perfilCliente', { tipo, nombre })}
              />
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
