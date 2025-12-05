import { memo } from 'react';
import { VersionEntrega } from '../../../../types';
import { getCorrectionType } from '../../../../utils/gradingHelpers';
import { AttachmentList } from './AttachmentList';
import { formatDate } from '../../../../utils/formatters';
import styles from './CorrectionMessage.module.css';

interface CorrectionMessageProps {
  version: VersionEntrega;
}

export const CorrectionMessage = memo(({ version }: CorrectionMessageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerText}>
          Docente {getCorrectionType(version)} - {version.fechaCorreccion && formatDate(version.fechaCorreccion)}


        </span>
      </div>
      <div className={styles.bubble}>
        {version.devolucion && <p className={styles.text}>{version.devolucion}</p>}
        {version.nota != null && (
          <p className={styles.grade}>Calificación: {version.nota}</p>
        )}
        <AttachmentList files={version.adjuntosCorreccion || []} variant="teacher" />
      </div>
    </div>
  );
});

CorrectionMessage.displayName = 'CorrectionMessage';
