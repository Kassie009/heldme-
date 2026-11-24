/**
 * HeldMe! — Registro local de cuentas (solo frontend, en memoria).
 * Simula la base de cuentas mientras no exista backend:
 * el tipo de cuenta es exclusivo (RF-01, RN-12): si inicias sesión con el
 * tipo equivocado, el sistema rechaza e indica el tipo correcto.
 *
 * Nota: al recargar la app la memoria se limpia (es una simulación).
 */
const cuentas = [];

export function registrarCuenta({ correo, tipo, nombre, clave }) {
  const existente = cuentas.find((c) => c.correo === correo.trim().toLowerCase());
  if (existente) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo. Inicia sesión.' };
  }
  cuentas.push({
    correo: correo.trim().toLowerCase(),
    tipo, // 'cliente' | 'profesionista'
    nombre: nombre.trim(),
    clave, // Simulación: en real lo maneja Supabase Auth con hash (RNF-01)
  });
  return { ok: true };
}

export function buscarCuenta(correo) {
  return cuentas.find((c) => c.correo === correo.trim().toLowerCase()) || null;
}

/** Verifica credenciales: existencia de cuenta y contraseña correcta. */
export function verificarCredenciales(correo, clave) {
  const cuenta = buscarCuenta(correo);
  if (!cuenta) return { error: 'No existe una cuenta con ese correo. Créala con "Crear cuenta".' };
  if (cuenta.clave !== clave) {
    return { error: 'Contraseña incorrecta. Inténtalo de nuevo.', cuenta };
  }
  return { cuenta };
}
