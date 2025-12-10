import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from './store/useAppStore'
import { Layout } from './components/layout/Layout'
import { usuarios as MOCK_USUARIOS, entregas as MOCK_ENTREGAS } from './data/mockData'
import { AdobePDFViewer } from './components/ui/AdobePDFViewer'

// Lazy loading para componentes pesados
const StudentSubmission = lazy(() => import('./features/grading/components/StudentSubmission/StudentSubmission').then(m => ({ default: m.StudentSubmission })));
const GradingPanel = lazy(() => import('./features/grading/components/GradingPanel/GradingPanel').then(m => ({ default: m.GradingPanel })));
import TesisPDF from './data/Tesis.pdf'
import styles from './App.module.css'

function App() {
  // Use shallow comparison to avoid re-renders when other parts of the store change (like draft)
  const { setUsuarios, setEntregas, entregaActual, archivoAbierto, borrador, actualizarBorrador } = useAppStore(
    useShallow((state) => ({
      setUsuarios: state.setUsuarios,
      setEntregas: state.setEntregas,
      entregaActual: state.entregas[state.indiceEntregaActual],
      archivoAbierto: state.archivoAbierto,
      borrador: state.borrador,
      actualizarBorrador: state.actualizarBorrador,
    }))
  );

  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX - 64; // Subtract sidebar width
      if (newWidth > 300 && newWidth < window.innerWidth - 400) {
         setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  useEffect(() => {
    setUsuarios(MOCK_USUARIOS);
    setEntregas(MOCK_ENTREGAS);
  }, [setUsuarios, setEntregas]);

  const handleAnnotationsChange = useCallback((annotations: string) => {
    actualizarBorrador({ anotacionesPDF: annotations });
  }, [actualizarBorrador]);

  return (
    <Layout>
      {entregaActual ? (
        <div className={styles.splitView}>
          <div 
            className={`${styles.pdfViewer} ${archivoAbierto ? styles.pdfViewerOpen : ''}`}
            style={{ 
              width: archivoAbierto ? sidebarWidth : 0,
              transition: isResizing ? 'none' : undefined
            }}
          >
            <div style={{ width: sidebarWidth, height: '100%' }}>
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
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Cargando entregas...
        </div>
      )}
    </Layout>
  )
}

export default App
