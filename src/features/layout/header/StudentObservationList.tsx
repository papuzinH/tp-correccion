import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Usuario } from '../../../types';
import styles from './StudentObservationList.module.css';

interface StudentObservationListProps {
  integrantes: Usuario[];
}

export const StudentObservationList = ({ integrantes }: StudentObservationListProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [observations, setObservations] = useState<Record<number, string>>({});

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleObservationChange = (id: number, value: string) => {
    setObservations(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className={styles.accordionList}>
      {integrantes.map(student => (
        <div 
          key={student.idUsuario} 
          className={`${styles.accordionItem} ${expandedId === student.idUsuario ? styles.expanded : ''}`}
        >
          <div className={styles.accordionHeader} onClick={() => toggleExpand(student.idUsuario)}>
            <div className={styles.studentProfile}>
              {student.avatarUrl ? (
                <img src={student.avatarUrl} alt={student.nombre} className={styles.avatar} />
              ) : (
                <div className={styles.avatar}>
                  {student.nombre[0]}{student.apellido[0]}
                </div>
              )}
              <div className={styles.studentInfo}>
                <span className={styles.studentName}>{student.nombre} {student.apellido}</span>
                <span className={styles.studentCourse}>{student.curso || 'Sin curso'}</span>
              </div>
            </div>
            <div className={styles.accordionIcon}>
              {expandedId === student.idUsuario ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
          
          <div className={`${styles.accordionContent} ${expandedId === student.idUsuario ? styles.contentExpanded : ''}`}>
            <div className={styles.accordionInner}>
              <textarea
                className={styles.observationTextarea}
                placeholder="Escriba su observación privada"
                value={observations[student.idUsuario] || ''}
                onChange={(e) => handleObservationChange(student.idUsuario, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
