import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FileText } from 'lucide-react';
import { Button } from '../../../../../shared/ui/Button';
import { useAppStore } from '../../../../../store/useAppStore';
import styles from './AttachmentList.module.css';

interface AttachmentListProps {
  files: string[];
  variant: 'student' | 'teacher';
  clearAnnotations?: boolean;
}

export const AttachmentList = memo(({ files, variant, clearAnnotations = false }: AttachmentListProps) => {
  const { archivoAbierto, setArchivoAbierto, actualizarBorrador } = useAppStore(
    useShallow((state) => ({
      archivoAbierto: state.archivoAbierto,
      setArchivoAbierto: state.setArchivoAbierto,
      actualizarBorrador: state.actualizarBorrador,
    }))
  );

  if (files.length === 0) return null;

  const handleFileClick = (file: string) => {
    if (archivoAbierto === file) {
      setArchivoAbierto(null);
    } else {
      if (clearAnnotations) {
        actualizarBorrador({ anotacionesPDF: null });
      }
      setArchivoAbierto(file);
    }
  };

  return (
    <div className={styles.container}>
      {files.map((file, index) => (
        <Button
          key={index}
          className={`${styles.chip} ${styles[variant]}`}
          icon={<FileText size={16} />}
          onClick={() => handleFileClick(file)}
        >
          {file}
        </Button>
      ))}
    </div>
  );
});

AttachmentList.displayName = 'AttachmentList';
