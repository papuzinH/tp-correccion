import axios from 'axios';
// Definición de tipos para los callbacks
type Callback<T = any> = (response: { data: T; success?: boolean; message?: string }) => void;

const enviarRequest = (
  endpoint: string,
  data: any,
  callback: (res: any) => void
) => {
  var formData = new FormData();
  formData.append('data', data);
  axios({
    method: 'post',
    url: import.meta.env.VITE_REACT_APP_URL_SRV + 'nuevotp/correccion/ajax/' + endpoint,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((response) => callback(response.data))
    .catch((error) => {
      console.error(`Error en request ${endpoint}:`, error);
      callback({ success: false, message: error.message });
    });
};


/**
 * Obtiene el contexto completo para la corrección:
 * - Configuración del TP (Consigna)
 * - Escala de notas
 * - Datos de la Actividad (Fechas, Grupal/Individual)
 * - Lista de Alumnos de la comisión
 */
export const getTPContext = (data: { idActividad: number; idComision: number }) => {
  return new Promise((resolve, reject) => {
    enviarRequest('GetTPContext', JSON.stringify(data), (res) => {
      if (res.data) {
        resolve(res.data);
      } else {
        reject(res.message || 'No se encontraron datos del TP');
      }
    });
  });
};

/**
 * Obtiene todas las entregas con sus versiones y correcciones.
 */
export const getEntregas = (data: { idActividad: number; idComision: number }) => {
  return new Promise((resolve, reject) => {
    enviarRequest('ListEntregas', JSON.stringify(data), (res) => {
      // El backend puede devolver el array directamente o envuelto en un objeto { data: [...] }
      if (Array.isArray(res)) {
        resolve(res);
      } else if (res && res.data) {
        resolve(res.data);
      } else {
        reject(res.message || 'No se encontraron entregas');
      }
    });
  });
};

/**
 * Guarda una corrección (puede ser borrador o definitiva).
 * Maneja tanto la corrección en texto/adjuntos como la nota numérica.
 */
export const saveCorreccion = (data: {
  idVersionEntregaTP: number;
  idUsuarioDocente: number;
  devolucion: string;
  nota?: string | number | null;
  esBorrador: boolean;
  esReentrega: boolean;
  anotacionesPDF?: string; // JSON string
  criterios?: Record<string, number>; // JSON string
  notasIndividuales?: { idUsuario: number; nota: number | string }[];
}) => {
  return new Promise((resolve, reject) => {
    enviarRequest('SaveCorreccion', JSON.stringify(data), (res) => {
      if (res.success) {
        resolve(res.data);
      } else {
        reject(res.message || 'Error al guardar la corrección');
      }
    });
  });
};

/**
 * Sube archivos adjuntos asociados a una corrección.
 * Nota: Este endpoint probablemente requiera un manejo especial de FormData en el backend
 * si se envían binarios reales.
 */
export const uploadAdjuntosCorreccion = (
  idVersionEntregaTP: number,
  files: File[]
) => {
  return new Promise((resolve, reject) => {
    // Aquí rompemos un poco el patrón JSON para enviar binarios
    const formData = new FormData();
    formData.append('data', JSON.stringify({ idVersionEntregaTP }));
    files.forEach((file) => {
      formData.append('files[]', file);
    });

    axios({
      method: 'post',
      url: import.meta.env.VITE_REACT_APP_URL_SRV + 'tp-correccion/ajax/UploadAdjuntos',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => {
      if (res.data && res.data.success) resolve(res.data);
      else reject(res.data?.message || 'Error al subir archivos');
    })
    .catch(reject);
  });
};

/**
 * Actualiza los integrantes de una entrega grupal.
 */
export const updateIntegrantesEntrega = (
  idEntregaTP: number,
  nuevosIntegrantesIds: number[]
) => {
  return new Promise((resolve, reject) => {
    enviarRequest('UpdateIntegrantes', { idEntregaTP, integrantes: nuevosIntegrantesIds }, (res) => {
      if (res.success) {
        resolve(res.data);
      } else {
        reject(res.message || 'Error al actualizar integrantes');
      }
    });
  });
};

/**
 * Verifica permisos de edición sobre el TP.
 */
export const checkPermissions = (idActividad: number, idComision: number) => {
  return new Promise((resolve, reject) => {
    enviarRequest('CheckPermissions', { idActividad, idComision }, (res) => {
      if (res.success) {
        resolve(true);
      } else {
        reject('No tiene permisos para corregir este TP');
      }
    });
  });
};
