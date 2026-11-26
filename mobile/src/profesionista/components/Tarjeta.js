import { StyleSheet, View } from 'react-native';
import { colores, radios } from '../theme';

// "resaltada" pinta el borde en teal (como la tarjeta seleccionada del mockup).
export default function Tarjeta({ children, style, resaltada, tono }) {
  return (
    <View
      style={[
        estilos.tarjeta,
        resaltada && { borderColor: colores.primario, borderWidth: 1.5 },
        tono === 'primario' && { backgroundColor: colores.primarioSuave, borderColor: '#B9D0D5' },
        tono === 'aviso' && { backgroundColor: colores.avisoFondo, borderColor: colores.avisoBorde },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radios.tarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 14,
    marginBottom: 12,
  },
});
