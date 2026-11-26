/**
 * HeldMe! — Componentes compartidos de interfaz (solo frontend).
 * Basados en el nuevo mockup (App Móvil, 11 de 11 páginas) y el manual de
 * identidad: tarjetas blancas con borde frío, etiquetas en mayúsculas,
 * botón principal teal y barra superior con menú y logo centrado.
 */
import React, { useState } from 'react';
import { Text, View, Pressable, StyleSheet, TextInput, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, F } from './theme';

/** Barra superior: menú hamburguesa a la izquierda y logo centrado. */
export function TopBar({ onMenu, onBack }) {
  return (
    <View style={styles.topbar}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Regresar"
          style={styles.topbarSide}
        >
          <Ionicons name="arrow-back" size={22} color={colors.navy} />
        </Pressable>
      ) : onMenu ? (
        <Pressable
          onPress={onMenu}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Abrir menú"
          style={styles.topbarSide}
        >
          <Ionicons name="menu" size={24} color={colors.navy} />
        </Pressable>
      ) : (
        <View style={styles.topbarSide} />
      )}
      <Image
        source={require('../assets/logo-escudo.png')}
        style={styles.escudoMini}
        resizeMode="contain"
      />
      <View style={styles.topbarSide} />
    </View>
  );
}

/** Logo completo (escudo + HeldMe!) del manual de identidad. */
export function LogoMark({ width = 150 }) {
  return (
    <Image
      source={require('../assets/logo.png')}
      style={{ width, height: width * 0.793, alignSelf: 'center' }}
      resizeMode="contain"
      fadeDuration={0}
    />
  );
}

