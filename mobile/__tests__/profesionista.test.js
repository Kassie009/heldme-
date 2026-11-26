import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  CancelarContratacion,
  ChatConversacion,
  Conversaciones,
  CursosAutorizacion,
  DesglosePago,
  FinalizarServicio,
  IniciarServicio,
  MisCotizaciones,
  MisCursos,
  NuevoCurso,
  PerfilConSancion,
  PerfilProfesional,
  SolicitarRevision,
} from '../src/profesionista/screens';
import { validarCurso } from '../src/profesionista/screens/NuevoCurso';
import { formatearFechaHora, formatearMXN, aNumero } from '../src/profesionista/utils';

// Alert.alert se simula: cuando tiene botones, "presiona" el último (la acción principal)
beforeEach(() => {
  jest.spyOn(Alert, 'alert').mockImplementation((titulo, mensaje, botones) => {
    if (botones && botones.length) {
      const principal = botones[botones.length - 1];
      if (principal.onPress) principal.onPress();
    }
  });
});

test('utilidades de formato', () => {
  expect(formatearMXN(1700, 0)).toBe('$1,700');
  expect(formatearMXN(1000)).toBe('$1,000.00');
  expect(aNumero('$1,234.50')).toBe(1234.5);
  expect(aNumero('abc')).toBe(0);
  expect(formatearFechaHora(new Date(2026, 10, 26, 16, 0))).toBe('26 nov 2026 · 16:00');
});

test('1 · Mis cotizaciones', async () => {
  await render(<MisCotizaciones />);
  expect(screen.getByText('Mis cotizaciones')).toBeTruthy();
  expect(screen.getByText('Las versiones anteriores se conservan')).toBeTruthy();
  expect(screen.getByText('$1,700.00')).toBeTruthy();
  expect(screen.getByText('Pendiente del cliente')).toBeTruthy();
  expect(screen.getByText(/no se ejecuta hasta que el cliente lo acepte/)).toBeTruthy();
  expect(screen.getByText('Enviada')).toBeTruthy();
  // solo la cotización aceptada tiene el botón
  expect(screen.getAllByText('Crear nueva versión').length).toBe(1);
  await fireEvent.press(screen.getByText('Crear nueva versión'));
  expect(Alert.alert).toHaveBeenCalledWith('Nueva versión', expect.stringContaining('versión 3'));
});

test('2 · Conversaciones: abre el chat', async () => {
  const onAbrirChat = jest.fn();
  await render(<Conversaciones onAbrirChat={onAbrirChat} />);
  expect(screen.getByText('Contratación · HM-2044')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('Abrir chat con Sofía Luna'));
  expect(onAbrirChat).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Sofía Luna' }));
});

test('3 · Chat: muestra el historial y envía un mensaje', async () => {
  await render(<ChatConversacion />);
  expect(screen.getByText('HM-2044 · Reparación de fuga')).toBeTruthy();
  expect(screen.getByText('Contratado')).toBeTruthy();
  expect(screen.getByText('Cotización v1 · Aceptada')).toBeTruthy();
  expect(screen.getByText('$1,700.00')).toBeTruthy();

  await fireEvent.changeText(screen.getByLabelText('Mensaje'), 'Llego en 10 minutos');
  await fireEvent.press(screen.getByText('Enviar'));
  expect(screen.getByText('Llego en 10 minutos')).toBeTruthy();
  expect(screen.getByLabelText('Mensaje').props.value).toBe('');
});

test('4 · Iniciar servicio: código incompleto, incorrecto y correcto', async () => {
  const onIniciado = jest.fn();
  await render(<IniciarServicio onIniciado={onIniciado} />);
  expect(screen.getByText('HM-2044 · Reparación de fuga')).toBeTruthy();

  await fireEvent.press(screen.getByText('Confirmar inicio'));
  expect(Alert.alert).toHaveBeenCalledWith('Código incompleto', expect.any(String));

  await fireEvent.changeText(screen.getByLabelText('Código de inicio'), '1111');
  await fireEvent.press(screen.getByText('Confirmar inicio'));
  expect(Alert.alert).toHaveBeenCalledWith('Código incorrecto', expect.any(String));
  expect(onIniciado).not.toHaveBeenCalled();

  await fireEvent.changeText(screen.getByLabelText('Código de inicio'), '48a27');
  expect(screen.getByLabelText('Código de inicio').props.value).toBe('4827');
  await fireEvent.press(screen.getByText('Confirmar inicio'));
  expect(onIniciado).toHaveBeenCalled();
  expect(screen.getByText('Servicio iniciado')).toBeTruthy();
});

