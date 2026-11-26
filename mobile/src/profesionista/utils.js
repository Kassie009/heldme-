// Convierte un texto ("$1,200.50") en número; si no es válido devuelve 0.
export function aNumero(texto) {
  const n = parseFloat(String(texto).replace(/[^0-9.\-]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

// 1700 -> "$1,700.00"  (con decimales = 0 -> "$1,700")
export function formatearMXN(valor, decimales = 2) {
  const [entero, decimal] = Math.abs(valor).toFixed(decimales).split('.');
  const conComas = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const signo = valor < 0 ? '-' : '';
  return `${signo}$${conComas}${decimal ? '.' + decimal : ''}`;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// Date -> "26 nov 2026 · 16:00"
export function formatearFechaHora(fecha) {
  const d = new Date(fecha);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()} · ${hh}:${mm}`;
}
