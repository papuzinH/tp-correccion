import React from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store/useAppStore';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { 
    currentStudentIndex, 
    students, 
    nextStudent, 
    prevStudent 
  } = useAppStore(
    useShallow((state) => ({
      currentStudentIndex: state.currentStudentIndex,
      students: state.students,
      nextStudent: state.nextStudent,
      prevStudent: state.prevStudent,
    }))
  );

  const currentStudent = students[currentStudentIndex];
  const hasPrev = currentStudentIndex > 0;
  const hasNext = currentStudentIndex < students.length - 1;

  return (
    <header className={styles.header}>
      <button 
        className={styles.navButton} 
        onClick={prevStudent}
        disabled={!hasPrev}
      >
        <ChevronLeft size={20} />
        Anterior
      </button>

      <div className={styles.headerContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Principios de la Composición Visual - TP Evaluativo</h1>
          <Info size={20} className={styles.infoIcon} />
        </div>
        <p className={styles.subtitle}>
          <span className={styles.subtitleLabel}>Entrega grupal:</span> {currentStudent ? `${currentStudent.name}, Pepito Lopez, Alejo Perez, Armando Augusto, María López, Belén Escobar` : 'Sin alumnos'}
        </p>
      </div>

      <button 
        className={styles.navButton} 
        onClick={nextStudent}
        disabled={!hasNext}
      >
        Siguiente
        <ChevronRight size={20} />
      </button>
    </header>
  );
};
