import { VersionEntrega } from '../../../../types';
import { AttachmentList } from './AttachmentList';
import { formatDate } from '../../../../utils/formatters';
import styles from './CorrectionMessage.module.css';

interface CorrectionMessageProps {
  version: VersionEntrega;
}

export const CorrectionMessage = ({ version }: CorrectionMessageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerText}>
          Docente {version.esReentrega ? 'solicitó reentrega' : 'calificó'}
          {version.nota != null && ` (Nota: ${version.nota})`}
        </span>
        {version.fechaCorreccion && (
          <span className={styles.date}>
            - {formatDate(version.fechaCorreccion)}
          </span>
        )}
      </div>

      <div className={styles.bubble}>
        {version.devolucion && <p className={styles.text}>{version.devolucion}</p>}
        <AttachmentList files={version.adjuntosCorreccion || []} variant="teacher" />
      </div>
    </div>
  );
};
