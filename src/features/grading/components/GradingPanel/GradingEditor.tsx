import React, { memo } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';
import styles from './GradingEditor.module.css';

interface GradingEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const GradingEditor = memo(({ value, onChange }: GradingEditorProps) => {
  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <button className={styles.toolbarButton} aria-label="Negrita">
          <Bold size={16} />
        </button>
        <button className={styles.toolbarButton} aria-label="Cursiva">
          <Italic size={16} />
        </button>
        <button className={styles.toolbarButton} aria-label="Subrayado">
          <Underline size={16} />
        </button>
      </div>
      
      <textarea 
        className={styles.textarea} 
        placeholder="Escriba su devolución aquí..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
});

GradingEditor.displayName = 'GradingEditor';
