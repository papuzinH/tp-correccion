import React, { memo, useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { IndividualGradingModal } from './IndividualGradingModal';
import { Usuario } from '../../../../types';
import styles from './GradingControls.module.css';

interface GradingControlsProps {
  currentScore: number;
  onScoreChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  scaleValues: (string | number)[];
  integrantes: Usuario[];
}

export const GradingControls = memo(({ currentScore, onScoreChange, scaleValues, integrantes }: GradingControlsProps) => {
  const [tipoDevolucion, setTipoDevolucion] = useState<string>('Tipo de devolución');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.controlsRow}>
      <div className={styles.selectWrapper}>
        <select 
          className={`${styles.select} ${styles.selectPrimary}`}
          value={tipoDevolucion}
          onChange={(e) => setTipoDevolucion(e.target.value)}
        >
          <option value="Tipo de devolución" disabled>Tipo de devolución</option>
          <option value="Calificación final">Calificación final</option>
          <option value="Calificación individual">Calificación individual</option>
          <option value="Solicitud de reentrega">Solicitud de reentrega</option>
        </select>
      </div>

      <div className={styles.selectWrapper}>
        {tipoDevolucion === "Calificación individual" ? (
          <Button 
            variant="secondary" 
            icon={<span>📝</span>}
            onClick={() => setIsModalOpen(true)}
          >
            Asignar notas
          </Button>
        ) : (
          <select 
            className={`${styles.select} ${styles.selectPrimary}`}
            value={currentScore} 
            onChange={onScoreChange}
            disabled={tipoDevolucion !== "Calificación final" && tipoDevolucion !== "Calificación individual"}
          >
            <option value={0} disabled>Ingrese calif.</option>
            {scaleValues.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        )}
      </div>
      <IndividualGradingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        integrantes={integrantes} 
        scaleValues={scaleValues} 
      />
    </div>
  );
});

GradingControls.displayName = 'GradingControls';
