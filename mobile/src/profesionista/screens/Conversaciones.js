// Chat · lista de conversaciones (cada una vinculada a una solicitud, cotización o contratación)
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Insignia from '../components/Insignia';
import { colores } from '../theme';

// Datos de ejemplo (después se reemplazan por los de la base de datos)
const CONVERSACIONES = [
  { id: 1, nombre: 'Aaron Félix', vinculo: 'Contratación · HM-2044', ultimo: 'Confirmo la visita para hoy a las cuatro.' },
  { id: 2, nombre: 'Sofía Luna', vinculo: 'Cotización', ultimo: 'Gracias, la reviso hoy.' },
];

export default function Conversaciones({ onMenu, conversaciones = CONVERSACIONES, onAbrirChat }) {
  return (
    <Pantalla
      titulo="Chat"
      subtitulo="Cada conversación está vinculada a una solicitud, cotización o contratación."
      onMenu={onMenu}
    >
      {conversaciones.map((c) => (
        <Pressable
          key={c.id}
          onPress={() => onAbrirChat && onAbrirChat(c)}
          accessibilityRole="button"
          accessibilityLabel={`Abrir chat con ${c.nombre}`}
        >
          <Tarjeta>
            <View style={estilos.filaEntre}>
              <Text style={estilos.nombre}>{c.nombre}</Text>
              <Insignia texto={c.vinculo} />
            </View>
            <Text style={estilos.ultimo} numberOfLines={1}>
              {c.ultimo}
            </Text>
          </Tarjeta>
        </Pressable>
      ))}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  filaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  nombre: { fontSize: 15, fontWeight: '800', color: colores.texto },
  ultimo: { fontSize: 13, color: colores.textoSuave, marginTop: 8 },
});
