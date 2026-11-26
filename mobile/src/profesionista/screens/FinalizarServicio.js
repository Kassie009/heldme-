// Finalizar servicio · comprobantes, marcar como realizado y validar el código del cliente
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Etiqueta from '../components/Etiqueta';
import Fila from '../components/Fila';
import Insignia from '../components/Insignia';
import Boton from '../components/Boton';
import CodigoDigitos from '../components/CodigoDigitos';
import { colores } from '../theme';
import { formatearMXN } from '../utils';

// Datos de ejemplo (después se reemplazan por los de la base de datos)
const CONTRATO = { id: 'HM-2044', estado: 'En proceso' };
const COMPROBANTES = [{ id: 1, nombre: 'Ticket de ferretería', monto: 1000, foto: true }];

// TODO: validar el código en el servidor. Aquí el código correcto de ejemplo es 7391.
const validarCodigoDemo = async (codigo) => codigo === '7391';

export default function FinalizarServicio({
  onMenu,
  contrato = CONTRATO,
  comprobantes = COMPROBANTES,
  validarCodigo = validarCodigoDemo,
  onMarcarRealizado,
  onSolicitarRevision,
  onFinalizado,
}) {
  const [realizado, setRealizado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [finalizado, setFinalizado] = useState(false);

  const marcarRealizado = () => {
    setRealizado(true);
    if (onMarcarRealizado) onMarcarRealizado(contrato);
  };

  const validar = async () => {
    if (!realizado) {
      Alert.alert('Falta un paso', 'Primero marca el servicio como realizado.');
      return;
    }
    if (codigo.length < 4) {
      Alert.alert('Código incompleto', 'Escribe los 4 dígitos del código del cliente.');
      return;
    }
    const valido = await validarCodigo(codigo);
    if (!valido) {
      Alert.alert('Código incorrecto', 'Revisa el código con el cliente e inténtalo de nuevo.');
      setCodigo('');
      return;
    }
    setFinalizado(true);
    if (onFinalizado) onFinalizado(contrato);
  };

  const solicitarRevision = () => {
    if (onSolicitarRevision) {
      onSolicitarRevision(contrato);
      return;
    }
    Alert.alert('Solicitar revisión', 'Aquí se abriría la pantalla "Solicitar revisión" (simulado).');
  };

  return (
    <Pantalla
      titulo="Finalizar servicio"
      subtitulo={`${contrato.id} · ${finalizado ? 'Finalizado' : contrato.estado}`}
      onMenu={onMenu}
      pie={
        <>
          <Boton
            titulo="No tengo el código · Solicitar revisión"
            variante="contorno"
            onPress={solicitarRevision}
            deshabilitado={finalizado}
          />
          <Boton
            titulo={finalizado ? 'Servicio finalizado' : 'Validar código'}
            onPress={validar}
            deshabilitado={finalizado}
          />
        </>
      }
    >
      <Tarjeta>
        <Etiqueta>Comprobantes de material</Etiqueta>
        {comprobantes.map((c) => (
          <View key={c.id} style={{ marginBottom: 6 }}>
            <Fila etiqueta={c.nombre} valor={formatearMXN(c.monto)} />
            {c.foto && <Insignia texto="Foto adjunta" />}
          </View>
        ))}
      </Tarjeta>

      <Boton
        titulo={realizado ? '✓ Marcado como realizado' : 'Marcar como realizado'}
        variante="contorno"
        onPress={marcarRealizado}
        deshabilitado={realizado}
        style={{ marginBottom: 12 }}
      />

      <Tarjeta style={estilos.tarjetaCodigo}>
        <Etiqueta style={estilos.centro}>Código de finalización del cliente</Etiqueta>
        <CodigoDigitos
          valor={codigo}
          onCambiar={setCodigo}
          deshabilitado={!realizado || finalizado}
          etiquetaAccesible="Código de finalización"
        />
        <Text style={[estilos.nota, estilos.centro]}>
          {finalizado
            ? 'Código validado. Se captura el monto de prueba.'
            : realizado
              ? 'Vigencia 24 h · un solo uso'
              : 'Marca el servicio como realizado para escribir el código.'}
        </Text>
      </Tarjeta>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  tarjetaCodigo: { paddingVertical: 16 },
  centro: { textAlign: 'center' },
  nota: { fontSize: 12.5, color: colores.textoSuave, marginTop: 6 },
});
