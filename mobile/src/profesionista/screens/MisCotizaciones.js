// Mis cotizaciones (profesionista) · las versiones anteriores se conservan
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Insignia from '../components/Insignia';
import Boton from '../components/Boton';
import Campo from '../components/Campo';
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

export default function MisCotizaciones({ onMenu, cotizacionesIniciales = COTIZACIONES, onCrearVersion }) {
  const [cotizaciones, setCotizaciones] = useState(cotizacionesIniciales);
  const [formulario, setFormulario] = useState(null); // { cotId, concepto, monto }

  const crearVersion = (cot) => {
    if (onCrearVersion) {
      onCrearVersion(cot);
      return;
    }
    // Formulario real de nueva versión (RF-16): concepto + monto del adicional.
    setFormulario({ cotId: cot.id, concepto: '', monto: '' });
  };

  const enviarVersion = () => {
    const monto = parseFloat(formulario.monto);
    if (!formulario.concepto.trim() || !monto || monto <= 0) return;
    setCotizaciones((previas) =>
      previas.map((cot) => {
        if (cot.id !== formulario.cotId) return cot;
        const numero = cot.versiones.length + 1;
        return {
          ...cot,
          versiones: [
            ...cot.versiones.map((v) => (v.estado ? v : { ...v, estado: undefined })),
            { numero, etiqueta: `Versión ${numero} · adicional`, total: monto, concepto: formulario.concepto.trim(), estado: 'Pendiente del cliente' },
          ],
        };
      })
    );
    setFormulario(null);
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
                    <View style={{ alignItems: 'flex-end' }}>
                      {v.estado && (
                        <Insignia texto={v.estado} tono={TONO_ESTADO[v.estado] || 'neutro'} />
                      )}
                      {v.total != null && (
                        <Text style={estilos.versionTexto}>{formatearMXN(v.total)}</Text>
                      )}
                    </View>
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

            {formulario && formulario.cotId === cot.id && (
              <View style={estilos.formulario}>
                <Text style={estilos.formularioTitulo}>Versión {cot.versiones.length + 1} · trabajo adicional</Text>
                <Campo
                  etiqueta="CONCEPTO DEL ADICIONAL"
                  value={formulario.concepto}
                  onChangeText={(t) => setFormulario({ ...formulario, concepto: t })}
                  placeholder="Ej. Cambio de llave de paso"
                />
                <Campo
                  etiqueta="MONTO (MXN)"
                  value={formulario.monto}
                  onChangeText={(t) => setFormulario({ ...formulario, monto: t.replace(/[^0-9.]/g, '') })}
                  placeholder="150"
                  keyboardType="numeric"
                />
                <View style={estilos.formularioFila}>
                  <Boton titulo="Cancelar" variante="contorno" onPress={() => setFormulario(null)} style={{ flex: 1 }} />
                  <Boton
                    titulo="Enviar al cliente"
                    variante="primario"
                    onPress={enviarVersion}
                    style={{ flex: 1 }}
                  />
                </View>
                <Text style={estilos.nota}>
                  El adicional no se ejecuta hasta que el cliente lo acepte de forma explícita.
                </Text>
              </View>
            )}
          </Tarjeta>
        );
      })}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  filaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  formulario: {
    backgroundColor: colores.fondo,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  formularioTitulo: { fontSize: 14, fontWeight: '700', color: colores.marino, marginBottom: 10 },
  formularioFila: { flexDirection: 'row', gap: 10, marginTop: 4 },
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