test('5 · Finalizar servicio: orden de pasos y código correcto', async () => {
  const onFinalizado = jest.fn();
  const onSolicitarRevision = jest.fn();
  await render(<FinalizarServicio onFinalizado={onFinalizado} onSolicitarRevision={onSolicitarRevision} />);
  expect(screen.getByText('Ticket de ferretería')).toBeTruthy();
  expect(screen.getByText('$1,000.00')).toBeTruthy();
  expect(screen.getByText('Foto adjunta')).toBeTruthy();

  // sin marcar como realizado no se puede validar
  await fireEvent.press(screen.getByText('Validar código'));
  expect(Alert.alert).toHaveBeenCalledWith('Falta un paso', expect.any(String));

  await fireEvent.press(screen.getByText('Marcar como realizado'));
  expect(screen.getByText('✓ Marcado como realizado')).toBeTruthy();

  await fireEvent.changeText(screen.getByLabelText('Código de finalización'), '0000');
  await fireEvent.press(screen.getByText('Validar código'));
  expect(Alert.alert).toHaveBeenCalledWith('Código incorrecto', expect.any(String));

  await fireEvent.changeText(screen.getByLabelText('Código de finalización'), '7391');
  await fireEvent.press(screen.getByText('Validar código'));
  expect(onFinalizado).toHaveBeenCalled();
  expect(screen.getByText('Servicio finalizado')).toBeTruthy();

  await fireEvent.press(screen.getByText('No tengo el código · Solicitar revisión'));
  // el botón queda deshabilitado una vez finalizado
  expect(onSolicitarRevision).not.toHaveBeenCalled();
});

test('5b · Finalizar servicio: solicitar revisión', async () => {
  const onSolicitarRevision = jest.fn();
  await render(<FinalizarServicio onSolicitarRevision={onSolicitarRevision} />);
  await fireEvent.press(screen.getByText('No tengo el código · Solicitar revisión'));
  expect(onSolicitarRevision).toHaveBeenCalled();
});

test('6 · Solicitar revisión', async () => {
  const onEnviar = jest.fn();
  await render(<SolicitarRevision onEnviar={onEnviar} />);
  ['Abierta', 'En revisión', 'Resuelta', 'Cerrada'].forEach((e) => expect(screen.getByText(e)).toBeTruthy());
  expect(screen.getByText('Chat · cotización')).toBeTruthy();

  await fireEvent.changeText(screen.getByLabelText('Explicación'), '   ');
  await fireEvent.press(screen.getByText('Enviar solicitud'));
  expect(Alert.alert).toHaveBeenCalledWith('Falta la explicación', expect.any(String));

  await fireEvent.changeText(screen.getByLabelText('Explicación'), 'El cliente no compartió el código.');
  await fireEvent.press(screen.getByText('Enviar solicitud'));
  expect(onEnviar).toHaveBeenCalledWith(expect.objectContaining({ contrato: 'HM-2044' }));
  expect(screen.getByText('Solicitud enviada')).toBeTruthy();
});

test('7 · Desglose del pago: montos calculados', async () => {
  await render(<DesglosePago />);
  expect(screen.getByText('HM-2044 · Pago de prueba · Stripe Test Mode')).toBeTruthy();
  expect(screen.getByText('$700.00')).toBeTruthy(); // monto en plataforma
  expect(screen.getByText('$70.00')).toBeTruthy(); // comisión
  expect(screen.getByText('Comisión HeldMe! (10% de $700.00)')).toBeTruthy();
  expect(screen.getByText('Lo absorbe HeldMe!')).toBeTruthy();
  await fireEvent.press(screen.getByText('Ver'));
  expect(Alert.alert).toHaveBeenCalledWith('Comprobante', expect.any(String));
});

