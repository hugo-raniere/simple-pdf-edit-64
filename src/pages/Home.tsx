
import React from 'react';
import { PDFUpload } from '@/components/PDFUpload';
import { usePDFEditor } from '@/hooks/usePDFEditor';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { uploadPDF, isLoading } = usePDFEditor();
  const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    await uploadPDF(file);
    navigate('/editor');
  };

  return <PDFUpload onUpload={handleUpload} isLoading={isLoading} />;
};

export default Home;
