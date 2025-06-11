
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from '@/types/pdf';

// Configurar worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  document: PDFDocument;
  children: React.ReactNode;
  onPageRender: (pageNumber: number, canvas: HTMLCanvasElement) => void;
  scale: number;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  document,
  children,
  onPageRender,
  scale
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPDF = async () => {
      if (!document.pdfData) return;

      try {
        const pdf = await pdfjsLib.getDocument({ data: document.pdfData }).promise;
        setPdfDoc(pdf);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar PDF:', error);
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [document.pdfData]);

  const renderPage = useCallback(async (pageNumber: number) => {
    if (!pdfDoc) return;

    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      onPageRender(pageNumber, canvas);
    } catch (error) {
      console.error(`Erro ao renderizar página ${pageNumber}:`, error);
    }
  }, [pdfDoc, scale, onPageRender]);

  useEffect(() => {
    if (pdfDoc) {
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        renderPage(i);
      }
    }
  }, [pdfDoc, renderPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Carregando PDF...</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {children}
    </div>
  );
};
