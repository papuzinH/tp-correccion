import { create } from 'zustand';
import { BorradorCorreccion, Usuario, Entrega } from '../types';

interface AppState {
  usuarios: Usuario[];
  entregas: Entrega[];
  indiceUsuarioActual: number;
  borrador: BorradorCorreccion | null;

  // Actions
  setUsuarios: (usuarios: Usuario[]) => void;
  setEntregas: (entregas: Entrega[]) => void;
  siguienteUsuario: () => void;
  usuarioAnterior: () => void;
  actualizarBorrador: (borrador: Partial<BorradorCorreccion>) => void;
  resetearBorrador: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  usuarios: [],
  entregas: [],
  indiceUsuarioActual: 0,
  borrador: null,

  setUsuarios: (usuarios) => set({ usuarios }),
  setEntregas: (entregas) => set({ entregas }),

  siguienteUsuario: () => {
    const { indiceUsuarioActual, usuarios } = get();
    if (indiceUsuarioActual < usuarios.length - 1) {
      set({ indiceUsuarioActual: indiceUsuarioActual + 1, borrador: null });
    }
  },

  usuarioAnterior: () => {
    const { indiceUsuarioActual } = get();
    if (indiceUsuarioActual > 0) {
      set({ indiceUsuarioActual: indiceUsuarioActual - 1, borrador: null });
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
