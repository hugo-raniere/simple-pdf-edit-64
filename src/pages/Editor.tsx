
import React from 'react';
import { PDFEditorApp } from '@/components/PDFEditorApp';
import { usePDFEditor } from '@/hooks/usePDFEditor';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Editor = () => {
  const { document } = usePDFEditor();
  const navigate = useNavigate();

  useEffect(() => {
    if (!document) {
      navigate('/');
    }
  }, [document, navigate]);

  if (!document) {
    return null;
  }

  return <PDFEditorApp document={document} />;
};

export default Editor;
