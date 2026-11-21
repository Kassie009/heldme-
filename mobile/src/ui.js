/**
 * HeldMe! — Componentes compartidos de interfaz (solo frontend).
 * Basados en el manual de identidad: tarjeta blanca, borde frío, botón teal.
 */
import React from 'react';
import { Text, View, Pressable, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from './theme';

/** Botón principal: teal #176B78, texto blanco, esquinas redondeadas. */
export function PrimaryButton({ label, icon, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btnPrimary,
        pressed && { backgroundColor: colors.tealDeep },
        style,
      ]}
    >
      <Text style={styles.btnPrimaryText}>{label}</Text>
      {icon ? <Ionicons name={icon} size={18} color={colors.white} /> : null}
    </Pressable>
  );
}

/** Botón secundario: fondo blanco, borde frío y texto azul marino. */
export function SecondaryButton({ label, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btnSecondary, pressed && styles.hover, style]}
    >
      <Text style={styles.btnSecondaryText}>{label}</Text>
    </Pressable>
  );
}

/** Tarjeta: superficie blanca, borde sutil y sombra mínima. */
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Chip de categoría (manual: chips completos, nunca recortados). */
export function Chip({ label, icon, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && !active && styles.hover,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={active ? colors.white : colors.teal}
        />
      ) : null}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Etiqueta de campo de formulario. */
export function FieldLabel({ children, right }) {
  return (
    <View style={styles.fieldLabelRow}>
      <Text style={styles.fieldLabel}>{children}</Text>
      {right}
    </View>
  );
}

/** Campo de entrada con icono a la izquierda. */
export function Input({
  icon,
  placeholder,
  value,
  onChangeText,
  multiline,
  secureTextEntry,
  right,
  editable = true,
  invalid = false,
  keyboard = 'default',
  style,
}) {
  return (
    <View style={[styles.inputWrap, multiline && styles.inputWrapMultiline, invalid && styles.inputInvalid, style]}>
      {icon ? <Ionicons name={icon} size={18} color={colors.textSec} /> : null}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textSec}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        editable={editable}
        keyboardType={keyboard}
        style={[styles.inputText, multiline && styles.inputTextMultiline]}
      />
      {right}
    </View>
  );
}

/** Casilla de verificación: teal cuando está activa. */
export function Checkbox({ checked, onPress, label, linkLabel, onLinkPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={styles.checkboxRow}
    >
      <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
        {checked ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
      </View>
      <Text style={styles.checkboxText}>
        {label}
        {linkLabel ? (
          <Text onPress={onLinkPress} style={styles.checkboxLink}>
            {' '}
            {linkLabel}
          </Text>
        ) : null}
      </Text>
    </Pressable>
  );
}

/** Barra de navegación inferior: blanca con línea superior, activo en teal. */
export function TabBar({ active = 'Explorar' }) {
  const tabs = [
    { key: 'Explorar', icon: 'compass-outline' },
    { key: 'Actividad', icon: 'briefcase-outline' },
    { key: 'Mensajes', icon: 'chatbubble-ellipses-outline', dot: true },
    { key: 'Perfil', icon: 'person-outline' },
  ];
  return (
    <View style={styles.tabbar}>
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <View key={t.key} style={styles.tabItem}>
            <View style={isActive ? styles.tabIconActive : null}>
              <Ionicons
                name={t.icon}
                size={22}
                color={isActive ? colors.teal : colors.textSec}
              />
              {t.dot ? <View style={styles.tabDot} /> : null}
            </View>
            <Text style={[styles.tabLabel, isActive && { color: colors.teal }]}>
              {t.key}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  btnPrimary: {
    backgroundColor: colors.teal,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  btnPrimaryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  btnSecondary: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  btnSecondaryText: { color: colors.navy, fontWeight: '600', fontSize: 14 },
  hover: { backgroundColor: colors.panel },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  chipText: { color: colors.navy, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: colors.white },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: { fontWeight: '700', fontSize: 13, color: colors.navy },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  inputWrapMultiline: { alignItems: 'flex-start', paddingVertical: spacing.md, minHeight: 96 },
  inputText: { flex: 1, fontSize: 14, color: colors.navy },
  inputTextMultiline: { textAlignVertical: 'top' },
  inputInvalid: { borderColor: '#C24C3F', backgroundColor: '#FDF3F1' },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxBoxChecked: { backgroundColor: colors.teal, borderColor: colors.teal },
  checkboxText: { flex: 1, fontSize: 13, color: colors.navy, lineHeight: 19 },
  checkboxLink: { color: colors.teal, fontWeight: '700' },
  tabbar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingBottom: 18,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabIconActive: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  tabDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.teal,
  },
  tabLabel: { fontSize: 11, fontWeight: '600', color: colors.textSec },
});
