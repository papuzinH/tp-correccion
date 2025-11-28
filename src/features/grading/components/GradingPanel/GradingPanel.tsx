import React, { useCallback, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../../store/useAppStore';
import { GradingControls } from './GradingControls';
import { GradingEditor } from './GradingEditor';
import { GradingActions } from './GradingActions';
import { tpConfiguracion, escalasDeNotas } from '../../../../data/mockData';
import { Usuario } from '../../../../types';
import styles from './GradingPanel.module.css';

export const GradingPanel: React.FC = () => {
  const { borrador, actualizarBorrador, entregas, indiceEntregaActual, usuarios } = useAppStore(
    useShallow((state) => ({
      borrador: state.borrador,
      actualizarBorrador: state.actualizarBorrador,
      entregas: state.entregas,
      indiceEntregaActual: state.indiceEntregaActual,
      usuarios: state.usuarios,
    }))
  );
  
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const entregaActual = entregas[indiceEntregaActual];
  const escalaActual = escalasDeNotas.find(escala => escala.idEscala === tpConfiguracion.idEscala);
  const scaleValues = escalaActual ? escalaActual.valores : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const integrantes = entregaActual ? entregaActual.integrantes.map(id => usuarios.find(u => u.idUsuario === id)).filter(Boolean) as Usuario[] : [];

  const handleFeedbackChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      actualizarBorrador({ feedback: value });
    }, 500); // 500ms debounce
  }, [actualizarBorrador]);

  const handleScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    actualizarBorrador({ puntaje: Number(e.target.value) });
  };

  const currentScore = borrador?.puntaje || 0;
  const defaultFeedback = borrador?.feedback || 'La entrega está parcialmente bien. Deberían haber hecho bien el punto 2. Envíenme de nuevo la entrega completa con todos los puntos';

  return (
    <div className={styles.panelContainer}>
      <GradingControls 
        currentScore={currentScore} 
        onScoreChange={handleScoreChange}
        scaleValues={scaleValues}
        integrantes={integrantes}
      />

      <GradingEditor 
        defaultValue={defaultFeedback} 
        onChange={handleFeedbackChange} 
      />

      <GradingActions />
    </div>
  );
};
