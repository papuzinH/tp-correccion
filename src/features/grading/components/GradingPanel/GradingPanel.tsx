import React, { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../../store/useAppStore';
import { GradingControls } from './GradingControls';
import { GradingEditor } from './GradingEditor';
import { GradingActions } from './GradingActions';
import { Usuario } from '../../../../types';
import styles from './GradingPanel.module.css';

export const GradingPanel: React.FC = () => {
  const { borrador, actualizarBorrador, entregas, indiceEntregaActual, usuarios, setArchivoAbierto, tpConfiguracion, escalasDeNotas } = useAppStore(
    useShallow((state) => ({
      borrador: state.borrador,
      actualizarBorrador: state.actualizarBorrador,
      entregas: state.entregas,
      indiceEntregaActual: state.indiceEntregaActual,
      usuarios: state.usuarios,
      setArchivoAbierto: state.setArchivoAbierto,
      tpConfiguracion: state.tpConfiguracion,
      escalasDeNotas: state.escalasDeNotas,
    }))
  );

  const entregaActual = entregas[indiceEntregaActual];
  const escalaActual = escalasDeNotas.find(escala => escala.idEscala === tpConfiguracion.idEscala);
  const scaleValues = escalaActual ? escalaActual.valores : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const integrantes = useMemo(() => entregaActual ? entregaActual.integrantes.map(id => usuarios.find(u => u.idUsuario === id)).filter(Boolean) as Usuario[] : [], [entregaActual, usuarios]);

  const handleFeedbackChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    actualizarBorrador({ feedback: e.target.value });
  }, [actualizarBorrador]);

  const handleScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    actualizarBorrador({ puntaje: Number(e.target.value) });
  };

  const currentScore = borrador?.puntaje || 0;
  const currentFeedback = borrador?.feedback || 'La entrega está parcialmente bien. Deberían haber hecho bien el punto 2. Envíenme de nuevo la entrega completa con todos los puntos';

  const handleSaveDraft = useCallback(() => {
    // El borrador ya se guarda automáticamente por debounce, pero confirmamos
    alert('Borrador guardado');
  }, []);

  const handleSend = useCallback(() => {
    if (borrador?.feedback && borrador.puntaje !== undefined && borrador.puntaje > 0) {
      actualizarBorrador({ completo: true });
      alert('Corrección enviada');
    } else {
      alert('Completa el feedback y la calificación antes de enviar');
    }
  }, [borrador, actualizarBorrador]);

  const handleFileClick = useCallback(() => {
    // Por ahora, simular abrir un archivo de corrección
    setArchivoAbierto('correccion.pdf');
  }, [setArchivoAbierto]);

  return (
    <div className={styles.panelContainer}>
      <GradingControls 
        currentScore={currentScore} 
        onScoreChange={handleScoreChange}
        scaleValues={scaleValues}
        integrantes={integrantes}
      />

      <GradingEditor 
        value={currentFeedback} 
        onChange={handleFeedbackChange} 
      />

      <GradingActions 
        onSaveDraft={handleSaveDraft}
        onSend={handleSend}
        onFileClick={handleFileClick}
      />
    </div>
  );
};
