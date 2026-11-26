import { StyleSheet, Text } from 'react-native';
import { colores } from '../theme';

// Texto pequeño en mayúsculas que encabeza una tarjeta ("MATERIAL", "TÍTULO"...)
export default function Etiqueta({ children, style }) {
  return <Text style={[estilos.texto, style]}>{children}</Text>;
}

const estilos = StyleSheet.create({
  texto: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colores.textoSuave,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
});
