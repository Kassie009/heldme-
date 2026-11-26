// Cancelar contratación (profesionista) · cancelación justificada si faltan 48 horas o más
import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Fila from '../components/Fila';
import Campo from '../components/Campo';
import Boton from '../components/Boton';
import { colores } from '../theme';
import { formatearFechaHora } from '../utils';

// Datos de ejemplo (después se reemplazan por los de la base de datos)
const CONTRATO = { id: 'HM-2044', titulo: 'Reparación de fuga', cita: new Date(2026, 10, 26, 16, 0) };
// Fecha de "hoy" para la demostración. En la app real se pasa new Date().
const AHORA_DEMO = new Date(2026, 10, 23, 12, 0);

export default function CancelarContratacion({
  onMenu,
  contrato = CONTRATO,
  ahora = AHORA_DEMO,
  onVolver,
  onConfirmar,
}) {
  const [motivo, setMotivo] = useState('Imprevisto de agenda');

  const horas = (new Date(contrato.cita).getTime() - new Date(ahora).getTime()) / 3600000;
  const justificada = horas >= 48;

  const confirmar = () => {
    Alert.alert('Confirmar cancelación', '¿Seguro que quieres cancelar esta contratación?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: () => {
          // TODO: cancelar la contratación y registrar el strike si no está justificada.
          if (onConfirmar) onConfirmar({ contrato: contrato.id, motivo: motivo.trim(), justificada });
        },
      },
    ]);
  };

  return (
    <Pantalla
      titulo="Cancelar contratación"
      subtitulo={`${contrato.id} · ${contrato.titulo}`}
      onMenu={onMenu}
      pie={
        <>
          <Boton titulo="Volver" variante="contorno" onPress={onVolver} />
          <Boton titulo="Confirmar cancelación" onPress={confirmar} />
        </>
      }
    >
      <Tarjeta>
        <Fila etiqueta="Cita" valor={formatearFechaHora(contrato.cita)} />
        <Fila etiqueta="Anticipación" valor={justificada ? 'Más de 48 horas' : 'Menos de 48 horas'} />
      </Tarjeta>

      {justificada ? (
        <Tarjeta tono="primario" resaltada>
          <Text style={estilos.tituloAviso}>Cancelación justificada</Text>
          <Text style={estilos.textoAviso}>
            Como aún no inicia el servicio, se cancela la preautorización del cliente sin cargo.
          </Text>
        </Tarjeta>
      ) : (
        <Tarjeta tono="aviso">
          <Text style={[estilos.tituloAviso, { color: colores.avisoTexto }]}>
            Posible cancelación injustificada
          </Text>
          <Text style={estilos.textoAviso}>
            Faltan menos de 48 horas para la cita. Administración podría considerarla injustificada y
            aplicar un strike.
          </Text>
        </Tarjeta>
      )}

      <Campo etiqueta="Motivo" value={motivo} onChangeText={setMotivo} placeholder="Imprevisto de agenda" />

      <Text style={estilos.nota}>
        Si cancelas sin justificación recibirás un strike. Con menos de 48 horas podría considerarse
        injustificada.
      </Text>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  tituloAviso: { fontSize: 15, fontWeight: '800', color: colores.marino },
  textoAviso: { fontSize: 13, color: colores.textoSuave, lineHeight: 19, marginTop: 4 },
  nota: { fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
});
