import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colores } from '../theme';

// Barra superior del mockup: botón de menú a la izquierda y logo al centro.
// Si se recibe onBack, se muestra también la flecha de regreso.
export default function Encabezado({ onMenu, onBack }) {
  return (
    <View style={estilos.fila}>
      <View style={estilos.izquierda}>
        {!!onBack && (
          <Pressable onPress={onBack} hitSlop={10} style={estilos.lado} accessibilityLabel="Regresar">
            <Feather name="arrow-left" size={22} color={colores.marino} />
          </Pressable>
        )}
        <Pressable onPress={onMenu} hitSlop={10} style={estilos.lado} accessibilityLabel="Abrir menú">
          <Feather name="menu" size={22} color={colores.marino} />
        </Pressable>
      </View>
      <Image source={require('../../../assets/logo-escudo.png')} style={estilos.logo} resizeMode="contain" />
      <View style={estilos.lado} />
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 6,
  },
  izquierda: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lado: { width: 40, height: 36, justifyContent: 'center' },
  logo: { width: 30, height: 34 },
});
