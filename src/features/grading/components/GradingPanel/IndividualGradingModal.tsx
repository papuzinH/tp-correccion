import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Usuario } from '../../../../types';
import { useAppStore } from '../../../../store/useAppStore';
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
  const { borrador, actualizarBorrador } = useAppStore(useShallow(state => ({
    borrador: state.borrador,
    actualizarBorrador: state.actualizarBorrador,
  })));

  const [notas, setNotas] = useState<Record<number, number | string>>(borrador?.notasIndividuales || {});

  const handleNotaChange = (idUsuario: number, value: string) => {
    const numValue = Number(value);
    const finalValue = isNaN(numValue) ? value : numValue;
    setNotas(prev => ({ ...prev, [idUsuario]: finalValue }));
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
                  aria-label={`Seleccionar nota para ${integrante.nombre} ${integrante.apellido}`}
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
          <Button variant="primary" onClick={() => { 
            actualizarBorrador({ notasIndividuales: notas }); 
            alert('Notas individuales asignadas'); 
            onClose(); 
          }}>
            Asignar
          </Button>
        </div>
      </div>
    </Modal>
  );
};