import { TPConfiguracion, Usuario, Entrega, VersionEntrega } from '../types';

export const usuarios: Usuario[] = [
  { idUsuario: 1, nombre: 'Felipe', apellido: 'Casdas', avatarUrl: undefined },
  { idUsuario: 2, nombre: 'Pepito', apellido: 'Lopez', avatarUrl: undefined },
  { idUsuario: 3, nombre: 'Alejo', apellido: 'Perez', avatarUrl: undefined },
  { idUsuario: 4, nombre: 'Armando', apellido: 'Augusto', avatarUrl: undefined },
  { idUsuario: 5, nombre: 'María', apellido: 'López', avatarUrl: undefined },
  { idUsuario: 6, nombre: 'Belén', apellido: 'Escobar', avatarUrl: undefined },
];

export const tpConfiguracion: TPConfiguracion = {
  idTPConfiguracion: 101,
  idActividad: 501,
  idEscala: 1,
  alias: "Principios de la Composición Visual - TP Evaluativo",
  fechaInicio: "2024-10-01T00:00:00",
  fechaVencimiento: "2025-12-31T23:59:59",
  permiteEntregaFueraDeTermino: true,
  esGrupal: true,
  consigna: "Realizar un análisis de la composición visual de la obra asignada.",
  consignaAdjuntos: null,
};

const version1_1: VersionEntrega = {
  idVersionEntregaTP: 1001,
  idEntregaTP: 2001,
  fecha: "2024-10-28T10:00:00",
  idUsuario: 2, // Pepito Lopez subió la primera versión
  texto: "Envío preliminar del trabajo práctico.",
  adjuntos: [],
};

const version1_2: VersionEntrega = {
  idVersionEntregaTP: 1002,
  idEntregaTP: 2001,
  fecha: "2024-10-30T18:13:00",
  idUsuario: 1, // Felipe Casdas
  texto: "Profe, te envío el PDF correcto",
  adjuntos: ["entregaVfinal.pdf"],
};

const version1_3: VersionEntrega = {
  idVersionEntregaTP: 1005,
  idEntregaTP: 2001,
  fecha: "2024-10-31T12:00:00",
  idUsuario: 3, // Alejo Perez
  texto: "Aquí está mi contribución al trabajo grupal.",
  adjuntos: ["aporteAlejo.pdf"],
};

const version1_4: VersionEntrega = {
  idVersionEntregaTP: 1006,
  idEntregaTP: 2001,
  fecha: "2024-11-01T16:00:00",
  idUsuario: 1, // Felipe Casdas
  texto: "Última versión del trabajo grupal.",
  adjuntos: ["entregaFinalGrupo.pdf"],
};

const version1_5: VersionEntrega = {
  idVersionEntregaTP: 1007,
  idEntregaTP: 2001,
  fecha: "2024-11-02T09:00:00",
  idUsuario: 2, // Pepito Lopez
  texto: "Agrego algunos comentarios finales al trabajo.",
  adjuntos: ["comentariosFinales.pdf"],
};

const version2_1: VersionEntrega = {
  idVersionEntregaTP: 1003,
  idEntregaTP: 2002,
  fecha: "2024-11-01T14:45:00",
  idUsuario: 4, // Alejo Perez
  texto: "Aquí está la versión final del trabajo.",
  adjuntos: ["entregaFinal.pdf"],
};

const version2_2: VersionEntrega = {
  idVersionEntregaTP: 1004,
  idEntregaTP: 2002,
  fecha: "2024-11-02T09:30:00",
  idUsuario: 5, // María López
  texto: "Versión corregida con los comentarios del profe.",
  adjuntos: ["entregaCorregida.pdf"],
};

export const entrega1: Entrega = {
  idEntregaTP: 2001,
  integrantes: [1, 2, 3],
  versiones: [version1_1, version1_2, version1_3, version1_4, version1_5],
};

export const entrega2: Entrega = {
  idEntregaTP: 2002,
  integrantes: [4, 5, 6],
  versiones: [version2_1, version2_2],
};

export const entregas: Entrega[] = [entrega1, entrega2];

export const mockState = {
  usuarios,
  tpConfiguracion,
  entrega1,
  entrega2,
  entregas,
};
