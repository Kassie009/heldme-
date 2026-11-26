// Adaptadores de navegación para conectar las pantallas del profesionista (págs. 9-11 del mockup)
// con la pila de navegación de HeldMe! (App.js).
import React from 'react';
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
} from './screens';

function ProMisCotizaciones({ nav }) {
  return <MisCotizaciones onMenu={nav.openMenu} />;
}

function ProConversaciones({ nav }) {
  return (
    <Conversaciones
      onMenu={nav.openMenu}
      onAbrirChat={(c) =>
        nav.push('proChat', {
          conversacion: {
            nombre: c.nombre,
            referencia: c.vinculo,
            estado: c.vinculo.startsWith('Contratación') ? 'Contratado' : 'En negociación',
          },
        })
      }
    />
  );
}

function ProChat({ nav, params }) {
  return <ChatConversacion onMenu={nav.openMenu} conversacion={params?.conversacion} />;
}

function ProIniciarServicio({ nav }) {
  return <IniciarServicio onMenu={nav.openMenu} />;
}

function ProFinalizarServicio({ nav }) {
  return (
    <FinalizarServicio
      onMenu={nav.openMenu}
      onSolicitarRevision={(contrato) => nav.push('proSolicitarRevision', { contrato })}
    />
  );
}

function ProSolicitarRevision({ nav, params }) {
  return <SolicitarRevision onMenu={nav.openMenu} contrato={params?.contrato} />;
}

function ProDesglosePago({ nav }) {
  return <DesglosePago onMenu={nav.openMenu} />;
}

function ProCancelarContratacion({ nav }) {
  return (
    <CancelarContratacion
      onMenu={nav.openMenu}
      onVolver={nav.back}
      onConfirmar={nav.back}
    />
  );
}

function ProCursosAutorizacion({ nav }) {
  return <CursosAutorizacion onMenu={nav.openMenu} />;
}

function ProNuevoCurso({ nav }) {
  return <NuevoCurso onMenu={nav.openMenu} />;
}

function ProMisCursos({ nav }) {
  return (
    <MisCursos
      onMenu={nav.openMenu}
      onNuevoCurso={() => nav.push('proNuevoCurso')}
    />
  );
}

function ProPerfilProfesional({ nav }) {
  return (
    <PerfilProfesional
      onMenu={nav.openMenu}
      onCerrarSesion={() => nav.reset('tipo')}
    />
  );
}

function ProPerfilConSancion({ nav }) {
  return <PerfilConSancion onMenu={nav.openMenu} />;
}

export const rutasProfesionista = {
  proMisCotizaciones: ProMisCotizaciones,
  proConversaciones: ProConversaciones,
  proChat: ProChat,
  proIniciarServicio: ProIniciarServicio,
  proFinalizarServicio: ProFinalizarServicio,
  proSolicitarRevision: ProSolicitarRevision,
  proDesglosePago: ProDesglosePago,
  proCancelarContratacion: ProCancelarContratacion,
  proCursosAutorizacion: ProCursosAutorizacion,
  proNuevoCurso: ProNuevoCurso,
  proMisCursos: ProMisCursos,
  proPerfilProfesional: ProPerfilProfesional,
  proPerfilConSancion: ProPerfilConSancion,
};
