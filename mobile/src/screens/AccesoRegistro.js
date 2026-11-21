/**
 * HeldMe! — Pantalla 01 / Acceso y registro
 * Mockup: MÓVIL PANTALLA 01/19 · 01 - Autenticación y Registro (+18 años).
 * Solo frontend: validaciones visuales del lado del cliente; sin backend.
 *
 * Formulario "Crear cuenta" conforme al SRS:
 *  - Fecha de nacimiento obligatoria: se rechaza a menores de 18 años.
 *  - Aceptación de términos de uso y aviso de privacidad (obligatoria);
 *    el backend registrará versión del documento y fecha de aceptación.
 *  - Correo y contraseña para el proveedor de autenticación (Supabase Auth).
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { PrimaryButton, Card, FieldLabel, Input, Checkbox } from '../ui';

const vacio = {
  nombre: '',
  correo: '',
  clave: '',
  dia: '',
  mes: '',
  anio: '',
};

export default function AccesoRegistro({ onEntrar }) {
  const [tab, setTab] = useState('iniciar'); // 'iniciar' | 'crear'
  const [datos, setDatos] = useState(vacio);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [errores, setErrores] = useState({});

  const cambiar = (campo, valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  const cambiarTab = (nuevo) => {
    setTab(nuevo);
    setErrores({});
  };

  /** Valida el formulario de registro (criterios del SRS, lado cliente). */
  const validarRegistro = () => {
    const e = {};
    if (!datos.nombre.trim()) e.nombre = 'Escribe tu nombre completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim()))
      e.correo = 'Escribe un correo electrónico válido.';
    if (datos.clave.length < 8)
      e.clave = 'La contraseña debe tener al menos 8 caracteres.';

    // Fecha de nacimiento: DD / MM / AAAA
    const dia = parseInt(datos.dia, 10);
    const mes = parseInt(datos.mes, 10);
    const anio = parseInt(datos.anio, 10);
    const fechaValida =
      /^\d{4}$/.test(datos.anio) &&
      mes >= 1 && mes <= 12 &&
      dia >= 1 && dia <= 31 &&
      anio >= 1900;
    if (!fechaValida) {
      e.fecha = 'Escribe una fecha de nacimiento válida (día, mes y año).';
    } else {
      const hoy = new Date();
      const nacimiento = new Date(anio, mes - 1, dia);
      let edad = hoy.getFullYear() - anio;
      const antesDeCumple =
        hoy.getMonth() < mes - 1 ||
        (hoy.getMonth() === mes - 1 && hoy.getDate() < dia);
      if (antesDeCumple) edad -= 1;
      if (nacimiento > hoy) {
        e.fecha = 'La fecha no puede ser futura.';
      } else if (edad < 18) {
        e.fecha = 'Debes ser mayor de 18 años para crear una cuenta.';
      }
    }

    if (!aceptaTerminos || !aceptaPrivacidad)
      e.legal = 'Acepta los términos de uso y el aviso de privacidad para continuar.';
    return e;
  };

  const enviar = () => {
    if (tab === 'iniciar') {
      setErrores({});
      onEntrar();
      return;
    }
    const e = validarRegistro();
    setErrores(e);
    if (Object.keys(e).length === 0) onEntrar();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      {/* Encabezado de marca */}
      <View style={styles.hero}>
        <View style={styles.logoBadge}>
          <Ionicons name="shield-outline" size={44} color={colors.teal} />
        </View>
        <Text style={styles.wordmark}>
          <Text style={styles.wordmarkHeld}>Held</Text>
          <Text style={styles.wordmarkMe}>Me!</Text>
        </Text>
        <Text style={styles.tagline}>
          Conectamos clientes con profesionistas aprobados a partir de la
          revisión de evidencias.
        </Text>
      </View>

      {/* Pestañas: Iniciar sesión / Crear cuenta */}
      <View style={styles.segment}>
        <Pressable
          onPress={() => cambiarTab('iniciar')}
          style={[styles.segmentBtn, tab === 'iniciar' && styles.segmentBtnActive]}
        >
          <Text
            style={[
              styles.segmentText,
              tab === 'iniciar' && styles.segmentTextActive,
            ]}
          >
            Iniciar sesión
          </Text>
        </Pressable>
        <Pressable
          onPress={() => cambiarTab('crear')}
          style={[styles.segmentBtn, tab === 'crear' && styles.segmentBtnActive]}
        >
          <Text
            style={[
              styles.segmentText,
              tab === 'crear' && styles.segmentTextActive,
            ]}
          >
            Crear cuenta
          </Text>
        </Pressable>
      </View>

      {tab === 'iniciar' ? (
        <>
          <FieldLabel>Correo electrónico</FieldLabel>
          <Input
            icon="mail-outline"
            placeholder="tucorreo@heldme.mx"
            value="aaron.felix@heldme.mx"
          />

          <FieldLabel
            right={<Text style={styles.link}>¿Olvidaste tu clave?</Text>}
          >
            Contraseña
          </FieldLabel>
          <Input
            icon="lock-closed-outline"
            placeholder="••••••••"
            secureTextEntry
          />
        </>
      ) : (
        <>
          <FieldLabel>Nombre completo</FieldLabel>
          <Input
            icon="person-outline"
            placeholder="¿Cómo te llamas?"
            value={datos.nombre}
            onChangeText={(v) => cambiar('nombre', v)}
            invalid={!!errores.nombre}
          />
          <ErrorText>{errores.nombre}</ErrorText>

          <FieldLabel>Correo electrónico</FieldLabel>
          <Input
            icon="mail-outline"
            placeholder="tucorreo@ejemplo.mx"
            value={datos.correo}
            onChangeText={(v) => cambiar('correo', v)}
            invalid={!!errores.correo}
            keyboard="email-address"
          />
          <ErrorText>{errores.correo}</ErrorText>

          <FieldLabel>Contraseña</FieldLabel>
          <Input
            icon="lock-closed-outline"
            placeholder="Mínimo 8 caracteres"
            value={datos.clave}
            onChangeText={(v) => cambiar('clave', v)}
            invalid={!!errores.clave}
            secureTextEntry
          />
          <ErrorText>{errores.clave}</ErrorText>

          <FieldLabel>Fecha de nacimiento</FieldLabel>
          <View style={styles.fechaRow}>
            <Input
              placeholder="Día"
              value={datos.dia}
              onChangeText={(v) => cambiar('dia', v.replace(/\D/g, '').slice(0, 2))}
              invalid={!!errores.fecha}
              keyboard="number-pad"
              style={{ flex: 1 }}
            />
            <Input
              placeholder="Mes"
              value={datos.mes}
              onChangeText={(v) => cambiar('mes', v.replace(/\D/g, '').slice(0, 2))}
              invalid={!!errores.fecha}
              keyboard="number-pad"
              style={{ flex: 1 }}
            />
            <Input
              placeholder="Año"
              value={datos.anio}
              onChangeText={(v) => cambiar('anio', v.replace(/\D/g, '').slice(0, 4))}
              invalid={!!errores.fecha}
              keyboard="number-pad"
              style={{ flex: 1.4 }}
            />
          </View>
          <Text style={styles.fechaAyuda}>
            Debes ser mayor de 18 años para usar HeldMe!.
          </Text>
          <ErrorText>{errores.fecha}</ErrorText>

          <View style={styles.legalBox}>
            <Checkbox
              checked={aceptaTerminos}
              onPress={() => setAceptaTerminos(!aceptaTerminos)}
              label="He leído y acepto los"
              linkLabel="Términos de Uso"
            />
            <Checkbox
              checked={aceptaPrivacidad}
              onPress={() => setAceptaPrivacidad(!aceptaPrivacidad)}
              label="He leído y acepto el"
              linkLabel="Aviso de Privacidad"
            />
            <ErrorText>{errores.legal}</ErrorText>
          </View>
        </>
      )}

      <PrimaryButton
        label={tab === 'iniciar' ? 'Entrar a HeldMe!' : 'Crear mi cuenta'}
        icon="arrow-forward"
        onPress={enviar}
        style={{ marginTop: spacing.lg }}
      />

      {/* Nota de cuenta única dual */}
      <Card style={styles.dualCard}>
        <View style={styles.dualIcon}>
          <Ionicons name="shield-checkmark" size={20} color={colors.white} />
        </View>
        <View style={styles.dualText}>
          <Text style={styles.dualTitle}>Cuenta única dual</Text>
          <Text style={styles.dualDesc}>
            Contrata servicios o activa el modo profesionista desde el mismo
            perfil.
          </Text>
        </View>
      </Card>

      <Text style={styles.legal}>
        Al continuar aceptas los términos de uso y el aviso de privacidad.
        Solo mayores de 18 años.
      </Text>
    </ScrollView>
  );
}

