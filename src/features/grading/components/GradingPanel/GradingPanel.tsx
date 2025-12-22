import React from 'react';
import { GradingControls } from './controls/GradingControls';
import { GradingEditor } from './editor/GradingEditor';
import { GradingActions } from './actions/GradingActions';
import AttachmentModal from './modals/AttachmentModal';
import { useAttachments } from '../../hooks/useAttachments';
import { useGradingForm } from '../../hooks/useGradingForm';
import styles from './GradingPanel.module.css';

export const GradingPanel: React.FC = () => {
  // 1. Hook de Adjuntos (UI State)
  const {
    attachedFiles,
    isAttachmentModalOpen,
    tempAttachedFiles,
    handleFileClick,
    handleAddFiles,
    handleRemoveFile,
    handleAcceptAttachments,
    closeAttachmentModal
  } = useAttachments();

  // 2. Hook de Formulario (Business Logic)
  const {
    tipoDevolucion,
    setTipoDevolucion,
    currentScore,
    currentFeedback,
    scaleValues,
    integrantes,
    esperandoCorreccion,
    handleFeedbackChange,
    handleScoreChange,
    handleSaveDraft,
    submitCorrection,
    isSubmitting
  } = useGradingForm(attachedFiles);

  if (!esperandoCorreccion) {
    return null;
  }

  return (
    <div className={styles.panelContainer}>
      <GradingControls
        currentScore={currentScore}
        onScoreChange={handleScoreChange}
        scaleValues={scaleValues}
        integrantes={integrantes}
        tipoDevolucion={tipoDevolucion}
        setTipoDevolucion={setTipoDevolucion}
      />

      <GradingEditor
        value={currentFeedback}
        onChange={handleFeedbackChange}
      />

      <GradingActions
        onSaveDraft={handleSaveDraft}
        onSend={submitCorrection}
        onFileClick={handleFileClick}
        attachedFilesCount={attachedFiles.length}
        isLoading={isSubmitting}
      />

      <AttachmentModal
        isOpen={isAttachmentModalOpen}
        onClose={closeAttachmentModal}
        attachedFiles={tempAttachedFiles}
        onAddFiles={handleAddFiles}
        onRemoveFile={handleRemoveFile}
        onAccept={handleAcceptAttachments}
      />
    </div>
  );
};
