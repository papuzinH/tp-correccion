import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { BorradorCorreccion, Usuario, Entrega, TPConfiguracion, VersionEntrega, Escala } from '../types';
import { getTPContext, getEntregas } from './conexionBack';

interface AppState {
  usuarios: Usuario[];
  entregas: Entrega[];
  indiceEntregaActual: number;
  borrador: BorradorCorreccion | null;
  archivoAbierto: string | null;
  tpConfiguracion: TPConfiguracion | null;
  escalasDeNotas: Escala[];
  isLoading: boolean;
  error: string | null;

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
  inicializar: (idActividad: number, idComision: number) => Promise<void>;
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
  tpConfiguracion: null,
  escalasDeNotas: [],
  isLoading: false,
  error: null,

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

  inicializar: async (idActividad: number, idComision: number) => {
    set({ isLoading: true, error: null });
    try {
      const [contextData, entregasData] = await Promise.all([
        getTPContext({ idActividad, idComision }),
        getEntregas({ idActividad, idComision })
      ]);

      // Mappers
      const mapDate = (dateObj: any): string => {
        if (!dateObj || (typeof dateObj === 'object' && Object.keys(dateObj).length === 0)) {
          return new Date().toISOString(); // Fallback para fechas vacías
        }
        return typeof dateObj === 'string' ? dateObj : new Date().toISOString();
      };

      const rawContext = (contextData as any);
      const rawConfig = rawContext.tpConfiguracion;
      const tpConfiguracion: TPConfiguracion = {
        idTPConfiguracion: rawConfig.IdActividad, // Usamos IdActividad como ID de config por ahora
        idActividad: rawConfig.IdActividad,
        idEscala: rawConfig.IdEscala,
        alias: rawConfig.Alias,
        fechaInicio: mapDate(rawConfig.FechaInicio),
        fechaVencimiento: mapDate(rawConfig.FechaVencimiento),
        permiteEntregaFueraDeTermino: true, // Default
        esGrupal: rawConfig.EsGrupal,
        consigna: rawConfig.Consigna,
        consignaAdjuntos: Array.isArray(rawConfig.ConsignaAdjuntos) 
          ? rawConfig.ConsignaAdjuntos.join(', ') 
          : rawConfig.ConsignaAdjuntos
      };

      const escala: Escala = {
        idEscala: rawContext.escala.IdEscala,
        nombre: rawContext.escala.Nombre,
        valores: rawContext.escala.Items.map((i: any) => i.valor)
      };

      const usuarios: Usuario[] = (rawContext.alumnos || []).map((u: any) => ({
        idUsuario: u.IDUSUARIO,
        nombre: u.NOMBRE,
        apellido: u.APELLIDO,
        curso: u.CURSO,
        avatarUrl: u.UrlFoto // Si viene
      }));

      const entregas: Entrega[] = ((entregasData as any) || []).map((e: any) => ({
        idEntregaTP: e.idEntrega,
        integrantes: (e.integrantes || []).map((id: string | number) => Number(id)),
        versiones: (e.versiones || []).map((v: any) => {
          const correccion = v.correccion || {};
          return {
            idVersionEntregaTP: v.idVersion,
            idEntregaTP: e.idEntrega,
            fecha: mapDate(v.fecha),
            idUsuario: v.idUsuarioEntrega,
            texto: v.texto,
            adjuntos: v.adjuntos || [],
            
            // Datos de corrección aplanados
            fechaCorreccion: correccion.fecha && Object.keys(correccion.fecha).length > 0 ? mapDate(correccion.fecha) : null,
            devolucion: correccion.devolucion,
            adjuntosCorreccion: correccion.adjuntos,
            anotacionesPDF: correccion.anotacionesPDF,
            esReentrega: correccion.esReentrega,
            // Nota: La nota final viene en la entrega, pero aquí podríamos mapear la nota de la corrección si existiera
            nota: e.notaFinal // Asignamos la nota final a la versión para visualizarla
          } as VersionEntrega;
        })
      }));
      
      set({
        tpConfiguracion,
        escalasDeNotas: [escala],
        usuarios,
        entregas,
        isLoading: false
      });
    } catch (error) {
      console.error('Error inicializando store:', error);
      set({ 
        error: (error as any).message || 'Error al cargar los datos del TP', 
        isLoading: false 
      });
    }
  }
})));
