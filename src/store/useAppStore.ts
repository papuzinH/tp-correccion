import { create } from 'zustand';
import { BorradorCorreccion, Usuario, Entrega, TPConfiguracion } from '../types';
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
}

export const useAppStore = create<AppState>((set, get) => ({
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
    const borradorActual = state.borrador || {
      idEntregaTP: 0,
      puntaje: 0,
      feedback: '',
      criterios: {},
      completo: false
    };
    
    return {
      borrador: { ...borradorActual, ...nuevoBorrador }
    };
  }),

  resetearBorrador: () => set({ borrador: null }),
  setArchivoAbierto: (archivo) => set({ archivoAbierto: archivo }),

  actualizarIntegrantes: (integrantes) => set((state) => {
    const nuevasEntregas = [...state.entregas];
    nuevasEntregas[state.indiceEntregaActual] = {
      ...nuevasEntregas[state.indiceEntregaActual],
      integrantes: integrantes.map(u => u.idUsuario)
    };
    return { entregas: nuevasEntregas };
  }),
}));
