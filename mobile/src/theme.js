/**
 * HeldMe! — Tokens de identidad visual (docs: Manual de identidad v2026)
 * Paleta fría: fondos blancos, texto azul marino y acentos teal para acciones.
 */
export const colors = {
  navy: '#102044',      // Títulos, texto principal, iconos de alto contraste
  teal: '#176B78',      // Acciones principales, selección activa, iconos clave
  tealDeep: '#125865',  // Estados hover y énfasis interactivo
  white: '#FFFFFF',     // Tarjetas, campos, navegación y superficies
  canvas: '#F4F7F8',    // Fondo exterior de pantallas
  panel: '#F1F5F7',     // Paneles de apoyo y superficies secundarias
  mint: '#E6EFF0',      // Chips, estados suaves y fondos de iconos
  border: '#D8E1E5',    // Separadores, contornos y límites
  textSec: '#53646A',   // Descripciones, ayudas y metadatos
};

export const type = {
  // Nota: Plus Jakarta Sans se agregará con expo-font; por ahora usa la del sistema.
  title: { fontSize: 24, fontWeight: '700', color: colors.navy },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.navy },
  body: { fontSize: 14, color: colors.navy },
  helper: { fontSize: 11, fontWeight: '500', color: colors.textSec },
};

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
