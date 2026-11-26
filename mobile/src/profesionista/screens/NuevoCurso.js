// Nuevo curso · se publica tras la aprobación administrativa
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Campo from '../components/Campo';
import Boton from '../components/Boton';
import { colores, radios } from '../theme';
import { aNumero, formatearMXN } from '../utils';

const FORMULARIO_VACIO = {
  titulo: '',
  modalidad: 'presencial', // 'presencial' | 'enlinea'
  zonaHorario: '',
  fechaInicio: '',
  enlace: '',
  cupo: '',
  precio: '',
  descripcion: '',
};

// Devuelve el mensaje del primer problema, o null si todo está bien.
export function validarCurso(f) {
  if (!f.titulo.trim()) return 'Escribe el título del curso.';
  if (!f.zonaHorario.trim()) return 'Escribe la zona y el horario.';
  if (!f.fechaInicio.trim()) return 'Escribe la fecha de inicio.';
  if (f.modalidad === 'enlinea' && !f.enlace.trim()) return 'Agrega el enlace externo de la sesión en línea.';
  const cupo = aNumero(f.cupo);
  if (!Number.isInteger(cupo) || cupo <= 0) return 'El cupo debe ser un número entero mayor a cero.';
  if (f.precio.trim() === '' || aNumero(f.precio) < 0) return 'Escribe el precio de prueba.';
  return null;
}

export default function NuevoCurso({ onMenu, onGuardarBorrador, onEnviar }) {
  const [form, setForm] = useState(FORMULARIO_VACIO);
  const poner = (campo) => (valor) => setForm((previo) => ({ ...previo, [campo]: valor }));
  const enLinea = form.modalidad === 'enlinea';

  const guardarBorrador = () => {
    if (!form.titulo.trim()) {
      Alert.alert('Falta el título', 'Escribe al menos el título para guardar el borrador.');
      return;
    }
    // TODO: guardar el borrador en la base de datos.
    if (onGuardarBorrador) onGuardarBorrador(form);
    Alert.alert('Borrador guardado', 'Puedes terminarlo después.');
  };

  const enviar = () => {
    const problema = validarCurso(form);
    if (problema) {
      Alert.alert('Revisa el formulario', problema);
      return;
    }
    // TODO: enviar el curso a revisión administrativa.
    if (onEnviar) onEnviar({ ...form, cupo: aNumero(form.cupo), precio: aNumero(form.precio) });
    Alert.alert('Curso enviado a revisión', 'Se publicará cuando administración lo apruebe.');
    setForm(FORMULARIO_VACIO);
  };

  return (
    <Pantalla titulo="Nuevo curso" subtitulo="Se publica tras la aprobación administrativa." onMenu={onMenu}>
      <Campo
        etiqueta="Título"
        value={form.titulo}
        onChangeText={poner('titulo')}
        placeholder="Reparación y mantenimiento de boilers"
      />

      <View style={estilos.modalidades}>
        {[
          { clave: 'presencial', texto: 'Presencial' },
          { clave: 'enlinea', texto: 'En línea en vivo' },
        ].map((m) => (
          <Pressable
            key={m.clave}
            onPress={() => poner('modalidad')(m.clave)}
            style={[estilos.modalidad, form.modalidad === m.clave && estilos.modalidadActiva]}
            accessibilityRole="button"
          >
            <Text style={[estilos.modalidadTexto, form.modalidad === m.clave && estilos.modalidadTextoActivo]}>
              {m.texto}
            </Text>
          </Pressable>
        ))}
      </View>

      <Campo
        etiqueta="Zona y horario"
        value={form.zonaHorario}
        onChangeText={poner('zonaHorario')}
        placeholder="Centro de capacitación · Col. Centro · 10:00"
      />
      <Campo
        etiqueta="Fecha de inicio"
        value={form.fechaInicio}
        onChangeText={poner('fechaInicio')}
        placeholder="12 dic 2026"
      />
      <Campo
        etiqueta="Enlace externo (solo en línea)"
        value={form.enlace}
        onChangeText={poner('enlace')}
        placeholder="meet.google.com/…"
        deshabilitado={!enLinea}
        autoCapitalize="none"
        keyboardType="url"
      />

      <View style={estilos.fila}>
        <Campo
          etiqueta="Cupo"
          value={form.cupo}
          onChangeText={(t) => poner('cupo')(t.replace(/\D/g, ''))}
          placeholder="12"
          keyboardType="number-pad"
          style={{ flex: 1 }}
        />
        <Campo
          etiqueta="Precio de prueba"
          value={form.precio}
          onChangeText={poner('precio')}
          onEndEditing={() => form.precio.trim() !== '' && poner('precio')(formatearMXN(aNumero(form.precio)))}
          placeholder="$850.00"
          keyboardType="decimal-pad"
          style={{ flex: 1 }}
        />
      </View>

      <Campo
        etiqueta="Descripción"
        value={form.descripcion}
        onChangeText={poner('descripcion')}
        placeholder="3 módulos: diagnóstico, reparación y práctica"
        multilinea
      />

      <View style={{ gap: 10, marginTop: 4 }}>
        <Boton titulo="Guardar borrador" variante="contorno" onPress={guardarBorrador} />
        <Boton titulo="Enviar a revisión" onPress={enviar} />
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  modalidades: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  modalidad: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radios.pill,
    borderWidth: 1,
    borderColor: colores.bordeFuerte,
    backgroundColor: '#FFFFFF',
  },
  modalidadActiva: { backgroundColor: colores.primarioSuave, borderColor: '#B9D0D5' },
  modalidadTexto: { fontSize: 12, fontWeight: '600', color: colores.textoSuave },
  modalidadTextoActivo: { color: colores.marino, fontWeight: '800' },
  fila: { flexDirection: 'row', gap: 12 },
});
