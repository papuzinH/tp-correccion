import { memo, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { Calendar, FileText } from 'lucide-react';
import { Entrega, VersionEntrega } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { mockState } from '../../../data/mockData';
import styles from './StudentSubmission.module.css';

interface StudentSubmissionProps {
  entrega: Entrega;
}

export const StudentSubmission = memo(({ entrega }: StudentSubmissionProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sortedVersions = useMemo(() => 
    [...entrega.versiones].sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    ),
    [entrega.versiones]
  );

  const versionsToShow = showHistory ? sortedVersions : [sortedVersions[sortedVersions.length - 1]];
  const previousVersionsCount = sortedVersions.length - 1;

  useLayoutEffect(() => {
    // Scroll to bottom immediately before paint to maintain visual position of the latest version
    bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'instant' });
  }, [showHistory, sortedVersions]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}hs`;
  };

  const getUserName = (userId: number) => {
    const user = mockState.usuarios.find(u => u.idUsuario === userId);
    return user ? `${user.nombre} ${user.apellido}` : 'Usuario desconocido';
  };

  return (
    <div className={styles.container}>
      {previousVersionsCount > 0 && (
        <a 
          href="#" 
          className={styles.historyLink}
          onClick={(e) => {
            e.preventDefault();
            setShowHistory(!showHistory);
          }}
        >
          {showHistory ? 'Ocultar entregas anteriores' : `Ver entregas anteriores (${previousVersionsCount})`}
        </a>
      )}

      <div className={styles.versionsList}>
        {versionsToShow.map((version: VersionEntrega) => (
          <div key={version.idVersionEntregaTP} className={styles.card} style={{ marginBottom: '1rem' }}>
            <div className={styles.cardHeader}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {getUserName(version.idUsuario)} realizó una entrega {mockState.tpConfiguracion.esGrupal ? 'grupal' : 'individual'}
                </span>
              </div>
              
              <div className={styles.dateInfo}>
                <Calendar size={18} className={styles.calendarIcon} />
                <span>{formatDate(version.fecha)}</span>
              </div>
            </div>

            <div className={styles.cardBody}>
              {version.texto && (
                <p>{version.texto}</p>
              )}
              
              {version.adjuntos.length > 0 && (
                <div className={styles.attachmentContainer}>
                  {version.adjuntos.map((adjunto, index) => (
                    <Button 
                      key={index}
                      className={styles.attachmentChip}
                      icon={<FileText size={16} />}
                    >
                      {adjunto}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
});

StudentSubmission.displayName = 'StudentSubmission';
