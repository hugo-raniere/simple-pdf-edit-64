
import React from 'react';
import { PDFEditor } from '@/components/PDFEditor';
import { usePDFEditor } from '@/hooks/usePDFEditor';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Editor = () => {
  const {
    document,
    updateTextElement,
    downloadPDF,
    undo,
    redo,
    canUndo,
    canRedo
  } = usePDFEditor();
  const navigate = useNavigate();

  useEffect(() => {
    if (!document) {
      navigate('/');
    }
  }, [document, navigate]);

  if (!document) {
    return null;
  }

  const handleDownload = async () => {
    await downloadPDF();
    navigate('/complete');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <PDFEditor
      document={document}
      onUpdateText={updateTextElement}
      onDownload={handleDownload}
      onUndo={undo}
      onRedo={redo}
      onBack={handleBack}
      canUndo={canUndo}
      canRedo={canRedo}
    />
  );
};

export default Editor;
