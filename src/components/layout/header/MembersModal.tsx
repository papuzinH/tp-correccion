import { Modal } from '../../ui/Modal';
import { Usuario } from '../../../types';
import { StudentObservationList } from './StudentObservationList';
import styles from './TPInfoModal.module.css'; // Reutilizamos estilos de título

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrantes: Usuario[];
}

export const MembersModal = ({ isOpen, onClose, integrantes }: MembersModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.modalTitle}>Integrantes de la entrega</h2>
      <StudentObservationList integrantes={integrantes} />
    </Modal>
  );
};