test('7b · Desglose: material sin comprobante entra a la comisión', async () => {
  await render(
    <DesglosePago
      pago={{
        contrato: 'HM-9',
        manoObra: 500,
        diagnostico: 200,
        materialComprobado: 300,
        materialSinComprobante: 100,
        materialesDirectos: 0,
        comprobante: 'ticket',
        tasaComision: 0.1,
      }}
    />
  );
  expect(screen.getByText('$1,100.00')).toBeTruthy(); // plataforma = 500+200+300+100
  expect(screen.getByText('Comisión HeldMe! (10% de $800.00)')).toBeTruthy(); // base sin el comprobado
  expect(screen.getByText('$80.00')).toBeTruthy();
});

test('8 · Cancelar contratación: justificada con más de 48 horas', async () => {
  const onConfirmar = jest.fn();
  const onVolver = jest.fn();
  await render(<CancelarContratacion onConfirmar={onConfirmar} onVolver={onVolver} />);
  expect(screen.getByText('26 nov 2026 · 16:00')).toBeTruthy();
  expect(screen.getByText('Más de 48 horas')).toBeTruthy();
  expect(screen.getByText('Cancelación justificada')).toBeTruthy();

  await fireEvent.press(screen.getByText('Volver'));
  expect(onVolver).toHaveBeenCalled();

  await fireEvent.press(screen.getByText('Confirmar cancelación'));
  expect(onConfirmar).toHaveBeenCalledWith(expect.objectContaining({ justificada: true, motivo: 'Imprevisto de agenda' }));
});

test('8b · Cancelar contratación: con menos de 48 horas', async () => {
  const onConfirmar = jest.fn();
  await render(
    <CancelarContratacion ahora={new Date(2026, 10, 25, 12, 0)} onConfirmar={onConfirmar} />
  );
  expect(screen.getByText('Menos de 48 horas')).toBeTruthy();
  expect(screen.getByText('Posible cancelación injustificada')).toBeTruthy();
  expect(screen.queryByText('Cancelación justificada')).toBeNull();
  await fireEvent.press(screen.getByText('Confirmar cancelación'));
  expect(onConfirmar).toHaveBeenCalledWith(expect.objectContaining({ justificada: false }));
});

test('9 · Cursos: autorización', async () => {
  const onSolicitar = jest.fn();
  await render(<CursosAutorizacion onSolicitar={onSolicitar} />);
  expect(screen.getByText('Para impartir cursos necesitas rango Plata o superior.')).toBeTruthy();
  expect(screen.getByText('Cumples el rango mínimo')).toBeTruthy();
  expect(screen.getByText('4.9')).toBeTruthy();
  expect(screen.getByText('18')).toBeTruthy();
  await fireEvent.press(screen.getByText('Solicitar autorización'));
  expect(onSolicitar).toHaveBeenCalled();
  expect(screen.getByText('Solicitud enviada')).toBeTruthy();
});

test('9b · Cursos: rango insuficiente bloquea la solicitud', async () => {
  const onSolicitar = jest.fn();
  await render(<CursosAutorizacion rangoActual="Bronce" onSolicitar={onSolicitar} />);
  expect(screen.getByText('No cumples el rango mínimo')).toBeTruthy();
  await fireEvent.press(screen.getByText('Solicitar autorización'));
  expect(onSolicitar).not.toHaveBeenCalled();
});

