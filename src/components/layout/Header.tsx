import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { 
    currentStudentIndex, 
    students, 
    nextStudent, 
    prevStudent 
  } = useAppStore();

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
        <h1 className={styles.title}>Principios de la Composición Visual</h1>
        <p className={styles.subtitle}>
          {currentStudent ? `${currentStudent.name} (${currentStudentIndex + 1}/${students.length})` : 'Sin alumnos cargados'}
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
