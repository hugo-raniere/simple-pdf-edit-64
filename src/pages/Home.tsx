
import React from 'react';
import { PDFUpload } from '@/components/PDFUpload';
import { usePDFContext } from '@/contexts/PDFContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { uploadPDF, isLoading } = usePDFContext();
  const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    try {
      await uploadPDF(file);
      navigate('/editor');
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  return <PDFUpload onUpload={handleUpload} isLoading={isLoading} />;
};

export default Home;
