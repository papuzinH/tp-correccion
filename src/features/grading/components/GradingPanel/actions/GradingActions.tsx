import { memo } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '../../../../../shared/ui/Button';
import styles from './GradingActions.module.css';

interface GradingActionsProps {
  onSaveDraft: () => void;
  onSend: () => void;
  onFileClick: () => void;
  attachedFilesCount?: number;
}

export const GradingActions = memo(({ onSaveDraft, onSend, onFileClick, attachedFilesCount = 0 }: GradingActionsProps) => {
  return (
    <div className={styles.bottomBar}>
      <Button 
        variant={attachedFilesCount > 0 ? 'primary' : 'secondary'}
        icon={<FileText size={18} color={attachedFilesCount > 0 ? "#ffffff" : "#1f2937"} />}
        onClick={onFileClick}
        className={styles.fileButton}
      >
        {attachedFilesCount > 0 && (
          <span className={styles.badge}>{attachedFilesCount}</span>
        )}
      </Button>

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
