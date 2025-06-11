
import { useState, useCallback } from 'react';

export interface PDFTextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  page: number;
}

export interface PDFDocument {
  file: File;
  name: string;
  pages: number;
  textElements: PDFTextElement[];
}

export const usePDFEditor = () => {
  const [document, setDocument] = useState<PDFDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [history, setHistory] = useState<PDFTextElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const uploadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    
    // Simula o processamento do PDF
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simula elementos de texto extraídos do PDF
    const mockTextElements: PDFTextElement[] = [
      {
        id: '1',
        text: 'Documento de Exemplo',
        x: 100,
        y: 100,
        width: 200,
        height: 24,
        fontSize: 18,
        fontFamily: 'Arial',
        page: 1
      },
      {
        id: '2',
        text: 'Este é um texto editável no PDF.',
        x: 100,
        y: 150,
        width: 300,
        height: 16,
        fontSize: 14,
        fontFamily: 'Arial',
        page: 1
      },
      {
        id: '3',
        text: 'Clique em qualquer texto para editar.',
        x: 100,
        y: 180,
        width: 280,
        height: 16,
        fontSize: 14,
        fontFamily: 'Arial',
        page: 1
      },
      {
        id: '4',
        text: 'Data: 11/06/2025',
        x: 400,
        y: 100,
        width: 120,
        height: 16,
        fontSize: 12,
        fontFamily: 'Arial',
        page: 1
      }
    ];

    const pdfDoc: PDFDocument = {
      file,
      name: file.name,
      pages: 1,
      textElements: mockTextElements
    };

    setDocument(pdfDoc);
    setHistory([mockTextElements]);
    setHistoryIndex(0);
    setIsLoading(false);
  }, []);

  const updateTextElement = useCallback((id: string, newText: string) => {
    if (!document) return;

    const newTextElements = document.textElements.map(element =>
      element.id === id ? { ...element, text: newText } : element
    );

    const newDocument = { ...document, textElements: newTextElements };
    setDocument(newDocument);

    // Adicionar ao histórico
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTextElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [document, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && document) {
      const newIndex = historyIndex - 1;
      const newTextElements = history[newIndex];
      setDocument({ ...document, textElements: newTextElements });
      setHistoryIndex(newIndex);
    }
  }, [document, history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && document) {
      const newIndex = historyIndex + 1;
      const newTextElements = history[newIndex];
      setDocument({ ...document, textElements: newTextElements });
      setHistoryIndex(newIndex);
    }
  }, [document, history, historyIndex]);

  const downloadPDF = useCallback(async () => {
    if (!document) return;

    // Simula a geração do PDF modificado
    const blob = new Blob(['PDF modificado simulado'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.name.replace('.pdf', '_editado.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [document]);

  return {
    document,
    isLoading,
    currentPage,
    setCurrentPage,
    uploadPDF,
    updateTextElement,
    undo,
    redo,
    downloadPDF,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};
