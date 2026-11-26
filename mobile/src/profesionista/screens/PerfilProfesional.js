// Perfil profesional · "Perfil y rango" y "Perfil con sanción" comparten esta pantalla.
// Si el profesionista tiene strikes (o su rango mostrado es menor al real) se muestra la versión con sanción.
import { StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Etiqueta from '../components/Etiqueta';
import Fila from '../components/Fila';
import Insignia from '../components/Insignia';
import Boton from '../components/Boton';
import { colores } from '../theme';

// Datos de ejemplo (después se reemplazan por los de la base de datos)
export const PERFIL_NORMAL = {
  nombre: 'Laura Cota',
  especialidad: 'Plomería',
  zona: 'Col. Jalisco · SLRC',
  rangoReal: 'Plata',
  rangoMostrado: 'Plata',
  calificacion: 4.9,
  serviciosCompletados: 18,
  serviciosParaSiguiente: 20,
  siguienteRango: 'Oro',
  strikes: 0,
  strikesMaximo: 3,
  suspension: null,
  recuperar: null,
  verificacion: 'Aprobada',
  historial: [],
};

export const PERFIL_CON_SANCION = {
  ...PERFIL_NORMAL,
  rangoMostrado: 'Bronce',
  strikes: 2,
  suspension: '48 h',
  recuperar: { hechos: 0, necesarios: 10 },
  historial: [
    { id: 1, titulo: 'Strike 1 · 02 sep 2026', resultado: 'Advertencia' },
    { id: 2, titulo: 'Strike 2 · 23 nov 2026', resultado: 'Suspensión y rango' },
  ],
};

function PerfilBase({ onMenu, perfil, onCerrarSesion }) {
  const sancionado = perfil.strikes > 0 || perfil.rangoMostrado !== perfil.rangoReal;

  return (
    <Pantalla
      titulo="Perfil profesional"
      onMenu={onMenu}
      pie={
        !sancionado && (
          <Boton titulo="Cerrar sesión" variante="contorno" onPress={() => onCerrarSesion && onCerrarSesion()} />
        )
      }
    >
      <Tarjeta>
        <View style={estilos.filaEntre}>
          <Text style={estilos.nombre}>{perfil.nombre}</Text>
          {sancionado ? (
            <Insignia texto={`Rango mostrado: ${perfil.rangoMostrado}`} tono="aviso" />
          ) : (
            <Insignia texto={perfil.rangoReal} />
          )}
        </View>
        <Text style={estilos.secundario}>
          {sancionado
            ? `Un nivel inferior al que corresponde por servicios (${perfil.rangoReal}).`
            : `${perfil.especialidad} · ${perfil.zona}`}
        </Text>

        <View style={estilos.datos}>
          {sancionado ? (
            <>
              <Fila etiqueta="Strikes" valor={`${perfil.strikes} de ${perfil.strikesMaximo}`} />
              {!!perfil.suspension && <Fila etiqueta="Suspensión temporal" valor={perfil.suspension} />}
              {!!perfil.recuperar && (
                <Fila
                  etiqueta="Para recuperar el rango"
                  valor={`${perfil.recuperar.hechos} de ${perfil.recuperar.necesarios} servicios`}
                />
              )}
            </>
          ) : (
            <>
              <Fila etiqueta="Calificación" valor={String(perfil.calificacion)} />
              <Fila
                etiqueta="Servicios completados"
                valor={`${perfil.serviciosCompletados} de ${perfil.serviciosParaSiguiente} para ${perfil.siguienteRango}`}
              />
              <Fila etiqueta="Strikes" valor={String(perfil.strikes)} />
            </>
          )}
        </View>
      </Tarjeta>

      {sancionado ? (
        <Tarjeta>
          <Etiqueta>Historial</Etiqueta>
          {perfil.historial.map((h) => (
            <Fila key={h.id} etiqueta={h.titulo} valor={h.resultado} />
          ))}
          <Text style={[estilos.secundario, { marginTop: 8 }]}>
            Un strike deja de contar tras 6 meses sin nuevas faltas, pero permanece en el historial.
          </Text>
        </Tarjeta>
      ) : (
        <Tarjeta>
          <Fila etiqueta="Verificación" valor={<Insignia texto={perfil.verificacion} />} />
        </Tarjeta>
      )}
    </Pantalla>
  );
}

export function PerfilProfesional(props) {
  return <PerfilBase perfil={PERFIL_NORMAL} {...props} />;
}

export function PerfilConSancion(props) {
  return <PerfilBase perfil={PERFIL_CON_SANCION} {...props} />;
}

export default PerfilBase;

const estilos = StyleSheet.create({
  filaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  nombre: { flex: 1, fontSize: 17, fontWeight: '800', color: colores.texto },
  secundario: { fontSize: 13, color: colores.textoSuave, lineHeight: 19, marginTop: 6 },
  datos: { borderTopWidth: 1, borderTopColor: colores.borde, marginTop: 10, paddingTop: 6 },
});
