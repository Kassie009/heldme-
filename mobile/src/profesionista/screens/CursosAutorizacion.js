// Cursos · autorización para impartir cursos (se necesita rango Plata o superior)
import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Fila from '../components/Fila';
import Insignia from '../components/Insignia';
import Boton from '../components/Boton';
import { colores } from '../theme';

const ORDEN_RANGOS = { Bronce: 0, Plata: 1, Oro: 2 };

export default function CursosAutorizacion({
  onMenu,
  rangoActual = 'Plata',
  rangoMinimo = 'Plata',
  calificacion = 4.9,
  servicios = 18,
  solicitudEnviada = false,
  onSolicitar,
}) {
  const [enviada, setEnviada] = useState(solicitudEnviada);
  const cumple = ORDEN_RANGOS[rangoActual] >= ORDEN_RANGOS[rangoMinimo];

  const solicitar = () => {
    // TODO: crear la solicitud de autorización para revisión administrativa.
    setEnviada(true);
    if (onSolicitar) onSolicitar({ rangoActual, calificacion, servicios });
    Alert.alert('Solicitud enviada', 'Administración revisará tu perfil, tu evidencia y la propuesta del curso.');
  };

  return (
    <Pantalla
      titulo="Cursos"
      subtitulo={`Para impartir cursos necesitas rango ${rangoMinimo} o superior.`}
      onMenu={onMenu}
      pie={
        <Boton
          titulo={enviada ? 'Solicitud enviada' : 'Solicitar autorización'}
          onPress={solicitar}
          deshabilitado={!cumple || enviada}
        />
      }
    >
      <Tarjeta>
        <Fila etiqueta="Rango actual" valor={rangoActual} />
        <Fila etiqueta="Calificación" valor={String(calificacion)} />
        <Fila etiqueta="Servicios" valor={String(servicios)} />
      </Tarjeta>

      <Tarjeta>
        <Insignia
          texto={cumple ? 'Cumples el rango mínimo' : 'No cumples el rango mínimo'}
          tono={cumple ? 'primario' : 'aviso'}
        />
        <Text style={estilos.texto}>
          {enviada
            ? 'Solicitud enviada. Se revisarán tu perfil, tu evidencia y la propuesta del curso.'
            : cumple
              ? 'Aún no has enviado tu solicitud. Se revisarán tu perfil, tu evidencia y la propuesta del curso.'
              : `Necesitas rango ${rangoMinimo} o superior para solicitar la autorización.`}
        </Text>
      </Tarjeta>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  texto: { fontSize: 13, color: colores.textoSuave, lineHeight: 19, marginTop: 10 },
});
