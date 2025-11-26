import { create } from 'zustand';
import { BorradorCorreccion, Usuario, Entrega } from '../types';

interface AppState {
  usuarios: Usuario[];
  entregas: Entrega[];
  indiceEntregaActual: number;
  borrador: BorradorCorreccion | null;

  // Actions
  setUsuarios: (usuarios: Usuario[]) => void;
  setEntregas: (entregas: Entrega[]) => void;
  siguienteEntrega: () => void;
  entregaAnterior: () => void;
  actualizarBorrador: (borrador: Partial<BorradorCorreccion>) => void;
  resetearBorrador: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  usuarios: [],
  entregas: [],
  indiceEntregaActual: 0,
  borrador: null,

  setUsuarios: (usuarios) => set({ usuarios }),
  setEntregas: (entregas) => set({ entregas }),

  siguienteEntrega: () => {
    const { indiceEntregaActual, entregas } = get();
    if (indiceEntregaActual < entregas.length - 1) {
      set({ indiceEntregaActual: indiceEntregaActual + 1, borrador: null });
    }
  },

  entregaAnterior: () => {
    const { indiceEntregaActual } = get();
    if (indiceEntregaActual > 0) {
      set({ indiceEntregaActual: indiceEntregaActual - 1, borrador: null });
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
}));
