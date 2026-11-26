// Solicitar revisión · finalización sin segundo código (RF-34, RN-15)
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Etiqueta from '../components/Etiqueta';
import Campo from '../components/Campo';
import Insignia from '../components/Insignia';
import Boton from '../components/Boton';
import { colores, radios } from '../theme';

const ESTADOS = ['Abierta', 'En revisión', 'Resuelta', 'Cerrada'];

// Datos de ejemplo (después se reemplazan por los de la base de datos)
const CONTRATO = { id: 'HM-2044' };
const EVIDENCIAS = ['Chat · cotización'];

export default function SolicitarRevision({
  onMenu,
  contrato = CONTRATO,
  estado = 'Abierta',
  evidencias = EVIDENCIAS,
  onEnviar,
}) {
  const [explicacion, setExplicacion] = useState('El cliente no compartió el código.');
  const [enviada, setEnviada] = useState(false);

  const enviar = () => {
    if (!explicacion.trim()) {
      Alert.alert('Falta la explicación', 'Cuéntale a administración qué ocurrió.');
      return;
    }
    // TODO: guardar la solicitud de revisión con sus evidencias.
    setEnviada(true);
    if (onEnviar) onEnviar({ contrato: contrato.id, explicacion: explicacion.trim(), evidencias });
    Alert.alert('Solicitud enviada', 'Administración revisará tu caso.');
  };

  return (
    <Pantalla
      titulo="Solicitar revisión"
      subtitulo={`${contrato.id} · Finalización sin segundo código`}
      onMenu={onMenu}
      pie={<Boton titulo={enviada ? 'Solicitud enviada' : 'Enviar solicitud'} onPress={enviar} deshabilitado={enviada} />}
    >
      <View style={estilos.estados}>
        {ESTADOS.map((e) => (
          <View key={e} style={[estilos.estado, e === estado && estilos.estadoActivo]}>
            <Text style={[estilos.estadoTexto, e === estado && estilos.estadoTextoActivo]}>{e}</Text>
          </View>
        ))}
      </View>

      <Campo
        etiqueta="Explicación"
        value={explicacion}
        onChangeText={setExplicacion}
        deshabilitado={enviada}
        multilinea
        estiloEntrada={{ minHeight: 70 }}
      />

      <Tarjeta>
        <View style={estilos.filaEvidencias}>
          <Etiqueta style={{ marginBottom: 0 }}>Evidencias</Etiqueta>
          <View style={estilos.pills}>
            {evidencias.map((ev) => (
              <Insignia key={ev} texto={ev} />
            ))}
          </View>
        </View>
      </Tarjeta>

      <Text style={estilos.nota}>
        Administración decide si el monto preautorizado se captura total o parcialmente, o se cancela.
      </Text>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  estados: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  estado: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radios.pill,
    borderWidth: 1,
    borderColor: colores.bordeFuerte,
    backgroundColor: '#FFFFFF',
  },
  estadoActivo: { backgroundColor: colores.primarioSuave, borderColor: '#B9D0D5' },
  estadoTexto: { fontSize: 11.5, fontWeight: '600', color: colores.textoSuave },
  estadoTextoActivo: { color: colores.marino, fontWeight: '800' },
  filaEvidencias: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pills: { flexDirection: 'row', gap: 6 },
  nota: { fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
});
