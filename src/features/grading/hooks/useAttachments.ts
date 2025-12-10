import { useState, useCallback } from 'react';

export const useAttachments = () => {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [tempAttachedFiles, setTempAttachedFiles] = useState<File[]>([]);

  const handleFileClick = useCallback(() => {
    setTempAttachedFiles(attachedFiles);
    setIsAttachmentModalOpen(true);
  }, [attachedFiles]);

  const handleAddFiles = useCallback((files: File[]) => {
    setTempAttachedFiles(prev => [...prev, ...files]);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setTempAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAcceptAttachments = useCallback(() => {
    setAttachedFiles(tempAttachedFiles);
    setIsAttachmentModalOpen(false);
  }, [tempAttachedFiles]);

  const closeAttachmentModal = useCallback(() => {
    setIsAttachmentModalOpen(false);
  }, []);

  return {
    attachedFiles,
    isAttachmentModalOpen,
    tempAttachedFiles,
    handleFileClick,
    handleAddFiles,
    handleRemoveFile,
    handleAcceptAttachments,
    closeAttachmentModal
  };
};
