
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, PDFTextElement } from '@/types/pdf';

// Configurar worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFContextType {
  document: PDFDocument | null;
  isLoading: boolean;
  uploadPDF: (file: File) => Promise<void>;
  updateTextElement: (id: string, newText: string) => void;
  downloadPDF: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const usePDFContext = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDFContext must be used within a PDFProvider');
  }
  return context;
};

interface PDFProviderProps {
  children: ReactNode;
}

export const PDFProvider: React.FC<PDFProviderProps> = ({ children }) => {
  const [pdfDocument, setPdfDocument] = useState<PDFDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<PDFTextElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const uploadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    
    try {
      // Ler arquivo como ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Carregar PDF com pdf.js para extrair informações
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      // Extrair texto de todas as páginas (simulado por enquanto)
      const mockTextElements: PDFTextElement[] = [
        {
          id: '1',
          text: 'Documento de Exemplo',
          x: 100,
          y: 100,
          width: 200,
          height: 24,
          fontSize: 18,
          fontFamily: 'Inter',
          page: 1,
          isNew: false
        },
        {
          id: '2',
          text: 'Este é um texto editável no PDF.',
          x: 100,
          y: 150,
          width: 300,
          height: 16,
          fontSize: 14,
          fontFamily: 'Inter',
          page: 1,
          isNew: false
        },
        {
          id: '3',
          text: 'Clique em qualquer texto para editar.',
          x: 100,
          y: 180,
          width: 280,
          height: 16,
          fontSize: 14,
          fontFamily: 'Inter',
          page: 1,
          isNew: false
        },
        {
          id: '4',
          text: 'Data: 11/06/2025',
          x: 400,
          y: 100,
          width: 120,
          height: 16,
          fontSize: 12,
          fontFamily: 'Inter',
          page: 1,
          isNew: false
        }
      ];

      const newPdfDoc: PDFDocument = {
        file,
        name: file.name,
        pages: pdf.numPages,
        textElements: mockTextElements,
        pdfData: arrayBuffer
      };

      setPdfDocument(newPdfDoc);
      setHistory([mockTextElements]);
      setHistoryIndex(0);

      // Salvar no localStorage como backup
      localStorage.setItem('pdfDocument', JSON.stringify({
        name: newPdfDoc.name,
        pages: newPdfDoc.pages,
        textElements: newPdfDoc.textElements
      }));

    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTextElement = useCallback((id: string, newText: string) => {
    if (!pdfDocument) return;

    const newTextElements = pdfDocument.textElements.map(element =>
      element.id === id ? { ...element, text: newText } : element
    );

    const newDocument = { ...pdfDocument, textElements: newTextElements };
    setPdfDocument(newDocument);

    // Adicionar ao histórico
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTextElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [pdfDocument, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && pdfDocument) {
      const newIndex = historyIndex - 1;
      const newTextElements = history[newIndex];
      setPdfDocument({ ...pdfDocument, textElements: newTextElements });
      setHistoryIndex(newIndex);
    }
  }, [pdfDocument, history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && pdfDocument) {
      const newIndex = historyIndex + 1;
      const newTextElements = history[newIndex];
      setPdfDocument({ ...pdfDocument, textElements: newTextElements });
      setHistoryIndex(newIndex);
    }
  }, [pdfDocument, history, historyIndex]);

  const downloadPDF = useCallback(async () => {
    if (!pdfDocument) return;

    // Simula a geração do PDF modificado
    const blob = new Blob(['PDF modificado simulado'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = pdfDocument.name.replace('.pdf', '_editado.pdf');
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [pdfDocument]);

  const contextValue: PDFContextType = {
    document: pdfDocument,
    isLoading,
    uploadPDF,
    updateTextElement,
    downloadPDF,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };

  return (
    <PDFContext.Provider value={contextValue}>
      {children}
    </PDFContext.Provider>
  );
};
