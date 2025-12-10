import { useCallback, Suspense } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../../store/useAppStore';
import { AdobePDFViewer } from '../../../../components/ui/AdobePDFViewer';
import { StudentSubmission } from '../StudentSubmission/StudentSubmission';
import { GradingPanel } from '../GradingPanel/GradingPanel';
import { useResizableSidebar } from '../../hooks/useResizableSidebar';
import TesisPDF from '../../../../data/Tesis.pdf';
import styles from './GradingWorkspace.module.css';

export const GradingWorkspace = () => {
  const { entregaActual, archivoAbierto, borrador, actualizarBorrador } = useAppStore(
    useShallow((state) => ({
      entregaActual: state.entregas[state.indiceEntregaActual],
      archivoAbierto: state.archivoAbierto,
      borrador: state.borrador,
      actualizarBorrador: state.actualizarBorrador,
    }))
  );

  // Lógica de redimensionamiento extraída al hook
  const { width: sidebarWidth, isResizing, startResizing } = useResizableSidebar();

  const handleAnnotationsChange = useCallback((annotations: string) => {
    actualizarBorrador({ anotacionesPDF: annotations });
  }, [actualizarBorrador]);

  if (!entregaActual) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
        Cargando entregas...
      </div>
    );
  }

  return (
    <div className={styles.splitView}>
      <div 
        className={`${styles.pdfViewer} ${archivoAbierto ? styles.pdfViewerOpen : ''}`}
        style={{ 
          width: archivoAbierto ? sidebarWidth : 0,
          transition: isResizing ? 'none' : undefined
        }}
      >
        <div style={{ width: sidebarWidth, height: '100%', pointerEvents: isResizing ? 'none' : 'auto' }}>
          {archivoAbierto && (
            <AdobePDFViewer 
              url={TesisPDF}
              fileName={archivoAbierto}
              clientId="05e453fb3be64b418d2441a9db2bdbd6"
              initialAnnotations={borrador?.anotacionesPDF}
              onAnnotationsChange={handleAnnotationsChange}
            />
          )}
        </div>
      </div>
      
      <div
        className={`${styles.resizer} ${isResizing ? styles.resizerActive : ''}`}
        onMouseDown={startResizing}
        style={{ display: archivoAbierto ? 'block' : 'none' }}
      />

      <div className={styles.rightPanel}>
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando...</div>}>
          <div className={styles.contentContainer}>
            <StudentSubmission key={entregaActual.idEntregaTP} entrega={entregaActual} />
          </div>
          <div className={styles.fixedPanel}>
            <GradingPanel />
          </div>
        </Suspense>
      </div>
    </div>
  );
};
