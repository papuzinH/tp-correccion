import { BorradorCorreccion, VersionEntrega } from '../../types';

const BASE_URL = import.meta.env.VITE_REACT_APP_URL_SRV + 'libretas/ajax/';

const enviarRequest = async (
  endpoint: string,
  data: any,
  callback: (res: any) => void,
  onError?: (error: any) => void
) => {
  const formData = new FormData();
  // Si data es un objeto simple, lo stringificamos como en el ejemplo
  // Si es FormData (para archivos), habría que manejarlo distinto, pero el ejemplo
  // sugiere que 'data' es un string JSON o un valor simple.
  const payload = typeof data === 'object' ? JSON.stringify(data) : data;
  formData.append('data', payload);

  try {
    const response = await fetch(BASE_URL + endpoint, {
      method: 'POST',
      body: formData,
      // No seteamos Content-Type header explícitamente con fetch y FormData,
      // el navegador lo hace automáticamente con el boundary correcto.
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    callback(result);
  } catch (error) {
    console.error('Error en request:', error);
    if (onError) onError(error);
  }
};

// --- Endpoints de Configuración y Contexto ---

export const getTPConfiguracionByIdActividadIdComision = (idActividad: number, idComision: number) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ idActividad, idComision });
    enviarRequest('GetTPConfiguracionByIdActividadIdComision', data, (res: any) => {
      if (res.data) {
        resolve(res.data);
      } else {
        reject('No se encontraron datos de configuración del TP');
      }
    }, reject);
  });
};

export const getUsuariosByIdComision = (idComision: number) => {
  return new Promise((resolve, reject) => {
    enviarRequest('GetUsuariosByIdComision', idComision, (res: any) => {
      if (res.data) {
        resolve(res.data);
      } else {
        reject('No se encontraron usuarios para esta comisión');
      }
    }, reject);
  });
};

// --- Endpoints de Entregas y Corrección ---

/**
 * Obtiene todas las entregas con sus versiones y correcciones anidadas.
 * Estrategia Eficiente: El backend debe realizar los JOINs necesarios (EntregaTP -> VersionEntregaTP -> EntregaTPCorreccion)
 * y devolver la estructura jerárquica completa para evitar múltiples round-trips.
 */
export const getEntregasByIdActividadIdComision = (idActividad: number, idComision: number) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ idActividad, idComision });
    enviarRequest('GetEntregasByIdActividadIdComision', data, (res: any) => {
      if (res.data) {
        resolve(res.data);
      } else {
        reject('No se encontraron entregas');
      }
    }, reject);
  });
};

/**
 * Guarda o actualiza la corrección de una versión específica.
 * Maneja tanto borradores como correcciones finales.
 */
export const saveCorreccion = (data: {
  idVersionEntregaTP: number;
  idUsuarioCorrector: number;
  devolucion: string;
  nota: number | string | null;
  adjuntos?: string[]; // Nombres de archivos o URLs
  anotacionesPDF?: string | null;
  esBorrador: boolean;
  esReentrega: boolean;
  notasIndividuales?: Record<number, number | string>; // Para notas individuales si aplica
}) => {
  return new Promise((resolve, reject) => {
    enviarRequest('SaveCorreccionTP', data, (res: any) => {
      if (res.data) {
        resolve(res.data);
      } else {
        reject('Error al guardar la corrección');
      }
    }, reject);
  });
};

// --- Endpoints Auxiliares ---

export const uploadAdjuntoCorreccion = (file: File) => {
  return new Promise((resolve, reject) => {
    // Nota: Para subida de archivos puros, la estructura de enviarRequest del ejemplo
    // podría necesitar ajuste si el backend espera el archivo fuera del campo 'data'.
    // Asumimos aquí un endpoint dedicado que maneja multipart standard.
    const formData = new FormData();
    formData.append('file', file);
    
    fetch(BASE_URL + 'UploadAdjunto', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(res => {
      if (res.url) resolve(res.url);
      else reject('Error subiendo archivo');
    })
    .catch(reject);
  });
};
