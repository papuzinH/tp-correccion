import { memo } from 'react';
import { Calendar, FileText } from 'lucide-react';
import { Student } from '../../../types/types';
import styles from './StudentSubmission.module.css';

interface StudentSubmissionProps {
  student: Student;
}

export const StudentSubmission = memo(({ student }: StudentSubmissionProps) => {
  // Mock submission data for now
  const submissionDate = "30/10/2024 18:13hs";

  return (
    <div className={styles.container}>
      <a href="#" className={styles.historyLink}>
        Ver entregas anteriores (1)
      </a>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{student.name} realizó una entrega grupal</span>
          </div>
          
          <div className={styles.dateInfo}>
            <Calendar size={18} className={styles.calendarIcon} />
            <span>{submissionDate}</span>
          </div>
        </div>

        <div className={styles.cardBody}>
          <p>
            Profe, te envío el PDF correcto
          </p>
          
          <div className={styles.attachmentContainer}>
            <button className={styles.attachmentChip}>
              entregavfinal.pdf
              <FileText size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

StudentSubmission.displayName = 'StudentSubmission';
