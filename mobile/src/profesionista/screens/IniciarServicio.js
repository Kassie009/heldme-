// Iniciar servicio · el profesionista escribe el código de inicio que le da el cliente
import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Etiqueta from '../components/Etiqueta';
import Boton from '../components/Boton';
import CodigoDigitos from '../components/CodigoDigitos';
import { colores } from '../theme';

// Datos de ejemplo (después se reemplazan por los de la base de datos)
const CONTRATO = { id: 'HM-2044', titulo: 'Reparación de fuga', cliente: 'Aaron Félix' };

// TODO: validar el código en el servidor. Aquí el código correcto de ejemplo es 4827.
const validarCodigoDemo = async (codigo) => codigo === '4827';

export default function IniciarServicio({
  onMenu,
  contrato = CONTRATO,
  validarCodigo = validarCodigoDemo,
  onIniciado,
}) {
  const [codigo, setCodigo] = useState('');
  const [iniciado, setIniciado] = useState(false);

  const confirmar = async () => {
    if (codigo.length < 4) {
      Alert.alert('Código incompleto', 'Escribe los 4 dígitos del código.');
      return;
    }
    const valido = await validarCodigo(codigo);
    if (!valido) {
      Alert.alert('Código incorrecto', 'Revisa el código con el cliente e inténtalo de nuevo.');
      setCodigo('');
      return;
    }
    setIniciado(true);
    if (onIniciado) onIniciado(contrato);
  };

  return (
    <Pantalla
      titulo="Iniciar servicio"
      subtitulo={`${contrato.id} · ${contrato.titulo}`}
      onMenu={onMenu}
      pie={
        <Boton
          titulo={iniciado ? 'Servicio iniciado' : 'Confirmar inicio'}
          onPress={confirmar}
          deshabilitado={iniciado}
        />
      }
    >
      <Tarjeta style={estilos.tarjeta}>
        <Etiqueta style={estilos.centro}>Código de inicio del cliente</Etiqueta>
        <CodigoDigitos
          valor={codigo}
          onCambiar={setCodigo}
          deshabilitado={iniciado}
          etiquetaAccesible="Código de inicio"
        />
      </Tarjeta>

      <Text style={estilos.nota}>
        {iniciado
          ? 'El servicio comenzó. Cuando termines, márcalo como realizado.'
          : `Pídele a ${contrato.cliente} el código de inicio. El servicio solo comienza con el código correcto.`}
      </Text>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { paddingVertical: 18 },
  centro: { textAlign: 'center' },
  nota: { fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
});
