
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
  const [pdfDocument, setPdfDocument] = useState<PDFDocument | null>(null);
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

    const newPdfDoc: PDFDocument = {
      file,
      name: file.name,
      pages: 1,
      textElements: mockTextElements
    };

    setPdfDocument(newPdfDoc);
    setHistory([mockTextElements]);
    setHistoryIndex(0);
    setIsLoading(false);
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
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfDocument.name.replace('.pdf', '_editado.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [pdfDocument]);

  return {
    document: pdfDocument,
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
