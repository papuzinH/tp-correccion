import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { BorradorCorreccion, Usuario, Entrega, TPConfiguracion, VersionEntrega } from '../types';
import { tpConfiguracion, escalasDeNotas } from '../data/mockData';

interface AppState {
  usuarios: Usuario[];
  entregas: Entrega[];
  indiceEntregaActual: number;
  borrador: BorradorCorreccion | null;
  archivoAbierto: string | null;
  tpConfiguracion: TPConfiguracion;
  escalasDeNotas: typeof escalasDeNotas;

  // Actions
  setUsuarios: (usuarios: Usuario[]) => void;
  setEntregas: (entregas: Entrega[]) => void;
  siguienteEntrega: () => void;
  entregaAnterior: () => void;
  actualizarBorrador: (borrador: Partial<BorradorCorreccion>) => void;
  resetearBorrador: () => void;
  setArchivoAbierto: (archivo: string | null) => void;
  actualizarIntegrantes: (integrantes: Usuario[]) => void;
  enviarCorreccion: (datos: Partial<VersionEntrega>) => void;
}

const INITIAL_DRAFT: BorradorCorreccion = {
  idEntregaTP: 0,
  puntaje: null,
  feedback: '',
  criterios: {},
  completo: false
};

export const useAppStore = create<AppState>()(immer((set, get) => ({
  usuarios: [],
  entregas: [],
  indiceEntregaActual: 0,
  borrador: null,
  archivoAbierto: null,
  tpConfiguracion,
  escalasDeNotas,

  setUsuarios: (usuarios) => set({ usuarios }),
  setEntregas: (entregas) => set({ entregas }),

  siguienteEntrega: () => {
    const { indiceEntregaActual, entregas } = get();
    if (indiceEntregaActual < entregas.length - 1) {
      set({ indiceEntregaActual: indiceEntregaActual + 1, borrador: null, archivoAbierto: null });
    }
  },

  entregaAnterior: () => {
    const { indiceEntregaActual } = get();
    if (indiceEntregaActual > 0) {
      set({ indiceEntregaActual: indiceEntregaActual - 1, borrador: null, archivoAbierto: null });
    }
  },

  actualizarBorrador: (nuevoBorrador) => set((state) => {
    if (!state.borrador) {
      state.borrador = { ...INITIAL_DRAFT };
    }
    Object.assign(state.borrador, nuevoBorrador);
  }),

  resetearBorrador: () => set({ borrador: null }),
  setArchivoAbierto: (archivo) => set({ archivoAbierto: archivo }),

  actualizarIntegrantes: (integrantes) => set((state) => {
    const entrega = state.entregas[state.indiceEntregaActual];
    if (entrega) {
      entrega.integrantes = integrantes.map(u => u.idUsuario);
    }
  }),

  enviarCorreccion: (datos) => set((state) => {
    const entrega = state.entregas[state.indiceEntregaActual];
    if (entrega && entrega.versiones.length > 0) {
      const ultimaVersion = entrega.versiones[entrega.versiones.length - 1];
      Object.assign(ultimaVersion, datos);
    }
    state.borrador = null;
  }),
})));
