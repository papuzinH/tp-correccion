export interface TPConfiguracion {
  idTPConfiguracion: number;
  idActividad: number;
  idEscala: number;
  alias: string;
  fechaInicio: string; // ISO string
  fechaVencimiento: string; // ISO string
  permiteEntregaFueraDeTermino: boolean;
  esGrupal: boolean;
  consigna: string | null;
  consignaAdjuntos: string | null;
}

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  avatarUrl?: string;
}

export interface VersionEntrega {
  idVersionEntregaTP: number;
  idEntregaTP: number;
  fecha: string; // ISO string
  idUsuario: number;
  texto: string | null;
  adjuntos: string[];
}

export interface Entrega {
  idEntregaTP: number;
  integrantes: number[]; // Array de IDs de usuario
  versiones: VersionEntrega[];
}