test('10 · Nuevo curso: validaciones y envío', async () => {
  const onEnviar = jest.fn();
  const onGuardarBorrador = jest.fn();
  await render(<NuevoCurso onEnviar={onEnviar} onGuardarBorrador={onGuardarBorrador} />);

  await fireEvent.press(screen.getByText('Enviar a revisión'));
  expect(Alert.alert).toHaveBeenCalledWith('Revisa el formulario', 'Escribe el título del curso.');

  await fireEvent.press(screen.getByText('Guardar borrador'));
  expect(Alert.alert).toHaveBeenCalledWith('Falta el título', expect.any(String));

  await fireEvent.changeText(screen.getByLabelText('Título'), 'Reparación y mantenimiento de boilers');
  await fireEvent.press(screen.getByText('Guardar borrador'));
  expect(onGuardarBorrador).toHaveBeenCalled();

  await fireEvent.changeText(screen.getByLabelText('Zona y horario'), 'Centro de capacitación · 10:00');
  await fireEvent.changeText(screen.getByLabelText('Fecha de inicio'), '12 dic 2026');
  await fireEvent.changeText(screen.getByLabelText('Cupo'), '12');
  await fireEvent.changeText(screen.getByLabelText('Precio de prueba'), '850');

  // en línea exige el enlace
  await fireEvent.press(screen.getByText('En línea en vivo'));
  await fireEvent.press(screen.getByText('Enviar a revisión'));
  expect(Alert.alert).toHaveBeenCalledWith('Revisa el formulario', expect.stringContaining('enlace'));

  await fireEvent.changeText(screen.getByLabelText('Enlace externo (solo en línea)'), 'meet.google.com/abc');
  await fireEvent.press(screen.getByText('Enviar a revisión'));
  expect(onEnviar).toHaveBeenCalledWith(
    expect.objectContaining({ modalidad: 'enlinea', cupo: 12, precio: 850, enlace: 'meet.google.com/abc' })
  );
});

test('10b · validarCurso', () => {
  const base = { titulo: 'A', modalidad: 'presencial', zonaHorario: 'x', fechaInicio: 'y', enlace: '', cupo: '5', precio: '0', descripcion: '' };
  expect(validarCurso(base)).toBeNull();
  expect(validarCurso({ ...base, cupo: '0' })).toMatch(/cupo/);
  expect(validarCurso({ ...base, precio: '' })).toMatch(/precio/);
});

test('11 · Mis cursos', async () => {
  const onNuevoCurso = jest.fn();
  await render(<MisCursos onNuevoCurso={onNuevoCurso} />);
  expect(screen.getByText('Reparación y mantenimiento de boilers')).toBeTruthy();
  expect(screen.getByText('Publicado')).toBeTruthy();
  expect(screen.getByText('Cupo 8 de 12')).toBeTruthy();
  expect(screen.getByText('Sofía Luna')).toBeTruthy();
  expect(screen.getAllByText('Pagado').length).toBe(3);
  expect(screen.getByText('Pendiente de revisión')).toBeTruthy();
  await fireEvent.press(screen.getByText('Nuevo curso'));
  expect(onNuevoCurso).toHaveBeenCalled();
});

test('12 · Perfil profesional', async () => {
  await render(<PerfilProfesional />);
  expect(screen.getByText('Laura Cota')).toBeTruthy();
  expect(screen.getByText('Plomería · Col. Jalisco · SLRC')).toBeTruthy();
  expect(screen.getByText('18 de 20 para Oro')).toBeTruthy();
  expect(screen.getByText('Aprobada')).toBeTruthy();
  expect(screen.getByText('Cerrar sesión')).toBeTruthy();
});

test('13 · Perfil con sanción', async () => {
  await render(<PerfilConSancion />);
  expect(screen.getByText('Rango mostrado: Bronce')).toBeTruthy();
  expect(screen.getByText('Un nivel inferior al que corresponde por servicios (Plata).')).toBeTruthy();
  expect(screen.getByText('2 de 3')).toBeTruthy();
  expect(screen.getByText('48 h')).toBeTruthy();
  expect(screen.getByText('0 de 10 servicios')).toBeTruthy();
  expect(screen.getByText('Strike 2 · 23 nov 2026')).toBeTruthy();
  expect(screen.getByText('Suspensión y rango')).toBeTruthy();
  expect(screen.getByText(/deja de contar tras 6 meses/)).toBeTruthy();
  expect(screen.queryByText('Cerrar sesión')).toBeNull();
});
