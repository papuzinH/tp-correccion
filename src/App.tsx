import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from './store/useAppStore'
import { Layout } from './components/layout/Layout'
import { StudentSubmission } from './features/grading/components/StudentSubmission'
import { GradingPanel } from './features/grading/components/GradingPanel'

// Mock data inicial
const MOCK_STUDENTS = [
  { id: '1', name: 'Ana García', email: 'ana.garcia@example.com' },
  { id: '2', name: 'Carlos López', email: 'carlos.lopez@example.com' },
  { id: '3', name: 'María Rodríguez', email: 'maria.rodriguez@example.com' },
];

function App() {
  // Use shallow comparison to avoid re-renders when other parts of the store change (like draft)
  const { setStudents, currentStudent } = useAppStore(
    useShallow((state) => ({
      setStudents: state.setStudents,
      currentStudent: state.students[state.currentStudentIndex],
    }))
  );

  useEffect(() => {
    setStudents(MOCK_STUDENTS);
  }, [setStudents]);

  return (
    <Layout>
      {currentStudent ? (
        <>
          <StudentSubmission student={currentStudent} />
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
