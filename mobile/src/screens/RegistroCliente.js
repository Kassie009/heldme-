/**
 * HeldMe! — Pantalla 3 · Registro de cliente
 * Mockup: App Móvil 1 de 11 · 3 - Registro de cliente.
 * Nombre, correo, contraseña, fecha de nacimiento (mayores de 18) y
 * aceptación de términos y aviso de privacidad.
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, F } from '../theme';
import {
  TopBar, PrimaryButton, Field, TextInputBox, Checkbox, ErrorText,
} from '../ui';
import { registrarCuenta, buscarCuenta } from '../cuentas';

export default function RegistroCliente({ nav }) {
  const [d, setD] = useState({ nombre: '', correo: '', clave: '', fecha: '' });
  const [terminos, setTerminos] = useState(false);
  const [privacidad, setPrivacidad] = useState(false);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const cambiar = (campo, valor) => setD((p) => ({ ...p, [campo]: valor }));

  /** Autoformato: solo dígitos, con separadores DD / MM / AAAA mientras escribes. */
  const formatFecha = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return d.slice(0, 2) + ' / ' + d.slice(2);
    return d.slice(0, 2) + ' / ' + d.slice(2, 4) + ' / ' + d.slice(4);
  };

  /** Valida el correo: formato correcto y sin errores comunes (ej. ".con"). */
  const validarCorreo = (valor) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())) {
      return 'Escribe un correo electrónico válido.';
    }
    const dominio = valor.trim().toLowerCase().split('@')[1];
    if (dominio === 'con' || dominio.endsWith('.con')) {
      return '¿Quisiste decir ".com"? Revisa tu correo.';
    }
    if (dominio.endsWith('.cm') || dominio.endsWith('.cor')) {
      return '¿Quisiste decir ".com"? Revisa tu correo.';
    }
    return null;
  };

  const crear = () => {
    const e = {};
    if (!d.nombre.trim()) e.nombre = 'Escribe tu nombre completo.';
    const errorCorreo = validarCorreo(d.correo);
    if (errorCorreo) e.correo = errorCorreo;
    else {
      // El correo ya registrado no puede usarse (el tipo de cuenta es exclusivo).
      const existente = buscarCuenta(d.correo);
      if (existente) {
        e.correo = 'Ya existe una cuenta con ese correo. Inicia sesión.';
      }
    }
    if (d.clave.length < 8) e.clave = 'La contraseña debe tener al menos 8 caracteres.';

    const partes = d.fecha.split('/').map((x) => x.trim());
    if (partes.length === 3 && /^\d{2}$/.test(partes[0]) && /^\d{2}$/.test(partes[1]) && /^\d{4}$/.test(partes[2])) {
      const [dia, mes, anio] = partes.map(Number);
      const hoy = new Date();
      let edad = hoy.getFullYear() - anio;
      if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) edad -= 1;
      const nacimiento = new Date(anio, mes - 1, dia);
      const fechaCalendarioValida =
        nacimiento.getFullYear() === anio &&
        nacimiento.getMonth() === mes - 1 &&
        nacimiento.getDate() === dia;
      if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || anio < 1900) e.fecha = 'Escribe una fecha de nacimiento válida.';
      else if (!fechaCalendarioValida) e.fecha = 'Esa fecha no existe en el calendario.';
      else if (nacimiento > new Date()) e.fecha = 'La fecha no puede ser futura.';
      else if (edad < 18) e.fecha = 'Debes ser mayor de 18 años para crear una cuenta.';
    } else {
      e.fecha = 'Escribe tu fecha en formato DD / MM / AAAA.';
    }

    if (!terminos || !privacidad)
      e.legal = 'Acepta los términos de uso y el aviso de privacidad para continuar.';

    setErrores(e);
    if (Object.keys(e).length === 0) {
      // Simulación de creación de cuenta (sin backend): breve carga y navegación.
      setCargando(true);
      setTimeout(() => {
        registrarCuenta({ correo: d.correo, tipo: 'cliente', nombre: d.nombre, clave: d.clave });
        nav.reset('buscar', { tipo: 'cliente', nombre: d.nombre.trim().split(' ')[0] || 'cliente' });
        setCargando(false);
      }, 900);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} bounces={false}>
      <TopBar onBack={nav.back} />
      <Text style={styles.titulo}>Crear cuenta de cliente</Text>
      <Text style={styles.sub}>Solo para personas mayores de 18 años.</Text>

      <Field label="NOMBRE COMPLETO" style={{ marginTop: spacing.lg }}>
        <TextInputBox
          placeholder="Tu nombre y apellidos"
          value={d.nombre}
          onChangeText={(v) => cambiar('nombre', v)}
          invalid={!!errores.nombre}
        />
      </Field>
      <ErrorText>{errores.nombre}</ErrorText>

      <Field label="CORREO">
        <TextInputBox
          placeholder="tucorreo@correo.mx"
          value={d.correo}
          onChangeText={(v) => cambiar('correo', v)}
          keyboard="email-address"
          invalid={!!errores.correo}
        />
      </Field>
      <ErrorText>{errores.correo}</ErrorText>

      <Field label="CONTRASEÑA">
        <TextInputBox
          placeholder="Mínimo 8 caracteres"
          value={d.clave}
          onChangeText={(v) => cambiar('clave', v)}
          secureTextEntry
          invalid={!!errores.clave}
        />
      </Field>
      <ErrorText>{errores.clave}</ErrorText>

      <Field label="FECHA DE NACIMIENTO">
        <TextInputBox
          placeholder="DD / MM / AAAA"
          value={d.fecha}
          onChangeText={(v) => cambiar('fecha', formatFecha(v))}
          keyboard="number-pad"
          invalid={!!errores.fecha}
        />
      </Field>
      <ErrorText>{errores.fecha}</ErrorText>

      <View style={styles.legalBox}>
        <Checkbox checked={terminos} onPress={() => setTerminos(!terminos)} label="Acepto los términos de uso" />
        <Checkbox checked={privacidad} onPress={() => setPrivacidad(!privacidad)} label="Acepto el aviso de privacidad" />
        <ErrorText>{errores.legal}</ErrorText>
      </View>

      <PrimaryButton
        label="Crear cuenta"
        loading={cargando}
        loadingLabel="Creando cuenta..."
        onPress={crear}
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
  legalBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
    marginTop: spacing.md,
  },
});
