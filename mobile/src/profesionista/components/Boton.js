import { Pressable, StyleSheet, Text } from 'react-native';
import { colores, radios } from '../theme';

const VARIANTES = {
  primario: { fondo: colores.primario, texto: '#FFFFFF' },
  contorno: { fondo: '#FFFFFF', texto: colores.marino, borde: colores.bordeFuerte },
};

export default function Boton({ titulo, onPress, variante = 'primario', deshabilitado, style }) {
  const v = VARIANTES[variante] || VARIANTES.primario;
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      accessibilityRole="button"
      style={({ pressed }) => [
        estilos.base,
        { backgroundColor: v.fondo },
        v.borde && { borderWidth: 1, borderColor: v.borde },
        pressed && { opacity: 0.85 },
        deshabilitado && { opacity: 0.5 },
        style,
      ]}
    >
      <Text style={[estilos.texto, { color: v.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    borderRadius: radios.campo,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
});
