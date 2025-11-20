import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { Layout } from './components/layout/Layout'

// Mock data inicial
const MOCK_STUDENTS = [
  { id: '1', name: 'Ana García', email: 'ana.garcia@example.com' },
  { id: '2', name: 'Carlos López', email: 'carlos.lopez@example.com' },
  { id: '3', name: 'María Rodríguez', email: 'maria.rodriguez@example.com' },
];

function App() {
  const { setStudents } = useAppStore()

  useEffect(() => {
    setStudents(MOCK_STUDENTS);
  }, [setStudents]);

  return (
    <Layout>
      <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2>Área de Trabajo</h2>
        <p>Aquí se cargará el formulario de corrección y el PDF del alumno.</p>
      </div>
    </Layout>
  )
}

export default App
