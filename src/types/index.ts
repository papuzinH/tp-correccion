export interface TPConfiguracion {
  idTPConfiguracion: number;
  idActividad: number;
  idEscala: number;
  alias: string;
  fechaInicio: string; 
  fechaVencimiento: string; 
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
  curso?: string;
}

export interface VersionEntrega {
  idVersionEntregaTP: number;
  idEntregaTP: number;
  fecha: string; 
  idUsuario: number;
  texto: string | null;
  adjuntos: string[];
  fechaCorreccion?: string | null;
  devolucion?: string | null;
  adjuntosCorreccion?: string[] | null;
  anotacionesPDF?: string | null;
  nota?: number | string | null;
  notasIndividuales?: { idUsuario: number; nota: number | string }[] | null;
  esReentrega?: boolean | null;
}

export interface Entrega {
  idEntregaTP: number;
  integrantes: number[]; 
  versiones: VersionEntrega[];
}

export interface BorradorCorreccion {
  idEntregaTP: number;
  puntaje: number | string | null;
  feedback: string;
  criterios: Record<string, number>;
  completo: boolean;
  notasIndividuales?: Record<number, number | string>;
}
