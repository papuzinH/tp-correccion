import { FileText } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useAppStore } from '../../../../store/useAppStore';
import styles from './AttachmentList.module.css';

interface AttachmentListProps {
  files: string[];
  variant: 'student' | 'teacher';
}

export const AttachmentList = ({ files, variant }: AttachmentListProps) => {
  const { archivoAbierto, setArchivoAbierto } = useAppStore();

  if (files.length === 0) return null;

  const handleFileClick = (file: string) => {
    if (archivoAbierto === file) {
      setArchivoAbierto(null);
    } else {
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
};
