import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from './store/useAppStore'
import { Layout } from './components/layout/Layout'
import { StudentSubmission } from './features/grading/components/StudentSubmission'
import { GradingPanel } from './features/grading/components/GradingPanel'
import { usuarios as MOCK_USUARIOS } from './data/mockData'

function App() {
  // Use shallow comparison to avoid re-renders when other parts of the store change (like draft)
  const { setUsuarios, usuarioActual } = useAppStore(
    useShallow((state) => ({
      setUsuarios: state.setUsuarios,
      usuarioActual: state.usuarios[state.indiceUsuarioActual],
    }))
  );

  useEffect(() => {
    setUsuarios(MOCK_USUARIOS);
  }, [setUsuarios]);

  return (
    <Layout>
      {usuarioActual ? (
        <>
          <StudentSubmission usuario={usuarioActual} />
          <GradingPanel />
        </>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Cargando alumnos...
        </div>
      )}
    </Layout>
  )
}

export default App
