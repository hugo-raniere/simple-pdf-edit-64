
import React, { useEffect } from 'react';
import { PDFEditorSimple } from '@/components/PDFEditorSimple';
import { usePDFContext } from '@/contexts/PDFContext';
import { useNavigate } from 'react-router-dom';

const Editor = () => {
  const { document } = usePDFContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!document) {
      navigate('/');
    }
  }, [document, navigate]);

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return <PDFEditorSimple />;
};

export default Editor;
