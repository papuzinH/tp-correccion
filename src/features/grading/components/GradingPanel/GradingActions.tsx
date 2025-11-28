import { memo } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import styles from './GradingActions.module.css';

interface GradingActionsProps {
  onSaveDraft: () => void;
  onSend: () => void;
  onFileClick: () => void;
}

export const GradingActions = memo(({ onSaveDraft, onSend, onFileClick }: GradingActionsProps) => {
  return (
    <div className={styles.bottomBar}>
      <Button 
        variant='secondary'
        icon={<FileText size={18} color="#1f2937" />}
        onClick={onFileClick}
      />

      <div className={styles.actionButtons}>
        <Button variant="secondary" onClick={onSaveDraft}>
          Guardar borrador
        </Button>
        <Button onClick={onSend}>
          Enviar
        </Button>
      </div>
    </div>
  );
});

GradingActions.displayName = 'GradingActions';
