import { FileText } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import styles from './AttachmentList.module.css';

interface AttachmentListProps {
  files: string[];
  variant: 'student' | 'teacher';
}

export const AttachmentList = ({ files, variant }: AttachmentListProps) => {
  if (files.length === 0) return null;

  return (
    <div className={styles.container}>
      {files.map((file, index) => (
        <Button
          key={index}
          className={`${styles.chip} ${styles[variant]}`}
          icon={<FileText size={16} />}
        >
          {file}
        </Button>
      ))}
    </div>
  );
};
