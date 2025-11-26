import React from 'react';
import styles from './GradingEditor.module.css';

interface GradingEditorProps {
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const GradingEditor = ({ defaultValue, onChange }: GradingEditorProps) => {
  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
         <img 
           src="https://i.imgur.com/J8x5q5D.png" 
           alt="Toolbar" 
           className={styles.toolbarImage} 
           style={{ height: '28px', objectFit: 'contain', opacity: 0.8 }}
         />
      </div>
      
      <textarea 
        className={styles.textarea} 
        placeholder="Escriba su devolución aquí..."
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
};
