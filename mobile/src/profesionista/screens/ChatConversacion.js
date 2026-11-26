// Chat · conversación (ejemplo: contratación HM-2044)
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Encabezado from '../components/Encabezado';
import Insignia from '../components/Insignia';
import { colores, radios } from '../theme';
import { formatearMXN } from '../utils';

// Datos de ejemplo (después se reemplazan por los de la base de datos)
const CONVERSACION = { nombre: 'Aaron Félix', referencia: 'HM-2044 · Reparación de fuga', estado: 'Contratado' };
const MENSAJES = [
  { id: 1, de: 'otro', texto: 'Confirmo la visita para hoy a las cuatro.' },
  { id: 2, de: 'yo', texto: 'De acuerdo, llego a esa hora.' },
  { id: 3, de: 'yo', cotizacion: { etiqueta: 'Cotización v1 · Aceptada', total: 1700 } },
];

export default function ChatConversacion({
  onMenu,
  conversacion = CONVERSACION,
  mensajesIniciales = MENSAJES,
  onEnviarMensaje,
}) {
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [texto, setTexto] = useState('');
  const lista = useRef(null);

  const enviar = () => {
    const limpio = texto.trim();
    if (!limpio) return;
    const nuevo = { id: Date.now(), de: 'yo', texto: limpio };
    // TODO: guardar el mensaje en la base de datos (tiempo real).
    setMensajes((previos) => [...previos, nuevo]);
    setTexto('');
    if (onEnviarMensaje) onEnviarMensaje(nuevo);
  };

  return (
    <KeyboardAvoidingView style={estilos.raiz} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Encabezado onMenu={onMenu} />

      <View style={estilos.cabecera}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.nombre}>{conversacion.nombre}</Text>
          <Text style={estilos.referencia}>{conversacion.referencia}</Text>
        </View>
        <Insignia texto={conversacion.estado} />
      </View>

      <ScrollView
        ref={lista}
        contentContainerStyle={estilos.mensajes}
        onContentSizeChange={() => lista.current && lista.current.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {mensajes.map((m) =>
          m.cotizacion ? (
            <View key={m.id} style={[estilos.tarjetaCotizacion, estilos.derecha]}>
              <Text style={estilos.cotizacionEtiqueta}>{m.cotizacion.etiqueta}</Text>
              <View style={estilos.cotizacionFila}>
                <Text style={estilos.cotizacionTexto}>Total</Text>
                <Text style={[estilos.cotizacionTexto, { fontWeight: '800' }]}>
                  {formatearMXN(m.cotizacion.total)}
                </Text>
              </View>
            </View>
          ) : (
            <View key={m.id} style={[estilos.burbuja, m.de === 'yo' ? estilos.mia : estilos.suya]}>
              <Text style={[estilos.texto, m.de === 'yo' && { color: '#FFFFFF' }]}>{m.texto}</Text>
            </View>
          )
        )}
      </ScrollView>

      <View style={estilos.barra}>
        <TextInput
          style={estilos.entrada}
          value={texto}
          onChangeText={setTexto}
          placeholder="Escribe un mensaje"
          placeholderTextColor={colores.textoTenue}
          onSubmitEditing={enviar}
          returnKeyType="send"
          accessibilityLabel="Mensaje"
        />
        <Pressable style={estilos.enviar} onPress={enviar} accessibilityRole="button">
          <Text style={estilos.enviarTexto}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: colores.fondo },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
    gap: 8,
  },
  nombre: { fontSize: 18, fontWeight: '800', color: colores.texto },
  referencia: { fontSize: 12.5, color: colores.textoSuave, marginTop: 2 },
  mensajes: { padding: 18, gap: 12, flexGrow: 1 },
  burbuja: { maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 11, borderRadius: radios.tarjeta },
  suya: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colores.borde },
  mia: { alignSelf: 'flex-end', backgroundColor: colores.primario },
  texto: { fontSize: 14, color: colores.texto },
  derecha: { alignSelf: 'flex-end' },
  tarjetaCotizacion: {
    width: '78%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.tarjeta,
    padding: 12,
  },
  cotizacionEtiqueta: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colores.textoSuave,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  cotizacionFila: { flexDirection: 'row', justifyContent: 'space-between' },
  cotizacionTexto: { fontSize: 14, color: colores.texto },
  barra: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 18 },
  entrada: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colores.bordeFuerte,
    borderRadius: radios.campo,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    color: colores.texto,
  },
  enviar: {
    backgroundColor: colores.primario,
    borderRadius: radios.campo,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enviarTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
