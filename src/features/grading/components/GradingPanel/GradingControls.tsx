import React, { memo } from 'react';
import styles from './GradingControls.module.css';

interface GradingControlsProps {
  currentScore: number;
  onScoreChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const GradingControls = memo(({ currentScore, onScoreChange }: GradingControlsProps) => {
  return (
    <div className={styles.controlsRow}>
      <div className={styles.selectWrapper}>
        <select className={`${styles.select} ${styles.selectPrimary}`}>
          <option value="standard">Tipo de devolución</option>
          <option value="detailed">Detallada</option>
          <option value="quick">Rápida</option>
        </select>
      </div>

      <div className={styles.selectWrapper}>
        <select 
          className={`${styles.select} ${styles.selectSecondary}`}
          value={currentScore} 
          onChange={onScoreChange}
          disabled
        >
          <option value={0}>Ingrese calif.</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>
    </div>
  );
});

GradingControls.displayName = 'GradingControls';
