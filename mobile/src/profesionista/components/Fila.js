import { StyleSheet, Text, View } from 'react-native';
import { colores } from '../theme';

// Renglón "etiqueta ........ valor". "valor" puede ser texto o un elemento (por ejemplo una insignia).
export default function Fila({ etiqueta, valor, fuerte, linea, style }) {
  return (
    <View style={[estilos.fila, linea && estilos.linea, style]}>
      <Text style={[estilos.etiqueta, fuerte && estilos.fuerte]}>{etiqueta}</Text>
      {typeof valor === 'string' || typeof valor === 'number' ? (
        <Text style={[estilos.valor, fuerte && estilos.fuerte]}>{valor}</Text>
      ) : (
        valor
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    gap: 12,
  },
  linea: { borderTopWidth: 1, borderTopColor: colores.borde, marginTop: 6, paddingTop: 10 },
  etiqueta: { flex: 1, fontSize: 14, color: colores.texto },
  valor: { fontSize: 14, color: colores.texto, textAlign: 'right' },
  fuerte: { fontWeight: '800' },
});
