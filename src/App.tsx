import { useEffect, lazy, Suspense } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from './store/useAppStore'
import { Layout } from './components/layout/Layout'
import { usuarios as MOCK_USUARIOS, entregas as MOCK_ENTREGAS } from './data/mockData'

// Lazy loading del workspace completo
const GradingWorkspace = lazy(() => import('./features/grading').then(m => ({ default: m.GradingWorkspace })));

function App() {
  const { setUsuarios, setEntregas } = useAppStore(
    useShallow((state) => ({
      setUsuarios: state.setUsuarios,
      setEntregas: state.setEntregas,
    }))
  );

  useEffect(() => {
    setUsuarios(MOCK_USUARIOS);
    setEntregas(MOCK_ENTREGAS);
  }, [setUsuarios, setEntregas]);

  return (
    <Layout>
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando espacio de trabajo...</div>}>
        <GradingWorkspace />
      </Suspense>
    </Layout>
  )
}

export default App
