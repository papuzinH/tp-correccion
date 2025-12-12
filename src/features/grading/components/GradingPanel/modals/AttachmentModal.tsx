import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Modal } from '../../../../../shared/ui/Modal';
import { Button } from '../../../../../shared/ui/Button';
import { X, FileText } from 'lucide-react';
import styles from './AttachmentModal.module.css';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachedFiles: File[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onAccept: () => void;
}

const AttachmentModal: React.FC<AttachmentModalProps> = ({
  isOpen,
  onClose,
  attachedFiles,
  onAddFiles,
  onRemoveFile,
  onAccept,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onAddFiles(acceptedFiles);
  }, [onAddFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Adjuntar archivos</h2>
        <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Suelta los archivos aquí...</p>
          ) : (
            <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar</p>
          )}
        </div>
        {attachedFiles.length > 0 && (
          <div className={styles.fileList}>
            {attachedFiles.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <FileText size={16} />
                <span>{file.name}</span>
                <button onClick={() => onRemoveFile(index)} className={styles.removeButton}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={onAccept}>Aceptar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AttachmentModal;