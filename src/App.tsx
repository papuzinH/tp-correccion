import { useEffect, lazy, Suspense } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from './store/useAppStore'
import { Layout } from './features/layout/Layout'

// Lazy loading del workspace completo
const GradingWorkspace = lazy(() => import('./features/grading').then(m => ({ default: m.GradingWorkspace })));

function App() {
  const { inicializar } = useAppStore(
    useShallow((state) => ({
      inicializar: state.inicializar,
    }))
  );

  useEffect(() => {
    // Configuración para testeo: idActividad = 1, idComision = 1
    const idActividad = 1; 
    const idComision = 1;
    inicializar(idActividad, idComision);
  }, [inicializar]);


  return (
    <Layout>
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando espacio de trabajo...</div>}>
        <GradingWorkspace />
      </Suspense>
    </Layout>
  )
}

export default App
