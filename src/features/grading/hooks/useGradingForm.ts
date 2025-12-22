import { useState, useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../store/useAppStore';
import { VersionEntrega, Usuario } from '../../../types';
import { TipoDevolucion } from '../types';
import { saveCorreccion, uploadAdjuntosCorreccion } from '../../../store/conexionBack';

export const useGradingForm = (attachedFiles: File[]) => {
  const { 
    borrador, 
    actualizarBorrador, 
    entregas, 
    indiceEntregaActual, 
    usuarios, 
    tpConfiguracion, 
    escalasDeNotas, 
    enviarCorreccion 
  } = useAppStore(
    useShallow((state) => ({
      borrador: state.borrador,
      actualizarBorrador: state.actualizarBorrador,
      entregas: state.entregas,
      indiceEntregaActual: state.indiceEntregaActual,
      usuarios: state.usuarios,
      tpConfiguracion: state.tpConfiguracion,
      escalasDeNotas: state.escalasDeNotas,
      enviarCorreccion: state.enviarCorreccion,
    }))
  );

  const [tipoDevolucion, setTipoDevolucion] = useState<TipoDevolucion>('Tipo de devolución');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Datos derivados
  const entregaActual = entregas[indiceEntregaActual];
  const escalaActual = tpConfiguracion 
    ? escalasDeNotas.find(escala => escala.idEscala === tpConfiguracion.idEscala)
    : undefined;
  const scaleValues = escalaActual ? escalaActual.valores : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const integrantes = useMemo(() => 
    entregaActual 
      ? entregaActual.integrantes.map(id => usuarios.find(u => u.idUsuario === id)).filter(Boolean) as Usuario[] 
      : [], 
    [entregaActual, usuarios]
  );

  const ultimaVersion = entregaActual?.versiones[entregaActual.versiones.length - 1];
  const esperandoCorreccion = ultimaVersion ? ultimaVersion.fechaCorreccion === null : false;

  const currentScore = borrador?.puntaje ?? null;
  const currentFeedback = borrador?.feedback || 'La entrega está parcialmente bien. Deberían haber hecho bien el punto 2. Envíenme de nuevo la entrega completa con todos los puntos';

  // Handlers
  const handleFeedbackChange = useCallback((html: string) => {
    actualizarBorrador({ feedback: html });
  }, [actualizarBorrador]);

  const handleScoreChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const numVal = Number(val);
    actualizarBorrador({ puntaje: isNaN(numVal) ? val : numVal });
  }, [actualizarBorrador]);

  const handleSaveDraft = useCallback(() => {
    // El borrador ya se guarda automáticamente por debounce en el store, pero confirmamos visualmente
    alert('Borrador guardado');
  }, []);

  const submitCorrection = useCallback(async () => {
    if (tipoDevolucion === 'Tipo de devolución') {
      alert('Por favor, seleccione un tipo de devolución antes de enviar.');
      return;
    }

    if (!ultimaVersion) return;

    const datosCorreccion: Partial<VersionEntrega> = {
      fechaCorreccion: new Date().toISOString(),
      devolucion: borrador?.feedback || currentFeedback,
      adjuntosCorreccion: attachedFiles.map(f => f.name),
      anotacionesPDF: borrador?.anotacionesPDF || null,
      esReentrega: tipoDevolucion === 'Solicitud de reentrega',
      nota: null,
      notasIndividuales: null
    };

    if (tipoDevolucion === 'Calificación final') {
      if (borrador?.puntaje === null || borrador?.puntaje === undefined) {
        alert('Debe ingresar una calificación final.');
        return;
      }
      datosCorreccion.nota = borrador.puntaje;
    } else if (tipoDevolucion === 'Calificación individual') {
      const notas = borrador?.notasIndividuales || {};
      const todosTienenNota = integrantes.every(integrante => 
        notas[integrante.idUsuario] !== undefined && notas[integrante.idUsuario] !== null
      );

      if (!todosTienenNota) {
        alert('Debe asignar una calificación a todos los integrantes.');
        return;
      }

      if (borrador?.notasIndividuales) {
        datosCorreccion.notasIndividuales = Object.entries(borrador.notasIndividuales).map(([id, nota]) => ({
          idUsuario: Number(id),
          nota
        }));
      }
    }

    setIsSubmitting(true);
    try {
      // 1. Guardar corrección en backend
      await saveCorreccion({
        idVersionEntregaTP: ultimaVersion.idVersionEntregaTP,
        idUsuarioDocente: 1, // TODO: Obtener ID real del docente
        devolucion: datosCorreccion.devolucion || '',
        nota: datosCorreccion.nota,
        esBorrador: false,
        esReentrega: datosCorreccion.esReentrega || false,
        anotacionesPDF: datosCorreccion.anotacionesPDF || undefined,
        criterios: borrador?.criterios,
        notasIndividuales: datosCorreccion.notasIndividuales || undefined
      });

      // 2. Subir adjuntos si existen
      if (attachedFiles.length > 0) {
        await uploadAdjuntosCorreccion(ultimaVersion.idVersionEntregaTP, attachedFiles);
      }

      // 3. Actualizar store local
      enviarCorreccion(datosCorreccion);
      alert('Corrección enviada exitosamente');
    } catch (error) {
      console.error('Error al enviar corrección:', error);
      alert('Error al enviar la corrección. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [tipoDevolucion, borrador, currentFeedback, attachedFiles, integrantes, enviarCorreccion, ultimaVersion]);

  return {
    tipoDevolucion,
    setTipoDevolucion,
    currentScore,
    currentFeedback,
    scaleValues,
    integrantes,
    esperandoCorreccion,
    handleFeedbackChange,
    handleScoreChange,
    handleSaveDraft,
    submitCorrection,
    isSubmitting
  };
};