/** Mensaje de error inline (debajo del campo correspondiente). */
function ErrorText({ children }) {
  if (!children) return null;
  return <Text style={styles.errorText}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.xl, paddingTop: spacing.xxl * 2, gap: 2 },
  hero: { alignItems: 'center', marginBottom: spacing.xxl },
  logoBadge: {
    backgroundColor: colors.mint,
    borderRadius: 24,
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  wordmark: { fontSize: 40, fontWeight: '800' },
  wordmarkHeld: { color: colors.navy },
  wordmarkMe: { color: colors.teal },
  tagline: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.textSec,
    fontSize: 14,
    lineHeight: 21,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.panel,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.lg,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: radius.pill,
  },
  segmentBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentText: { fontWeight: '600', fontSize: 14, color: colors.textSec },
  segmentTextActive: { color: colors.navy },
  link: { color: colors.teal, fontWeight: '600', fontSize: 12 },
  errorText: {
    color: '#B3402F',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 2,
  },
  fechaRow: { flexDirection: 'row', gap: spacing.sm },
  fechaAyuda: {
    color: colors.textSec,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
  },
  legalBox: {
    backgroundColor: colors.mint,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  dualCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  dualIcon: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dualText: { flex: 1 },
  dualTitle: { fontWeight: '700', fontSize: 14, color: colors.navy },
  dualDesc: { color: colors.textSec, fontSize: 12, lineHeight: 17, marginTop: 2 },
  legal: {
    marginTop: spacing.xl,
    textAlign: 'center',
    color: colors.textSec,
    fontSize: 11,
    lineHeight: 16,
  },
});
