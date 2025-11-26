import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from './store/useAppStore'
import { Layout } from './components/layout/Layout'
import { StudentSubmission } from './features/grading/components/StudentSubmission'
import { GradingPanel } from './features/grading/components/GradingPanel'
import { usuarios as MOCK_USUARIOS, entregas as MOCK_ENTREGAS } from './data/mockData'

function App() {
  // Use shallow comparison to avoid re-renders when other parts of the store change (like draft)
  const { setUsuarios, setEntregas, entregaActual } = useAppStore(
    useShallow((state) => ({
      setUsuarios: state.setUsuarios,
      setEntregas: state.setEntregas,
      entregaActual: state.entregas[state.indiceEntregaActual],
    }))
  );

  useEffect(() => {
    setUsuarios(MOCK_USUARIOS);
    setEntregas(MOCK_ENTREGAS);
  }, [setUsuarios, setEntregas]);

  return (
    <Layout>
      {entregaActual ? (
        <>
          <StudentSubmission entrega={entregaActual} />
          <GradingPanel />
        </>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Cargando entregas...
        </div>
      )}
    </Layout>
  )
}

export default App
