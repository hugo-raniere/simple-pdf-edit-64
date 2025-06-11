
import { useState, useCallback, useRef } from 'react';
import { PDFDocument, PDFTextElement } from '@/types/pdf';

export const usePDFState = (initialDocument: PDFDocument) => {
  const [document, setDocument] = useState<PDFDocument>(initialDocument);
  const [history, setHistory] = useState<PDFTextElement[][]>([initialDocument.textElements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const nextId = useRef(1000);

  const saveToHistory = useCallback((elements: PDFTextElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setHasUnsavedChanges(true);
  }, [history, historyIndex]);

  const updateTextElement = useCallback((id: string, updates: Partial<PDFTextElement>) => {
    setDocument(prev => {
      const newElements = prev.textElements.map(element =>
        element.id === id ? { ...element, ...updates } : element
      );
      
      saveToHistory(newElements);
      
      return {
        ...prev,
        textElements: newElements
      };
    });
  }, [saveToHistory]);

  const addTextElement = useCallback((x: number, y: number, pageNumber: number) => {
    const newElement: PDFTextElement = {
      id: `new-${nextId.current++}`,
      text: 'Novo texto',
      x,
      y,
      width: 150,
      height: 24,
      fontSize: 14,
      fontFamily: 'Inter',
      page: pageNumber,
      isNew: true,
      color: '#000000'
    };

    setDocument(prev => {
      const newElements = [...prev.textElements, newElement];
      saveToHistory(newElements);
      
      return {
        ...prev,
        textElements: newElements
      };
    });

    return newElement.id;
  }, [saveToHistory]);

  const deleteTextElement = useCallback((id: string) => {
    setDocument(prev => {
      const newElements = prev.textElements.filter(element => element.id !== id);
      saveToHistory(newElements);
      
      return {
        ...prev,
        textElements: newElements
      };
    });
  }, [saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const elements = history[newIndex];
      
      setDocument(prev => ({
        ...prev,
        textElements: [...elements]
      }));
      
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const elements = history[newIndex];
      
      setDocument(prev => ({
        ...prev,
        textElements: [...elements]
      }));
      
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const saveChanges = useCallback(async () => {
    // Aqui seria a integração com Supabase
    console.log('Salvando alterações:', document.textElements);
    setHasUnsavedChanges(false);
    return Promise.resolve();
  }, [document.textElements]);

  return {
    document,
    updateTextElement,
    addTextElement,
    deleteTextElement,
    undo,
    redo,
    saveChanges,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    hasUnsavedChanges
  };
};
