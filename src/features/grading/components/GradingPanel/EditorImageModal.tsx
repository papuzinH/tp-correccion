import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { X, Image as ImageIcon } from 'lucide-react';
import styles from './EditorImageModal.module.css';

interface EditorImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (files: File[]) => void;
}

const EditorImageModal: React.FC<EditorImageModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInsert = () => {
    onInsert(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };
  
  const handleClose = () => {
      setSelectedFiles([]);
      onClose();
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': []
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Insertar imágenes</h2>
        <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Suelta las imágenes aquí...</p>
          ) : (
            <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
          )}
        </div>
        {selectedFiles.length > 0 && (
          <div className={styles.fileList}>
            {selectedFiles.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <ImageIcon size={16} />
                <span>{file.name}</span>
                <button onClick={() => removeFile(index)} className={styles.removeButton}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleInsert} disabled={selectedFiles.length === 0}>Insertar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditorImageModal;
