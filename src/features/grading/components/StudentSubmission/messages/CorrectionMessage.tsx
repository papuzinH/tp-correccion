import { memo, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FileText } from 'lucide-react';
import { VersionEntrega } from '../../../../../types';
import { getCorrectionType } from '../../../../../shared/utils/gradingHelpers';
import { AttachmentList } from '../attachments/AttachmentList';
import { formatDate } from '../../../../../shared/utils/formatters';
import { useAppStore } from '../../../../../store/useAppStore';
import styles from './CorrectionMessage.module.css';

interface CorrectionMessageProps {
  version: VersionEntrega;
}

export const CorrectionMessage = memo(({ version }: CorrectionMessageProps) => {
  const { setArchivoAbierto, actualizarBorrador, archivoAbierto } = useAppStore(
    useShallow((state) => ({
      setArchivoAbierto: state.setArchivoAbierto,
      actualizarBorrador: state.actualizarBorrador,
      archivoAbierto: state.archivoAbierto,
    }))
  );

  const handleOpenPdf = useCallback(() => {
    if (version.anotacionesPDF) {
      const fileName = version.adjuntos[0] || 'Documento corregido.pdf';
      
      if (archivoAbierto === fileName) {
        setArchivoAbierto(null);
      } else {
        // Cargamos las anotaciones en el borrador para que el visor las lea
        actualizarBorrador({ anotacionesPDF: version.anotacionesPDF });
        setArchivoAbierto(fileName);
      }
    }
  }, [version, setArchivoAbierto, actualizarBorrador, archivoAbierto]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerText}>
          Docente {getCorrectionType(version)} - {version.fechaCorreccion && formatDate(version.fechaCorreccion)}
        </span>
      </div>
      <div className={styles.bubble}>
        {version.devolucion && <p className={styles.text}>{version.devolucion}</p>}
        
        {version.anotacionesPDF && (
          <div className={styles.pdfChip} onClick={handleOpenPdf}>
            <FileText size={16} />
            <span>Ver correcciones en PDF</span>
          </div>
        )}

        {version.nota != null && (
          <p className={styles.grade}>Calificación: {version.nota}</p>
        )}
        <AttachmentList files={version.adjuntosCorreccion || []} variant="teacher" />
      </div>
    </div>
  );
});

CorrectionMessage.displayName = 'CorrectionMessage';
