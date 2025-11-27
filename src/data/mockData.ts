import { TPConfiguracion, Usuario, Entrega, VersionEntrega } from '../types';

export const escalasDeNotas = [
  {
    idEscala: 1,
    nombre: 'De 0 a 10',
    valores: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    idEscala: 2,
    nombre: 'De 0 a 100',
    valores: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  {
    idEscala: 3,
    nombre: 'De A a E',
    valores: ['A', 'B', 'C', 'D', 'E'],
  },
  {
    idEscala: 4,
    nombre: 'De A a F',
    valores: ['A', 'B', 'C', 'D', 'E', 'F'],
  },
];

export const usuarios: Usuario[] = [
  { idUsuario: 1, nombre: 'Felipe', apellido: 'Casdas', avatarUrl: undefined, curso: '4A' },
  { idUsuario: 2, nombre: 'Pepito', apellido: 'Lopez', avatarUrl: undefined, curso: '4B' },
  { idUsuario: 3, nombre: 'Alejo', apellido: 'Perez', avatarUrl: undefined, curso: '4A' },
  {
    idUsuario: 4,
    nombre: 'Armando',
    apellido: 'Augusto',
    avatarUrl: undefined,
    curso: '4C'
  },
  { idUsuario: 5, nombre: 'María', apellido: 'López', avatarUrl: undefined, curso: '4B' },
  { idUsuario: 6, nombre: 'Belén', apellido: 'Escobar', avatarUrl: undefined, curso: '4A' },
];

export const tpConfiguracion: TPConfiguracion = {
  idTPConfiguracion: 101,
  idActividad: 501,
  idEscala: 1,
  alias: 'Principios de la Composición Visual - TP Evaluativo',
  fechaInicio: '2024-10-01T00:00:00',
  fechaVencimiento: '2025-12-31T23:59:59',
  permiteEntregaFueraDeTermino: true,
  esGrupal: true,
  consigna:
    'Realizar un análisis de la composición visual de la obra asignada.',
  consignaAdjuntos: null,
};

const version1_1: VersionEntrega = {
  idVersionEntregaTP: 1001,
  idEntregaTP: 2001,
  fecha: '2024-10-28T10:00:00',
  idUsuario: 2, // Pepito Lopez subió la primera versión
  texto: 'Envío preliminar del trabajo práctico.',
  adjuntos: [],
  fechaCorreccion: '2024-10-29T11:00:00',
  devolucion: 'Buen comienzo, pero falta desarrollar más el punto 2.',
  adjuntosCorreccion: [],
  anotacionesPDF: null,
  nota: null,
  esReentrega: true,
};

const version1_2: VersionEntrega = {
  idVersionEntregaTP: 1002,
  idEntregaTP: 2001,
  fecha: '2024-10-30T18:13:00',
  idUsuario: 1, // Felipe Casdas
  texto: 'Profe, te envío el PDF correcto',
  adjuntos: ['entregaVfinal.pdf'],
  fechaCorreccion: '2024-11-01T09:30:00',
  devolucion: 'Falta profundizar en algunos aspectos teóricos.',
  adjuntosCorreccion: [],
  anotacionesPDF: null,
  nota: null,
  esReentrega: true,
};

const version1_3: VersionEntrega = {
  idVersionEntregaTP: 1005,
  idEntregaTP: 2001,
  fecha: '2024-10-31T12:00:00',
  idUsuario: 3, // Alejo Perez
  texto: 'Aquí está mi contribución al trabajo grupal.',
  adjuntos: ['aporteAlejo.pdf'],
  fechaCorreccion: '2024-10-31T15:00:00',
  devolucion: 'Recibido. Sigan así.',
  adjuntosCorreccion: [],
  anotacionesPDF: null,
  nota: null,
  esReentrega: true,
};

const version1_4: VersionEntrega = {
  idVersionEntregaTP: 1006,
  idEntregaTP: 2001,
  fecha: '2024-11-01T16:00:00',
  idUsuario: 1, // Felipe Casdas
  texto: 'Última versión del trabajo grupal.',
  adjuntos: ['entregaFinalGrupo.pdf'],
  fechaCorreccion: '2024-11-02T10:00:00',
  devolucion: 'Bien. Tienen que seguir mejorando',
  adjuntosCorreccion: [],
  anotacionesPDF: null,
  nota: null,
  esReentrega: true,
};

const version1_5: VersionEntrega = {
  idVersionEntregaTP: 1007,
  idEntregaTP: 2001,
  fecha: '2024-11-02T09:00:00',
  idUsuario: 2, // Pepito Lopez
  texto: 'Agrego algunos comentarios finales al trabajo.',
  adjuntos: ['comentariosFinales.pdf'],
  fechaCorreccion: null,
  devolucion: null,
  adjuntosCorreccion: null,
  anotacionesPDF: null,
  nota: null,
  esReentrega: null,
};

const version2_1: VersionEntrega = {
  idVersionEntregaTP: 1003,
  idEntregaTP: 2002,
  fecha: '2024-11-01T14:45:00',
  idUsuario: 4, // Alejo Perez
  texto: 'Aquí está la versión final del trabajo.',
  adjuntos: ['entregaFinal.pdf'],
  fechaCorreccion: '2024-11-02T08:00:00',
  devolucion: 'Hay errores conceptuales graves en la sección 3. Rehacer.',
  adjuntosCorreccion: [],
  anotacionesPDF: null,
  nota: null,
  esReentrega: true,
};

const version2_2: VersionEntrega = {
  idVersionEntregaTP: 1004,
  idEntregaTP: 2002,
  fecha: '2024-11-02T09:30:00',
  idUsuario: 5, // María López
  texto: 'Versión corregida con los comentarios del profe.',
  adjuntos: ['entregaCorregida.pdf'],
  fechaCorreccion: '2024-11-03T12:00:00',
  devolucion: 'Corrección recibida y aplicada.',
  adjuntosCorreccion: [],
  anotacionesPDF: null,
  nota: null,
  esReentrega: true,
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
