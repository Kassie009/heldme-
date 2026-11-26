// Mis cotizaciones (profesionista) · las versiones anteriores se conservan
import { Alert, StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Insignia from '../components/Insignia';
import Boton from '../components/Boton';
import { colores } from '../theme';
import { formatearMXN } from '../utils';

const TONO_ESTADO = { Aceptada: 'primario', Enviada: 'aviso', 'Pendiente del cliente': 'aviso' };

// Datos de ejemplo (después se reemplazan por los de la base de datos)
const COTIZACIONES = [
  {
    id: 1,
    titulo: 'Reparación de fuga',
    estado: 'Aceptada',
    referencia: 'HM-2044 · Aaron Félix',
    versiones: [
      { numero: 1, etiqueta: 'Versión 1', total: 1700 },
      { numero: 2, etiqueta: 'Versión 2 · adicional', estado: 'Pendiente del cliente' },
    ],
  },
  {
    id: 2,
    titulo: 'Cambio de tubería de cocina',
    estado: 'Enviada',
    referencia: 'Sofía Luna · Col. Jalisco',
    versiones: [],
  },
];

export default function MisCotizaciones({ onMenu, cotizaciones = COTIZACIONES, onCrearVersion }) {
  const crearVersion = (cot) => {
    if (onCrearVersion) {
      onCrearVersion(cot);
      return;
    }
    // TODO: abrir el formulario de nueva versión de la cotización.
    Alert.alert('Nueva versión', `Aquí se abriría el formulario de la versión ${cot.versiones.length + 1} (simulado).`);
  };

  return (
    <Pantalla titulo="Mis cotizaciones" subtitulo="Las versiones anteriores se conservan" onMenu={onMenu}>
      {cotizaciones.map((cot) => {
        const hayPendiente = cot.versiones.some((v) => v.estado === 'Pendiente del cliente');
        return (
          <Tarjeta key={cot.id}>
            <View style={estilos.filaEntre}>
              <Text style={estilos.titulo}>{cot.titulo}</Text>
              <Insignia texto={cot.estado} tono={TONO_ESTADO[cot.estado] || 'neutro'} />
            </View>
            <Text style={estilos.referencia}>{cot.referencia}</Text>

            {cot.versiones.length > 0 && (
              <View style={estilos.versiones}>
                {cot.versiones.map((v) => (
                  <View key={v.numero} style={estilos.version}>
                    <Text style={estilos.versionTexto}>{v.etiqueta}</Text>
                    {v.estado ? (
                      <Insignia texto={v.estado} tono={TONO_ESTADO[v.estado] || 'neutro'} />
                    ) : (
                      <Text style={estilos.versionTexto}>{formatearMXN(v.total)}</Text>
                    )}
                  </View>
                ))}
                {hayPendiente && (
                  <Text style={estilos.nota}>El adicional no se ejecuta hasta que el cliente lo acepte.</Text>
                )}
              </View>
            )}

            {cot.estado === 'Aceptada' && (
              <Boton
                titulo="Crear nueva versión"
                variante="contorno"
                onPress={() => crearVersion(cot)}
                style={{ marginTop: 12 }}
              />
            )}
          </Tarjeta>
        );
      })}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  filaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  titulo: { flex: 1, fontSize: 15, fontWeight: '800', color: colores.texto },
  referencia: { fontSize: 13, color: colores.textoSuave, marginTop: 6 },
  versiones: { borderTopWidth: 1, borderTopColor: colores.borde, marginTop: 10, paddingTop: 6 },
  version: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  versionTexto: { fontSize: 14, color: colores.texto },
  nota: { fontSize: 12.5, color: colores.textoSuave, lineHeight: 18, marginTop: 2 },
});
