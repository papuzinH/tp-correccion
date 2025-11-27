import { Calendar, FileText, ExternalLink, Pencil } from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { formatDate } from '../../../utils/formatters';
import { TPConfiguracion, VersionEntrega } from '../../../types';
import styles from './TPInfoModal.module.css';

interface TPInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tpConfig: TPConfiguracion;
  escalaNombre: string;
  groupMembers: string;
  primeraEntrega: VersionEntrega | null;
  onOpenEditMembers: () => void;
}

export const TPInfoModal = ({
  isOpen,
  onClose,
  tpConfig,
  escalaNombre,
  groupMembers,
  primeraEntrega,
  onOpenEditMembers
}: TPInfoModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalSection}>
        <h2 className={styles.modalTitle}>Información del Trabajo Práctico:</h2>
        
        <div className={styles.modalRow}>
          <span className={styles.modalLabel}>Título:</span>
          <span className={styles.modalValue}>{tpConfig.alias}</span>
        </div>

        <div className={styles.modalRow}>
          <Calendar size={18} className="text-gray-500 mt-0.5" />
          <span className={styles.modalLabel}>Vigencia:</span>
          <span className={styles.modalValue}>
            {formatDate(tpConfig.fechaInicio)} a {formatDate(tpConfig.fechaVencimiento)}
          </span>
        </div>

        <div className={styles.modalRow}>
          <FileText size={18} className="text-gray-500 mt-0.5" />
          <span className={styles.modalLabel}>Escala de notas:</span>
          <span className={styles.modalValue}>{escalaNombre}</span>
        </div>

        <button className={styles.consignaButton}>
          <ExternalLink size={16} />
          Abrir consigna TP
        </button>
      </div>

      <div className={styles.modalSection}>
        <h2 className={styles.modalTitle}>Información de la entrega:</h2>
        
        <div className={styles.modalRow}>
          <span className={styles.modalLabel}>Entrega {tpConfig.esGrupal ? 'grupal' : 'individual'}:</span>
          <span className={styles.modalValue}>{groupMembers || 'Sin integrantes'}</span>
          <button 
            className={styles.editButton}
            onClick={onOpenEditMembers}
            aria-label="Editar observaciones de integrantes"
            title="Editar observaciones de integrantes"
          >
            <Pencil size={16} />
          </button>
        </div>

        {primeraEntrega && (
          <div className={styles.modalRow}>
            <span className={styles.modalLabel}>Primera entrega:</span>
            <span className={styles.modalValue}>
              📅 {formatDate(primeraEntrega.fecha)}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
