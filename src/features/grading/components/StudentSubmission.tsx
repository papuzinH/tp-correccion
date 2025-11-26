import { memo, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { Entrega, VersionEntrega } from '../../../types';
import { mockState } from '../../../data/mockData';
import { SubmissionMessage } from './SubmissionMessage';
import { CorrectionMessage } from './CorrectionMessage';
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
        {versionsToShow.map((version: VersionEntrega) => {
          const hasCorrection = 
            version.fechaCorreccion != null || 
            version.devolucion != null || 
            (version.adjuntosCorreccion != null && version.adjuntosCorreccion.length > 0) || 
            version.anotacionesPDF != null || 
            version.nota != null || 
            version.esReentrega != null;

          return (
            <div key={version.idVersionEntregaTP} className={styles.versionBlock}>
              <SubmissionMessage 
                version={version} 
                userName={getUserName(version.idUsuario)}
                isGroup={mockState.tpConfiguracion.esGrupal}
              />

              {hasCorrection && (
                <CorrectionMessage version={version} />
              )}
            </div>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
});

StudentSubmission.displayName = 'StudentSubmission';
