import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colores, radios } from '../theme';

// Campo de texto con etiqueta en mayúsculas encima, como en los formularios del mockup.
export default function Campo({ etiqueta, style, estiloEntrada, multilinea, deshabilitado, ...resto }) {
  return (
    <View style={[estilos.contenedor, style]}>
      {!!etiqueta && <Text style={estilos.etiqueta}>{etiqueta}</Text>}
      <TextInput
        style={[
          estilos.entrada,
          multilinea && estilos.multilinea,
          deshabilitado && estilos.deshabilitado,
          estiloEntrada,
        ]}
        placeholderTextColor={colores.textoTenue}
        editable={!deshabilitado}
        multiline={multilinea}
        textAlignVertical={multilinea ? 'top' : 'center'}
        accessibilityLabel={resto.accessibilityLabel || etiqueta}
        {...resto}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { marginBottom: 14 },
  etiqueta: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colores.textoSuave,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  entrada: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colores.bordeFuerte,
    borderRadius: radios.campo,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14.5,
    color: colores.texto,
  },
  multilinea: { minHeight: 90 },
  deshabilitado: { backgroundColor: '#F1F4F5', color: colores.textoTenue },
});
