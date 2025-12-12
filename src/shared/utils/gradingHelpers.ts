import { VersionEntrega } from '../../types';

export const hasCorrection = (version: VersionEntrega) => {
  return (
    version.fechaCorreccion != null ||
    version.devolucion != null ||
    (version.adjuntosCorreccion != null && version.adjuntosCorreccion.length > 0) ||
    version.anotacionesPDF != null ||
    version.nota != null ||
    version.esReentrega != null
  );
};

export const getCorrectionType = (version: VersionEntrega) => {
  return version.esReentrega ? 'solicitó reentrega' : 'envió una calificación final';
};