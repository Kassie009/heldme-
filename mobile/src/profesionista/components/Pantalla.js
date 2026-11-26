import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Encabezado from './Encabezado';
import { colores } from '../theme';

// Estructura común: menú + logo, título grande, subtítulo, contenido que se desplaza
// y (opcional) botones fijos abajo en "pie".
// No agrega margen superior: se asume que la app ya está dentro de un área segura.
export default function Pantalla({ titulo, subtitulo, onMenu, children, pie }) {
  return (
    <KeyboardAvoidingView
      style={estilos.raiz}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Encabezado onMenu={onMenu} />
      <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
        {!!titulo && <Text style={estilos.titulo}>{titulo}</Text>}
        {!!subtitulo && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
        <View style={{ marginTop: titulo ? 14 : 0 }}>{children}</View>
      </ScrollView>
      {pie && <View style={estilos.pie}>{pie}</View>}
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingHorizontal: 18, paddingBottom: 20 },
  titulo: { fontSize: 25, fontWeight: '800', color: colores.marino },
  subtitulo: { fontSize: 13, color: colores.textoSuave, marginTop: 6, lineHeight: 19 },
  pie: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 18, gap: 10 },
});
