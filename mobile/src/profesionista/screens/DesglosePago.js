// Desglose del pago · pago de prueba (Stripe Test Mode)
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Etiqueta from '../components/Etiqueta';
import Fila from '../components/Fila';
import { colores } from '../theme';
import { formatearMXN } from '../utils';

// Datos de ejemplo (después se reemplazan por los de la base de datos)
const PAGO = {
  contrato: 'HM-2044',
  manoObra: 500,
  diagnostico: 200,
  materialComprobado: 0,
  materialSinComprobante: 0,
  materialesDirectos: 1000,
  comprobante: 'ticket de ferretería',
  tasaComision: 0.1,
};

export default function DesglosePago({ onMenu, pago = PAGO, onVerComprobante }) {
  const montoPlataforma =
    pago.manoObra + pago.diagnostico + pago.materialComprobado + pago.materialSinComprobante;
  // La comisión se calcula sobre mano de obra, diagnóstico y material sin comprobante.
  const baseComision = pago.manoObra + pago.diagnostico + pago.materialSinComprobante;
  const comision = baseComision * pago.tasaComision;
  const porcentaje = Math.round(pago.tasaComision * 100);

  const verComprobante = () => {
    if (onVerComprobante) {
      onVerComprobante(pago);
      return;
    }
    // TODO: abrir la imagen del comprobante.
    Alert.alert('Comprobante', `Aquí se vería el ${pago.comprobante} (simulado).`);
  };

  return (
    <Pantalla
      titulo="Desglose del pago"
      subtitulo={`${pago.contrato} · Pago de prueba · Stripe Test Mode`}
      onMenu={onMenu}
    >
      <Tarjeta>
        <Etiqueta>En la plataforma</Etiqueta>
        <Fila etiqueta="Mano de obra" valor={formatearMXN(pago.manoObra)} />
        <Fila etiqueta="Diagnóstico" valor={formatearMXN(pago.diagnostico)} />
        <Fila etiqueta="Material comprobado" valor={formatearMXN(pago.materialComprobado)} />
        <Fila etiqueta="Material sin comprobante" valor={formatearMXN(pago.materialSinComprobante)} />
        <Fila etiqueta="Monto en plataforma" valor={formatearMXN(montoPlataforma)} fuerte linea />
      </Tarjeta>

      <Tarjeta>
        <Etiqueta>Fuera de HeldMe!</Etiqueta>
        <Fila etiqueta="Materiales de compra directa" valor={formatearMXN(pago.materialesDirectos)} />
        <View style={estilos.filaComprobante}>
          <Text style={estilos.texto}>Comprobante: {pago.comprobante}</Text>
          <Pressable onPress={verComprobante} hitSlop={10} accessibilityRole="button">
            <Text style={estilos.ver}>Ver</Text>
          </Pressable>
        </View>
      </Tarjeta>

      <Tarjeta>
        <Fila
          etiqueta={`Comisión HeldMe! (${porcentaje}% de ${formatearMXN(baseComision)})`}
          valor={formatearMXN(comision)}
        />
        <Fila
          etiqueta="Costo de procesamiento simulado"
          valor={<Text style={[estilos.texto, { textAlign: 'right', maxWidth: 110 }]}>Lo absorbe HeldMe!</Text>}
        />
      </Tarjeta>

      <Text style={estilos.nota}>
        La comisión se calcula sobre mano de obra, diagnóstico y material sin comprobante.
      </Text>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  texto: { fontSize: 14, color: colores.texto },
  filaComprobante: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  ver: { fontSize: 14, fontWeight: '800', color: colores.primario },
  nota: { fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
});
