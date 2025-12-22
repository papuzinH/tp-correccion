import { memo } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '../../../../../shared/ui/Button';
import styles from './GradingActions.module.css';

interface GradingActionsProps {
  onSaveDraft: () => void;
  onSend: () => void;
  onFileClick: () => void;
  attachedFilesCount?: number;
  isLoading?: boolean;
}

export const GradingActions = memo(({ onSaveDraft, onSend, onFileClick, attachedFilesCount = 0, isLoading = false }: GradingActionsProps) => {
  return (
    <div className={styles.bottomBar}>
      <Button 
        variant={attachedFilesCount > 0 ? 'primary' : 'secondary'}
        icon={<FileText size={18} color={attachedFilesCount > 0 ? "#ffffff" : "#1f2937"} />}
        onClick={onFileClick}
        className={styles.fileButton}
        disabled={isLoading}
      >
        {attachedFilesCount > 0 && (
          <span className={styles.badge}>{attachedFilesCount}</span>
        )}
      </Button>

      <div className={styles.actionButtons}>
        <Button variant="secondary" onClick={onSaveDraft} disabled={isLoading}>
          Guardar borrador
        </Button>
        <Button variant="primary" onClick={onSend} disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar corrección'}
        </Button>
      </div>
    </div>
  );
});

GradingActions.displayName = 'GradingActions';
