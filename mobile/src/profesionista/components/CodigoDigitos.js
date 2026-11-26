import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colores } from '../theme';

// Muestra un código de 4 dígitos como "4 8 2 _". Al tocarlo se abre el teclado numérico.
// Un TextInput invisible recibe lo que se escribe.
export default function CodigoDigitos({ valor, onCambiar, longitud = 4, deshabilitado, etiquetaAccesible }) {
  const entrada = useRef(null);
  const casillas = Array.from({ length: longitud }, (_, i) => valor[i] || '_');

  return (
    <Pressable
      onPress={() => entrada.current && entrada.current.focus()}
      disabled={deshabilitado}
      style={estilos.contenedor}
    >
      <View style={estilos.fila}>
        {casillas.map((c, i) => (
          <Text key={i} style={[estilos.digito, deshabilitado && { opacity: 0.45 }]}>
            {c}
          </Text>
        ))}
      </View>
      <TextInput
        ref={entrada}
        value={valor}
        onChangeText={(t) => onCambiar(t.replace(/\D/g, '').slice(0, longitud))}
        keyboardType="number-pad"
        maxLength={longitud}
        editable={!deshabilitado}
        caretHidden
        style={estilos.oculto}
        accessibilityLabel={etiquetaAccesible || 'Código'}
      />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  contenedor: { alignItems: 'center', paddingVertical: 6 },
  fila: { flexDirection: 'row', gap: 22 },
  digito: { fontSize: 36, fontWeight: '800', color: colores.primario },
  oculto: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0.02 },
});
