import { StyleSheet, Text, View } from 'react-native';
import { colores, radios } from '../theme';

const TONOS = {
  neutro: { fondo: '#F1F4F5', borde: colores.borde, texto: colores.textoSuave },
  primario: { fondo: colores.primarioSuave, borde: '#B9D0D5', texto: colores.marino },
  aviso: { fondo: colores.avisoFondo, borde: colores.avisoBorde, texto: colores.avisoTexto },
  exito: { fondo: colores.exitoFondo, borde: '#BFDCCB', texto: colores.exito },
};

// Etiqueta pequeña con esquinas poco redondeadas ("Aceptada", "Enviada", "Contratado"...)
export default function Insignia({ texto, tono = 'primario', style }) {
  const t = TONOS[tono] || TONOS.primario;
  return (
    <View style={[estilos.caja, { backgroundColor: t.fondo, borderColor: t.borde }, style]}>
      <Text style={[estilos.texto, { color: t.texto }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radios.pill,
    borderWidth: 1,
  },
  texto: { fontSize: 10.5, fontWeight: '700' },
});
