import { memo } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import styles from './GradingActions.module.css';

export const GradingActions = memo(() => {
  return (
    <div className={styles.bottomBar}>
      <Button 
        variant='secondary'
        icon={<FileText size={18} color="#1f2937" />}
      />

      <div className={styles.actionButtons}>
        <Button variant="secondary">
          Guardar borrador
        </Button>
        <Button>
          Enviar
        </Button>
      </div>
    </div>
  );
});

GradingActions.displayName = 'GradingActions';
