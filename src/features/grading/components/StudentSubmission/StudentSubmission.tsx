import { memo, useRef, useLayoutEffect, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Entrega, VersionEntrega } from '../../../../types';
import { useAppStore } from '../../../../store/useAppStore';
import { hasCorrection } from '../../../../utils/gradingHelpers';
import { useVersions } from '../../../../hooks/useVersions';
import { SubmissionMessage } from './SubmissionMessage';
import { CorrectionMessage } from './CorrectionMessage';
import styles from './StudentSubmission.module.css';

interface StudentSubmissionProps {
  entrega: Entrega;
}

export const StudentSubmission = memo(({ entrega }: StudentSubmissionProps) => {
  const { usuarios, tpConfiguracion } = useAppStore(useShallow(state => ({ usuarios: state.usuarios, tpConfiguracion: state.tpConfiguracion })));
  const bottomRef = useRef<HTMLDivElement>(null);
  const { versionsToShow, previousVersionsCount, showHistory, toggleHistory } = useVersions(entrega);

  useLayoutEffect(() => {
    // Scroll to bottom immediately before paint to maintain visual position of the latest version
    bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'instant' });
  }, [showHistory, versionsToShow]);

  const getUserName = useCallback((userId: number) => {
    const user = usuarios.find(u => u.idUsuario === userId);
    return user ? `${user.nombre} ${user.apellido}` : 'Usuario desconocido';
  }, [usuarios]);

  return (
    <div className={styles.container}>
      {previousVersionsCount > 0 && (
        <a
          href="#"
          className={styles.historyLink}
          onClick={(e) => {
            e.preventDefault();
            toggleHistory();
          }}
        >
          {showHistory ? 'Ocultar entregas anteriores' : `Ver entregas anteriores (${previousVersionsCount})`}
        </a>
      )}

      <div className={styles.versionsList}>
        {versionsToShow.map((version: VersionEntrega) => {
          const hasCorr = hasCorrection(version);

          return (
            <div key={version.idVersionEntregaTP} className={styles.versionBlock}>
              <SubmissionMessage 
                version={version} 
                userName={getUserName(version.idUsuario)}
                isGroup={tpConfiguracion.esGrupal}
              />

              {hasCorr && (
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
