// Mis cursos (profesionista) · cursos publicados y pendientes de revisión
import { StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Etiqueta from '../components/Etiqueta';
import Fila from '../components/Fila';
import Insignia from '../components/Insignia';
import Boton from '../components/Boton';
import { colores } from '../theme';

// Datos de ejemplo (después se reemplazan por los de la base de datos)
const CURSOS = [
  {
    id: 1,
    titulo: 'Reparación y mantenimiento de boilers',
    estado: 'Publicado',
    ocupados: 8,
    cupo: 12,
    inscritos: [
      { id: 1, nombre: 'Sofía Luna', pago: 'Pagado' },
      { id: 2, nombre: 'Raúl Soto', pago: 'Pagado' },
      { id: 3, nombre: 'Carlos Medina', pago: 'Pagado' },
    ],
  },
  { id: 2, titulo: 'Instalación eléctrica básica', estado: 'Pendiente de revisión', ocupados: 0, cupo: 10, inscritos: [] },
];

export default function MisCursos({ onMenu, cursos = CURSOS, onNuevoCurso }) {
  return (
    <Pantalla
      titulo="Mis cursos"
      onMenu={onMenu}
      pie={<Boton titulo="Nuevo curso" onPress={() => onNuevoCurso && onNuevoCurso()} />}
    >
      {cursos.map((curso) => {
        const publicado = curso.estado === 'Publicado';
        return (
          <Tarjeta key={curso.id}>
            <View style={estilos.filaEntre}>
              <Text style={estilos.titulo}>{curso.titulo}</Text>
              {!publicado && <Insignia texto={curso.estado} tono="aviso" />}
            </View>

            {publicado && (
              <>
                <View style={[estilos.filaEntre, { marginTop: 8 }]}>
                  <Insignia texto={curso.estado} />
                  <Text style={estilos.cupo}>
                    Cupo {curso.ocupados} de {curso.cupo}
                  </Text>
                </View>
                {curso.inscritos.length > 0 && (
                  <View style={estilos.inscritos}>
                    <Etiqueta>Inscritos</Etiqueta>
                    {curso.inscritos.map((i) => (
                      <Fila key={i.id} etiqueta={i.nombre} valor={i.pago} />
                    ))}
                  </View>
                )}
              </>
            )}
          </Tarjeta>
        );
      })}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  filaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  titulo: { flex: 1, fontSize: 15, fontWeight: '800', color: colores.texto },
  cupo: { fontSize: 13, color: colores.textoSuave },
  inscritos: { marginTop: 12 },
});