/** Etiqueta de campo: mayúsculas pequeñas, gris (como en el mockup). */
export function Label({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

/** Agrupa etiqueta + control con el espaciado del mockup. */
export function Field({ label, children, right }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <Label>{label}</Label>
        {right}
      </View>
      {children}
    </View>
  );
}

/** Campo de texto: fondo blanco, borde frío, radio medio. Las contraseñas
 *  incluyen el clásico ojito para mostrar/ocultar. */
export function TextInputBox({
  value, onChangeText, placeholder, secureTextEntry, keyboard,
  onSubmitEditing, invalid = false, style, icon,
  multiline = false, numberOfLines, maxLength, returnKeyType, accessibilityLabel,
  editable = true, submitBehavior,
}) {
  const [verClave, setVerClave] = useState(false);
  return (
    <View
      style={[
        styles.inputWrap,
        multiline && styles.inputWrapMultiline,
        invalid && styles.inputInvalid,
        !editable && styles.inputDisabled,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={17} color={colors.textSec} /> : null}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textSec}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !verClave}
        keyboardType={keyboard}
        onSubmitEditing={onSubmitEditing}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        returnKeyType={returnKeyType}
        accessibilityLabel={accessibilityLabel}
        editable={editable}
        submitBehavior={submitBehavior}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.inputText, multiline && styles.inputTextMultiline]}
      />
      {secureTextEntry ? (
        <Pressable
          onPress={() => setVerClave(!verClave)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <Ionicons
            name={verClave ? 'eye-off' : 'eye'}
            size={19}
            color={colors.textSec}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Selector estático (solo frontend): muestra el valor con chevron. */
export function SelectBox({ value, placeholder }) {
  return (
    <View style={styles.inputWrap}>
      <Text style={[styles.inputText, !value && { color: colors.textSec }]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={16} color={colors.navy} />
    </View>
  );
}

/** Casilla de verificación con texto (y enlace opcional). */
export function Checkbox({ checked, onPress, label }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={styles.checkboxRow}
    >
      <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
        {checked ? <Ionicons name="checkmark" size={15} color={colors.teal} /> : null}
      </View>
      <Text style={styles.checkboxText}>{label}</Text>
    </Pressable>
  );
}

/** Tarjeta blanca con borde frío. */
export function Card({ children, style, selected = false }) {
  return (
    <View
      style={[
        styles.card,
        selected && { borderColor: colors.teal, borderWidth: 2 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Botón principal: teal con etiqueta blanca; con estado de carga. */
export function PrimaryButton({ label, onPress, disabled = false, loading = false, loadingLabel, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.btnPrimary,
        (disabled || loading) && styles.btnDisabled,
        pressed && !disabled && !loading && { backgroundColor: colors.tealDeep },
        style,
      ]}
    >
      {loading ? (
        <View style={styles.btnLoadingRow}>
          <ActivityIndicator color={colors.white} size="small" />
          <Text style={styles.btnPrimaryText}>{loadingLabel || 'Cargando...'}</Text>
        </View>
      ) : (
        <Text style={styles.btnPrimaryText}>{label}</Text>
      )}
    </Pressable>
  );
}

/** Botón secundario: fondo blanco, borde frío, texto azul marino; con estado de carga opcional. */
export function SecondaryButton({ label, onPress, disabled = false, loading = false, loadingLabel, style }) {
  const bloqueado = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityState={{ disabled: bloqueado }}
      style={({ pressed }) => [
        styles.btnSecondary,
        bloqueado && styles.btnDisabled,
        pressed && !bloqueado && styles.pressedSoft,
        style,
      ]}
    >
      {loading ? (
        <View style={styles.btnLoadingRow}>
          <ActivityIndicator color={colors.navy} size="small" />
          <Text style={styles.btnSecondaryText}>{loadingLabel || 'Cargando...'}</Text>
        </View>
      ) : (
        <Text style={styles.btnSecondaryText}>{label}</Text>
      )}
    </Pressable>
  );
}

/** Chip: cápsula con borde; activa en teal. */
export function Chip({ label, active = false, onPress, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        disabled && styles.btnDisabled,
        pressed && !active && !disabled && styles.pressedSoft,
      ]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

/** Insignia pequeña (estado, rango, contador). */
export function Badge({ label, tone = 'mint' }) {
  return (
    <View style={[styles.badge, tone === 'teal' && styles.badgeTeal, tone === 'warn' && styles.badgeWarn, tone === 'danger' && styles.badgeDanger]}>
      <Text style={[styles.badgeText, tone === 'teal' && styles.badgeTextTeal, tone === 'warn' && styles.badgeTextWarn, tone === 'danger' && styles.badgeTextDanger]}>
        {label}
      </Text>
    </View>
  );
}

/** Enlace de texto en teal. */
export function TextLink({ children, onPress, style }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={style}>
      <Text style={styles.textLink}>{children}</Text>
    </Pressable>
  );
}

/** Mensaje de error inline. */
export function ErrorText({ children }) {
  if (!children) return null;
  return <Text style={styles.errorText}>{children}</Text>;
}

/** Fila de información: etiqueta a la izquierda, valor a la derecha. */
export function InfoRow({ label, value, tone }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text
        style={[
          styles.infoValue,
          tone === 'warn' && { color: colors.warnText },
          tone === 'teal' && { color: colors.teal },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/** Fila de ítem del menú lateral. */
export function MenuItem({ icon, label, active = false, onPress, right }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        active && styles.menuItemActive,
        pressed && !active && styles.pressedSoft,
      ]}
    >
      <Ionicons name={icon} size={18} color={active ? colors.teal : colors.navy} />
      <Text style={[styles.menuItemText, active && { color: colors.teal, fontWeight: '700', fontFamily: F.bold }]}>
        {label}
      </Text>
      {right}
    </Pressable>
  );
}

/** Título de sección dentro del menú lateral. */
export function DrawerSection({ children }) {
  return <Text style={styles.drawerSection}>{children}</Text>;
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  topbarSide: { width: 34, alignItems: 'center' },
  escudoMini: { width: 30, height: 33 },
  label: {
    fontSize: 10.5,
    fontWeight: '700', fontFamily: F.bold,
    color: colors.textSec,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  field: { marginBottom: spacing.md },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  infoLabel: { fontSize: 12.5, color: colors.textSec, fontWeight: '600', fontFamily: F.semi, flex: 1 },
  infoValue: { fontSize: 13, color: colors.navy, fontWeight: '700', fontFamily: F.bold, marginLeft: 12 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputWrapMultiline: { alignItems: 'flex-start', paddingVertical: 12 },
  inputInvalid: { borderColor: colors.error, backgroundColor: '#FDF3F1' },
  inputDisabled: { backgroundColor: colors.panel, opacity: 0.75 },
  inputText: { flex: 1, fontSize: 14, fontFamily: F.reg, color: colors.navy },
  inputTextMultiline: { alignSelf: 'stretch' },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkboxBox: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxBoxChecked: { backgroundColor: colors.mint, borderColor: colors.mint },
  checkboxText: { flex: 1, fontSize: 13, color: colors.navy, lineHeight: 18 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  btnPrimary: {
    backgroundColor: colors.teal,
    borderRadius: 26,
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: { color: colors.white, fontWeight: '700', fontFamily: F.bold, fontSize: 15 },
  btnDisabled: { opacity: 0.55 },
  btnLoadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnSecondary: {
    backgroundColor: colors.white,
    borderRadius: 26,
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  btnSecondaryText: { color: colors.navy, fontWeight: '600', fontFamily: F.semi, fontSize: 14 },
  pressedSoft: { backgroundColor: colors.panel },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  chipText: { color: colors.navy, fontWeight: '600', fontFamily: F.semi, fontSize: 13 },
  chipTextActive: { color: colors.white },
  badge: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeTeal: { backgroundColor: colors.teal },
  badgeWarn: { backgroundColor: colors.warnBg },
  badgeDanger: { backgroundColor: '#F8E3DF' },
  badgeText: { fontSize: 11, fontWeight: '700', fontFamily: F.bold, color: colors.navy },
  badgeTextTeal: { color: colors.white },
  badgeTextWarn: { color: colors.warnText },
  badgeTextDanger: { color: colors.error },
  textLink: { color: colors.teal, fontWeight: '700', fontFamily: F.bold, fontSize: 13 },
  errorText: { color: colors.error, fontSize: 12, fontWeight: '600', fontFamily: F.semi, marginTop: 4 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  menuItemActive: { backgroundColor: colors.mint },
  menuItemText: { fontSize: 14, fontWeight: '600', fontFamily: F.semi, color: colors.navy, flex: 1 },
  drawerSection: {
    fontSize: 10.5,
    fontWeight: '700', fontFamily: F.bold,
    color: colors.textSec,
    letterSpacing: 0.8,
    marginTop: spacing.lg,
    marginBottom: 4,
  },
});
