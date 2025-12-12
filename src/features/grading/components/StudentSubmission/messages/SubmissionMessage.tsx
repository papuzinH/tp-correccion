import { memo } from 'react';
import { Calendar } from 'lucide-react';
import { VersionEntrega } from '../../../../../types';
import { AttachmentList } from '../attachments/AttachmentList';
import { formatDate } from '../../../../../shared/utils/formatters';
import styles from './SubmissionMessage.module.css';

interface SubmissionMessageProps {
  version: VersionEntrega;
  userName: string;
  isGroup: boolean;
  clearAnnotations?: boolean;
}

export const SubmissionMessage = memo(({ version, userName, isGroup, clearAnnotations }: SubmissionMessageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerText}>
          {userName} realizó una entrega {isGroup ? 'grupal' : 'individual'}
        </span>
        <div className={styles.date}>
          <Calendar size={16} className={styles.icon} />
          <span>{formatDate(version.fecha)}</span>
        </div>
      </div>

      <div className={styles.bubble}>
        {version.texto && <p className={styles.text}>{version.texto}</p>}
        <AttachmentList files={version.adjuntos} variant="student" clearAnnotations={clearAnnotations} />
      </div>
    </div>
  );
});

SubmissionMessage.displayName = 'SubmissionMessage';
