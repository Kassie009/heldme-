/**
 * HeldMe! — Calendario y disponibilidad (profesionista)
 * Mockup: App Móvil 9 de 12 · Agenda y reservas · Disponibilidad por día ·
 * Reserva ya tomada (RF-18).
 * Demo funcional de RF-18: no se confirma una segunda reserva en el mismo horario.
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, radius, spacing, F } from '../theme';
import { TopBar, Card, Badge, PrimaryButton, SecondaryButton, TextLink } from '../ui';

const DIAS = [
  { letra: 'L', num: 23, activo: true, horario: '09:00 – 17:00' },
  { letra: 'M', num: 24, activo: true, horario: '09:00 – 17:00' },
  { letra: 'M', num: 25, activo: true, horario: '09:00 – 17:00' },
  { letra: 'J', num: 26, activo: true, horario: '09:00 – 17:00' },
  { letra: 'V', num: 27, activo: true, horario: '09:00 – 14:00' },
  { letra: 'S', num: 28, activo: false, horario: 'Sin disponibilidad' },
  { letra: 'D', num: 29, activo: false, horario: 'Sin disponibilidad' },
];

// Agenda del jueves 26: reservas vinculadas a contrataciones
const agendaInicial = [
  { hora: '09:00', libre: true },
  { hora: '11:00', titulo: 'Cambio de tubería de cocina', folio: 'HM-2047', cliente: 'Sofía Luna', libre: false },
  { hora: '16:00', titulo: 'Revisión de fuga', folio: 'HM-2044', cliente: 'Aaron Félix · Col. Centro', libre: false },
];

// Horarios que se ofrecen para confirmar la cita de Sofía Luna
const horariosOfrecidos = ['09:00', '10:00', '12:00', '16:00'];

export default function CalendarioPro({ nav }) {
  const [vista, setVista] = useState('agenda'); // agenda | disponibilidad | confirmar
  const [dias, setDias] = useState(DIAS);
  const [agenda, setAgenda] = useState(agendaInicial);
  const [diaSel, setDiaSel] = useState(3); // Jueves 26
  const [horarioElegido, setHorarioElegido] = useState('16:00');
  const [confirmada, setConfirmada] = useState(null);
  const [errorHorario, setErrorHorario] = useState(true); // demo: 16:00 ya está reservado

  const diaActual = dias[diaSel];

  const cambiarDia = (i) => {
    setDiaSel(i);
    setConfirmada(null);
    setErrorHorario(false);
  };

  const proponer = () => {
    if (horarioElegido === '16:00') {
      setErrorHorario(true); // RF-18: horario ya reservado para HM-2044
      return;
    }
    setErrorHorario(false);
    setConfirmada(horarioElegido);
    setAgenda((a) =>
      a.map((s) => (s.libre && s.hora === horarioElegido
        ? { hora: horarioElegido, titulo: 'Cambio de tubería de cocina', folio: 'HM-2047', cliente: 'Sofía Luna', libre: false }
        : s)))
  };

  // ===== Vista: Confirmar cita (reserva ya tomada, RF-18) =====
  if (vista === 'confirmar') {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <TopBar onBack={() => setVista('agenda')} />
          <Text style={styles.titulo}>Confirmar cita</Text>
          <Text style={styles.sub} numberOfLines={1}>Cambio de tubería de cocina · Sofía Luna</Text>

          {errorHorario && (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitulo}>Horario no disponible</Text>
              <Text style={styles.errorTexto}>
                Jueves 26 nov · 16:00 ya está reservado para HM-2044 · Aaron Félix.
                No se puede confirmar una segunda reserva en el mismo horario.
              </Text>
            </View>
          )}

          {confirmada ? (
            <View style={styles.okCard}>
              <Text style={styles.okTitulo}>Reserva confirmada</Text>
              <Text style={styles.errorTexto}>
                Jueves 26 nov · {confirmada} para HM-2047 · Sofía Luna.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.kicker}>ELIGE OTRO HORARIO · JUEVES 26 NOV</Text>
              <View style={styles.chipsHorario}>
                {horariosOfrecidos.map((h) => {
                  const tomado = h === '16:00';
                  return (
                    <Pressable
                      key={h}
                      onPress={() => !tomado && (setHorarioElegido(h), setErrorHorario(false))}
                      disabled={tomado}
                      style={[
                        styles.chipHorario,
                        horarioElegido === h && !tomado && styles.chipHorarioActivo,
                        tomado && styles.chipHorarioTomado,
                      ]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: horarioElegido === h, disabled: tomado }}
                    >
                      <Text style={[styles.chipTexto, tomado && styles.chipTextoTomado]}>
                        {tomado ? '16:00 Reservado' : h}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {confirmada && (
            <SecondaryButton label="Volver a la agenda" onPress={() => { setVista('agenda'); setConfirmada(null); }} style={{ marginTop: spacing.lg }} />
          )}
          {!confirmada && (
            <>
              <SecondaryButton label="Volver" onPress={() => setVista('agenda')} style={{ marginTop: spacing.lg }} />
              <PrimaryButton label="Proponer este horario" onPress={proponer} style={{ marginTop: spacing.md }} />
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // ===== Vista: Disponibilidad por día =====
  if (vista === 'disponibilidad') {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <TopBar onBack={() => setVista('agenda')} />
          <Text style={styles.titulo}>Disponibilidad</Text>
          <Text style={styles.sub}>Horarios en los que aceptas servicios</Text>

          <Card style={styles.card}>
            {dias.map((d, i) => (
              <View key={d.num} style={[styles.diaFila, i > 0 && styles.divisor]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.diaNombre}>{d.letra === 'M' ? (i === 1 ? 'Martes' : 'Miércoles') : DIAS_NOMBRE[i]}</Text>
                  <Text style={styles.diaHorario}>{d.activo ? d.horario : 'Sin disponibilidad'}</Text>
                </View>
                <Pressable
                  onPress={() => setDias((prev) => prev.map((x, xi) => (xi === i ? { ...x, activo: !x.activo } : x)))}
                  accessibilityRole="switch"
                  accessibilityState={{ checked: d.activo }}
                  style={[styles.toggle, d.activo && styles.toggleActivo]}
                >
                  <View style={[styles.togglePunto, d.activo && styles.togglePuntoActivo]} />
                </Pressable>
              </View>
            ))}
          </Card>

          <Text style={styles.nota}>
            Los horarios con una reserva confirmada no se vuelven a ofrecer.
          </Text>

          <PrimaryButton label="Guardar disponibilidad" onPress={() => setVista('agenda')} style={{ marginTop: spacing.lg }} />
        </ScrollView>
      </View>
    );
  }

  // ===== Vista principal: Agenda y reservas =====
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <TopBar onMenu={nav.openMenu} />
        <Text style={styles.titulo}>Calendario</Text>
        <Text style={styles.sub} numberOfLines={1}>
          Jueves 26 nov 2026 · Disponible 09:00–17:00
        </Text>

        <View style={styles.dias}>
          {dias.map((d, i) => (
            <Pressable
              key={d.num}
              onPress={() => cambiarDia(i)}
              style={[styles.dia, i === diaSel && styles.diaActivo]}
              accessibilityRole="radio"
              accessibilityState={{ selected: i === diaSel }}
            >
              <Text style={[styles.diaLetra, i === diaSel && { color: colors.white }]}>{d.letra}</Text>
              <Text style={[styles.diaNum, i === diaSel && { color: colors.white, fontWeight: '800', fontFamily: F.extra }]}>{d.num}</Text>
              {i === diaSel && <View style={styles.puntoDia} />}
            </Pressable>
          ))}
        </View>

        {agenda.map((s) =>
          s.libre ? (
            <Pressable key={s.hora} onPress={() => { setVista('confirmar'); setErrorHorario(false); setConfirmada(null); }}>
              <View style={[styles.slot, styles.slotLibre]}>
                <Text style={styles.slotHora}>{s.hora}</Text>
                <Text style={styles.slotLibreTexto}>Libre</Text>
              </View>
            </Pressable>
          ) : (
            <Card key={s.hora} style={styles.slotOcupado}>
              <View style={styles.ocupadoRow}>
                <Text style={styles.slotHora}>{s.hora}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.slotTitulo} numberOfLines={1}>{s.titulo}</Text>
                  <Text style={styles.slotMeta} numberOfLines={1}>{s.folio} · {s.cliente}</Text>
                </View>
              </View>
            </Card>
          )
        )}

        <Text style={styles.nota}>
          Cada reserva está vinculada a una contratación. No se confirman dos
          reservas en el mismo horario.
        </Text>

        <PrimaryButton label="Editar disponibilidad" onPress={() => setVista('disponibilidad')} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </View>
  );
}

const DIAS_NOMBRE = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 24, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  sub: { color: colors.textSec, fontSize: 13, marginTop: 4, marginBottom: spacing.md },
  dias: { flexDirection: 'row', gap: 8, marginBottom: spacing.lg },
  dia: {
    flex: 1,
    aspectRatio: 0.95,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaActivo: { backgroundColor: colors.teal, borderColor: colors.teal },
  diaLetra: { fontSize: 11, color: colors.textSec, fontWeight: '700', fontFamily: F.bold },
  diaNum: { fontSize: 15, color: colors.navy, fontWeight: '700', fontFamily: F.bold, marginTop: 2 },
  puntoDia: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.white, marginTop: 3 },
  slot: { borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  slotLibre: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  slotLibreTexto: { color: colors.textSec, fontSize: 14, fontWeight: '500', fontFamily: F.med },
  slotHora: { fontSize: 16, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  slotOcupado: { padding: 16 },
  ocupadoRow: { flexDirection: 'row', alignItems: 'center' },
  slotTitulo: { fontSize: 15, fontWeight: '800', fontFamily: F.extra, color: colors.navy },
  slotMeta: { color: colors.textSec, fontSize: 12.5, marginTop: 2 },
  nota: { color: colors.textSec, fontSize: 12.5, lineHeight: 18, marginTop: spacing.sm },
  card: { marginBottom: spacing.sm },
  diaFila: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  divisor: { borderTopWidth: 1, borderTopColor: colors.border },
  diaNombre: { fontSize: 14, fontWeight: '700', fontFamily: F.bold, color: colors.navy },
  diaHorario: { fontSize: 12.5, color: colors.textSec, marginTop: 2 },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    padding: 3,
    justifyContent: 'flex-start',
  },
  toggleActivo: { backgroundColor: colors.teal, justifyContent: 'flex-end' },
  togglePunto: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.white },
  togglePuntoActivo: { backgroundColor: colors.white },
  errorCard: {
    backgroundColor: '#F8E3DF',
    borderColor: '#D89A8E',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: spacing.md,
  },
  errorTitulo: { color: colors.error, fontSize: 16, fontWeight: '800', fontFamily: F.extra },
  errorTexto: { color: colors.navy, fontSize: 13, lineHeight: 19, marginTop: 6 },
  okCard: {
    backgroundColor: colors.mint,
    borderColor: colors.teal,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: spacing.md,
  },
  okTitulo: { color: colors.teal, fontSize: 16, fontWeight: '800', fontFamily: F.extra },
  kicker: { fontSize: 10.5, fontWeight: '700', fontFamily: F.bold, color: colors.textSec, letterSpacing: 0.8, marginTop: spacing.md },
  chipsHorario: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  chipHorario: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipHorarioActivo: { backgroundColor: colors.mint, borderColor: colors.teal },
  chipHorarioTomado: { backgroundColor: colors.panel, borderColor: colors.border },
  chipTexto: { fontSize: 13, fontWeight: '600', fontFamily: F.semi, color: colors.navy },
  chipTextoTomado: { color: colors.textSec, textDecorationLine: 'line-through' },
});
