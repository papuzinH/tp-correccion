import React, { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Usuario } from '../../../../types';
import styles from './IndividualGradingModal.module.css';

interface IndividualGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrantes: Usuario[];
  scaleValues: (string | number)[];
}

export const IndividualGradingModal: React.FC<IndividualGradingModalProps> = ({
  isOpen,
  onClose,
  integrantes,
  scaleValues,
}) => {
  const [notas, setNotas] = useState<Record<number, number | string>>({});

  const handleNotaChange = (idUsuario: number, value: string) => {
    setNotas(prev => ({ ...prev, [idUsuario]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Asignar notas individuales</h2>
        <div className={styles.content}>
          <div className={styles.left}>
            {integrantes.map(integrante => (
              <div key={integrante.idUsuario} className={styles.integrante}>
                <div className={styles.avatar}>
                  {integrante.nombre[0]}{integrante.apellido[0]}
                </div>
                <div className={styles.info}>
                  <p className={styles.nombre}>{integrante.nombre} {integrante.apellido}</p>
                  <p className={styles.curso}>{integrante.curso}</p>
                </div>
                <select
                  className={styles.select}
                  value={notas[integrante.idUsuario] || ''}
                  onChange={(e) => handleNotaChange(integrante.idUsuario, e.target.value)}
                >
                  <option value="" disabled>Ingrese calif.</option>
                  {scaleValues.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={() => { /* lógica para asignar */ console.log(notas); onClose(); }}>Asignar</Button>
        </div>
      </div>
    </Modal>
  );
};