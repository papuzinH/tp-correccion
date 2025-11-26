import React, { useCallback, useRef } from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import { GradingControls } from './GradingControls';
import { GradingEditor } from './GradingEditor';
import { GradingActions } from './GradingActions';
import styles from './GradingPanel.module.css';

export const GradingPanel: React.FC = () => {
  const { borrador, actualizarBorrador } = useAppStore();
  
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      />

      <GradingEditor 
        defaultValue={defaultFeedback} 
        onChange={handleFeedbackChange} 
      />

      <GradingActions />
    </div>
  );
};
