
import React from 'react';
import { PDFComplete } from '@/components/PDFComplete';
import { usePDFEditor } from '@/hooks/usePDFEditor';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Complete = () => {
  const { document, downloadPDF } = usePDFEditor();
  const navigate = useNavigate();

  useEffect(() => {
    if (!document) {
      navigate('/');
    }
  }, [document, navigate]);

  if (!document) {
    return null;
  }

  const handleNewPDF = () => {
    navigate('/');
  };

  return (
    <PDFComplete
      fileName={document.name}
      onDownload={downloadPDF}
      onNewPDF={handleNewPDF}
    />
  );
};

export default Complete;
