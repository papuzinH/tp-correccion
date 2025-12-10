import { useState, useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../store/useAppStore';
import { VersionEntrega, Usuario } from '../../../types';
import { TipoDevolucion } from '../types';

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

  // Datos derivados
  const entregaActual = entregas[indiceEntregaActual];
  const escalaActual = escalasDeNotas.find(escala => escala.idEscala === tpConfiguracion.idEscala);
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

  const submitCorrection = useCallback(() => {
    if (tipoDevolucion === 'Tipo de devolución') {
      alert('Por favor, seleccione un tipo de devolución antes de enviar.');
      return;
    }

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

    enviarCorreccion(datosCorreccion);
    alert('Corrección enviada exitosamente');
  }, [tipoDevolucion, borrador, currentFeedback, attachedFiles, integrantes, enviarCorreccion]);

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
    submitCorrection
  };
};
