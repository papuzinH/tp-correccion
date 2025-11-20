import React, { useCallback, useRef } from 'react';
import { FileText } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import styles from './GradingPanel.module.css';

// Mock toolbar image URL (in a real app, this would be a local asset or a complex component)
// Using a placeholder div with styles to simulate the toolbar for now as requested by "Fake WYSIWYG"
// but trying to match the image better with CSS.

export const GradingPanel: React.FC = () => {
  const { draft, updateDraft } = useAppStore();
  
  // Use a ref for the debounce timer
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFeedbackChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      updateDraft({ feedback: value });
    }, 500); // 500ms debounce
  }, [updateDraft]);

  const handleScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateDraft({ score: Number(e.target.value) });
  };

  const currentScore = draft?.score || 0;

  return (
    <div className={styles.panelContainer}>
      <div className={styles.controlsRow}>
        <div className={styles.selectWrapper}>
          <select className={`${styles.select} ${styles.selectPrimary}`}>
            <option value="standard">Tipo de devolución</option>
            <option value="detailed">Detallada</option>
            <option value="quick">Rápida</option>
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <select 
            className={`${styles.select} ${styles.selectSecondary}`}
            value={currentScore} 
            onChange={handleScoreChange}
            disabled
          >
            <option value={0}>Ingrese calif.</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.editorContainer}>
        <div className={styles.toolbar}>
           {/* Simulating the toolbar from the image with a static image or complex CSS would be ideal. 
               For now, using a placeholder that looks like the image's toolbar structure */}
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
          defaultValue={draft?.feedback || 'La entrega está parcialmente bien. Deberían haber hecho bien el punto 2. Envíenme de nuevo la entrega completa con todos los puntos'}
          onChange={handleFeedbackChange}
        />
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.noteIconCircle}>
          <FileText size={18} color="#1f2937" />
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.btn} ${styles.btnDraft}`}>
            Guardar borrador
          </button>
          <button className={`${styles.btn} ${styles.btnSend}`}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
