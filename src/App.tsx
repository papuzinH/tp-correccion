import { useEffect, useState, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from './store/useAppStore'
import { Layout } from './components/layout/Layout'
import { StudentSubmission } from './features/grading/components/StudentSubmission/StudentSubmission'
import { GradingPanel } from './features/grading/components/GradingPanel/GradingPanel'
import { usuarios as MOCK_USUARIOS, entregas as MOCK_ENTREGAS } from './data/mockData'
import TesisPDF from './data/Tesis.pdf'
import styles from './App.module.css'

function App() {
  // Use shallow comparison to avoid re-renders when other parts of the store change (like draft)
  const { setUsuarios, setEntregas, entregaActual, archivoAbierto } = useAppStore(
    useShallow((state) => ({
      setUsuarios: state.setUsuarios,
      setEntregas: state.setEntregas,
      entregaActual: state.entregas[state.indiceEntregaActual],
      archivoAbierto: state.archivoAbierto,
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
              <iframe 
                src={TesisPDF} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none',
                  pointerEvents: isResizing ? 'none' : 'auto'
                }} 
                title="Visor de archivos"
              />
            </div>
          </div>
          
          <div
            className={`${styles.resizer} ${isResizing ? styles.resizerActive : ''}`}
            onMouseDown={startResizing}
            style={{ display: archivoAbierto ? 'block' : 'none' }}
          />

          <div className={styles.rightPanel}>
            <div className={styles.contentContainer}>
              <StudentSubmission key={entregaActual.idEntregaTP} entrega={entregaActual} />
            </div>
            <div className={styles.fixedPanel}>
              <GradingPanel />
            </div>
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
